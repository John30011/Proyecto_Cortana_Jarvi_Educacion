"""
Script para depurar problemas de autenticación
"""
import sys
import os
from pathlib import Path

# Asegurarse de que el directorio raíz esté en el path
root_dir = str(Path(__file__).resolve().parent)
if root_dir not in sys.path:
    sys.path.append(root_dir)

from passlib.context import CryptContext
from dotenv import load_dotenv
import pymongo
import bcrypt

# Cargar variables de entorno
load_dotenv()

# Configurar el contexto de hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifica si la contraseña coincide con el hash"""
    try:
        print(f"\n--- Verificando contraseña ---")
        print(f"Contraseña: {plain_password}")
        print(f"Hash: {hashed_password}")
        
        # Verificar con passlib
        print("\nVerificando con passlib...")
        result_passlib = pwd_context.verify(plain_password, hashed_password)
        print(f"Resultado passlib: {result_passlib}")
        
        # Verificar directamente con bcrypt
        print("\nVerificando directamente con bcrypt...")
        if hashed_password.startswith('$2b$'):
            print("Hash parece estar en formato bcrypt")
            # Extraer el salt y el hash
            parts = hashed_password.split('$')
            salt = f"${parts[1]}${parts[2]}${parts[3][:22]}"
            print(f"Salt extraído: {salt}")
            
            # Intentar verificar con bcrypt
            try:
                # Verificar con bcrypt
                result_bcrypt = bcrypt.checkpw(
                    plain_password.encode('utf-8'),
                    hashed_password.encode('utf-8')
                )
                print(f"Resultado bcrypt: {result_bcrypt}")
            except Exception as e:
                print(f"Error al verificar con bcrypt: {str(e)}")
        else:
            print("El hash no parece estar en formato bcrypt")
        
        return result_passlib
    except Exception as e:
        print(f"Error en verify_password: {str(e)}")
        return False

def get_user_hashed_password(username: str):
    """Obtiene el hash de contraseña de un usuario desde MongoDB"""
    try:
        # Conectar a MongoDB
        client = pymongo.MongoClient("mongodb://localhost:27017/")
        db = client["gemini_educacion"]
        users = db["users"]
        
        # Buscar el usuario
        user = users.find_one({"$or": [{"username": username}, {"email": username}]})
        
        if user:
            print(f"\n--- Usuario encontrado en la base de datos ---")
            print(f"ID: {user['_id']}")
            print(f"Username: {user.get('username')}")
            print(f"Email: {user.get('email')}")
            print(f"Rol: {user.get('role')}")
            print(f"Hash de contraseña: {user.get('hashed_password')}")
            return user.get('hashed_password')
        else:
            print(f"\nUsuario '{username}' no encontrado en la base de datos")
            return None
    except Exception as e:
        print(f"Error al consultar la base de datos: {str(e)}")
        return None

if __name__ == "__main__":
    # Obtener el nombre de usuario del primer argumento o usar 'testuser' por defecto
    username = sys.argv[1] if len(sys.argv) > 1 else "testuser"
    password = sys.argv[2] if len(sys.argv) > 2 else "Test123!"
    
    print(f"=== Depuración de autenticación para usuario: {username} ===\n")
    
    # Obtener el hash de la base de datos
    hashed_password = get_user_hashed_password(username)
    
    if hashed_password:
        # Verificar la contraseña
        print("\n=== Verificando contraseña ===")
        result = verify_password(password, hashed_password)
        print(f"\nResultado final de la verificación: {'Éxito' if result else 'Fallo'}")
    else:
        print("No se pudo obtener el hash de contraseña del usuario")
