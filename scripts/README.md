# 📁 Scripts de Automação - SENAI Lab

> **Conjunto de scripts para automatizar o processo de commit e deploy**  
> **Versão:** 1.0.0 | **Criado:** 14/08/2025

---

## 🎯 **Objetivo**

Automatizar o **PIPELINE-COMMIT.md** através de scripts que:
- ✅ **Atualizam versões** automaticamente
- ✅ **Padronizam commits** seguindo estrutura definida
- ✅ **Testam localmente** antes do commit
- ✅ **Facilitam deploy** para produção

---

## 📂 **Scripts Disponíveis**

### **🪟 Windows PowerShell**
```powershell
# Uso básico
.\scripts\pipeline.ps1 -NovaVersao "2.9.6" -Descricao "sistema de limpeza automática"

# Com deploy para produção
.\scripts\pipeline.ps1 -NovaVersao "2.9.6" -Descricao "sistema de limpeza automática" -Producao

# Personalizado
.\scripts\pipeline.ps1 -NovaVersao "2.9.6" -TipoCommit "feat" -Escopo "admin" -Descricao "melhorias de performance" -Producao -SkipTests
```

### **🐧 Linux/Mac Bash**
```bash
# Tornar executável (apenas primeira vez)
chmod +x scripts/pipeline.sh

# Uso básico
./scripts/pipeline.sh -v 2.9.6 -d "sistema de limpeza automática"

# Com deploy para produção
./scripts/pipeline.sh -v 2.9.6 -d "sistema de limpeza automática" -p

# Personalizado
./scripts/pipeline.sh -v 2.9.6 -t feat -s admin -d "melhorias de performance" -p --skip-tests
```

---

## ⚙️ **Parâmetros**

| Parâmetro | PowerShell | Bash | Obrigatório | Descrição |
|-----------|------------|------|-------------|-----------|
| **Versão** | `-NovaVersao` | `-v, --version` | ✅ | Nova versão (ex: 2.9.6) |
| **Tipo** | `-TipoCommit` | `-t, --type` | ❌ | Tipo do commit (padrão: feat) |
| **Escopo** | `-Escopo` | `-s, --scope` | ❌ | Escopo (padrão: admin) |
| **Descrição** | `-Descricao` | `-d, --desc` | ❌ | Descrição do commit |
| **Produção** | `-Producao` | `-p, --production` | ❌ | Deploy para produção |
| **Pular Testes** | `-SkipTests` | `--skip-tests` | ❌ | Não testar localmente |

---

## 🚀 **Tipos de Commit**

- **`feat`**: Nova funcionalidade
- **`fix`**: Correção de bug  
- **`docs`**: Documentação
- **`style`**: CSS/formatação
- **`refactor`**: Refatoração
- **`perf`**: Performance
- **`test`**: Testes
- **`chore`**: Manutenção

---

## 🔄 **Fluxo Automatizado**

### **1. Atualização de Versão**
```bash
✅ public/admin.html
✅ public/index.html  
✅ README.md
✅ public/assets/js/admin/utils.js
```

### **2. Verificação de Alterações**
```bash
git status --porcelain
```

### **3. Testes Locais**
```bash
# Inicia servidor Python na porta 8080
python -m http.server 8080
# Aguarda confirmação do usuário
```

### **4. Commit Estruturado**
```bash
git add .
git commit -m "feat(admin): sistema de limpeza automática

Versão: v2.9.6
Data: 14/08/2025 14:30

Arquivos atualizados:
- public/assets/js/admin/utils.js
- public/assets/js/shared/loading-manager.js"
```

### **5. Deploy (se solicitado)**
```bash
git checkout main
git merge test-environment-v2
git push origin main
# Lembrete para firebase deploy
```

---

## 🛡️ **Validações**

### **Pré-requisitos:**
- [ ] **Git** configurado
- [ ] **Python** para testes locais
- [ ] **Estar na raiz** do projeto
- [ ] **Branch** test-environment-v2 ativa

### **Verificações Automáticas:**
- [ ] **Diretório correto** (existe public/admin.html)
- [ ] **Versão válida** (formato X.X.X)
- [ ] **Arquivos encontrados** para atualização
- [ ] **Confirmação do usuário** antes do commit

---

## 📝 **Exemplos Práticos**

### **🔧 Correção Rápida**
```powershell
# Windows
.\scripts\pipeline.ps1 -NovaVersao "2.9.7" -TipoCommit "fix" -Descricao "correção bug loading"

# Linux/Mac  
./scripts/pipeline.sh -v 2.9.7 -t fix -d "correção bug loading"
```

### **✨ Nova Funcionalidade**
```powershell
# Windows
.\scripts\pipeline.ps1 -NovaVersao "2.10.0" -TipoCommit "feat" -Escopo "admin" -Descricao "sistema de notificações push"

# Linux/Mac
./scripts/pipeline.sh -v 2.10.0 -t feat -s admin -d "sistema de notificações push"
```

### **🚀 Deploy Produção**
```powershell
# Windows
.\scripts\pipeline.ps1 -NovaVersao "2.9.6" -Descricao "limpeza automática e loading melhorado" -Producao

# Linux/Mac
./scripts/pipeline.sh -v 2.9.6 -d "limpeza automática e loading melhorado" -p
```

---

## ⚠️ **Importante**

### **⛔ O que NÃO automatizam:**
- **CHANGELOG.md** - precisa revisão manual
- **Release notes** - criação manual se necessário  
- **Firebase deploy** - comando manual final
- **Testes específicos** - apenas servidor local

### **🔍 Verificações Manuais:**
1. **Conferir CHANGELOG.md** se mudanças significativas
2. **Criar release** se versão major/minor
3. **Testar funcionalidades** no servidor local
4. **Executar firebase deploy** após push

---

## 🔧 **Troubleshooting**

### **❌ "Arquivo não encontrado"**
```bash
# Verificar se está na raiz do projeto
pwd
ls public/admin.html
```

### **❌ "Python não encontrado"**
```bash
# Instalar Python ou usar --skip-tests
./scripts/pipeline.sh -v 2.9.6 -d "teste" --skip-tests
```

### **❌ "Git error"**
```bash
# Verificar status do git
git status
git branch
```

---

## 📊 **Vantagens da Automação**

| ✅ **Antes** | ✅ **Depois** |
|-------------|---------------|
| 15 min manual | 3 min automatizado |
| Erros de versão | Versão consistente |
| Commits irregulares | Padrão definido |
| Testes esquecidos | Teste obrigatório |
| Deploy manual | Semi-automatizado |

---

**⚡ Criado em:** 14/08/2025  
**🔧 Versão:** 1.0.0  
**👨‍💻 Autor:** Getulio Santos
