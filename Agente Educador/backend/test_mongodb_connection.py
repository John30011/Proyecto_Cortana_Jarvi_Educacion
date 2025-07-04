"""
Script para probar la conexión a MongoDB.
"""
import os
import motor.motor_asyncio
from dotenv import load_dotenv
import asyncio

# Cargar variables de entorno
load_dotenv()

# Obtener la cadena de conexión de MongoDB
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/gemini")

async def test_connection():
    """Prueba la conexión a MongoDB."""
    try:
        # Crear cliente de MongoDB
        client = motor.motor_asyncio.AsyncIOMotorClient(MONGODB_URI)
        
        # Verificar la conexión
        await client.admin.command('ping')
        print("[OK] Conexión a MongoDB exitosa!")
        
        # Listar las bases de datos
        print("\n[INFO] Bases de datos disponibles:")
        databases = await client.list_database_names()
        for db_name in databases:
            print(f"- {db_name}")
            
            # Listar colecciones si es la base de datos de GEMINI
            if db_name == "gemini_educador":
                db = client[db_name]
                collections = await db.list_collection_names()
                print(f"  Colecciones en {db_name}:")
                for col in collections:
                    print(f"    - {col}")
        
        return True
        
    except Exception as e:
        print(f"[ERROR] Error al conectar a MongoDB: {str(e)}")
        return False
    finally:
        if 'client' in locals():
            client.close()

if __name__ == "__main__":
    print(f"[INFO] Intentando conectar a: {MONGODB_URI}")
    asyncio.run(test_connection())
