// Configuración global de Jest
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// Mock de fetch global
// eslint-disable-next-line no-undef
global.fetch = jest.fn();

// Mock de localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

// eslint-disable-next-line no-undef
global.localStorage = localStorageMock;

// Mock de matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock de IntersectionObserver
class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
}

// eslint-disable-next-line no-undef
window.IntersectionObserver = IntersectionObserver;

// Mock de ResizeObserver
class ResizeObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
}

// eslint-disable-next-line no-undef
window.ResizeObserver = ResizeObserver;

// Mock de requestAnimationFrame
// eslint-disable-next-line no-undef
window.requestAnimationFrame = (callback) => {
  return setTimeout(callback, 0);
};

// Mock de cancelAnimationFrame
// eslint-disable-next-line no-undef
window.cancelAnimationFrame = (id) => {
  clearTimeout(id);
};

// Mock de TextEncoder y TextDecoder
// eslint-disable-next-line no-undef
global.TextEncoder = TextEncoder;
// eslint-disable-next-line no-undef
global.TextDecoder = TextDecoder;

// Configuración de react-markdown
jest.mock('react-markdown', () => ({
  __esModule: true,
  default: ({ children }) => <div>{children}</div>,
}));

// Configuración de next/head
jest.mock('next/head', () => {
  return {
    __esModule: true,
    default: ({ children }) => {
      return <>{children}</>;
    },
  };
});

// Configuración de next/router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: {},
      asPath: '',
      push: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
      },
      beforePopState: jest.fn(() => null),
      prefetch: jest.fn(() => Promise.resolve()),
    };
  },
}));

// Mock de los módulos de utilidad comunes
jest.mock('@/utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
}));

// Configuración de las variables de entorno para pruebas
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:8000/api/v1';
process.env.NEXT_PUBLIC_APP_ENV = 'test';
process.env.NEXT_PUBLIC_GA_TRACKING_ID = 'UA-TEST-ID';
process.env.NEXT_PUBLIC_SENTRY_DSN = 'https://test@sentry.io/1234567';

// Limpiar los mocks después de cada prueba
afterEach(() => {
  jest.clearAllMocks();
  jest.restoreAllMocks();
});

// Limpiar los mocks después de todas las pruebas
afterAll(() => {
  jest.resetAllMocks();
});
