"""
Script para configurar automáticamente la conexión a MongoDB Atlas.
"""
import os

# Configuración por defecto
DEFAULT_CONFIG = """# MongoDB Configuration
MONGODB_URL=mongodb+srv://<usuario>:<contraseña>@cluster0.l1b2qcx.mongodb.net/
# Alternativa sin SRV (descomenta si la anterior no funciona):
# MONGODB_URL=mongodb://<usuario>:<contraseña>@cluster0-shard-00-00.l1b2qcx.mongodb.net:27017,cluster0-shard-00-01.l1b2qcx.mongodb.net:27017,cluster0-shard-00-02.l1b2qcx.mongodb.net:27017/?ssl=true&replicaSet=atlas-123abc-shard-0&authSource=admin&retryWrites=true&w=majority

DB_NAME=gemini_educador

# JWT Configuration
SECRET_KEY=tu_clave_secreta_muy_segura_aqui_cambia_esto_por_una_cadena_aleatoria
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

def main():
    print("\n=== Configuracion de MongoDB Atlas ===\n")
    
    env_path = os.path.join(os.path.dirname(__file__), '.env')
    backup_path = os.path.join(os.path.dirname(__file__), '.env.backup')
    
    # Hacer una copia de seguridad si el archivo .env existe
    if os.path.exists(env_path):
        try:
            with open(env_path, 'r') as src, open(backup_path, 'w') as dst:
                dst.write(src.read())
            print(f"[OK] Se ha creado una copia de seguridad en: {backup_path}")
        except Exception as e:
            print(f"[ADVERTENCIA] No se pudo crear la copia de seguridad: {e}")
    
    # Escribir la configuración por defecto
    try:
        with open(env_path, 'w', encoding='utf-8') as f:
            f.write(DEFAULT_CONFIG)
        
        print("\n[OK] Se ha creado/actualizado el archivo .env")
        print("\nPor favor, sigue estos pasos para completar la configuración:")
        print("1. Abre el archivo .env en un editor de texto")
        print("2. Reemplaza '<usuario>' con tu nombre de usuario de MongoDB Atlas")
        print("3. Reemplaza '<contraseña>' con tu contraseña de MongoDB Atlas")
        print("4. Cambia 'tu_clave_secreta_muy_segura_aqui...' por una cadena aleatoria segura")
        print("\n5. Asegúrate de que tu IP esté en la lista blanca de MongoDB Atlas:")
        print("   - Ve a https://cloud.mongodb.com/")
        print("   - Selecciona tu cluster")
        print("   - Ve a 'Network Access'")
        print("   - Haz clic en 'Add IP Address'")
        print("   - Selecciona 'Allow Access from Anywhere' (0.0.0.0/0) o añade tu IP actual")
        print("\n6. Para probar la conexión, ejecuta: python test_mongodb.py")
        
    except Exception as e:
        print(f"\n[ERROR] No se pudo escribir en el archivo .env: {e}")
        print("Por favor, verifica los permisos del directorio.")
        return
    
    print("\nConfiguración completada. Por favor, edita el archivo .env con tus credenciales.")

if __name__ == "__main__":
    main()
