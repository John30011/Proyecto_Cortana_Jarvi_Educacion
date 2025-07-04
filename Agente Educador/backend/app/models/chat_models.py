from datetime import datetime
from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field, validator

class AgeGroup(str, Enum):
    """Grupos de edad soportados por la aplicación."""
    THREE_TO_FIVE = "3-5"
    SIX_TO_EIGHT = "6-8"
    NINE_TO_TWELVE = "9-12"

class MessageRole(str, Enum):
    """Roles de los mensajes en el chat."""
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"

class Message(BaseModel):
    """Modelo para los mensajes del chat."""
    role: MessageRole = Field(..., description="Rol del emisor del mensaje")
    content: str = Field(..., min_length=1, max_length=2000, description="Contenido del mensaje")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="Marca de tiempo del mensaje")

    @validator('content')
    def validate_content_length(cls, v):
        if len(v) < 1:
            raise ValueError("El contenido del mensaje no puede estar vacío")
        if len(v) > 2000:
            raise ValueError("El mensaje no puede tener más de 2000 caracteres")
        return v

class ChatRequest(BaseModel):
    """Modelo para la solicitud de chat."""
    messages: List[Message] = Field(
        ..., 
        min_items=1,
        max_items=100,
        description="Historial de mensajes de la conversación"
    )
    age_group: AgeGroup = Field(..., description="Grupo de edad del usuario")
    context: Optional[dict] = Field(
        default_factory=dict, 
        description="Contexto adicional de la conversación"
    )

    @validator('messages')
    def validate_messages(cls, v):
        if not v:
            raise ValueError("Debe haber al menos un mensaje en la conversación")
        if len(v) > 100:
            raise ValueError("No se pueden procesar más de 100 mensajes a la vez")
        return v

class ChatResponse(BaseModel):
    """Modelo para la respuesta del chat."""
    response: str = Field(..., description="Respuesta del asistente")
    context: dict = Field(
        default_factory=dict, 
        description="Contexto actualizado de la conversación"
    )
    suggestions: List[str] = Field(
        default_factory=list, 
        max_items=5,
        description="Sugerencias para el usuario (máx. 5)"
    )
    
    @validator('suggestions')
    def validate_suggestions(cls, v):
        if len(v) > 5:
            raise ValueError("No se pueden devolver más de 5 sugerencias")
        return v
