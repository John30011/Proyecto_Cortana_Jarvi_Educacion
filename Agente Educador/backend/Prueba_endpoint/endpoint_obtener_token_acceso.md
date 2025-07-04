# Documentación: Endpoint de Obtención de Token de Acceso

## Descripción
Este documento detalla el proceso de prueba del endpoint `POST /api/v1/auth/token` que se utiliza para obtener un token de acceso JWT (JSON Web Token) para la autenticación en la API de GEMINI.

## Detalles del Endpoint

### URL Base
```
POST http://localhost:8000/api/v1/auth/token
```

### Headers Requeridos
```
Content-Type: application/x-www-form-urlencoded
accept: application/json
```

### Parámetros del Cuerpo (Body)
| Parámetro | Tipo   | Requerido | Descripción               |
|-----------|--------|-----------|---------------------------|
| username  | string | Sí        | Nombre de usuario         |
| password  | string | Sí        | Contraseña del usuario    |

### Respuesta Exitosa (Código 200)
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "username": "nuevousuario",
    "email": "nuevo@ejemplo.com",
    "full_name": "Nuevo Usuario de Prueba",
    "role": "child",
    "age_group": "9-12",
    "is_active": true,
    "avatar": null,
    "_id": "6861ec7a643e288aed1c9fef",
    "created_at": "2025-06-30T01:46:34.839000",
    "updated_at": "2025-06-30T01:46:34.839000",
    "last_login": "2025-06-30T01:51:42.123456"
  }
}
```

### Códigos de Estado HTTP
| Código | Descripción                           |
|--------|---------------------------------------|
| 200    | Autenticación exitosa                 |
| 401    | Credenciales inválidas                |
| 422    | Error de validación en los parámetros |

## Ejemplo de Uso con PowerShell

### 1. Solicitud de Token
```powershell
$headers = @{
    'accept' = 'application/json'
    'Content-Type' = 'application/x-www-form-urlencoded'
}

$body = @{
    username = 'nuevousuario'
    password = 'Contrasena123!'
}

$response = Invoke-WebRequest -Uri 'http://localhost:8000/api/v1/auth/token' `
    -Method Post -Headers $headers -Body $body -UseBasicParsing

# Mostrar la respuesta formateada
$response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
```

### 2. Extraer y guardar el token
```powershell
# Extraer el token de la respuesta
$tokenData = $response.Content | ConvertFrom-Json
$accessToken = $tokenData.access_token

# Mostrar solo el token (útil para copiarlo)
Write-Host "Token de acceso:"
Write-Host $accessToken

# Guardar el token en una variable de entorno (opcional)
$env:ACCESS_TOKEN = $accessToken
```

## Uso del Token en Peticiones Posteriores

### Ejemplo de petición autenticada:
```powershell
$authHeaders = @{
    'Authorization' = "Bearer $accessToken"
    'accept' = 'application/json'
}

# Ejemplo: Obtener información del usuario actual
$userResponse = Invoke-WebRequest -Uri 'http://localhost:8000/api/v1/users/me' `
    -Method Get -Headers $authHeaders -UseBasicParsing

$userResponse.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
```

## Notas Importantes

1. **Seguridad del Token**:
   - El token JWT es sensible y debe manejarse con cuidado.
   - No compartas ni publiques tokens en repositorios públicos.
   - Los tokens tienen una fecha de expiración (por defecto, 24 horas).

2. **Manejo de Errores**:
   - Si el token ha expirado, recibirás un error 401 Unauthorized.
   - Para renovar el token, puedes usar el endpoint de refresh token.

3. **Ambientes**:
   - Asegúrate de usar la URL correcta según el ambiente (desarrollo, staging, producción).

## Pruebas Realizadas

### Caso de Éxito
- **Usuario**: nuevousuario
- **Resultado**: Token generado exitosamente con código 200
- **Datos del Usuario**: Se incluyó correctamente la información del perfil

### Casos de Error
1. **Credenciales Inválidas**
   - **Usuario**: usuarioinexistente
   - **Contraseña**: cualquiera
   - **Resultado**: Error 401 - Credenciales inválidas

2. **Formato Incorrecto**
   - **Cuerpo**: Sin el campo 'username'
   - **Resultado**: Error 422 - Error de validación

## Referencias
- [Documentación de JWT](https://jwt.io/)
- [Documentación de la API de GEMINI](http://localhost:8000/docs)

---
*Última actualización: 29 de Junio de 2025*
