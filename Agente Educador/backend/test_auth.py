import httpx
import asyncio
import logging

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def test_auth():
    url = "http://localhost:8000/api/v1/auth/auth/token"
    data = {
        "grant_type": "password",
        "username": "admin",
        "password": "Admin123!",
        "scope": "",
        "client_id": "string",
        "client_secret": "string"
    }
    
    headers = {
        "accept": "application/json",
        "Content-Type": "application/x-www-form-urlencoded"
    }
    
    try:
        async with httpx.AsyncClient() as client:
            # Primero, probar con la contraseña que sabemos que es correcta
            logger.info("Probando autenticación con contraseña correcta...")
            response = await client.post(url, data=data, headers=headers)
            
            if response.status_code == 200:
                logger.info("¡Autenticación exitosa!")
                logger.info(f"Respuesta: {response.json()}")
                return True
            else:
                logger.error(f"Error en la autenticación. Código: {response.status_code}")
                logger.error(f"Respuesta: {response.text}")
                return False
                
    except Exception as e:
        logger.error(f"Excepción al intentar autenticar: {str(e)}")
        return False

if __name__ == "__main__":
    asyncio.run(test_auth())
