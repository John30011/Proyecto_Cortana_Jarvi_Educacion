"""
Módulo de autenticación y autorización
"""
from datetime import datetime, timedelta
from typing import Optional, Dict, Any, Union

from fastapi import Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from pydantic import ValidationError
from passlib.context import CryptContext
import uuid

from app.models.user import User, TokenData, UserInDB
from app.repositories.user_repository import UserRepository
from app.repositories.token_repository import TokenRepository
from config import settings

# Esquema OAuth2 para autenticación con token
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/auth/token",
    scheme_name="JWT"
)

# Algoritmo para la firma JWT
ALGORITHM = "HS256"

# Configuración de seguridad
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Configuración de seguridad JWT
SECRET_KEY = settings.SECRET_KEY
ACCESS_TOKEN_EXPIRE_MINUTES = settings.ACCESS_TOKEN_EXPIRE_MINUTES
REFRESH_TOKEN_EXPIRE_DAYS = settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60  # Convertir a segundos

# Función para verificar la contraseña
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

# Función para obtener el hash de una contraseña
def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

# Función para autenticar un usuario
async def authenticate_user(username: str, password: str) -> Optional[User]:
    user = await UserRepository.get_user_by_username(username)
    if not user or not verify_password(password, user.hashed_password):
        return None
    return user

# Función para crear un token de acceso
def create_access_token(
    data: dict, 
    expires_delta: Optional[timedelta] = None,
    token_type: str = "access"
) -> str:
    """
    Crea un token JWT
    
    Args:
        data: Datos a incluir en el token
        expires_delta: Tiempo de expiración del token
        token_type: Tipo de token ('access' o 'refresh')
        
    Returns:
        str: Token JWT firmado
    """
    to_encode = data.copy()
    now = datetime.utcnow()
    
    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    # Agregar claims estándar
    to_encode.update({
        "exp": expire,
        "iat": now,
        "type": token_type,
        "jti": str(uuid.uuid4())  # Identificador único del token
    })
    
    encoded_jwt = jwt.encode(
        to_encode, 
        SECRET_KEY, 
        algorithm=ALGORITHM
    )
    return encoded_jwt

async def get_token_repository() -> TokenRepository:
    """Obtiene una instancia del repositorio de tokens"""
    from app.db.mongodb import db
    database = await db.get_db()
    return TokenRepository(database[settings.MONGO_TOKENS_COLLECTION])

async def create_tokens(
    user: User,
    expires_delta: Optional[timedelta] = None
) -> Dict[str, Any]:
    """
    Crea tokens de acceso y actualización para un usuario
    
    Args:
        user: Usuario para el que se generan los tokens
        expires_delta: Tiempo de expiración del token de acceso
        
    Returns:
        dict: Diccionario con access_token, refresh_token y metadatos
    """
    # Crear token de acceso
    access_token_expires = expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username},
        expires_delta=access_token_expires,
        token_type="access"
    )
    
    # Crear token de actualización (más largo)
    refresh_token_expires = timedelta(seconds=REFRESH_TOKEN_EXPIRE_DAYS)
    refresh_token = create_access_token(
        data={"sub": user.username},
        expires_delta=refresh_token_expires,
        token_type="refresh"
    )
    
    # Guardar el token de actualización en la base de datos
    token_repo = await get_token_repository()
    await token_repo.add_to_blacklist(
        token=refresh_token,
        user_id=str(user.id),
        expires_at=datetime.utcnow() + refresh_token_expires,
        reason="active_refresh_token",
        token_type="refresh"
    )
    
    # Convertir el usuario a diccionario y asegurarse de que _id esté presente
    user_dict = user.dict(by_alias=True)
    if '_id' not in user_dict and hasattr(user, 'id'):
        user_dict['_id'] = str(user.id)
    
    # Asegurarse de que los campos requeridos estén presentes
    if 'created_at' not in user_dict:
        user_dict['created_at'] = datetime.utcnow().isoformat()
    if 'updated_at' not in user_dict:
        user_dict['updated_at'] = datetime.utcnow().isoformat()
    
    # Eliminar campos sensibles
    user_dict.pop('hashed_password', None)
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "expires_in": int(access_token_expires.total_seconds()),
        "user": user_dict
    }

async def refresh_access_token(
    refresh_token: str,
    token_repo: TokenRepository
) -> Dict[str, Any]:
    """
    Refresca un token de acceso usando un token de actualización
    
    Args:
        refresh_token: Token de actualización
        token_repo: Repositorio de tokens
        
    Returns:
        dict: Nuevo token de acceso y metadatos
        
    Raises:
        HTTPException: Si el token de actualización no es válido
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No se pudo validar el token de actualización",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        # Verificar el token
        payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        
        # Verificar que sea un token de actualización
        if payload.get("type") != "refresh":
            raise credentials_exception
            
        # Verificar que el token no esté en la lista negra
        is_revoked = await token_repo.is_token_revoked(refresh_token, "refresh")
        if is_revoked:
            raise credentials_exception
            
        # Obtener el usuario
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
            
        user = await UserRepository.get_user_by_username(username=username)
        if user is None:
            raise credentials_exception
            
        # Crear nuevo token de acceso
        return await create_tokens(user)
        
    except JWTError:
        raise credentials_exception

# Función para obtener el usuario actual basado en el token
async def get_current_user(
    token: str = Depends(oauth2_scheme),
    token_repo: TokenRepository = Depends(get_token_repository)
) -> User:
    """
    Obtiene el usuario actual a partir del token JWT
    
    Args:
        token: Token JWT del encabezado Authorization
        token_repo: Repositorio de tokens
        
    Returns:
        User: Usuario autenticado
        
    Raises:
        HTTPException: Si el token no es válido o el usuario no existe
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No se pudieron validar las credenciales",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        # Verificar el token
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        # Decodificar el token JWT
        payload = jwt.decode(
            token, 
            settings.SECRET_KEY, 
            algorithms=[settings.ALGORITHM]
        )
        
        # Obtener el nombre de usuario del payload
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
            
        # Crear objeto TokenData
        token_data = TokenData(username=username)
        
        # Obtener el usuario de la base de datos
        from app.repositories.user_repository import UserRepository
        user = await UserRepository.get_user_by_username(username=token_data.username)
        
        if user is None:
            raise credentials_exception
            
        return user
        
    except JWTError as e:
        raise credentials_exception from e

async def get_current_active_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """
    Verifica si el usuario actual está activo.
    
    Args:
        current_user: Usuario obtenido del token JWT
        
    Returns:
        User: Usuario si está activo
        
    Raises:
        HTTPException: Si el usuario está inactivo
    """
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Usuario inactivo")
    return current_user


def get_current_active_admin(
    current_user: User = Depends(get_current_active_user)
) -> User:
    """
    Verifica si el usuario actual es un administrador.
    
    Args:
        current_user: Usuario obtenido del token JWT
        
    Returns:
        User: Usuario si es administrador
        
    Raises:
        HTTPException: Si el usuario no es administrador
    """
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tiene permisos suficientes"
        )
    return current_user