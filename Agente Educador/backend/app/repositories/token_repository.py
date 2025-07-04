"""
Repositorio para manejar tokens en la base de datos MongoDB.
"""
from datetime import datetime, timedelta
from typing import Optional

from motor.motor_asyncio import AsyncIOMotorCollection
from pymongo import IndexModel, ASCENDING

from app.models.token import TokenBlacklistInDB, TokenBlacklistCreate, Token
from app.models.user import User
from config import get_settings
from app.core.security import create_access_token
from app.db.mongodb import db

settings = get_settings()



class TokenRepository:
    """Clase para manejar operaciones de tokens en la base de datos"""

    def __init__(self, collection: AsyncIOMotorCollection):
        self.collection = collection
        
    @classmethod
    async def create(cls, collection):
        """Crea una nueva instancia del repositorio de tokens"""
        return cls(collection)

    @classmethod
    async def create_indexes(cls, db):
        """Crea los índices necesarios para la colección de tokens"""
        await db[settings.MONGO_TOKENS_COLLECTION].create_indexes([
            IndexModel([("token", ASCENDING)], unique=True),
            IndexModel([("expires_at", ASCENDING)], expireAfterSeconds=0),
            IndexModel([("user_id", ASCENDING)]),
            IndexModel([("token_type", ASCENDING)]),
        ])

    async def add_to_blacklist(
        self,
        token: str,
        user_id: str,
        expires_at: datetime,
        reason: str = None,
        token_type: str = "access"
    ) -> TokenBlacklistInDB:
        """
        Agrega un token a la lista negra

        Args:
            token: Token JWT a invalidar
            user_id: ID del usuario dueño del token
            expires_at: Fecha de expiración del token
            reason: Razón por la que se invalida el token
            token_type: Tipo de token ('access' o 'refresh')

        Returns:
            TokenBlacklistInDB: Token agregado a la lista negra
        """
        token_data = TokenBlacklistCreate(
            token=token,
            token_type=token_type,
            expires_at=expires_at,
            user_id=user_id,
            reason=reason
        )
        
        result = await self.collection.insert_one(token_data.dict(by_alias=True))
        return TokenBlacklistInDB(
            **{**token_data.dict(), "_id": str(result.inserted_id)}
        )

    async def is_token_revoked(self, token: str, token_type: str = "access") -> bool:
        """
        Verifica si un token está en la lista negra

        Args:
            token: Token JWT a verificar
            token_type: Tipo de token a verificar ('access' o 'refresh')

        Returns:
            bool: True si el token está revocado, False en caso contrario
        """
        # Buscar el token en la lista negra
        token_data = await self.collection.find_one({
            "token": token,
            "token_type": token_type
        })
        return token_data is not None
    
    async def revoke_all_user_tokens(
        self,
        user_id: str,
        reason: str = "logout_all"
    ) -> int:
        """
        Revoca todos los tokens de un usuario
        
        Args:
            user_id: ID del usuario
            reason: Razón de la revocación
            
        Returns:
            int: Número de tokens revocados
        """
        # Obtener tokens del usuario que aún no han expirado
        now = datetime.utcnow()
        result = await self.collection.update_many(
            {
                "user_id": user_id,
                "expires_at": {"$gt": now},
                "reason": {"$ne": reason}  # No actualizar si ya tiene esta razón
            },
            {"$set": {"reason": reason, "expires_at": now}}
        )
        return result.modified_count
    
    async def create_refresh_token(
        self,
        user: User,
        expires_delta: Optional[timedelta] = None
    ) -> Token:
        """
        Crea un nuevo token de refresco
        
        Args:
            user: Usuario para el que se genera el token
            expires_delta: Tiempo de expiración del token
            
        Returns:
            Token: Token de acceso y de refresco
        """
        # Configurar tiempo de expiración
        if expires_delta:
            expires_in = int(expires_delta.total_seconds())
        else:
            expires_in = settings.REFRESH_TOKEN_EXPIRE_MINUTES * 60
            
        # Crear token de acceso
        access_token = create_access_token(
            data={"sub": user.username},
            expires_delta=timedelta(seconds=expires_in)
        )
        
        # Crear token de refresco (más largo)
        refresh_expires_in = settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60  # días a segundos
        refresh_token = create_access_token(
            data={"sub": user.username, "type": "refresh"},
            expires_delta=timedelta(seconds=refresh_expires_in)
        )
        
        # Guardar el token de refresco en la base de datos
        await self.add_to_blacklist(
            token=refresh_token,
            user_id=str(user.id),
            expires_at=datetime.utcnow() + timedelta(seconds=refresh_expires_in),
            reason="active_refresh_token",
            token_type="refresh"
        )
        
        return Token(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
            expires_in=expires_in,
            user=user.dict()
        )

# Función para inyección de dependencias
async def get_token_repository() -> TokenRepository:
    """Obtiene una instancia del repositorio de tokens para inyección de dependencias"""
    collection = await db.get_collection(settings.MONGO_TOKENS_COLLECTION)
    return await TokenRepository.create(collection)
