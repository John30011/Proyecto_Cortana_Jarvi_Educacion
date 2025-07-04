import httpx
import asyncio
import json

async def test_register():
    url = "http://localhost:8000/api/v1/auth/register"
    
    # Datos del nuevo usuario
    user_data = {
        "username": "testuser",
        "email": "test@example.com",
        "password": "TestPass123",
        "full_name": "Usuario de Prueba",
        "role": "child",
        "age_group": "6-8",
        "is_active": True
    }
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=user_data, timeout=10.0)
            
            print(f"Status Code: {response.status_code}")
            print("Response:")
            print(json.dumps(response.json(), indent=2, ensure_ascii=False))
            
            return response.status_code == 201
            
    except Exception as e:
        print(f"Error al realizar la petición: {str(e)}")
        return False

if __name__ == "__main__":
    success = asyncio.run(test_register())
    if success:
        print("\n✅ Prueba de registro exitosa!")
    else:
        print("\n❌ La prueba de registro falló.")
