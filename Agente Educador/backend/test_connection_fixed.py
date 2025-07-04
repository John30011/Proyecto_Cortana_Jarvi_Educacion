"""
Script para probar la conexión a MongoDB Atlas con configuración mejorada
"""
import os
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

async def test_connection():
    print("\n[INFO] Probando conexión a MongoDB Atlas...")
    
    # Configuración de conexión
    username = "Jonathan Alex's Org - 2025-06-28"
    password = "KamilaLuis2608*-"
    
    # Codificar credenciales para URL
    from urllib.parse import quote_plus
    username_encoded = quote_plus(username)
    password_encoded = quote_plus(password)
    
    # Intentar conectar
    try:
        # Conexión directa con la IP proporcionada
        uri = f"mongodb+srv://{username_encoded}:{password_encoded}@cluster0.l1b2qcx.mongodb.net/"
        
        print(f"[INFO] Conectando a: {uri.split('@')[0]}*****@{uri.split('@')[1]}")
        
        # Configurar tiempo de espera más largo
        client = AsyncIOMotorClient(
            uri,
            serverSelectionTimeoutMS=10000,  # 10 segundos
            socketTimeoutMS=45000,           # 45 segundos
            connectTimeoutMS=10000           # 10 segundos
        )
        
        # Probar la conexión
        print("[INFO] Probando conexión...")
        await client.admin.command('ping')
        print("\n[ÉXITO] ¡Conexión exitosa a MongoDB Atlas!")
        
        # Mostrar información de la base de datos
        db = client.get_database("gemini_educador")
        collections = await db.list_collection_names()
        print("\n[INFO] Colecciones en la base de datos:", collections)
        
        return True
        
    except Exception as e:
        print(f"\n[ERROR] Error al conectar a MongoDB: {e}")
        return False
    finally:
        if 'client' in locals():
            client.close()
            print("\n[INFO] Conexión cerrada.")

if __name__ == "__main__":
    print("\n=== Prueba de conexión a MongoDB Atlas ===")
    print("Asegúrate de que la IP 156.146.59.41/32 esté en la lista blanca de MongoDB Atlas\n")
    
    # Ejecutar la prueba de conexión
    asyncio.run(test_connection())
