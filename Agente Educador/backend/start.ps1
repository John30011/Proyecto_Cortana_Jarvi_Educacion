# Script de inicio para el backend de GEMINI
# Este script instala dependencias y ejecuta el servidor

# Detener cualquier instancia previa
echo "Deteniendo instancias previas de uvicorn..."
Stop-Process -Name "uvicorn" -Force -ErrorAction SilentlyContinue

# Asegurarse de que poetry está instalado
if (-not (Get-Command poetry -ErrorAction SilentlyContinue)) {
    echo "Poetry no está instalado. Por favor instala Poetry primero."
    echo "Puedes instalarlo con: (Invoke-WebRequest -Uri https://install.python-poetry.org -UseBasicParsing).Content | python -"
    exit 1
}

# Instalar dependencias
echo "Instalando dependencias..."
poetry install --no-root

# Iniciar el servidor
echo "Iniciando el servidor..."
poetry run uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Si el servidor se cierra inesperadamente
echo "El servidor se ha detenido."
