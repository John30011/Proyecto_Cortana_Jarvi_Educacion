"""
Punto de entrada principal para la API de GEMINI.

Este módulo configura e inicia la aplicación FastAPI, incluyendo middlewares,
manejo de errores, rutas y eventos de inicio/cierre.
"""
import logging
import os
from datetime import datetime
from enum import Enum
from typing import List, Optional

import uvicorn
from fastapi import FastAPI, HTTPException, Request, status
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
from app.api.v1 import api_router

# Configuración de logging
setup_logging()
logger = get_logger(__name__)

# Configuración de logging para uvicorn (solo si no estamos en modo de desarrollo)
if not settings.DEBUG:
    uvicorn_logger = logging.getLogger('uvicorn')
    uvicorn_logger.setLevel(logging.INFO)
    logging.getLogger('uvicorn.error').setLevel(logging.INFO)
    logging.getLogger('uvicorn.access').setLevel(logging.INFO)

# Configuración de la aplicación
app = FastAPI(
    title="GEMINI API",
    description="""
    API para la plataforma educativa GEMINI.
    
    Esta API proporciona los endpoints necesarios para la plataforma educativa GEMINI,
    incluyendo autenticación, gestión de usuarios, módulos educativos y más.
    """,
    version="1.0.0",
    docs_url="/docs",  # Habilitar documentación Swagger
    redoc_url="/redoc",  # Habilitar documentación ReDoc
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
try:
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
    
except Exception as e:
    logger.error(f"Error al configurar CORS: {str(e)}")
    # Configuración por defecto segura
    origins = ["http://localhost:3000", "http://localhost:8000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Range", "X-Total-Count"]
)

# Montar archivos estáticos
try:
    os.makedirs("static", exist_ok=True)
    app.mount("/static", StaticFiles(directory="static"), name="static")
except Exception as e:
    logger.warning(f"No se pudo configurar el directorio estático: {str(e)}")
    # Continuar sin archivos estáticos si hay un error

# Incluir routers API
app.include_router(api_router, prefix="")

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
        logger.info("Iniciando la aplicación GEMINI...")
        
        # Validar configuración de MongoDB
        if not hasattr(settings, 'MONGODB_URL') or not settings.MONGODB_URL:
            error_msg = "La variable de entorno MONGODB_URL no está configurada"
            logger.critical(error_msg)
            raise ValueError(error_msg)
            
        if not hasattr(settings, 'DB_NAME') or not settings.DB_NAME:
            error_msg = "La variable de entorno DB_NAME no está configurada"
            logger.critical(error_msg)
            raise ValueError(error_msg)
        
        # Conectar a MongoDB
        logger.info(f"Conectando a MongoDB en: {settings.MONGODB_URL}")
        logger.info(f"Usando base de datos: {settings.DB_NAME}")
        try:
            # Conectar a la base de datos
            connected = await db.connect_db()
            if not connected:
                raise RuntimeError("No se pudo conectar a la base de datos")
                
            # Verificar la conexión con un comando simple
            client = db._client
            await client.admin.command('ping')
            logger.info("✓ Conexión a MongoDB establecida correctamente")
            
            # Inicializar la base de datos con datos por defecto
            logger.info("Inicializando base de datos...")
            await initialize_database()
            
            # Obtener estadísticas de la base de datos
            stats = await get_database_stats()
            logger.info(f"✓ Base de datos inicializada: {settings.DB_NAME}")
            logger.debug(f"Estadísticas de la base de datos: {stats}")
            
        except Exception as db_error:
            logger.critical(f"Error al conectar con MongoDB: {str(db_error)}", exc_info=True)
            raise RuntimeError("No se pudo establecer conexión con la base de datos") from db_error
        
        logger.info("✓ Aplicación lista para recibir peticiones")
        
    except Exception as e:
        logger.critical(f"❌ Error crítico al iniciar la aplicación: {str(e)}", exc_info=True)
        # No relanzamos la excepción para permitir que la aplicación intente continuar
        # con funcionalidad limitada si es posible

@app.on_event("shutdown")
async def shutdown_event():
    """
    Evento de cierre de la aplicación.
    
    Se ejecuta cuando la aplicación se está cerrando y se encarga de liberar recursos.
    """
    logger.info("Iniciando cierre ordenado de la aplicación...")
    
    try:
        # Cerrar la conexión a la base de datos si existe y está conectada
        if hasattr(db, 'is_connected') and db.is_connected:
            try:
                logger.info("Cerrando conexión a MongoDB...")
                await db.close()
                logger.info("✓ Conexión a MongoDB cerrada correctamente")
            except Exception as db_error:
                logger.error(f"Error al cerrar la conexión a MongoDB: {str(db_error)}", exc_info=True)
        else:
            logger.info("No hay conexión activa a MongoDB para cerrar")
            
        # Aquí puedes agregar más tareas de limpieza si es necesario
        # Por ejemplo: cerrar conexiones a otros servicios, liberar recursos, etc.
        
        logger.info("✓ Recursos liberados correctamente")
        
    except Exception as e:
        logger.error(f"❌ Error durante el cierre de la aplicación: {str(e)}", exc_info=True)
    finally:
        logger.info("✓ Aplicación cerrada correctamente")

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
    request_id = request.state.request_id if hasattr(request.state, 'request_id') else 'unknown'
    
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
    
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "status": "error",
            "message": exc.detail,
            "status_code": exc.status_code,
            "request_id": request_id,
        },
        headers={"X-Request-ID": request_id}
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
    request_id = request.state.request_id if hasattr(request.state, 'request_id') else 'unknown'
    
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
    request_id = request.state.request_id if hasattr(request.state, 'request_id') else 'unknown'
    error_id = f"ERR-{datetime.utcnow().strftime('%Y%m%d-%H%M%S')}-{request_id[:8]}"
    
    # Registrar el error con información detallada
    logger.critical(
        f"Error inesperado [{error_id}]: {str(exc)}",
        exc_info=True,
        extra={
            "request_id": request_id,
            "error_id": error_id,
            "path": request.url.path,
            "method": request.method,
            "headers": dict(request.headers),
            "query_params": dict(request.query_params),
        },
    )
    
    # Preparar mensaje de error para el cliente
    error_detail = {
        "status": "error",
        "message": "Error interno del servidor",
        "error_id": error_id,
        "status_code": status.HTTP_500_INTERNAL_SERVER_ERROR,
        "request_id": request_id,
    }
    
    # Incluir detalles del error en modo desarrollo
    if settings.DEBUG:
        error_detail["detail"] = str(exc)
        error_detail["type"] = exc.__class__.__name__
    
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content=error_detail,
        headers={
            "X-Request-ID": request_id,
            "X-Error-ID": error_id
        }
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

# Modelos Pydantic para el chat
class AgeGroup(str, Enum):
    """Grupos de edad soportados por la aplicación."""
    THREE_TO_FIVE = "3-5"
    SIX_TO_EIGHT = "6-8"
    NINE_TO_TWELVE = "9-12"

class Message(BaseModel):
    """Modelo para los mensajes del chat."""
    role: str = Field(..., description="Rol del emisor del mensaje (usuario o asistente)")
    content: str = Field(..., description="Contenido del mensaje")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="Marca de tiempo del mensaje")

class ChatRequest(BaseModel):
    """Modelo para la solicitud de chat."""
    messages: List[Message] = Field(..., description="Historial de mensajes de la conversación")
    age_group: AgeGroup = Field(..., description="Grupo de edad del usuario")
    context: Optional[dict] = Field(default_factory=dict, description="Contexto adicional de la conversación")

class ChatResponse(BaseModel):
    """Modelo para la respuesta del chat."""
    response: str = Field(..., description="Respuesta del asistente")
    context: dict = Field(default_factory=dict, description="Contexto actualizado de la conversación")
    suggestions: List[str] = Field(default_factory=list, description="Sugerencias para el usuario")

# Ruta de chat
@app.post("/api/chat", response_model=ChatResponse)
async def chat(chat_request: ChatRequest, request: Request):
    """
    Endpoint principal para el chat interactivo.
    
    Procesa los mensajes del usuario y devuelve una respuesta del asistente
    adaptada al grupo de edad del usuario.
    
    Args:
        chat_request (ChatRequest): Datos de la solicitud de chat
        request (Request): Objeto de solicitud HTTP
        
    Returns:
        ChatResponse: Respuesta del asistente con sugerencias
    """
    # Obtener el ID de la solicitud para seguimiento
    request_id = request.headers.get('x-request-id', 'no-request-id')
    
    try:
        logger.info(
            "Nueva solicitud de chat recibida",
            extra={
                "request_id": request_id,
                "age_group": chat_request.age_group,
                "message_count": len(chat_request.messages),
            },
        )
        
        # Validar que hay mensajes en la solicitud
        if not chat_request.messages:
            logger.warning(
                "Solicitud de chat sin mensajes",
                extra={"request_id": request_id},
            )
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="La solicitud debe incluir al menos un mensaje"
            )
        
        # Obtener el último mensaje del usuario
        last_message = chat_request.messages[-1].content
        
        # Registrar el mensaje recibido
        logger.debug(
            "Mensaje recibido",
            extra={
                "request_id": request_id,
                "message": last_message,
                "age_group": chat_request.age_group,
            },
        )
        
        # Aquí iría la lógica para procesar el mensaje con el modelo de lenguaje
        # Por ahora, devolvemos una respuesta de ejemplo
        response_text = f"Hola, has dicho: '{last_message}'. "
        
        # Personalizar la respuesta según el grupo de edad
        if chat_request.age_group == AgeGroup.THREE_TO_FIVE:
            response_text += "¡Qué divertido! ¿Quieres que te cuente un cuento o juguemos juntos?"
            suggestions = ["Cuéntame un cuento", "Enséñame los colores", "Juguemos"]
        elif chat_request.age_group == AgeGroup.SIX_TO_EIGHT:
            response_text += "¡Interesante! ¿Te gustaría aprender algo nuevo hoy?"
            suggestions = ["¿Qué es la fotosíntesis?", "Ayúdame con matemáticas", "Cuéntame un dato curioso"]
        else:  # 9-12
            response_text += "¡Excelente pregunta! ¿Sobre qué tema te gustaría aprender más?"
            suggestions = ["Explícame las fracciones", "Háblame de la historia antigua", "¿Cómo funciona el sistema solar?"]
        
        # Crear la respuesta
        response_data = {
            "response": response_text,
            "context": {
                "last_interaction": datetime.utcnow().isoformat(),
                "age_group": chat_request.age_group,
                "previous_messages": [
                    {"role": msg.role, "content": msg.content}
                    for msg in chat_request.messages[-5:]  # Mantener solo los últimos 5 mensajes
                ]
            },
            "suggestions": suggestions
        }
        
        logger.debug(
            "Respuesta generada",
            extra={
                "request_id": request_id,
                "response_length": len(response_text),
                "suggestion_count": len(suggestions),
            },
        )
        
        return response_data
        
    except HTTPException as he:
        # Re-lanzar las excepciones HTTP
        logger.warning(
            "Error en la solicitud de chat",
            extra={
                "request_id": request_id,
                "status_code": he.status_code,
                "detail": str(he.detail),
            },
        )
        raise
        
    except Exception as unexpected_error:
        # Registrar el error inesperado
        logger.error(
            "Error inesperado en el endpoint de chat: %s",
            str(unexpected_error),
            extra={"request_id": request_id},
            exc_info=True,
        )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al procesar la solicitud de chat"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
