# 🎓 GEMINI - Plataforma Educativa

> **Última actualización**: 02 de Julio 2025

## 🚀 Novedades (Julio 2025)

### 🔧 Actualización de Configuración (02/07/2025)
- Integración de Supabase para autenticación
- Configuración de variables de entorno
- Resolución de conflictos de dependencias
- Configuración del servidor de desarrollo en el puerto 3001

### Variables de Entorno Requeridas
Crea un archivo `.env` en la raíz del proyecto frontend con las siguientes variables:

```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima
```

### Instalación de Dependencias
```bash
# Instalar dependencias del frontend
cd frontend
npm install --legacy-peer-deps

# Instalar dependencias del backend
cd ../backend
poetry install
```

### ✨ Características Implementadas
- **Búsqueda y Filtrado Avanzado**
  - 🔍 Búsqueda en tiempo real por título, descripción y etiquetas
  - 🏷️ Filtrado por categorías dinámicas
  - 💡 Sugerencias de búsqueda interactivas
  - 🎯 Visualización clara de filtros activos
  - 🚀 Rendimiento optimizado con React.memo y useMemo

- **Módulo de Cursos Mejorado**
  - 📱 Diseño completamente responsivo
  - 🎨 Tarjetas de curso con visualización de etiquetas
  - ⚡ Carga eficiente de imágenes con placeholders
  - 🌓 Compatibilidad con modo claro/oscuro
  - 🔄 Actualización en tiempo real de los resultados

- **Sistema de Autenticación Completo**
  - Registro de usuarios con validación
  - Inicio de sesión seguro
  - Recuperación de contraseña
  - Verificación de correo electrónico

- **Chatbot Integrado**
  - Integración con n8n para procesamiento de mensajes
  - Respuestas automáticas basadas en IA
  - Historial de conversaciones

- **Mejoras en la Interfaz de Usuario**
  - Diseño responsive mejorado
  - Sistema de notificaciones
  - Tema oscuro/claro

## 🎥 Demo

https://github.com/tu-usuario/gemini/assets/tu-usuario/demo-busqueda-cursos.gif

## 🚀 Inicio Rápido

### Requisitos Previos
- Node.js 16+ y npm 8+
- MongoDB 5.0+
- Python 3.9+
- Poetry (para gestión de dependencias de Python)
- Cuenta en [Supabase](https://supabase.com) (para autenticación)

### Configuración del Entorno

#### Backend
1. Clona el repositorio
2. Instala las dependencias de Python:
   ```bash
   cd backend
   poetry install
   ```
3. Configura las variables de entorno (copia `.env.example` a `.env` y completa los valores)
4. Inicia el servidor de desarrollo:
   ```bash
   poetry run uvicorn app.main:app --reload
   ```

#### Frontend

#### Módulo de Cursos
El módulo de cursos incluye las siguientes características:
- Búsqueda en tiempo real de cursos
- Filtros avanzados por categoría, nivel y duración
- Diseño de tarjetas de curso atractivo y funcional
- Manejo de estados de carga y errores
- Integración con el backend para datos dinámicos

#### Configuración
1. Navega al directorio del frontend:
   ```bash
   cd frontend
   ```
2. Instala las dependencias de Node.js:
   ```bash
   npm install
   ```
3. Configura las variables de entorno (crea un archivo `.env` con las variables necesarias)
4. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
   - La aplicación estará disponible en: http://localhost:3001

## 🛠 Tecnologías Utilizadas

### Backend
- **Framework**: FastAPI + Uvicorn
- **Base de datos**: MongoDB Atlas
- **Autenticación**: JWT + Supabase
- **Validación de datos**: Pydantic
- **ORM**: Motor MongoDB (async)
- **WebSockets**: Para chat en tiempo real
- **Integración con n8n**: Para automatización y chatbot
- **Rate Limiting**: Para protección contra abusos

### Frontend
- **Framework**: React 18 + TypeScript
- **Estilización**: Chakra UI
- **Enrutamiento**: React Router v6
- **Gestión de estado**: React Context + Redux Toolkit
- **Autenticación**: Supabase
- **HTTP Client**: Axios
- **Bundler**: Vite
- **Características**:
  - Formularios con validación
  - Interfaz responsive
  - Tema oscuro/claro
  - Notificaciones en tiempo real

## 📂 Estructura del Proyecto

```
.
├── backend/               # Código fuente del backend
│   ├── app/              # Aplicación principal
│   │   ├── api/          # Rutas de la API
│   │   ├── core/         # Configuración central
│   │   ├── db/           # Conexión a la base de datos
│   │   ├── models/       # Modelos de datos
│   │   └── services/     # Lógica de negocio
│   └── tests/            # Pruebas
│
└── frontend/             # Código fuente del frontend
    ├── public/           # Archivos estáticos
    └── src/              # Código fuente
        ├── components/   # Componentes reutilizables
        ├── contexts/     # Contextos de React
        ├── pages/        # Componentes de página
        └── services/     # Llamadas a la API
```

## 🔒 Seguridad

- Autenticación basada en JWT con Supabase
- CORS estrictamente configurado
- Política de seguridad de contenido (CSP) habilitada
- Rate limiting para endpoints sensibles
- Validación de entrada en todos los formularios
- Variables sensibles en archivos .env (no versionados)
- Auditoría de seguridad periódica
- Protección contra ataques XSS y CSRF

## 📊 Estado del Proyecto

### ✅ Completado
- Sistema de autenticación completo
- Integración con Supabase
- Chatbot con n8n
- Interfaz de usuario mejorada

### 🚧 En Progreso
- Panel de administración
- Sistema de lecciones interactivas
- Evaluaciones y seguimiento de progreso
- Integración con más servicios educativos

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor, lee nuestras pautas de contribución antes de enviar un pull request.

## 📧 Contacto

Para preguntas o soporte, por favor contacta al equipo de desarrollo:
- **Email**: desarrollo@gemini.edu
- **Repositorio**: [GitHub](https://github.com/tu-usuario/gemini)

## 🌟 Agradecimientos
- Equipo de desarrollo por su arduo trabajo
- Comunidad de código abierto por las herramientas utilizadas
- Usuarios por sus valiosos comentarios y sugerencias
