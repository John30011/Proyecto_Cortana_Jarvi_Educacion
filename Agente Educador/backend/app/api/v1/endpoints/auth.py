"""
Rutas de autenticación para la API de GEMINI.

Este módulo proporciona endpoints para el registro, inicio de sesión, 
cierre de sesión y gestión de tokens de acceso.
"""
from datetime import datetime
import logging
import traceback
from typing import Any, Dict

from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from jose import JWTError, jwt
from app.core.security import verify_password

from app.core.auth import (
    get_current_active_user,
    oauth2_scheme,
    create_tokens,
    refresh_access_token
)
from app.models.user import UserResponse, Token, User, UserCreate
from app.repositories.user_repository import UserRepository, get_user_repository
from app.repositories.token_repository import TokenRepository, get_token_repository
from config import settings

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["auth"])

# Esquema para el endpoint de refresco de token
refresh_scheme = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/auth/refresh-token",
    scheme_name="JWT-Refresh"
)

@router.post(
    "/register", 
    response_model=UserResponse, 
    status_code=status.HTTP_201_CREATED,
    summary="Registrar un nuevo usuario",
    description="Crea una nueva cuenta de usuario con los datos proporcionados.",
    response_description="Datos del usuario registrado"
)
async def register_user(
    request: Request,
    user_in: UserCreate,
    user_repo: UserRepository = Depends(get_user_repository)
) -> Dict[str, Any]:
    """
    Registra un nuevo usuario en el sistema.
    
    ### Parámetros:
    - **username**: Nombre de usuario único
    - **email**: Correo electrónico del usuario
    - **password**: Contraseña segura
    - **full_name**: Nombre completo del usuario
    - **age_group**: Grupo de edad (3-5, 6-8, 9-12)
    - **role**: Rol del usuario (user, parent, admin, teacher)
    
    ### Respuestas:
    - 201: Usuario registrado exitosamente
    - 400: Datos de entrada inválidos
    - 409: El nombre de usuario o correo ya está en uso
    - 500: Error interno del servidor
    """
    try:
        logger.info(f"Iniciando registro de usuario: {user_in.username}")
        
        # Validar los datos de entrada
        try:
            # Esto validará automáticamente los datos con Pydantic
            user_data = user_in.dict()
            logger.debug(f"Datos del usuario validados: {user_data}")
        except ValueError as ve:
            logger.error(f"Error de validación en los datos de entrada: {str(ve)}")
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Datos de entrada inválidos: {str(ve)}"
            )
        
        # Verificar si el usuario ya existe
        logger.info("Verificando si el nombre de usuario ya existe...")
        db_user = await user_repo.get_user_by_username(user_in.username)
        if db_user:
            logger.warning(f"El nombre de usuario {user_in.username} ya está registrado")
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="El nombre de usuario ya está registrado"
            )
            
        # Verificar si el correo ya está en uso
        logger.info("Verificando si el correo electrónico ya existe...")
        db_user = await user_repo.get_user_by_email(user_in.email)
        if db_user:
            logger.warning(f"El correo electrónico {user_in.email} ya está registrado")
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="El correo electrónico ya está registrado"
            )
        
        # Crear el usuario
        logger.info("Creando el usuario en la base de datos...")
        try:
            user = await user_repo.create_user(user_in)
            logger.info(f"Usuario {user.username} creado exitosamente con ID: {user.id if hasattr(user, 'id') else 'N/A'}")
            
            # No devolver la contraseña
            user_dict = user.dict(by_alias=True)  # Usar by_alias para incluir _id
            user_dict.pop("hashed_password", None)
            
            # Asegurarse de que el ID esté presente como _id
            if "id" in user_dict and "_id" not in user_dict:
                user_dict["_id"] = user_dict["id"]
            
            logger.info(f"Registro completado para el usuario: {user_in.username}")
            return user_dict
            
        except ValueError as ve:
            logger.error(f"Error de validación al crear el usuario: {str(ve)}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Error al crear el usuario: {str(ve)}"
            )
            
        except Exception as e:
            logger.error(f"Error inesperado al crear el usuario: {str(e)}")
            logger.error(f"Tipo de error: {type(e).__name__}")
            logger.error(f"Traceback: {traceback.format_exc()}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail={
                    "message": "Ocurrió un error al crear el usuario",
                    "error": str(e),
                    "error_type": type(e).__name__
                }
            )
        
    except HTTPException as he:
        # Re-lanzar las excepciones HTTP que ya manejamos
        logger.error(f"Error de HTTP durante el registro: {str(he)}")
        raise he
        
    except Exception as e:
        # Capturar cualquier otro error inesperado
        logger.error(f"Error inesperado durante el registro: {str(e)}")
        logger.error(f"Tipo de error: {type(e).__name__}")
        
        # Obtener ID de solicitud para seguimiento
        error_id = getattr(request.state, "request_id", "unknown")
        logger.error(f"Error ID: {error_id}")
        
        # Registrar el traceback completo en el log
        import traceback
        logger.error(f"Traceback: {traceback.format_exc()}")
        
        # Si es un error de validación de Pydantic, devolver más detalles
        if hasattr(e, 'errors') and isinstance(e.errors, list):
            errors = [{"field": err["loc"][-1], "msg": err["msg"]} for err in e.errors]
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail={"message": "Error de validación", "errors": errors}
            )
            
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "message": "Ocurrió un error inesperado al procesar la solicitud",
                "error": str(e),
                "error_type": type(e).__name__,
                "error_id": error_id
            },
            headers={"X-Error-ID": error_id}
        )

@router.post(
    "/token", 
    response_model=Token,
    summary="Obtener token de acceso",
    description="Autentica un usuario y devuelve tokens JWT para acceder a los endpoints protegidos.",
    response_description="Tokens de acceso/actualización y datos del usuario"
)
async def login_for_access_token(
    request: Request,
    response: Response,
    form_data: OAuth2PasswordRequestForm = Depends()
) -> Dict[str, Any]:
    """
    Inicia sesión y obtiene tokens de acceso y actualización.
    
    ### Parámetros:
    - **username**: Nombre de usuario o correo electrónico
    - **password**: Contraseña del usuario
    
    ### Respuestas:
    - 200: Inicio de sesión exitoso, devuelve los tokens
    - 400: Usuario inactivo o datos inválidos
    - 401: Credenciales incorrectas
    - 500: Error interno del servidor
    
    ### Uso del token:
    Incluir el token en el encabezado de autorización:
    ```
    Authorization: Bearer <access_token>
    ```
    
    Para refrescar el token, usar el endpoint `/auth/refresh-token` con el `refresh_token`.
    """
    try:
        # Obtener la dirección IP del cliente
        client_ip = request.client.host if request.client else "unknown"
        logger.info(f"Iniciando autenticación para usuario: {form_data.username} desde IP: {client_ip}")
        
        # Obtener el repositorio de usuarios
        logger.info("Obteniendo repositorio de usuarios...")
        
        # Verificar si el usuario existe por nombre de usuario o correo electrónico
        user_repo = await UserRepository.get_user_repository()
        user = await user_repo.get_user_by_username(form_data.username)
        if not user:
            user = await user_repo.get_user_by_email(form_data.username)
            
        if not user or not verify_password(form_data.password, user.hashed_password):
            logger.warning(f"Intento de inicio de sesión fallido para el usuario: {form_data.username}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Nombre de usuario o contraseña incorrectos",
                headers={"WWW-Authenticate": "Bearer"},
            )
            
        # Verificar si el usuario está activo
        if not user.is_active:
            logger.warning(f"Intento de inicio de sesión para usuario inactivo: {user.username}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Usuario inactivo"
            )
            
        # Actualizar la última vez que el usuario inició sesión
        await user_repo.update_last_login(str(user.id))
        
        # Crear tokens de acceso y actualización
        tokens = await create_tokens(user)
        
        # Configurar cookies seguras
        secure = settings.ENVIRONMENT != "development"
        
        # Establecer cookies HTTP-only
        response.set_cookie(
            key="access_token",
            value=f"Bearer {tokens['access_token']}",
            httponly=True,
            secure=secure,
            samesite="lax",
            max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60  # segundos
        )
        
        response.set_cookie(
            key="refresh_token",
            value=tokens['refresh_token'],
            httponly=True,
            secure=secure,
            samesite="lax",
            max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60  # segundos
        )
        
        # Registrar inicio de sesión exitoso
        logger.info(f"Inicio de sesión exitoso para el usuario {user.username} desde {client_ip}")
        
        # Convertir el objeto de usuario a diccionario
        user_dict = user.dict(by_alias=True)
        
        # Asegurarse de que el campo _id esté presente
        if '_id' not in user_dict and hasattr(user, 'id'):
            user_dict['_id'] = str(user.id)
        
        # Asegurarse de que los campos requeridos estén presentes
        if 'created_at' not in user_dict:
            user_dict['created_at'] = datetime.utcnow().isoformat()
        if 'updated_at' not in user_dict:
            user_dict['updated_at'] = datetime.utcnow().isoformat()
        
        # Crear la respuesta manualmente
        return {
            "access_token": tokens["access_token"],
            "refresh_token": tokens["refresh_token"],
            "token_type": "bearer",
            "expires_in": tokens["expires_in"],
            "user": user_dict
        }
        
    except HTTPException as he:
        # Re-lanzar las excepciones HTTP
        raise he
    except Exception as e:
        # Log del error para depuración
        logger.error(f"Error durante el inicio de sesión: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Ocurrió un error al procesar la solicitud de inicio de sesión"
        )

@router.get(
    "/me", 
    response_model=UserResponse,
    summary="Obtener información del usuario actual",
    description="Devuelve la información del usuario autenticado actualmente.",
    response_description="Datos del usuario autenticado"
)
async def read_users_me(
    current_user: User = Depends(get_current_active_user)
) -> UserResponse:
    """
    Obtiene la información del usuario actualmente autenticado.
    
    ### Requisitos:
    - Token de autenticación en el encabezado `Authorization: Bearer <token>`
    
    ### Respuestas:
    - 200: Información del usuario
    - 401: No autenticado o token inválido
    """
    try:
        return current_user
    except Exception as e:
        logger.error(f"Error al obtener información del usuario: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al obtener la información del usuario"
        )


@router.post(
    "/logout",
    status_code=status.HTTP_200_OK,
    summary="Cerrar sesión",
    description="Invalida el token de acceso actual y cierra la sesión del usuario.",
    response_description="Mensaje de confirmación"
)
async def logout(
    response: Response,
    current_user: User = Depends(get_current_active_user),
    token: str = Depends(oauth2_scheme),
    token_repo: TokenRepository = Depends(get_token_repository)
) -> Dict[str, str]:
    """
    Cierra la sesión del usuario actual y revoca el token de acceso.
    
    ### Requisitos:
    - Token de autenticación en el encabezado `Authorization: Bearer <token>`
    
    ### Respuestas:
    - 200: Sesión cerrada exitosamente
    - 401: No autenticado o token inválido
    - 500: Error interno del servidor
    """
    try:
        # Obtener la fecha de expiración del token
        try:
            payload = jwt.decode(
                token,
                settings.SECRET_KEY,
                algorithms=[settings.ALGORITHM]
            )
            expire_timestamp = payload.get("exp")
            if expire_timestamp:
                expire_datetime = datetime.fromtimestamp(expire_timestamp)
                # Agregar el token a la lista negra
                await token_repo.add_to_blacklist(
                    token=token,
                    user_id=str(current_user.id),
                    expires_at=expire_datetime,
                    reason="logout",
                    token_type="access"
                )
                
                # Registrar el cierre de sesión
                logger.info(f"Cierre de sesión exitoso para el usuario {current_user.username}")
        except JWTError:
            # Si el token no es válido, no es necesario hacer nada
            pass
        
        # Limpiar las cookies de autenticación
        response.delete_cookie("access_token")
        response.delete_cookie("refresh_token")
        
        return {"message": "Sesión cerrada exitosamente"}
        
    except Exception as e:
        logger.error(f"Error al cerrar sesión: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Ocurrió un error al cerrar la sesión"
        )

@router.post(
    "/refresh-token",
    response_model=Dict[str, Any],
    status_code=status.HTTP_200_OK,
    summary="Refrescar token de acceso",
    description="Obtiene un nuevo token de acceso usando un token de actualización.",
    response_description="Nuevo token de acceso y token de actualización"
)
async def refresh_token(
    request: Request,
    response: Response,
    token_repo: TokenRepository = Depends(get_token_repository)
) -> Dict[str, Any]:
    """
    Refresca el token de acceso usando un token de actualización.
    
    El token de actualización debe enviarse en el encabezado 'Authorization: Bearer <refresh_token>'.
    
    ### Requisitos:
    - Token de actualización en el encabezado `Authorization: Bearer <refresh_token>`
    
    ### Respuestas:
    - 200: Nuevo token generado exitosamente
    - 401: Token de actualización inválido o expirado
    - 500: Error interno del servidor
    """
    try:
        # Obtener el token del encabezado
        authorization = request.headers.get("Authorization")
        if not authorization or not authorization.startswith("Bearer "):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Se requiere un token de actualización válido",
                headers={"WWW-Authenticate": "Bearer"},
            )
            
        refresh_token = authorization.split(" ")[1]
        
        # Verificar y refrescar el token
        tokens = await refresh_access_token(refresh_token, token_repo)
        
        # Configurar cookies seguras
        secure = settings.ENVIRONMENT == "production"
        
        # Establecer cookies HTTP-only
        response.set_cookie(
            key="access_token",
            value=f"Bearer {tokens['access_token']}",
            httponly=True,
            secure=secure,
            samesite="lax",
            max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60  # segundos
        )
        
        response.set_cookie(
            key="refresh_token",
            value=tokens['refresh_token'],
            httponly=True,
            secure=secure,
            samesite="lax",
            max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60  # segundos
        )
        
        return {
            "access_token": tokens["access_token"],
            "token_type": "bearer",
            "expires_in": tokens["expires_in"],
            "user": tokens["user"]
        }
        
    except HTTPException as he:
        raise he
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token de actualización inválido o expirado",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except Exception as e:
        logger.error(f"Error al refrescar el token: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Ocurrió un error al refrescar el token"
        )
