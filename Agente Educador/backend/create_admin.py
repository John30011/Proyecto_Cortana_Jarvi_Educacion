"""
Script para crear un nuevo usuario administrador.
"""
from pymongo import MongoClient
from passlib.context import CryptContext
from datetime import datetime

# Configuración de hashing de contraseñas
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_admin_user(email: str, password: str):
    """Crea un nuevo usuario administrador."""
    try:
        # Conectar a MongoDB
        client = MongoClient("mongodb://localhost:27017/")
        db = client["gemini_educacion"]
        users = db["users"]
        
        # Verificar si el usuario ya existe
        if users.find_one({"email": email}):
            print(f"El usuario con email {email} ya existe.")
            return
        
        # Crear el usuario administrador
        user_data = {
            "email": email,
            "hashed_password": pwd_context.hash(password),
            "is_active": True,
            "is_superuser": True,
            "is_verified": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "first_name": "Admin",
            "last_name": "User",
            "role": "admin"
        }
        
        # Insertar el usuario en la base de datos
        result = users.insert_one(user_data)
        print(f"Usuario administrador creado exitosamente con ID: {result.inserted_id}")
        
    except Exception as e:
        print(f"Error al crear el usuario administrador: {e}")
    finally:
        if 'client' in locals():
            client.close()

if __name__ == "__main__":
    import getpass
    
    print("Creación de usuario administrador")
    print("-" * 30)
    email = input("Email: ")
    password = getpass.getpass("Contraseña: ")
    confirm_password = getpass.getpass("Confirmar contraseña: ")
    
    if password != confirm_password:
        print("Las contraseñas no coinciden.")
    else:
        create_admin_user(email, password)
