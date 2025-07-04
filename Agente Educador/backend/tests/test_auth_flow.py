"""
Pruebas para el flujo de autenticación con tokens de actualización.
"""
import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.models.user import UserCreate
from app.repositories.user_repository import UserRepository

client = TestClient(app)

def create_test_user():
    """Crea un usuario de prueba y devuelve sus credenciales."""
    test_user = {
        "username": "testuser",
        "email": "test@example.com",
        "password": "TestPass123!",
        "full_name": "Test User",
        "age_group": "6-8"
    }
    
    # Eliminar el usuario si ya existe
    user = UserRepository.get_user_by_username(test_user["username"])
    if user:
        UserRepository.delete_user(str(user.id))
    
    # Crear el usuario
    user_in = UserCreate(**test_user)
    user = UserRepository.create_user(user_in)
    
    return {
        "username": test_user["username"],
        "password": test_user["password"],
        "user_id": str(user.id)
    }

@pytest.mark.asyncio
async def test_login_with_refresh_token():
    """Prueba el flujo completo de autenticación con refresh token."""
    # Crear usuario de prueba
    test_creds = create_test_user()
    
    # 1. Iniciar sesión para obtener tokens
    login_data = {
        "username": test_creds["username"],
        "password": test_creds["password"]
    }
    
    # Realizar login
    response = client.post(
        "/api/v1/auth/token",
        data=login_data,
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    
    # Verificar que el login fue exitoso
    assert response.status_code == 200
    token_data = response.json()
    assert "access_token" in token_data
    assert "refresh_token" in token_data
    assert "user" in token_data
    assert token_data["user"]["username"] == test_creds["username"]
    
    # Guardar tokens para usarlos más tarde
    access_token = token_data["access_token"]
    refresh_token = token_data["refresh_token"]
    
    # 2. Usar el token de acceso para acceder a un recurso protegido
    response = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {access_token}"}
    )
    assert response.status_code == 200
    
    # 3. Usar el refresh token para obtener un nuevo access token
    response = client.post(
        "/api/v1/auth/refresh-token",
        headers={"Authorization": f"Bearer {refresh_token}"}
    )
    
    # Verificar que el refresh fue exitoso
    assert response.status_code == 200
    new_token_data = response.json()
    assert "access_token" in new_token_data
    assert "refresh_token" in new_token_data
    assert new_token_data["access_token"] != access_token  # Debe ser un token diferente
    
    # 4. Verificar que el nuevo token de acceso funciona
    new_access_token = new_token_data["access_token"]
    response = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {new_access_token}"}
    )
    assert response.status_code == 200
    
    # 5. Verificar que el token antiguo ya no es válido (opcional, depende de tu implementación)
    # Esto puede variar según cómo manejes los tokens revocados
    
    # 6. Cerrar sesión
    response = client.post(
        "/api/v1/auth/logout",
        headers={"Authorization": f"Bearer {new_access_token}"}
    )
    assert response.status_code == 200
    
    # 7. Verificar que el token ya no es válido después de cerrar sesión
    response = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {new_access_token}"},
    )
    assert response.status_code == 401  # No autorizado
    
    # Limpieza: eliminar el usuario de prueba
    user = UserRepository.get_user_by_username(test_creds["username"])
    if user:
        UserRepository.delete_user(str(user.id))
