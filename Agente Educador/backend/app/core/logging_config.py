"""
Configuración centralizada de logging para la aplicación GEMINI.

Este módulo proporciona una configuración unificada para el logging en toda la aplicación,
con diferentes niveles de detalle para desarrollo y producción.
"""
import logging
import logging.config
import sys
from pathlib import Path

from app.core.config import settings


def setup_logging() -> None:
    """Configura el sistema de logging basado en el entorno."""
    log_config = {
        "version": 1,
        "disable_existing_loggers": False,
        "formatters": {
            "standard": {
                "format": "%(asctime)s - %(name)s - %(levelname)s - %(message)s (%(filename)s:%(lineno)d)",
                "datefmt": "%Y-%m-%d %H:%M:%S",
            },
            "detailed": {
                "format": "%(asctime)s - %(name)s - %(levelname)s - %(message)s\n%(pathname)s:%(lineno)d\n%(funcName)s()\n%(exc_info)s",
                "datefmt": "%Y-%m-%d %H:%M:%S",
            },
        },
        "handlers": {
            "console": {
                "class": "logging.StreamHandler",
                "formatter": "detailed" if settings.DEBUG else "standard",
                "stream": sys.stdout,
            },
            "file": {
                "class": "logging.handlers.RotatingFileHandler",
                "formatter": "detailed" if settings.DEBUG else "standard",
                "filename": "logs/app.log",
                "maxBytes": 10485760,  # 10MB
                "backupCount": 5,
                "encoding": "utf8",
            },
            "error_file": {
                "class": "logging.handlers.RotatingFileHandler",
                "formatter": "detailed",
                "filename": "logs/error.log",
                "maxBytes": 10485760,  # 10MB
                "backupCount": 5,
                "encoding": "utf8",
                "level": "ERROR",
            },
        },
        "loggers": {
            "app": {
                "handlers": ["console", "file", "error_file"],
                "level": settings.LOG_LEVEL,
                "propagate": False,
            },
            "uvicorn": {
                "handlers": ["console", "file", "error_file"],
                "level": settings.LOG_LEVEL,
                "propagate": False,
            },
            "fastapi": {
                "handlers": ["console", "file"],
                "level": settings.LOG_LEVEL,
                "propagate": False,
            },
        },
        "root": {
            "handlers": ["console", "file"],
            "level": settings.LOG_LEVEL,
        },
    }

    # Crear directorio de logs si no existe
    log_dir = Path("logs")
    log_dir.mkdir(exist_ok=True)

    # Aplicar configuración
    logging.config.dictConfig(log_config)

    # Configurar el logger de la aplicación
    logger = logging.getLogger("app")
    logger.info("Logging configurado correctamente")


def get_logger(name: str = None) -> logging.Logger:
    """
    Obtiene un logger configurado para el módulo especificado.
    
    Args:
        name: Nombre del módulo (si es None, se usa el nombre del módulo llamador)
        
    Returns:
        Logger configurado
    """
    if name is None:
        import inspect
        frm = inspect.stack()[1]
        mod = inspect.getmodule(frm[0])
        name = mod.__name__ if mod else __name__
    
    return logging.getLogger(name)


# Inicializar logging al importar el módulo
setup_logging()
