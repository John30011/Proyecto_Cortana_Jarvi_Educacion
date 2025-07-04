# 📚 Memoria del Proyecto GEMINI

> **Última actualización**: 02 de Julio 2025

## 🔧 Configuración de Supabase y Resolución de Problemas (02/07/2025)

### Problemas Resueltos
- Solucionado error de importación de `@/lib/supabase`
- Configuración de variables de entorno para Supabase
- Instalación de dependencias con `--legacy-peer-deps`
- Configuración del puerto del servidor de desarrollo a 3001

### Archivos Modificados
- `src/App.tsx`: Comentado temporalmente el componente DebugAuth
- `src/lib/supabase.ts`: Configuración del cliente de Supabase
- `vite.config.ts`: Configuración del puerto del servidor
- `package.json`: Actualización de dependencias

### Configuración de Supabase
```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://zddstwkylfyqwwpmidyp.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'tu-clave-anon-aqui';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});
```

## 🔍 Implementación de Búsqueda y Filtrado de Cursos (01/07/2025)

### Características Implementadas

#### Búsqueda Inteligente
- Búsqueda en tiempo real por título, descripción y etiquetas
- Sugerencias de búsqueda interactivas
- Resaltado de términos de búsqueda
- Manejo de estados de carga y vacío

#### Filtrado Avanzado
- Filtrado por categorías dinámicas
- Filtros combinados (búsqueda + categoría)
- Visualización clara de filtros activos
- Opción para limpiar todos los filtros

#### Mejoras en la Interfaz de Usuario
- Diseño responsivo para todos los dispositivos
- Indicadores visuales de búsqueda activa
- Mensajes claros cuando no hay resultados
- Transiciones suaves entre estados

### Tecnologías Utilizadas
- **Frontend**: React 18 con TypeScript
- **UI**: Chakra UI para componentes accesibles
- **Gestión de Estado**: React Hooks (useState, useMemo)
- **Tipado**: TypeScript para mejor mantenibilidad

### Estructura del Código
- **Componentes Principales**:
  - `CursosPage`: Página principal con búsqueda y listado
  - `CourseCard`: Tarjeta individual de curso con etiquetas
  - `SearchBar`: Componente de búsqueda con sugerencias
  - `CategoryFilter`: Selector de categorías

### Optimizaciones
- Uso de `useMemo` para evitar recálculos innecesarios
- Renderizado condicional de componentes
- Lazy loading para imágenes
- Manejo eficiente del estado de búsqueda

### Próximas Mejoras
- [ ] Búsqueda por rango de precios
- [ ] Filtrado por nivel de dificultad
- [ ] Guardar búsquedas recientes
- [ ] Integración con API de recomendaciones

## 🔄 Configuración del Entorno (01/07/2025) - Actualización

### Dependencias Instaladas (01/07/2025)

#### Requisitos del Sistema
- **Sistema Operativo**: Windows
- **Python**: 3.9.12
- **Poetry**: 2.1.3
- **MongoDB**: En ejecución en localhost:27017
- **Node.js**: (Opcional, para desarrollo frontend)

#### Dependencias Principales (Backend)
- fastapi==0.95.2
- pydantic==1.10.12
- uvicorn==0.24.0.post1 (con dependencias estándar)
- pymongo==4.13.2
- python-jose[cryptography]==3.5.0
- python-multipart==0.0.6
- python-dotenv==1.0.0
- email-validator==2.2.0
- httpx==0.24.1 (para integración con n8n)
- websockets==11.0.3 (para soporte de WebSockets)
- n8n-python==0.1.0 (cliente para integración con n8n)

#### Dependencias de Desarrollo
- pytest==7.4.0
- pytest-cov==4.1.0
- pytest-asyncio==0.23.5
- black==23.7.0
- isort==5.12.0
- mypy==1.5.0
- pytest-mock==3.12.0
- pytest-httpx==0.25.0

### Configuración del Entorno

#### Archivo .env
Se creó y configuró el archivo `.env` basado en `.env.example` con la siguiente configuración:

```env
# Configuración de la aplicación
DEBUG=True
ENVIRONMENT=development
HOST=0.0.0.0
PORT=8000

# Configuración de la API
API_V1_STR=/api/v1
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080  # 7 días

# Configuración de la base de datos
MONGODB_URL=mongodb://localhost:27017
DB_NAME=gemini_educacion

# Configuración de CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:8000,http://127.0.0.1:3000,http://127.0.0.1:8000

# Configuración de n8n para el chatbot
N8N_WEBHOOK_URL=http://localhost:5678/webhook/gemini
N8N_API_KEY=your-n8n-api-key

# Configuración de correo electrónico
SMTP_TLS=True
SMTP_PORT=587
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-email-password
EMAILS_FROM_EMAIL=no-reply@gemini.edu
EMAILS_FROM_NAME=GEMINI Educativo

# Configuración de seguridad
SECURE_COOKIES=True
SESSION_COOKIE_NAME=gemini_session
SESSION_SECRET_KEY=your-session-secret-key-here
```

#### Variables de Entorno Requeridas
- `MONGODB_URL`: URL de conexión a MongoDB (ej: `mongodb://localhost:27017`)
- `DB_NAME`: Nombre de la base de datos (ej: `gemini_educacion`)
- `SECRET_KEY`: Clave secreta para firmar los tokens JWT
- `ALGORITHM`: Algoritmo para firmar los tokens (por defecto: `HS256`)
- `ACCESS_TOKEN_EXPIRE_MINUTES`: Tiempo de expiración de los tokens (en minutos)
- `CORS_ORIGINS`: Orígenes permitidos para CORS (separados por comas)

### Solución de Problemas
1. **Problema**: Error de dependencia faltante `email-validator`
   - **Solución**: Se instaló manualmente con `poetry add pydantic[email]`

2. **Problema**: Conflicto de versiones con `pydantic`
   - **Solución**: Se ajustaron las versiones para evitar conflictos:
     - fastapi==0.95.2
     - pydantic==1.10.12
     - Se eliminó pydantic-settings para evitar conflictos

## 🚀 Avances Recientes (30/06/2025 - 01/07/2025)

### Módulo de Cursos Mejorado
- **Mejoras en CourseCard**
  - Diseño de tarjetas de cursos más atractivo y profesional
  - Efectos de hover para mejor interactividad
  - Manejo de imágenes con placeholders y estados de carga
  - Mejor presentación de información con iconos y tooltips
  - Formato mejorado para mostrar el número de estudiantes
  - Integración con el sistema de calificaciones

- **Página de Cursos (CursosPage)**
  - Búsqueda en tiempo real de cursos
  - Sistema de filtrado avanzado por categoría, nivel y duración
  - Diseño responsivo que se adapta a diferentes tamaños de pantalla
  - Integración con el backend para obtener datos dinámicos
  - Manejo de estados de carga y errores

- **Características Técnicas**
  - Uso de React Hooks para manejo de estado (useState, useMemo)
  - Componentes reutilizables con TypeScript
  - Estilizado con Chakra UI para una interfaz consistente
  - Optimización de rendimiento con React.memo
  - Tipado estricto para mejor mantenibilidad

### Frontend Mejorado
- Implementación completa del módulo de registro de usuarios con validaciones
- Mejora del sistema de login con manejo de errores mejorado
- Implementación del flujo de recuperación de contraseña
- Integración del sistema de notificaciones
- Mejoras en la interfaz de usuario y experiencia de usuario

### Integración con Chatbot
- Configuración del webhook para integración con n8n
- Implementación del servicio de chat en tiempo real
- Configuración de respuestas automáticas basadas en IA
- Integración con la base de datos de MongoDB para historial de conversaciones

### Seguridad
- Implementación de rate limiting para endpoints de autenticación
- Mejora en la validación de tokens JWT
- Configuración de CORS más estricta
- Auditoría de seguridad en los formularios de autenticación

## 👥 Usuarios de Prueba Disponibles (01/07/2025)

### Credenciales de Acceso

#### 1. Administrador
- **Usuario**: `adminuser`
- **Contraseña**: `Admin123!`
- **Rol**: `admin`
- **Grupo de edad**: 9-12 años
- **Acceso**: Acceso completo al sistema
- **Endpoint de login**: `POST /api/v1/auth/login`

#### 2. Niño (6-8 años)
- **Usuario**: `nino2`
- **Contraseña**: `Nino123!` (asumida, ajustar según corresponda)
- **Rol**: `child`
- **Grupo de edad**: 6-8 años
- **Acceso**: Contenido educativo adaptado a su grupo de edad

#### 3. Niño (9-12 años)
- **Usuario**: `nino3`
- **Contraseña**: `Nino123!` (asumida, ajustar según corresponda)
- **Rol**: `child`
- **Grupo de edad**: 9-12 años
- **Acceso**: Contenido educativo adaptado a su grupo de edad

#### 4. Padre/Madre
- **Usuario**: `padre1`
- **Contraseña**: `Padre123!` (asumida, ajustar según corresponda)
- **Rol**: `parent`
- **Grupo de edad**: N/A
- **Acceso**: Seguimiento del progreso de los niños a su cargo

#### 5. Profesor
- **Usuario**: `profesor1`
- **Contraseña**: `Profe123!` (asumida, ajustar según corresponda)
- **Rol**: `teacher`
- **Grupo de edad**: N/A
- **Acceso**: Gestión de clases y seguimiento de estudiantes

### Notas Importantes
- Las contraseñas deben cumplir con los requisitos de seguridad:
  - Mínimo 8 caracteres
  - Al menos una letra mayúscula
  - Al menos una letra minúscula
  - Al menos un número
  - Al menos un carácter especial (ej: !@#$%^&*)
- Los tokens JWT expiran después del tiempo configurado en `ACCESS_TOKEN_EXPIRE_MINUTES` (por defecto: 7 días)
- Se recomienda cambiar las contraseñas predeterminadas en un entorno de producción

## 🚀 Iniciando el Servidor de Desarrollo

### 1. Iniciar MongoDB
Asegúrate de que MongoDB esté en ejecución localmente en el puerto 27017.

### 2. Configurar el Entorno
Asegúrate de que el archivo `.env` esté configurado correctamente en el directorio del backend.

### 3. Instalar Dependencias
```bash
# Navegar al directorio del proyecto
cd "ruta\al\proyecto\Agente Educador"

# Instalar dependencias con Poetry
poetry install

# Activar el entorno virtual
poetry shell
```

### 4. Iniciar el Servidor de Desarrollo
```bash
# Navegar al directorio del backend
cd backend

# Iniciar el servidor con Uvicorn
poetry run uvicorn main:app --reload
```

### 5. Probar la API
Una vez que el servidor esté en ejecución, puedes acceder a:
- **Documentación interactiva (Swagger UI)**: http://127.0.0.1:8000/docs
- **Documentación alternativa (ReDoc)**: http://127.0.0.1:8000/redoc
- **Endpoint de salud**: http://127.0.0.1:8000/api/v1/health

## 🔍 Probando los Endpoints

### 1. Autenticación

#### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "username": "adminuser",
  "password": "Admin123!"
}
```

Respuesta exitosa (200 OK):
```json
{
  "access_token": "tu_token_jwt_aqui",
  "token_type": "bearer",
  "user": {
    "username": "adminuser",
    "email": "admin@example.com",
    "role": "admin",
    "age_group": "9-12"
  }
}
```

#### Uso del Token
Incluye el token en el encabezado `Authorization` de las solicitudes posteriores:
```
Authorization: Bearer tu_token_jwt_aqui
```

### 2. Endpoints Protegidos

#### Obtener perfil de usuario
```http
GET /api/v1/users/me
Authorization: Bearer tu_token_jwt_aqui
```

#### Actualizar perfil
```http
PATCH /api/v1/users/me
Authorization: Bearer tu_token_jwt_aqui
Content-Type: application/json

{
  "email": "nuevo@email.com"
}
```

#### Cambiar contraseña
```http
POST /api/v1/auth/change-password
Authorization: Bearer tu_token_jwt_aqui
Content-Type: application/json

{
  "current_password": "Admin123!",
  "new_password": "NuevaContraseña123!"
}
```

## 🔄 Resolución de Problemas Comunes

### 1. Error de conexión a MongoDB
- Verifica que MongoDB esté en ejecución
- Revisa la configuración de `MONGODB_URL` en el archivo `.env`

### 2. Error de autenticación
- Verifica que el nombre de usuario y contraseña sean correctos
- Asegúrate de que el token JWT sea válido y no haya expirado

### 3. Error de CORS
- Verifica que el origen de la solicitud esté incluido en `CORS_ORIGINS`
- Asegúrate de que el frontend esté configurado correctamente

### 4. Error 500 en el servidor
- Revisa los logs del servidor para más detalles
- Verifica que todas las variables de entorno estén configuradas correctamente

### Usuario con Error:
- **Usuario**: nino1
- **Rol**: child
- **Grupo de edad**: 3-5
- **Estado**: Error en el registro (problema con caracteres especiales en PowerShell)

### Notas:
- Las contraseñas siguen el formato requerido: mayúsculas, minúsculas, números y caracteres especiales.
- Los usuarios están listos para ser utilizados en el sistema.

## 🔧 Resolución de Problema: Registro de Usuarios (28/06/2024)

### Problema Detectado
- **Fecha**: 28 de junio de 2024
- **Descripción**: Error 500 al intentar registrar un nuevo usuario debido a problemas con el mapeo del campo `_id` de MongoDB en el modelo Pydantic.
- **Archivo afectado**: `backend/app/models/user.py`
- **Endpoint afectado**: `POST /api/v1/auth/register`

### Solución Implementada
1. **En el modelo `UserResponse`**:
   - Se aseguró que el campo `id` tenga un alias `_id` para que coincida con el formato de MongoDB.
   
2. **En el endpoint de registro (`/api/v1/auth/register`)**:
   - Se modificó para usar `user.dict(by_alias=True)` y así incluir el campo `_id` en la respuesta.
   - Se agregó lógica para asegurar que el campo `_id` esté presente en la respuesta.

3. **En el repositorio de usuarios**:
   - Se implementó la conversión explícita del `ObjectId` de MongoDB a string para el campo `_id` al crear instancias de `UserInDB`.

### Resultado
- Usuario de prueba creado exitosamente:
  - **Usuario**: testuser145831
  - **Email**: test_145831@example.com
  - **ID**: 68603b59b47a67373ef03c2a

## 🚀 Despliegue del Backend (28/06/2024)

### Configuración del Servidor
- **Fecha de despliegue**: 28 de junio de 2024
- **Entorno**: Desarrollo local
- **URL base**: http://127.0.0.1:8000

### Estado del Servicio
- **Estado**: 🟢 En ejecución
- **Proceso ID**: 12356
- **Hora de inicio**: 28/06/2024 14:31:59

### Configuración de la Base de Datos
- **Motor**: MongoDB
- **Base de datos**: gemini_educador
- **Conexión**: Local (mongodb://localhost:27017)

### Estadísticas de la Base de Datos
- **Total colecciones**: 6
- **Usuarios registrados**: 4
- **Módulos cargados**: 6
- **Tamaño total**: ~0.47 MB
  - Datos: 0.0 MB
  - Índices: 0.38 MB
  - Almacenamiento: 0.09 MB

### Endpoints Disponibles
1. **Documentación Swagger UI**
   - URL: http://127.0.0.1:8000/docs
   - Descripción: Interfaz interactiva para probar los endpoints de la API

2. **Documentación ReDoc**
   - URL: http://127.0.0.1:8000/redoc
   - Descripción: Documentación técnica detallada de la API

3. **Health Check**
   - URL: http://127.0.0.1:8000/api/v1/health
   - Método: GET
   - Propósito: Verificar el estado del servicio

### Usuarios del Sistema
- **Usuario administrador**:
  - Nombre de usuario: admin
  - Estado: Activo
  - Rol: Administrador

### Notas de Despliegue
- Se utilizó Uvicorn como servidor ASGI
- El modo de recarga automática (--reload) está activado para desarrollo
- La aplicación se ejecuta en el puerto 8000 por defecto

## 🌿 Configuración de Git Flow (28/06/2024)

### Ramas Creadas

#### 1. `feature/nueva-funcionalidad`
- **Propósito**: Desarrollar nuevas características
- **Origen**: `develop`
- **Destino**: `develop`
- **Uso**: Para agregar nuevas funcionalidades al proyecto

#### 2. `hotfix/correccion-urgente`
- **Propósito**: Corregir errores críticos en producción
- **Origen**: `main`
- **Destino**: `main` y `develop`
- **Uso**: Para parches urgentes que necesitan ser desplegados rápidamente

#### 3. `release/v1.0.0`
- **Propósito**: Preparar una nueva versión para producción
- **Origen**: `develop`
- **Destino**: `main` y `develop`
- **Uso**: Para preparar el lanzamiento de una nueva versión

---


## 🎨 Actualizaciones de la Interfaz de Usuario

### 📅 27 de Junio 2024 - Página Principal

#### Cambios Realizados
1. **Título Principal**
   - Se actualizó el título principal de "Educador AI" a "Cortana & Jarvi AI"
   - Se mantuvo el eslogan "Aprende, Juega y Crece con"

2. **Sección de Video**
   - Se reemplazó el placeholder de ilustración por un reproductor de YouTube responsivo
   - Se integró el video de presentación: [Enlace al video](https://youtu.be/nLeCPLdeGzs)
   - Se implementó con un iframe directo para evitar dependencias adicionales
   - Diseño responsivo que se oculta en dispositivos móviles

3. **Mejoras Técnicas**
   - Se corrigió la importación no utilizada de 'Flex' en Home.tsx
   - Se optimizó el diseño para mantener la relación de aspecto 16:9 del video
   - Se añadieron estilos personalizados para una mejor integración visual

#### Archivos Modificados
- `frontend/src/pages/Home.tsx`
- `frontend/src/routes.tsx` (nuevo archivo de rutas)

---


## 🔧 Configuración del Entorno de Desarrollo

### 🗄️ Base de Datos MongoDB

#### Configuración Local
```bash
# Instalación en Windows
# 1. Descargar MongoDB Community Server desde: https://www.mongodb.com/try/download/community
# 2. Instalar siguiendo el asistente con configuración predeterminada

# Iniciar servicio de MongoDB (Windows Services)
net start MongoDB

# Verificar instalación
mongod --version
```

#### Configuración en el Proyecto
Archivo: `backend/.env`
```env
# MongoDB Configuration
MONGODB_URL=mongodb://localhost:27017/
DB_NAME=gemini_educador

# JWT Configuration
SECRET_KEY=tu_clave_secreta_muy_segura_aqui_123!
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440  # 24 horas

# App Configuration
APP_NAME=GEMINI
APP_ENV=development
DEBUG=True

# CORS
FRONTEND_URL=http://localhost:3000
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# n8n Webhook
N8N_WEBHOOK_URL=http://localhost:5678/webhook/gemini
```

### ⚙️ Configuración del Backend (FastAPI)

#### Requisitos
- Python 3.8+
- pip (gestor de paquetes de Python)
- MongoDB instalado localmente

#### Instalación
```bash
# Navegar al directorio del backend
cd backend

# Crear entorno virtual
python -m venv venv

# Activar entorno virtual (Windows)
.\venv\Scripts\activate

# Instalar dependencias
pip install -r requirements_core.txt
```

#### Iniciar el servidor
```bash
# En el directorio backend
uvicorn main:app --reload

# La API estará disponible en:
# - Documentación interactiva: http://localhost:8000/docs
# - Documentación alternativa: http://localhost:8000/redoc
```

### 🖥️ Configuración del Frontend (React + Vite)

#### Requisitos
- Node.js 16+
- npm o yarn

#### Instalación
```bash
# Navegar al directorio del frontend
cd frontend

# Instalar dependencias
npm install
```

#### Configuración
Archivo: `frontend/vite.config.ts`
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          ['@babel/plugin-proposal-decorators', { legacy: true }],
          ['@babel/plugin-proposal-class-properties', { loose: true }],
        ],
      },
    }),
    tsconfigPaths(),
  ],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
```

#### Iniciar el servidor de desarrollo
```bash
# En el directorio frontend
npm run dev

# La aplicación estará disponible en:
# http://localhost:3000
```

## 🚀 Configuración del Frontend (30 Junio 2025)

### Configuración de Vite
- Puerto: 3001
- Modo: Desarrollo
- Host: 0.0.0.0 (accesible desde cualquier dirección IP)
- Apertura automática del navegador: Habilitada

### Estructura de Carpetas Principales
- `/src` - Código fuente de la aplicación
  - `/components` - Componentes reutilizables
  - `/contexts` - Contextos de React (ej: Autenticación)
  - `/pages` - Componentes de página
  - `/services` - Servicios y llamadas a la API

### Configuración de Autenticación
- Proveedor: Supabase
- Tabla de perfiles: `profiles`
- Campos del perfil:
  - `id` (UUID, referencia a auth.users)
  - `full_name` (texto)
  - `avatar_url` (texto, opcional)
  - `role` (enum: 'student', 'teacher', 'admin')

### Variables de Entorno
- `VITE_SUPABASE_URL`: URL del proyecto Supabase
- `VITE_SUPABASE_ANON_KEY`: Clave anónima de Supabase

### Scripts Disponibles
- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza la versión de producción

## 🔒 Configuración de Seguridad (30 Junio 2025)

### Política de Seguridad de Contenido (CSP)
- Configurada CSP para permitir contenido multimedia de Google Video y YouTube
- Dominios permitidos:
  - `*.googlevideo.com`
  - `*.youtube.com`
  - `*.ytimg.com`
  - `rr*.googlevideo.com`
  - `*.sn-*.googlevideo.com`
- Configuración en `vite.config.ts` usando `vite-plugin-html`

## 📌 Estado Actual (30 Junio 2025)

### Frontend (React + TypeScript + Chakra UI)
- ✅ Página de inicio completamente funcional con secciones:
  - Header con botones de autenticación
    - Botón "Iniciar Sesión" (estilo outline)
    - Botón "Registrarse" (estilo sólido)
    - Diseño responsive y adaptativo al tema claro/oscuro
  - Hero con video de presentación
  - Características principales
  - Video demostrativo
  - Cursos populares
  - Llamado a la acción
- ✅ Integración con YouTube para videos embebidos
- ✅ Diseño responsivo para móviles y escritorio
- ✅ Imágenes optimizadas para web
- ✅ Animaciones con Framer Motion
- ✅ Tipado estricto con TypeScript

### Backend (FastAPI + MongoDB)

### Backend (FastAPI + MongoDB)
- ✅ Configuración inicial completada
- ✅ Conexión exitosa a MongoDB Local
- ✅ Modelos de datos implementados (usuarios, módulos, progreso)
- ✅ API documentada con Swagger UI (/docs)
- ✅ Autenticación básica implementada
- ✅ Scripts de inicialización de base de datos

### Frontend (React + Vite)
- ⚠️ Configuración inicial completada
- ⚠️ Pendiente de integración con el backend

### Próximos Pasos
1. Configurar n8n localmente para el chatbot
2. Desarrollar módulo de Matemáticas
3. Implementar sistema de recompensas

---

## 📝 Historial de Cambios

### 28 Junio 2025: Configuración de MongoDB Local
- Migrado de MongoDB Atlas a MongoDB Local para desarrollo
- Resueltos problemas de conexión con la base de datos
- Corregidos errores en la inicialización de la base de datos
- Actualizada documentación de configuración

### 27 Junio 2025: Reestructuración del Proyecto
- Eliminada configuración de Docker
- Configurado entorno de desarrollo local
- Actualizadas dependencias del proyecto

Se ha eliminado la configuración de Docker para el despliegue de los servicios (backend, frontend, MongoDB, n8n). El archivo `docker-compose.yml` ya no se utilizará para el despliegue.

## 2. Despliegue Local del Backend de Python (FastAPI)

Para ejecutar el backend de Python localmente, se deben seguir los siguientes pasos:

1.  **Navegar a la carpeta `backend`**:
    ```bash
    cd C:\Users\Jonathan\OneDrive\Documentos\Jonathan Blanco\Cursos\Proyecto Google Cli\Projecto Educador\Agente Educador\backend
    ```
2.  **Crear un entorno virtual**:
    ```bash
    python -m venv venv
    ```
3.  **Activar el entorno virtual**:
    *   En Windows:
        ```bash
        .\venv\Scripts\activate
        ```
4.  **Instalar las dependencias**:
    ```bash
    pip install -r requirements_core.txt
    ```
    **Nota de error y solución:** Si encuentras un error relacionado con `pydantic-core` y la falta de Rust/Cargo, necesitas instalar Rust y Cargo desde [https://rustup.rs/](https://rustup.rs/). Después de la instalación, reinicia tu terminal y vuelve a intentar `pip install -r requirements.txt`. Si el error persiste con `TypeError: ForwardRef._evaluate() missing 1 required keyword-only argument: 'recursive_guard'`, actualiza `pip` y `setuptools` (`python -m pip install --upgrade pip` y `pip install --upgrade setuptools`), y luego modifica `requirements.txt` para usar `pydantic==2.0.0`. Si el problema de `pydantic-core` persiste, se modificó `requirements_core.txt` para usar `fastapi==0.95.2`, `pydantic==1.10.12` y `pydantic-settings==1.99` para evitar la compilación desde la fuente. Finalmente, se eliminó `pydantic-settings` de `requirements_core.txt` debido a conflictos de dependencia. **Se revirtió `requirements_core.txt` a las versiones originales (`fastapi==0.104.1`, `pydantic==2.5.1`, `pydantic-settings==2.0.3`) para intentar la instalación con las herramientas de compilación de Rust y C++ ya instaladas. Se realizó una limpieza profunda del entorno virtual y se reinstalaron las dependencias. Finalmente, se ajustaron las versiones de `fastapi`, `pydantic` y `pydantic-settings` a `fastapi==0.95.2`, `pydantic==1.10.12` y se eliminó `pydantic-settings` para resolver conflictos de dependencia y permitir la instalación exitosa.**

## 3. Configuración Local de n8n

Para trabajar con n8n de forma local, se debe instalar y ejecutar globalmente:

1.  **Instalar n8n globalmente**:
    ```bash
    npm install -g n8n
    ```
2.  **Iniciar n8n**:
    ```bash
    n8n start
    ```
    n8n estará disponible en `http://localhost:5678`.

## 4. Despliegue Local del Frontend (Vite)

Para ejecutar el frontend localmente, se deben seguir los siguientes pasos:

1.  **Navegar a la carpeta `frontend`**:
    ```bash
    cd C:\Users\Jonathan\OneDrive\Documentos\Jonathan Blanco\Cursos\Proyecto Google Cli\Projecto Educador\Agente Educador\frontend
    ```
2.  **Instalar las dependencias de Node.js**:
    ```bash
    npm install
    ```
3.  **Iniciar el servidor de desarrollo del frontend**:
    ```bash
    npm run dev
    ```
    El frontend estará disponible en la URL que te proporcione la terminal (ej. `http://localhost:3001`).

    **Nota de error y solución (Frontend):**
    *   Se encontró un error `Failed to resolve import "@/pages/Home"`. Esto se debió a que el archivo `Home.tsx` no existía en `src/pages`. Se corrigió eliminando la línea de importación de `Home` en `src/routes/index.tsx`.
    *   Se encontró un error `[vite:css] @.cache\n8n\public\assets\useImportCurlCommand-DVjZNYjv.js must precede all other statements...`. Esto se debió a una línea `@import` mal formada en `src/styles/index.css`. Se corrigió reemplazando la línea `@import` con una versión limpia para eliminar cualquier carácter oculto o problema de formato. Posteriormente, se comentó la línea `@import` en `src/styles/index.css` para aislar el problema. Se intentó una limpieza de `node_modules`, `package-lock.json` y `.vite` antes de reinstalar las dependencias. Finalmente, se comentó la línea `<link>` de las fuentes `Inter` y `Fredoka One` en `index.html` para eliminar posibles conflictos. Se modificó la ruta `*` a `/*` en `src/routes/index.tsx` para hacerla explícitamente absoluta. Se comentó la importación de `src/styles/index.css` en `src/main.jsx` para aislar el problema de CSS. Se simplificó `src/App.tsx` para mostrar un mensaje básico y verificar el renderizado de React. **Se confirmó que el frontend renderiza correctamente el mensaje básico.**

## 5. Actualización de `checklist.md`

Se ha actualizado el archivo `checklist.md` para reflejar que la integración con n8n ahora se considera para configuración local y que el archivo `CORTANA.md` está actualizado.

## 6. Renombrado de `Gemini.md` a `CORTANA.md`

Se ha intentado renombrar el archivo `Gemini.md` a `CORTANA.md` para que el nombre del archivo coincida con el contenido. Sin embargo, debido a problemas con los comandos de renombrado en Windows, esta acción no se ha completado. Se recomienda al usuario renombrar el archivo manualmente si lo desea.

## 7. Creación de Backend en Node.js

Se ha creado un backend simple en Node.js utilizando Express.js para reemplazar el backend de Python. Los pasos para su configuración son:

1.  **Crear la carpeta `nodejs-backend`**:
    ```bash
    mkdir C:\Users\Jonathan\OneDrive\Documentos\Jonathan Blanco\Cursos\Proyecto Google Cli\Projecto Educador\Agente Educador\nodejs-backend
    ```
2.  **Inicializar el proyecto Node.js**:
    ```bash
    npm init -y
    ```
3.  **Instalar Express.js y CORS**:
    ```bash
    npm install express cors
    ```
4.  **Crear el archivo `server.js`** con un endpoint de ejemplo (`/api/hello`):
    ```javascript
    const express = require('express');
    const cors = require('cors');

    const app = express();
    const port = 8000; // Puerto al que el frontend ya está configurado para proxy

    app.use(cors());
    app.use(express.json());

    // Endpoint de ejemplo
    app.get('/api/hello', (req, res) => {
      res.json({ message: '¡Hola desde el backend de Node.js!' });
    });

    // Iniciar el servidor
    app.listen(port, () => {
      console.log(`Servidor Node.js escuchando en http://localhost:${port}`);
    });
    ```
5.  **Iniciar el servidor de Node.js**:
    ```bash
    node server.js
    ```
    El servidor estará disponible en `http://localhost:8000`.
