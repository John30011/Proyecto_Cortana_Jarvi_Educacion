from pymongo import MongoClient
import sys

try:
    # Conectar a MongoDB
    client = MongoClient('mongodb://localhost:27017/')
    db = client['gemini_educador']
    
    # Verificar si la base de datos existe
    print("Bases de datos disponibles:", client.list_database_names())
    
    # Verificar si la colección de usuarios existe
    print("Colecciones en gemini_educador:", db.list_collection_names())
    
    # Contar usuarios
    users_count = db.users.count_documents({})
    print(f"Número de usuarios en la base de datos: {users_count}")
    
    # Mostrar información del usuario admin
    admin_user = db.users.find_one({"username": "admin"})
    if admin_user:
        print("\nInformación del usuario admin:")
        print(f"ID: {admin_user['_id']}")
        print(f"Usuario: {admin_user['username']}")
        print(f"Email: {admin_user.get('email', 'No especificado')}")
        print(f"Rol: {admin_user.get('role', 'No especificado')}")
        print(f"Está activo: {admin_user.get('is_active', False)}")
    else:
        print("\nNo se encontró el usuario administrador")
        
    client.close()
    
except Exception as e:
    print(f"Error al conectar a la base de datos: {str(e)}", file=sys.stderr)
    sys.exit(1)
