from fastapi import APIRouter, Depends, Request, HTTPException, status
from fastapi.encoders import jsonable_encoder
from typing import List

from app.models.chat_models import ChatRequest, ChatResponse, Message
from app.services.chat_service import chat_service
from app.api.dependencies.rate_limiter import rate_limit
from app.api.dependencies.auth import get_current_user
from app.core.logging_config import get_logger

router = APIRouter()
logger = get_logger(__name__)

@router.post(
    "/chat",
    response_model=ChatResponse,
    summary="Chat interactivo",
    description="""
    Endpoint principal para el chat interactivo.
    
    Procesa los mensajes del usuario y devuelve una respuesta del asistente
    adaptada al grupo de edad del usuario.
    
    Requiere autenticación JWT.
    """,
    responses={
        200: {"description": "Respuesta del chat generada exitosamente"},
        400: {"description": "Error en los datos de entrada"},
        401: {"description": "No autorizado"},
        422: {"description": "Error de validación"},
        429: {"description": "Límite de tasa excedido"},
        500: {"description": "Error interno del servidor"}
    },
    dependencies=[Depends(rate_limit())]
)
async def chat_endpoint(
    chat_request: ChatRequest,
    request: Request,
    current_user: dict = Depends(get_current_user)
) -> ChatResponse:
    """
    Procesa un mensaje de chat y devuelve una respuesta del asistente.
    
    Args:
        chat_request: Datos de la solicitud de chat
        request: Objeto de solicitud HTTP
        current_user: Usuario autenticado
        
    Returns:
        ChatResponse: Respuesta del asistente con sugerencias
    """
    try:
        # Registrar la solicitud
        logger.info(
            "Solicitud de chat recibida",
            extra={
                "user_id": current_user.get("username", "unknown"),
                "age_group": chat_request.age_group,
                "message_count": len(chat_request.messages)
            }
        )
        
        # Procesar el chat
        response = await chat_service.process_chat(chat_request)
        
        # Registrar la respuesta
        logger.info(
            "Respuesta de chat generada",
            extra={
                "user_id": current_user.get("username", "unknown"),
                "response_length": len(response.response),
                "suggestion_count": len(response.suggestions)
            }
        )
        
        return response
        
    except HTTPException:
        # Re-lanzar excepciones HTTP
        raise
        
    except Exception as e:
        # Registrar el error
        logger.error(
            "Error al procesar la solicitud de chat",
            exc_info=True,
            extra={
                "user_id": current_user.get("username", "unknown"),
                "error": str(e)
            }
        )
        
        # Devolver un error genérico
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "status": "error",
                "message": "Ocurrió un error al procesar tu solicitud. Por favor, inténtalo de nuevo más tarde.",
                "code": "internal_server_error"
            }
        )
