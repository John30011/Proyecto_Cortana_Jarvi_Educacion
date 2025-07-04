# Pruebas del Endpoint de Registro de Usuarios

## 📌 Endpoint
```
POST /api/v1/auth/register
```

## 📋 Problema Inicial
Se identificó un error 500 al intentar registrar nuevos usuarios debido a un problema en el manejo del campo `_id` entre MongoDB y Pydantic.

## 🔍 Solución Implementada
Se realizaron los siguientes cambios para solucionar el problema:

1. **En el modelo `UserResponse`** (backend/app/models/user.py):
   - Se aseguró que el campo `id` tenga un alias `_id`
   - Configuración para permitir la población por nombre de campo

2. **En el endpoint de registro** (backend/app/api/v1/endpoints/auth.py):
   ```python
   # Usar by_alias para incluir _id en la respuesta
   user_dict = user.dict(by_alias=True)
   
   # Asegurar que el ID esté presente como _id
   if "id" in user_dict and "_id" not in user_dict:
       user_dict["_id"] = user_dict["id"]
   ```

3. **En el repositorio de usuarios** (backend/app/repositories/user_repository.py):
   - Conversión explícita de `ObjectId` a string para el campo `_id`

## 🧪 Pruebas Realizadas

### 1. Prueba Fallida (Error 422 - Validación)
**Solicitud**:
```bash
curl -X 'POST' \
  'http://localhost:8000/api/v1/auth/register' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "username": "jblanco",
  "email": "prueba.com",  # Email inválido
  "full_name": "jonathanblanco",
  "role": "child",
  "age_group": "3-5",
  "is_active": true,
  "password": "123"  # Contraseña insegura
}'
```

**Errores detectados**:
- Email inválido (falta @)
- Contraseña insegura (muy corta)

### 2. Prueba Fallida (Error de Sintaxis JSON)
**Solicitud con error**:
```bash
{
  "username": "jblanco",
  "email": jonathanblanco15@gmail.com",  # Falta comilla inicial
  "full_name": "jonathanblanco",
  "role": "child",
  "age_group": "3-5",
  "is_active": true,
  "password": "Seguro123!"
}
```

**Solución**:
- Añadir comilla inicial en el email: `"jonathanblanco15@gmail.com"`

### 3. Prueba Exitosa (Código 201)
**Solicitud corregida**:
```bash
curl -X 'POST' \
  'http://localhost:8000/api/v1/auth/register' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "username": "jblanco",
  "email": "jonathanblanco15@gmail.com",
  "full_name": "Jonathan Blanco",
  "password": "Seguro123!",
  "role": "child",
  "age_group": "3-5",
  "is_active": true
}'
```

**Respuesta exitosa (201 Created)**:
```json
{
  "username": "jblanco",
  "email": "jonathanblanco15@gmail.com",
  "full_name": "Jonathan Blanco",
  "role": "child",
  "age_group": "3-5",
  "is_active": true,
  "_id": "[ID_GENERADO]",
  "created_at": "[FECHA_HORA]",
  "updated_at": "[FECHA_HORA]"
}
```

## 📌 Alternativas de Prueba

### 1. Usando Python
```python
import requests
import datetime

url = "http://localhost:8000/api/v1/auth/register"
timestamp = datetime.datetime.now().strftime("%H%M%S")
data = {
    "username": f"testuser_{timestamp}",
    "email": f"test_{timestamp}@example.com",
    "password": "TestPass123",
    "full_name": "Usuario de Prueba",
    "role": "child",
    "age_group": "6-8",
    "is_active": True
}

response = requests.post(url, json=data)
print(f"Status Code: {response.status_code}")
print("Response:", response.json())
```

### 2. Usando REST Client en VS Code
Crear archivo `test.http`:
```http
### Registrar nuevo usuario
POST http://localhost:8000/api/v1/auth/register
Content-Type: application/json

{
    "username": "testuser_123",
    "email": "test_123@example.com",
    "password": "TestPass123",
    "full_name": "Usuario Test",
    "role": "child",
    "age_group": "6-8",
    "is_active": true
}


## Solucion

 {
  "username": "jblanco",
  "email": "jonathanblanco15@gmail.com",
  "full_name": "jonathanblanco",
  "role": "child",
  "age_group": "3-5",
  "is_active": true,
  "password": "Seguro123!"
}

Curl: Code 201

curl -X 'POST' \
  'http://localhost:8000/api/v1/auth/register' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "username": "jblanco",
  "email": "jonathanblanco15@gmail.com",
  "full_name": "jonathanblanco",
  "role": "child",
  "age_group": "3-5",
  "is_active": true,
  "password": "Seguro123!"
}'


```

## 📝 Notas Adicionales
- La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas y números.
- El email debe tener un formato válido (ejemplo@dominio.com).
- Si el nombre de usuario ya existe, se debe usar uno diferente.
- El campo `_id` es generado automáticamente por MongoDB.
