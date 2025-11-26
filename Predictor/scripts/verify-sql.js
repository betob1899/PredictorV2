/**
 * Script para verificar la sintaxis del SQL
 * Ejecuta: node scripts/verify-sql.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando sintaxis del SQL...\n');

const schemaPath = path.join(process.cwd(), 'db', 'schema.sql');

if (!fs.existsSync(schemaPath)) {
  console.log('❌ Archivo db/schema.sql NO encontrado\n');
  process.exit(1);
}

console.log('✅ Archivo db/schema.sql encontrado\n');

const sqlContent = fs.readFileSync(schemaPath, 'utf8');

// Verificaciones básicas
const checks = [
  {
    name: 'CREATE TABLE users',
    test: /CREATE TABLE.*users/i,
    required: true
  },
  {
    name: 'CREATE TABLE sessions',
    test: /CREATE TABLE.*sessions/i,
    required: true
  },
  {
    name: 'CREATE TABLE predictions',
    test: /CREATE TABLE.*predictions/i,
    required: true
  },
  {
    name: 'UUID extension',
    test: /CREATE EXTENSION.*uuid-ossp/i,
    required: true
  },
  {
    name: 'Unique index for users',
    test: /CREATE UNIQUE INDEX.*idx_users_unique_name/i,
    required: true
  },
  {
    name: 'Unique constraint for predictions',
    test: /UNIQUE\(session_id.*predicted_time\)/i,
    required: true
  },
  {
    name: 'RLS enabled',
    test: /ENABLE ROW LEVEL SECURITY/i,
    required: true
  },
  {
    name: 'Update trigger function',
    test: /CREATE.*FUNCTION update_updated_at_column/i,
    required: true
  },
  {
    name: 'Winner function',
    test: /CREATE.*FUNCTION get_session_winner/i,
    required: true
  }
];

console.log('📋 Verificando componentes del schema:\n');

let allPassed = true;
for (const check of checks) {
  const passed = check.test.test(sqlContent);
  console.log(`   ${passed ? '✅' : '❌'} ${check.name}`);
  if (!passed && check.required) {
    allPassed = false;
  }
}

// Verificar sintaxis básica
console.log('\n🔍 Verificando sintaxis básica...\n');

// Verificar que no haya comillas simples sin cerrar
const singleQuotes = (sqlContent.match(/'/g) || []).length;
if (singleQuotes % 2 !== 0) {
  console.log('❌ ERROR: Posible comilla simple sin cerrar');
  allPassed = false;
}

// Verificar paréntesis balanceados
const openParens = (sqlContent.match(/\(/g) || []).length;
const closeParens = (sqlContent.match(/\)/g) || []).length;
if (openParens !== closeParens) {
  console.log(`❌ ERROR: Paréntesis no balanceados (${openParens} abiertos, ${closeParens} cerrados)`);
  allPassed = false;
} else {
  console.log('✅ Paréntesis balanceados');
}

// Verificar llaves balanceadas (para funciones)
const openBraces = (sqlContent.match(/\{/g) || []).length;
const closeBraces = (sqlContent.match(/\}/g) || []).length;
if (openBraces !== closeBraces) {
  console.log(`❌ ERROR: Llaves no balanceadas (${openBraces} abiertas, ${closeBraces} cerradas)`);
  allPassed = false;
} else {
  console.log('✅ Llaves balanceadas');
}

// Verificar que las tablas tengan las columnas necesarias
console.log('\n🔍 Verificando estructura de tablas...\n');

const usersColumns = ['id', 'first_name', 'last_name', 'work_area', 'role'];
const sessionsColumns = ['id', 'name', 'start_time', 'end_time', 'actual_duration_minutes'];
const predictionsColumns = ['id', 'user_id', 'session_id', 'predicted_time', 'predicted_minutes'];

function checkColumns(tableName, columns, sql) {
  const tableRegex = new RegExp(`CREATE TABLE.*${tableName}[\\s\\S]*?\\)`, 'i');
  const tableMatch = sql.match(tableRegex);
  
  if (!tableMatch) {
    console.log(`   ❌ No se encontró la tabla ${tableName}`);
    return false;
  }
  
  const tableDef = tableMatch[0];
  let allFound = true;
  
  for (const column of columns) {
    const columnRegex = new RegExp(`\\b${column}\\b`, 'i');
    if (!columnRegex.test(tableDef)) {
      console.log(`   ❌ Columna ${column} no encontrada en ${tableName}`);
      allFound = false;
    }
  }
  
  if (allFound) {
    console.log(`   ✅ Tabla ${tableName} tiene todas las columnas requeridas`);
  }
  
  return allFound;
}

checkColumns('users', usersColumns, sqlContent);
checkColumns('sessions', sessionsColumns, sqlContent);
checkColumns('predictions', predictionsColumns, sqlContent);

console.log('\n' + (allPassed ? '✅' : '❌') + ' Verificación completada');

if (!allPassed) {
  console.log('\n⚠️  Se encontraron problemas en el SQL');
  console.log('   Revisa los errores arriba antes de ejecutar en Supabase\n');
  process.exit(1);
} else {
  console.log('\n✅ El SQL parece estar correcto!');
  console.log('   Puedes ejecutarlo en Supabase SQL Editor\n');
}

