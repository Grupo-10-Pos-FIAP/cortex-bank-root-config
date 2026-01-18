# 🔧 Configuração da URL do Backend de Produção

Este guia explica como configurar a URL do backend de produção para cada microfrontend na Vercel.

## 📋 Visão Geral

Cada microfrontend precisa conhecer a URL do backend de produção para fazer requisições à API. A configuração é feita através de **variáveis de ambiente** na Vercel.

## 🔍 Variáveis de Ambiente por Módulo

### Auth (`@auth/`)
- **Variável**: `REACT_APP_API_URL`
- **Padrão (desenvolvimento)**: `http://localhost:3000`
- **Uso**: Autenticação e registro de usuários

### Dashboard (`@dashboard/`)
- **Variável**: `API_BASE_URL`
- **Padrão (desenvolvimento)**: `http://localhost:8080`
- **Uso**: Dados do dashboard e widgets

### Navigation Drawer (`@navigation-drawer/`)
- **Variável**: `API_BASE_URL`
- **Padrão (desenvolvimento)**: `http://localhost:8080`
- **Uso**: Informações da conta e navegação

### Statement (`@statement/`)
- **Variável**: `API_BASE_URL`
- **Padrão (desenvolvimento)**: `http://localhost:8080`
- **Uso**: Extrato de transações

### Transactions (`@transactions/`)
- **Variável**: `API_BASE_URL`
- **Padrão (desenvolvimento)**: `http://localhost:8080`
- **Uso**: Gerenciamento de transações

## 🚀 Como Configurar na Vercel

### Passo 1: Acessar Configurações do Projeto

1. Acesse [vercel.com](https://vercel.com) e faça login
2. Selecione o projeto do microfrontend (ex: `cortex-bank-auth`)
3. Vá em **Settings** → **Environment Variables**

### Passo 2: Adicionar Variáveis de Ambiente

Para cada microfrontend, adicione a variável correspondente:

#### Para o módulo Auth:
```
REACT_APP_API_URL=https://seu-backend-producao.com
REACT_APP_REDIRECT_URL=https://seu-root-config.vercel.app/dashboard
```

#### Para os módulos Dashboard, Navigation Drawer, Statement e Transactions:
```
API_BASE_URL=https://seu-backend-producao.com
```

**Importante:**
- Substitua `https://seu-backend-producao.com` pela URL real do seu backend em produção
- Se o backend estiver no Coolify, use a URL fornecida pelo Coolify
- Se o backend estiver em outro serviço, use a URL completa (ex: `https://api.cortex-bank.com`)

### Passo 3: Selecionar Ambientes

Para cada variável, selecione os ambientes onde ela será aplicada:

- ✅ **Production** - Ambiente de produção
- ✅ **Preview** - Deploys de preview (PRs e branches)
- ✅ **Development** - Ambiente de desenvolvimento (opcional)

**Recomendação:** Configure pelo menos **Production** e **Preview**.

### Passo 4: Fazer Novo Deploy

Após adicionar as variáveis:

1. Vá em **Deployments**
2. Clique nos três pontos (⋯) do último deploy
3. Selecione **Redeploy**
4. Ou faça um novo push para a branch `main` (deploy automático)

## 📝 Exemplo de Configuração Completa

### Exemplo: Backend no Coolify

Se seu backend está deployado no Coolify na URL `https://backend.cortex-bank.com`:

#### Auth:
```
REACT_APP_API_URL=https://backend.cortex-bank.com
REACT_APP_REDIRECT_URL=https://cortex-bank-root-config.vercel.app/dashboard
```

#### Dashboard, Navigation Drawer, Statement, Transactions:
```
API_BASE_URL=https://backend.cortex-bank.com
```

### Exemplo: Backend em outro serviço

Se seu backend está em `https://api.cortex-bank.com`:

#### Auth:
```
REACT_APP_API_URL=https://api.cortex-bank.com
REACT_APP_REDIRECT_URL=https://cortex-bank-root-config.vercel.app/dashboard
```

#### Dashboard, Navigation Drawer, Statement, Transactions:
```
API_BASE_URL=https://api.cortex-bank.com
```

## 🔍 Como Verificar se Está Funcionando

### 1. Verificar no Build

As variáveis de ambiente são injetadas durante o build. Verifique os logs de build na Vercel:

1. Vá em **Deployments** → Selecione um deploy
2. Veja os logs do build
3. As variáveis devem estar disponíveis durante o processo de build

### 2. Verificar no Navegador

1. Abra o DevTools (F12)
2. Vá em **Network**
3. Faça uma ação que chame a API (ex: login, carregar dashboard)
4. Verifique a requisição e confirme que está usando a URL correta do backend

### 3. Verificar no Código

As variáveis são acessadas através de `process.env`:

```typescript
// Exemplo no auth
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

// Exemplo nos outros módulos
const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:8080";
```

## 🐛 Troubleshooting

### Problema: Requisições ainda vão para localhost

**Solução:**
1. Verifique se a variável de ambiente foi adicionada corretamente
2. Verifique se selecionou o ambiente correto (Production)
3. Faça um novo deploy após adicionar a variável
4. Limpe o cache do navegador

### Problema: CORS Error

**Solução:**
1. Configure CORS no backend para aceitar requisições do domínio da Vercel
2. Adicione a URL do frontend (ex: `https://cortex-bank-auth.vercel.app`) nas origens permitidas do backend

### Problema: Variável não está disponível no build

**Solução:**
1. Verifique se a variável está com o nome exato (case-sensitive)
2. Verifique se selecionou o ambiente correto
3. As variáveis precisam começar com `REACT_APP_` para o módulo auth, ou `API_BASE_URL` para os outros

## 📚 Referências

- [Documentação da Vercel - Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Webpack DefinePlugin](https://webpack.js.org/plugins/define-plugin/)
- [Documentação do Backend - Deploy](./../../backend/DEPLOY.md)
