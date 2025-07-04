"""Script para iniciar el servidor con las variables de entorno correctas"""
import os
import subprocess
import sys

def main():
    # Configurar las variables de entorno
    os.environ["MONGODB_URI"] = "mongodb://localhost:27017"
    os.environ["MONGODB_URL"] = "mongodb://localhost:27017"
    os.environ["DB_NAME"] = "gemini_educacion"
    os.environ["SECRET_KEY"] = "clave_secreta_temporal"
    os.environ["ALGORITHM"] = "HS256"
    os.environ["ACCESS_TOKEN_EXPIRE_MINUTES"] = "1440"
    os.environ["DEBUG"] = "True"
    
    # Comando para iniciar el servidor
    cmd = [
        "poetry", "run", "uvicorn", "main:app", 
        "--reload", "--host", "0.0.0.0", "--port", "8000"
    ]
    
    print("Iniciando servidor con las siguientes variables de entorno:")
    for key in ["MONGODB_URI", "MONGODB_URL", "DB_NAME"]:
        print(f"{key}: {os.environ.get(key)}")
    
    # Ejecutar el comando
    try:
        subprocess.run(cmd, check=True)
    except subprocess.CalledProcessError as e:
        print(f"Error al iniciar el servidor: {e}", file=sys.stderr)
        sys.exit(1)
    except KeyboardInterrupt:
        print("\nServidor detenido por el usuario")
        sys.exit(0)

if __name__ == "__main__":
    main()
