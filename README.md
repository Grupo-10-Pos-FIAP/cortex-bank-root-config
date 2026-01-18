# Cortex Bank - Arquitetura de Microfrontends

## 📋 Sumário

1. [Introdução](#introdução)
2. [Como Testar a Aplicação](#como-testar-a-aplicação)
3. [Visão Geral da Arquitetura](#visão-geral-da-arquitetura)
4. [Estrutura do Projeto](#estrutura-do-projeto)
5. [Requisitos do Sistema](#requisitos-do-sistema)
6. [Instalação e Execução](#instalação-e-execução)
7. [Arquitetura Técnica](#arquitetura-técnica)
8. [Infraestrutura e Deploy](#infraestrutura-e-deploy)
9. [Segurança](#segurança)
10. [Testando a Aplicação](#testando-a-aplicação)
11. [Documentação Detalhada](#documentação-detalhada)
12. [Comandos Úteis](#comandos-úteis)

---

## Introdução

Este projeto apresenta uma implementação completa de **arquitetura de microfrontends** utilizando **Single-SPA** como framework de orquestração. O sistema foi desenvolvido para demonstrar os conceitos de modularidade, independência de deploy, isolamento de domínios e escalabilidade em aplicações web modernas.

A aplicação **Cortex Bank** é composta por múltiplos microfrontends independentes que se comunicam através de **Import Maps**, garantindo total desacoplamento entre os módulos e permitindo evolução tecnológica granular.

---

## Como Testar a Aplicação

### 🌐 Teste Online (Produção)

A aplicação está disponível em produção e pode ser testada diretamente no navegador:

**URL de Produção:** [https://cortex-bank-root-config.vercel.app](https://cortex-bank-root-config.vercel.app)

**Como testar:**

1. Acesse a URL acima no seu navegador
2. Crie uma conta de usuário através da interface de autenticação
3. Explore todas as funcionalidades:
   - Dashboard com visão geral das contas
   - Criação e gerenciamento de transações
   - Visualização de extratos bancários
   - Navegação entre diferentes seções da aplicação

**Vantagens do teste online:**

- ✅ Não requer instalação local
- ✅ Ambiente de produção estável
- ✅ Acesso imediato para avaliação
- ✅ Todas as funcionalidades disponíveis

---

### 🐳 Teste Local com Docker (Recomendado para Desenvolvimento)

Para testar a aplicação localmente usando Docker, siga os passos abaixo:

#### Pré-requisitos

Certifique-se de ter instalado:

- **Docker** (versão 20.10 ou superior)
- **Docker Compose** (incluso no Docker Desktop)

#### Passo a Passo para Testar Localmente

1. **Clone ou baixe o repositório do root-config**

   ```bash
   cd root-config
   ```

2. **Verifique se você tem todos os microfrontends na estrutura correta**

   A estrutura de diretórios deve ser:

   ```
   projeto/
   ├── root-config/          # Diretório atual
   ├── auth/                 # Um nível acima
   ├── navigation-drawer/    # Um nível acima
   ├── dashboard/            # Um nível acima
   ├── transactions/         # Um nível acima
   ├── bank-statement/       # Um nível acima
   └── backend/              # Um nível acima
   ```

3. **Subir toda a aplicação com Docker Compose**

   No diretório `root-config` (onde está o `docker-compose.yml`), execute:

   ```bash
   docker-compose up --build
   ```

   **O que este comando faz:**

   - Constrói as imagens Docker de cada microfrontend e do backend
   - Cria volumes persistentes de `node_modules` para cada serviço
   - Sobe cada aplicação em sua respectiva porta
   - Aguarda todos os healthchecks ficarem saudáveis
   - Sobe o root-config apenas quando todos os microfrontends estiverem prontos

   **Tempo estimado:** 3-5 minutos na primeira execução (build das imagens)

4. **Aguardar inicialização completa**

   Aguarde até ver mensagens indicando que todos os serviços estão rodando. Você verá algo como:

   ```
   root-config_1  | webpack compiled successfully
   backend_1      | 🟢 MongoDB conectado
   backend_1      | Servidor rodando na porta 3000
   ```

5. **Acessar a aplicação**

   Quando todos os containers estiverem rodando e estáveis:

   👉 **Acesse:** [http://localhost:3000](http://localhost:3000)

   O root-config irá:
   - Ler o import map local
   - Carregar os microfrontends das portas configuradas
   - Montar o layout definido em `microfrontend-layout.html`

   O backend estará disponível em `http://localhost:8080` para receber requisições dos microfrontends.

6. **Criar um usuário e testar**

   - Acesse a interface de autenticação
   - Crie uma nova conta de usuário
   - Explore todas as funcionalidades da aplicação

#### Comandos Úteis para Teste Local

**Ver logs em tempo real:**

```bash
docker-compose logs -f
```

**Ver logs de um serviço específico:**

```bash
docker-compose logs -f backend
docker-compose logs -f root-config
```

**Parar a aplicação:**

```bash
docker-compose down
```

**Parar e limpar volumes (reset completo):**

```bash
docker-compose down -v
```

**Reiniciar a aplicação:**

```bash
docker-compose restart
```

#### Troubleshooting

**Problema: Porta já em uso**

Se alguma porta estiver em uso, você pode:

1. Parar outros serviços que estejam usando as portas (3000, 3001, 3002, 3003, 3004, 3005, 8080)
2. Ou modificar as portas no `docker-compose.yml`

**Problema: Containers não iniciam**

1. Verifique se o Docker está rodando
2. Verifique os logs: `docker-compose logs`
3. Tente rebuild completo: `docker-compose up --build --force-recreate`

**Problema: Microfrontends não carregam**

1. Verifique se todos os containers estão rodando: `docker-compose ps`
2. Verifique os logs do root-config: `docker-compose logs root-config`
3. Verifique o console do navegador para erros

---

## Visão Geral da Arquitetura

A arquitetura do projeto está dividida nos seguintes componentes:

| Componente            | Porta | Descrição                                                                             |
| --------------------- | ----- | ------------------------------------------------------------------------------------- |
| **root-config**       | 3000  | Orquestrador principal que gerencia o carregamento e inicialização dos microfrontends |
| **navigation-drawer** | 3001  | Microfrontend responsável pelo menu lateral de navegação                              |
| **dashboard**         | 3002  | Microfrontend do painel principal                                                     |
| **transactions**      | 3003  | Microfrontend de transações bancárias                                                 |
| **statement**         | 3004  | Microfrontend de extrato bancário                                                     |
| **auth**              | 3005  | Microfrontend de autenticação                                                         |
| **backend**           | 8080  | API REST em Node.js com Express e MongoDB                                             |

Cada microfrontend roda em uma porta distinta e se comunica exclusivamente através de **Import Maps**, conhecendo apenas o root-config — nunca entre si. Essa abordagem garante isolamento completo e independência de deploy.

---

## Estrutura do Projeto

### Organização dos Microfrontends

O projeto segue uma estrutura modular onde cada microfrontend é um repositório independente:

```
cortex-bank/
├── root-config/           # Orquestrador (este diretório)
│   ├── docs/              # Documentação detalhada
│   ├── src/               # Código fonte do root-config
│   ├── Dockerfile         # Configuração Docker
│   └── docker-compose.yml
├── auth/                  # Microfrontend de autenticação
├── navigation-drawer/     # Microfrontend de navegação
├── dashboard/             # Microfrontend do dashboard
├── transactions/          # Microfrontend de transações
├── bank-statement/        # Microfrontend de extrato
└── backend/               # API REST backend
```

### Repositórios GitHub

Cada componente do projeto possui seu próprio repositório no GitHub:

- **Root Config**: [cortex-bank-root-config](https://github.com/Grupo-10-Pos-FIAP/cortex-bank-root-config)
- **Navigation Drawer**: [cortex-bank-navigation-drawer](https://github.com/Grupo-10-Pos-FIAP/cortex-bank-navigation-drawer)
- **Dashboard**: [cortex-bank-dashboard](https://github.com/Grupo-10-Pos-FIAP/cortex-bank-dashboard)
- **Transactions**: [cortex-bank-transactions](https://github.com/Grupo-10-Pos-FIAP/cortex-bank-transactions)
- **Bank Statement**: [cortex-bank-statement](https://github.com/Grupo-10-Pos-FIAP/cortex-bank-statement)
- **Authentication**: [cortex-bank-auth](https://github.com/Grupo-10-Pos-FIAP/cortex-bank-auth)
- **Backend**: [cortex-bank-backend](https://github.com/Grupo-10-Pos-FIAP/cortex-bank-backend)
- **Design System**: [Design-System](https://github.com/Grupo-10-Pos-FIAP/Design-System)

### Responsabilidades do Root-Config

O **root-config** é o coração da arquitetura e possui as seguintes responsabilidades:

1. **Declarar o Import Map**: Define onde cada microfrontend está hospedado (local ou remoto)
2. **Carregar e inicializar os microfrontends**: Utiliza o layout HTML (`microfrontend-layout.html`) para encaixar cada aplicação em seu respectivo slot
3. **Gerenciar navegação e roteamento compartilhado**: Direciona qual microfrontend será exibido em cada rota
4. **Centralizar dependências compartilhadas via CDN**: React, React DOM e Single-SPA são servidos via CDN, reduzindo o tamanho dos bundles
5. **Controlar ambientes**: Injeta import maps diferentes conforme o ambiente (desenvolvimento ou produção)

---

## Requisitos do Sistema

Antes de iniciar, certifique-se de ter instalado:

- **Docker** (versão 20.10 ou superior)
- **Docker Compose** (incluso no Docker Desktop)
- **Node.js** (versão 22 ou superior) - opcional para desenvolvimento local
- **npm** ou **yarn** - opcional para desenvolvimento local

### Estrutura de Diretórios Necessária

Para executar o projeto completo, é necessário ter todos os microfrontends na estrutura de diretórios correta:

```
projeto/
├── root-config/          # Diretório atual
├── auth/                 # Um nível acima
├── navigation-drawer/    # Um nível acima
├── dashboard/            # Um nível acima
├── transactions/         # Um nível acima
├── bank-statement/       # Um nível acima
└── backend/              # Um nível acima
```

---

## Instalação e Execução

> **💡 Dica:** Para testar a aplicação rapidamente, consulte a seção [Como Testar a Aplicação](#como-testar-a-aplicação) acima, que contém instruções detalhadas para teste local e online.

### Método 1: Docker Compose (Recomendado)

Este é o método mais simples e garante um ambiente consistente, isolado de variações de máquina.

#### 1. Subir toda a aplicação

No diretório `root-config` (onde está o `docker-compose.yml`), execute:

```bash
docker-compose up --build
```

**O que esse comando faz:**

- Constrói as imagens Docker de cada microfrontend e do backend usando seus respectivos Dockerfiles
- Cria volumes persistentes de `node_modules` para cada serviço
- Sobe cada aplicação em sua respectiva porta
- Aguarda todos os healthchecks ficarem saudáveis
- Sobe o root-config apenas quando todos os microfrontends estiverem prontos

#### 2. Acessar o sistema

Quando todos os containers estiverem rodando e estáveis:

👉 **Acesse:** `http://localhost:3000`

O root-config irá:

- Ler o import map local
- Carregar os microfrontends das portas configuradas
- Montar o layout definido em `microfrontend-layout.html`

O backend estará disponível em `http://localhost:8080` para receber requisições dos microfrontends.

#### 3. Atualizações em tempo real

Graças aos volumes mapeados no Docker Compose:

- Qualquer alteração nos arquivos `src/` dos microfrontends é refletida em tempo real
- O webpack-dev-server dentro do container recarrega automaticamente
- Não é necessário rebuildar imagens para alterações simples de código

### Método 2: Desenvolvimento Local (Sem Docker)

Para desenvolvimento local sem Docker, é necessário:

1. Instalar dependências em cada microfrontend:

```bash
cd ../auth && npm install
cd ../navigation-drawer && npm install
cd ../dashboard && npm install
cd ../transactions && npm install
cd ../bank-statement && npm install
cd ../backend && npm install
```

2. Iniciar cada serviço em terminais separados:

```bash
# Terminal 1 - Navigation Drawer
cd ../navigation-drawer && npm start

# Terminal 2 - Dashboard
cd ../dashboard && npm start

# Terminal 3 - Transactions
cd ../transactions && npm start

# Terminal 4 - Bank Statement
cd ../bank-statement && npm start

# Terminal 5 - Backend
cd ../backend && npm start

# Terminal 6 - Authentication
cd ../auth && npm start

# Terminal 7 - Root Config
npm start
```

3.Acessar `http://localhost:3000`

---

## Arquitetura Técnica

### Stack Tecnológica

- **Single-SPA**: Framework de orquestração de microfrontends
- **Single-SPA Layout**: Definição visual e de layout
- **Import Map Injector**: Injeção dinâmica de import maps
- **Webpack**: Empacotamento dos microfrontends
- **React 19**: Framework frontend (servido via CDN)
- **Node.js 22**: Runtime do backend
- **Express**: Framework web do backend
- **MongoDB**: Banco de dados
- **Docker & Docker Compose**: Containerização e orquestração

### Princípios Arquiteturais

#### 1. Independência Total Entre Microfrontends

Cada microfrontend possui:

- Seu próprio Webpack
- Seu próprio `package.json`
- Seu próprio ciclo de build
- Seu próprio Dockerfile
- Seu próprio deploy

Os microfrontends **não compartilham código diretamente** — apenas via CDN através de import maps. Isso garante:

- ✅ Deploy independente
- ✅ Falhas isoladas
- ✅ Evolução tecnológica granular

#### 2. Comunicação via Import Maps

No modo local, o import map aponta cada microfrontend para sua porta:

```json
{
  "imports": {
    "@cortex-bank/dashboard": "//localhost:3002/cortex-bank-dashboard.js",
    "@cortex-bank/navigation-drawer": "//localhost:3001/cortex-bank-navigation-drawer.js"
  }
}
```

No modo produção, essas URLs podem ser substituídas por CDN ou storage remoto.

#### 3. Fluxo de Execução (End-to-End)

1. O usuário acessa `http://localhost:3000`
2. O root-config é carregado
3. O import map é lido e processado
4. Os bundles de cada microfrontend são carregados dinamicamente
5. Single-SPA inicializa cada aplicação registrada
6. O layout HTML controla onde cada módulo se encaixa na interface
7. Rotas são tratadas pelo single-spa-router

### Integração com Docker

Cada microfrontend possui seu próprio Dockerfile otimizado para desenvolvimento:

- Baseado em Node.js 22 Alpine (leve e rápido)
- Cache de camadas para dependências
- Hot reload via volumes mapeados
- Healthchecks robustos

O `docker-compose.yml` orquestra:

- Build isolado de cada serviço
- Volumes independentes de `node_modules`
- Mount dos diretórios `src/` e `public/` para hot reload
- Healthchecks que garantem inicialização ordenada
- Rede compartilhada entre todos os serviços

---

## Infraestrutura e Deploy

O projeto **Cortex Bank** utiliza uma arquitetura distribuída com separação clara entre frontend e backend, garantindo escalabilidade, segurança e manutenibilidade.

### Resumo da Arquitetura

- **Frontend (Vercel)**: Todos os microfrontends hospedados na Vercel com CDN global, SSL/TLS automático e deploy automático via CI/CD
- **Backend (Coolify/Hostinger)**: API REST hospedada no Coolify via Hostinger, com containerização Docker e monitoramento de recursos
- **Banco de Dados (MongoDB Cloud)**: MongoDB Atlas com alta disponibilidade, backups automáticos e segurança robusta
- **CI/CD**: Deploy automático na branch `main` via integração GitHub → Vercel/Coolify
- **Variáveis de Ambiente**: Gerenciadas de forma segura nas respectivas plataformas (Vercel para frontend, Coolify para backend)

**⚠️ Importante sobre Variáveis de Ambiente:**

- **Desenvolvimento Local**: Utiliza arquivo `.env` local (não versionado no Git)
- **Produção**: Variáveis gerenciadas exclusivamente nos painéis da Vercel (frontend) e Coolify (backend)
- **Segurança**: Nenhuma credencial ou informação sensível é versionada no código-fonte

📖 **[Documentação Completa de Infraestrutura e Deploy](./docs/infrastructure_deploy.md)** - Detalhes completos sobre hospedagem, CI/CD, variáveis de ambiente e diagrama de arquitetura.

---

## Segurança

A segurança é uma preocupação fundamental em todas as camadas da arquitetura do **Cortex Bank**.

### Resumo das Medidas de Segurança

**Frontend:**

- Headers de segurança HTTP (CSP, XSS Protection, Frame Options)
- CORS configurado e restrito
- Variáveis de ambiente gerenciadas na Vercel
- HTTPS obrigatório

**Backend:**

- Variáveis de ambiente no Coolify (criptografadas)
- Autenticação JWT com tokens seguros
- Validação de inputs
- Health check endpoint para monitoramento básico

**Banco de Dados:**

- Network Access Control (apenas IPs autorizados)
- Criptografia em trânsito e em repouso
- Usuários com permissões limitadas
- Backups automáticos e seguros

**Comunicação:**

- HTTPS/TLS em todas as camadas
- Validação de certificados
- Tokens JWT transmitidos de forma segura

🔒 **[Documentação Completa de Segurança](./docs/security.md)** - Detalhes completos sobre todas as medidas de segurança implementadas, checklist e boas práticas.

---

## Testando a Aplicação

Esta seção contém informações adicionais sobre endpoints e funcionalidades específicas para testes.

> **📌 Nota:** Para instruções completas de como testar a aplicação (localmente ou online), consulte a seção [Como Testar a Aplicação](#como-testar-a-aplicação) no início deste documento.

### Endpoint para Marcar Transação como Concluída

O backend disponibiliza um endpoint específico para marcar transações como concluídas, permitindo testar a aplicação com transações em diferentes estados.

**Endpoint:**

```
PATCH /account/transaction/:id/complete
```

**Autenticação:**

- Requer token JWT válido no header `Authorization: Bearer <token>`

**Parâmetros:**

- `id` (path parameter): ID da transação a ser marcada como concluída

**Resposta de Sucesso (200):**

```json
{
  "message": "Transação marcada como concluída com sucesso",
  "result": {
    "id": "...",
    "status": "Done",
    ...
  }
}
```

**Exemplo de Uso no Postman:**

1. **Método**: `PATCH`
2. **URL**: `http://localhost:8080/account/transaction/{transactionId}/complete`
   - Substitua `{transactionId}` pelo ID real da transação
3. **Headers**:
   - `Authorization: Bearer <seu-token-jwt>`
   - `Content-Type: application/json`
4. **Body**: Não é necessário enviar body para este endpoint

**Exemplo com cURL:**

```bash
curl -X PATCH \
  http://localhost:8080/account/transaction/507f1f77bcf86cd799439011/complete \
  -H "Authorization: Bearer seu-token-jwt" \
  -H "Content-Type: application/json"
```

**Nota:** Este endpoint é útil para testes, permitindo simular transações concluídas. Isso facilita o teste de funcionalidades que dependem do estado das transações na aplicação.

**Documentação da API:**

A documentação completa da API, incluindo este e outros endpoints, está disponível através do Swagger em:
- **Local**: `http://localhost:8080/docs`

---

## Documentação Detalhada

Para informações mais detalhadas sobre aspectos específicos da arquitetura, consulte os seguintes documentos na pasta `docs/`:

### 📘 [Arquitetura de Microfrontends](./docs/microfrontend_readme.md)

Documento completo explicando:

- Visão geral da arquitetura
- Papel do root-config
- Import Maps e como funcionam
- Layout do sistema
- Execução em desenvolvimento
- Integração com Docker
- Backend API
- Independência entre microfrontends
- Tecnologias utilizadas
- Fluxo end-to-end

### 🐳 [Como Subir a Aplicação Localmente](./docs/docker_local_setup.md)

Guia prático detalhado sobre:

- Requisitos do sistema
- Passo a passo para subir com Docker Compose
- Como acessar o sistema
- Atualizações em tempo real
- Comandos para parar e limpar containers
- Rebuild completo
- Limpeza de imagens antigas
- Tabela resumo de comandos operacionais

### 🔧 [Estrutura Docker Explicada](./docs/docker_explanation.md)

Documentação técnica linha a linha sobre:

- Dockerfile — explicação detalhada de cada instrução
- docker-compose.yml — explicação de cada configuração
- Volumes e montagens
- Healthchecks
- Networks
- Otimizações de performance

### 🏗️ [Infraestrutura e Deploy](./docs/infrastructure_deploy.md)

Documentação completa sobre:

- Arquitetura de infraestrutura (Frontend, Backend, Banco de Dados)
- Hospedagem na Vercel (frontend) e Coolify/Hostinger (backend)
- CI/CD e deploy automático na branch `main`
- Gerenciamento de variáveis de ambiente
- MongoDB Cloud
- Diagrama de infraestrutura

### 🔒 [Segurança](./docs/security.md)

Documentação completa sobre:

- Segurança no frontend (headers HTTP, CORS, variáveis)
- Segurança no backend (autenticação, validação, rate limiting)
- Segurança no banco de dados (network access, criptografia)
- Segurança na comunicação (HTTPS/TLS)
- Health check e monitoramento básico
- Boas práticas de segurança
- Checklist de segurança

---

## Comandos Úteis

### Gerenciamento de Containers

| Tarefa                            | Comando                                      |
| --------------------------------- | -------------------------------------------- |
| Subir todos os serviços           | `docker-compose up --build`                  |
| Subir em background               | `docker-compose up -d --build`               |
| Parar todos os containers         | `docker-compose down`                        |
| Parar e remover volumes           | `docker-compose down -v`                     |
| Rebuild completo                  | `docker-compose up --build --force-recreate` |
| Ver logs                          | `docker-compose logs -f`                     |
| Ver logs de um serviço específico | `docker-compose logs -f [nome-do-serviço]`   |

### Limpeza e Manutenção

```bash
# Limpar imagens não utilizadas
docker system prune -af

# Limpar volumes órfãos
docker volume prune

# Ver status dos containers
docker-compose ps

# Reiniciar um serviço específico
docker-compose restart [nome-do-serviço]
```

### Desenvolvimento

```bash
# Instalar dependências localmente (root-config)
npm install

# Iniciar em modo desenvolvimento local
npm start

# Build para produção
npm run build
```

---

## Conclusão

Esta arquitetura de microfrontends demonstra uma implementação completa e profissional que entrega:

- ✅ **Escalabilidade**: Fácil adição de novos microfrontends
- ✅ **Deploy Independente**: Cada módulo pode ser deployado separadamente
- ✅ **Manutenção Modular**: Equipes podem trabalhar de forma independente
- ✅ **Evolução Granular**: Tecnologias podem ser atualizadas por módulo
- ✅ **Isolamento Seguro**: Falhas em um microfrontend não afetam os outros
- ✅ **Ambiente Consistente**: Docker garante que todos desenvolvem no mesmo ambiente
- ✅ **Alinhamento com Boas Práticas**: Segue padrões modernos de arquitetura de microfrontends

Para mais detalhes técnicos, consulte a [documentação completa](./docs/) na pasta `docs/`.

---

## Referências

- [Single-SPA Documentation](https://single-spa.js.org/)
- [Import Maps Specification](https://github.com/WICG/import-maps)
- [Docker Documentation](https://docs.docker.com/)
- [Webpack Documentation](https://webpack.js.org/)

---

**Desenvolvido para fins acadêmicos e de demonstração de arquitetura de microfrontends.**
