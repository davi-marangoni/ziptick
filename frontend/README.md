# ZipTick Frontend

Frontend do sistema ZipTick construído com React, TypeScript e Vite.

## Requisitos

- Node.js 18+
- npm ou yarn

## Instalação

1. Instale as dependências:

```bash
npm install
```

2. Configure o arquivo `.env` se necessário (a URL da API está configurada no código):

## Scripts

- `npm run dev` - Inicia o servidor de desenvolvimento (porta 3001)
- `npm run build` - Compila o projeto para produção
- `npm run preview` - Visualiza o build em produção localmente

## Estrutura de Pastas

```
src/
├── components/      # Componentes React reutilizáveis
├── contexts/        # Context API para estado global (Autenticação)
├── hooks/          # Custom React hooks
├── pages/          # Páginas/telas do aplicativo
├── services/       # Serviços de integração com API
├── styles/         # Arquivos CSS globais e específicos
├── types/          # Tipos/Interfaces TypeScript
├── App.tsx         # Componente raiz com rotas
├── main.tsx        # Ponto de entrada do aplicativo
└── vite-env.d.ts   # Tipos do Vite
```

## Autenticação

O sistema utiliza Context API para gerenciar estado de autenticação:

- O token JWT é armazenado no localStorage
- O usuário é redirecionado para login se não autenticado
- Rotas admin requerem acesso de administrador (tipo 1)

## Componentes

### ProtectedRoute
Componente que protege rotas, redirecionando para login se não autenticado.

### AdminRoute
Componente que protege rotas administrativas, permitindo acesso apenas para usuários tipo 1.

### AdminOnly
Componente que renderiza seus filhos apenas se o usuário for administrador.

### Layout
Componente de layout principal que contém Sidebar e conteúdo principal.

### Sidebar
Barra de navegação lateral com links e botão de logout.

## Páginas

- **Login** - Tela de autenticação
- **Dashboard** - Página inicial do sistema
- **Users** - Gerencamento de usuários (admin)
- **UserForm** - Formulário para criar novo usuário (admin)
- **PasswordEditForm** - Formulário para editar senha de usuário (admin)
- **NotFound** - Página 404

## Context API

### AuthContext
Fornece:
- `user` - Dados do usuário autenticado
- `token` - Token JWT
- `login(email, senha)` - Função para fazer login
- `logout()` - Função para sair
- `isAuthenticated` - Booleano indicando se está autenticado
- `isAdmin` - Booleano indicando se é administrador

## Dependências Principais

- **React 19** - Biblioteca UI
- **React Router DOM 7** - Roteamento
- **Bootstrap 5** - Framework CSS
- **Axios** - Cliente HTTP
- **FontAwesome** - Ícones
- **Vite** - Build tool e dev server

## Integração com API

A URL base da API está configurada como `http://localhost:3000` nos serviços axios.

Endpoints principais:
- `POST /api/usuarios/login` - Fazer login
- `GET /api/usuarios` - Listar usuários (admin)
- `POST /api/usuarios/register` - Criar usuário (admin)
- `PUT /api/usuarios/:email/senha` - Atualizar senha (admin)
- `DELETE /api/usuarios/:email` - Deletar usuário (admin)
