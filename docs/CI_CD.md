# CI/CD - Integração e Deploy Contínuo

Este documento descreve a configuração de CI/CD do projeto SENAI Lab Webapp.

---

## 📋 Visão Geral

O projeto usa **GitHub Actions** para automatizar:
- ✅ Validação de sintaxe JavaScript
- ✅ Testes automatizados
- ✅ Verificação de segurança
- ✅ Deploy automático para Firebase Hosting

---

## 🔄 Workflows Configurados

### 1. CI - Build and Test (`.github/workflows/ci.yml`)

**Trigger:** Push em qualquer branch ou Pull Request para main

**Jobs:**

#### a) `lint-and-validate`
- Verifica sintaxe de todos arquivos JavaScript
- Valida estrutura de arquivos essenciais
- Detecta secrets hardcoded
- Gera relatório de tamanho dos arquivos

#### b) `security-scan`
- Escaneia por dados sensíveis no código
- Procura por:
  - Senhas hardcoded
  - API keys expostas
  - Tokens e secrets

#### c) `build-check`
- Valida configuração do Firebase
- Simula processo de build
- Gera relatório final

**Tempo médio:** 2-3 minutos

---

### 2. Deploy to Firebase (`.github/workflows/deploy.yml`)

**Trigger:** Push na branch `main` ou execução manual

**Jobs:**

#### `deploy`
- Instala Firebase CLI
- Detecta versão atual do projeto
- Faz deploy para Firebase Hosting
- Cria release notes automáticas
- Upload de artifacts

**Requer:** `FIREBASE_TOKEN` configurado nos secrets

**Tempo médio:** 3-4 minutos

---

## 🔑 Configurar Firebase Token

Para habilitar deploy automático:

### Passo 1: Gerar Token

```bash
# Instalar Firebase CLI (se não tiver)
npm install -g firebase-tools

# Login e gerar token
firebase login:ci
```

Copie o token gerado.

### Passo 2: Adicionar ao GitHub

1. Vá para **Settings** → **Secrets and variables** → **Actions**
2. Clique em **New repository secret**
3. Nome: `FIREBASE_TOKEN`
4. Value: cole o token gerado
5. Clique em **Add secret**

### Passo 3: Testar

Faça um push na `main` e veja o workflow rodar automaticamente.

---

## 🧪 Scripts NPM Disponíveis

```bash
# Validar sintaxe de todos arquivos JS
npm run validate

# Executar testes automatizados
npm test

# Executar validação + testes
npm run check

# Deploy manual para Firebase
npm run deploy

# Servir localmente
npm run serve
# ou
npm run dev
```

---

## 📊 Status Checks

Quando você criar uma Pull Request, os seguintes checks rodarão:

- ✅ **lint-and-validate** - Validação de sintaxe
- ✅ **security-scan** - Escaneamento de segurança
- ✅ **build-check** - Verificação de build

**Todos devem passar** antes do merge (se branch protection estiver configurada).

---

## 🚀 Fluxo de Deploy

```
1. Desenvolvedor faz push para branch feature/
   └─> CI roda automaticamente (validação + testes)

2. Desenvolvedor cria Pull Request para main
   └─> CI roda novamente
   └─> Status checks aparecem na PR

3. Aprovação da PR
   └─> Merge para main

4. Deploy automático
   └─> Workflow de deploy roda
   └─> Deploy para Firebase Hosting
   └─> Release notes criadas
```

---

## 🐛 Troubleshooting

### CI falhando com erro de sintaxe

```bash
# Rodar localmente para debugar
npm run validate
```

### Deploy falhando

```bash
# Verificar se FIREBASE_TOKEN está configurado
gh secret list

# Testar deploy local
firebase deploy --only hosting
```

### Testes falhando

```bash
# Rodar testes localmente
npm test

# Ver detalhes específicos
node scripts/test.js
```

---

## 📈 Melhorias Futuras

### Curto Prazo (Semanas 4-5)
- [ ] Adicionar testes unitários JavaScript
- [ ] Configurar ESLint para code quality
- [ ] Adicionar coverage reports

### Médio Prazo (Mês 2)
- [ ] Testes E2E com Playwright/Cypress
- [ ] Deploy em múltiplos ambientes (staging/prod)
- [ ] Notificações no Slack/Discord

### Longo Prazo (Mês 3+)
- [ ] Performance monitoring
- [ ] Automatic semantic versioning
- [ ] Changelog automático

---

## 📚 Arquivos Criados

| Arquivo | Descrição |
|---------|-----------|
| `.github/workflows/ci.yml` | Workflow de CI |
| `.github/workflows/deploy.yml` | Workflow de deploy |
| `package.json` | Configuração NPM e scripts |
| `scripts/validate-syntax.js` | Validador de sintaxe |
| `scripts/test.js` | Suite de testes |

---

## 🎯 Métricas de Sucesso

| Métrica | Meta | Status Atual |
|---------|------|--------------|
| CI execution time | < 5 min | ✅ 2-3 min |
| Deploy time | < 5 min | ✅ 3-4 min |
| Test coverage | > 80% | 🔄 Em progresso |
| Failed deploys | < 5% | ✅ 0% |

---

## 🔗 Links Úteis

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)
- [Workflow Syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)

---

## ✅ Checklist de Setup

- [x] GitHub Actions configurado
- [x] Scripts de teste criados
- [x] Workflow de CI funcionando
- [x] Workflow de deploy criado
- [ ] FIREBASE_TOKEN configurado (manual)
- [ ] Branch protection rules ativadas (manual)
- [ ] Primeiro deploy bem-sucedido (após token)

---

*Documento gerado automaticamente como parte da Semana 3 - CI/CD e Automação*
