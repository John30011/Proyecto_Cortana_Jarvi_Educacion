from pymongo import MongoClient
from passlib.context import CryptContext
import sys

# Configurar el contexto de hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def update_admin_password():
    try:
        # Conectar a MongoDB
        client = MongoClient('mongodb://localhost:27017/')
        db = client['gemini_educador']
        users_collection = db['users']
        
        # Buscar el usuario administrador
        admin_user = users_collection.find_one({"username": "admin"})
        if not admin_user:
            print("Error: No se encontró el usuario administrador")
            return False
        
        # Generar un nuevo hash para la contraseña "Admin123!"
        password = "Admin123!"
        hashed_password = pwd_context.hash(password)
        
        # Actualizar la contraseña en la base de datos
        result = users_collection.update_one(
            {"_id": admin_user["_id"]},
            {"$set": {"hashed_password": hashed_password}}
        )
        
        if result.modified_count == 1:
            print(f"Contraseña actualizada correctamente para el usuario administrador")
            print(f"Nuevo hash: {hashed_password}")
            return True
        else:
            print("Error: No se pudo actualizar la contraseña")
            return False
            
    except Exception as e:
        print(f"Error al actualizar la contraseña: {str(e)}")
        return False

if __name__ == "__main__":
    if update_admin_password():
        sys.exit(0)
    else:
        sys.exit(1)
