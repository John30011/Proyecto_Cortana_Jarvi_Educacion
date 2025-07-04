"""
Script para probar la conexión a MongoDB
"""
import asyncio
import motor.motor_asyncio
import os
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

# Configuración de conexión
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "gemini_educacion")

async def test_connection():
    """Prueba la conexión a MongoDB"""
    print(f"Intentando conectar a MongoDB en: {MONGODB_URL}")
    print(f"Usando base de datos: {DB_NAME}")
    
    try:
        # Crear el cliente de MongoDB
        client = motor.motor_asyncio.AsyncIOMotorClient(MONGODB_URL)
        
        # Verificar la conexión con un comando ping
        print("Enviando comando ping a MongoDB...")
        await client.admin.command('ping')
        print("[SUCCESS] Conexion exitosa a MongoDB")
        
        # Listar las bases de datos disponibles
        print("\nBases de datos disponibles:")
        dbs = await client.list_database_names()
        for db_name in dbs:
            print(f"- {db_name}")
        
        # Verificar si la base de datos existe
        if DB_NAME in dbs:
            print(f"\n[SUCCESS] La base de datos '{DB_NAME}' existe")
            db = client[DB_NAME]
            
            # Listar las colecciones
            print("\nColecciones en la base de datos:")
            collections = await db.list_collection_names()
            for collection in collections:
                print(f"- {collection}")
        else:
            print(f"\n[WARNING] La base de datos '{DB_NAME}' no existe")
            print("Se creará automáticamente cuando se inserte el primer documento.")
        
    except Exception as e:
        print(f"\n[ERROR] Error al conectar a MongoDB: {e}")
        print("Posibles causas:")
        print("1. MongoDB no está en ejecución")
        print("2. La URL de conexión es incorrecta")
        print("3. Hay un problema de red")
        print("4. Las credenciales son incorrectas")
        print(f"\nURL utilizada: {MONGODB_URL}")
    finally:
        if 'client' in locals():
            client.close()
        print("\nPrueba de conexión finalizada")

if __name__ == "__main__":
    asyncio.run(test_connection())
