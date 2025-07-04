from fastapi import FastAPI
import uvicorn

app = FastAPI()

# Importar la aplicación principal
from main import app as main_app

# Montar la aplicación principal
app.mount("", main_app)

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
    print("-" * 50)
    for route in routes:
        print(f"Path: {route['path']}")
        print(f"Methods: {', '.join(route['methods'])}")
        print(f"Endpoint: {route['endpoint']}")
        print("-" * 50)

if __name__ == "__main__":
    list_routes()
