// Configuración de pruebas de React
import '@testing-library/jest-dom';

// Mock de fetch global
const mockFetch = jest.fn();
global.fetch = mockFetch as unknown as typeof fetch;

// Mock de console.error para evitar mensajes de error en las pruebas
const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
  console.error = (...args) => {
    if (args[0]?.includes('Error: Could not parse CSS stylesheet')) {
      return;
    }
    originalError(...args);
  };

  console.warn = (...args) => {
    if (args[0]?.includes('Deprecation:')) {
      return;
    }
    originalWarn(...args);
  };
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});
