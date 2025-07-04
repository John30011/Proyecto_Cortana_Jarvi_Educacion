import React, { useState, useRef, useEffect, useCallback, forwardRef } from 'react';
import { 
  Box, 
  Button, 
  Flex, 
  IconButton, 
  Input, 
  InputGroup, 
  InputRightElement, 
  Text, 
  VStack, 
  useToast,
  Avatar,
  Spinner,
  Tooltip,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useColorModeValue,
  HStack,
  Badge,
  Icon,
  useBreakpointValue
} from '@chakra-ui/react';
import { FaPaperPlane, FaTrash, FaRobot, FaUser, FaTimes, FaMinus, FaExpand } from 'react-icons/fa';
import { useChat, ChatMessage } from '@/services/chatbotService';
import { useChatContext, AgeGroup } from '@/contexts/ChatContext';

// Definimos las propiedades específicas del componente Chatbot
interface ChatbotProps extends React.HTMLAttributes<HTMLDivElement> {
  module?: string;
  onClose?: () => void;
  initialMessage?: string;
  defaultOpen?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
  children?: React.ReactNode;
}

// Componente Chatbot principal
const Chatbot = forwardRef<HTMLDivElement, ChatbotProps>(({ 
  module = 'general', 
  onClose, 
  initialMessage,
  defaultOpen = false,
  isOpen: isOpenProp,
  onToggle,
  className,
  style,
  ...props 
}, ref) => {
  const [input, setInput] = useState('');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const toast = useToast();
  const { isOpen: isChatOpen, onToggle: toggleChat, onClose: closeChat } = useDisclosure({ defaultIsOpen: defaultOpen });
  const [isMinimized, setIsMinimized] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Estados para el diseño responsivo
  const isMobile = useBreakpointValue({ base: true, md: false }) || false;
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const headerBg = useColorModeValue('blue.500', 'blue.600');
  const headerColor = 'white';
  const { ageGroup } = useChatContext();

  // Usar el hook useChat para manejar los mensajes
  const { 
    messages, 
    sendMessage, 
    isLoading, 
    clearMessages 
  } = useChat({
    module,
    initialMessage,
    onError: (error) => {
      toast({
        title: 'Error',
        description: error || 'Ocurrió un error al enviar el mensaje',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  });

  // Determinar si el componente está controlado externamente
  const isControlled = isOpenProp !== undefined && onToggle !== undefined;
  const isOpen = isControlled ? isOpenProp : isChatOpen;
  const toggle = isControlled ? onToggle : toggleChat;

  // Efecto para desplazarse al final de los mensajes cuando se actualizan
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Efecto para el mensaje inicial
  useEffect(() => {
    if (initialMessage && messages.length === 0) {
      handleSendMessage(initialMessage);
    }
  }, [initialMessage]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleSendMessage = useCallback((content?: string) => {
    const message = content || input.trim();
    if (message) {
      sendMessage(message);
      setInput('');
    }
  }, [input, sendMessage]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const onConfirmOpen = useCallback(() => {
    setIsConfirmOpen(true);
  }, []);

  const onConfirmClose = useCallback(() => {
    setIsConfirmOpen(false);
  }, []);

  const handleClearChat = useCallback(() => {
    clearMessages();
    onConfirmClose();
  }, [clearMessages, onConfirmClose]);

  const handleToggle = () => {
    if (onToggle) {
      onToggle();
    } else if (!isControlled) {
      toggleChat();
    }
    
    // Si se está abriendo, enfocar el input después de la animación
    if ((isControlled && !isOpen) || (!isControlled && !isChatOpen)) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else if (!isControlled) {
      closeChat();
    }
  };

  // Si no está abierto y no estamos controlando el estado, no renderizar nada
  if (!isOpen && !isControlled) {
    return null;
  }
  
  return (
    <Box
      ref={ref}
      position="fixed"
      bottom={isMobile ? 0 : 8}
      right={isMobile ? 0 : 8}
      w={isMobile ? '100%' : '400px'}
      maxW="100%"
      h={isMobile ? '100%' : '600px'}
      maxH={isMobile ? '100%' : 'calc(100vh - 64px)'}
      bg={useColorModeValue('white', 'gray.800')}
      borderRadius={isMobile ? 'none' : 'lg'}
      boxShadow="xl"
      display="flex"
      flexDirection="column"
      zIndex={9999}
      borderColor={borderColor}
      overflow="hidden"
      {...props}>
      
      {/* Header */}
      <Flex
        px={4}
        py={3}
        bg={headerBg}
        color={headerColor}
        alignItems="center"
        justifyContent="space-between"
        borderTopRadius="lg"
      >
        <HStack spacing={2}>
          <FaRobot />
          <Text fontWeight="bold">Asistente de Aprendizaje</Text>
          <Badge colorScheme="yellow" fontSize="0.7em">
            {module}
          </Badge>
          <Badge colorScheme="green" fontSize="0.7em">
            {ageGroup} años
          </Badge>
        </HStack>
        <HStack spacing={1}>
          {onToggle && (
            <IconButton
              aria-label={isOpen ? 'Minimizar' : 'Expandir'}
              icon={isOpen ? <FaMinus /> : <FaExpand />}
              size="sm"
              variant="ghost"
              color="white"
              _hover={{ bg: 'rgba(255, 255, 255, 0.2)' }}
              onClick={handleToggle}
            />
          )}
          {isMobile && (
            <IconButton
              aria-label="Cerrar chat"
              icon={<FaTimes />}
              size="sm"
              variant="ghost"
              colorScheme="whiteAlpha"
              onClick={handleClose}
            />
          )}
          {onClose && (
            <IconButton
              aria-label="Cerrar chat"
              icon={<FaTimes />}
              size="sm"
              variant="ghost"
              color="white"
              _hover={{ bg: 'rgba(255, 255, 255, 0.2)' }}
              onClick={handleClose}
            />
          )}
        </HStack>
      </Flex>

      {/* Mensajes */}
      <Flex
        direction="column"
        flex="1"
        overflowY="auto"
        p={4}
        css={{
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: useColorModeValue('#f1f1f1', '#2D3748'),
          },
          '&::-webkit-scrollbar-thumb': {
            background: useColorModeValue('#c1c1c1', '#4A5568'),
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: useColorModeValue('#a8a8a8', '#718096'),
          },
        }}
      >
        {messages.length === 0 ? (
          <VStack spacing={4} justify="center" h="100%" color="gray.500" textAlign="center" px={4}>
            <Box p={4} bg={useColorModeValue('gray.100', 'gray.700')} borderRadius="lg">
              <Text>¡Hola! Soy tu asistente de aprendizaje. ¿En qué puedo ayudarte hoy?</Text>
            </Box>
            <VStack spacing={2} w="100%" align="stretch">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleSendMessage('¿Qué puedes hacer?')}
                justifyContent="flex-start"
                textAlign="left"
                whiteSpace="normal"
                height="auto"
                py={2}
              >
                ¿Qué puedes hacer?
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleSendMessage(`Explícame sobre ${module} para niños de ${ageGroup} años`)}
                justifyContent="flex-start"
                textAlign="left"
                whiteSpace="normal"
                height="auto"
                py={2}
              >
                Explícame sobre {module}
              </Button>
            </VStack>
          </VStack>
        ) : (
          <VStack spacing={4} align="stretch" w="100%">
          {messages.map((message, index) => {
            const isLastMessage = index === messages.length - 1;
            const isAssistant = message.role === 'assistant';
            const isUser = message.role === 'user';
            
            return (
              <Flex
                key={message.id}
                direction="column"
                width="full"
                mb={4}
                align={isUser ? 'flex-end' : 'flex-start'}
              >
                <Flex 
                  align="flex-end" 
                  gap={2} 
                  maxW={{ base: '90%', md: '85%' }} 
                  width="fit-content"
                >
                  {isAssistant && (
                    <Box alignSelf="flex-start" mt={1}>
                      <Avatar
                        size="sm"
                        name="Asistente"
                        src="/robot-avatar.png"
                        bg="gray.500"
                        icon={<FaRobot />}
                      />
                    </Box>
                  )}
                  <Box
                    px={4}
                    py={2}
                    borderRadius="lg"
                    bg={isUser ? 'brand.500' : 'gray.100'}
                    color={isUser ? 'white' : 'gray.800'}
                    borderTopLeftRadius={isUser ? 'lg' : 'sm'}
                    borderTopRightRadius={isUser ? 'sm' : 'lg'}
                    boxShadow="sm"
                    maxW="100%"
                    wordBreak="break-word"
                  >
                    <Text whiteSpace="pre-line" lineHeight="tall">
                      {message.content}
                    </Text>
                    <Flex 
                      justify="space-between" 
                      align="center"
                      mt={1}
                      gap={2}
                    >
                      {isAssistant && isLastMessage && isLoading && (
                        <Spinner size="xs" color="gray.500" />
                      )}
                      <Text 
                        fontSize="xs" 
                        color={isUser ? 'brand.200' : 'gray.500'}
                        ml="auto"
                      >
                        {new Date(message.timestamp).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </Text>
                    </Flex>
                  </Box>
                  {isUser && (
                    <Box alignSelf="flex-start" mt={1}>
                      <Avatar
                        size="sm"
                        name="Usuario"
                        src=""
                        bg="brand.500"
                        color="white"
                        icon={<FaUser />}
                      />
                    </Box>
                  )}
                </Flex>
              </Flex>
            );
          })}
          
          {isLoading && (
            <Flex key="thinking" align="center" justify="flex-start" gap={2} mb={4}>
              <Box alignSelf="flex-start" mt={1}>
                <Avatar
                  size="sm"
                  name="Asistente"
                  src="/robot-avatar.png"
                  bg="gray.500"
                  icon={<FaRobot />}
                />
              </Box>
              <Box
                px={4}
                py={2}
                borderRadius="lg"
                bg="gray.100"
                color="gray.800"
                borderTopLeftRadius="sm"
                borderTopRightRadius="lg"
                boxShadow="sm"
                maxW="90%"
                display="flex"
                alignItems="center">
                <Spinner size="sm" mr={2} />
                <Text as="span">Pensando...</Text>
              </Box>
            </Flex>
          )}
          <div ref={messagesEndRef} />
        </VStack>
      </Flex>

      {/* Input */}
      <Box p={3} borderTopWidth="1px" borderTopColor={borderColor}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
        >
          <InputGroup size="md">
            <Input
              ref={inputRef}
              pr="4.5rem"
              placeholder="Escribe tu mensaje..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              autoComplete="off"
              borderRadius="full"
              bg={useColorModeValue('gray.50', 'gray.700')}
              _focus={{
                bg: useColorModeValue('white', 'gray.600'),
                borderColor: 'brand.300',
                boxShadow: '0 0 0 1px var(--chakra-colors-brand-300)',
              }}
              _hover={{
                bg: useColorModeValue('gray.100', 'gray.600'),
              }}
              pl={4}
              py={2}
              minH="44px"
              maxH="120px"
              overflowY="auto"
              resize="none"
              as="textarea"
              rows={1}
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: `${useColorModeValue('#CBD5E0', '#4A5568')} transparent`,
                '&::-webkit-scrollbar': {
                  width: '6px',
                },
                '&::-webkit-scrollbar-track': {
                  background: useColorModeValue('#f1f1f1', '#2D3748'),
                },
                '&::-webkit-scrollbar-thumb': {
                  background: useColorModeValue('#c1c1c1', '#4A5568'),
                  borderRadius: '3px',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                  background: useColorModeValue('#a8a8a8', '#718096'),
                },
              }}
            />
            <InputRightElement width="4.5rem" h="100%">
              <Button 
                h="1.75rem"
                size="sm" 
                colorScheme="brand"
                borderRadius="full"
                onClick={() => handleSendMessage()}
                isDisabled={!input.trim() || isLoading}
                isLoading={isLoading}
                loadingText=""
                rightIcon={<FaPaperPlane />}
                _hover={{
                  transform: 'scale(1.05)',
                }}
                _active={{
                  transform: 'scale(0.95)',
                }}
                transition="all 0.2s"
                boxShadow="sm"
              >
                Enviar
              </Button>
            </InputRightElement>
          </InputGroup>
        </form>
        <Flex justify="space-between" mt={2} px={1}>
          <Text fontSize="xs" color="gray.500">
            Presiona Enter para enviar, Shift+Enter para nueva línea
          </Text>
          <Tooltip label="Eliminar historial" placement="top">
            <IconButton
              aria-label="Eliminar historial"
              icon={<FaTrash />}
              size="xs"
              variant="ghost"
              colorScheme="red"
              onClick={onConfirmOpen}
              isDisabled={messages.length === 0}
            />
          </Tooltip>
        </Flex>
      </Box>

      {/* Modal de confirmación para borrar el historial */}
      <Modal isOpen={isConfirmOpen} onClose={onConfirmClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>¿Eliminar historial de chat?</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Text mb={4}>¿Estás seguro de que deseas eliminar todo el historial de esta conversación? Esta acción no se puede deshacer.</Text>
            <Flex justify="flex-end" gap={3}>
              <Button variant="ghost" onClick={onConfirmClose}>
                Cancelar
              </Button>
              <Button colorScheme="red" onClick={handleClearChat}>
                Eliminar
              </Button>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
});

Chatbot.displayName = 'Chatbot';

export default Chatbot;
