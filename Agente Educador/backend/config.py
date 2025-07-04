"""
Configuración de la aplicación GEMINI.

Este módulo proporciona una configuración centralizada para la aplicación.
"""
import os
from typing import List, Optional
from pydantic import AnyHttpUrl, validator
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    """Configuración de la aplicación."""
    
    # Configuración de la aplicación
    APP_NAME: str = "GEMINI Backend"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = os.getenv("DEBUG", "False").lower() in ("true", "1", "t")
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    
    # Configuración del servidor
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    
    # Configuración de la API
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-here")
    ALGORITHM: str = "HS256"
    
    # Configuración de tokens de acceso
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 días
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30  # 30 días
    REFRESH_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * REFRESH_TOKEN_EXPIRE_DAYS
    
    # Configuración de seguridad de tokens
    TOKEN_ISSUER: str = "gemini-educativo"
    TOKEN_AUDIENCE: List[str] = ["gemini-web", "gemini-mobile"]
    
    # Configuración de la colección de tokens en MongoDB
    MONGO_TOKENS_COLLECTION: str = "token_blacklist"
    
    # Configuración de la base de datos
    MONGODB_URL: str = "mongodb://localhost:27017"
    DB_NAME: str = "gemini_educacion"
    
    # Configuración de CORS
    CORS_ORIGINS: str = os.getenv("CORS_ORIGINS", "*")
    
    # Configuración de n8n para el chatbot
    N8N_WEBHOOK_URL: str = os.getenv("N8N_WEBHOOK_URL", "http://localhost:5678/webhook/gemini")
    N8N_API_KEY: str = os.getenv("N8N_API_KEY", "")
    
    # Configuración de correo electrónico
    SMTP_TLS: bool = os.getenv("SMTP_TLS", "True").lower() in ("true", "1", "t")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", "587"))
    SMTP_HOST: str = os.getenv("SMTP_HOST", "smtp.gmail.com")
    SMTP_USER: str = os.getenv("SMTP_USER", "")
    SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD", "")
    EMAILS_FROM_EMAIL: str = os.getenv("EMAILS_FROM_EMAIL", "no-reply@gemini.edu")
    EMAILS_FROM_NAME: str = os.getenv("EMAILS_FROM_NAME", "GEMINI Educativo")
    
    # Configuración de seguridad
    SECURE_COOKIES: bool = os.getenv("SECURE_COOKIES", "True").lower() in ("true", "1", "t")
    SESSION_COOKIE_NAME: str = os.getenv("SESSION_COOKIE_NAME", "gemini_session")
    SESSION_SECRET_KEY: str = os.getenv("SESSION_SECRET_KEY", "your-session-secret-key-here")
    
    # Configuración de la aplicación web
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:3000")
    EMAIL_RESET_TOKEN_EXPIRE_HOURS: int = int(os.getenv("EMAIL_RESET_TOKEN_EXPIRE_HOURS", "24"))
    
    # Configuración de límites de tasa
    RATE_LIMIT: str = os.getenv("RATE_LIMIT", "100/minute")
    
    # Configuración de almacenamiento
    UPLOAD_FOLDER: str = os.getenv("UPLOAD_FOLDER", "uploads")
    MAX_CONTENT_LENGTH: int = int(os.getenv("MAX_CONTENT_LENGTH", "16777216"))  # 16MB
    
    # Configuración de logs
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    LOG_FORMAT: str = os.getenv("LOG_FORMAT", "%(asctime)s - %(name)s - %(levelname)s - %(message)s")
    
    
    
    class Config:
        case_sensitive = True

# Instancia de configuración
settings = Settings()

# Función para obtener la configuración
def get_settings() -> Settings:
    """
    Obtiene la instancia de configuración.
    
    Returns:
        Settings: Instancia de configuración
    """
    return settings
