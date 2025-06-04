const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Armazenamento em memória para testes
const doacoesEmMemoria = [
  { id: 1, nome: 'Maria Silva', valor: 100.00, mensagem: 'Força para a família!', data_criacao: '2025-06-01T14:30:00Z' },
  { id: 2, nome: 'João Santos', valor: 50.00, mensagem: 'Meus sentimentos', data_criacao: '2025-06-02T10:15:00Z' },
  { id: 3, nome: 'Ana Oliveira', valor: 200.00, mensagem: 'Estamos com vocês', data_criacao: '2025-06-02T16:45:00Z' },
  { id: 4, nome: 'Carlos Pereira', valor: 75.00, mensagem: '', data_criacao: '2025-06-03T09:20:00Z' },
  { id: 5, nome: 'Anônimo', valor: 150.00, mensagem: 'Que Deus conforte o coração de vocês', data_criacao: '2025-06-03T13:10:00Z' },
  { id: 6, nome: 'Fernanda Lima', valor: 80.00, mensagem: 'Muita força nesse momento difícil', data_criacao: '2025-06-03T15:30:00Z' }
];

let totalArrecadado = doacoesEmMemoria.reduce((total, doacao) => total + doacao.valor, 0);

// Rotas
app.get('/', (req, res) => {
  res.json({ message: 'API da Vaquinha Solidária - Samuel' });
});

// Rota para obter o total arrecadado
app.get('/api/total', (req, res) => {
  try {
    res.json({ total: totalArrecadado });
  } catch (error) {
    console.error('Erro ao obter total:', error);
    res.status(500).json({ error: 'Erro ao obter total arrecadado' });
  }
});

// Rota para listar todas as doações (com paginação)
app.get('/api/doacoes', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const offset = (page - 1) * limit;
  
  try {
    // Ordenar doações por data (mais recentes primeiro)
    const doacoesOrdenadas = [...doacoesEmMemoria].sort((a, b) => 
      new Date(b.data_criacao) - new Date(a.data_criacao)
    );
    
    // Aplicar paginação
    const doacoesPaginadas = doacoesOrdenadas.slice(offset, offset + limit);
    
    // Contar o total de doações para calcular o número de páginas
    const total = doacoesEmMemoria.length;
    
    res.json({
      doacoes: doacoesPaginadas,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Erro ao listar doações:', error);
    res.status(500).json({ error: 'Erro ao listar doações' });
  }
});

// Rota para adicionar uma nova doação
app.post('/api/doacoes', (req, res) => {
  const { nome, valor, mensagem } = req.body;
  
  if (!valor || isNaN(parseFloat(valor)) || parseFloat(valor) <= 0) {
    return res.status(400).json({ error: 'Valor da doação inválido' });
  }
  
  try {
    const valorNumerico = parseFloat(valor);
    const novaDoacao = {
      id: doacoesEmMemoria.length + 1,
      nome: nome || 'Anônimo',
      valor: valorNumerico,
      mensagem: mensagem || '',
      data_criacao: new Date().toISOString()
    };
    
    // Adicionar a nova doação ao array
    doacoesEmMemoria.unshift(novaDoacao);
    
    // Atualizar o total arrecadado
    totalArrecadado += valorNumerico;
    
    res.status(201).json(novaDoacao);
  } catch (error) {
    console.error('Erro ao adicionar doação:', error);
    res.status(500).json({ error: 'Erro ao adicionar doação' });
  }
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
