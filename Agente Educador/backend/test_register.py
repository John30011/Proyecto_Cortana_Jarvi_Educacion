"""
Script para probar el registro de usuarios en la API.
"""
import os
import sys
import httpx
import asyncio
from dotenv import load_dotenv
from pathlib import Path

# Configurar la codificación de salida para la consola de Windows
if sys.platform == "win32":
    import io
    import sys
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Cargar variables de entorno
env_path = Path(".") / ".env"
load_dotenv(dotenv_path=env_path)

async def test_register_user():
    """Prueba el registro de un nuevo usuario."""
    url = "http://localhost:8000/api/v1/auth/register"
    
    # Datos de prueba
    user_data = {
        "username": "testuser",
        "email": "test@example.com",
        "password": "Test1234",
        "full_name": "Test User",
        "role": "child",
        "age_group": "6-8"
    }
    
    print(f"Enviando solicitud de registro a {url}")
    print(f"Datos: {user_data}")
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=user_data, timeout=30.0)
            
            print(f"\nRespuesta del servidor:")
            print(f"Status Code: {response.status_code}")
            print(f"Headers: {response.headers}")
            print(f"Response: {response.text}")
            
            if response.status_code == 201:
                print("\n✅ Usuario registrado exitosamente!")
                return True
            else:
                print(f"\n❌ Error al registrar usuario: {response.text}")
                return False
                
    except Exception as e:
        print(f"\n❌ Error en la solicitud: {str(e)}")
        return False

if __name__ == "__main__":
    print("🔍 Probando registro de usuario...")
    asyncio.run(test_register_user())
