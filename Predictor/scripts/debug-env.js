/**
 * Script de depuración para ver las variables de entorno
 */

require('dotenv').config({ path: require('path').join(process.cwd(), '.env.local') });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔍 Depuración de variables de entorno\n');

console.log('URL:');
console.log(`  Existe: ${!!url}`);
console.log(`  Longitud: ${url ? url.length : 0}`);
console.log(`  Valor (primeros 50 chars): ${url ? url.substring(0, 50) : 'N/A'}`);
console.log(`  Empieza con https://: ${url ? url.startsWith('https://') : false}\n`);

console.log('KEY:');
console.log(`  Existe: ${!!key}`);
console.log(`  Longitud: ${key ? key.length : 0}`);
console.log(`  Valor (primeros 30 chars): ${key ? key.substring(0, 30) : 'N/A'}`);
console.log(`  Primer carácter: ${key ? `"${key[0]}" (código: ${key.charCodeAt(0)})` : 'N/A'}`);
console.log(`  Primeros 3 caracteres: ${key ? `"${key.substring(0, 3)}"` : 'N/A'}`);
console.log(`  Empieza con "eyJ": ${key ? key.startsWith('eyJ') : false}\n`);

// Leer el archivo directamente
const fs = require('fs');
const path = require('path');
const envPath = path.join(process.cwd(), '.env.local');

if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  const keyLine = content.split('\n').find(line => line.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY'));
  
  if (keyLine) {
    console.log('📄 Contenido del archivo .env.local (línea de KEY):');
    console.log(`  ${keyLine.substring(0, 60)}...`);
    const keyValue = keyLine.split('=').slice(1).join('=').trim();
    console.log(`  Valor extraído: ${keyValue.substring(0, 30)}...`);
    console.log(`  Primer carácter del valor: "${keyValue[0]}"`);
  }
}

