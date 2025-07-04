"""
Script para mostrar la configuración que debe ir en el archivo .env
"""

def show_env_content():
    """Muestra el contenido que debe ir en el archivo .env"""
    content = """# MongoDB Configuration
MONGODB_URL=mongodb+srv://<usuario>:<contraseña>@cluster0.l1b2qcx.mongodb.net/
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
    
    print("Por favor, copia el siguiente contenido y pégalo en tu archivo .env")
    print("Reemplaza los siguientes valores:")
    print("1. <usuario> con tu nombre de usuario de MongoDB Atlas")
    print("2. <contraseña> con tu nueva contraseña de MongoDB Atlas")
    print("3. 'tu_clave_secreta_muy_segura_aqui_123!' con una clave secreta segura")
    print("\n--- INICIO DEL CONTENIDO PARA .env ---\n")
    print(content)
    print("--- FIN DEL CONTENIDO PARA .env ---")

if __name__ == "__main__":
    show_env_content()
