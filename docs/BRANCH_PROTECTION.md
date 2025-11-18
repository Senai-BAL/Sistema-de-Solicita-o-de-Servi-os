# Branch Protection Rules - SENAI Lab Webapp

Este documento descreve as regras de proteção de branch recomendadas para o projeto.

---

## 🎯 Objetivo

Proteger a branch `main` contra commits acidentais, garantir qualidade do código através de revisões e testes automatizados.

---

## 🔒 Regras Recomendadas para a Branch `main`

### 1. Require Pull Request Before Merging

**Status:** ✅ Recomendado
**Configuração:**
- ☑️ Require approvals: **1 approval**
- ☑️ Dismiss stale pull request approvals when new commits are pushed
- ☑️ Require review from Code Owners (opcional)

**Por quê?**
- Garante revisão de código por pelo menos uma pessoa
- Evita commits diretos na main
- Melhora qualidade e compartilhamento de conhecimento

---

### 2. Require Status Checks to Pass

**Status:** ✅ Recomendado
**Configuração:**
- ☑️ Require branches to be up to date before merging
- ☑️ Status checks required:
  - `lint-and-validate` (do workflow ci.yml)
  - `security-scan` (do workflow ci.yml)
  - `build-check` (do workflow ci.yml)

**Por quê?**
- Garante que código passa nos testes automatizados
- Previne merge de código com erros de sintaxe
- Valida segurança básica antes do merge

---

### 3. Require Conversation Resolution

**Status:** ✅ Recomendado
**Configuração:**
- ☑️ Require conversation resolution before merging

**Por quê?**
- Garante que todos os comentários de revisão foram endereçados
- Evita merge de PRs com questões pendentes

---

### 4. Require Linear History

**Status:** ⚠️ Opcional
**Configuração:**
- ☐ Require linear history (usar Squash merge ou Rebase merge)

**Por quê?**
- Mantém histórico limpo e linear
- Facilita navegação no git log
- **Nota:** Se habilitado, use "Squash and merge" em PRs

---

### 5. Do Not Allow Force Pushes

**Status:** ✅ Recomendado
**Configuração:**
- ☑️ Do not allow force pushes

**Por quê?**
- Protege contra perda acidental de histórico
- Evita reescrever histórico público

---

### 6. Do Not Allow Deletions

**Status:** ✅ Recomendado
**Configuração:**
- ☑️ Do not allow deletions

**Por quê?**
- Protege contra deleção acidental da branch main

---

## 🚀 Como Configurar

### Opção 1: Via Interface Web do GitHub

1. Vá para **Settings** → **Branches**
2. Clique em **Add rule** (ou edite a regra existente)
3. Em **Branch name pattern**, digite: `main`
4. Marque as opções conforme descrito acima
5. Clique em **Create** ou **Save changes**

### Opção 2: Via GitHub CLI

```bash
# Exemplo de configuração via gh CLI
gh api repos/Senai-BAL/Sistema-de-Solicita-o-de-Servi-os/branches/main/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["lint-and-validate","security-scan","build-check"]}' \
  --field enforce_admins=false \
  --field required_pull_request_reviews='{"required_approving_review_count":1,"dismiss_stale_reviews":true}' \
  --field restrictions=null \
  --field required_linear_history=false \
  --field allow_force_pushes=false \
  --field allow_deletions=false \
  --field required_conversation_resolution=true
```

---

## 📋 Configuração Resumida

| Regra | Status | Configuração |
|-------|--------|--------------|
| Require PR before merge | ✅ Obrigatório | 1 approval mínimo |
| Require status checks | ✅ Obrigatório | lint, security, build |
| Conversation resolution | ✅ Obrigatório | Sim |
| Linear history | ⚠️ Opcional | Squash merge recomendado |
| Block force push | ✅ Obrigatório | Sim |
| Block deletion | ✅ Obrigatório | Sim |

---

## 🔄 Fluxo de Trabalho Recomendado

```
1. Criar branch a partir da main
   git checkout -b feature/nome-da-feature

2. Fazer alterações e commits
   git add .
   git commit -m "feat: descrição"

3. Push para o remoto
   git push origin feature/nome-da-feature

4. Criar Pull Request no GitHub
   - Preencher descrição
   - Adicionar reviewers
   - Aguardar status checks

5. Revisão de código
   - Reviewer analisa código
   - Comentários e sugestões
   - Aprovar quando OK

6. Merge (após aprovação + status checks)
   - Usar "Squash and merge" (recomendado)
   - Ou "Merge commit" se preferir manter histórico

7. Deletar branch após merge
   git branch -d feature/nome-da-feature
   git push origin --delete feature/nome-da-feature
```

---

## ⚠️ Exceções e Casos Especiais

### Quando usar "Merge without PR"?

**Nunca.** Mesmo administradores devem seguir o fluxo de PR.

### Hotfixes de emergência

1. Criar branch `hotfix/descricao`
2. Fazer fix
3. Criar PR marcada como "urgent"
4. Pedir aprovação rápida
5. Merge após aprovação

---

## 🧪 Testando as Regras

Após configurar, teste criando uma PR:

1. Tente fazer push direto na main (deve falhar)
2. Crie uma PR normal
3. Verifique se status checks rodam
4. Tente merge sem approval (deve bloquear)
5. Aprove e faça merge (deve funcionar)

---

## 📚 Referências

- [GitHub Branch Protection Rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/defining-the-mergeability-of-pull-requests/about-protected-branches)
- [GitHub Actions Status Checks](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/collaborating-on-repositories-with-code-quality-features/about-status-checks)

---

## 🔄 Histórico de Alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2025-11-18 | Criação inicial | Claude Code |

---

*Documento gerado automaticamente como parte da Semana 3 - CI/CD e Automação*
