# 🚀 Deploy - SENAI Lab

## 📋 Pré-requisitos

- Node.js e Firebase CLI instalados
- Configuração Firebase (`firebase-config.js`)
- Acesso ao projeto Firebase

## 🔧 Setup Inicial

```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Login no Firebase
firebase login

# Inicializar projeto (se necessário)
firebase init
```

## ⚙️ Configuração

1. **Copie as configurações:**
   ```bash
   cp public/shared/firebase-config.example.js public/shared/firebase-config.js
   ```

2. **Configure suas credenciais no arquivo `firebase-config.js`**

3. **Teste localmente:**
   ```bash
   firebase serve
   ```

## 🌍 Deploy

### Produção
```bash
firebase deploy --project senai-lab-6fe79
```

### Teste
```bash
# Certifique-se de estar na branch test-environment-v2
firebase deploy --project senai-lab-6fe79
```

## ✅ Pós-Deploy

1. Teste as funcionalidades principais
2. Verifique logs no Console Firebase
3. Confirme autenticação admin
4. Teste upload de arquivos

---

**Última atualização**: Agosto 2025
