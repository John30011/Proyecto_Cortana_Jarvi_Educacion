import os
import sys
import codecs
from dotenv import load_dotenv

# Configurar la codificación de salida a UTF-8
sys.stdout = codecs.getwriter('utf-8')(sys.stdout.detach())

# Cargar variables de entorno
load_dotenv()

# Mostrar configuración
print("=== Configuración del servidor ===")
print(f"DEBUG: {os.getenv('DEBUG', 'No definido')}")
print(f"ENVIRONMENT: {os.getenv('ENVIRONMENT', 'No definido')}")
print(f"SECRET_KEY: {'Definido' if os.getenv('SECRET_KEY') else 'No definido'}")
print(f"ALGORITHM: {os.getenv('ALGORITHM', 'No definido')}")
print(f"ACCESS_TOKEN_EXPIRE_MINUTES: {os.getenv('ACCESS_TOKEN_EXPIRE_MINUTES', 'No definido')}")
print(f"MONGODB_URL: {os.getenv('MONGODB_URL', 'No definido')}")
print(f"DB_NAME: {os.getenv('DB_NAME', 'No definido')}")
