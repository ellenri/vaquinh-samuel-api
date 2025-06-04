const { pool } = require('./database.js');

async function verifyTable() {
  console.log('🔍 Verifying table creation...\n');
  
  try {
    const client = await pool.connect();
    
    // Check if table exists
    const tableExistsQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'doacoes'
      );
    `;
    
    const tableExists = await client.query(tableExistsQuery);
    console.log('✅ Table "doacoes" exists:', tableExists.rows[0].exists);
    
    if (tableExists.rows[0].exists) {
      // Get table structure
      const structureQuery = `
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_name = 'doacoes'
        ORDER BY ordinal_position;
      `;
      
      const structure = await client.query(structureQuery);
      
      console.log('\n📋 Table Structure:');
      console.log('┌─────────────────┬──────────────────┬──────────────┬─────────────────────┐');
      console.log('│ Column          │ Type             │ Nullable     │ Default             │');
      console.log('├─────────────────┼──────────────────┼──────────────┼─────────────────────┤');
      
      structure.rows.forEach(row => {
        const column = row.column_name.padEnd(15);
        const type = row.data_type.padEnd(16);
        const nullable = row.is_nullable.padEnd(12);
        const defaultVal = (row.column_default || 'NULL').padEnd(19);
        console.log(`│ ${column} │ ${type} │ ${nullable} │ ${defaultVal} │`);
      });
      
      console.log('└─────────────────┴──────────────────┴──────────────┴─────────────────────┘');
      
      // Count existing records (should be 0 for new table)
      const countQuery = 'SELECT COUNT(*) as count FROM doacoes';
      const count = await client.query(countQuery);
      console.log(`\n📊 Records in table: ${count.rows[0].count}`);
    }
    
    client.release();
    console.log('\n✅ Table verification completed!');
    
  } catch (error) {
    console.error('❌ Error verifying table:', error.message);
  } finally {
    await pool.end();
  }
}

verifyTable().catch(console.error); 