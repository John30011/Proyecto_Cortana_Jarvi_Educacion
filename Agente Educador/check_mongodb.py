import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def check_mongodb():
    # Conectar a MongoDB
    client = AsyncIOMotorClient('mongodb://localhost:27017')
    
    try:
        # Verificar la conexión
        await client.admin.command('ping')
        print("[OK] Conexion exitosa a MongoDB")
        
        # Listar todas las bases de datos
        print("\nBases de datos:")
        dbs = await client.list_database_names()
        for db_name in dbs:
            print(f"- {db_name}")
            
            # Listar colecciones en cada base de datos
            db = client[db_name]
            collections = await db.list_collection_names()
            if collections:
                print(f"  Colecciones en {db_name}:")
                for collection in collections:
                    print(f"  - {collection}")
            else:
                print(f"  No hay colecciones en {db_name}")
            print()
            
    except Exception as e:
        print(f"[ERROR] Error al conectar a MongoDB: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(check_mongodb())
