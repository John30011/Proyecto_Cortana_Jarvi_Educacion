# 📚 Memoria del Proyecto - Módulo de Ciencia

## 🚀 Módulo de Ciencia (04 de Julio 2025 - 02:15 PM)

### Características Implementadas:

* **Interfaz de Usuario**
  - Diseño responsivo y amigable para niños
  - Tema claro/oscuro con soporte para modo nocturno
  - Navegación intuitiva con pestañas

* **Funcionalidades Principales**
  - Visualización de experimentos científicos por categoría
  - Datos curiosos con actualización aleatoria
  - Búsqueda y filtrado de contenido
  - Sistema de calificación para experimentos

* **Tecnologías Utilizadas**
  - React 18 con TypeScript
  - Chakra UI para componentes de interfaz
  - React Router para navegación
  - React Icons para iconografía

### Estructura del Módulo:
```
science/
├── components/
│   └── ScienceCard.tsx    # Componente para mostrar tarjetas de experimentos/datos
├── pages/
│   ├── ExperimentDetailPage.tsx
│   ├── ExperimentsListPage.tsx
│   ├── QuizPage.tsx
│   ├── QuizResultsPage.tsx
│   ├── FactsPage.tsx
│   └── TopicPage.tsx
├── types.ts               # Definiciones de tipos TypeScript
├── ScienceModule.tsx      # Componente principal
└── routes.tsx             # Configuración de rutas
```

## 📝 Informe de Errores y Estado (04 de Julio 2025 - 01:20 PM)

### Errores Resueltos:

*   **Frontend (`frontend/src/components/chat/Chatbot.tsx`):**
    *   Se corrigió la duplicación de código en los botones de sugerencia.
    *   Se añadieron las importaciones de los íconos `FaUser`, `FaPaperPlane` y `FaTrash`.
    *   Se ajustó la lógica de `handleSendMessage` para que los botones de sugerencia funcionen correctamente.
    *   Se corrigió el manejo del tipo `ageGroup` en el hook `useChat`.
    *   Se corrigió el uso de `forwardRef`.
    *   Se ajustó el posicionamiento del `InputRightElement`.
    *   Se eliminó la importación no utilizada de `Input`.
    *   Se corrigió la incompatibilidad de tipos en el `timestamp` de la interfaz `Message`.
*   **Backend (`backend/app/repositories/token_repository.py`):**
    *   Se corrigió la indentación de los métodos `create_indexes`, `add_to_blacklist`, `is_token_revoked`, `revoke_all_user_tokens` y `create_refresh_token` para que estuvieran dentro de la clase `TokenRepository`.
    *   Se eliminó la llamada a `db.connect_db()` dentro de `get_token_repository` para evitar posibles problemas de inicialización.
*   **Backend (`backend/app/models/user.py`):**
    *   Se eliminó la definición duplicada de `UserResponse`.
    *   Se corrigió la llamada a `update_forward_refs()`.
    *   Se añadieron anotaciones de tipo a las funciones `username_must_be_alphanumeric`, `password_strength` (en `UserCreate` y `UserUpdate`) y `dict` (en `UserInDB`).
*   **Backend (`backend/app/core/auth.py`):**
    *   Se eliminó la doble decodificación del token JWT en `get_current_user`.
    *   Se movió la importación de `UserRepository` al principio del archivo.
    *   Se corrigió la llamada a `create_tokens` en `refresh_access_token` para que pasara un objeto `User` en lugar de `UserInDB`.
    *   Se aseguró que el `_id` se incluyera correctamente en el diccionario del usuario en `create_tokens`.
    *   Se corrigió la importación de `TokenData` para que apuntara a `app.models.token`.
*   **Backend (`backend/app/api/v1/endpoints/auth.py`):**
    *   Se corrigió la importación de `Token` para que apuntara a `app.models.token`.
    *   Se revirtieron las importaciones relativas a absolutas.
*   **Backend (`backend/pyproject.toml`):**
    *   Se corrigió la configuración de `mypy` para que reconociera el directorio `app` como un paquete, eliminando las líneas incorrectas y añadiendo `packages = ["app"]`.

### Errores Pendientes (basado en la última salida de `mypy`):

*   **Falta de anotaciones de tipo (`no-untyped-def`):** Numerosas funciones en varios archivos (ej. `update_env.py`, `setup_mongodb.py`, `run_server.py`, `test_register.py`, `app/models/token.py`, `app/models/chat_models.py`, `app/db/mongodb.py`, `app/services/chat_service.py`, `app/repositories/user_repository.py`, `app/repositories/token_repository.py`, `app/db/init_db.py`, `app/api/dependencies/rate_limiter.py`, `app/api/dependencies/auth.py`, `app/api/v1/endpoints/users.py`, `main.py`, `app/main.py`, `list_routes.py`, `tests/test_users.py`, `tests/test_auth_flow.py`) aún requieren anotaciones de tipo para sus argumentos y/o valores de retorno.
*   **Falta de anotaciones de variables (`var-annotated`):** Varias variables en archivos como `update_admin_password.py`, `list_users_simple.py`, `debug_auth.py`, `create_admin.py`, `check_db.py`, `check_admin_password.py`, `test_mongodb_local.py`, `test_mongodb_connection.py`, `test_mongodb.py`, `test_mongo_connection.py`, `test_direct_connection.py`, `test_connection_fixed.py`, `list_users_script.py`, `list_users.py` necesitan anotaciones de tipo explícitas.
*   **Incompatibilidad de tipos (`assignment`, `return-value`, `arg-type`):** Persisten errores donde los tipos asignados o devueltos no coinciden con los esperados, o los argumentos pasados a funciones son de tipos incompatibles. Esto ocurre en archivos como `check_config.py`, `app/core/config.py`, `app/db/mongodb.py`, `app/core/logging_config.py`, `app/repositories/token_repository.py`, `app/api/dependencies/auth.py`, `app/core/auth.py`, `app/api/v1/endpoints/auth.py`, `list_routes.py`, `tests/test_users.py`, `tests/test_auth_flow.py`.
*   **Errores de atributos (`attr-defined`):** Se intentan acceder a atributos que `mypy` no puede encontrar en ciertos objetos, especialmente en `app/api/v1/endpoints/users.py`, `main.py`, `app/main.py`, `list_routes.py`, `tests/test_auth_flow.py`. Esto puede indicar que los objetos no son del tipo esperado o que faltan definiciones de tipo.
*   **Errores de argumentos (`call-arg`):** Algunas llamadas a funciones tienen argumentos inesperados, como en `app/repositories/token_repository.py` y `tests/test_users.py` al llamar a `create_access_token`.
*   **Errores de sobrecarga (`call-overload`):** En `app/models/chat_models.py`, las llamadas a `Field` no coinciden con ninguna de las sobrecargas definidas, lo que sugiere un uso incorrecto de la función `Field` de Pydantic.
*   **Errores de importación (`import-not-found`):** A pesar de las configuraciones, `mypy` aún no puede encontrar las implementaciones o stubs para módulos importados en `app/api/v1/endpoints/auth.py`, lo que podría indicar un problema con la estructura del proyecto o la configuración de `mypy`.
*   **Otros errores:**
    *   `app\core\logging_config.py:100: error: Statement is unreachable`
    *   `app\repositories\token_repository.py:37: error: "classmethod" used with a non-method`
    *   `app\repositories\token_repository.py:37: error: Statement is unreachable`
    *   `main.py:93: error: "add" of "set" does not return a value (it only ever returns None)`
    *   `main.py:507: error: Cannot assign to a method`
    *   `app\main.py:86: error: "add" of "set" does not return a value (it only ever returns None)`
    *   `app\main.py:536: error: Cannot assign to a method`
    *   `tests\test_auth_flow.py:26: error: Value of type "Coroutine[Any, Any, bool]" must be used` (y notas de `Are you missing an await?`)