module.exports = {
  // Archivos de TypeScript y JavaScript
  '**/*.{ts,tsx,js,jsx}': [
    'eslint --fix --max-warnings=0',
    'prettier --write',
  ],
  
  // Archivos de estilos
  '**/*.{css,scss,sass,less}': [
    'stylelint --fix',
    'prettier --write',
  ],
  
  // Archivos de Markdown y JSON
  '**/*.{md,json,html}': [
    'prettier --write',
  ],
  
  // Archivos de configuración
  '**/*.{yaml,yml}': [
    'prettier --write',
  ],
  
  // Ejecutar TypeScript en modo de verificación
  '**/*.{ts,tsx}': () => 'tsc --noEmit',
  
  // Ejecutar pruebas unitarias relacionadas con los archivos modificados
  '**/*.{test,spec}.{ts,tsx}': [
    'jest --bail --findRelatedTests',
  ],
};
