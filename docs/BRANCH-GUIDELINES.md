# 🔀 Git Branch Guidelines - SENAI Lab

**Atualizado**: v3.0.0 - 18 de julho de 2025

## 📋 Regras de Branch

### Branch `main` (Produção)
- ✅ Código estável e testado
- ✅ Configurações de produção (credenciais reais)
- ✅ Versão final do sistema multiusuário
- ❌ **NÃO deve conter**: `AMBIENTE-TESTE.md`

### Branch `test-environment` (Teste)  
- ✅ Código em desenvolvimento/teste
- ✅ Configurações de teste (credenciais de desenvolvimento)
- ✅ **Deve conter**: `AMBIENTE-TESTE.md`

## ⚠️ Arquivos Específicos por Branch

### Apenas em `test-environment`:
- `AMBIENTE-TESTE.md` - Documentação do ambiente de teste
- Configurações específicas de teste
- Credenciais de desenvolvimento

### Em ambas as branches:
- Código principal da aplicação
- Documentação geral (README.md, CHANGELOG.md)
- Sistema de auditoria multiusuário
- Configurações base do Firebase

### Configurações Específicas por Ambiente:
- **Produção (main)**: `brunete.tech` (TI 💻)
- **Teste (test-environment)**: `brunete.designer` (Designer 🎨)

## 🚀 Fluxo de Trabalho

### 1. Desenvolvimento
```bash
git checkout test-environment
# Desenvolver e testar
git add .
git commit -m "feat: nova funcionalidade"
```

### 2. Deploy em Teste
```bash
firebase deploy --project senai-lab-6fe79
# Testar funcionalidade
```

### 3. Merge para Produção
```bash
git checkout main
git merge test-environment
# ⚠️ ATENÇÃO: Não incluir AMBIENTE-TESTE.md
```

### 4. Deploy em Produção
```bash
# Alterar modo para 'production' em firebase-service.js
firebase deploy --project senai-lab-6fe79
```

## 📝 Checklist de Merge

Antes de fazer merge de `test-environment` → `main`:

- [ ] Código testado e funcionando
- [ ] Configurações ajustadas para produção
- [ ] `AMBIENTE-TESTE.md` não incluído no merge
- [ ] Documentação atualizada
- [ ] Firebase service configurado para produção

---

**Criado em**: 16 de julho de 2025
