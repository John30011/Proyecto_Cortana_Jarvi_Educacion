"""
Script simple para listar usuarios usando pymongo.
"""
from pymongo import MongoClient

try:
    # Conectar a MongoDB
    client = MongoClient("mongodb://localhost:27017/")
    db = client["gemini_educacion"]
    
    # Obtener la colección de usuarios
    users = db["users"]
    
    # Listar todos los usuarios
    print("\nUsuarios en la base de datos:")
    print("-" * 80)
    print(f"{'ID':<25} | {'Email':<30} | {'Activo':<6} | {'Admin':<5} | {'Verificado':<9} | Creado el")
    print("-" * 80)
    
    count = 0
    for user in users.find():
        count += 1
        print(f"{str(user.get('_id', 'N/A')):<25} | "
              f"{user.get('email', 'N/A'):<30} | "
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
