// Configuración de la aplicación
export const CONFIG = {
    // URL base de la API
    API_BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
    
    // Configuración de autenticación
    AUTH: {
        TOKEN_KEY: 'gemini_auth_token',
        REFRESH_TOKEN_KEY: 'gemini_refresh_token',
        TOKEN_EXPIRY: 7 * 24 * 60 * 60 * 1000, // 7 días en milisegundos
    },
    
    // Grupos de edad soportados
    AGE_GROUPS: [
        { id: '3-5', label: '3-5 años' },
        { id: '6-8', label: '6-8 años' },
        { id: '9-12', label: '9-12 años' }
    ],
    
    // Módulos educativos
    MODULES: [
        { id: 'matematicas', name: 'Matemáticas', icon: '🧮', color: 'blue' },
        { id: 'ciencia', name: 'Ciencia', icon: '🔬', color: 'green' },
        { id: 'historia', name: 'Historia', icon: '🏛️', color: 'amber' },
        { id: 'salud', name: 'Salud', icon: '❤️', color: 'red' },
        { id: 'deportes', name: 'Deportes', icon: '⚽', color: 'emerald' },
        { id: 'valores', name: 'Valores', icon: '✨', color: 'purple' }
    ],
    
    // Configuración del chat
    CHAT: {
        MAX_MESSAGES: 100, // Número máximo de mensajes a mantener en el historial
        TYPING_INDICATOR_DELAY: 1000, // Tiempo de espera antes de mostrar "escribiendo..."
        MESSAGE_DELAY: 500, // Retraso entre mensajes en milisegundos
    },
    
    // Configuración de notificaciones
    NOTIFICATIONS: {
        AUTO_HIDE: 5000, // Tiempo en ms antes de ocultar notificaciones automáticamente
        MAX_VISIBLE: 3, // Número máximo de notificaciones visibles a la vez
    },
    
    // Configuración del reproductor de audio
    AUDIO: {
        ENABLED: true,
        VOLUME: 0.7,
        RATES: [0.5, 0.75, 1, 1.25, 1.5, 2],
        DEFAULT_RATE: 1
    },
    
    // Configuración de accesibilidad
    ACCESSIBILITY: {
        FONT_SIZES: [
            { value: 'small', label: 'Pequeño', class: 'text-sm' },
            { value: 'medium', label: 'Mediano', class: 'text-base' },
            { value: 'large', label: 'Grande', class: 'text-lg' },
            { value: 'xlarge', label: 'Muy grande', class: 'text-xl' }
        ],
        DEFAULT_FONT_SIZE: 'medium',
        HIGH_CONTRAST: false,
        REDUCE_MOTION: false
    },
    
    // Configuración de temas
    THEMES: [
        { id: 'light', name: 'Claro', icon: '☀️' },
        { id: 'dark', name: 'Oscuro', icon: '🌙' },
        { id: 'high-contrast', name: 'Alto contraste', icon: '⚫' }
    ],
    
    // Configuración de privacidad
    PRIVACY: {
        ANALYTICS: false, // Habilitar/deshabilitar análisis
        ERROR_REPORTING: true, // Habilitar/deshabilitar informes de error
        SAVE_CHAT_HISTORY: true // Guardar historial de chat localmente
    }
};

// Exportar configuración por defecto
export default CONFIG;
