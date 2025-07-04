import React, { useState, useRef, useEffect, useContext } from 'react';
import { 
  Box, 
  IconButton, 
  Input, 
  InputGroup, 
  InputRightElement,
  VStack,
  Text,
  Avatar,
  SlideFade,
  useColorModeValue,
  HStack
} from '@chakra-ui/react';
import { FiSend, FiMessageSquare, FiX, FiTrash2 } from 'react-icons/fi';
import { useChatbot } from '../../contexts/ChatbotContext';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const ChatbotBubble: React.FC = () => {
  // Colores basados en el tema - deben estar al inicio para mantener el orden de los Hooks
  const bgColor = useColorModeValue('white', 'gray.800');
  const bubbleColor = useColorModeValue('blue.500', 'blue.400');
  const textColor = useColorModeValue('white', 'gray.100');
  const chatBgColor = useColorModeValue('gray.50', 'gray.700');
  const messageBgColor = useColorModeValue('white', 'gray.800');
  
  // Estados
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Contexto
  const { isOpen, openChat, closeChat } = useChatbot();
  
  // Función para eliminar un mensaje
  const handleDeleteMessage = (messageId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
  };

  // Alias para mantener la compatibilidad
  const toggleChat = () => isOpen ? closeChat() : openChat();

  // Efecto para el mensaje de bienvenida
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: '1',
        text: '¡Hola! Soy Cortana & JARVIS, tu agente educativo integral. Estoy aquí para ayudarte a aprender y divertirte de manera segura y divertida. ¿En qué área deseas enfocarte hoy? ¿Matemáticas, Historia, Ciencia, Deporte o algo más?',
        sender: 'bot',
        timestamp: new Date()
      }]);
    }
  }, []);

  useEffect(() => {
    // Auto-scroll al último mensaje
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mover el foco al input cuando se abre el chat
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: 'user',
      timestamp: new Date()
    };

    // Agregar mensaje del usuario
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsTyping(true);

    try {
      // Preparar el cuerpo de la solicitud
      const requestBody = {
        message: userMessage.text,
        timestamp: userMessage.timestamp.toISOString(),
        sessionId: 'user-session-id' // Puedes implementar un sistema de sesiones si es necesario
      };

      console.log('Enviando solicitud:', JSON.stringify(requestBody, null, 2));
      
      // Enviar mensaje al webhook de n8n
      const response = await fetch('http://localhost:5678/webhook-test/4938f62b-1a0e-435e-9255-bcb369c702f6', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/plain, application/json' // Aceptar tanto texto plano como JSON
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Respuesta recibida, estado:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error en la respuesta:', errorText);
        throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
      }
      
      // Obtener el contenido de la respuesta
      const responseText = await response.text();
      console.log('Respuesta del servidor (texto):', responseText);
      
      let botResponse = '';
      
      // Intentar parsear como JSON primero
      try {
        const data = responseText ? JSON.parse(responseText) : {};
        console.log('Respuesta parseada como JSON:', data);
        // Extraer el mensaje de la respuesta JSON si existe
        botResponse = data.response || data.message || JSON.stringify(data);
      } catch (jsonError) {
        console.log('La respuesta no es un JSON válido, usando como texto plano');
        // Si no es JSON válido, usar el texto plano directamente
        botResponse = responseText;
      }
      
      // Agregar respuesta del bot
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        text: botResponse || 'Lo siento, no pude procesar tu solicitud en este momento.',
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error en handleSendMessage:', error);
      
      let errorMessage = 'Error desconocido';
      
      if (error instanceof Error) {
        console.error('Mensaje de error:', error.message);
        console.error('Stack trace:', error.stack);
        
        // Verificar si es un error de CORS
        if (error.message.includes('Failed to fetch')) {
          errorMessage = 'Error de conexión: No se pudo conectar al servidor. Verifica que el servidor esté en ejecución y la URL sea correcta.';
        } 
        // Verificar si es un error de red
        else if (error.message.includes('NetworkError')) {
          errorMessage = 'Error de red: No se pudo establecer conexión con el servidor.';
        }
        // Otros errores
        else {
          errorMessage = `Error: ${error.message}`;
        }
      }
      
      const errorMessageObj: Message = {
        id: `error-${Date.now()}`,
        text: errorMessage,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessageObj]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Box position="fixed" bottom="4" right="4" zIndex="9999">
      {isOpen ? (
        <SlideFade in={isOpen} offsetY="20px">
          <Box
            width="350px"
            height="500px"
            bg={bgColor}
            borderRadius="lg"
            boxShadow="lg"
            display="flex"
            flexDirection="column"
            overflow="hidden"
          >
            {/* Header */}
            <Box
              bg={bubbleColor}
              color={textColor}
              p={3}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <HStack spacing={2}>
                <Avatar size="sm" name="Cortana & JARVIS" src="/cortana-jarvis.png" />
                <Text fontWeight="bold">Cortana & JARVIS</Text>
              </HStack>
              <IconButton
                aria-label="Cerrar chat"
                icon={<FiX />}
                size="sm"
                variant="ghost"
                color={textColor}
                _hover={{ bg: 'rgba(255, 255, 255, 0.2)' }}
                onClick={toggleChat}
              />
            </Box>

            {/* Mensajes */}
            <Box 
              flex={1} 
              p={4} 
              overflowY="auto" 
              bg={chatBgColor}
            >
              <VStack spacing={3} align="stretch">
                {messages.map((msg) => (
                  <Box
                    key={msg.id}
                    alignSelf={msg.sender === 'user' ? 'flex-end' : 'flex-start'}
                    maxW="80%"
                    position="relative"
                    _hover={{ '& .delete-button': { opacity: 1 } }}
                  >
                    <Box
                      p={3}
                      borderRadius="lg"
                      bg={msg.sender === 'user' ? bubbleColor : messageBgColor}
                      color={msg.sender === 'user' ? textColor : 'inherit'}
                      boxShadow="sm"
                    >
                      <Text whiteSpace="pre-line">{msg.text}</Text>
                      <HStack mt={1} justify="space-between" align="center">
                        <Text fontSize="xs" opacity={0.7}>
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                        <IconButton
                          aria-label="Eliminar mensaje"
                          icon={<FiTrash2 size={14} />}
                          size="xs"
                          variant="ghost"
                          color={msg.sender === 'user' ? 'whiteAlpha.700' : 'gray.500'}
                          _hover={{ bg: 'transparent', color: msg.sender === 'user' ? 'white' : 'gray.700' }}
                          onClick={() => handleDeleteMessage(msg.id)}
                          className="delete-button"
                          opacity={0}
                          transition="opacity 0.2s"
                        />
                      </HStack>
                    </Box>
                  </Box>
                ))}
                {isTyping && (
                  <Box alignSelf="flex-start" maxW="80%" p={2}>
                    <Box
                      p={2}
                      borderRadius="lg"
                      bg={useColorModeValue('white', 'gray.800')}
                      boxShadow="sm"
                      display="inline-block"
                    >
                      <Box display="flex" gap={1}>
                        <Box w="8px" h="8px" bg="gray.400" borderRadius="full" animation="bounce 1s infinite" />
                        <Box w="8px" h="8px" bg="gray.400" borderRadius="full" animation="bounce 1s infinite 0.2s" />
                        <Box w="8px" h="8px" bg="gray.400" borderRadius="full" animation="bounce 1s infinite 0.4s" />
                      </Box>
                    </Box>
                  </Box>
                )}
                <div ref={messagesEndRef} />
              </VStack>
            </Box>

            {/* Input */}
            <Box p={3} borderTopWidth="1px">
              <InputGroup>
                <Input
                  ref={inputRef}
                  placeholder="Escribe tu mensaje..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  pr="3rem"
                />
                <InputRightElement width="3rem">
                  <IconButton
                    aria-label="Enviar mensaje"
                    icon={<FiSend />}
                    size="sm"
                    colorScheme="blue"
                    isDisabled={!message.trim()}
                    onClick={handleSendMessage}
                  />
                </InputRightElement>
              </InputGroup>
            </Box>
          </Box>
        </SlideFade>
      ) : (
        <Box
          as="button"
          onClick={toggleChat}
          bg={bubbleColor}
          color={textColor}
          p={4}
          borderRadius="full"
          boxShadow="lg"
          _hover={{ transform: 'scale(1.05)' }}
          transition="all 0.2s"
          aria-label="Abrir chat"
        >
          <FiMessageSquare size={24} />
        </Box>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
          }
        `
      }} />
    </Box>
  );
};

export default ChatbotBubble;
