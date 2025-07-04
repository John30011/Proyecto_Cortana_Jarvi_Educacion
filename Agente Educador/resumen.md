# 📚 Resumen del Proyecto GEMINI

## 📅 Última Actualización: 30 de Junio de 2025

## 🎨 Mejoras Recientes en el Frontend

### 🔒 Configuración de Seguridad
- Implementada Política de Seguridad de Contenido (CSP) para:
  - Permitir contenido multimedia de Google Video y YouTube
  - Habilitar iframes de YouTube
  - Permitir conexiones seguras a servidores de video de Google
  - Configuración realizada en `vite.config.ts` usando `vite-plugin-html`

### 🔐 Autenticación de Usuarios
- Implementación de botones de autenticación en el encabezado
  - Botón "Iniciar Sesión" con estilo outline
  - Botón "Registrarse" con estilo sólido
  - Diseño responsive y adaptativo al tema claro/oscuro
  - Rutas configuradas para el flujo de autenticación

### 🖼️ Actualización de Imágenes
- Se reemplazaron todas las imágenes de marcador de posición por imágenes profesionales de alta calidad
- Imágenes optimizadas para web con carga rápida
- Temática consistente en todo el sitio

### 🎥 Integración de Videos
- Se implementó reproductor de video embebido de YouTube
- Videos configurados con autoplay, mute y loop para la sección hero
- Sección de demostración con video explicativo

### 🎨 Mejoras de UI/UX
- Diseño responsivo que se adapta a diferentes tamaños de pantalla
- Transiciones suaves y animaciones con Framer Motion
- Paleta de colores consistente con la identidad de la marca
- Tipografía mejorada para mejor legibilidad

### 🛠️ Optimizaciones Técnicas
- Código refactorizado para mejor mantenibilidad
- Tipos de TypeScript mejorados
- Eliminación de código duplicado
- Mejor manejo de estados y efectos

## 📌 Visión General
Plataforma educativa interactiva para niños de 3 a 12 años que combina aprendizaje con diversión mediante juegos, actividades interactivas y un asistente educativo inteligente.

## 🎯 Características Principales

### Para Niños
- **Módulos Educativos** adaptados por edades (3-5, 6-8, 9-12 años)
- **Chatbot Interactivo** con IA para aprendizaje personalizado
- **Sistema de Recompensas** con logros y stickers educativos
- **Interfaz Amigable** diseñada específicamente para niños
- **Múltiples Materias**: Matemáticas, Ciencia, Historia, Salud, Deportes, Valores Espirituales

### Para Padres
- **Panel de Control** para seguimiento del progreso
- **Contenido Supervisado** y seguro para niños
- **Reportes de Actividad** detallados

## 🚀 Activación de Servicios

### Configuración del Entorno (28/06/2024)

#### Dependencias Instaladas
- **Python**: 3.9.12
- **Poetry**: 2.1.3
- **MongoDB**: En ejecución en localhost:27017
- **Dependencias principales**:
  - fastapi==0.95.2
  - pydantic==1.10.12
  - uvicorn==0.24.0.post1
  - pymongo==4.13.2
  - python-jose==3.5.0
  - email-validator==2.2.0

#### Configuración del Entorno
Se creó y configuró el archivo `.env` con la configuración de conexión a MongoDB y parámetros de la aplicación.

#### Solución de Problemas
1. **Error de dependencia faltante**: Se instaló manualmente `email-validator`
2. **Conflicto de versiones**: Se ajustaron las versiones de las dependencias para evitar conflictos

## 👥 Usuarios de Prueba Creados (28/06/2024)

### Usuarios Creados Exitosamente:

1. **Usuario Administrador**
   - **Usuario**: adminuser
   - **Rol**: admin
   - **Grupo de edad**: 9-12
   - **Estado**: Creado exitosamente (201)

2. **Usuario Niño (6-8 años)**
   - **Usuario**: nino2
   - **Rol**: child
   - **Grupo de edad**: 6-8
   - **Estado**: Creado exitosamente (201)

3. **Usuario Niño (9-12 años)**
   - **Usuario**: nino3
   - **Rol**: child
   - **Grupo de edad**: 9-12
   - **Estado**: Creado exitosamente (201)

4. **Usuario Padre/Madre**
   - **Usuario**: padre1
   - **Rol**: parent
   - **Grupo de edad**: 9-12
   - **Estado**: Creado exitosamente (201)

5. **Usuario Profesor**
   - **Usuario**: profesor1
   - **Rol**: teacher
   - **Grupo de edad**: 9-12
   - **Estado**: Creado exitosamente (201)

### Usuario con Error:
- **Usuario**: nino1
- **Rol**: child
- **Grupo de edad**: 3-5
- **Estado**: Error en el registro (problema con caracteres especiales en PowerShell)

### Notas:
- Las contraseñas siguen el formato requerido: mayúsculas, minúsculas, números y caracteres especiales.
- Los usuarios están listos para ser utilizados en el sistema.

## 🚀 Activación de Servicios

### Backend
1. **Requisitos**:
   - Python 3.13
   - MongoDB Atlas configurado
   - Variables de entorno en `.env`

2. **Instalación**:
   ```bash
   cd backend
   poetry install
   ```

3. **Iniciar** (puerto 8000):
   ```bash
   python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
   ```
   - Documentación: http://127.0.0.1:8000/docs
   - Estado: http://127.0.0.1:8000/api/v1/health

### Frontend
1. **Requisitos**:
   - Node.js 18+ y npm 9+
   - Backend en ejecución

2. **Instalación**:
   ```bash
   cd frontend
   npm install
   ```

3. **Iniciar** (puerto 3001):
   ```bash
   npm run dev
   ```
   - URL: http://localhost:3001

## 🛠️ Stack Tecnológico

### Frontend
- **Framework**: React 18 + Vite
- **Estilos**: Tailwind CSS + Framer Motion
- **Estado**: React Context API
- **Enrutamiento**: React Router v6
- **Formularios**: React Hook Form
- **Validación**: Zod

### Backend
- **Framework**: FastAPI (Python 3.9+)
- **Base de Datos**: MongoDB
- **Autenticación**: JWT con refresh tokens
- **Documentación**: Swagger UI y ReDoc
- **WebSockets**: Para funcionalidades en tiempo real

### IA y Procesamiento
- **Chatbot**: Integración con modelos de lenguaje
- **Recomendaciones**: Basadas en el progreso y preferencias

## 🔐 Seguridad
- Autenticación JWT con refresh tokens
- Cookies HTTP-only seguras
- Validación de entrada estricta
- CORS configurado
- Contenido supervisado y apropiado para cada edad

## 🌿 Flujo de Trabajo Git

### Ramas Principales
1. **`main`**
   - Versión estable en producción
   - Solo se actualiza mediante Pull Requests aprobados
   - Cada commit debe ser una versión desplegable

2. **`develop`**
   - Rama de integración para características
   - Contiene el código para la próxima versión
   - Se sincroniza regularmente con `main`

### Ramas de Soporte
1. **`feature/*`**
   - Para desarrollar nuevas funcionalidades
   - Se crean desde `develop`
   - Se fusionan de vuelta a `develop`

2. **`hotfix/*`**
   - Para correcciones críticas en producción
   - Se crean desde `main`
   - Se fusionan a `main` y `develop`

3. **`release/*`**
   - Para preparar lanzamientos
   - Se crean desde `develop`
   - Se fusionan a `main` (con tag) y `develop`

## 🚀 Estado Actual del Proyecto

### 🔄 Cambios Recientes (Junio 2024)

#### 1. Backend (FastAPI)
- **Configuración**:
  - Actualizado `config.py` con variables para tokens de actualización
  - Añadida configuración de expiración y seguridad

- **Endpoints**:
  - `/auth/token`: Inicio de sesión con access y refresh tokens
  - `/auth/refresh-token`: Renovación de access token
  - `/auth/logout`: Cierre de sesión con revocación de tokens
  - `/auth/me`: Información del usuario autenticado

- **Seguridad**:
  - Validación de tokens implementada
  - Sistema de revocación de tokens
  - Manejo de cookies HTTP-only seguras

#### 2. Frontend (React)
- Eliminada variable no utilizada `bgGradient` en `Home.tsx`

#### 3. Pruebas
- Añadidas pruebas de integración para autenticación
- Verificación de renovación de tokens
- Pruebas de cierre de sesión

#### 4. Documentación
- Actualizado README.md con documentación de la API
- Incluidos ejemplos de solicitudes y respuestas

### ✅ Completado
1. **Autenticación**
   - Registro e inicio de sesión de usuarios
   - Renovación de tokens JWT
   - Cierre de sesión con revocación de tokens
   - Protección de rutas

2. **Estructura del Proyecto**
   - Configuración inicial de frontend y backend
   - Estructura de carpetas organizada
   - Variables de entorno configuradas

3. **Interfaz de Usuario**
   - Página de inicio
   - Componentes base
   - Diseño responsivo

### 🚧 En Progreso
1. **Módulos Educativos**
   - Matemáticas básicas
   - Ciencias naturales
   - Valores espirituales

2. **Chatbot Educativo**
   - Integración con IA
   - Respuestas contextuales
   - Personalización por edad

3. **Panel de Padres**
   - Seguimiento de progreso
   - Configuración de controles parentales

## 🛠️ Solución de Problemas Recientes

### Registro de Usuarios (28/06/2024)
- **Problema**: Error 500 al registrar nuevos usuarios
- **Causa**: Incompatibilidad entre el formato de `_id` de MongoDB y el modelo Pydantic
- **Solución**:
  1. Ajuste en el modelo `UserResponse` para manejar correctamente el alias `_id`
  2. Modificación del endpoint de registro para asegurar la inclusión del campo `_id`
  3. Conversión explícita de `ObjectId` a string en el repositorio de usuarios
- **Archivos modificados**:
  - `backend/app/models/user.py`
  - `backend/app/api/v1/endpoints/auth.py`
  - `backend/app/repositories/user_repository.py`

## 🌐 Documentación de la API

### 🔐 Autenticación

#### `POST /api/v1/auth/register`
- **Descripción**: Registra un nuevo usuario en el sistema
- **Autenticación**: No requerida
- **Body**: `{ "username": "string", "email": "string", "password": "string" }`
- **Respuesta exitosa (201)**: `{ "id": "string", "username": "string", "email": "string" }`

#### `POST /api/v1/auth/login`
- **Descripción**: Inicia sesión y obtiene tokens de acceso
- **Autenticación**: Basic Auth (usuario/contraseña)
- **Form-Data**: `username`, `password`
- **Respuesta exitosa (200)**: 
  ```json
  {
    "access_token": "string",
    "refresh_token": "string",
    "token_type": "bearer"
  }
  ```

#### `GET /api/v1/auth/me`
- **Descripción**: Obtiene información del usuario actual
- **Autenticación**: Requerida (JWT)
- **Headers**: `Authorization: Bearer <token>`
- **Respuesta exitosa (200)**: Información del usuario autenticado

#### `POST /api/v1/auth/logout`
- **Descripción**: Cierra la sesión del usuario actual
- **Autenticación**: Requerida (JWT)
- **Headers**: `Authorization: Bearer <token>`
- **Respuesta exitosa (200)**: `{ "message": "Sesión cerrada exitosamente" }`

#### `POST /api/v1/auth/refresh-token`
- **Descripción**: Obtiene un nuevo token de acceso
- **Autenticación**: Refresh token en el header
- **Headers**: `Authorization: Bearer <refresh_token>`
- **Respuesta exitosa (200)**: Nuevo access token

### 🧪 Endpoints de Prueba

#### `GET /api/v1/ping`
- **Descripción**: Verifica que la API está funcionando
- **Autenticación**: No requerida
- **Respuesta exitosa (200)**: `{ "message": "¡La API de GEMINI está funcionando correctamente!" }`

#### `GET /api/v1/secure-ping`
- **Descripción**: Verifica la autenticación del usuario
- **Autenticación**: Requerida (JWT)
- **Headers**: `Authorization: Bearer <token>`
- **Respuesta exitosa (200)**: Información del usuario autenticado

### 📚 Documentación

- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`
- **OpenAPI Schema**: `http://localhost:8000/openapi.json`

## 📂 Estructura del Proyecto

```
Agente-Educador/
├── backend/               # Backend FastAPI
│   ├── app/
│   │   ├── api/           # Endpoints de la API
│   │   ├── core/          # Configuraciones centrales
│   │   ├── db/            # Conexión a base de datos
│   │   ├── models/        # Modelos Pydantic
│   │   └── schemas/       # Esquemas de validación
│   ├── tests/             # Pruebas
│   └── main.py            # Punto de entrada
│
├── frontend/             # Frontend React
│   ├── public/
│   └── src/
│       ├── assets/       # Recursos estáticos
│       ├── components/    # Componentes reutilizables
│       ├── pages/         # Páginas de la aplicación
│       ├── services/      # Llamadas a la API
│       └── App.tsx        # Componente principal
│
├── docker/               # Configuraciones de Docker
├── docs/                 # Documentación adicional
└── .github/              # Configuración de GitHub
```

## 🔄 Flujo de Autenticación

### Inicio de Sesión
1. El usuario ingresa credenciales
2. El servidor valida y devuelve tokens de acceso y actualización
3. Los tokens se almacenan en cookies HTTP-only seguras

### Acceso a Recursos
1. El cliente envía el token de acceso en el encabezado Authorization
2. El servidor valida el token y sirve el recurso solicitado

### Renovación de Token
1. Cuando el token de acceso expira, el cliente usa el refresh token
2. El servidor emite nuevos tokens si el refresh token es válido

### Cierre de Sesión
1. Los tokens se revocan en el servidor
2. Las cookies se eliminan del navegador

## 📊 Base de Datos

### Colecciones Principales
1. **users**
   - Información de usuarios (niños y padres)
   - Credenciales de autenticación
   - Preferencias y configuración

2. **modules**
   - Contenido educativo por materia y edad
   - Actividades y ejercicios
   - Metadatos de progreso

3. **sessions**
   - Registro de sesiones de usuario
   - Actividad y métricas

4. **tokens**
   - Tokens revocados
   - Historial de autenticación

## 📝 Documentación de la API

### Autenticación
- `POST /api/v1/auth/register` - Registrar nuevo usuario
- `POST /api/v1/auth/token` - Iniciar sesión
- `POST /api/v1/auth/refresh-token` - Renovar token de acceso
- `POST /api/v1/auth/logout` - Cerrar sesión
- `GET /api/v1/auth/me` - Obtener información del usuario actual

### Usuarios
- `GET /api/v1/users` - Listar usuarios (admin)
- `GET /api/v1/users/me` - Perfil del usuario actual
- `PUT /api/v1/users/me` - Actualizar perfil

### Módulos
- `GET /api/v1/modules` - Listar módulos disponibles
- `GET /api/v1/modules/{id}` - Obtener módulo por ID
- `GET /api/v1/modules/{id}/activities` - Actividades del módulo

## 🚀 Despliegue

### Requisitos
- Servidor con Docker y Docker Compose
- Dominio con certificado SSL

### Pasos
1. Configurar variables de entorno
2. Iniciar servicios con Docker Compose
3. Configurar proxy inverso (Nginx/Apache)
4. Configurar certificados SSL (Let's Encrypt)

## 🔍 Próximos Pasos

### Inmediato
- [x] Ejecutar pruebas de integración
- [ ] Implementar renovación automática de tokens en frontend
- [ ] Revisar configuración de CORS y políticas de seguridad
- [ ] Añadir logs detallados para auditoría

### Corto Plazo
- [ ] Completar módulo de matemáticas
- [ ] Implementar sistema de logros
- [ ] Añadir más actividades interactivas

### Largo Plazo
- [ ] Aplicación móvil nativa
- [ ] Soporte para múltiples idiomas
- [ ] Integración con plataformas educativas

## 🤝 Contribución

1. Hacer fork del repositorio
2. Crear una rama para la característica (`git checkout -b feature/amazing-feature`)
3. Hacer commit de los cambios (`git commit -m 'Add some amazing feature'`)
4. Hacer push a la rama (`git push origin feature/amazing-feature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

*Última actualización: 27 de junio de 2024*
