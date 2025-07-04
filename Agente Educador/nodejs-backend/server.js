const express = require('express');
const cors = require('cors');

const app = express();
const port = 8000; // Puerto al que el frontend ya está configurado para proxy

app.use(cors());
app.use(express.json());

// Endpoint de ejemplo
app.get('/api/hello', (req, res) => {
  res.json({ message: '¡Hola desde el backend de Node.js!' });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor Node.js escuchando en http://localhost:${port}`);
});
