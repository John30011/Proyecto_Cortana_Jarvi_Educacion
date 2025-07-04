"""
Pruebas para los endpoints de usuarios.

Este módulo contiene pruebas para los endpoints de la API de usuarios,
incluyendo la creación, lectura, actualización y eliminación de usuarios.
"""
import pytest
from fastapi import status
from fastapi.testclient import TestClient
from app.main import app
from app.core.security import create_access_token
from app.models.user import UserInDB

# Cliente de prueba
client = TestClient(app)

# Datos de prueba
TEST_USER = {
    "username": "testuser",
    "email": "test@example.com",
    "full_name": "Test User",
    "password": "testpassword123",
    "is_active": True,
    "is_superuser": False,
    "role": "user"
}

# Token de autenticación para pruebas
ADMIN_TOKEN = create_access_token(data={"sub": "admin@example.com", "scopes": ["admin"]})
USER_TOKEN = create_access_token(data={"sub": "user@example.com", "scopes": ["user"]})

# Fixture para crear un usuario de prueba
@pytest.fixture(scope="module")
def test_user():
    # Crear usuario de prueba
    user_data = TEST_USER.copy()
    user = UserInDB(**user_data, hashed_password="hashed_password")
    # Aquí deberías guardar el usuario en la base de datos de prueba
    # db.users.insert_one(user.dict())
    return user

def test_read_users_me():
    """Test para el endpoint que devuelve el usuario actual."""
    # Usuario autenticado
    response = client.get(
        "/api/v1/users/me",
        headers={"Authorization": f"Bearer {USER_TOKEN}"}
    )
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "email" in data
    assert data["email"] == "user@example.com"

def test_read_users_me_unauthorized():
    """Test para verificar la autenticación requerida."""
    response = client.get("/api/v1/users/me")
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

def test_update_user_me():
    """Test para actualizar los datos del usuario actual."""
    update_data = {"full_name": "Updated Name"}
    response = client.put(
        "/api/v1/users/me",
        json=update_data,
        headers={"Authorization": f"Bearer {USER_TOKEN}"}
    )
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["full_name"] == "Updated Name"

def test_read_users_admin():
    """Test para listar usuarios (solo administradores)."""
    response = client.get(
        "/api/v1/users/",
        headers={"Authorization": f"Bearer {ADMIN_TOKEN}"}
    )
    assert response.status_code == status.HTTP_200_OK
    assert isinstance(response.json(), list)

def test_read_users_forbidden():
    """Test para verificar que solo los administradores pueden listar usuarios."""
    response = client.get(
        "/api/v1/users/",
        headers={"Authorization": f"Bearer {USER_TOKEN}"}
    )
    assert response.status_code == status.HTTP_403_FORBIDDEN

def test_read_user():
    """Test para obtener un usuario por ID (solo administradores)."""
    # Primero necesitaríamos el ID de un usuario existente
    # user_id = "..."
    # response = client.get(
    #     f"/api/v1/users/{user_id}",
    #     headers={"Authorization": f"Bearer {ADMIN_TOKEN}"}
    # )
    # assert response.status_code == status.HTTP_200_OK
    pass  # Implementar cuando tengamos la lógica de base de datos de prueba

# Agregar más pruebas según sea necesario
