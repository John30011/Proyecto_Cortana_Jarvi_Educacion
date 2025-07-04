"""
Script para iniciar el servidor con las variables de entorno configuradas correctamente.
"""
import os
import sys

# Configurar las variables de entorno
os.environ["MONGODB_URI"] = "mongodb://localhost:27017"
os.environ["MONGODB_URL"] = "mongodb://localhost:27017"
os.environ["DB_NAME"] = "gemini_educacion"
os.environ["SECRET_KEY"] = "clave_secreta_temporal"
os.environ["ALGORITHM"] = "HS256"
os.environ["DEBUG"] = "True"

# Agregar el directorio actual al path para asegurar que se encuentren los módulos
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Ahora importamos y ejecutamos uvicorn
import uvicorn
from main import app

if __name__ == "__main__":
    print("Iniciando servidor con las siguientes configuraciones:")
    print(f"MONGODB_URI: {os.environ.get('MONGODB_URI')}")
    print(f"MONGODB_URL: {os.environ.get('MONGODB_URL')}")
    print(f"DB_NAME: {os.environ.get('DB_NAME')}")
    print(f"DEBUG: {os.environ.get('DEBUG')}")
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
