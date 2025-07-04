<#
.SYNOPSIS
    Script de inicialización para el entorno de desarrollo de GEMINI
.DESCRIPTION
    Este script configura el entorno de desarrollo para el proyecto GEMINI,
    incluyendo la creación de archivos de entorno y la instalación de dependencias.
#>

# Configuración
$envFile = ".\.env"
$envExampleFile = ".\.env.example"

Write-Host "🚀 Configurando el entorno de desarrollo de GEMINI..." -ForegroundColor Cyan

# Verificar si ya existe el archivo .env
if (Test-Path $envFile) {
    Write-Host "⚠️  El archivo .env ya existe. Se mantendrá el archivo existente." -ForegroundColor Yellow
} else {
    # Copiar el archivo .env.example a .env
    if (Test-Path $envExampleFile) {
        Copy-Item -Path $envExampleFile -Destination $envFile
        Write-Host "✅ Archivo .env creado a partir de .env.example" -ForegroundColor Green
    } else {
        Write-Host "❌ Error: No se encontró el archivo .env.example" -ForegroundColor Red
        exit 1
    }
}

# Instalar dependencias del backend
Write-Host "`n🔧 Instalando dependencias del backend..." -ForegroundColor Cyan
Set-Location -Path ".\backend"
pip install -r requirements.txt
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al instalar las dependencias del backend" -ForegroundColor Red
    exit 1
}

# Crear carpeta de datos si no existe
if (-not (Test-Path ".\data")) {
    New-Item -ItemType Directory -Path ".\data" | Out-Null
    Write-Host "✅ Carpeta de datos creada" -ForegroundColor Green
}

# Volver al directorio raíz
Set-Location -Path ".."

Write-Host "`n✨ Configuración completada con éxito!" -ForegroundColor Green
Write-Host "Puedes iniciar el servidor de desarrollo con los siguientes comandos:" -ForegroundColor Cyan
Write-Host "`nBackend:" -ForegroundColor Yellow
Write-Host "  cd backend"
Write-Host "  uvicorn main:app --reload"
Write-Host "`nFrontend:" -ForegroundColor Yellow
Write-Host "  cd frontend"
Write-Host "  Abre index.html en tu navegador o usa un servidor local como 'python -m http.server 3000'"
Write-Host "`n📚 Documentación disponible en http://localhost:8000/api/docs" -ForegroundColor Cyan
