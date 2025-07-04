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

## Prueba Exitosa - 29 de Junio de 2025

### Datos de la Prueba
- **Fecha y Hora**: 2025-06-29 22:05:02 (UTC-04:00)
- **Usuario de Prueba**: nuevousuario
- **Token de Acceso**: [Token JWT válido]

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
  "_id": null,
  "created_at": "2025-06-30T01:46:34.839000",
  "updated_at": "2025-06-30T01:46:34.839000",
  "last_login": "2025-06-30T01:48:01.238000"
}
```

### Análisis de la Respuesta

| Campo       | Valor                     | Descripción                                   |
|-------------|---------------------------|-----------------------------------------------|
| username    | nuevousuario              | Nombre de usuario único                      |
| email       | nuevo@ejemplo.com         | Correo electrónico del usuario               |
| full_name   | Nuevo Usuario de Prueba   | Nombre completo del usuario                  |
| role        | child                     | Rol del usuario (en este caso, niño)         |
| age_group   | 9-12                      | Grupo de edad del usuario                    |
| is_active   | true                      | Indica que la cuenta está activa             |
| avatar      | null                      | Sin imagen de perfil configurada             |
| _id         | null                      | Identificador único (no devuelto por seguridad)|
| created_at  | 2025-06-30T01:46:34.839000| Fecha de creación de la cuenta               |
| updated_at  | 2025-06-30T01:46:34.839000| Fecha de última actualización                |
| last_login  | 2025-06-30T01:48:01.238000| Fecha del último inicio de sesión            |

## Código de Ejemplo (PowerShell)

```powershell
# Configurar el token de acceso
$accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJudWV2b3VzdWFyaW8iLCJleHAiOjE3NTEzMzQ0ODEsImlhdCI6MTc1MTI0ODA4MSwidHlwZSI6ImFjY2VzcyIsImp0aSI6IjIzMjkxYmQ5LTQyZGMtNGNiMy05N2ViLTYzYjhlYWEzMmFmYSJ9.yE0H4MWFTn4joW1pthZX1dMkYxYtraKVerDNWZHQWPs"

$headers = @{
    'Authorization' = "Bearer $accessToken"
    'accept' = 'application/json'
}

try {
    $response = Invoke-WebRequest -Uri 'http://localhost:8000/api/v1/users/me' `
        -Method Get -Headers $headers -UseBasicParsing -ErrorAction Stop
    
    Write-Host "✅ Prueba exitosa - Código: $($response.StatusCode)"
    $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
}
catch {
    Write-Host "❌ Error en la prueba:"
    Write-Host "Código de estado: $($_.Exception.Response.StatusCode.value__)"
    if ($_.ErrorDetails.Message) {
        $_.ErrorDetails.Message | ConvertFrom-Json | ConvertTo-Json -Depth 10
    } else {
        $_.Exception.Message
    }
}
```

## Posibles Errores

### 401 Unauthorized
- **Causa**: Token no proporcionado o inválido
- **Solución**: Asegúrese de incluir un token JWT válido en el encabezado de autorización

### 403 Forbidden
- **Causa**: Token expirado o sin permisos suficientes
- **Solución**: Obtenga un nuevo token de autenticación

## Notas Importantes
1. Este endpoint solo devuelve información del usuario autenticado
2. La información sensible como contraseñas nunca se incluye en la respuesta
3. El campo `_id` se devuelve como `null` por razones de seguridad
4. El token de acceso debe incluirse en el encabezado `Authorization` con el prefijo `Bearer `

---
*Documentación generada automáticamente el 29 de Junio de 2025*
