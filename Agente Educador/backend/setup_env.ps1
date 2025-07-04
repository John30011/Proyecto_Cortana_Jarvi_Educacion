# Script para configurar el archivo .env
$envContent = @"
# ===================================
# Configuración de la Base de Datos
# ===================================
MONGODB_URL=mongodb://localhost:27017
DB_NAME=gemini_educacion

# ===================================
# Configuración de Autenticación
# ===================================
SECRET_KEY=tu_clave_secreta_muy_segura_aqui
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440  # 24 horas
REFRESH_TOKEN_EXPIRE_DAYS=30      # 30 días

# ===================================
# Configuración del Servidor
# ===================================
HOST=0.0.0.0
PORT=8000
ENVIRONMENT=development
DEBUG=True

# ===================================
# Configuración de CORS
# ===================================
CORS_ORIGINS=*

# ===================================
# Configuración de Correo Electrónico (opcional)
# ===================================
SMTP_TLS=True
SMTP_PORT=587
SMTP_HOST=smtp.gmail.com
SMTP_USER=tu_correo@gmail.com
SMTP_PASSWORD=tu_contraseña
EMAILS_FROM_EMAIL=no-reply@gemini.edu
EMAILS_FROM_NAME=GEMINI Educativo

# ===================================
# Configuración de Seguridad
# ===================================
SECURE_COOKIES=False  # Cambiar a True en producción con HTTPS
SESSION_COOKIE_NAME=gemini_session
SESSION_SECRET_KEY=otra_clave_segura_aqui
"@

# Escribir el contenido en el archivo .env
$envPath = Join-Path -Path $PSScriptRoot -ChildPath ".env"
$envContent | Out-File -FilePath $envPath -Encoding utf8 -Force

Write-Host "✅ Archivo .env creado/actualizado correctamente en: $envPath" -ForegroundColor Green
