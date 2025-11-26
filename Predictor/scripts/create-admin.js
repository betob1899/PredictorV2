/**
 * Script to create an admin user in Supabase
 * Usage: node scripts/create-admin.js <username> <password>
 * Example: node scripts/create-admin.js admin mypassword123
 */

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

async function createAdmin() {
  // Get credentials from command line
  const username = process.argv[2]
  const password = process.argv[3]

  if (!username || !password) {
    console.error('❌ Error: Debes proporcionar usuario y contraseña')
    console.log('\nUso: node scripts/create-admin.js <usuario> <contraseña>')
    console.log('Ejemplo: node scripts/create-admin.js admin micontraseña123\n')
    process.exit(1)
  }

  // Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Error: Variables de entorno no configuradas')
    console.log('\nAsegúrate de que tu archivo .env.local contenga:')
    console.log('NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase')
    console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_de_supabase\n')
    process.exit(1)
  }

  console.log('🔄 Conectando a Supabase...')
  const supabase = createClient(supabaseUrl, supabaseKey)

  try {
    // Check if admin already exists
    console.log(`🔍 Verificando si el usuario "${username}" ya existe...`)
    const { data: existing } = await supabase
      .from('admin_auth')
      .select('id, username')
      .eq('username', username)
      .single()

    if (existing) {
      console.log(`⚠️  El usuario "${username}" ya existe`)
      console.log(`ℹ️  Si quieres cambiar la contraseña, elimina el usuario primero desde Supabase\n`)
      process.exit(0)
    }

    // Create admin
    console.log(`✨ Creando usuario administrador "${username}"...`)
    const { data, error } = await supabase
      .from('admin_auth')
      .insert({
        username: username.trim(),
        password_hash: password, // Note: In production, this should be hashed
      })
      .select()
      .single()

    if (error) {
      console.error('❌ Error al crear administrador:', error.message)
      process.exit(1)
    }

    console.log('✅ ¡Administrador creado exitosamente!')
    console.log('\n📋 Detalles:')
    console.log(`   Usuario: ${username}`)
    console.log(`   Contraseña: ${password}`)
    console.log(`   ID: ${data.id}`)
    console.log('\n🎉 Ahora puedes iniciar sesión como administrador\n')
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

createAdmin()
