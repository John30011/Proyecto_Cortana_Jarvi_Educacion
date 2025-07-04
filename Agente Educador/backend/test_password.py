from passlib.context import CryptContext
from dotenv import load_dotenv
import os

# Cargar variables de entorno
load_dotenv()

# Configurar el contexto de hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifica si la contraseña en texto plano coincide con el hash almacenado.
    """
    return pwd_context.verify(plain_password, hashed_password)

# Contraseña de prueba
plain_password = "Admin123!"
hashed_password = "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW"  # Hash de "Admin123!"

# Verificar la contraseña
print(f"Verificando contraseña: {plain_password}")
print(f"Contra el hash: {hashed_password}")
result = verify_password(plain_password, hashed_password)
print(f"Resultado de la verificación: {'Éxito' if result else 'Fallo'}")
