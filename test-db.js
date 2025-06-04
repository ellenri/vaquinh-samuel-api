const { testConnection, createTables } = require('./database.js');

async function testDatabase() {
  console.log('🚀 Starting database connection test...\n');
  
  // Step 1: Test connection
  console.log('STEP 1: Testing database connection...');
  const connectionSuccess = await testConnection();
  
  if (!connectionSuccess) {
    console.log('\n❌ Database connection failed. Please check your .env file and Railway database credentials.');
    console.log('\nRequired environment variables:');
    console.log('- DATABASE_URL (Railway PostgreSQL connection string)');
    console.log('OR individual variables:');
    console.log('- DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD');
    process.exit(1);
  }
  
  console.log('\n✅ Connection test passed!');
  
  // Step 2: Create tables
  console.log('\nSTEP 2: Creating database tables...');
  const tablesSuccess = await createTables();
  
  if (!tablesSuccess) {
    console.log('\n❌ Failed to create tables.');
    process.exit(1);
  }
  
  console.log('\n🎉 Database setup completed successfully!');
  console.log('\nYour database is ready to use. You can now start your API server.');
  
  process.exit(0);
}

// Run the test
testDatabase().catch((error) => {
  console.error('💥 Unexpected error:', error);
  process.exit(1);
}); 