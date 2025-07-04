from pymongo import MongoClient
from passlib.context import CryptContext

# Configuración
client = MongoClient('mongodb://localhost:27017/')
db = client['gemini_educador']
pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto')

# Obtener el usuario administrador
admin_user = db.users.find_one({'username': 'admin'})

if not admin_user:
    print("No se encontró el usuario administrador")
else:
    print(f"Usuario: {admin_user['username']}")
    print(f"Contraseña hasheada: {admin_user['hashed_password']}")
    print(f"Es superusuario: {admin_user.get('is_superuser', False)}")
    print(f"Está activo: {admin_user.get('is_active', True)}")
    
    # Verificar la contraseña
    password = "Admin123!"
    is_valid = pwd_context.verify(password, admin_user['hashed_password'])
    print(f"¿La contraseña es válida?: {is_valid}")
    
    if not is_valid:
        print("La contraseña no es válida. Actualizando la contraseña...")
        new_hashed_password = pwd_context.hash(password)
        db.users.update_one(
            {'_id': admin_user['_id']},
            {'$set': {'hashed_password': new_hashed_password}}
        )
        print("Contraseña actualizada correctamente")
