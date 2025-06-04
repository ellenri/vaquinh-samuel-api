const { Pool } = require('pg');
require('dotenv').config();

// Database configuration for PostgreSQL (Railway/Supabase compatible)
const dbConfig = {
  // Use DATABASE_URL if available
  connectionString: process.env.RAILWAY_DATABASE_PUBLIC_URL,
  // Alternative configuration using individual variables
  host: process.env.RAILWAY_PGHOST,
  port: process.env.RAILWAY_PGPORT || 5432,
  database: process.env.RAILWAY_PGDATABASE,
  user: process.env.RAILWAY_POSTGRES_USER,
  password: process.env.RAILWAY_POSTGRES_PASSWORD,
  // SSL configuration - required for most cloud PostgreSQL services
  ssl: process.env.RAILWAY_DATABASE_URL ? { rejectUnauthorized: false } : false,
  // Connection pool settings
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000, // Increased timeout
};

// Create the connection pool
const pool = new Pool(dbConfig);

// Handle pool errors
pool.on('error', (err) => {
  console.error('Unexpected error on idle client:', err);
  process.exit(-1);
});

// Test database connection
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ Database connected successfully!');
    
    // Test query
    const result = await client.query('SELECT NOW()');
    console.log('📅 Database time:', result.rows[0].now);
    
    client.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
};

// Create tables from SQL file
const createTables = async () => {
  const fs = require('fs');
  const path = require('path');
  
  try {
    // Read the SQL file
    const sqlPath = path.join(__dirname, 'database.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    const client = await pool.connect();
    
    // Execute the SQL commands
    await client.query(sql);
    console.log('✅ Tables created successfully!');
    
    client.release();
    return true;
  } catch (error) {
    console.error('❌ Error creating tables:', error.message);
    return false;
  }
};

// Database queries for donations
const db = {
  // Get all donations with pagination
  async getDoacoes(page = 1, limit = 5) {
    const offset = (page - 1) * limit;
    
    const countQuery = 'SELECT COUNT(*) FROM doacoes';
    const dataQuery = `
      SELECT id, nome, valor, mensagem, data_criacao
      FROM doacoes 
      ORDER BY data_criacao DESC 
      LIMIT $1 OFFSET $2
    `;
    
    const client = await pool.connect();
    try {
      const countResult = await client.query(countQuery);
      const dataResult = await client.query(dataQuery, [limit, offset]);
      
      const total = parseInt(countResult.rows[0].count);
      
      return {
        doacoes: dataResult.rows,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      };
    } finally {
      client.release();
    }
  },

  // Add new donation
  async addDoacao(nome, valor, mensagem) {
    const query = `
      INSERT INTO doacoes (nome, valor, mensagem) 
      VALUES ($1, $2, $3) 
      RETURNING id, nome, valor, mensagem, data_criacao
    `;
    
    const client = await pool.connect();
    try {
      const result = await client.query(query, [nome || 'Anônimo', valor, mensagem || '']);
      return result.rows[0];
    } finally {
      client.release();
    }
  },

  // Get total amount donated
  async getTotal() {
    const query = 'SELECT COALESCE(SUM(valor), 0) as total FROM doacoes';
    
    const client = await pool.connect();
    try {
      const result = await client.query(query);
      return parseFloat(result.rows[0].total);
    } finally {
      client.release();
    }
  }
};

module.exports = {
  pool,
  testConnection,
  createTables,
  db
}; 