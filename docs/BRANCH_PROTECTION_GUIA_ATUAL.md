# Guia Atualizado - Branch Protection (Interface Atual do GitHub)

Este guia mostra onde encontrar cada configuração na interface atual do GitHub.

---

## 🔍 Como Acessar

1. Vá para o repositório no GitHub
2. **Settings** (ícone de engrenagem)
3. Na barra lateral esquerda: **Branches** (seção "Code and automation")
4. Em "Branch protection rules", clique em **Add branch protection rule**
5. Em "Branch name pattern", digite: `main`

---

## ⚙️ Configurações Recomendadas

### 1. ✅ Require a pull request before merging

**Localização:** Primeira seção principal

**Opções a marcar:**
- ☑️ **Require a pull request before merging**
  - Ao marcar, abre sub-opções:
    - ☑️ **Require approvals**: selecione **1** no dropdown
    - ☑️ **Dismiss stale pull request approvals when new commits are pushed**

**Screenshot mental:**
```
☑️ Require a pull request before merging
   ├─ Required number of approvals before merging: [1▼]
   └─ ☑️ Dismiss stale pull request approvals when new commits are pushed
```

---

### 2. ✅ Require status checks to pass before merging

**Localização:** Logo abaixo de "Require a pull request"

**IMPORTANTE:** Esta opção só aparece **DEPOIS** que você executar workflows pelo menos uma vez!

**Como configurar:**

1. ☑️ **Require status checks to pass before merging**
2. ☑️ **Require branches to be up to date before merging**
3. Na caixa de busca "Search for status checks", digite:
   - `Lint e Validação` (aparecerá na lista após rodar o CI)
   - `Security Scan`
   - `Build Check`

**Se não aparecem os checks:**
- Isso é normal! Precisa rodar o workflow pelo menos 1 vez
- Como já rodamos (merge da PR #3), eles devem aparecer
- Se não aparecer, tente:
  1. Fazer um pequeno commit qualquer na main
  2. Aguardar CI rodar
  3. Voltar aqui e os checks aparecerão na busca

**Screenshot mental:**
```
☑️ Require status checks to pass before merging
   ├─ ☑️ Require branches to be up to date before merging
   └─ Status checks that are required:
      ├─ [Search for status checks...]
      ├─ ✓ Lint e Validação
      ├─ ✓ Security Scan
      └─ ✓ Build Check
```

---

### 3. ✅ Require conversation resolution before merging

**Localização:** Abaixo de "Require status checks"

**Opção:**
- ☑️ **Require conversation resolution before merging**

---

### 4. ⚠️ Do not allow bypassing the above settings

**Localização:** Mais abaixo na página

**Opção (OPCIONAL - depende se você é admin):**
- ☐ **Do not allow bypassing the above settings** (deixe desmarcado se você é o único admin e quer poder fazer override em emergências)

---

### 5. ❌ REMOVIDAS/RENOMEADAS - Opções que MUDARAM

#### A) "Do Not Allow Force Pushes"

**STATUS:** Esta opção foi **REMOVIDA da interface web** em 2024!

**Motivo:** Agora é controlada por permissões de repositório.

**Como configurar (alternativa):**
1. Vá em **Settings** → **Collaborators and teams**
2. Para cada colaborador/equipe:
   - Clique em **Manage access**
   - Defina role como **Write** (não **Admin**)
   - Usuários com role "Write" não podem fazer force push

**Ou via GitHub CLI:**
```bash
gh api repos/Senai-BAL/Sistema-de-Solicita-o-de-Servi-os/branches/main/protection \
  --method PUT \
  --field allow_force_pushes=false
```

---

#### B) "Do Not Allow Deletions"

**STATUS:** Esta opção foi **MOVIDA/RENOMEADA**!

**Nova localização:**
- Está em **Settings** → **General** (não em Branches!)
- Role até "Danger Zone"
- Procure por opções de proteção de branch

**OU** ela pode estar como:
- **Allow deletions** (invertido - DESMARQUE esta opção se existir)

**Via GitHub CLI (mais confiável):**
```bash
gh api repos/Senai-BAL/Sistema-de-Solicita-o-de-Servi-os/branches/main/protection \
  --method PUT \
  --field allow_deletions=false
```

---

## 🎯 Configuração Mínima Essencial (Interface Web Atual)

Se você só conseguir configurar via web, faça PELO MENOS isso:

```
☑️ Require a pull request before merging
   └─ Required approvals: 1

☑️ Require status checks to pass before merging
   └─ Status checks: Lint e Validação, Security Scan, Build Check

☑️ Require conversation resolution before merging
```

Isso já garante 80% da proteção!

---

## 🔧 Solução Completa Via GitHub CLI

Se a interface web não tiver todas as opções, use o CLI:

```bash
# Configuração completa via API
gh api repos/Senai-BAL/Sistema-de-Solicita-o-de-Servi-os/branches/main/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["Lint e Validação","Security Scan","Build Check"]}' \
  --field enforce_admins=false \
  --field required_pull_request_reviews='{"required_approving_review_count":1,"dismiss_stale_reviews":true}' \
  --field restrictions=null \
  --field required_linear_history=false \
  --field allow_force_pushes=false \
  --field allow_deletions=false \
  --field required_conversation_resolution=true
```

**Para verificar:**
```bash
gh api repos/Senai-BAL/Sistema-de-Solicita-o-de-Servi-os/branches/main/protection
```

---

## 📝 Checklist Final

Após configurar, teste:

- [ ] Tentar push direto na main (deve falhar)
- [ ] Criar branch de teste
- [ ] Criar PR
- [ ] Verificar se status checks aparecem
- [ ] Tentar merge sem approval (deve bloquear)
- [ ] Aprovar e fazer merge (deve funcionar)

---

## 🆘 Troubleshooting

### "Status checks não aparecem na busca"

**Solução:**
1. Faça um commit simples em qualquer branch
2. Crie uma PR para main
3. Aguarde CI rodar
4. Volte em Branch Protection
5. Os checks agora devem aparecer

### "Não encontro opção X"

**Solução:**
- Use o GitHub CLI (comando acima)
- Ou verifique se você tem permissão de Admin no repositório

### "Erro ao salvar regras"

**Solução:**
- Tente salvar em partes (primeiro PR, depois status checks)
- Ou use GitHub CLI

---

## 📚 Referências Atualizadas

- [GitHub Docs - Protected Branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [GitHub API - Branch Protection](https://docs.github.com/en/rest/branches/branch-protection)

---

*Atualizado em: 18/11/2025 - Interface do GitHub atual*
