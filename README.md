# GEMINI - Plataforma Educativa para Niños

![GEMINI Logo](assets/images/logo.svg)

Plataforma educativa interactiva diseñada para niños de 3 a 12 años que combina aprendizaje con diversión mediante juegos, actividades interactivas y un asistente educativo inteligente. Proyecto piloto para evaluar la educación de los niños con apoyo de la Inteligencia Artificial a través de los agentes CORTANA & JARVI.

## 📌 Estado Actual del Proyecto (04 de Julio de 2025 - Tarde)

### 🚀 Progreso General
- **Frontend**: 70% completado
- **Backend**: 60% completado
- **Base de Datos**: 50% completado
- **Pruebas**: 40% completado

### ✅ Últimas Actualizaciones (04 de Julio de 2025 - Tarde)
- Integración completa del módulo de Cursos con el Dashboard
- Sistema de visualización de actividades educativas
- Componentes reutilizables optimizados
- Mejoras en el rendimiento de autenticación

### 📅 Próximos Pasos
1. Completar panel de administración
2. Implementar sistema de roles y permisos
3. Desarrollar dashboard de análisis
4. Mejorar accesibilidad (a11y)

---

## 📌 Actualización: 04 de Julio de 2025 (Tarde)

### Integración de Módulo de Cursos y Dashboard

¡Hemos completado la integración del módulo de Cursos con el Dashboard! 🎉

**Nuevas características implementadas:**
- Visualización unificada de actividades educativas y cursos
- Sistema de búsqueda y filtrado por categorías
- Componentes reutilizables: `ActivityCard` y `ActivityCourseCard`
- Mejoras en el rendimiento con React Hooks

**Mejoras técnicas:**
- Corrección de errores de Hooks de React
- Implementación de tipos estrictos en TypeScript
- Optimización de rendimiento con `useMemo`

---

## 📌 Actualización: 04 de Julio de 2025 (Mañana)

### Configuración Exitosa de Supabase y Autenticación

¡Hemos completado exitosamente la configuración de Supabase y el sistema de autenticación en el frontend! 🎉

**Cambios realizados:**
- Configuración robusta del cliente de Supabase
- Corrección de rutas de importación
- Implementación de tipos TypeScript
- Documentación detallada

**Próximos pasos:**
- Protección de rutas
- Pruebas adicionales
- Despliegue en producción

---

## 🚀 Características Principales

- **Módulos Educativos**: Contenido adaptado por edades (3-5, 6-8, 9-12 años)
- **Chatbot Interactivo**: Asistente educativo con IA para aprendizaje personalizado
- **Sistema de Recompensas**: Logros y stickers para motivar el aprendizaje
- **Interfaz Amigable**: Diseño intuitivo y colorido para niños
- **Seguridad Infantil**: Contenido supervisado y entorno seguro
- **Múltiples Materias**: Matemáticas, Ciencia, Historia y más
- **Seguro para Niños**: Contenido apropiado por edades
- **Panel para Padres**: Seguimiento del progreso

## 🛠️ Tecnologías

- **Frontend**: React, Vite, Tailwind CSS, Framer Motion
- **Backend**: FastAPI (Python)
- **Base de Datos**: MongoDB
- **IA**: Integración con modelos de lenguaje
- **Autenticación**: JWT

## 🚀 Empezando

### Requisitos Previos

- Node.js 16+
- Python 3.9+
- MongoDB

### Instalación

1. Clonar el repositorio
   ```bash
   git clone https://github.com/John30011/Educacion_Con_IA.git
   cd Agente-Educador
   ```

2. Configurar el Frontend
   ```bash
   cd frontend
   npm install
   ```

3. Configurar el Backend
   ```bash
   cd ../backend
   python -m venv venv
   .\venv\Scripts\activate  # En Windows
   pip install -r requirements.txt
   ```

4. Configurar variables de entorno
   Crear un archivo `.env` en la carpeta backend con:
   ```
   MONGODB_URI=mongodb://localhost:27017/gemini
   SECRET_KEY=tu_clave_secreta_aqui
   ```

### Ejecución

1. Iniciar el backend
   ```bash
   cd backend
   uvicorn main:app --reload
   ```

2. En otra terminal, iniciar el frontend
   ```bash
   cd frontend
   npm run dev
   ```

3. Abrir en el navegador
   ```
   http://localhost:3000
   ```

## 📚 Documentación de la API

La documentación de la API estará disponible en:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## 🤝 Contribución

1. Hacer fork del proyecto
2. Crear una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Hacer commit de los cambios (`git commit -am 'Añadir nueva funcionalidad'`)
4. Hacer push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## ✉️ Contacto

[Tu Nombre] - [tu@email.com]


## Historial de Desarrollo

### jueves, 3 de julio de 2025

**Módulo de Registro de Usuarios - Conexión con Supabase**

Se ha resuelto el problema de registro de usuarios. El módulo de registro de usuarios ahora tiene conexión con Supabase y puede crear cuentas.