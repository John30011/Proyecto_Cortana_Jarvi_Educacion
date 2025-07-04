import { Suspense } from 'react';
import { Spinner, Box } from '@chakra-ui/react';
import { AuthProvider } from './contexts/AuthContext';
import { ChatbotProvider } from './contexts/ChatbotContext';
import ChatbotBubble from './components/chatbot/ChatbotBubble';
import AppRoutes from './routes';
import SupabaseTest from './test/SupabaseTest';

function App() {
  return (
      <Box p={4}>
        {/* Mostrar el test de Supabase temporalmente */}
        <SupabaseTest />
        
        <AuthProvider>
          <ChatbotProvider>
            <Suspense fallback={<Spinner size="xl" />}>
              <AppRoutes />
              <ChatbotBubble />
            </Suspense>
          </ChatbotProvider>
        </AuthProvider>
      </Box>
  );
}

export default App;