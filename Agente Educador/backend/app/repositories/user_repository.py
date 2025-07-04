"""
Repositorio para operaciones de base de datos relacionadas con usuarios
"""
import logging
from datetime import datetime
from typing import Optional

from bson import ObjectId

from app.core.security import get_password_hash, verify_password
from app.db.mongodb import db
from app.models.user import UserCreate, UserInDB, UserUpdate

# Configurar logger
logger = logging.getLogger(__name__)

class UserRepository:
    """Repositorio para operaciones de usuarios"""
    
    COLLECTION_NAME = "users"
    
    @classmethod
    async def get_collection(cls):
        """Obtiene la colección de usuarios"""
        collection = await db.get_collection(cls.COLLECTION_NAME)
        if collection is None:
            raise RuntimeError("No se pudo obtener la colección de usuarios")
        return collection
    
    @classmethod
    async def create_user(cls, user: UserCreate) -> UserInDB:
        """Crea un nuevo usuario"""
        try:
            collection = await cls.get_collection()
            
            # Verificar si el usuario ya existe
            existing_user = await collection.find_one({"$or": [
                {"username": user.username.lower()},
                {"email": user.email.lower()}
            ]})
            
            if existing_user:
                if existing_user.get("username", "").lower() == user.username.lower():
                    error_msg = f"El nombre de usuario '{user.username}' ya está en uso"
                    logger.error(error_msg)
                    raise ValueError(error_msg)
                if existing_user.get("email", "").lower() == user.email.lower():
                    error_msg = f"El correo electrónico '{user.email}' ya está registrado"
                    logger.error(error_msg)
                    raise ValueError(error_msg)
            
            # Crear el documento del usuario
            user_dict = user.dict(exclude={"password"})
            user_dict["username"] = user_dict["username"].lower()
            user_dict["email"] = user_dict["email"].lower()
            user_dict["hashed_password"] = get_password_hash(user.password)
            user_dict["created_at"] = datetime.utcnow()
            user_dict["updated_at"] = user_dict["created_at"]
            
            # Insertar en la base de datos
            result = await collection.insert_one(user_dict)
            
            if not result.acknowledged:
                error_msg = "Error al insertar el usuario en la base de datos"
                logger.error(error_msg)
                raise RuntimeError(error_msg)
            
            # Obtener el usuario creado
            created_user = await collection.find_one({"_id": result.inserted_id})
            if not created_user:
                error_msg = "No se pudo recuperar el usuario recién creado"
                logger.error(error_msg)
                raise RuntimeError(error_msg)
                
            # Convertir ObjectId a cadena
            created_user["_id"] = str(created_user["_id"])
            
            # Validar que el usuario cumple con el modelo UserInDB
            try:
                user_in_db = UserInDB(**created_user)
                logger.info(f"Usuario {user_in_db.username} creado exitosamente con ID: {user_in_db.id}")
                return user_in_db
            except Exception as e:
                error_msg = f"Error al validar el usuario creado: {str(e)}"
                logger.error(error_msg)
                # Asegurarse de que el mensaje de error sea serializable
                raise ValueError(str(e)) from e
                
        except Exception as e:
            error_msg = f"Error en create_user: {str(e)}"
            logger.error(error_msg)
            logger.error(f"Tipo de error: {type(e).__name__}")
            import traceback
            logger.error(f"Traceback: {traceback.format_exc()}")
            
            # Re-raise con un mensaje más amigable y serializable
            if isinstance(e, (ValueError, RuntimeError)):
                # Asegurarse de que el mensaje de error sea una cadena
                error_message = str(e)
                if isinstance(e, ValueError):
                    raise ValueError(error_message) from None
                else:
                    raise RuntimeError(error_message) from None
            raise RuntimeError("Error al crear el usuario") from None

    @classmethod
    async def get_user_by_id(cls, user_id: str) -> Optional[UserInDB]:
        """Obtiene un usuario por su ID"""
        if not ObjectId.is_valid(user_id):
            return None
            
        collection = await cls.get_collection()
        user = await collection.find_one({"_id": ObjectId(user_id)})
        if user:
            # Convertir ObjectId a cadena
            user["_id"] = str(user["_id"])
            return UserInDB(**user)
        return None
    
    @classmethod
    async def get_user_by_username(cls, username: str) -> Optional[UserInDB]:
        """Obtiene un usuario por su nombre de usuario"""
        collection = await cls.get_collection()
        user = await collection.find_one({"username": username.lower()})
        if user:
            # Convertir ObjectId a cadena
            user["_id"] = str(user["_id"])
            return UserInDB(**user)
        return None
    
    @classmethod
    async def get_user_by_email(cls, email: str) -> Optional[UserInDB]:
        """Obtiene un usuario por su correo electrónico"""
        collection = await cls.get_collection()
        user = await collection.find_one({"email": email.lower()})
        if user:
            # Convertir ObjectId a cadena
            user["_id"] = str(user["_id"])
            return UserInDB(**user)
        return None
    
    @classmethod
    async def update_user(
        cls, 
        user_id: str, 
        user_update: UserUpdate,
        current_user: UserInDB
    ) -> Optional[UserInDB]:
        """Actualiza un usuario existente"""
        # Verificar que el usuario existe y tiene permisos
        if not ObjectId.is_valid(user_id):
            return None
            
        collection = await cls.get_collection()
        user = await collection.find_one({"_id": ObjectId(user_id)})
        
        if not user:
            return None
            
        # Verificar que el usuario actual es el propietario o es admin
        if str(user["_id"]) != current_user.id and current_user.role != "admin":
            raise ValueError("No tienes permiso para actualizar este usuario")
            
        # Preparar los datos a actualizar
        update_data = user_update.dict(exclude_unset=True)
        
        # Si se está actualizando la contraseña, hashearla
        if "password" in update_data:
            update_data["hashed_password"] = get_password_hash(update_data.pop("password"))
            
        # Actualizar la fecha de modificación
        update_data["updated_at"] = datetime.utcnow()
        
        # Realizar la actualización
        result = await collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": update_data}
        )
        
        if result.modified_count == 0:
            return None
            
        # Obtener el usuario actualizado
        updated_user = await collection.find_one({"_id": ObjectId(user_id)})
        if updated_user:
            # Convertir ObjectId a cadena
            updated_user["_id"] = str(updated_user["_id"])
            return UserInDB(**updated_user)
        return None

    @classmethod
    async def delete_user(cls, user_id: str) -> bool:
        """Elimina un usuario por su ID"""
        if not ObjectId.is_valid(user_id):
            return False
            
        collection = await cls.get_collection()
        result = await collection.delete_one({"_id": ObjectId(user_id)})
        return result.deleted_count > 0
    
    @classmethod
    async def authenticate_user(cls, username: str, password: str) -> Optional[UserInDB]:
        """Autentica a un usuario con nombre de usuario y contraseña"""
        user = await cls.get_user_by_username(username)
        if not user:
            return None
            
        if not verify_password(password, user.hashed_password):
            return None
            
        return user
    
    @classmethod
    async def update_last_login(cls, user_id: str) -> None:
        """Actualiza la fecha del último inicio de sesión"""
        if not ObjectId.is_valid(user_id):
            return
            
        collection = await cls.get_collection()
        await collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"last_login": datetime.utcnow()}}
        )

# Función para obtener una instancia del repositorio de usuarios
async def get_user_repository() -> UserRepository:
    """
    Obtiene una instancia del repositorio de usuarios.
    
    Esta función se utiliza como dependencia en FastAPI para inyectar el repositorio.
    
    Returns:
        UserRepository: Una instancia del repositorio de usuarios
    """
    return UserRepository()
