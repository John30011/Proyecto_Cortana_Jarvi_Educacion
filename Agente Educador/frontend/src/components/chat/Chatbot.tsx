import React, { useState, useRef, useEffect, useCallback, forwardRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  Box, 
  Button, 
  Flex, 
  Text, 
  VStack, 
  useDisclosure, 
  useColorModeValue, 
  useBreakpointValue, 
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  IconButton,
  Tooltip,
  HStack,
  Avatar,
  Spinner,
  Badge,
  Textarea,
  BoxProps,
  InputGroup,
  InputRightElement
} from '@chakra-ui/react';
import { FiMessageSquare } from 'react-icons/fi';
import { FaRobot, FaMinus, FaExpand, FaTimes, FaUser, FaPaperPlane, FaTrash } from 'react-icons/fa';
import { useChat } from '../../services/chatbotService';
import { useChatContext } from '../../contexts/ChatContext';

interface ChatbotProps extends BoxProps {
  module?: string;
  onClose?: () => void;
  initialMessage?: string;
  defaultOpen?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
}

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
}

const Chatbot = forwardRef<HTMLDivElement, ChatbotProps>(({ 
  module = 'general', 
  onClose: onCloseProp, 
  initialMessage = '¡Hola! ¿En qué puedo ayudarte hoy?',
  defaultOpen = false,
  isOpen: isOpenProp,
  onToggle: onToggleProp,
  ...props 
}, ref) => {
  const [input, setInput] = useState('');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  const toast = useToast();
  const { isOpen, onOpen, onClose: onDisclosureClose } = useDisclosure({ defaultIsOpen: defaultOpen });
  
  const isMobile = useBreakpointValue({ base: true, md: false }) || false;
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const headerBg = useColorModeValue('blue.500', 'blue.600');
  const headerColor = 'white';
  
  const { ageGroup } = useChatContext();
  const { 
    messages = [], 
    sendMessage, 
    isLoading = false, 
    clearMessages,
    error
  } = useChat(module, ageGroup || '6-8');
  
  const isControlled = isOpenProp !== undefined;
  const isChatOpen = isControlled ? isOpenProp : isOpen;

  const handleToggle = useCallback(() => {
    if (onToggleProp) {
      onToggleProp();
    } else {
      isChatOpen ? onDisclosureClose() : onOpen();
    }
  }, [onToggleProp, isChatOpen, onDisclosureClose, onOpen]);

  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: error.message || 'Ocurrió un error al procesar tu mensaje',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [error, toast]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSendMessage = useCallback(async (content?: string) => {
    const message = content || input.trim();
    if (!message || isLoading) return;
    
    if (!content) {
      setInput('');
    }
    
    try {
      await sendMessage(message);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'No se pudo enviar el mensaje.';
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [input, isLoading, sendMessage, toast]);

  const handleClearChat = useCallback(() => {
    if (clearMessages) {
      clearMessages();
      toast({
        title: 'Historial eliminado',
        description: 'La conversación ha sido borrada.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
    setIsConfirmOpen(false);
  }, [clearMessages, toast]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const handleClose = useCallback(() => {
    if (onCloseProp) {
      onCloseProp();
    } else {
      onDisclosureClose();
    }
  }, [onCloseProp, onDisclosureClose]);

  if (!isChatOpen) {
    return (
      <Tooltip label="Abrir chat" placement="left">
        <IconButton
          ref={ref as any}
          aria-label="Abrir chat"
          icon={<FiMessageSquare />}
          size="lg"
          colorScheme="brand"
          position="fixed"
          bottom={8}
          right={8}
          borderRadius="full"
          boxShadow="lg"
          onClick={handleToggle}
          zIndex={9998}
        />
      </Tooltip>
    );
  }
  
  return (
    <Box
      ref={ref}
      position="fixed"
      bottom={isMobile ? 0 : 8}
      right={isMobile ? 0 : 8}
      w={isMobile ? '100%' : '400px'}
      maxW="100%"
      h={isMinimized ? 'auto' : (isMobile ? '100%' : '600px')}
      maxH={isMobile ? '100%' : 'calc(100vh - 64px)'}
      bg={bgColor}
      borderRadius={isMobile ? 'none' : 'lg'}
      boxShadow="xl"
      display="flex"
      flexDirection="column"
      zIndex={9999}
      borderColor={borderColor}
      borderWidth={1}
      overflow="hidden"
      {...props}>
      
      <Flex
        px={4}
        py={3}
        bg={headerBg}
        color={headerColor}
        alignItems="center"
        justifyContent="space-between"
        borderTopRadius={isMobile ? 'none' : 'lg'}
        cursor="grab"
      >
        <HStack spacing={3}>
          <Avatar size="sm" name="Asistente" icon={<FaRobot fontSize="1.2rem" />} bg="whiteAlpha.300" />
          <Text fontWeight="bold">Asistente de Aprendizaje</Text>
        </HStack>
        <HStack spacing={1}>
          <IconButton
            aria-label={isMinimized ? 'Maximizar' : 'Minimizar'}
            icon={isMinimized ? <FaExpand /> : <FaMinus />}
            size="sm"
            variant="ghost"
            color="white"
            _hover={{ bg: 'whiteAlpha.200' }}
            onClick={() => setIsMinimized(!isMinimized)}
          />
          <IconButton
            aria-label="Cerrar chat"
            icon={<FaTimes />}
            size="sm"
            variant="ghost"
            color="white"
            _hover={{ bg: 'whiteAlpha.200' }}
            onClick={handleClose}
          />
        </HStack>
      </Flex>

      <VStack
        flex="1"
        p={4}
        spacing={4}
        overflowY="auto"
        display={isMinimized ? 'none' : 'flex'}
        css={{
          '&::-webkit-scrollbar': { width: '6px' },
          '&::-webkit-scrollbar-track': { background: 'transparent' },
          '&::-webkit-scrollbar-thumb': { background: useColorModeValue('gray.300', 'gray.600'), borderRadius: '3px' },
          '&::-webkit-scrollbar-thumb:hover': { background: useColorModeValue('gray.400', 'gray.500') },
        }}
      >
        {messages.length === 0 ? (
          <VStack spacing={4} justify="center" h="100%" color="gray.500" textAlign="center" px={4}>
            <Box p={4} bg={useColorModeValue('gray.100', 'gray.700')} borderRadius="lg">
              <Text>{initialMessage}</Text>
            </Box>
            <VStack spacing={2} w="100%" align="stretch">
              <Button variant="outline" size="sm" onClick={() => handleSendMessage('¿Qué puedes hacer?')}>
                ¿Qué puedes hacer?
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleSendMessage(`Explícame sobre ${module} para niños de ${ageGroup} años`)}>
                Explícame sobre {module}
              </Button>
            </VStack>
          </VStack>
        ) : (
          messages.map((message) => (
            <Flex
              key={message.id}
              alignSelf={message.role === 'user' ? 'flex-end' : 'flex-start'}
              w="full"
            >
              <HStack 
                spacing={2} 
                alignItems="flex-end" 
                flexDir={message.role === 'user' ? 'row-reverse' : 'row'}
                maxW={{ base: '90%', md: '85%' }}
              >
                <Avatar
                  size="sm"
                  name={message.role === 'user' ? 'Usuario' : 'Asistente'}
                  icon={message.role === 'user' ? <FaUser /> : <FaRobot />}
                  bg={message.role === 'user' ? 'brand.500' : 'gray.500'}
                  color="white"
                />
                <Box
                  px={4}
                  py={2}
                  borderRadius="lg"
                  bg={message.role === 'user' ? 'brand.500' : useColorModeValue('gray.100', 'gray.700')}
                  color={message.role === 'user' ? 'white' : useColorModeValue('gray.800', 'white')}
                  borderBottomLeftRadius={message.role === 'assistant' ? 0 : undefined}
                  borderBottomRightRadius={message.role === 'user' ? 0 : undefined}
                  boxShadow="sm"
                  wordBreak="break-word"
                >
                  <Text whiteSpace="pre-wrap" lineHeight="tall">
                    {message.content}
                  </Text>
                  <Text fontSize="xs" color={message.role === 'user' ? 'brand.200' : 'gray.500'} mt={1} textAlign="right">
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </Box>
              </HStack>
            </Flex>
          ))
        )}
        {isLoading && (
          <HStack alignSelf="flex-start" spacing={2}>
            <Avatar size="sm" name="Asistente" icon={<FaRobot />} bg="gray.500" color="white" />
            <HStack bg={useColorModeValue('gray.100', 'gray.700')} px={4} py={2} borderRadius="lg" boxShadow="sm">
              <Spinner size="sm" />
              <Text>Pensando...</Text>
            </HStack>
          </HStack>
        )}
        <div ref={messagesEndRef} />
      </VStack>

      <Box p={3} borderTopWidth="1px" borderTopColor={borderColor} display={isMinimized ? 'none' : 'block'}>
        <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}>
          <InputGroup>
            <Textarea
              ref={inputRef}
              pr="4.5rem"
              placeholder="Escribe tu mensaje..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              borderRadius="full"
              bg={useColorModeValue('gray.50', 'gray.700')}
              _focus={{ borderColor: 'brand.300', boxShadow: 'outline' }}
              rows={1}
              resize="none"
            />
            <InputRightElement h="full">
              <IconButton
                aria-label="Enviar"
                icon={<FaPaperPlane />}
                colorScheme="brand"
                borderRadius="full"
                onClick={() => handleSendMessage()}
                isDisabled={!input.trim() || isLoading}
                isLoading={isLoading}
              />
            </InputRightElement>
          </InputGroup>
        </form>
        <Flex justify="space-between" mt={2} px={1}>
          <Text fontSize="xs" color="gray.500">
            Shift+Enter para nueva línea
          </Text>
          <Tooltip label="Eliminar historial" placement="top">
            <IconButton
              aria-label="Eliminar historial"
              icon={<FaTrash />}
              size="xs"
              variant="ghost"
              colorScheme="red"
              onClick={() => setIsConfirmOpen(true)}
              isDisabled={messages.length === 0 || isLoading}
            />
          </Tooltip>
        </Flex>
      </Box>

      <Modal isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Eliminar historial</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>¿Seguro que quieres borrar la conversación? Esta acción no se puede deshacer.</Text>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={() => setIsConfirmOpen(false)}>Cancelar</Button>
            <Button colorScheme="red" ml={3} onClick={handleClearChat}>Eliminar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
});

Chatbot.displayName = 'Chatbot';

export default Chatbot;