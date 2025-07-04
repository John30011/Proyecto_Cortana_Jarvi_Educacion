from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime

class Message(BaseModel):
    """Modelo para los mensajes del chat"""
    role: str = Field(..., description="Rol del emisor (user, assistant, system)")
    content: str = Field(..., description="Contenido del mensaje")
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class ChatRequest(BaseModel):
    """Modelo para las solicitudes de chat"""
    messages: List[Message] = Field(..., description="Historial de mensajes")
    user_id: Optional[str] = Field(None, description="ID del usuario (opcional)")
    age_group: str = Field(..., description="Grupo de edad del usuario (3-5, 6-8, 9-12)")
    context: Optional[Dict[str, Any]] = Field(
        None, 
        description="Contexto adicional para la conversación"
    )

class ChatResponse(BaseModel):
    """Modelo para las respuestas del chat"""
    response: str = Field(..., description="Respuesta del asistente")
    context: Optional[Dict[str, Any]] = Field(
        None,
        description="Contexto actualizado para la conversación"
    )
    suggestions: Optional[List[str]] = Field(
        None,
        description="Sugerencias de respuesta rápida"
    )
