"""
Script para listar los usuarios en la base de datos MongoDB.
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def list_users():
    # Configuración de conexión
    MONGODB_URL = "mongodb://localhost:27017"
    DB_NAME = "gemini_educacion"
    
    # Conectar a MongoDB
    client = AsyncIOMotorClient(MONGODB_URL)
    db = client[DB_NAME]
    
    try:
        # Listar colecciones
        collections = await db.list_collection_names()
        print(f"Colecciones en la base de datos {DB_NAME}: {collections}")
        
        # Si existe la colección de usuarios, listar los usuarios
        if "users" in collections:
            users = []
            async for user in db.users.find():
                # Convertir ObjectId a string para mostrarlo
                user["_id"] = str(user["_id"])
                users.append(user)
            
            print(f"\nUsuarios encontrados ({len(users)}):")
            for user in users:
                print(f"- ID: {user['_id']}, Username: {user.get('username', 'N/A')}, Email: {user.get('email', 'N/A')}, Rol: {user.get('role', 'N/A')}")
        else:
            print("La colección 'users' no existe en la base de datos.")
    
    except Exception as e:
        print(f"Error al listar usuarios: {str(e)}")
    finally:
        # Cerrar la conexión
        client.close()

if __name__ == "__main__":
    asyncio.run(list_users())
