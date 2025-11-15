# Como Subir a Aplicação Localmente com Docker Compose

Este guia explica, de forma direta e prática, como qualquer pessoa pode levantar todo o ecossistema de microfrontends localmente utilizando **Docker Compose**.

A arquitetura atual possui:
- **root-config** (porta 3000)
- **navigation-drawer** (3001)
- **dashboard** (3002)
- **transactions** (3003)
- **statement** (3004)
- **backend** (porta 8080)

Cada módulo possui sua própria imagem, volume de `node_modules` e diretório sincronizado.

---

## Requisitos

---

## Repositórios dos Microfrontends

Todos os componentes do projeto estão disponíveis em repositórios GitHub separados:

- **Root Config**: [cortex-bank-root-config](https://github.com/Grupo-10-Pos-FIAP/cortex-bank-root-config)
- **Navigation Drawer**: [cortex-bank-navigation-drawer](https://github.com/Grupo-10-Pos-FIAP/cortex-bank-navigation-drawer)
- **Dashboard**: [cortex-bank-dashboard](https://github.com/Grupo-10-Pos-FIAP/cortex-bank-dashboard)
- **Transactions**: [cortex-bank-transactions](https://github.com/Grupo-10-Pos-FIAP/cortex-bank-transactions)
- **Bank Statement**: [cortex-bank-statement](https://github.com/Grupo-10-Pos-FIAP/cortex-bank-statement)
- **Backend**: [cortex-bank-backend](https://github.com/Grupo-10-Pos-FIAP/cortex-bank-backend)
- **Design System**: [Design-System](https://github.com/Grupo-10-Pos-FIAP/Design-System)

---

Antes de iniciar, o desenvolvedor precisa ter:

- **Docker** instalado
- **Docker Compose** instalado (incluso no Docker Desktop)
- A pasta do projeto completa, com os microfrontends em:
  - `../navigation-drawer`
  - `../dashboard`
  - `../transactions`
  - `../statement`
  - `./root-config`
  - `../backend`

---

## 🚀 1. Subindo tudo com Docker Compose

No diretório `root-config` (onde está o `docker-compose.yml`):

```sh
docker-compose up --build
```

### O que esse comando faz:
- **builda** as imagens de cada microfrontend e do backend usando os seus Dockerfiles
- cria volumes persistentes de `node_modules`
- sobe cada aplicação em sua respectiva porta
- aguarda todos os healthchecks ficarem saudáveis
- sobe o root-config apenas quando tudo estiver pronto

---

## 🧪 2. Acessando o sistema

Quando todos os containers estiverem verdes e estáveis:

👉 Acesse:
```
http://localhost:3000
```

O root-config irá:
- ler o import map local
- carregar os microfrontends das portas configuradas
- montar o layout definido em `microfrontend-layout.html`

O backend estará disponível em `http://localhost:8080` para receber requisições dos microfrontends.

---

## 🔄 3. Atualizações em tempo real

Graças aos volumes mapeados:
- qualquer alteração nos arquivos **src/** dos microfrontends é refletida em tempo real
- webpack-dev-server dentro do container recarrega automaticamente

Não é necessário rebuildar imagens para alterações simples de código.

---

## 🛑 4. Parar tudo

Para desligar todos os containers:

```sh
docker-compose down
```

Para limpar volumes de `node_modules` e começar do zero:

```sh
docker-compose down -v
```

---

## 🏗 5. Rebuild completo (quando necessário)

Se você alterar dependências, Dockerfiles ou package.json:

```sh
docker-compose up --build --force-recreate
```

---

## 🧹 6. Limpando imagens antigas

```sh
docker system prune -af
```

Isso ajuda bastante em ambientes de desenvolvimento.

---

## 📌 Resumo operacional

| Tarefa | Comando |
|-------|---------|
| Subir tudo | `docker-compose up --build` |
| Parar | `docker-compose down` |
| Limpar volumes | `docker-compose down -v` |
| Rebuild completo | `docker-compose up --build --force-recreate` |

---

## 🎯 Conclusão

Em menos de um comando, o desenvolvedor consegue rodar todo o ecossistema localmente. O Docker Compose faz todo o trabalho pesado:
- build das imagens
- orquestração dos microfrontends e backend
- healthchecks
- hot reload via volumes

Essa abordagem garante um ambiente local consistente, escalável e isolado de variações de máquina.


