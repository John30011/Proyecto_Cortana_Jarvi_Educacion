# Script para configurar MongoDB Local
Write-Host "=== Configuración de MongoDB Local ===" -ForegroundColor Cyan

# 1. Crear directorio de datos
$dataDir = "C:\data\db"
if (-not (Test-Path $dataDir)) {
    Write-Host "Creando directorio de datos: $dataDir"
    New-Item -ItemType Directory -Path $dataDir -Force | Out-Null
}

# 2. Iniciar el servicio de MongoDB
try {
    Write-Host "Iniciando el servicio de MongoDB..."
    Start-Service -Name "MongoDB" -ErrorAction Stop
    Write-Host "Servicio de MongoDB iniciado correctamente" -ForegroundColor Green
} catch {
    Write-Host "Error al iniciar el servicio de MongoDB: $_" -ForegroundColor Red
    Write-Host "Asegúrate de que MongoDB está instalado correctamente"
    exit 1
}

# 3. Verificar la instalación
try {
    $mongoVersion = & mongod --version
    Write-Host "`n=== MongoDB instalado correctamente ===" -ForegroundColor Green
    $mongoVersion
} catch {
    Write-Host "No se pudo verificar la instalación de MongoDB" -ForegroundColor Red
    Write-Host "Asegúrate de que MongoDB está en el PATH del sistema"
}

# 4. Instalar herramientas de línea de comandos (opcional)
Write-Host "`nInstalando herramientas de MongoDB..."
pip install pymongo

Write-Host "`n=== Configuración completada ===" -ForegroundColor Cyan
Write-Host "Puedes acceder a MongoDB en: mongodb://localhost:27017"
Write-Host "Usa MongoDB Compass para una interfaz gráfica"
