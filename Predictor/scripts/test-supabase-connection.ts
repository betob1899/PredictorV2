/**
 * Script de prueba de conexión con Supabase
 * Ejecuta: npx tsx scripts/test-supabase-connection.ts
 * O: node --loader ts-node/esm scripts/test-supabase-connection.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { readFileSync } from 'fs'
import { join } from 'path'

// Cargar variables de entorno
dotenv.config({ path: join(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('🔍 Verificando conexión con Supabase...\n')

// Verificar que las variables existan
if (!supabaseUrl) {
  console.error('❌ ERROR: NEXT_PUBLIC_SUPABASE_URL no está definida')
  console.log('   Verifica que el archivo .env.local existe y contiene esta variable\n')
  process.exit(1)
}

if (!supabaseKey) {
  console.error('❌ ERROR: NEXT_PUBLIC_SUPABASE_ANON_KEY no está definida')
  console.log('   Verifica que el archivo .env.local existe y contiene esta variable\n')
  process.exit(1)
}

// Verificar formato de URL
if (!supabaseUrl.startsWith('https://') || !supabaseUrl.includes('.supabase.co')) {
  console.error('❌ ERROR: NEXT_PUBLIC_SUPABASE_URL tiene un formato incorrecto')
  console.log('   Debe empezar con https:// y contener .supabase.co')
  console.log(`   Valor actual: ${supabaseUrl}\n`)
  process.exit(1)
}

// Verificar formato de key (debe empezar con eyJ)
if (!supabaseKey.startsWith('eyJ')) {
  console.error('❌ ERROR: NEXT_PUBLIC_SUPABASE_ANON_KEY tiene un formato incorrecto')
  console.log('   Debe ser un JWT token que empiece con "eyJ"')
  console.log(`   Valor actual: ${supabaseKey.substring(0, 20)}...\n`)
  process.exit(1)
}

console.log('✅ Variables de entorno encontradas')
console.log(`   URL: ${supabaseUrl}`)
console.log(`   Key: ${supabaseKey.substring(0, 20)}...\n`)

// Intentar conectar
console.log('🔄 Intentando conectar con Supabase...\n')

try {
  const supabase = createClient(supabaseUrl, supabaseKey)

  // Probar conexión leyendo una tabla
  const { data, error } = await supabase
    .from('users')
    .select('count')
    .limit(1)

  if (error) {
    // Si el error es que la tabla no existe, es diferente a un error de conexión
    if (error.message.includes('does not exist') || error.code === '42P01') {
      console.log('⚠️  ADVERTENCIA: Las tablas no existen aún')
      console.log('   Ejecuta el script db/schema.sql en Supabase SQL Editor\n')
    } else if (error.message.includes('JWT') || error.message.includes('Invalid API key')) {
      console.error('❌ ERROR: La clave de API es inválida')
      console.log('   Verifica que copiaste la clave "anon public" correcta\n')
      process.exit(1)
    } else {
      console.error('❌ ERROR de conexión:', error.message)
      console.log('   Código:', error.code)
      process.exit(1)
    }
  } else {
    console.log('✅ Conexión exitosa con Supabase!')
    console.log('   Las tablas existen y son accesibles\n')
  }

  // Verificar que las tablas principales existan
  console.log('🔍 Verificando tablas...\n')

  const tables = ['users', 'sessions', 'predictions']
  const results: { [key: string]: boolean } = {}

  for (const table of tables) {
    const { error: tableError } = await supabase
      .from(table)
      .select('*')
      .limit(0)

    results[table] = !tableError
  }

  console.log('📊 Estado de las tablas:')
  for (const [table, exists] of Object.entries(results)) {
    console.log(`   ${exists ? '✅' : '❌'} ${table}`)
  }

  if (Object.values(results).every(v => v)) {
    console.log('\n✅ Todas las tablas existen y están accesibles!')
  } else {
    console.log('\n⚠️  Algunas tablas no existen. Ejecuta db/schema.sql en Supabase SQL Editor')
  }

  // Verificar índices únicos
  console.log('\n🔍 Verificando constraints únicos...\n')
  
  // Intentar insertar un usuario duplicado (debería fallar si el constraint existe)
  const testUser = {
    first_name: 'TEST_USER_UNIQUE',
    last_name: 'TEST_CHECK',
    work_area: 'Testing',
    role: 'user' as const
  }

  // Primero intentar insertar
  const { error: insertError1 } = await supabase
    .from('users')
    .insert(testUser)

  if (insertError1 && !insertError1.message.includes('unique')) {
    console.log('⚠️  No se pudo verificar el constraint de usuarios únicos')
  } else {
    // Intentar insertar de nuevo (debería fallar)
    const { error: insertError2 } = await supabase
      .from('users')
      .insert(testUser)

    if (insertError2 && (insertError2.message.includes('unique') || insertError2.code === '23505')) {
      console.log('✅ Constraint de usuarios únicos está funcionando')
      
      // Limpiar el usuario de prueba
      await supabase
        .from('users')
        .delete()
        .eq('first_name', 'TEST_USER_UNIQUE')
        .eq('last_name', 'TEST_CHECK')
    } else {
      console.log('⚠️  El constraint de usuarios únicos podría no estar funcionando')
    }
  }

  console.log('\n✅ Verificación completada!')

} catch (error) {
  console.error('\n❌ ERROR inesperado:', error)
  if (error instanceof Error) {
    console.error('   Mensaje:', error.message)
  }
  process.exit(1)
}

