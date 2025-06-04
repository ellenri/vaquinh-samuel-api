const { Pool } = require('pg');
require('dotenv').config();

async function testDetailedConnection() {
  console.log('🔧 Detailed Database Connection Test\n');
  
  // Parse the DATABASE_URL
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.log('❌ No DATABASE_URL found in environment variables');
    return;
  }
  
  try {
    const url = new URL(dbUrl);
    console.log('📊 Connection Details:');
    console.log(`- Host: ${url.hostname}`);
    console.log(`- Port: ${url.port}`);
    console.log(`- Database: ${url.pathname.slice(1)}`);
    console.log(`- Username: ${url.username}`);
    console.log(`- SSL: ${url.hostname.includes('supabase') || url.hostname.includes('railway') ? 'Required' : 'Optional'}\n`);
    
    // Test connection with different SSL configurations
    const configs = [
      {
        name: 'Default config with SSL',
        config: {
          connectionString: dbUrl,
          ssl: { rejectUnauthorized: false }
        }
      },
      {
        name: 'No SSL config',
        config: {
          connectionString: dbUrl,
          ssl: false
        }
      },
      {
        name: 'SSL required',
        config: {
          connectionString: dbUrl,
          ssl: { rejectUnauthorized: false, require: true }
        }
      }
    ];
    
    for (const { name, config } of configs) {
      console.log(`🧪 Testing: ${name}`);
      
      const pool = new Pool(config);
      
      try {
        const client = await pool.connect();
        const result = await client.query('SELECT version()');
        
        console.log('✅ Success!');
        console.log(`   PostgreSQL Version: ${result.rows[0].version.split(' ')[0]} ${result.rows[0].version.split(' ')[1]}`);
        
        client.release();
        await pool.end();
        
        console.log(`\n🎉 Connection successful with: ${name}`);
        return;
        
      } catch (error) {
        console.log(`❌ Failed: ${error.message}`);
        await pool.end();
      }
      
      console.log('');
    }
    
    console.log('💡 Troubleshooting Tips:');
    console.log('1. Check if your database credentials are correct');
    console.log('2. Verify your database is running and accessible');
    console.log('3. For Supabase: Go to Settings → Database → Connection string');
    console.log('4. For Railway: Go to your PostgreSQL service → Variables tab');
    console.log('5. Make sure you\'re using the correct password (not the one with [YOUR-PASSWORD])');
    
  } catch (error) {
    console.log('❌ Invalid DATABASE_URL format:', error.message);
  }
}

testDetailedConnection().catch(console.error); 