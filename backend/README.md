# ZipTick Backend

Backend do sistema ZipTick construído com Express.js, TypeScript e PostgreSQL.

## Requisitos

- Node.js 18+
- PostgreSQL 12+

## Instalação

1. Instale as dependências:

```bash
npm install
```

2. Configure as variáveis de ambiente criando um arquivo `.env`:

```bash
cp .env.example .env
```

3. Configure o banco de dados no `.env`:

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ziptick
DB_USER=usuario_api
DB_PASSWORD=sua_senha
JWT_SECRET=sua-chave-jwt-secreta
JWT_EXPIRES_IN=1h
PORT=3000
```

## Scripts

- `npm run dev` - Inicia o servidor em modo de desenvolvimento
- `npm run build` - Compila o TypeScript para JavaScript
- `npm start` - Inicia o servidor em modo de produção

## Estrutura de Pastas

```
src/
├── config/          # Configurações (Passport JWT)
├── controller/      # Controladores (lógica de negócio HTTP)
├── db/             # Conexão com banco de dados
├── interface/      # Interfaces/Types TypeScript
├── middleware/     # Middlewares Express (autenticação, etc)
├── routes/         # Rotas da API
├── service/        # Serviços (lógica de negócio)
└── index.ts        # Arquivo principal
```

## Rotas da API

### Autenticação

- `POST /api/usuarios/login` - Fazer login (sem autenticação necessária)

### Usuários (requer autenticação e acesso admin)

- `GET /api/usuarios` - Listar todos os usuários
- `POST /api/usuarios/register` - Criar novo usuário
- `GET /api/usuarios/:email` - Buscar usuário pelo email
- `PUT /api/usuarios/:email/senha` - Atualizar senha
- `DELETE /api/usuarios/:email` - Deletar usuário

### Health Check

- `GET /health` - Verificar saúde da API

## Autenticação

O sistema usa JWT (JSON Web Tokens) para autenticação. Após fazer login, inclua o token no header:

```
Authorization: Bearer seu_token_aqui
```

## Tipos de Usuários

- **Tipo 1**: Administrador (acesso total)
- **Tipo 2**: Usuário comum (acesso limitado)

## Banco de Dados

A tabela de usuários esperada:

```sql
CREATE TABLE usua_usuario (
    usua_email VARCHAR(255) PRIMARY KEY,
    usua_senha VARCHAR(255) NOT NULL,
    usua_tipo_usuario INT NOT NULL
);
```

## Configuração

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ziptick
DB_USER=usuario_api
DB_PASSWORD=senha
JWT_SECRET=sua-chave-jwt-aqui
JWT_EXPIRES_IN=1h
PORT=3000
```

## Scripts

- `npm run dev` - Inicia o servidor em modo desenvolvimento
- `npm run build` - Compila o TypeScript
- `npm run start` - Inicia o servidor compilado

## Estrutura do Projeto

```
src/
├── config/          # Configurações (Passport, etc)
├── controller/      # Controllers da aplicação
├── db/              # Configuração do banco de dados
├── interface/       # Interfaces TypeScript
├── middleware/      # Middlewares Express
├── routes/          # Rotas da API
├── service/         # Serviços de negócio
└── index.ts         # Ponto de entrada
```
