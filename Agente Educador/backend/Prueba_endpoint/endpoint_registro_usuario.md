# Documentación: Endpoint de Registro de Usuario

## Descripción
Este documento detalla el proceso de prueba del endpoint `POST /api/v1/auth/register` que se utiliza para registrar nuevos usuarios en la plataforma GEMINI.

## Detalles del Endpoint

### URL Base
```
POST http://localhost:8000/api/v1/auth/register
```

### Headers Requeridos
```
Content-Type: application/json
accept: application/json
```

### Parámetros del Cuerpo (Body)
| Parámetro   | Tipo   | Requerido | Descripción                               | Valores Válidos                           |
|-------------|--------|-----------|-------------------------------------------|-------------------------------------------|
| username    | string | Sí        | Nombre de usuario único                  | Mínimo 3 caracteres, solo letras y números|
| email       | string | Sí        | Correo electrónico válido                | Formato de email estándar                 |
| password    | string | Sí        | Contraseña segura                        | Mínimo 8 caracteres, 1 mayúscula, 1 número y 1 carácter especial |
| full_name   | string | Sí        | Nombre completo del usuario              | Mínimo 3 caracteres                       |
| age_group   | string | Sí        | Grupo de edad del usuario                | '3-5', '6-8' o '9-12'                     |
| role        | string | Sí        | Rol del usuario en la plataforma         | 'child', 'parent', 'teacher', 'admin'     |
| avatar      | string | No        | URL de la imagen de perfil               | URL válida (opcional)                     |

### Ejemplo de Solicitud
```json
{
  "username": "nuevousuario",
  "email": "nuevo@ejemplo.com",
  "password": "Contrasena123!",
  "full_name": "Nuevo Usuario de Prueba",
  "age_group": "9-12",
  "role": "child",
  "avatar": null
}
```

### Respuesta Exitosa (Código 201)
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
  "updated_at": "2025-06-30T01:46:34.839000"
}
```

### Códigos de Estado HTTP
| Código | Descripción                           |
|--------|---------------------------------------|
| 201    | Usuario creado exitosamente          |
| 400    | Error en la solicitud                 |
| 409    | Conflicto (usuario/email ya existe)   |
| 422    | Error de validación en los parámetros |

## Ejemplo de Uso con PowerShell

### 1. Registrar un Nuevo Usuario
```powershell
$headers = @{
    'accept' = 'application/json'
    'Content-Type' = 'application/json'
}

$body = @{
    username = 'nuevousuario2'
    email = 'nuevo2@ejemplo.com'
    password = 'OtraContrasena123!'
    full_name = 'Segundo Usuario de Prueba'
    age_group = '6-8'
    role = 'child'
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri 'http://localhost:8000/api/v1/auth/register' `
    -Method Post -Headers $headers -Body $body -UseBasicParsing

# Mostrar la respuesta formateada
$response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
```

### 2. Manejo de Errores
```powershell
try {
    $response = Invoke-WebRequest -Uri 'http://localhost:8000/api/v1/auth/register' `
        -Method Post -Headers $headers -Body $body -UseBasicParsing -ErrorAction Stop
    
    $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
}
catch {
    $errorResponse = $_.ErrorDetails.Message | ConvertFrom-Json
    Write-Host "Error $($_.Exception.Response.StatusCode.value__):"
    $errorResponse | ConvertTo-Json -Depth 10
}
```

## Validaciones Implementadas

1. **Usuario**:
   - Debe ser único en el sistema
   - Mínimo 3 caracteres
   - Solo letras, números y guiones bajos

2. **Email**:
   - Formato válido
   - Debe ser único en el sistema

3. **Contraseña**:
   - Mínimo 8 caracteres
   - Al menos 1 letra mayúscula
   - Al menos 1 número
   - Al menos 1 carácter especial

4. **Grupo de Edad**:
   - Debe ser uno de los valores permitidos

5. **Rol**:
   - Debe ser uno de los roles definidos

## Pruebas Realizadas

### Caso de Éxito
- **Datos**: Usuario nuevo con información válida
- **Resultado**: Código 201 con los datos del usuario creado
- **Verificación**: El usuario puede iniciar sesión con las credenciales proporcionadas

### Casos de Error
1. **Usuario Existente**
   - **Error**: 409 Conflict
   - **Mensaje**: "El nombre de usuario ya está registrado"

2. **Email Existente**
   - **Error**: 409 Conflict
   - **Mensaje**: "El correo electrónico ya está registrado"

3. **Validación de Contraseña**
   - **Error**: 422 Unprocessable Entity
   - **Mensaje**: "La contraseña debe tener al menos 8 caracteres..."

4. **Grupo de Edad Inválido**
   - **Error**: 422 Unprocessable Entity
   - **Mensaje**: "Input should be '3-5', '6-8' or '9-12'"

## Notas Importantes

1. **Seguridad**:
   - Las contraseñas se almacenan con hash (bcrypt)
   - No se devuelve la contraseña en la respuesta

2. **Activación de Cuenta**:
   - Por defecto, las cuentas nuevas se crean como activas
   - En producción, considerar implementar verificación por correo

3. **Roles**:
   - El rol determina los permisos del usuario en la plataforma
   - Algunos roles pueden requerir aprobación manual

4. **Datos Sensibles**:
   - No registrar información sensible en campos de texto libre
   - Validar y sanitizar todas las entradas

## Referencias
- [Documentación de la API de GEMINI](http://localhost:8000/docs)
- [Estándar de contraseñas seguras](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)

---
*Última actualización: 29 de Junio de 2025*
