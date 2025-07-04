"""
Modelos de Usuario y autenticación para la API
"""
from typing import Optional, ForwardRef, Any, Dict
from datetime import datetime
from bson import ObjectId
from pydantic import BaseModel, EmailStr, Field, validator
from enum import Enum

# Forward reference para UserResponse
UserResponse = ForwardRef('UserResponse')

class Token(BaseModel):
    """Modelo para el token de acceso"""
    access_token: str
    token_type: str
    user: UserResponse

class TokenData(BaseModel):
    """Datos del token"""
    username: Optional[str] = None

class UserRole(str, Enum):
    """Roles de usuario disponibles"""
    CHILD = "child"
    PARENT = "parent"
    TEACHER = "teacher"
    ADMIN = "admin"

class AgeGroup(str, Enum):
    """Grupos de edad disponibles"""
    AGE_3_5 = "3-5"
    AGE_6_8 = "6-8"
    AGE_9_12 = "9-12"

class UserBase(BaseModel):
    """Modelo base para usuarios"""
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    full_name: Optional[str] = Field(None, max_length=100)
    role: UserRole = UserRole.CHILD
    age_group: Optional[AgeGroup] = None
    is_active: bool = True
    avatar: Optional[str] = None
    
    @validator('username')
    def username_must_be_alphanumeric(cls, v):
        if not v.isalnum():
            raise ValueError('El nombre de usuario solo puede contener letras y números')
        return v.lower()

class UserCreate(UserBase):
    """Modelo para la creación de usuarios"""
    password: str = Field(..., min_length=8)
    
    @validator('password')
    def password_strength(cls, v):
        if len(v) < 8:
            raise ValueError('La contraseña debe tener al menos 8 caracteres')
        if not any(char.isdigit() for char in v):
            raise ValueError('La contraseña debe contener al menos un número')
        if not any(char.isalpha() for char in v):
            raise ValueError('La contraseña debe contener al menos una letra')
        return v

class UserInDB(UserBase):
    """Modelo para usuarios en la base de datos"""
    id: str = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    last_login: Optional[datetime] = None
    
    class Config:
        allow_population_by_field_name = True
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None,
            ObjectId: lambda v: str(v) if v else None
        }
        json_schema_extra = {
            "example": {
                "id": "507f1f77bcf86cd799439011",
                "username": "usuario123",
                "email": "usuario@ejemplo.com",
                "full_name": "Nombre Apellido",
                "role": "child",
                "age_group": "6-8",
                "is_active": True,
                "avatar": "https://example.com/avatar.jpg",
                "created_at": "2023-01-01T00:00:00",
                "updated_at": "2023-01-01T00:00:00"
            }
        }
        
    def dict(self, *args, **kwargs):
        """Sobrescribe el método dict para manejar correctamente la serialización"""
        result = super().dict(*args, **kwargs)
        # Asegurarse de que los campos de fecha se conviertan a string
        for field in ["created_at", "updated_at", "last_login"]:
            if field in result and result[field] is not None:
                if isinstance(result[field], datetime):
                    result[field] = result[field].isoformat()
        # Asegurarse de que el ID se maneje correctamente
        if "_id" in result and result["_id"] is None:
            result.pop("_id")
        return result

class UserResponse(UserBase):
    """Modelo para la respuesta de la API"""
    id: Optional[str] = Field(None, alias="_id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    last_login: Optional[datetime] = None
    
    class Config:
        allow_population_by_field_name = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }
        schema_extra = {
            "example": {
                "id": "507f1f77bcf86cd799439011",
                "username": "usuario123",
                "email": "usuario@ejemplo.com",
                "full_name": "Nombre Apellido",
                "role": "child",
                "age_group": "6-8",
                "is_active": True,
                "avatar": "https://example.com/avatar.jpg",
                "created_at": "2023-01-01T00:00:00",
                "updated_at": "2023-01-01T00:00:00"
            }
        }

class UserUpdate(BaseModel):
    """Modelo para actualizar usuarios"""
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    age_group: Optional[AgeGroup] = None
    avatar: Optional[str] = None
    is_active: Optional[bool] = None
    password: Optional[str] = None
    
    @validator('password')
    def password_strength(cls, v):
        if v is not None:
            if len(v) < 8:
                raise ValueError('La contraseña debe tener al menos 8 caracteres')
            if not any(char.isdigit() for char in v):
                raise ValueError('La contraseña debe contener al menos un número')
            if not any(char.isalpha() for char in v):
                raise ValueError('La contraseña debe contener al menos una letra')
        return v

# Modelo para el usuario en la autenticación
class User(UserBase):
    """Modelo para el usuario en la autenticación"""
    id: str = Field(..., alias="_id")
    
    class Config:
        allow_population_by_field_name = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

# Actualizar referencias circulares
UserResponse.update_forward_refs()
Token.update_forward_refs()
