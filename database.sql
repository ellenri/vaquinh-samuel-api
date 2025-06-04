-- Criar tabela de doações
CREATE TABLE IF NOT EXISTS doacoes (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  valor DECIMAL(10, 2) NOT NULL,
  mensagem TEXT,
  data_criacao TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Inserir algumas doações de exemplo (opcional)
INSERT INTO doacoes (nome, valor, mensagem, data_criacao)
VALUES 
  ('João Silva', 50.00, 'Força para a família neste momento difícil.', NOW() - INTERVAL '2 days'),
  ('Maria Oliveira', 100.00, 'Meus sentimentos à família.', NOW() - INTERVAL '1 day'),
  ('Anônimo', 30.00, '', NOW() - INTERVAL '12 hours');
