import { useState, useEffect } from 'react';
import { Box, Button, useDisclosure } from '@chakra-ui/react';
import { FaRobot, FaTimes } from 'react-icons/fa';
import Chatbot from './Chatbot';
import { motion, AnimatePresence } from 'framer-motion';

interface FloatingChatButtonProps {
  module?: string;
  initialMessage?: string;
}

const FloatingChatButton = ({ 
  module = 'general', 
  initialMessage 
}: FloatingChatButtonProps) => {
  const { isOpen, onToggle } = useDisclosure();
  const [isVisible, setIsVisible] = useState(false);

  // Mostrar el botón con un pequeño retraso para la animación
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Animaciones
  const buttonVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.8 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: 'spring',
        stiffness: 300,
        damping: 20
      }
    },
    hover: { 
      scale: 1.05,
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
    },
    tap: { 
      scale: 0.95 
    }
  };

  const chatVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: 'spring',
        stiffness: 300,
        damping: 25
      }
    },
    exit: { 
      opacity: 0, 
      y: 20, 
      scale: 0.95,
      transition: { 
        duration: 0.2 
      } 
    }
  };

  if (!isVisible) return null;

  return (
    <Box
      position="fixed"
      bottom={isOpen ? 4 : 8}
      right={isOpen ? 4 : 8}
      zIndex={1400}
      style={{
        transition: 'all 0.3s ease-in-out',
      }}
    >
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            key="chat"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={chatVariants}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '500px',
              height: 'calc(100vh - 2rem)',
              maxHeight: '700px',
            }}
          >
            <Chatbot 
              module={module} 
              onClose={onToggle} 
              initialMessage={initialMessage}
              defaultOpen={!!initialMessage}
            />
          </motion.div>
        ) : (
          <motion.div
            key="button"
            initial="hidden"
            animate="visible"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Button
              colorScheme="brand"
              size="lg"
              borderRadius="full"
              boxShadow="lg"
              onClick={onToggle}
              leftIcon={<FaRobot />}
              rightIcon={isOpen ? <FaTimes /> : undefined}
              px={6}
              py={6}
              fontSize="lg"
              _hover={{
                transform: 'translateY(-2px)',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              }}
              _active={{
                transform: 'scale(0.98)',
              }}
            >
              Asistente de Aprendizaje
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default FloatingChatButton;
