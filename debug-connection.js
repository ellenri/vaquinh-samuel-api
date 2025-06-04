require('dotenv').config();

console.log('🔍 Database Connection Debug Information:\n');

// Check if .env file is being loaded
console.log('Environment variables loaded:');
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- PORT:', process.env.PORT);

// Check database connection variables (hide sensitive info)
console.log('\nDatabase connection variables:');
if (process.env.DATABASE_URL) {
  // Show partial DATABASE_URL for debugging (hide password)
  const dbUrl = process.env.DATABASE_URL;
  const maskedUrl = dbUrl.replace(/:[^:@]+@/, ':****@');
  console.log('- DATABASE_URL:', maskedUrl);
} else {
  console.log('- DATABASE_URL: Not set');
}

console.log('- DB_HOST:', process.env.DB_HOST || 'Not set');
console.log('- DB_PORT:', process.env.DB_PORT || 'Not set');
console.log('- DB_NAME:', process.env.DB_NAME || 'Not set');
console.log('- DB_USER:', process.env.DB_USER || 'Not set');
console.log('- DB_PASSWORD:', process.env.DB_PASSWORD ? '****' : 'Not set');

console.log('\n📋 Railway PostgreSQL Setup Instructions:');
console.log('1. Go to your Railway project dashboard');
console.log('2. Click on your PostgreSQL service');
console.log('3. Go to the "Variables" tab');
console.log('4. Copy the DATABASE_URL value');
console.log('5. Create a .env file in your project root with:');
console.log('   DATABASE_URL=postgresql://username:password@host:port/dbname');
console.log('\nOR use individual variables:');
console.log('   DB_HOST=your-host');
console.log('   DB_PORT=5432');
console.log('   DB_NAME=railway');
console.log('   DB_USER=postgres');
console.log('   DB_PASSWORD=your-password');

console.log('\n⚠️  Note: Make sure your .env file is in the same directory as this script!'); 