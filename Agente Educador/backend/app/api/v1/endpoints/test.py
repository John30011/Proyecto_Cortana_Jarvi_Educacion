"""
Endpoints de prueba para verificar el funcionamiento de la API.
"""
from typing import Dict, Any
import logging

from fastapi import APIRouter, Depends

from app.core.auth import get_current_active_user
from app.models.user import User

logger = logging.getLogger(__name__)

router = APIRouter(tags=["test"])

@router.get(
    "/ping",
    response_model=Dict[str, str],
    summary="Endpoint de prueba",
    description="Devuelve un mensaje de prueba para verificar que la API está funcionando.",
    response_description="Mensaje de prueba"
)
async def ping() -> Dict[str, str]:
    """
    Endpoint de prueba que devuelve un mensaje de confirmación.
    
    ### Respuestas:
    - 200: Mensaje de prueba exitoso
    """
    return {"message": "¡La API de GEMINI está funcionando correctamente!"}

@router.get(
    "/secure-ping",
    response_model=Dict[str, Any],
    summary="Endpoint de prueba seguro",
    description="Verifica la autenticación del usuario y devuelve información del usuario.",
    response_description="Información del usuario autenticado"
)
async def secure_ping(
    current_user: User = Depends(get_current_active_user)
) -> Dict[str, Any]:
    """
    Endpoint de prueba que requiere autenticación.
    
    ### Requisitos:
    - Token de autenticación en el encabezado `Authorization: Bearer <token>`
    
    ### Respuestas:
    - 200: Información del usuario autenticado
    - 401: No autenticado o token inválido
    - 403: No tiene permisos para acceder a este recurso
    """
    return {
        "message": "¡Acceso autorizado!",
        "user": {
            "username": current_user.username,
            "email": current_user.email,
            "full_name": current_user.full_name,
            "role": current_user.role
        }
    }
