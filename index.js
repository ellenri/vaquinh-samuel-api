const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { testConnection, db } = require('./database');

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Test database connection on startup
(async () => {
  console.log('🚀 Starting API server...');
  const connected = await testConnection();
  if (!connected) {
    console.error('❌ Failed to connect to database. Exiting...');
    process.exit(1);
  }
  console.log('✅ Database connection established');
})();

// Rotas
app.get('/', (req, res) => {
  res.json({ 
    message: 'API da Vaquinha Solidária - Samuel',
    status: 'Database connected',
    timestamp: new Date().toISOString()
  });
});

// Rota para obter o total arrecadado
app.get('/api/total', async (req, res) => {
  try {
    const total = await db.getTotal();
    res.json({ total });
  } catch (error) {
    console.error('Erro ao obter total:', error);
    res.status(500).json({ error: 'Erro ao obter total arrecadado' });
  }
});

// Rota para listar todas as doações (com paginação)
app.get('/api/doacoes', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  
  try {
    const result = await db.getDoacoes(page, limit);
    res.json(result);
  } catch (error) {
    console.error('Erro ao listar doações:', error);
    res.status(500).json({ error: 'Erro ao listar doações' });
  }
});

// Rota para adicionar uma nova doação
app.post('/api/doacoes', async (req, res) => {
  const { nome, valor, mensagem } = req.body;
  
  if (!valor || isNaN(parseFloat(valor)) || parseFloat(valor) <= 0) {
    return res.status(400).json({ error: 'Valor da doação inválido' });
  }
  
  try {
    const valorNumerico = parseFloat(valor);
    const novaDoacao = await db.addDoacao(nome, valorNumerico, mensagem);
    
    res.status(201).json(novaDoacao);
  } catch (error) {
    console.error('Erro ao adicionar doação:', error);
    res.status(500).json({ error: 'Erro ao adicionar doação' });
  }
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`🌟 Servidor rodando na porta ${port}`);
  console.log(`📊 API endpoints disponíveis:`);
  console.log(`   GET  /               - Status da API`);
  console.log(`   GET  /api/total      - Total arrecadado`);
  console.log(`   GET  /api/doacoes    - Listar doações (com paginação)`);
  console.log(`   POST /api/doacoes    - Adicionar nova doação`);
});
