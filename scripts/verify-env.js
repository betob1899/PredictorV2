/**
 * Script para verificar el formato de las variables de entorno
 * Ejecuta: node scripts/verify-env.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando formato de variables de entorno...\n');

const envPath = path.join(process.cwd(), '.env.local');

if (!fs.existsSync(envPath)) {
  console.log('❌ Archivo .env.local NO encontrado\n');
  console.log('   Crea el archivo .env.local en la raíz del proyecto con:');
  console.log('   NEXT_PUBLIC_SUPABASE_URL=tu_url');
  console.log('   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_key\n');
  process.exit(1);
}

console.log('✅ Archivo .env.local encontrado\n');

const envContent = fs.readFileSync(envPath, 'utf8');
const lines = envContent.split('\n').filter(line => line.trim() && !line.trim().startsWith('#'));

let hasUrl = false;
let hasKey = false;
let urlValue = '';
let keyValue = '';

for (const line of lines) {
  const trimmed = line.trim();
  
  if (trimmed.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
    hasUrl = true;
    urlValue = trimmed.split('=').slice(1).join('=').trim();
  }
  
  if (trimmed.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) {
    hasKey = true;
    keyValue = trimmed.split('=').slice(1).join('=').trim();
  }
}

console.log('📋 Variables encontradas:');
console.log(`   NEXT_PUBLIC_SUPABASE_URL: ${hasUrl ? '✅' : '❌'}`);
console.log(`   NEXT_PUBLIC_SUPABASE_ANON_KEY: ${hasKey ? '✅' : '❌'}\n`);

if (!hasUrl || !hasKey) {
  console.log('❌ Faltan variables requeridas\n');
  process.exit(1);
}

// Verificar formato de URL
console.log('🔍 Verificando formato de URL...');
if (!urlValue.startsWith('https://')) {
  console.log('❌ ERROR: La URL debe empezar con https://');
  console.log(`   Valor actual: ${urlValue.substring(0, 30)}...\n`);
  process.exit(1);
}

if (!urlValue.includes('.supabase.co')) {
  console.log('❌ ERROR: La URL debe contener .supabase.co');
  console.log(`   Valor actual: ${urlValue}\n`);
  process.exit(1);
}

console.log(`✅ URL tiene formato correcto: ${urlValue.substring(0, 40)}...\n`);

// Verificar formato de Key
console.log('🔍 Verificando formato de Key...');
if (keyValue.length < 100) {
  console.log('⚠️  ADVERTENCIA: La key parece muy corta');
  console.log(`   Longitud: ${keyValue.length} caracteres`);
  console.log('   Las keys de Supabase suelen tener más de 200 caracteres\n');
}

if (!keyValue.startsWith('eyJ')) {
  console.log('❌ ERROR: La key debe ser un JWT que empiece con "eyJ"');
  console.log(`   Valor actual empieza con: ${keyValue.substring(0, 10)}...\n`);
  process.exit(1);
}

console.log(`✅ Key tiene formato correcto: ${keyValue.substring(0, 20)}...\n`);

// Verificar que no sean valores de ejemplo
if (urlValue.includes('tu_url') || urlValue.includes('your_') || urlValue.includes('example')) {
  console.log('❌ ERROR: La URL contiene valores de ejemplo');
  console.log('   Reemplaza los valores con tus credenciales reales de Supabase\n');
  process.exit(1);
}

if (keyValue.includes('tu_key') || keyValue.includes('your_') || keyValue.includes('example')) {
  console.log('❌ ERROR: La key contiene valores de ejemplo');
  console.log('   Reemplaza los valores con tus credenciales reales de Supabase\n');
  process.exit(1);
}

console.log('✅ Todas las verificaciones pasaron!');
console.log('\n📝 Resumen:');
console.log('   ✅ Archivo .env.local existe');
console.log('   ✅ Variables están definidas');
console.log('   ✅ Formato de URL es correcto');
console.log('   ✅ Formato de Key es correcto');
console.log('   ✅ No son valores de ejemplo\n');
console.log('💡 Siguiente paso: Ejecuta el script de prueba de conexión');
console.log('   node scripts/test-supabase-connection.js\n');

