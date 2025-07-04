# Estructura de la Base de Datos

Este documento describe el esquema de la base de datos del sistema educativo GEMINI.

## Tablas Principales

### 1. `profiles`
Almacena la información de los usuarios del sistema.

| Columna    | Tipo       | Descripción                               |
|------------|------------|-------------------------------------------|
| id         | UUID       | Identificador único (clave primaria)      |
| username   | TEXT       | Nombre de usuario único                  |
| full_name  | TEXT       | Nombre completo del usuario               |
| avatar_url | TEXT       | URL de la imagen de perfil               |
| email      | TEXT       | Correo electrónico del usuario           |
| role       | user_role  | Rol del usuario (student/teacher/admin)  |
| age_group  | age_group  | Grupo de edad del usuario                |
| created_at | TIMESTAMPTZ| Fecha de creación del perfil             |
| updated_at | TIMESTAMPTZ| Fecha de última actualización            |

### 2. `learning_modules`
Contiene los módulos de aprendizaje disponibles.

| Columna         | Tipo             | Descripción                               |
|-----------------|------------------|-------------------------------------------|
| id              | UUID             | Identificador único                      |
| name            | TEXT             | Nombre del módulo                        |
| description     | TEXT             | Descripción del módulo                   |
| subject         | TEXT             | Materia o categoría                      |
| age_group       | age_group        | Grupo de edad objetivo                   |
| difficulty_level| difficulty_level | Nivel de dificultad (1-5)                |
| content         | JSONB            | Contenido estructurado del módulo        |
| created_at      | TIMESTAMPTZ      | Fecha de creación                        |
| updated_at      | TIMESTAMPTZ      | Fecha de última actualización            |

### 3. `chat_sessions`
Registra las sesiones de chat entre usuarios y el asistente.

| Columna    | Tipo        | Descripción                               |
|------------|-------------|-------------------------------------------|
| id         | UUID        | Identificador único                      |
| user_id    | UUID        | ID del usuario propietario               |
| title      | TEXT        | Título de la sesión                      |
| module     | TEXT        | Módulo relacionado                       |
| age_group  | age_group   | Grupo de edad del usuario                |
| is_active  | BOOLEAN     | Indica si la sesión está activa          |
| created_at | TIMESTAMPTZ | Fecha de creación                        |
| updated_at | TIMESTAMPTZ | Fecha de última actualización            |

### 4. `chat_messages`
Almacena los mensajes dentro de cada sesión de chat.

| Columna    | Tipo        | Descripción                               |
|------------|-------------|-------------------------------------------|
| id         | UUID        | Identificador único                      |
| session_id | UUID        | ID de la sesión de chat                  |
| role       | TEXT        | Rol (user/assistant/system)              |
| content    | TEXT        | Contenido del mensaje                    |
| metadata   | JSONB       | Metadatos adicionales                    |
| created_at | TIMESTAMPTZ | Fecha de creación                        |

### 5. `user_progress`
Registra el progreso de los usuarios en los módulos.

| Columna           | Tipo        | Descripción                               |
|-------------------|-------------|-------------------------------------------|
| id                | UUID        | Identificador único                      |
| user_id           | UUID        | ID del usuario                           |
| module_id         | UUID        | ID del módulo                            |
| completed_lessons | TEXT[]      | IDs de lecciones completadas             |
| score             | INTEGER     | Puntuación del usuario en el módulo      |
| last_accessed     | TIMESTAMPTZ | Último acceso al módulo                  |
| created_at        | TIMESTAMPTZ | Fecha de creación                        |
| updated_at        | TIMESTAMPTZ | Fecha de última actualización            |

## Tipos Personalizados

### user_role
- `student`: Usuario estándar (niño)
- `teacher`: Profesor/padre/tutor
- `admin`: Administrador del sistema

### age_group
- `3-5`: 3 a 5 años
- `6-8`: 6 a 8 años
- `9-12`: 9 a 12 años
- `13-15`: 13 a 15 años
- `16-18`: 16 a 18 años
- `adult`: Adulto (profesores/administradores)

### difficulty_level
Niveles del 1 (fácil) al 5 (difícil)

## Relaciones

1. `profiles` 1 → ∞ `chat_sessions` (Un usuario puede tener múltiples sesiones de chat)
2. `chat_sessions` 1 → ∞ `chat_messages` (Una sesión puede tener múltiples mensajes)
3. `profiles` 1 → ∞ `user_progress` (Un usuario puede tener progreso en múltiples módulos)
4. `learning_modules` 1 → ∞ `user_progress` (Un módulo puede tener múltiples registros de progreso)

## Índices

Se han creado índices en las columnas más consultadas para mejorar el rendimiento:
- `profiles`: email, role
- `learning_modules`: subject, age_group
- `chat_sessions`: user_id
- `chat_messages`: session_id
- `user_progress`: user_id, module_id

## Políticas de Seguridad (RLS)

Se han implementado políticas de seguridad a nivel de fila (RLS) para controlar el acceso a los datos:

- Los usuarios solo pueden ver y modificar sus propios datos
- Los profesores pueden ver el progreso de sus estudiantes
- Solo los administradores pueden gestionar los módulos de aprendizaje
- Las sesiones y mensajes de chat son privados para cada usuario

## Ejecutar Migraciones

Para aplicar los cambios a la base de datos:

1. Asegúrate de tener las variables de entorno configuradas:
   ```
   NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
   SUPABASE_SERVICE_ROLE_KEY=tu_clave_de_servicio
   ```

2. Instala las dependencias necesarias:
   ```bash
   npm install @supabase/supabase-js dotenv
   ```

3. Ejecuta el script de migración:
   ```bash
   node supabase/migrate.js
   ```

## Mantenimiento

- Se recomienda realizar copias de seguridad periódicas de la base de datos
- Monitorear el rendimiento y agregar índices según sea necesario
- Revisar y actualizar las políticas de seguridad cuando se agreguen nuevas funcionalidades
