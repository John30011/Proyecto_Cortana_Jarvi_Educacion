"""
Modelos para el manejo de tokens JWT
"""
from datetime import datetime
from typing import Optional, Dict, Any
from pydantic import BaseModel, Field, validator

class TokenBase(BaseModel):
    """Modelo base para tokens"""
    access_token: str = Field(..., description="Token de acceso JWT")
    token_type: str = Field("bearer", description="Tipo de token, siempre 'bearer'")
    expires_in: Optional[int] = Field(
        None, 
        description="Tiempo de expiración en segundos"
    )
    refresh_token: Optional[str] = Field(
        None, 
        description="Token de actualización para obtener nuevos tokens de acceso"
    )
    user: Optional[Dict[str, Any]] = Field(
        None, 
        description="Información básica del usuario autenticado"
    )

class Token(TokenBase):
    """
    Modelo para respuesta de tokens de autenticación.
    
    Incluye tanto el token de acceso como el de actualización.
    """
    class Config:
        schema_extra = {
            "example": {
                "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                "token_type": "bearer",
                "expires_in": 86400,
                "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                "user": {
                    "id": "507f1f77bcf86cd799439011",
                    "username": "usuario_ejemplo",
                    "email": "usuario@ejemplo.com",
                    "is_active": True,
                    "role": "user"
                }
            }
        }

class TokenData(BaseModel):
    """Datos del token"""
    username: Optional[str] = None
    scopes: list[str] = []

class TokenBlacklistBase(BaseModel):
    """Modelo base para tokens en lista negra"""
    token: str
    token_type: str = "access"  # 'access' o 'refresh'
    expires_at: datetime
    user_id: str
    reason: Optional[str] = None
    
    @validator('token_type')
    def validate_token_type(cls, v):
        if v not in ['access', 'refresh']:
            raise ValueError('El tipo de token debe ser "access" o "refresh"')
        return v

class TokenBlacklistInDB(TokenBlacklistBase):
    """Modelo para tokens en lista negra en la base de datos"""
    id: str = Field(..., alias="_id")
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }
        schema_extra = {
            "example": {
                "id": "507f1f77bcf86cd799439011",
                "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                "token_type": "access",
                "expires_at": "2023-01-01T00:00:00",
                "user_id": "507f1f77bcf86cd799439012",
                "reason": "logout",
                "created_at": "2023-01-01T00:00:00"
            }
        }

class TokenBlacklistCreate(TokenBlacklistBase):
    """Modelo para crear un nuevo token en lista negra"""
    pass
