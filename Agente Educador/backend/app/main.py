"""
Punto de entrada principal para la API de GEMINI.

Este módulo configura e inicia la aplicación FastAPI, incluyendo middlewares,
manejo de errores, rutas y eventos de inicio/cierre.
"""
import logging
import os
from datetime import datetime
from typing import List, Optional

import uvicorn
from fastapi import FastAPI, HTTPException, Request, status, Depends
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.docs import get_swagger_ui_html
from fastapi.openapi.utils import get_openapi
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

# Configuración de la aplicación
from app.core.config import settings
from app.core.logging_config import get_logger, setup_logging

# Configuración de la base de datos
from app.db.init_db import init_db as initialize_database
from app.db.mongodb import db
from app.db.utils import get_database_stats

# Routers de la API
from app.api.endpoints import chat as chat_router
from app.api.v1.endpoints import auth as auth_router
from app.api.v1 import api_router as v1_router

# Configuración de logging
setup_logging()
logger = get_logger(__name__)

# Configuración de la aplicación
app = FastAPI(
    title="GEMINI API",
    description="""
    API para la plataforma educativa GEMINI.
    
    Esta API proporciona los endpoints necesarios para la plataforma educativa GEMINI,
    incluyendo autenticación, gestión de usuarios, módulos educativos y más.
    """,
    version="1.0.0",
    docs_url=None,  # Deshabilitar docs por defecto
    redoc_url=None,  # Deshabilitar redoc por defecto
    openapi_url="/openapi.json",
    contact={
        "name": "Soporte GEMINI",
        "email": "soporte@gemini.edu"
    },
    license_info={
        "name": "Licencia MIT",
        "url": "https://opensource.org/licenses/MIT"
    }
)

# Configuración de CORS
origins = [
    "http://localhost:3000",  # Frontend local
    "http://localhost:8000",  # Backend local
    "https://gemini-educacion.vercel.app",  # Producción frontend
    "https://api.gemini.edu"  # Producción backend
]

# Añadir orígenes adicionales desde variables de entorno
if hasattr(settings, 'CORS_ORIGINS') and settings.CORS_ORIGINS:
    if settings.CORS_ORIGINS == "*":
        origins = ["*"]
    else:
        # Filtrar valores vacíos y eliminar espacios
        additional_origins = [
            origin.strip() 
            for origin in settings.CORS_ORIGINS.split(",")
            if origin.strip()
        ]
        origins.extend(additional_origins)

# Eliminar duplicados manteniendo el orden
seen = set()
origins = [x for x in origins if not (x in seen or seen.add(x))]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Range", "X-Total-Count", "X-RateLimit-Limit", 
                   "X-RateLimit-Remaining", "X-RateLimit-Reset"]
)

# Montar archivos estáticos
try:
    os.makedirs("static", exist_ok=True)
    app.mount("/static", StaticFiles(directory="static"), name="static")
except Exception as e:
    logger.warning(f"No se pudo configurar el directorio estático: {str(e)}")

# Incluir routers
app.include_router(chat_router.router, prefix="/api/chat", tags=["chat"])
app.include_router(auth_router.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(v1_router)

# Middleware para logging de solicitudes y respuestas
@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Middleware para registrar todas las solicitudes y respuestas HTTP."""
    # Registrar la solicitud entrante
    request_id = request.headers.get('x-request-id', 'no-request-id')
    logger.info(
        "Petición recibida",
        extra={
            "request_id": request_id,
            "method": request.method,
            "url": str(request.url),
            "client": f"{request.client.host}:{request.client.port}" if request.client else "unknown",
            "headers": dict(request.headers),
        },
    )
    
    # Medir el tiempo de procesamiento
    import time
    start_time = time.time()
    
    try:
        # Procesar la solicitud
        response = await call_next(request)
        
        # Calcular el tiempo de procesamiento
        process_time = time.time() - start_time
        
        # Registrar la respuesta
        logger.info(
            "Respuesta enviada",
            extra={
                "request_id": request_id,
                "status_code": response.status_code,
                "process_time": f"{process_time:.4f}s",
            },
        )
        
        # Agregar encabezados de rendimiento
        response.headers["X-Process-Time"] = str(process_time)
        response.headers["X-Request-ID"] = request_id
        
        return response
        
    except Exception as exc:
        # Registrar errores no controlados
        process_time = time.time() - start_time
        logger.error(
            "Error al procesar la solicitud",
            exc_info=True,
            extra={
                "request_id": request_id,
                "process_time": f"{process_time:.4f}s",
                "error": str(exc),
            },
        )
        raise
    
    finally:
        # Registrar el tiempo total de procesamiento
        process_time = time.time() - start_time
        if process_time > 1.0:  # Registrar advertencia si la solicitud es lenta
            logger.warning(
                "Solicitud lenta detectada",
                extra={
                    "request_id": request_id,
                    "process_time": f"{process_time:.4f}s",
                    "method": request.method,
                    "url": str(request.url),
                },
            )

# Eventos de inicio y cierre
@app.on_event("startup")
async def startup_db_client():
    """
    Inicializa la conexión a la base de datos, índices y datos iniciales.
    """
    try:
        logger.info("Iniciando la aplicación...")
        
        # Conectar a MongoDB
        await db.connect_db()
        logger.info("Conexión a MongoDB establecida correctamente")
        
        # Inicializar colecciones e índices
        await initialize_database()
        logger.info("Base de datos inicializada correctamente")
        
        # Verificar el estado de la base de datos
        stats = await get_database_stats()
        logger.info("Estadísticas de la base de datos", extra={"stats": stats})
        
    except Exception as e:
        logger.critical(
            "Error al iniciar la aplicación",
            exc_info=True,
            extra={"error": str(e)},
        )
        # No salir para permitir que la aplicación se inicie en modo degradado
        # raise

@app.on_event("shutdown")
async def shutdown_event():
    """
    Evento de cierre de la aplicación.
    
    Se ejecuta cuando la aplicación se está cerrando y se encarga de liberar recursos.
    """
    try:
        logger.info("Cerrando la aplicación...")
        
        # Cerrar la conexión a MongoDB
        if db.is_connected:
            await db.close()
            logger.info("Conexión a MongoDB cerrada correctamente")
        
        logger.info("Aplicación cerrada correctamente")
        
    except Exception as e:
        logger.error(
            "Error al cerrar la aplicación",
            exc_info=True,
            extra={"error": str(e)},
        )

# Manejo de errores
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """
    Maneja las excepciones HTTP personalizadas.
    
    Args:
        request: Objeto de solicitud FastAPI
        exc: Excepción HTTP que se está manejando
        
    Returns:
        JSONResponse: Respuesta JSON con detalles del error
    """
    request_id = request.headers.get('x-request-id', 'unknown')
    
    logger.warning(
        f"Error HTTP {exc.status_code}: {exc.detail}",
        extra={
            "request_id": request_id,
            "status_code": exc.status_code, 
            "detail": exc.detail,
            "path": request.url.path,
            "method": request.method
        },
    )
    
    # Crear headers base
    headers = {"X-Request-ID": request_id}
    
    # Agregar headers adicionales si existen
    if hasattr(exc, 'headers') and exc.headers is not None:
        headers.update(exc.headers)
    
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "status": "error",
            "message": str(exc.detail) if exc.detail else "Error desconocido",
            "status_code": exc.status_code,
            "request_id": request_id,
        },
        headers=headers
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """
    Maneja los errores de validación de Pydantic.
    
    Args:
        request: Objeto de solicitud FastAPI
        exc: Excepción de validación de Pydantic
        
    Returns:
        JSONResponse: Respuesta JSON con detalles de validación
    """
    request_id = request.headers.get('x-request-id', 'unknown')
    
    # Extraer errores de validación en un formato más legible
    errors = []
    for error in exc.errors():
        error_info = {
            "loc": error["loc"],
            "msg": error["msg"],
            "type": error["type"],
        }
        if "ctx" in error:
            error_info["context"] = error["ctx"]
        errors.append(error_info)
    
    logger.warning(
        f"Error de validación en la solicitud: {len(errors)} errores encontrados",
        extra={
            "request_id": request_id,
            "errors": errors,
            "path": request.url.path,
            "method": request.method
        },
    )
    
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "status": "error",
            "message": "Error de validación en los datos de entrada",
            "errors": errors,
            "status_code": status.HTTP_422_UNPROCESSABLE_ENTITY,
            "request_id": request_id,
        },
        headers={"X-Request-ID": request_id}
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """
    Maneja cualquier otra excepción no controlada.
    
    Args:
        request: Objeto de solicitud FastAPI
        exc: Excepción no controlada
        
    Returns:
        JSONResponse: Respuesta JSON con detalles del error
    """
    try:
        request_id = request.headers.get('x-request-id', 'unknown')
        error_id = f"ERR-{datetime.utcnow().strftime('%Y%m%d-%H%M%S')}-{request_id[:8]}"
        
        # Obtener información del error
        error_type = exc.__class__.__name__
        error_message = str(exc)
        
        # Determinar el código de estado apropiado
        status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        if hasattr(exc, 'status_code'):
            status_code = exc.status_code
        elif hasattr(exc, 'code') and isinstance(exc.code, int):
            status_code = exc.code
        
        # Manejar específicamente errores de validación de Pydantic
        if hasattr(exc, 'errors') and isinstance(exc.errors, list):
            return await validation_exception_handler(request, exc)
        
        # Manejar errores de validación (ValueError, etc.)
        if isinstance(exc, ValueError):
            status_code = status.HTTP_422_UNPROCESSABLE_ENTITY
            # Asegurarse de que el mensaje de error sea serializable
            try:
                detail = str(exc)
                # Convertir a string para asegurar la serialización
                detail = str(detail)
            except Exception:
                detail = "Error de validación en los datos de entrada"
                
            error_data = {
                "status": "error",
                "message": "Error de validación en los datos de entrada",
                "error_id": error_id,
                "status_code": status_code,
                "request_id": request_id,
                "type": error_type,
                "detail": detail
            }
        else:
            # Para otros tipos de errores
            error_data = {
                "status": "error",
                "message": error_message if settings.DEBUG else "Error interno del servidor",
                "error_id": error_id,
                "status_code": status_code,
                "request_id": request_id,
                "type": error_type
            }
            
            # Solo incluir el detalle en modo debug
            if settings.DEBUG:
                error_data["detail"] = error_message
        
        # Registrar el error
        logger.error(
            f"[{error_type}] {error_message}",
            exc_info=True,
            extra={
                "request_id": request_id,
                "error_id": error_id,
                "path": request.url.path,
                "method": request.method,
                "error_type": error_type,
                "error_args": str(exc.args) if hasattr(exc, 'args') else 'No args',
                "status_code": status_code
            },
        )
        
        # Crear la respuesta
        return JSONResponse(
            status_code=status_code,
            content=error_data,
            headers={"X-Request-ID": request_id, "X-Error-ID": error_id}
        )
        
    except Exception as e:
        # Si ocurre un error durante el manejo de la excepción
        logger.critical(
            "Error crítico en el manejador de excepciones global",
            exc_info=True,
            extra={
                "original_error": str(exc),
                "handler_error": str(e),
                "request_path": request.url.path if hasattr(request, 'url') else 'unknown',
                "request_method": request.method if hasattr(request, 'method') else 'unknown'
            }
        )
        
        # Respuesta de error genérica
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "status": "error",
                "message": "Error interno del servidor",
                "error_id": f"CRIT-{datetime.utcnow().strftime('%Y%m%d-%H%M%S')}",
                "status_code": status.HTTP_500_INTERNAL_SERVER_ERROR,
                "type": "CriticalError"
            },
            headers={"X-Error-Type": "critical"}
        )

# Documentación de la API
def custom_openapi():
    """
    Genera un esquema OpenAPI personalizado para la documentación.
    
    Returns:
        dict: Esquema OpenAPI personalizado
    """
    if getattr(app, 'openapi_schema', None):
        return app.openapi_schema
    
    # Definir la descripción de la API
    api_description = """
    ## Documentación de la API de GEMINI
    
    ### Autenticación
    La API utiliza autenticación JWT (JSON Web Tokens).
    
    1. Obtén un token de acceso en el endpoint `/api/v1/auth/token`
    2. Incluye el token en el encabezado `Authorization: Bearer <token>`
    
    ### Códigos de estado HTTP comunes
    - 200: Éxito
    - 400: Solicitud incorrecta
    - 401: No autorizado
    - 403: Prohibido (permisos insuficientes)
    - 404: Recurso no encontrado
    - 422: Error de validación
    - 429: Demasiadas solicitudes
    - 500: Error interno del servidor
    
    ### Estructura de respuestas
    Las respuestas exitosas siguen el formato:
    ```json
    {
        "data": {},  // Datos solicitados
        "message": "string",  // Mensaje descriptivo
        "success": true  // Indicador de éxito
    }
    ```
    
    Los errores siguen el formato:
    ```json
    {
        "status": "error",
        "message": "string",  // Descripción del error
        "status_code": 400,    // Código de estado HTTP
        "request_id": "string" // ID de la solicitud para seguimiento
    }
    """
    
    # Obtener el esquema OpenAPI base
    openapi_schema = get_openapi(
        title=app.title,
        version=app.version,
        description=api_description,
        routes=app.routes,
        tags=[
            {"name": "Autenticación", "description": "Endpoints para autenticación y gestión de usuarios"},
            {"name": "Chat", "description": "Endpoints para el chat interactivo"},
            {"name": "Salud", "description": "Endpoints de verificación del estado del servicio"}
        ]
    )
    
    # Configuración de autenticación JWT
    if "components" not in openapi_schema:
        openapi_schema["components"] = {}
    
    openapi_schema["components"]["securitySchemes"] = {
        "Bearer": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
            "description": "Ingrese el token JWT con el prefijo 'Bearer '"
        }
    }
    
    # Asegurar que todos los endpoints requieran autenticación por defecto
    for path in openapi_schema.get("paths", {}).values():
        for method in path.values():
            if isinstance(method, dict) and method.get("security") is None:
                method["security"] = [{"Bearer": []}]
    
    # Personalización adicional del esquema
    openapi_schema["info"]["x-logo"] = {
        "url": "https://gemini.edu/logo.png",
        "altText": "Logo de GEMINI"
    }
    
    # Almacenar en caché el esquema generado
    app.openapi_schema = openapi_schema
    return openapi_schema

# Asignar la función personalizada de OpenAPI
app.openapi = custom_openapi

# Ruta para la documentación Swagger UI
@app.get("/docs", include_in_schema=False)
async def get_documentation():
    """Endpoint personalizado para la documentación Swagger UI"""
    return get_swagger_ui_html(
        openapi_url="/openapi.json",
        title="GEMINI API - Documentación",
        swagger_favicon_url="https://gemini.edu/favicon.ico",
        swagger_ui_parameters={
            "defaultModelsExpandDepth": -1,  # Ocultar modelos por defecto
            "docExpansion": "list",  # Expandir solo la lista de endpoints
            "filter": True,  # Habilitar búsqueda
            "persistAuthorization": True  # Mantener el token de autorización
        }
    )

# Ruta de salud
@app.get("/health")
async def health_check():
    """
    Verifica el estado de la API y sus dependencias.
    
    Returns:
        Dict: Estado de la API y sus dependencias
    """
    try:
        # Verificar conexión a MongoDB
        await db.command('ping')
        db_status = "ok"
    except Exception as e:
        logger.error(f"Error de conexión a MongoDB: {str(e)}")
        db_status = "error"
    
    return {
        "status": "ok",
        "version": "1.0.0",
        "timestamp": datetime.utcnow().isoformat(),
        "dependencies": {
            "mongodb": db_status,
            "n8n": "ok"  # Asumimos que está bien si no podemos verificar
        }
    }

# Ruta raíz
@app.get("/")
async def root():
    """
    Endpoint raíz que devuelve información básica de la API.
    
    Returns:
        Dict: Información de la API
    """
    return {
        "name": "GEMINI API",
        "version": "1.0.0",
        "description": "API para la plataforma educativa GEMINI",
        "documentation": "/docs" if settings.DEBUG else "No disponible en producción",
        "status": "en línea",
        "timestamp": datetime.utcnow().isoformat()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
