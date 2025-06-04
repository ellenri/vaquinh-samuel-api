-- Criar tabela de doações
CREATE TABLE IF NOT EXISTS doacoes (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  valor DECIMAL(10, 2) NOT NULL,
  mensagem TEXT,
  data_criacao TIMESTAMP NOT NULL DEFAULT NOW()
);
