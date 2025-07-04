from fastapi import Request, HTTPException, status
from fastapi.concurrency import run_in_threadpool
from functools import wraps
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Callable, Any
import asyncio
from app.core.config import settings
from app.core.logging_config import get_logger

logger = get_logger(__name__)

class RateLimiter:
    """
    Implementa un limitador de tasa simple para limitar el número de solicitudes
    por período de tiempo.
    """
    def __init__(self, requests: int = 100, window: int = 60):
        """
        Inicializa el limitador de tasa.
        
        Args:
            requests: Número máximo de solicitudes permitidas
            window: Período de tiempo en segundos
        """
        self.requests = requests
        self.window = window
        self.timestamps: Dict[str, List[datetime]] = {}
        self.lock = asyncio.Lock()
    
    async def is_rate_limited(self, key: str) -> bool:
        """
        Verifica si una clave ha excedido el límite de tasa.
        
        Args:
            key: Clave única para identificar al cliente (ej: dirección IP)
            
        Returns:
            bool: True si se debe limitar la tasa, False en caso contrario
        """
        async with self.lock:
            now = datetime.utcnow()
            window_start = now - timedelta(seconds=self.window)
            
            # Filtrar timestamps fuera de la ventana actual
            if key in self.timestamps:
                self.timestamps[key] = [
                    ts for ts in self.timestamps[key] 
                    if ts > window_start
                ]
            else:
                self.timestamps[key] = []
            
            # Verificar si se ha excedido el límite
            if len(self.timestamps[key]) >= self.requests:
                return True
            
            # Registrar la nueva solicitud
            self.timestamps[key].append(now)
            return False

def get_client_ip(request: Request) -> str:
    """
    Obtiene la dirección IP del cliente a partir de la solicitud.
    
    Args:
        request: Objeto de solicitud FastAPI
        
    Returns:
        str: Dirección IP del cliente
    """
    if "x-forwarded-for" in request.headers:
        return request.headers["x-forwarded-for"].split(",")[0]
    return request.client.host or "unknown"

# Instancia global del limitador de tasa
rate_limiter = RateLimiter(
    requests=settings.RATE_LIMIT_REQUESTS,
    window=settings.RATE_LIMIT_WINDOW
)

def rate_limit():
    """
    Decorador para aplicar límites de tasa a los endpoints de la API.
    """
    def decorator(func):
        @wraps(func)
        async def wrapper(request: Request, *args, **kwargs):
            client_ip = get_client_ip(request)
            
            if await rate_limiter.is_rate_limited(client_ip):
                logger.warning(
                    f"Límite de tasa excedido para la IP {client_ip}",
                    extra={"ip": client_ip, "path": request.url.path}
                )
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail={
                        "status": "error",
                        "message": "Demasiadas solicitudes. Por favor, intente de nuevo más tarde.",
                        "retry_after": rate_limiter.window
                    },
                    headers={
                        "Retry-After": str(rate_limiter.window),
                        "X-RateLimit-Limit": str(rate_limiter.requests),
                        "X-RateLimit-Remaining": "0",
                        "X-RateLimit-Reset": str(
                            int((datetime.utcnow() + timedelta(seconds=rate_limiter.window)).timestamp())
                        )
                    }
                )
            
            # Obtener el número de solicitudes restantes
            remaining = rate_limiter.requests - len(rate_limiter.timestamps.get(client_ip, []))
            
            # Llamar a la función original
            response = await func(request, *args, **kwargs)
            
            # Agregar encabezados de tasa
            response.headers.update({
                "X-RateLimit-Limit": str(rate_limiter.requests),
                "X-RateLimit-Remaining": str(max(0, remaining)),
                "X-RateLimit-Reset": str(
                    int((datetime.utcnow() + timedelta(seconds=rate_limiter.window)).timestamp())
                )
            })
            
            return response
        return wrapper
    return decorator
