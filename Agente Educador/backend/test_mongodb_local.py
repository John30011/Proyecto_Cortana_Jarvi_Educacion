"""
Script para probar la conexión a MongoDB Local
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def test_local_connection():
    print("\n=== Probando conexión a MongoDB Local ===")
    
    # Configuración de conexión local
    MONGODB_URL = "mongodb://localhost:27017/"
    DB_NAME = "gemini_educador"
    
    try:
        print(f"[INFO] Conectando a: {MONGODB_URL}")
        
        # Crear cliente de MongoDB
        client = AsyncIOMotorClient(
            MONGODB_URL,
            serverSelectionTimeoutMS=5000  # 5 segundos de tiempo de espera
        )
        
        # Probar la conexión
        print("[INFO] Probando conexión...")
        await client.admin.command('ping')
        print("\n[ÉXITO] ¡Conexión exitosa a MongoDB Local!")
        
        # Obtener lista de bases de datos
        dbs = await client.list_database_names()
        print("\n[INFO] Bases de datos disponibles:", dbs)
        
        # Usar la base de datos del proyecto
        db = client[DB_NAME]
        
        # Crear una colección de prueba
        test_collection = db.test_connection
        
        # Insertar un documento de prueba
        result = await test_collection.insert_one({"test": "Conexión exitosa", "timestamp": "2025-06-28T01:10:00"})
        print(f"\n[INFO] Documento insertado con ID: {result.inserted_id}")
        
        # Contar documentos en la colección
        count = await test_collection.count_documents({})
        print(f"[INFO] Total de documentos en la colección de prueba: {count}")
        
        return True
        
    except Exception as e:
        print(f"\n[ERROR] Error al conectar a MongoDB Local: {e}")
        print("\nPosibles soluciones:")
        print("1. Asegúrate de que el servicio de MongoDB esté en ejecución")
        print("2. Verifica que MongoDB esté escuchando en el puerto 27017")
        print("3. Intenta reiniciar el servicio de MongoDB")
        return False
    finally:
        if 'client' in locals():
            client.close()
            print("\n[INFO] Conexión cerrada.")

if __name__ == "__main__":
    asyncio.run(test_local_connection())
