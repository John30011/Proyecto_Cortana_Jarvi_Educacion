"""
Script para probar la conexión a MongoDB.
"""
import asyncio
import os
import sys
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

# Configurar la codificación de salida para la consola de Windows
if sys.platform == "win32":
    import io
    import sys
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Cargar variables de entorno
load_dotenv()

async def test_connection():
    """Prueba la conexión a MongoDB."""
    try:
        # Obtener la URL de conexión desde las variables de entorno
        mongo_url = os.getenv("MONGODB_URL")
        db_name = os.getenv("DB_NAME", "gemini_educador")
        
        if not mongo_url:
            print("[ERROR] No se encontro la variable de entorno MONGODB_URL")
            return

        print("[INFO] Intentando conectar a MongoDB...")
        
        # Crear cliente de MongoDB
        client = AsyncIOMotorClient(
            mongo_url,
            serverSelectionTimeoutMS=5000,  # 5 segundos de timeout
            connectTimeoutMS=10000,        # 10 segundos de timeout de conexión
        )
        
        # Probar la conexión
        print("[INFO] Probando conexion...")
        await client.admin.command('ping')
        
        # Listar bases de datos
        print("\n[OK] Conexion exitosa a MongoDB!")
        print("Bases de datos disponibles:")
        
        databases = await client.list_database_names()
        for db in databases:
            print(f"   - {db}")
        
        # Verificar si la base de datos existe
        if db_name in databases:
            print(f"\n[OK] La base de datos '{db_name}' existe.")
            db = client[db_name]
            
            # Listar colecciones
            collections = await db.list_collection_names()
            print(f"\nColecciones en '{db_name}':")
            for collection in collections:
                print(f"   - {collection}")
        else:
            print(f"\n[INFO] La base de datos '{db_name}' no existe. Se creara cuando se inserte el primer documento.")
            
    except Exception as e:
        print(f"\n[ERROR] Error al conectar a MongoDB: {e}")
        print("\nPosibles soluciones:")
        print("1. Verifica que la URL de conexion sea correcta")
        print("2. Asegurate de que tu IP esta en la lista blanca de MongoDB Atlas")
        print("3. Verifica que tu usuario y contrasena sean correctos")
        print("4. Revisa que tu conexion a internet este funcionando")
    finally:
        if 'client' in locals():
            client.close()
            print("\n[INFO] Conexion cerrada.")

if __name__ == "__main__":
    asyncio.run(test_connection())
