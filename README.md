# Cortex Bank - Arquitetura de Microfrontends

## 📋 Sumário

1. [Introdução](#introdução)
2. [Visão Geral da Arquitetura](#visão-geral-da-arquitetura)
3. [Estrutura do Projeto](#estrutura-do-projeto)
4. [Requisitos do Sistema](#requisitos-do-sistema)
5. [Instalação e Execução](#instalação-e-execução)
6. [Arquitetura Técnica](#arquitetura-técnica)
7. [Documentação Detalhada](#documentação-detalhada)
8. [Comandos Úteis](#comandos-úteis)

---

## Introdução

Este projeto apresenta uma implementação completa de **arquitetura de microfrontends** utilizando **Single-SPA** como framework de orquestração. O sistema foi desenvolvido para demonstrar os conceitos de modularidade, independência de deploy, isolamento de domínios e escalabilidade em aplicações web modernas.

A aplicação **Cortex Bank** é composta por múltiplos microfrontends independentes que se comunicam através de **Import Maps**, garantindo total desacoplamento entre os módulos e permitindo evolução tecnológica granular.

---

## Visão Geral da Arquitetura

A arquitetura do projeto está dividida nos seguintes componentes:

| Componente | Porta | Descrição |
|------------|-------|-----------|
| **root-config** | 3000 | Orquestrador principal que gerencia o carregamento e inicialização dos microfrontends |
| **navigation-drawer** | 3001 | Microfrontend responsável pelo menu lateral de navegação |
| **dashboard** | 3002 | Microfrontend do painel principal |
| **transactions** | 3003 | Microfrontend de transações bancárias |
| **statement** | 3004 | Microfrontend de extrato bancário |
| **backend** | 8080 | API REST em Node.js com Express e MongoDB |

Cada microfrontend roda em uma porta distinta e se comunica exclusivamente através de **Import Maps**, conhecendo apenas o root-config — nunca entre si. Essa abordagem garante isolamento completo e independência de deploy.

---

## Estrutura do Projeto

### Organização dos Microfrontends

O projeto segue uma estrutura modular onde cada microfrontend é um repositório independente:

```
cortex-bank/
├── root-config/          # Orquestrador (este diretório)
│   ├── docs/            # Documentação detalhada
│   ├── src/             # Código fonte do root-config
│   ├── Dockerfile       # Configuração Docker
│   └── docker-compose.yml
├── navigation-drawer/    # Microfrontend de navegação
├── dashboard/           # Microfrontend do dashboard
├── transactions/        # Microfrontend de transações
├── bank-statement/      # Microfrontend de extrato
└── backend/            # API REST backend
```

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
├── navigation-drawer/     # Um nível acima
├── dashboard/            # Um nível acima
├── transactions/         # Um nível acima
├── bank-statement/       # Um nível acima
└── backend/              # Um nível acima
```

---

## Instalação e Execução

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
   
   # Terminal 6 - Root Config
   npm start
   ```

3. Acessar `http://localhost:3000`

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

---

## Comandos Úteis

### Gerenciamento de Containers

| Tarefa | Comando |
|--------|---------|
| Subir todos os serviços | `docker-compose up --build` |
| Subir em background | `docker-compose up -d --build` |
| Parar todos os containers | `docker-compose down` |
| Parar e remover volumes | `docker-compose down -v` |
| Rebuild completo | `docker-compose up --build --force-recreate` |
| Ver logs | `docker-compose logs -f` |
| Ver logs de um serviço específico | `docker-compose logs -f [nome-do-serviço]` |

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

