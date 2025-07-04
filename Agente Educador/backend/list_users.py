"""
Script para listar los usuarios en la base de datos.
"""
import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

async def list_users():
    """Lista todos los usuarios en la base de datos."""
    try:
        # Configurar conexión a MongoDB
        mongo_url = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
        db_name = os.getenv("DB_NAME", "gemini_educacion")
        
        client = AsyncIOMotorClient(mongo_url)
        db = client[db_name]
        
        # Obtener la colección de usuarios
        users = db["users"]
        
        # Listar todos los usuarios
        cursor = users.find({}, {"email": 1, "is_active": 1, "is_superuser": 1, "is_verified": 1, "created_at": 1})
        
        print("\nUsuarios en la base de datos:")
        print("-" * 80)
        print(f"{'Email':<30} | {'Activo':<6} | {'Admin':<5} | {'Verificado':<9} | Creado el")
        print("-" * 80)
        
        count = 0
        async for user in cursor:
            count += 1
            print(f"{user.get('email', 'N/A'):<30} | "
                  f"{'Sí' if user.get('is_active', False) else 'No':<6} | "
                  f"{'Sí' if user.get('is_superuser', False) else 'No':<5} | "
                  f"{'Sí' if user.get('is_verified', False) else 'No':<9} | "
                  f"{user.get('created_at', 'N/A')}")
        
        print("-" * 80)
        print(f"Total de usuarios: {count}")
        
    except Exception as e:
        print(f"Error al listar usuarios: {e}")
    finally:
        if 'client' in locals():
            client.close()

if __name__ == "__main__":
    asyncio.run(list_users())
