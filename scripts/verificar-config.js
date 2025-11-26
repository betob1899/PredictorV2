/**
 * Script de verificación de configuración
 * Ejecuta: node scripts/verificar-config.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando configuración...\n');

// Verificar archivo .env.local
const envPath = path.join(process.cwd(), '.env.local');
const envExists = fs.existsSync(envPath);

if (!envExists) {
  console.log('❌ Archivo .env.local NO encontrado');
  console.log('   Crea el archivo .env.local en la raíz del proyecto\n');
  console.log('   Contenido mínimo:');
  console.log('   NEXT_PUBLIC_SUPABASE_URL=tu_url');
  console.log('   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_key\n');
} else {
  console.log('✅ Archivo .env.local encontrado');
  
  // Leer y verificar contenido
  const envContent = fs.readFileSync(envPath, 'utf8');
  const hasUrl = envContent.includes('NEXT_PUBLIC_SUPABASE_URL=') && 
                 !envContent.includes('NEXT_PUBLIC_SUPABASE_URL=tu_url');
  const hasKey = envContent.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY=') && 
                 !envContent.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_key');
  
  if (hasUrl && hasKey) {
    console.log('✅ Variables de entorno configuradas\n');
  } else {
    console.log('⚠️  Variables de entorno no están configuradas correctamente');
    console.log('   Verifica que hayas reemplazado los valores de ejemplo\n');
  }
}

// Verificar schema.sql
const schemaPath = path.join(process.cwd(), 'db', 'schema.sql');
const schemaExists = fs.existsSync(schemaPath);

if (schemaExists) {
  console.log('✅ Archivo db/schema.sql encontrado');
  const schemaContent = fs.readFileSync(schemaPath, 'utf8');
  
  const hasUsersTable = schemaContent.includes('CREATE TABLE') && 
                        schemaContent.includes('users');
  const hasSessionsTable = schemaContent.includes('sessions');
  const hasPredictionsTable = schemaContent.includes('predictions');
  
  if (hasUsersTable && hasSessionsTable && hasPredictionsTable) {
    console.log('✅ Schema SQL contiene todas las tablas necesarias\n');
  } else {
    console.log('⚠️  Schema SQL podría estar incompleto\n');
  }
} else {
  console.log('❌ Archivo db/schema.sql NO encontrado\n');
}

// Verificar package.json
const packagePath = path.join(process.cwd(), 'package.json');
if (fs.existsSync(packagePath)) {
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const hasSupabase = packageJson.dependencies && 
                      ('@supabase/supabase-js' in packageJson.dependencies ||
                       '@supabase/ssr' in packageJson.dependencies);
  
  if (hasSupabase) {
    console.log('✅ Dependencias de Supabase en package.json\n');
  } else {
    console.log('⚠️  Dependencias de Supabase no encontradas');
    console.log('   Ejecuta: pnpm install\n');
  }
}

console.log('📋 Resumen:');
console.log('   1. Crea cuenta en Supabase.com');
console.log('   2. Crea un proyecto');
console.log('   3. Ejecuta db/schema.sql en SQL Editor');
console.log('   4. Obtén credenciales en Settings → API');
console.log('   5. Crea .env.local con las credenciales');
console.log('   6. Ejecuta: pnpm dev\n');

