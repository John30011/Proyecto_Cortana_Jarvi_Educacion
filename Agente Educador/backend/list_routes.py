import sys
import os
from fastapi import FastAPI
import uvicorn

# Asegurarse de que el directorio del proyecto esté en el path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Importar la aplicación principal
from main import app as main_app

# Función para listar rutas
def list_routes():
    routes = []
    for route in main_app.routes:
        route_info = {
            "path": getattr(route, "path", ""),
            "name": getattr(route, "name", ""),
            "methods": getattr(route, "methods", []),
            "endpoint": getattr(route, "endpoint", "").__name__ if hasattr(route, "endpoint") else ""
        }
        routes.append(route_info)
    
    print("\nRutas disponibles en la aplicación:")
    print("-" * 70)
    for route in routes:
        print(f"Path: {route['path']}")
        print(f"Methods: {', '.join(route['methods'])}")
        print(f"Endpoint: {route['endpoint']}")
        print("-" * 70)

if __name__ == "__main__":
    list_routes()
