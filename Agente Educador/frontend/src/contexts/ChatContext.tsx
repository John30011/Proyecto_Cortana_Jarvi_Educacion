import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import Chatbot from '@/components/chat/Chatbot';
import FloatingChatButton from '@/components/chat/FloatingChatButton';

export type AgeGroup = '3-5' | '6-8' | '9-12';

interface ChatContextType {
  isChatOpen: boolean;
  openChat: (module?: string, initialMessage?: string) => void;
  closeChat: () => void;
  currentModule: string;
  ageGroup: AgeGroup;
  setAgeGroup: (ageGroup: AgeGroup) => void;
  setChatModule: (module: string) => void;
  sendInitialMessage: (message: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

interface ChatProviderProps {
  children: ReactNode;
  /**
   * Mostrar el botón flotante del chat
   * @default true
   */
  showFloatingButton?: boolean;
  /**
   * Módulo predeterminado para el chat
   * @default 'general'
   */
  defaultModule?: string;
  /**
   * Grupo de edad predeterminado
   * @default '6-8'
   */
  defaultAgeGroup?: AgeGroup;
}

export const ChatProvider = ({ 
  children, 
  showFloatingButton = true,
  defaultModule = 'general',
  defaultAgeGroup = '6-8'
}: ChatProviderProps) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentModule, setCurrentModule] = useState<string>(defaultModule);
  const [initialMessage, setInitialMessage] = useState<string>();
  const [ageGroup, setAgeGroupState] = useState<AgeGroup>(defaultAgeGroup);

  const openChat = useCallback((module: string = defaultModule, message?: string) => {
    setCurrentModule(module);
    if (message) {
      setInitialMessage(message);
    }
    setIsChatOpen(true);
  }, [defaultModule]);

  const closeChat = useCallback(() => {
    setIsChatOpen(false);
    // No limpiamos el mensaje inicial para mantenerlo si se vuelve a abrir
  }, []);

  const setChatModule = useCallback((module: string) => {
    setCurrentModule(module);
  }, []);

  const setAgeGroup = useCallback((newAgeGroup: AgeGroup) => {
    setAgeGroupState(newAgeGroup);
  }, []);

  const sendInitialMessage = useCallback((message: string) => {
    setInitialMessage(message);
    if (!isChatOpen) {
      openChat(currentModule, message);
    }
  }, [currentModule, isChatOpen, openChat]);

  const toggleChat = useCallback(() => {
    setIsChatOpen(prev => !prev);
  }, []);

  return (
    <ChatContext.Provider 
      value={{ 
        isChatOpen, 
        openChat, 
        closeChat, 
        currentModule,
        ageGroup,
        setAgeGroup,
        setChatModule,
        sendInitialMessage
      }}
    >
      {children}
      
      {showFloatingButton && (
        <FloatingChatButton 
          module={currentModule}
          initialMessage={initialMessage}
          onToggle={toggleChat}
          isOpen={isChatOpen}
        />
      )}
      
      {!showFloatingButton && isChatOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <Chatbot 
            module={currentModule} 
            onClose={closeChat}
            initialMessage={initialMessage}
          />
        </div>
      )}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};

// Hook de conveniencia para abrir el chat desde cualquier componente
export const useChatControls = () => {
  const context = useContext(ChatContext);
  
  if (context === undefined) {
    throw new Error('useChatControls must be used within a ChatProvider');
  }
  
  const { openChat, closeChat, sendInitialMessage, setChatModule, setAgeGroup } = context;
  
  return {
    openChat,
    closeChat,
    sendInitialMessage,
    setChatModule,
    setAgeGroup
  };
};
