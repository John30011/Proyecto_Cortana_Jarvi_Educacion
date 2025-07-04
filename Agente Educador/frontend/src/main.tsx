import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import theme from './styles/theme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

type DevToolsPosition = 'top' | 'bottom' | 'left' | 'right';
const devToolsPosition: DevToolsPosition = 'bottom';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutos
    },
  },
});

// Crear el root una sola vez
const container = document.getElementById('root');
if (!container) throw new Error('No se encontró el elemento root');

const root = ReactDOM.createRoot(container);

// Crear una instancia de AuthProvider con el QueryClient
const AppWithProviders = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config?.initialColorMode || 'light'} />
        <App />
        <ReactQueryDevtools position={devToolsPosition} initialIsOpen={false} />
      </ChakraProvider>
    </QueryClientProvider>
  );
};

// Renderizar la aplicación
root.render(
  <React.StrictMode>
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <AppWithProviders />
    </BrowserRouter>
  </React.StrictMode>
);
