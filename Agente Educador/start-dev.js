const { spawn } = require('child_process');
const path = require('path');

// Ruta al directorio del frontend
const frontendDir = path.join(__dirname, 'frontend');

console.log('Iniciando servidor de desarrollo...');
console.log(`Directorio: ${frontendDir}`);

// Instalar dependencias primero
console.log('Instalando dependencias...');
const install = spawn('cmd.exe', ['/c', 'npm', 'install'], {
  cwd: frontendDir,
  stdio: 'inherit',
  shell: true
});

install.on('close', (code) => {
  if (code !== 0) {
    console.error(`Error al instalar dependencias. Código: ${code}`);
    process.exit(1);
  }
  
  console.log('Dependencias instaladas. Iniciando servidor de desarrollo...');
  
  // Iniciar el servidor de desarrollo
  const dev = spawn('cmd.exe', ['/c', 'npm', 'run', 'dev'], {
    cwd: frontendDir,
    stdio: 'inherit',
    shell: true
  });
  
  dev.on('close', (code) => {
    console.log(`Servidor cerrado con código ${code}`);
    process.exit(code);
  });
});

// Manejar la terminación del proceso
process.on('SIGINT', () => {
  console.log('Deteniendo servidor...');
  process.exit(0);
});
