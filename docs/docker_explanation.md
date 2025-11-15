# Documentação de Estrutura Docker para Microfrontends

Este documento explica, de forma objetiva e detalhada, a função de cada linha do **Dockerfile** e do **docker-compose** utilizados na arquitetura de microfrontends.

---

## 🌐 Dockerfile — Explicação Linha a Linha

```dockerfile
FROM node:22-alpine
WORKDIR /app

RUN apk add --no-cache curl

COPY package*.json ./
RUN npm install

COPY . .

ENV NODE_ENV=development
ENV CHOKIDAR_USEPOLLING=true

EXPOSE 3001
CMD ["npm", "start", "--", "--host", "0.0.0.0"]
```

### **1. `FROM node:22-alpine`**
Define a imagem base. Usa Node 22 (compatível com ESM moderno) e Alpine (leve e rápida).

### **2. `WORKDIR /app`**
Define o diretório onde tudo será executado dentro do container.

### **3. `RUN apk add --no-cache curl`**
Instala o curl para ser usado no healthcheck

### **4. `COPY package*.json ./`**
Copia apenas os arquivos de dependências (`package.json` e `package-lock.json`). Isso habilita o cache de camadas do Docker.

### **5. `RUN npm install`**
Instala as dependências, usando o cache sempre que possível.

### **6. `COPY . .`**
Copia o restante do projeto para o container.

### **7. `ENV NODE_ENV=development`**
Força o modo de desenvolvimento.

### **8. `ENV CHOKIDAR_USEPOLLING=true`**
Garante que os watchers (webpack-dev-server) funcionem corretamente no Windows.

### **9. `EXPOSE 3001`**
Documenta a porta que o container expõe.

### **10. `CMD [...]`**
Define o comando de inicialização. O parâmetro `--host 0.0.0.0` permite acesso externo ao dev server.

---

## 🐳 docker-compose — Explicação Detalhada

### Exemplo de serviço:

```yaml
services:
  navigation-drawer:
    build:
      context: ../navigation-drawer
    volumes:
      - ../navigation-drawer/src:/app/src
      - ../navigation-drawer/public:/app/public
      - navigation-drawer-node-modules:/app/node_modules
    ports:
      - "3001:3001"
    networks:
      - cortex-bank-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001"]
      interval: 15s
      timeout: 10s
      retries: 10
      start_period: 300s
```

### **1. `build:`**
Instrui o Docker a construir a imagem usando o Dockerfile do microfrontend.

### **2. `context:`**
Diretório que contém o código do microfrontend.

### **3. `volumes:`**
Montagens otimizadas:
- Apenas `src` e `public` são sincronizados (alta performance).
- `node_modules` é volume nomeado, garantindo persistência e não sendo sobrescrito.

### **4. `ports:`**
Expõe a porta interna do container para o host.

### **5. `networks:`**
Coloca todos os serviços na mesma rede lógica.

### **6. `healthcheck:`**
Garante que o root-config só suba após os MFEs estarem realmente disponíveis.

### **7. `depends_on:`** (no root-config)
Controla a ordem de inicialização dos serviços.

### **8. `volumes:` globais**
Define volumes nomeados para armazenar `node_modules`.

---

## 💡 Resumo Executivo

- O Dockerfile é otimizado para desenvolvimento: leve, rápido e com cache.
- O docker-compose garante rebuild rápido, healthchecks estáveis e sincronização eficiente.
- A arquitetura foi projetada para suportar múltiplos microfrontends sem penalizar performance.

---
