"""
Script temporal para actualizar el archivo .env con las credenciales de MongoDB Atlas.
"""
import urllib.parse

def update_env_file():
    # Codificar credenciales para URL
    username = "Jonathan Alex's Org - 2025-06-28"
    password = "KamilaLuis2608*-"
    
    encoded_username = urllib.parse.quote_plus(username)
    encoded_password = urllib.parse.quote_plus(password)
    
    # Plantilla de configuración
    config = f"""# MongoDB Configuration
MONGODB_URL=mongodb+srv://{encoded_username}:{encoded_password}@cluster0.l1b2qcx.mongodb.net/
DB_NAME=gemini_educador

# JWT Configuration
SECRET_KEY=tu_clave_secreta_muy_segura_aqui_123!
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440  # 24 horas

# App Configuration
APP_NAME=GEMINI
APP_ENV=development
DEBUG=True

# CORS
FRONTEND_URL=http://localhost:3000
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# n8n Webhook
N8N_WEBHOOK_URL=http://localhost:5678/webhook/gemini
"""
    
    # Mostrar la configuración para copiar manualmente
    print("Por favor, copia el siguiente contenido y pégualo en tu archivo .env:")
    print("-" * 80)
    print(config)
    print("-" * 80)
    print("\nAsegúrate de que tu IP esté en la lista blanca de MongoDB Atlas.")

if __name__ == "__main__":
    update_env_file()
