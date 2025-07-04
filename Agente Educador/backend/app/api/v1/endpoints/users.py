"""
Endpoints para la gestión de usuarios
"""
from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from app.models.user import User, UserUpdate, UserResponse
from app.repositories.user_repository import UserRepository
from app.core.auth import get_current_active_user, get_current_active_admin
from app.core.security import get_password_hash

router = APIRouter()

# Obtener el usuario actual
@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    """
    Obtiene la información del usuario actualmente autenticado.
    """
    return current_user

# Actualizar usuario actual
@router.put("/me", response_model=UserResponse)
async def update_user_me(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_active_user)
):
    """
    Actualiza la información del usuario actual.
    """
    user_repo = await UserRepository.get_user_repository()
    
    # Actualizar solo los campos proporcionados
    update_data = user_update.dict(exclude_unset=True)
    
    # Si se está actualizando la contraseña, hashearla
    if 'password' in update_data:
        update_data['hashed_password'] = get_password_hash(update_data.pop('password'))
    
    updated_user = await user_repo.update_user(str(current_user.id), update_data)
    if not updated_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )
    
    return updated_user

# Obtener todos los usuarios (solo administradores)
@router.get("/", response_model=List[UserResponse])
async def read_users(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_admin)
):
    """
    Obtiene una lista de usuarios (solo para administradores).
    """
    user_repo = await UserRepository.get_user_repository()
    users = await user_repo.get_users(skip=skip, limit=limit)
    return users

# Obtener usuario por ID
@router.get("/{user_id}", response_model=UserResponse)
async def read_user(
    user_id: str,
    current_user: User = Depends(get_current_active_user)
):
    """
    Obtiene un usuario por su ID.
    """
    # Solo los administradores pueden ver otros usuarios
    if not current_user.is_superuser and str(current_user.id) != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tiene permisos para ver este usuario"
        )
    
    user_repo = await UserRepository.get_user_repository()
    user = await user_repo.get_user(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )
    
    return user

# Actualizar usuario
@router.put("/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: str,
    user_update: UserUpdate,
    current_user: User = Depends(get_current_active_admin)
):
    """
    Actualiza un usuario (solo para administradores).
    """
    user_repo = await UserRepository.get_user_repository()
    
    # Verificar si el usuario existe
    existing_user = await user_repo.get_user(user_id)
    if not existing_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )
    
    # Actualizar solo los campos proporcionados
    update_data = user_update.dict(exclude_unset=True)
    
    # Si se está actualizando la contraseña, hashearla
    if 'password' in update_data:
        update_data['hashed_password'] = get_password_hash(update_data.pop('password'))
    
    updated_user = await user_repo.update_user(user_id, update_data)
    return updated_user

# Eliminar usuario
@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    user_id: str,
    current_user: User = Depends(get_current_active_admin)
):
    """
    Elimina un usuario (solo para administradores).
    """
    user_repo = await UserRepository.get_user_repository()
    
    # No permitir eliminarse a sí mismo
    if str(current_user.id) == user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No puede eliminarse a sí mismo"
        )
    
    deleted = await user_repo.delete_user(user_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )
    
    return {"ok": True}
