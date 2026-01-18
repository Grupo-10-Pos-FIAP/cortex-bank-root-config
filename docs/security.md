# Segurança - Cortex Bank

A segurança é uma preocupação fundamental em todas as camadas da arquitetura do **Cortex Bank**. Este documento detalha as medidas de segurança implementadas em cada componente do sistema.

---

## Segurança no Frontend (Vercel)

### Headers de Segurança HTTP

Todos os microfrontends implementam headers de segurança HTTP para proteger contra vulnerabilidades comuns:

**Headers Implementados:**

- **X-Content-Type-Options: `nosniff`**
  - Previne MIME type sniffing, forçando o navegador a respeitar o Content-Type declarado
  - Protege contra ataques de execução de código malicioso

- **X-Frame-Options: `DENY`**
  - Previne que a página seja carregada em frames (iframe, embed, object)
  - Protege contra ataques de clickjacking

- **X-XSS-Protection: `1; mode=block`**
  - Ativa a proteção XSS do navegador
  - Bloqueia automaticamente scripts maliciosos detectados

- **Referrer-Policy: `strict-origin-when-cross-origin`**
  - Controla quais informações de referrer são enviadas em requisições
  - Protege privacidade e previne vazamento de informações sensíveis

- **Permissions-Policy**
  - Restringe acesso a APIs sensíveis (geolocation, microphone, camera)
  - Previne acesso não autorizado a recursos do dispositivo

- **Content-Security-Policy (CSP)**
  - Política de segurança de conteúdo restritiva
  - Controla quais recursos podem ser carregados (scripts, styles, fonts, etc.)
  - Implementada no root-config para proteger toda a aplicação

### CORS (Cross-Origin Resource Sharing)

**Configuração de CORS:**

- CORS configurado para permitir acesso cross-origin apenas dos arquivos JavaScript dos microfrontends
- Origens permitidas são restritas e configuradas via variáveis de ambiente
- Headers CORS configurados para permitir apenas métodos HTTP necessários (GET, POST, etc.)

### Proteção de Variáveis de Ambiente

**Práticas Implementadas:**

- ✅ **Nunca versionar `.env`**: Arquivo `.env` está no `.gitignore`
- ✅ **Variáveis na Vercel**: Todas as variáveis de produção gerenciadas no painel da Vercel
- ✅ **Sem hardcoding**: Nenhuma credencial ou URL sensível no código-fonte
- ✅ **Separação de ambientes**: Variáveis diferentes para dev, staging e produção
- ✅ **Acesso restrito**: Apenas membros autorizados têm acesso às variáveis na Vercel

### Proteção contra Vulnerabilidades Comuns

**OWASP Top 10 - Mitigações Implementadas:**

1. **Injection**: Validação e sanitização de inputs no backend
2. **Broken Authentication**: JWT com expiração e refresh tokens
3. **Sensitive Data Exposure**: HTTPS obrigatório, variáveis de ambiente seguras
4. **XML External Entities (XXE)**: Não aplicável (não usa XML)
5. **Broken Access Control**: Controle de acesso baseado em roles no backend
6. **Security Misconfiguration**: Headers de segurança configurados corretamente
7. **Cross-Site Scripting (XSS)**: CSP e sanitização de inputs
8. **Insecure Deserialization**: Validação de dados recebidos
9. **Using Components with Known Vulnerabilities**: Dependências atualizadas regularmente
10. **Insufficient Logging & Monitoring**: Logs estruturados e monitoramento

---

## Segurança no Backend (Coolify)

### Gerenciamento de Variáveis de Ambiente

**Práticas de Segurança:**

- **Armazenamento Criptografado**: Variáveis armazenadas de forma criptografada no Coolify
- **Acesso Restrito**: Apenas administradores autorizados têm acesso ao painel do Coolify
- **Injeção Segura**: Variáveis injetadas apenas no ambiente de execução do container
- **Gerenciamento pela Plataforma**: O Coolify gerencia o armazenamento e acesso às variáveis de forma segura
- **Rotação de Credenciais**: Processo estabelecido para rotação periódica de chaves e secrets

### Autenticação e Autorização

**JWT (JSON Web Tokens):**

- Tokens assinados com chave secreta forte (armazenada no Coolify)
- Expiração configurável de tokens
- Refresh tokens para renovação segura
- Validação de assinatura em todas as requisições autenticadas

**Controle de Acesso:**

- Middleware de autenticação em todas as rotas protegidas
- Validação de tokens JWT em todas as requisições autenticadas

### Proteção de API

**Medidas Implementadas:**

- **HTTPS Obrigatório**: Todas as comunicações via HTTPS
- **CORS Configurado**: Origens permitidas restritas e configuráveis
- **Input Validation**: Validação rigorosa de todos os inputs
- **NoSQL Injection Prevention**: Uso de ODM (Mongoose) com queries parametrizadas

---

## Segurança no Banco de Dados (MongoDB Cloud)

### Network Security

**Network Access Control:**

- Apenas IPs autorizados podem acessar o cluster MongoDB
- Whitelist de IPs configurada (incluindo IP do servidor Coolify)
- Bloqueio de acesso público não autorizado

### Database Security

**Autenticação:**

- Usuários de banco de dados com permissões específicas e limitadas
- Princípio do menor privilégio aplicado
- Senhas fortes e rotacionadas periodicamente

**Criptografia:**

- **Em Trânsito**: TLS/SSL obrigatório para todas as conexões
- **Em Repouso**: Criptografia de dados armazenados habilitada
- **Connection String**: Armazenada de forma segura no Coolify

### Backup e Recuperação

- **Backups Automáticos**: Backups contínuos configurados
- **Point-in-Time Recovery**: Capacidade de restaurar para qualquer ponto no tempo
- **Backup Seguro**: Backups armazenados de forma criptografada

---

## Segurança na Comunicação

### HTTPS/TLS

- **Certificados SSL/TLS**: Gerenciados automaticamente pela Vercel (frontend)
- **TLS 1.2+**: Versões modernas e seguras do protocolo
- **HSTS**: HTTP Strict Transport Security configurado

### Comunicação Frontend-Backend

- Todas as requisições via HTTPS
- Tokens JWT transmitidos em headers HTTP seguros
- Validação de origem das requisições (CORS)

### Comunicação Backend-Database

- Connection string criptografada
- Conexão via TLS/SSL obrigatória
- Validação de certificados

---

## Monitoramento e Logging

### Health Check

O backend implementa um endpoint de health check (`/health`) que permite verificar a disponibilidade da aplicação:

- Retorna status da aplicação
- Útil para monitoramento básico e deploy
- Endpoint público para verificação de saúde do serviço

### Logging Básico

- **Console Logs**: Utilização de `console.log` padrão do Node.js para logs básicos
- **Logs da Plataforma**: O Coolify fornece monitoramento básico de recursos (CPU, memória, rede) através de sua interface
- **MongoDB Cloud**: A plataforma MongoDB Cloud oferece logs e monitoramento nativos através de seu dashboard

**Nota**: O projeto não implementa sistemas avançados de logging estruturado, audit logs ou monitoramento de performance. O monitoramento é feito principalmente através das plataformas de hospedagem (Coolify e MongoDB Cloud).

---

## Compliance e Boas Práticas

### Padrões Seguidos

- **OWASP Top 10**: Mitigações implementadas para as principais vulnerabilidades

### Processo de Segurança

- **Code Review**: Revisão de código antes de merge
- **Dependency Updates**: Atualização regular de dependências

---

## Checklist de Segurança

### Frontend

- ✅ Headers de segurança HTTP configurados
- ✅ CORS restrito e configurado corretamente
- ✅ Variáveis de ambiente gerenciadas na Vercel
- ✅ HTTPS obrigatório
- ✅ CSP implementado
- ✅ Sem credenciais no código-fonte

### Backend

- ✅ Variáveis de ambiente no Coolify
- ✅ Autenticação JWT implementada
- ✅ Validação de inputs
- ✅ Health check endpoint
- ✅ HTTPS obrigatório
- ✅ CORS configurado e restrito

### Banco de Dados

- ✅ Network Access Control configurado
- ✅ Criptografia em trânsito e em repouso
- ✅ Usuários com permissões limitadas
- ✅ Backups automáticos
- ✅ Connection string segura

### Infraestrutura

- ✅ CI/CD seguro
- ✅ Monitoramento básico via Coolify (CPU, memória, rede)
- ✅ Health check endpoint
- ✅ Backup automático do MongoDB Cloud

---

## Documentação Relacionada

- 🏗️ **[Infraestrutura e Deploy](./infrastructure_deploy.md)** - Detalhes sobre a arquitetura de infraestrutura e processos de deploy.
- 📖 **[Guia de Deploy na Vercel](./vercel_deploy.md)** - Instruções detalhadas de deploy e configuração.

---

**Última atualização**: Este documento reflete as práticas de segurança atuais do projeto Cortex Bank.
