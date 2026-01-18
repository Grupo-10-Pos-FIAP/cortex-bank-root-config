# Deploy Automático na Vercel - Cortex Bank Microfrontends

Este guia explica como configurar o deploy automático de todos os microfrontends na Vercel usando GitHub Actions e integração direta com o GitHub.

## 📋 Pré-requisitos

1. Conta na [Vercel](https://vercel.com)
2. Repositórios públicos no GitHub para cada microfrontend
3. Acesso de administrador aos repositórios

## 🏗️ Estrutura dos Microfrontends

Os seguintes microfrontends precisam ser deployados:

| Microfrontend     | Repositório                   | URL Vercel (exemplo)                               |
| ----------------- | ----------------------------- | -------------------------------------------------- |
| root-config       | cortex-bank-root-config       | `https://cortex-bank-root-config.vercel.app`       |
| auth              | cortex-bank-auth              | `https://cortex-bank-auth.vercel.app`              |
| navigation-drawer | cortex-bank-navigation-drawer | `https://cortex-bank-navigation-drawer.vercel.app` |
| dashboard         | cortex-bank-dashboard         | `https://cortex-bank-dashboard.vercel.app`         |
| transactions      | cortex-bank-transactions      | `https://cortex-bank-transactions.vercel.app`      |
| statement         | cortex-bank-statement         | `https://cortex-bank-statement.vercel.app`         |

## 🚀 Passo a Passo do Deploy

### 1. Conectar Repositórios na Vercel

Para cada microfrontend, siga estes passos:

1. Acesse [vercel.com](https://vercel.com) e faça login
2. Clique em **"Add New..."** → **"Project"**
3. Importe o repositório do GitHub correspondente
4. Configure o projeto:
   - **Framework Preset**: Other
   - **Root Directory**: `./` (raiz do repositório)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### 2. Configurar Variáveis de Ambiente

#### 2.1 Variáveis do Root-Config

⚠️ **IMPORTANTE:** As variáveis abaixo são **OBRIGATÓRIAS** em produção. O build irá falhar se elas não estiverem configuradas.

No projeto **root-config**, adicione as seguintes variáveis de ambiente:

```
MF_URL_ROOT_CONFIG=https://cortex-bank-root-config.vercel.app
MF_URL_NAVIGATION_DRAWER=https://cortex-bank-navigation-drawer.vercel.app
MF_URL_DASHBOARD=https://cortex-bank-dashboard.vercel.app
MF_URL_TRANSACTIONS=https://cortex-bank-transactions.vercel.app
MF_URL_STATEMENT=https://cortex-bank-statement.vercel.app
MF_URL_AUTH=https://cortex-bank-auth.vercel.app
```

**Como adicionar variáveis de ambiente:**

**Na Vercel:**

1. No dashboard da Vercel, vá em **Settings** → **Environment Variables**
2. Adicione cada variável acima (substitua pelas suas URLs reais de produção)
3. Selecione os ambientes: **Production**, **Preview**, e **Development**

**Em outras plataformas (Netlify, AWS, etc.):**

- Configure as mesmas variáveis `MF_URL_*` no painel de variáveis de ambiente da plataforma

🔒 **Segurança:** URLs não devem ser hardcoded no código. Sempre use variáveis de ambiente para facilitar mudanças e evitar exposição de informações sensíveis.

🌐 **Portabilidade:** Os nomes das variáveis (`MF_URL_*`) são genéricos e funcionam em qualquer plataforma de deploy, não apenas Vercel.

#### 2.2 Variáveis de Backend (URL da API)

Cada microfrontend precisa conhecer a URL do backend de produção. Configure as seguintes variáveis:

**Para o módulo Auth:**

```
REACT_APP_API_URL=https://seu-backend-producao.com
REACT_APP_REDIRECT_URL=https://cortex-bank-root-config.vercel.app/dashboard
```

**Para os módulos Dashboard, Navigation Drawer, Statement e Transactions:**

```
API_BASE_URL=https://seu-backend-producao.com
```

**Importante:** Substitua `https://seu-backend-producao.com` pela URL real do seu backend.

📚 **Para mais detalhes sobre configuração do backend, consulte:** [backend_url_config.md](./backend_url_config.md)

### 3. Ordem de Deploy

**Importante:** Deploy os microfrontends individuais primeiro, depois o root-config:

1. ✅ Deploy `auth`
2. ✅ Deploy `navigation-drawer`
3. ✅ Deploy `dashboard`
4. ✅ Deploy `transactions`
5. ✅ Deploy `statement`
6. ✅ Deploy `root-config` (por último, pois depende das URLs dos outros)

### 4. Verificar Deploy

Após cada deploy, verifique:

1. Acesse a URL do projeto na Vercel
2. Verifique se o arquivo `.js` principal está acessível:
   - Exemplo: `https://cortex-bank-auth.vercel.app/cortex-bank-auth.js`
3. Verifique os headers de segurança no DevTools → Network

## 🔒 Segurança Implementada

Todos os microfrontends incluem os seguintes headers de segurança:

### Headers Aplicados

- **X-Content-Type-Options**: `nosniff` - Previne MIME type sniffing
- **X-Frame-Options**: `DENY` - Previne clickjacking
- **X-XSS-Protection**: `1; mode=block` - Proteção XSS
- **Referrer-Policy**: `strict-origin-when-cross-origin` - Controla informações de referrer
- **Permissions-Policy**: Restringe geolocation, microphone, camera
- **Content-Security-Policy**: Política de segurança de conteúdo (apenas root-config)
- **CORS**: Configurado para permitir acesso cross-origin dos arquivos JS

### Cache Strategy

- **Arquivos JS/MJS**: Cache de 1 ano (immutable) - ideal para versionamento
- **Arquivos HTML**: Sem cache (must-revalidate) - sempre buscar versão mais recente

## 🔄 Deploy Automático

O deploy automático é ativado por padrão quando você conecta um repositório do GitHub à Vercel:

- ✅ **Push para `main`/`master`**: Deploy em produção
- ✅ **Pull Requests**: Deploy de preview
- ✅ **Branches**: Deploy de preview automático

### Desabilitar Deploy Automático (se necessário)

Se precisar desabilitar temporariamente:

1. Vá em **Settings** → **Git**
2. Desabilite **"Automatic deployments from Git"**

## 📝 Configuração dos Arquivos

### vercel.json

Cada microfrontend possui um arquivo `vercel.json` com:

- Configurações de build
- Headers de segurança
- Configurações de cache
- CORS para arquivos JavaScript

### .vercelignore

Arquivo que exclui arquivos desnecessários do deploy:

- `node_modules`
- Arquivos de desenvolvimento
- Documentação (exceto README.md)
- Arquivos Docker

## 🐛 Troubleshooting

### Problema: Arquivo JS não encontrado (404)

**Solução:**

1. Verifique se o build foi bem-sucedido
2. Verifique se o arquivo está em `dist/`
3. Verifique o nome do arquivo no `package.json` (campo `name`)

### Problema: CORS Error

**Solução:**

1. Verifique se os headers CORS estão configurados no `vercel.json`
2. Verifique se a URL está correta no import map do root-config

### Problema: Import Map não funciona

**Solução:**

1. Verifique se todas as URLs dos microfrontends estão corretas
2. Verifique se as variáveis de ambiente estão configuradas no root-config
3. Verifique o console do navegador para erros de carregamento

### Problema: Build falha

**Solução:**

1. Verifique os logs de build na Vercel
2. Execute o build localmente: `npm run build`
3. Verifique se todas as dependências estão no `package.json`

## 🔗 URLs de Produção

Após o deploy, atualize as URLs no `root-config` se necessário:

1. Acesse o dashboard da Vercel
2. Copie a URL de cada projeto
3. Atualize as variáveis de ambiente no root-config
4. Faça um novo deploy do root-config

## 📚 Recursos Adicionais

- [Documentação da Vercel](https://vercel.com/docs)
- [Vercel CLI](https://vercel.com/docs/cli) - Para deploy via linha de comando
- [Headers de Segurança](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers)

## ✅ Checklist de Deploy

- [ ] Todos os repositórios estão conectados à Vercel
- [ ] Build de cada microfrontend está funcionando
- [ ] Variáveis de ambiente configuradas no root-config
- [ ] Headers de segurança verificados
- [ ] CORS configurado corretamente
- [ ] Import maps atualizados com URLs corretas
- [ ] Domínios customizados configurados (opcional)

---

**Nota:** Este guia assume que você está usando os nomes padrão dos repositórios. Ajuste as URLs conforme seus nomes reais de projeto na Vercel.
