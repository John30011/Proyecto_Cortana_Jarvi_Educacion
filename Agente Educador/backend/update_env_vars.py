"""Script para actualizar las variables de entorno en el archivo .env"""
import os

# Ruta del archivo .env
env_path = os.path.join(os.path.dirname(__file__), '.env')

# Leer el contenido actual del archivo .env
current_content = ""
if os.path.exists(env_path):
    with open(env_path, 'r', encoding='utf-8') as f:
        current_content = f.read()

# Asegurarse de que MONGODB_URI esté presente
if 'MONGODB_URI=' not in current_content:
    # Si MONGODB_URL está presente, usamos ese valor, de lo contrario usamos el valor por defecto
    mongodb_url = "mongodb://localhost:27017"
    if 'MONGODB_URL=' in current_content:
        # Extraer el valor de MONGODB_URL
        start = current_content.find('MONGODB_URL=') + len('MONGODB_URL=')
        end = current_content.find('\n', start)
        if end == -1:  # Si es la última línea
            mongodb_url = current_content[start:]
        else:
            mongodb_url = current_content[start:end].strip()
            # Eliminar comillas si existen
            mongodb_url = mongodb_url.strip('"\'')
    
    # Agregar MONGODB_URI al final del archivo
    current_content += f"\n# Alias para compatibilidad con código existente\nMONGODB_URI={mongodb_url}\n"
    
    # Escribir el archivo actualizado
    with open(env_path, 'w', encoding='utf-8') as f:
        f.write(current_content)
    
    print(f"[OK] Archivo .env actualizado con MONGODB_URI")
else:
    print("[INFO] MONGODB_URI ya existe en el archivo .env")

print("\nContenido actual del archivo .env:")
print("-" * 50)
with open(env_path, 'r', encoding='utf-8') as f:
    print(f.read())
print("-" * 50)
