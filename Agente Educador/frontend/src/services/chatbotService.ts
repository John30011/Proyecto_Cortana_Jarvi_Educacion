import { useState, useCallback, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export type AgeGroup = '3-5' | '6-8' | '9-12';

const WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || 'http://localhost:5678/webhook-test/4938f62b-1a0e-435e-9255-bcb369c702f6';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    module?: string;
    ageGroup?: AgeGroup;
    isError?: boolean;
    [key: string]: any;
  };
}

interface ChatContextType {
  userId: string;
  module?: string;
  ageGroup: AgeGroup;
  previousMessages?: ChatMessage[];
}

interface UseChatReturn {
  messages: ChatMessage[];
  sendMessage: (content: string, module?: string) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
  clearMessages: () => void;
}

// Función para obtener el ID de sesión del almacenamiento local
const getSessionId = (): string => {
  if (typeof window === 'undefined') return 'server-session';
  
  let sessionId = localStorage.getItem('chatSessionId');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('chatSessionId', sessionId);
  }
  return sessionId;
};

// Función para guardar el historial de mensajes
const saveChatHistory = (messages: ChatMessage[]) => {
  if (typeof window === 'undefined') return;
  
  try {
    const sessionId = getSessionId();
    const history = {
      messages: messages.map(msg => ({
        ...msg,
        timestamp: msg.timestamp.toISOString()
      })),
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(`chatHistory_${sessionId}`, JSON.stringify(history));
  } catch (error) {
    console.error('Error al guardar el historial del chat:', error);
  }
};

// Función para cargar el historial de mensajes
const loadChatHistory = (): ChatMessage[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const sessionId = getSessionId();
    const saved = localStorage.getItem(`chatHistory_${sessionId}`);
    if (saved) {
      const { messages } = JSON.parse(saved);
      return messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
    }
  } catch (error) {
    console.error('Error al cargar el historial del chat:', error);
  }
  return [];
};

export const sendChatMessage = async (
  message: string, 
  context: ChatContextType
): Promise<{ reply: string }> => {
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        context,
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error sending message to chatbot:', error);
    throw error;
  }
};

export function useChat(
  module: string = 'general',
  ageGroup: AgeGroup = '6-8'
): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    // Cargar mensajes guardados al inicializar
    const savedMessages = loadChatHistory();
    // Si hay mensajes guardados, usarlos, de lo contrario usar mensaje de bienvenida
    return savedMessages.length > 0 ? savedMessages : [
      {
        id: uuidv4(),
        content: `¡Hola! Soy tu asistente de aprendizaje. Estoy aquí para ayudarte con el módulo de ${module}. ¿En qué puedo ayudarte hoy?`,
        role: 'assistant',
        timestamp: new Date(),
        metadata: { module, ageGroup }
      }
    ];
  });
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Add a new message to the chat and save to local storage
  const addMessage = useCallback((newMessage: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const messageWithId: ChatMessage = {
      ...newMessage,
      id: uuidv4(),
      timestamp: new Date(),
    };
    
    setMessages(prevMessages => {
      const updatedMessages = [...prevMessages, messageWithId];
      saveChatHistory(updatedMessages);
      return updatedMessages;
    });
  }, []);

  // Clear all messages
  const clearMessages = useCallback(() => {
    setMessages([{
      id: uuidv4(),
      content: `¡Hola! Soy tu asistente de aprendizaje. Estoy aquí para ayudarte con el módulo de ${module}. ¿En qué puedo ayudarte hoy?`,
      role: 'assistant',
      timestamp: new Date(),
      metadata: { module, ageGroup }
    }]);
    setError(null);
    // Limpiar el historial guardado
    const sessionId = getSessionId();
    localStorage.removeItem(`chatHistory_${sessionId}`);
  }, [module, ageGroup]);

  // Send a message to the chatbot
  const sendMessage = useCallback(async (content: string, messageModule: string = module) => {
    if (!content.trim()) return;

    const userMessage: Omit<ChatMessage, 'id' | 'timestamp'> = {
      content: content.trim(),
      role: 'user',
      metadata: {
        module: messageModule,
        ageGroup,
        timestamp: new Date().toISOString(),
      },
    };

    // Add user message to chat
    addMessage(userMessage);
    setIsLoading(true);
    setError(null);

    try {
      // Send message to n8n webhook
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          metadata: {
            module: messageModule,
            ageGroup,
            timestamp: new Date().toISOString(),
          },
        }),
      });

      // Add assistant's response to chat
      if (response.ok) {
        const data = await response.json();
        if (data && data.response) {
          const botMessage: Omit<ChatMessage, 'id' | 'timestamp'> = {
            content: data.response,
            role: 'assistant',
            metadata: {
              module: messageModule,
              ageGroup,
            },
          };
          addMessage(botMessage);
        }
      } else {
        throw new Error('Error en la respuesta del servidor');
      }
    } catch (err) {
      console.error('Error sending message to chatbot:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al comunicarse con el asistente';
      setError(new Error(errorMessage));
      
      // Añadir mensaje de error al chat
      const errorMessageObj: Omit<ChatMessage, 'id' | 'timestamp'> = {
        content: 'Lo siento, ha ocurrido un error al procesar tu mensaje. Por favor, inténtalo de nuevo más tarde.',
        role: 'assistant',
        metadata: {
          module: messageModule,
          ageGroup,
          isError: true
        },
      };
      addMessage(errorMessageObj);
    } finally {
      setIsLoading(false);
    }
  }, [addMessage, ageGroup, module]);

  // Auto-scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  return {
    messages,
    sendMessage,
    isLoading,
    error,
    clearMessages,
  };
}

export default useChat;
