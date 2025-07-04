"""
Módulo que contiene todos los endpoints de la API v1.
"""
from fastapi import APIRouter

# Importar rutas aquí
from . import auth, test, users

router = APIRouter()

# Incluir routers
router.include_router(auth.router)
router.include_router(test.router)
router.include_router(users.router, prefix="/users", tags=["users"])