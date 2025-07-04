"""
Script para probar conexión directa a MongoDB Atlas sin SRV
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from urllib.parse import quote_plus

async def test_connection():
    print("\n=== Prueba de conexión directa a MongoDB Atlas ===")
    
    # Configuración
    username = "jonathanblanco15"
    password = "KamilaLuis2608*"
    
    # Codificar credenciales
    username_encoded = quote_plus(username)
    password_encoded = quote_plus(password)
    
    # Cadena de conexión directa (sin SRV)
    uri = (
        f"mongodb://{username_encoded}:{password_encoded}@"
        "ac-l1b2qcx-shard-00-00.l1b2qcx.mongodb.net:27017,"
        "ac-l1b2qcx-shard-00-01.l1b2qcx.mongodb.net:27017,"
        "ac-l1b2qcx-shard-00-02.l1b2qcx.mongodb.net:27017/"
        "?ssl=true&replicaSet=atlas-123abc-shard-0&authSource=admin&retryWrites=true&w=majority"
    )
    
    print(f"[INFO] Intentando conectar a MongoDB Atlas...")
    
    try:
        # Configurar el cliente con tiempo de espera extendido
        client = AsyncIOMotorClient(
            uri,
            serverSelectionTimeoutMS=10000,
            socketTimeoutMS=30000,
            connectTimeoutMS=10000
        )
        
        # Probar la conexión
        print("[INFO] Probando conexión...")
        await client.admin.command('ping')
        print("\n[ÉXITO] ¡Conexión exitosa a MongoDB Atlas!")
        
        # Mostrar información de la base de datos
        db = client["gemini_educador"]
        collections = await db.list_collection_names()
        print("\n[INFO] Colecciones en la base de datos:", collections)
        
    except Exception as e:
        print(f"\n[ERROR] Error al conectar a MongoDB: {e}")
        
        # Información adicional de depuración
        print("\n[DEBUG] Información de red:")
        try:
            import socket
            print(f"Hostname: {socket.gethostname()}")
            print(f"IP local: {socket.gethostbyname(socket.gethostname())}")
        except Exception as net_err:
            print(f"Error al obtener información de red: {net_err}")
    
    finally:
        if 'client' in locals():
            client.close()
            print("\n[INFO] Conexión cerrada.")

if __name__ == "__main__":
    asyncio.run(test_connection())
