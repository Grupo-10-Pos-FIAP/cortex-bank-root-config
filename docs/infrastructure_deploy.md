# Infraestrutura e Deploy - Cortex Bank

Este documento detalha a arquitetura de infraestrutura, estratégias de deploy e configuração de ambientes do projeto **Cortex Bank**.

---

## Arquitetura de Infraestrutura

O projeto **Cortex Bank** utiliza uma arquitetura distribuída com separação clara entre frontend e backend, garantindo escalabilidade, segurança e manutenibilidade.

### Frontend - Hospedagem na Vercel

Todos os microfrontends (root-config, auth, navigation-drawer, dashboard, transactions e statement) estão hospedados na plataforma **Vercel**, uma solução moderna de hospedagem e deploy para aplicações frontend.

**Características da Hospedagem:**

- **CDN Global**: Distribuição automática através de uma rede de CDN mundialmente distribuída
- **SSL/TLS Automático**: Certificados HTTPS gerenciados automaticamente
- **Edge Functions**: Capacidade de executar funções serverless na borda da rede
- **Build Otimizado**: Builds otimizados automaticamente para produção
- **Preview Deployments**: Deploys de preview automáticos para Pull Requests

### Variáveis de Ambiente na Vercel

**⚠️ Importante - Segurança de Variáveis de Ambiente:**

As variáveis de ambiente em produção são gerenciadas exclusivamente através do painel da Vercel, garantindo que informações sensíveis nunca sejam expostas no código-fonte ou versionadas no Git.

**Configuração de Variáveis:**

1. **Ambiente de Desenvolvimento Local**: 
   - Utiliza arquivo `.env` local (não versionado no Git)
   - Arquivo `.env` está incluído no `.gitignore` para prevenir commits acidentais
   - Usado apenas para desenvolvimento local

2. **Ambiente de Produção (Vercel)**:
   - Variáveis configuradas no painel da Vercel (Settings → Environment Variables)
   - Variáveis são injetadas durante o build e runtime
   - Acesso restrito apenas a membros autorizados do projeto
   - Criptografia em repouso e em trânsito

**Variáveis Configuradas na Vercel:**

- `MF_URL_ROOT_CONFIG`: URL do root-config em produção
- `MF_URL_NAVIGATION_DRAWER`: URL do microfrontend de navegação
- `MF_URL_DASHBOARD`: URL do microfrontend de dashboard
- `MF_URL_TRANSACTIONS`: URL do microfrontend de transações
- `MF_URL_STATEMENT`: URL do microfrontend de extrato
- `MF_URL_AUTH`: URL do microfrontend de autenticação
- `API_BASE_URL`: URL base da API backend
- `REACT_APP_API_URL`: URL da API para módulos React
- `REACT_APP_REDIRECT_URL`: URL de redirecionamento após autenticação

**Boas Práticas Implementadas:**

- ✅ Nenhuma variável sensível no código-fonte
- ✅ Separação clara entre ambientes (dev/prod)
- ✅ Rotação de credenciais sem necessidade de alterar código
- ✅ Acesso restrito às variáveis de ambiente (gerenciado pela plataforma Vercel)

### CI/CD - Deploy Automático

O projeto implementa **Continuous Integration e Continuous Deployment (CI/CD)** através da integração entre GitHub e Vercel.

**Fluxo de Deploy Automático:**

1. **Trigger**: Quando um commit é realizado na branch `main` do repositório GitHub
2. **Build**: A Vercel detecta automaticamente o push e inicia o processo de build
3. **Testes**: Execução automática de testes (se configurados)
4. **Deploy**: Após build bem-sucedido, o deploy é realizado automaticamente
5. **Notificação**: Status do deploy é reportado no GitHub (via commit status)

**Vantagens do CI/CD Implementado:**

- ✅ **Deploy Automático**: Reduz erros manuais e acelera o ciclo de desenvolvimento
- ✅ **Consistência**: Garante que cada deploy segue o mesmo processo
- ✅ **Rastreabilidade**: Cada deploy está vinculado a um commit específico
- ✅ **Rollback Rápido**: Possibilidade de reverter para versões anteriores facilmente
- ✅ **Preview Deployments**: Pull Requests recebem URLs de preview automaticamente

**Configuração do CI/CD:**

- Integração GitHub → Vercel configurada via dashboard da Vercel
- GitHub Actions configurado para validações adicionais (ver `.github/workflows/`)
- Deploy automático habilitado para branch `main`
- Preview deployments habilitados para Pull Requests

### Backend - Hospedagem no Coolify via Hostinger

O backend da aplicação está hospedado na plataforma **Coolify**, que por sua vez está hospedada em infraestrutura da **Hostinger**.

**Coolify - Plataforma de Deploy:**

- **Self-hosted Platform**: Plataforma open-source para gerenciamento de aplicações
- **Container-based**: Utiliza Docker para isolamento e portabilidade
- **CI/CD Integrado**: Suporte nativo para integração com Git
- **Gerenciamento de Recursos**: Monitoramento de CPU, memória e rede

**Hostinger - Infraestrutura:**

- **Servidor Dedicado/VPS**: Infraestrutura robusta e escalável
- **Alta Disponibilidade**: Uptime garantido para aplicações críticas
- **Backup Automático**: Sistema de backup configurado
- **Monitoramento**: Ferramentas de monitoramento e alertas

### Variáveis de Ambiente no Coolify

**🔒 Segurança das Variáveis de Ambiente do Backend:**

As variáveis de ambiente do backend são gerenciadas exclusivamente através do painel do Coolify, seguindo as mesmas práticas de segurança aplicadas no frontend.

**Configuração:**

1. **Acesso Restrito**: Apenas administradores autorizados têm acesso ao painel do Coolify
2. **Criptografia**: Variáveis são armazenadas de forma criptografada pela plataforma
3. **Isolamento**: Variáveis são injetadas apenas no ambiente de execução do container
4. **Gerenciamento Seguro**: A plataforma Coolify gerencia o acesso e armazenamento das variáveis de forma segura

**Variáveis Configuradas no Coolify:**

- `MONGODB_URI`: String de conexão com o MongoDB Cloud
- `JWT_SECRET`: Chave secreta para assinatura de tokens JWT
- `JWT_EXPIRES_IN`: Tempo de expiração dos tokens
- `NODE_ENV`: Ambiente de execução (production)
- `PORT`: Porta de execução da aplicação
- `CORS_ORIGIN`: Origens permitidas para requisições CORS
- Outras variáveis específicas da aplicação

**Boas Práticas de Segurança Implementadas:**

- ✅ Credenciais nunca versionadas no Git
- ✅ Rotação periódica de chaves e secrets
- ✅ Uso de secrets management adequado (via Coolify)
- ✅ Backup seguro das configurações

### Banco de Dados - MongoDB Cloud

O banco de dados utilizado é o **MongoDB Cloud** (anteriormente MongoDB Atlas), uma solução de banco de dados NoSQL gerenciada na nuvem.

**Características do MongoDB Cloud:**

- **Database as a Service (DBaaS)**: Gerenciamento completo pela MongoDB
- **Alta Disponibilidade**: Replicação automática e failover
- **Escalabilidade**: Escala horizontal automática conforme demanda
- **Backup Automático**: Backups contínuos e point-in-time recovery
- **Segurança**: Criptografia em trânsito e em repouso
- **Monitoramento**: Dashboard de monitoramento e alertas

**Configuração de Segurança:**

- **Network Access Control**: Apenas IPs autorizados podem acessar o cluster
- **Database Users**: Usuários com permissões específicas e limitadas
- **Connection String**: String de conexão criptografada armazenada no Coolify
- **Logs e Monitoramento**: Dashboard nativo do MongoDB Cloud para monitoramento e logs

**Estrutura de Dados:**

- **Collections**: Organização lógica dos dados em coleções
- **Indexes**: Índices otimizados para performance de consultas
- **Validation Rules**: Regras de validação de schema para integridade dos dados

## Diagrama de Infraestrutura

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Vercel)                        │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ root-    │  │   auth   │  │dashboard │  │transac-  │   │
│  │ config   │  │          │  │          │  │tions     │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                              │
│  ┌──────────┐  ┌──────────┐                               │
│  │navigation│  │statement │                               │
│  │-drawer   │  │          │                               │
│  └──────────┘  └──────────┘                               │
│                                                              │
│  • CI/CD: GitHub → Vercel (auto-deploy on main)            │
│  • Variáveis: Gerenciadas no painel Vercel                 │
│  • SSL/TLS: Automático                                     │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              BACKEND (Coolify via Hostinger)                │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────┐   │
│  │         API REST (Node.js + Express)                 │   │
│  │  • Porta: 8080                                      │   │
│  │  • Container: Docker                                │   │
│  │  • Variáveis: Gerenciadas no Coolify                │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  • CI/CD: GitHub → Coolify (auto-deploy on main)           │
│  • Monitoramento: CPU, Memória, Rede                       │
│  • Backup: Automático                                      │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ MongoDB Connection String
                            │ (Criptografada)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              BANCO DE DADOS (MongoDB Cloud)                 │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────┐   │
│  │              MongoDB Atlas Cluster                   │   │
│  │  • Replicação: Automática                            │   │
│  │  • Backup: Contínuo                                 │   │
│  │  • Segurança: Network ACL + Encryption              │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Documentação Relacionada

- 📖 **[Guia Completo de Deploy na Vercel](./vercel_deploy.md)** - Instruções detalhadas, configuração de segurança, troubleshooting e mais.
- 🔒 **[Documentação de Segurança](./security.md)** - Medidas de segurança implementadas em todas as camadas da arquitetura.

---

**Última atualização**: Este documento reflete a arquitetura atual do projeto Cortex Bank.
