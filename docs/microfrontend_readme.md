# Arquitetura de Microfrontends do Cortex Bank

Este documento descreve, de forma clara e direta, como a arquitetura de **microfrontends** deste projeto foi estruturada, incluindo responsabilidades, fluxo operacional, decisões técnicas e a função do `root-config` como orquestrador.

A abordagem segue boas práticas de Single-SPA, import maps, isolamento de domínios, independência de deploy e padronização de ambientes.

---

## 🎯 Visão Geral da Arquitetura

O projeto utiliza **Single-SPA** como framework de orquestração e um conjunto de microfrontends totalmente independentes, empacotados via Webpack e servidos como aplicações remotas.

A arquitetura está dividida em:

- **Root Config** (orquestrador)
- **Navigation Drawer** (menu lateral)
- **Dashboard**
- **Transactions**
- **Bank Statement**

Cada microfrontend roda em uma porta distinta, se comunica somente via Import Maps e só conhece o root-config — nunca entre si.

---

## 🧠 Papel do Root-Config

O **root-config** é o coração da arquitetura. Ele é responsável por:

### ✔️ 1. Declarar o Import Map
Ele define onde cada microfrontend está hospedado (local ou remoto).

### ✔️ 2. Carregar e inicializar os microfrontends
Usa o layout HTML (`microfrontend-layout.html`) para encaixar cada aplicação em seu respectivo slot.

### ✔️ 3. Gerenciar navegação e roteamento compartilhado
O arquivo `microfrontend-layout.html` direciona qual MFE será exibido em cada rota.

### ✔️ 4. Centralizar dependências compartilhadas via CDN
React, React DOM e Single-SPA são servidos via CDN, reduzindo bundle size dos MFEs.

### ✔️ 5. Controlar ambientes
O `index.ejs` injeta import maps diferentes quando o parâmetro `isLocal` está ativo, permitindo rodar tudo no Docker ou localmente.

---

## 🔧 Import Maps no `index.ejs`

No modo local (`npm start`), o import map aponta cada microfrontend para sua porta:

```json
"@cortex-bank/dashboard": "//localhost:3002/cortex-bank-dashboard.js"
```

No modo produção (ou outro ambiente), basta substituir por uma URL remota, CDN ou storage.

O root-config nunca faz import "hardcoded" — tudo vem do import map.

---

## 🧩 Layout do Sistema

O layout HTML define onde cada microfrontend deve ser renderizado:

```html
<nav>
  <application name="@cortex-bank/navigation-drawer"></application>
</nav>
<route default>
  <application name="@cortex-bank/dashboard"></application>
</route>
```

Esse arquivo controla exatamente:
- onde o navigation drawer aparece
- qual aplicação é carregada por padrão
- qual rota aciona qual microfrontend

Sem esse arquivo, o root-config não teria conhecimento da estrutura visual.

---

## 🔌 Execução em Desenvolvimento

Cada microfrontend sobe sua própria instância Webpack Dev Server:
- Root: porta 3000
- Navigation Drawer: porta 3001
- Dashboard: porta 3002
- Transactions: porta 3003
- Bank Statement: porta 3004

Quando todos estão de pé, o root-config injeta os módulos do import map e inicializa o sistema.

---

## 🐳 Integração com Docker

Cada MFE possui seu Dockerfile e é construído isoladamente.

O docker-compose orquestra a subida simultânea de todos, garantindo:
- volumes independentes de node_modules
- mount dos diretórios `src`/`public`
- healthchecks robustos
- dependência entre serviços

O root-config só sobe quando todos os MFEs estiverem saudáveis.

---

## 📦 Independência Total Entre Microfrontends

Cada microfrontend possui:
- seu próprio Webpack
- seu próprio package.json
- seu próprio ciclo de build
- seu próprio Dockerfile
- seu próprio deploy

Os MFEs **não compartilham código diretamente** — apenas via CDN através de import maps.

Isso garante:
- Deploy independente
- Falhas isoladas
- Evolução tecnológica granular

---

## 🛠 Tecnologias Centrais

- **single-spa** → orquestração
- **single-spa-layout** → definição visual
- **import-map-injector** → sobrecarga de import maps
- **webpack** → empacotamento
- **React 19** via CDN
- **Import-map-overrides** → devtools para substituição dinâmica de MFEs

---

## 🚀 Como o fluxo funciona (end-to-end)

1. O usuário acessa `http://localhost:3000`.
2. O root-config é carregado.
3. O import map é lido.
4. Os bundles de cada microfrontend são carregados.
5. Single-SPA inicializa cada aplicação registrada.
6. O layout HTML controla onde cada módulo se encaixa.
7. Rotas são tratadas pelo single-spa-router.

---

## 📌 Conclusão

A abordagem adotada entrega:
- Arquitetura escalável
- Deploy independente
- Manutenção modular
- Evolução granular
- Isolamento seguro entre frontends
- Total alinhamento com boas práticas de microfrontends modernos

