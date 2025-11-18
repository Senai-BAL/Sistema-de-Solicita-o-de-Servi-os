#!/bin/bash

# Script para configurar Branch Protection Rules via GitHub API
# Uso: bash scripts/setup-branch-protection.sh

echo "🔒 Configurando Branch Protection para branch 'main'..."

# JSON com a configuração completa
CONFIG='{
  "required_status_checks": {
    "strict": true,
    "contexts": ["Lint e Validação", "Security Scan", "Build Check"]
  },
  "enforce_admins": false,
  "required_pull_request_reviews": {
    "required_approving_review_count": 1,
    "dismiss_stale_reviews": true
  },
  "restrictions": null,
  "required_linear_history": false,
  "allow_force_pushes": false,
  "allow_deletions": false,
  "required_conversation_resolution": true,
  "block_creations": false,
  "lock_branch": false,
  "allow_fork_syncing": false
}'

# Fazer a requisição
echo "$CONFIG" | gh api \
  repos/Senai-BAL/Sistema-de-Solicita-o-de-Servi-os/branches/main/protection \
  --method PUT \
  --input -

if [ $? -eq 0 ]; then
  echo "✅ Branch protection configurada com sucesso!"
  echo ""
  echo "📋 Regras ativadas:"
  echo "  ✓ Require PR before merge (1 approval)"
  echo "  ✓ Require status checks: Lint, Security, Build"
  echo "  ✓ Require conversation resolution"
  echo "  ✓ Block force pushes"
  echo "  ✓ Block deletions"
  echo ""
  echo "🔍 Para verificar:"
  echo "  gh api repos/Senai-BAL/Sistema-de-Solicita-o-de-Servi-os/branches/main/protection"
else
  echo "❌ Erro ao configurar branch protection"
  echo "Tente configurar manualmente via GitHub web interface"
fi
