const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zddstwkylfyqwwpmidyp.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseKey) {
  console.error('Error: No se encontró la clave de API de Supabase');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Función para ejecutar consultas SQL
async function runQuery(sql) {
  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql });
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error ejecutando consulta SQL:', error.message);
    throw error;
  }
}

// Función para leer archivos SQL
function readSqlFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

// Función principal de migración
async function runMigrations() {
  console.log('Iniciando migraciones...');
  
  try {
    // Leer y ejecutar archivos de migración en orden
    const migrationsDir = path.join(__dirname, 'migrations');
    const files = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort(); // Orden alfabético para ejecutar en orden
    
    for (const file of files) {
      console.log(`\nEjecutando migración: ${file}`);
      const filePath = path.join(migrationsDir, file);
      const sql = await readSqlFile(filePath);
      
      // Ejecutar cada sentencia SQL por separado
      const statements = sql.split(';').filter(statement => statement.trim() !== '');
      
      for (const statement of statements) {
        if (statement.trim() === '') continue;
        await runQuery(statement);
      }
      
      console.log(`✅ ${file} completado`);
    }
    
    console.log('\n✅ Todas las migraciones se han aplicado correctamente');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error durante la migración:', error);
    process.exit(1);
  }
}

// Ejecutar migración
runMigrations();
