"""
Script de inicialización de la base de datos.

Este script se encarga de crear las colecciones necesarias, índices y datos iniciales
para el correcto funcionamiento de la aplicación GEMINI.
"""
import logging
from datetime import datetime
from pymongo import IndexModel, ASCENDING, DESCENDING, TEXT

from app.db.mongodb import db
from app.models.user import UserRole, AgeGroup

# Configuración de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def create_indexes() -> None:
    """Crea los índices necesarios en todas las colecciones."""
    logger.info("Creando índices en la base de datos...")
    
    # Índices para la colección de usuarios
    user_indexes = [
        IndexModel([("username", ASCENDING)], unique=True, name="username_unique"),
        IndexModel([("email", ASCENDING)], unique=True, name="email_unique"),
        IndexModel([("role", ASCENDING)], name="role_index"),
        IndexModel([("age_group", ASCENDING)], name="age_group_index"),
        IndexModel([("full_name", TEXT)], name="full_name_text"),
    ]
    
    # Índices para la colección de módulos educativos
    module_indexes = [
        IndexModel([("slug", ASCENDING)], unique=True, name="slug_unique"),
        IndexModel([("category", ASCENDING)], name="category_index"),
        IndexModel([("target_age_groups", ASCENDING)], name="target_age_groups_index"),
        IndexModel(
            [("title", TEXT), ("description", TEXT)],
            name="title_description_text",
            weights={"title": 10, "description": 5}
        ),
    ]
    
    # Índices para la colección de actividades
    activity_indexes = [
        IndexModel([("module_id", ASCENDING)], name="module_id_index"),
        IndexModel([("activity_type", ASCENDING)], name="activity_type_index"),
        IndexModel([("order", ASCENDING)], name="order_index"),
    ]
    
    # Índices para la colección de progreso de usuarios
    user_progress_indexes = [
        IndexModel(
            [("user_id", ASCENDING), ("activity_id", ASCENDING)],
            unique=True,
            name="user_activity_unique"
        ),
        IndexModel([("completed_at", DESCENDING)], name="completed_at_index"),
    ]
    
    # Índices para la colección de tokens
    token_indexes = [
        IndexModel(
            [("token", ASCENDING)],
            unique=True,
            name="token_unique"
        ),
        IndexModel(
            [("user_id", ASCENDING)],
            name="user_id_index"
        ),
        IndexModel(
            [("expires_at", ASCENDING)],
            name="expires_at_index"
        ),
    ]
    
    # Índices para la colección de recompensas
    reward_indexes = [
        IndexModel([("user_id", ASCENDING)], name="reward_user_id_index"),
        IndexModel([("reward_type", ASCENDING)], name="reward_type_index"),
        IndexModel([("earned_at", DESCENDING)], name="earned_at_desc_index"),
    ]
    
    # Crear los índices en cada colección
    collections_indexes = {
        "users": user_indexes,
        "modules": module_indexes,
        "activities": activity_indexes,
        "user_progress": user_progress_indexes,
        "tokens": token_indexes,
        "rewards": reward_indexes,
    }
    
    try:
        for collection_name, indexes in collections_indexes.items():
            collection = await db.get_collection(collection_name)
            await collection.create_indexes(indexes)
        logger.info("✅ Índices creados correctamente")
    except Exception as e:
        logger.error(f"❌ Error al crear índices: {e}", exc_info=True)
        raise

async def create_initial_admin() -> None:
    """Crea un usuario administrador inicial si no existe."""
    logger.info("Verificando usuario administrador inicial...")
    
    admin_data = {
        "username": "admin",
        "email": "admin@gemini.edu",
        "full_name": "Administrador del Sistema",
        "role": UserRole.ADMIN,
        "age_group": AgeGroup.AGE_9_12,  # Usando un grupo de edad válido
        "is_active": True,
        "is_verified": True,
        "hashed_password": "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",  # password: secret
    }
    
    try:
        # Obtener la colección de usuarios
        users_collection = await db.get_collection("users")
        
        # Verificar si ya existe un administrador
        existing_admin = await users_collection.find_one({"role": UserRole.ADMIN})
        
        if existing_admin:
            logger.info(f"✅ Ya existe un usuario administrador: {existing_admin['username']}")
            return
            
        # Crear el administrador
        result = await users_collection.insert_one(admin_data)
        logger.info(f"✅ Usuario administrador creado con ID: {result.inserted_id}")
        logger.warning("⚠️  ¡Recuerde cambiar la contraseña del administrador después del primer inicio de sesión!")
    except Exception as e:
        logger.error(f"❌ Error al crear el administrador inicial: {e}", exc_info=True)
        raise

async def create_initial_data() -> None:
    """Crea datos iniciales para la aplicación."""
    logger.info("Creando datos iniciales...")
    
    try:
        # Obtener las colecciones necesarias
        roles_collection = await db.get_collection("roles")
        age_groups_collection = await db.get_collection("age_groups")
        categories_collection = await db.get_collection("categories")
        
        # Crear roles de usuario si no existen
        roles = ["admin", "teacher", "student", "parent"]
        for role in roles:
            await roles_collection.update_one(
                {"name": role},
                {"$setOnInsert": {"name": role, "description": f"Rol de {role}"}},
                upsert=True
            )
        
        # Crear grupos de edad si no existen
        age_groups = [
            ("3-5", "Preescolar (3-5 años)"),
            ("6-8", "Primeros años (6-8 años)"),
            ("9-12", "Intermedio (9-12 años)"),
            ("13-15", "Pre-adolescente (13-15 años)"),
            ("16-18", "Adolescente (16-18 años)"),
            ("adult", "Adulto (18+ años)")
        ]
        
        for age_code, description in age_groups:
            await age_groups_collection.update_one(
                {"code": age_code},
                {"$setOnInsert": {"code": age_code, "description": description}},
                upsert=True
            )
        
        # Crear categorías de módulos si no existen
        categories = [
            ("math", "Matemáticas"),
            ("science", "Ciencias"),
            ("language", "Lenguaje"),
            ("history", "Historia"),
            ("art", "Arte"),
            ("programming", "Programación")
        ]
        
        for category_code, name in categories:
            await categories_collection.update_one(
                {"code": category_code},
                {"$setOnInsert": {"code": category_code, "name": name}},
                upsert=True
            )
        
        # Crear módulos educativos de ejemplo
        modules = [
            {
                "title": "Matemáticas Básicas",
                "slug": "matematicas-basicas",
                "description": "Aprende los conceptos básicos de matemáticas de manera divertida.",
                "category": "math",
                "target_age_groups": ["3-5", "6-8", "9-12"],
                "is_active": True,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            },
            {
                "title": "Historia Universal",
                "slug": "historia-universal",
                "description": "Descubre los eventos más importantes de la historia de la humanidad.",
                "category": "history",
                "target_age_groups": ["6-8", "9-12"],
                "is_active": True,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            },
            {
                "title": "Ciencias Naturales",
                "slug": "ciencias-naturales",
                "description": "Explora los misterios de la naturaleza y el universo.",
                "category": "science",
                "target_age_groups": ["3-5", "6-8", "9-12"],
                "is_active": True,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            },
            {
                "title": "Salud y Bienestar",
                "slug": "salud-bienestar",
                "description": "Aprende hábitos saludables para una vida plena.",
                "category": "science",
                "target_age_groups": ["3-5", "6-8", "9-12"],
                "is_active": True,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            },
            {
                "title": "Deportes",
                "slug": "deportes",
                "description": "Conoce diferentes deportes y sus beneficios para la salud.",
                "category": "art",
                "target_age_groups": ["3-5", "6-8", "9-12"],
                "is_active": True,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            },
            {
                "title": "Valores Espirituales",
                "slug": "valores-espirituales",
                "description": "Desarrolla valores espirituales y éticos para una vida armoniosa.",
                "category": "programming",
                "target_age_groups": ["3-5", "6-8", "9-12"],
                "is_active": True,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
        ]
        
        # Insertar módulos si no existen
        modules_collection = await db.get_collection("modules")
        for module in modules:
            existing_module = await modules_collection.find_one({"slug": module["slug"]})
            if not existing_module:
                await modules_collection.insert_one(module)
                logger.info(f"Módulo creado: {module['title']}")
        
        logger.info("✅ Datos iniciales creados correctamente")
    except Exception as e:
        logger.error(f"❌ Error al crear datos iniciales: {e}", exc_info=True)
        raise

async def init_db() -> None:
    """Inicializa la base de datos con índices y datos iniciales."""
    try:
        # Conectar a la base de datos
        connected = await db.connect_db()
        if not connected:
            raise RuntimeError("No se pudo conectar a la base de datos")
            
        logger.info("✅ Conexión a la base de datos establecida")
        
        # Crear índices
        await create_indexes()
        
        # Crear datos iniciales
        await create_initial_data()
        
        # Crear administrador inicial
        await create_initial_admin()
        
        logger.info("✅ Base de datos inicializada correctamente")
    except Exception as e:
        logger.error(f"❌ Error al inicializar la base de datos: {e}", exc_info=True)
        raise
    finally:
        # Cerrar la conexión
        if db:
            await db.close_db()

if __name__ == "__main__":
    # Ejecutar la inicialización
    import asyncio
    
    async def run_init():
        try:
            await init_db()
        except Exception as e:
            logger.error(f"Error durante la inicialización: {e}", exc_info=True)
            raise
    
    try:
        asyncio.run(run_init())
    except KeyboardInterrupt:
        logger.info("\nOperación cancelada por el usuario")
    except Exception as e:
        logger.error(f"Error inesperado: {e}", exc_info=True)
        exit(1)
