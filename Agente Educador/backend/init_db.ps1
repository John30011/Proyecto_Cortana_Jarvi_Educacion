# Script para inicializar la base de datos de GEMINI

# Verificar que Poetry esté instalado
if (-not (Get-Command poetry -ErrorAction SilentlyContinue)) {
    Write-Host "Poetry no está instalado. Por favor instala Poetry primero." -ForegroundColor Red
    Write-Host "Puedes instalarlo con: (Invoke-WebRequest -Uri https://install.python-poetry.org -UseBasicParsing).Content | python -"
    exit 1
}

# Verificar que MongoDB esté en ejecución
try {
    $mongoProcess = Get-Process -Name "mongod" -ErrorAction Stop
    Write-Host "✅ MongoDB está en ejecución (PID: $($mongoProcess.Id))" -ForegroundColor Green
} catch {
    Write-Host "❌ MongoDB no parece estar en ejecución. Por favor inicia MongoDB primero." -ForegroundColor Red
    exit 1
}

# Instalar dependencias si es necesario
Write-Host "🔧 Verificando dependencias..." -ForegroundColor Cyan
poetry install --no-root

# Inicializar la base de datos
Write-Host "🚀 Inicializando la base de datos..." -ForegroundColor Cyan
poetry run python -m app.db.init_db

# Mostrar mensaje de éxito
Write-Host ""
Write-Host "✨ ¡Base de datos inicializada con éxito! ✨" -ForegroundColor Green
Write-Host "Ahora puedes iniciar el servidor con: .\start.ps1" -ForegroundColor Cyan
