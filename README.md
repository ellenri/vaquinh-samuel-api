# API Vaquinha Solidária - Samuel

API para gerenciar doações da vaquinha solidária para ajudar os pais (Elaine e William) do pequeno Samuel.

## Tecnologias utilizadas

- Node.js
- Express
- PostgreSQL
- Railway (para hospedagem)

## Configuração do ambiente

1. Clone o repositório
2. Instale as dependências:
   ```
   npm install
   ```
3. Configure o arquivo `.env` com suas credenciais do banco de dados
4. Execute o script SQL no seu banco de dados PostgreSQL:
   ```
   psql -U seu_usuario -d seu_banco -f database.sql
   ```

## Executando localmente

```
npm run dev
```

O servidor será iniciado na porta 3000 (ou na porta definida no arquivo .env).

## Endpoints da API

### GET /
- Retorna uma mensagem de boas-vindas
- Resposta: `{ "message": "API da Vaquinha Solidária - Samuel" }`

### GET /api/total
- Retorna o valor total arrecadado
- Resposta: `{ "total": 180.00 }`

### GET /api/doacoes
- Lista todas as doações com paginação
- Parâmetros de query:
  - `page`: Número da página (padrão: 1)
  - `limit`: Número de itens por página (padrão: 5)
- Resposta:
  ```json
  {
    "doacoes": [
      {
        "id": 1,
        "nome": "João Silva",
        "valor": "50.00",
        "mensagem": "Força para a família neste momento difícil.",
        "data_criacao": "2023-06-01T15:30:00.000Z"
      },
      ...
    ],
    "totalPages": 1,
    "currentPage": 1,
    "total": 3
  }
  ```

### POST /api/doacoes
- Adiciona uma nova doação
- Corpo da requisição:
  ```json
  {
    "nome": "Ana Souza",
    "valor": 75.00,
    "mensagem": "Estou orando por vocês."
  }
  ```
- Resposta: Objeto com os dados da doação criada

## Implantação no Railway

1. Crie uma conta no [Railway](https://railway.app/)
2. Crie um novo projeto
3. Adicione um serviço PostgreSQL
4. Conecte seu repositório GitHub
5. Configure as variáveis de ambiente no Railway:
   - `DATABASE_URL`: URL de conexão com o PostgreSQL (fornecida pelo Railway)
   - `PORT`: 3000
   - `CORS_ORIGIN`: URL do frontend (ex: https://seu-frontend.vercel.app)
6. Execute o script SQL no banco de dados do Railway
