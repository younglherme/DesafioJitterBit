# API de Gerenciamento de Pedidos - Jitterbit

API REST para gerenciamento de pedidos desenvolvida com Node.js, Express e PostgreSQL.

##  Pré-requisitos

- Node.js (v14 ou superior)
- PostgreSQL
- npm ou yarn

##  Instalação

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente criando um arquivo `.env`:
```env
PORT=3000
DB_HOST=localhost
DB_PORT=
DB_NAME=
DB_USER=
DB_PASSWORD=
```

## Configure o banco de dados:
```bash
npm run setup
```

##  Executar o Projeto

```bash
npm run dev
```

##  Documentação da API (Swagger)

Após iniciar o servidor, a documentação interativa da API estará disponível em:

**http://localhost:3000/api-docs**

O servidor estará rodando em `http://localhost:3000`

##  Endpoints

### Criar Pedido
- **POST** `/order`
- Cria um novo pedido com seus itens

### Listar Todos os Pedidos
- **GET** `/order/list`
- Retorna todos os pedidos

### Buscar Pedido por Número
- **GET** `/order/:orderNumber`
- Retorna os detalhes de um pedido específico

### Atualizar Pedido
- **PUT** `/order/:orderNumber`
- Atualiza os dados de um pedido existente

### Deletar Pedido
- **DELETE** `/order/:orderNumber`
- Remove um pedido e seus itens


##  Tecnologias Utilizadas

- **Node.js** 
- **Express** 
- **PostgreSQL**  
- **Swagger** 

