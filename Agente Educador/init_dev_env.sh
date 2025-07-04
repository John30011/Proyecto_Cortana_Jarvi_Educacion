#!/bin/bash

# =============================================
# Script de inicialización del entorno de desarrollo para GEMINI
# Versión para Linux/macOS
# =============================================

# Configuración
VENV_NAME=".venv"
PYTHON_VERSION="3.9"
BACKEND_DIR="./backend"
FRONTEND_DIR="./frontend"
ENV_FILE=".env"
ENV_EXAMPLE_FILE=".env.example"

# Colores para la salida
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Función para mostrar mensajes de estado
status() {
    local status=$1
    local message=$2
    local timestamp=$(date +"%T")
    
    case $status in
        "SUCCESS")
            echo -e "[${timestamp}] ${GREEN}[SUCCESS]${NC} ${message}"
            ;;
        "ERROR")
            echo -e "[${timestamp}] ${RED}[ERROR]${NC} ${message}" >&2
            ;;
        "WARNING")
            echo -e "[${timestamp}] ${YELLOW}[WARNING]${NC} ${message}"
            ;;
        *)
            echo -e "[${timestamp}] ${CYAN}[INFO]${NC} ${message}"
            ;;
    esac
}

# Verificar si se está ejecutando como root
if [ "$EUID" -ne 0 ]; then 
    status "WARNING" "Este script requiere privilegios de superusuario. Por favor, ejecútalo con sudo o como root."
    exit 1
fi

status "INFO" "Iniciando configuración del entorno de desarrollo para GEMINI..."

# Verificar si Python está instalado
if ! command -v python3 &> /dev/null; then
    status "ERROR" "Python no está instalado. Por favor, instala Python $PYTHON_VERSION o superior."
    exit 1
else
    PYTHON_VERSION_INSTALLED=$(python3 --version | cut -d ' ' -f2)
    status "SUCCESS" "Python instalado: $PYTHON_VERSION_INSTALLED"
    
    # Verificar versión mínima de Python
    if [ "$(printf '%s\n' "$PYTHON_VERSION" "$PYTHON_VERSION_INSTALLED" | sort -V | head -n1)" != "$PYTHON_VERSION" ]; then
        status "ERROR" "Se requiere Python $PYTHON_VERSION o superior. Versión instalada: $PYTHON_VERSION_INSTALLED"
        exit 1
    fi
fi

# Verificar si pip está instalado
if ! command -v pip3 &> /dev/null; then
    status "ERROR" "pip no está instalado. Por favor, instala pip e inténtalo de nuevo."
    exit 1
else
    PIP_VERSION=$(pip3 --version | cut -d ' ' -f2)
    status "SUCCESS" "pip instalado: $PIP_VERSION"
fi

# Crear entorno virtual
if [ ! -d "$VENV_NAME" ]; then
    status "INFO" "Creando entorno virtual en $VENV_NAME..."
    python3 -m venv "$VENV_NAME"
    if [ $? -ne 0 ]; then
        status "ERROR" "Error al crear el entorno virtual."
        exit 1
    fi
    status "SUCCESS" "Entorno virtual creado correctamente."
else
    status "INFO" "El entorno virtual ya existe en $VENV_NAME"
fi

# Activar entorno virtual
status "INFO" "Activando entorno virtual..."
source "$VENV_NAME/bin/activate"
if [ $? -ne 0 ]; then
    status "ERROR" "No se pudo activar el entorno virtual."
    exit 1
fi
status "SUCCESS" "Entorno virtual activado."

# Actualizar pip
status "INFO" "Actualizando pip..."
pip install --upgrade pip
if [ $? -ne 0 ]; then
    status "ERROR" "Error al actualizar pip."
    exit 1
fi
status "SUCCESS" "Pip actualizado correctamente."

# Instalar dependencias de Python
if [ -f "$BACKEND_DIR/requirements.txt" ]; then
    status "INFO" "Instalando dependencias de Python..."
    pip install -r "$BACKEND_DIR/requirements.txt"
    if [ $? -ne 0 ]; then
        status "ERROR" "Error al instalar las dependencias de Python."
        exit 1
    fi
    status "SUCCESS" "Dependencias de Python instaladas correctamente."
else
    status "WARNING" "No se encontró el archivo requirements.txt en $BACKEND_DIR"
fi

# Configurar variables de entorno
if [ -f "$ENV_EXAMPLE_FILE" ]; then
    if [ ! -f "$ENV_FILE" ]; then
        status "INFO" "Creando archivo .env a partir de .env.example..."
        cp "$ENV_EXAMPLE_FILE" "$ENV_FILE"
        status "SUCCESS" "Archivo .env creado. Por favor, configura las variables de entorno según sea necesario."
    else
        status "INFO" "El archivo .env ya existe. No se sobrescribirá."
    fi
else
    status "WARNING" "No se encontró el archivo .env.example"
fi

# Verificar Node.js para el frontend
if [ -d "$FRONTEND_DIR" ]; then
    if ! command -v node &> /dev/null; then
        status "WARNING" "Node.js no está instalado. El frontend no se configurará."
    else
        NODE_VERSION=$(node --version)
        status "SUCCESS" "Node.js instalado: $NODE_VERSION"
        
        # Instalar dependencias del frontend
        status "INFO" "Instalando dependencias del frontend..."
        cd "$FRONTEND_DIR" || exit 1
        npm install
        if [ $? -ne 0 ]; then
            status "ERROR" "Error al instalar las dependencias del frontend."
            exit 1
        fi
        status "SUCCESS" "Dependencias del frontend instaladas correctamente."
        cd - > /dev/null || exit 1
    fi
else
    status "INFO" "No se encontró el directorio del frontend. Omitiendo configuración del frontend."
fi

# Instalar pre-commit hooks
if command -v pre-commit &> /dev/null; then
    status "INFO" "Instalando pre-commit hooks..."
    pre-commit install
    status "SUCCESS" "Pre-commit hooks instalados correctamente."
else
    status "WARNING" "Pre-commit no está instalado. Omitiendo instalación de hooks."
fi

# Configuración final
echo -e "\n${CYAN}════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}¡Configuración del entorno de desarrollo completada!${NC}"
echo -e "\n${CYAN}Siguientes pasos:${NC}"
echo -e "1. Edita el archivo .env con tus configuraciones"
echo -e "2. Ejecuta el backend: ${CYAN}uvicorn app.main:app --reload${NC}"
if [ -d "$FRONTEND_DIR" ]; then
    echo -e "3. En otra terminal, ve al directorio frontend y ejecuta: ${CYAN}npm run dev${NC}"
fi
echo -e "\n${GREEN}¡Listo para desarrollar! 🚀${NC}"
echo -e "${CYAN}════════════════════════════════════════════════════════════${NC}\n"
