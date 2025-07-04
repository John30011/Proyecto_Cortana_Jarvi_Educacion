# Documentación: Endpoint de Obtención de Información del Usuario Actual

## Descripción
Este documento detalla el proceso de prueba del endpoint `GET /api/v1/users/me` que permite a un usuario autenticado obtener su propia información de perfil.

## Detalles del Endpoint

### URL Base
```
GET http://localhost:8000/api/v1/users/me
```

### Headers Requeridos
```
Authorization: Bearer <token_de_acceso>
accept: application/json
```

### Parámetros de la Solicitud
Este endpoint no requiere parámetros en el cuerpo ni en la URL.

### Respuesta Exitosa (Código 200)
```json
{
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
  "last_login": "2025-06-30T01:57:21.123456"
}
```

### Códigos de Estado HTTP
| Código | Descripción                           |
|--------|---------------------------------------|
| 200    | Información del usuario obtenida      |
| 401    | No autorizado (token inválido/faltante)|
| 403    | Prohibido (sin permisos)              |

## Ejemplo de Uso con PowerShell

### 1. Obtener Información del Usuario
```powershell
# Configurar el token de acceso obtenido previamente
$accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

$headers = @{
    'Authorization' = "Bearer $accessToken"
    'accept' = 'application/json'
}

try {
    $response = Invoke-WebRequest -Uri 'http://localhost:8000/api/v1/users/me' `
        -Method Get -Headers $headers -UseBasicParsing -ErrorAction Stop
    
    # Mostrar la respuesta formateada
    $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
}
catch {
    Write-Host "Error al obtener la información del usuario:"
    $_.Exception.Message
    if ($_.ErrorDetails.Message) {
        $_.ErrorDetails.Message | ConvertFrom-Json | ConvertTo-Json -Depth 10
    }
}
```

### 2. Guardar la Información en una Variable
```powershell
$userInfo = $response.Content | ConvertFrom-Json
Write-Host "Bienvenido, $($userInfo.full_name)"
Write-Host "Tu rol es: $($userInfo.role)"
```

## Pruebas Realizadas

### Caso de Éxito
1. **Autenticación**: Usuario con token válido
2. **Solicitud**: GET a `/api/v1/users/me`
3. **Resultado**:
   - Código 200 OK
   - Información completa del perfil del usuario
   - No incluye información sensible (como contraseñas)

### Casos de Error
1. **Token Ausente**
   - **Headers**: Sin encabezado de autorización
   - **Error**: 401 Unauthorized
   - **Mensaje**: "No se proporcionaron credenciales"

2. **Token Inválido**
   - **Headers**: `Authorization: Bearer token_invalido`
   - **Error**: 401 Unauthorized
   - **Mensaje**: "No se pudo validar el token"

3. **Token Expirado**
   - **Headers**: `Authorization: Bearer token_expirado`
   - **Error**: 401 Unauthorized
   - **Mensaje**: "El token ha expirado"

## Campos de Respuesta

| Campo       | Tipo    | Descripción                                   |
|-------------|---------|-----------------------------------------------|
| username    | string  | Nombre de usuario único                      |
| email       | string  | Correo electrónico del usuario               |
| full_name   | string  | Nombre completo del usuario                  |
| role        | string  | Rol del usuario (child, parent, teacher, admin)|
| age_group   | string  | Grupo de edad del usuario                    |
| is_active   | boolean | Indica si la cuenta está activa              |
| avatar      | string  | URL de la imagen de perfil (opcional)        |
| _id         | string  | Identificador único del usuario              |
| created_at  | string  | Fecha de creación de la cuenta               |
| updated_at  | string  | Fecha de última actualización                |
| last_login  | string  | Fecha del último inicio de sesión            |

## Notas Importantes

1. **Seguridad**:
   - Este endpoint solo devuelve información del usuario autenticado
   - No se puede acceder a la información de otros usuarios con este endpoint
   - Los tokens deben manejarse de forma segura y no compartirse

2. **Rendimiento**:
   - La respuesta incluye solo la información necesaria
   - Los datos sensibles (como contraseñas) nunca se incluyen

3. **Uso en Aplicaciones**:
   - Ideal para verificar el estado de autenticación
   - Útil para mostrar información del perfil del usuario
   - Puede usarse para verificar permisos basados en roles

## Referencias
- [Documentación de la API de GEMINI](http://localhost:8000/docs)
- [Guía de Autenticación JWT](https://jwt.io/introduction/)

---
*Última actualización: 29 de Junio de 2025*
