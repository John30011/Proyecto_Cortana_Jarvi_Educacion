"""
Módulo para la conexión con MongoDB
"""
import sys
from pathlib import Path

from motor.motor_asyncio import AsyncIOMotorClient

# Asegurarse de que el directorio raíz esté en el path
root_dir = str(Path(__file__).resolve().parent.parent.parent)
if root_dir not in sys.path:
    sys.path.append(root_dir)

from config import settings

class MongoDB:
    """Clase para manejar la conexión con MongoDB"""
    _instance = None
    _client: AsyncIOMotorClient = None
    _db = None
    _initialized = False
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(MongoDB, cls).__new__(cls)
        return cls._instance
    
    @classmethod
    async def connect_db(cls):
        """Establece la conexión con MongoDB"""
        if cls._initialized and cls._client is not None:
            return True
            
        print(f"Conectando a MongoDB en {settings.MONGODB_URL}...")
        print(f"Usando base de datos: {settings.DB_NAME}")
        
        try:
            cls._client = AsyncIOMotorClient(settings.MONGODB_URL)
            # Verificar la conexión
            await cls._client.admin.command('ping')
            cls._db = cls._client[settings.DB_NAME]
            cls._initialized = True
            print("[OK] Conectado a MongoDB")
            return True
        except Exception as e:
            print(f"[ERROR] No se pudo conectar a MongoDB: {e}")
            print(f"URL de conexión: {settings.MONGODB_URL}")
            print(f"Base de datos: {settings.DB_NAME}")
            cls._initialized = False
            return False
    
    @classmethod
    async def close_db(cls):
        """Cierra la conexión con MongoDB"""
        if not cls._initialized or cls._client is None:
            print("[!] No hay conexión activa para cerrar")
            return
            
        try:
            # No es necesario esperar close() ya que es síncrono en motor
            cls._client.close()
            print("[X] Desconectado de MongoDB")
        except Exception as e:
            print(f"[ERROR] Error al cerrar la conexión con MongoDB: {e}")
        finally:
            cls._client = None
            cls._db = None
            cls._initialized = False
    
    @classmethod
    async def get_db(cls):
        """Obtiene la instancia de la base de datos"""
        if not cls._initialized or cls._db is None:
            connected = await cls.connect_db()
            if not connected:
                raise RuntimeError("No se pudo conectar a la base de datos")
        return cls._db
    
    @classmethod
    async def get_collection(cls, collection_name: str):
        """Obtiene una colección de la base de datos"""
        db = await cls.get_db()
        return db[collection_name]

# Instancia global
db = MongoDB()
