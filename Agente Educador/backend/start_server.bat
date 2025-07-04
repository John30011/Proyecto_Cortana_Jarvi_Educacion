@echo off
SET MONGODB_URI=mongodb://localhost:27017
SET MONGODB_URL=mongodb://localhost:27017
SET DB_NAME=gemini_educacion
SET SECRET_KEY=clave_secreta_temporal
SET ALGORITHM=HS256
SET DEBUG=True

poetry run uvicorn main:app --reload --host 0.0.0.0 --port 8000
