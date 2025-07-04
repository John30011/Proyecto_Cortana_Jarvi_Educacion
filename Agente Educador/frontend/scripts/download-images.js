const fs = require('fs');
const https = require('https');
const path = require('path');

// Crear directorio si no existe
const dir = path.join(__dirname, '../public/images/cursos');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

// URLs de las imágenes de ejemplo (puedes reemplazarlas con las que prefieras)
const images = [
  {
    url: 'https://images.unsplash.com/photo-1536148935331-408321065b18?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    filename: 'matematicas-basico.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    filename: 'ciencias-avanzado.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    filename: 'programacion-basico.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a05?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    filename: 'historia-avanzado.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1506880018603-83d5b14b6089?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    filename: 'literatura-intermedio.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    filename: 'arte-basico.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1554224155-3a44993451b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    filename: 'finanzas-personales.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    filename: 'medio-ambiente.jpg'
  }
];

// Función para descargar una imagen
function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(path.join(dir, filename));
    
    https.get(url, response => {
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`Imagen descargada: ${filename}`);
        resolve();
      });
      
      file.on('error', error => {
        fs.unlink(path.join(dir, filename), () => {});
        reject(error);
      });
    }).on('error', error => {
      reject(error);
    });
  });
}

// Descargar todas las imágenes
async function downloadAllImages() {
  console.log('Iniciando descarga de imágenes...');
  
  try {
    for (const img of images) {
      await downloadImage(img.url, img.filename);
    }
    console.log('Todas las imágenes han sido descargadas correctamente.');
  } catch (error) {
    console.error('Error al descargar las imágenes:', error);
  }
}

// Ejecutar la descarga
downloadAllImages();
