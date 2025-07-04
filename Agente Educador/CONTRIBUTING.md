# 🚀 Guía de Contribución para GEMINI

¡Gracias por tu interés en contribuir a GEMINI! Estamos emocionados de tenerte a bordo. Por favor, tómate un momento para revisar las siguientes pautas para contribuir al proyecto.

## 📋 Tabla de Contenidos

1. [Código de Conducta](#código-de-conducta)
2. [¿Cómo Contribuir?](#cómo-contribuir)
3. [Reportar Errores](#reportar-errores)
4. [Solicitar Funcionalidades](#solicitar-funcionalidades)
5. [Primeros Pasos](#primeros-pasos)
6. [Proceso de Pull Request](#proceso-de-pull-request)
7. [Estándares de Código](#estándares-de-código)
8. [Pruebas](#pruebas)
9. [Documentación](#documentación)
10. [Preguntas Frecuentes](#preguntas-frecuentes)

## 📜 Código de Conducta

Este proyecto y todos los participantes se rigen por nuestro [Código de Conducta](CODE_OF_CONDUCT.md). Al participar, se espera que respetes este código.

## 🤝 ¿Cómo Contribuir?

### Reportar Errores

1. **Verifica si el error ya ha sido reportado** buscando en los [issues](https://github.com/tu-usuario/gemini-educador/issues).
2. Si no encuentras un issue existente, [crea uno nuevo](https://github.com/tu-usuario/gemini-educador/issues/new).
3. Proporciona un título claro y descriptivo.
4. Describe los pasos para reproducir el error.
5. Incluye capturas de pantalla o ejemplos de código si es posible.

### Solicitar Funcionalidades

1. **Verifica si la funcionalidad ya ha sido solicitada** buscando en los [issues](https://github.com/tu-usuario/gemini-educador/issues).
2. Si no encuentras un issue existente, [crea uno nuevo](https://github.com/tu-usuario/gemini-educador/issues/new).
3. Describe la funcionalidad que te gustaría ver implementada.
4. Explica por qué crees que sería útil para el proyecto.

## 🚀 Primeros Pasos

### Configuración del Entorno de Desarrollo

1. Haz un fork del repositorio y clónalo localmente.
2. Configura el entorno de desarrollo siguiendo las instrucciones en el [README.md](README.md).
3. Crea una rama para tu contribución:
   ```bash
   git checkout -b mi-contribucion
   ```
4. Realiza tus cambios siguiendo los estándares de código.
5. Asegúrate de que todas las pruebas pasen.
6. Envía un Pull Request siguiendo el proceso descrito a continuación.

## 🔄 Proceso de Pull Request

1. Asegúrate de que tu rama esté actualizada con la rama principal:
   ```bash
   git pull origin main
   ```
2. Resuelve cualquier conflicto que pueda surgir.
3. Ejecuta las pruebas para asegurarte de que todo funcione correctamente.
4. Envía tu Pull Request a la rama `main`.
5. Proporciona una descripción clara de los cambios realizados.
6. Espera a que los mantenedores revisen tu Pull Request.

## 📏 Estándares de Código

- Sigue las convenciones de código de Python (PEP 8).
- Escribe pruebas unitarias para el código nuevo.
- Documenta el código siguiendo las convenciones de docstrings de Python.
- Mantén las líneas de código en 88 caracteres o menos (configuración recomendada para Black).

### Formateo de Código

Usamos las siguientes herramientas para mantener la consistencia del código:

- **Black** para el formateo de código Python.
- **isort** para ordenar las importaciones.
- **Flake8** para el análisis estático del código.

Puedes formatear el código automáticamente con:

```bash
# Formatear código con Black
black .

# Ordenar importaciones con isort
isort .

# Verificar estilo con Flake8
flake8
```

## 🧪 Pruebas

Asegúrate de que todas las pruebas pasen antes de enviar tu Pull Request:

```bash
pytest
```

## 📚 Documentación

- Actualiza la documentación relevante cuando agregues nuevas funcionalidades o cambies el comportamiento existente.
- Asegúrate de que la documentación sea clara y fácil de entender.

## ❓ Preguntas Frecuentes

### ¿Cómo puedo comenzar a contribuir si soy nuevo en el proyecto?

Revisa los issues etiquetados como `good first issue` o `help wanted` para encontrar tareas adecuadas para principiantes.

### ¿Con qué frecuencia se revisan los Pull Requests?

Los mantenedores revisan los Pull Requests regularmente. Por favor, sé paciente mientras revisamos tu contribución.

### ¿Necesito firmar un CLA para contribuir?

Actualmente no requerimos un Acuerdo de Licencia de Colaborador (CLA). Sin embargo, al contribuir al proyecto, aceptas que tus contribuciones estarán bajo la [licencia MIT](LICENSE).

## 📧 Contacto

Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos a través de:

- [Abrir un issue](https://github.com/tu-usuario/gemini-educador/issues)
- Enviar un correo electrónico a: soporte@gemini.edu

¡Gracias por contribuir a GEMINI! Tu ayuda es muy apreciada. 🌟
