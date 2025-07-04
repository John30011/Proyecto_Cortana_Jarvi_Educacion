"""
Utilidades para la base de datos de GEMINI.

Este módulo proporciona funciones auxiliares para operaciones comunes en la base de datos,
como la creación de índices, inicialización de datos, etc.
"""
from typing import List, Dict, Any
from pymongo import IndexModel, ASCENDING, DESCENDING, TEXT

from app.db.mongodb import db
from app.models.user import UserRole


async def create_indexes() -> None:
    """
    Crea los índices necesarios en las colecciones de la base de datos.
    
    Esta función debe ser llamada al iniciar la aplicación para asegurar
    que los índices estén correctamente configurados.
    """
    # Índices para la colección de usuarios
    user_indexes = [
        # Índice único para nombre de usuario
        IndexModel([("username", ASCENDING)], unique=True, name="username_unique"),
        # Índice único para correo electrónico
        IndexModel([("email", ASCENDING)], unique=True, name="email_unique"),
        # Índice para búsqueda por rol
        IndexModel([("role", ASCENDING)], name="role_index"),
        # Índice para búsqueda por grupo de edad
        IndexModel([("age_group", ASCENDING)], name="age_group_index"),
        # Índice para búsqueda de texto en nombre completo
        IndexModel([("full_name", TEXT)], name="full_name_text"),
    ]
    
    # Índices para la colección de módulos educativos
    module_indexes = [
        # Índice único para el slug del módulo
        IndexModel([("slug", ASCENDING)], unique=True, name="slug_unique"),
        # Índice para búsqueda por categoría
        IndexModel([("category", ASCENDING)], name="category_index"),
        # Índice para búsqueda por grupo de edad objetivo
        IndexModel([("target_age_groups", ASCENDING)], name="target_age_groups_index"),
        # Índice para búsqueda de texto en título y descripción
        IndexModel(
            [("title", TEXT), ("description", TEXT)],
            name="title_description_text",
            weights={"title": 10, "description": 5}
        ),
    ]
    
    # Índices para la colección de actividades
    activity_indexes = [
        # Índice para búsqueda por módulo
        IndexModel([("module_id", ASCENDING)], name="module_id_index"),
        # Índice para búsqueda por tipo de actividad
        IndexModel([("activity_type", ASCENDING)], name="activity_type_index"),
        # Índice para ordenar por orden de la actividad
        IndexModel([("order", ASCENDING)], name="order_index"),
    ]
    
    # Índices para la colección de progreso de usuarios
    progress_indexes = [
        # Índice compuesto para búsqueda por usuario y actividad
        IndexModel(
            [("user_id", ASCENDING), ("activity_id", ASCENDING)],
            unique=True,
            name="user_activity_unique"
        ),
        # Índice para búsqueda por usuario
        IndexModel([("user_id", ASCENDING)], name="user_id_index"),
        # Índice para búsqueda por actividad
        IndexModel([("activity_id", ASCENDING)], name="activity_id_index"),
    ]
    
    # Índices para la colección de recompensas
    reward_indexes = [
        # Índice para búsqueda por usuario
        IndexModel([("user_id", ASCENDING)], name="reward_user_id_index"),
        # Índice para búsqueda por tipo de recompensa
        IndexModel([("reward_type", ASCENDING)], name="reward_type_index"),
        # Índice para ordenar por fecha de obtención
        IndexModel([("earned_at", DESCENDING)], name="earned_at_desc_index"),
    ]
    
    # Crear los índices en sus respectivas colecciones
    collections_and_indexes = {
        "users": user_indexes,
        "modules": module_indexes,
        "activities": activity_indexes,
        "user_progress": progress_indexes,
        "rewards": reward_indexes,
    }
    
    for collection_name, indexes in collections_and_indexes.items():
        if indexes:  # Solo crear índices si la lista no está vacía
            await db.get_collection(collection_name).create_indexes(indexes)
    
    print("✅ Índices de la base de datos creados correctamente")


async def initialize_default_admin() -> None:
    """
    Inicializa un usuario administrador por defecto si no existe ninguno.
    
    Esta función debe llamarse al iniciar la aplicación para asegurar que
    siempre haya al menos un usuario administrador en el sistema.
    """
    from app.repositories.user_repository import UserRepository
    from app.models.user import UserCreate
    
    # Verificar si ya existe algún administrador
    admin_exists = await db.get_collection("users").find_one({"role": UserRole.ADMIN})
    
    if not admin_exists:
        try:
            # Crear el usuario administrador por defecto
            admin_data = UserCreate(
                username="admin",
                email="admin@gemini.edu",
                password="Admin123!",  # En producción, esto debería ser una contraseña segura generada automáticamente
                full_name="Administrador del Sistema",
                role=UserRole.ADMIN,
                is_active=True
            )
            
            # Crear el usuario administrador
            admin = await UserRepository.create_user(admin_data)
            print(f"✅ Usuario administrador creado: {admin.username}")
            
        except Exception as e:
            print(f"⚠️  No se pudo crear el usuario administrador por defecto: {str(e)}")
    else:
        print("✅ Ya existe al menos un usuario administrador en el sistema")


async def get_database_stats() -> Dict[str, Any]:
    """
    Obtiene estadísticas de la base de datos.
    
    Returns:
        Dict[str, Any]: Diccionario con estadísticas de la base de datos
    """
    try:
        # Obtener la instancia de la base de datos
        database = await db.get_db()
        
        # Obtener estadísticas del servidor de base de datos
        db_stats = await database.command("dbstats")
        
        # Contar documentos en cada colección
        collections = await database.list_collection_names()
        collection_counts = {}
        
        for collection_name in collections:
            if collection_name not in ["system.views", "system.indexes"]:
                collection = database[collection_name]
                count = await collection.count_documents({})
                collection_counts[collection_name] = count
        
        return {
            "db_name": db_stats.get("db", "unknown"),
            "collections": collection_counts,
            "data_size_mb": round(db_stats.get("dataSize", 0) / (1024 * 1024), 2),
            "storage_size_mb": round(db_stats.get("storageSize", 0) / (1024 * 1024), 2),
            "index_size_mb": round(db_stats.get("indexSize", 0) / (1024 * 1024), 2),
        }
    except Exception as e:
        print(f"Error al obtener estadísticas de la base de datos: {str(e)}")
        return {
            "error": str(e),
            "message": "No se pudieron obtener las estadísticas de la base de datos"
        }
