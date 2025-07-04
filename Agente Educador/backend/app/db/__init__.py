"""
Módulo de base de datos de GEMINI.

Este paquete contiene la configuración y utilidades para interactuar con la base de datos.
"""
from .mongodb import db
from .utils import create_indexes, initialize_default_admin, get_database_stats
from .init_db import init_db as initialize_database

# Alias para mantener la compatibilidad
connect_to_mongo = db.connect_db
close_mongo_connection = db.close_db

__all__ = [
    'db',
    'connect_to_mongo',
    'close_mongo_connection',
    'create_indexes',
    'initialize_default_admin',
    'get_database_stats',
    'initialize_database'
]
