/**
 * Script de prueba de conexión con Supabase (JavaScript)
 * Ejecuta: node scripts/test-supabase-connection.js
 */

require('dotenv').config({ path: require('path').join(process.cwd(), '.env.local') });
const { createClient } = require('@supabase/supabase-js');

// Cargar y limpiar variables (eliminar espacios)
let supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
let supabaseKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();

console.log('🔍 Verificando conexión con Supabase...\n');

// Verificar que las variables existan
if (!supabaseUrl) {
  console.error('❌ ERROR: NEXT_PUBLIC_SUPABASE_URL no está definida');
  console.log('   Verifica que el archivo .env.local existe y contiene esta variable');
  console.log('   IMPORTANTE: No debe haber espacios después del signo =\n');
  process.exit(1);
}

if (!supabaseKey) {
  console.error('❌ ERROR: NEXT_PUBLIC_SUPABASE_ANON_KEY no está definida');
  console.log('   Verifica que el archivo .env.local existe y contiene esta variable');
  console.log('   IMPORTANTE: No debe haber espacios después del signo =\n');
  process.exit(1);
}

// Verificar formato de URL
const urlTrimmed = supabaseUrl.trim();
if (!urlTrimmed.startsWith('https://') || !urlTrimmed.includes('.supabase.co')) {
  console.error('❌ ERROR: NEXT_PUBLIC_SUPABASE_URL tiene un formato incorrecto');
  console.log('   Debe empezar con https:// y contener .supabase.co');
  console.log(`   Valor actual: ${urlTrimmed}\n`);
  process.exit(1);
}

// Verificar formato de key (debe empezar con eyJ)
const keyTrimmed = supabaseKey.trim();
if (!keyTrimmed.startsWith('eyJ')) {
  console.error('❌ ERROR: NEXT_PUBLIC_SUPABASE_ANON_KEY tiene un formato incorrecto');
  console.log('   Debe ser un JWT token que empiece con "eyJ"');
  console.log(`   Valor actual (primeros 20 chars): ${keyTrimmed.substring(0, 20)}...`);
  console.log(`   Primer carácter: "${keyTrimmed[0]}" (código: ${keyTrimmed.charCodeAt(0)})`);
  console.log('\n   💡 TIP: Verifica que no haya espacios después del = en .env.local');
  console.log('   Debe ser: NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...');
  console.log('   NO debe ser: NEXT_PUBLIC_SUPABASE_ANON_KEY= eyJ...\n');
  process.exit(1);
}

// Usar valores limpiados
supabaseUrl = urlTrimmed;
supabaseKey = keyTrimmed;

console.log('✅ Variables de entorno encontradas');
console.log(`   URL: ${supabaseUrl}`);
console.log(`   Key: ${supabaseKey.substring(0, 20)}...\n`);

// Intentar conectar
console.log('🔄 Intentando conectar con Supabase...\n');

(async () => {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Probar conexión leyendo una tabla
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);

    if (error) {
      // Si el error es que la tabla no existe, es diferente a un error de conexión
      if (error.message.includes('does not exist') || error.code === '42P01') {
        console.log('⚠️  ADVERTENCIA: Las tablas no existen aún');
        console.log('   Ejecuta el script db/schema.sql en Supabase SQL Editor\n');
      } else if (error.message.includes('JWT') || error.message.includes('Invalid API key')) {
        console.error('❌ ERROR: La clave de API es inválida');
        console.log('   Verifica que copiaste la clave "anon public" correcta\n');
        process.exit(1);
      } else {
        console.error('❌ ERROR de conexión:', error.message);
        console.log('   Código:', error.code);
        process.exit(1);
      }
    } else {
      console.log('✅ Conexión exitosa con Supabase!');
      console.log('   Las tablas existen y son accesibles\n');
    }

    // Verificar que las tablas principales existan
    console.log('🔍 Verificando tablas...\n');

    const tables = ['users', 'sessions', 'predictions'];
    const results = {};

    for (const table of tables) {
      const { error: tableError } = await supabase
        .from(table)
        .select('*')
        .limit(0);

      results[table] = !tableError;
    }

    console.log('📊 Estado de las tablas:');
    for (const [table, exists] of Object.entries(results)) {
      console.log(`   ${exists ? '✅' : '❌'} ${table}`);
    }

    if (Object.values(results).every(v => v)) {
      console.log('\n✅ Todas las tablas existen y están accesibles!');
    } else {
      console.log('\n⚠️  Algunas tablas no existen. Ejecuta db/schema.sql en Supabase SQL Editor');
    }

    console.log('\n✅ Verificación completada!');
    console.log('\n💡 Si todo está bien, puedes ejecutar: pnpm dev\n');

  } catch (error) {
    console.error('\n❌ ERROR inesperado:', error.message);
    if (error.stack) {
      console.error('\nStack trace:', error.stack);
    }
    process.exit(1);
  }
})();

