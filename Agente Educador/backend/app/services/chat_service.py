from typing import Dict, List, Optional
import json
import random
from datetime import datetime
from app.models.chat_models import ChatRequest, ChatResponse, Message, MessageRole
from app.core.logging_config import get_logger

logger = get_logger(__name__)

class ChatService:
    """
    Servicio para manejar la lógica del chat.
    """
    
    def __init__(self):
        # Ejemplo de respuestas por grupo de edad
        self.age_group_responses = {
            "3-5": [
                "¡Hola pequeñín! ¿En qué puedo ayudarte hoy?",
                "¡Vaya, qué pregunta tan interesante! A tu edad me encanta aprender cosas nuevas.",
                "¿Sabías que los colores del arcoíris son muy bonitos?",
            ],
            "6-8": [
                "¡Hola! ¿Qué te gustaría aprender hoy?",
                "Esa es una gran pregunta. Vamos a explorarla juntos.",
                "A tu edad, es genial hacer muchas preguntas. ¿Tienes alguna en mente?",
            ],
            "9-12": [
                "Hola, ¿en qué puedo ayudarte con tus estudios hoy?",
                "Buena pregunta. Vamos a analizarla paso a paso.",
                "A medida que creces, las preguntas se vuelven más interesantes. ¿Qué te gustaría saber?",
            ]
        }
        
        # Sugerencias de temas por grupo de edad
        self.suggestions = {
            "3-5": ["Colores", "Animales", "Números", "Letras", "Formas"],
            "6-8": ["Matemáticas", "Ciencias", "Historia", "Geografía", "Arte"],
            "9-12": ["Álgebra", "Biología", "Física", "Literatura", "Programación"]
        }
    
    async def process_chat(self, chat_request: ChatRequest) -> ChatResponse:
        """
        Procesa un mensaje de chat y genera una respuesta.
        
        Args:
            chat_request: Datos de la solicitud de chat
            
        Returns:
            ChatResponse: Respuesta generada
        """
        try:
            # Obtener el último mensaje del usuario
            last_message = chat_request.messages[-1].content if chat_request.messages else ""
            
            # Generar una respuesta basada en el grupo de edad
            response_text = self._generate_response(chat_request.age_group, last_message)
            
            # Generar sugerencias
            suggestions = self._get_suggestions(chat_request.age_group)
            
            # Actualizar el contexto (ejemplo simple)
            context = chat_request.context or {}
            context["last_interaction"] = datetime.utcnow().isoformat()
            context["message_count"] = context.get("message_count", 0) + 1
            
            return ChatResponse(
                response=response_text,
                context=context,
                suggestions=suggestions
            )
            
        except Exception as e:
            logger.error(f"Error al procesar el chat: {str(e)}", exc_info=True)
            # Respuesta de error amigable
            return ChatResponse(
                response="¡Vaya! Algo salió mal. Por favor, inténtalo de nuevo más tarde.",
                context=chat_request.context or {},
                suggestions=self._get_suggestions(chat_request.age_group)
            )
    
    def _generate_response(self, age_group: str, message: str) -> str:
        """
        Genera una respuesta basada en el grupo de edad y el mensaje.
        
        Args:
            age_group: Grupo de edad del usuario
            message: Último mensaje del usuario
            
        Returns:
            str: Respuesta generada
        """
        # Lógica simple de respuesta basada en el grupo de edad
        responses = self.age_group_responses.get(age_group, ["Hola, ¿en qué puedo ayudarte?"])
        return random.choice(responses)
    
    def _get_suggestions(self, age_group: str) -> List[str]:
        """
        Obtiene sugerencias de temas basadas en el grupo de edad.
        
        Args:
            age_group: Grupo de edad del usuario
            
        Returns:
            List[str]: Lista de sugerencias
        """
        return self.suggestions.get(age_group, ["Aprender", "Jugar", "Explorar"])

# Instancia global del servicio de chat
chat_service = ChatService()
