"""
Módulo principal de la API v1.

Este módulo exporta el router principal de la API v1 con todos los endpoints.
"""
from fastapi import APIRouter

from app.api.v1.endpoints import auth, test, users

# Crear el router principal de la API v1
api_router = APIRouter(prefix="/api/v1")

# Incluir routers de los diferentes módulos
# Los prefijos ya están definidos en los routers individuales
api_router.include_router(auth.router, tags=["auth"])
api_router.include_router(test.router, tags=["test"])
api_router.include_router(users.router, prefix="/users", tags=["users"])