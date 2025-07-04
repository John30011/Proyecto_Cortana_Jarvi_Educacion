<#
.SYNOPSIS
    Script de inicialización del entorno de desarrollo para GEMINI
.DESCRIPTION
    Este script configura el entorno de desarrollo para el proyecto GEMINI,
    incluyendo la creación de un entorno virtual, instalación de dependencias
    y configuración de variables de entorno.
.NOTES
    Versión: 1.0
    Autor: Equipo GEMINI
    Fecha: $(Get-Date -Format "yyyy-MM-dd")
#>

# Configuración
$venvName = ".venv"
$pythonVersion = "3.9"
$backendDir = ".\backend"
$frontendDir = ".\frontend"
$envFile = ".env"
$envExampleFile = ".env.example"

# Función para mostrar mensajes de estado
function Write-Status {
    param (
        [string]$Message,
        [string]$Status = "INFO"
    )
    
    $timeStamp = Get-Date -Format "HH:mm:ss"
    $statusColor = if ($Status -eq "SUCCESS") { "Green" } elseif ($Status -eq "ERROR") { "Red" } else { "Cyan" }
    
    Write-Host "[$timeStamp] " -NoNewline -ForegroundColor Gray
    Write-Host "[$Status]" -NoNewline -ForegroundColor $statusColor
    Write-Host " $Message" -ForegroundColor White
}

# Verificar si se está ejecutando como administrador
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Status "Este script requiere privilegios de administrador. Por favor, ejecútalo como administrador." -Status "ERROR"
    exit 1
}

Write-Status "Iniciando configuración del entorno de desarrollo para GEMINI..."

# Verificar si Python está instalado
try {
    $pythonVersionOutput = python --version 2>&1
    if ($LASTEXITCODE -ne 0) {
        throw "Python no encontrado"
    }
    Write-Status "Python instalado: $pythonVersionOutput" -Status "SUCCESS"
} catch {
    Write-Status "Python no está instalado o no está en el PATH. Por favor, instala Python $pythonVersion o superior." -Status "ERROR"
    exit 1
}

# Verificar versión de Python
$installedPythonVersion = (python -c "import sys; print('.'.join(map(str, sys.version_info[:2])))").Trim()
if ([version]$installedPythonVersion -lt [version]$pythonVersion) {
    Write-Status "Se requiere Python $pythonVersion o superior. Versión instalada: $installedPythonVersion" -Status "ERROR"
    exit 1
}

# Verificar si pip está instalado
try {
    $pipVersion = pip --version 2>&1
    if ($LASTEXITCODE -ne 0) {
        throw "Pip no encontrado"
    }
    Write-Status "Pip instalado: $($pipVersion.Split([Environment]::NewLine)[0])" -Status "SUCCESS"
} catch {
    Write-Status "Pip no está instalado. Por favor, instala pip e inténtalo de nuevo." -Status "ERROR"
    exit 1
}

# Crear entorno virtual
if (-not (Test-Path $venvName)) {
    Write-Status "Creando entorno virtual en $venvName..."
    python -m venv $venvName
    if ($LASTEXITCODE -ne 0) {
        Write-Status "Error al crear el entorno virtual." -Status "ERROR"
        exit 1
    }
    Write-Status "Entorno virtual creado correctamente." -Status "SUCCESS"
} else {
    Write-Status "El entorno virtual ya existe en $venvName" -Status "INFO"
}

# Activar entorno virtual
$activateScript = "$PSScriptRoot\$venvName\Scripts\Activate.ps1"
if (Test-Path $activateScript) {
    Write-Status "Activando entorno virtual..."
    . $activateScript
    Write-Status "Entorno virtual activado." -Status "SUCCESS"
} else {
    Write-Status "No se pudo encontrar el script de activación del entorno virtual." -Status "ERROR"
    exit 1
}

# Actualizar pip
Write-Status "Actualizando pip..."
python -m pip install --upgrade pip
if ($LASTEXITCODE -ne 0) {
    Write-Status "Error al actualizar pip." -Status "ERROR"
    exit 1
}
Write-Status "Pip actualizado correctamente." -Status "SUCCESS"

# Instalar dependencias de Python
if (Test-Path "$backendDir\requirements.txt") {
    Write-Status "Instalando dependencias de Python..."
    pip install -r "$backendDir\requirements.txt"
    if ($LASTEXITCODE -ne 0) {
        Write-Status "Error al instalar las dependencias de Python." -Status "ERROR"
        exit 1
    }
    Write-Status "Dependencias de Python instaladas correctamente." -Status "SUCCESS"
} else {
    Write-Status "No se encontró el archivo requirements.txt en $backendDir" -Status "WARNING"
}

# Configurar variables de entorno
if (Test-Path $envExampleFile) {
    if (-not (Test-Path $envFile)) {
        Write-Status "Creando archivo .env a partir de .env.example..."
        Copy-Item $envExampleFile -Destination $envFile
        Write-Status "Archivo .env creado. Por favor, configura las variables de entorno según sea necesario." -Status "SUCCESS"
    } else {
        Write-Status "El archivo .env ya existe. No se sobrescribirá." -Status "INFO"
    }
} else {
    Write-Status "No se encontró el archivo .env.example" -Status "WARNING"
}

# Verificar Node.js para el frontend
if (Test-Path $frontendDir) {
    try {
        $nodeVersion = node --version 2>&1
        if ($LASTEXITCODE -ne 0) {
            throw "Node.js no encontrado"
        }
        Write-Status "Node.js instalado: $nodeVersion" -Status "SUCCESS"
        
        # Instalar dependencias del frontend
        Write-Status "Instalando dependencias del frontend..."
        Set-Location $frontendDir
        npm install
        if ($LASTEXITCODE -ne 0) {
            Write-Status "Error al instalar las dependencias del frontend." -Status "ERROR"
            exit 1
        }
        Write-Status "Dependencias del frontend instaladas correctamente." -Status "SUCCESS"
        Set-Location "$PSScriptRoot"
    } catch {
        Write-Status "Node.js no está instalado o no está en el PATH. El frontend no se configurará." -Status "WARNING"
    }
} else {
    Write-Status "No se encontró el directorio del frontend. Omitiendo configuración del frontend." -Status "INFO"
}

# Instalar pre-commit hooks
if (Get-Command pre-commit -ErrorAction SilentlyContinue) {
    Write-Status "Instalando pre-commit hooks..."
    pre-commit install
    Write-Status "Pre-commit hooks instalados correctamente." -Status "SUCCESS"
} else {
    Write-Status "Pre-commit no está instalado. Omitiendo instalación de hooks." -Status "WARNING"
}

# Configuración final
Write-Status ""
Write-Status "════════════════════════════════════════════════════════════" -Status "INFO"
Write-Status "¡Configuración del entorno de desarrollo completada!" -Status "SUCCESS"
Write-Status ""
Write-Status "Siguientes pasos:" -Status "INFO"
Write-Status "1. Edita el archivo .env con tus configuraciones" -Status "INFO"
Write-Status "2. Ejecuta el backend: uvicorn app.main:app --reload" -Status "INFO"
if (Test-Path $frontendDir) {
    Write-Status "3. En otra terminal, ve al directorio frontend y ejecuta: npm run dev" -Status "INFO"
}
Write-Status ""
Write-Status "¡Listo para desarrollar! 🚀" -Status "SUCCESS"
Write-Status "════════════════════════════════════════════════════════════" -Status "INFO"
