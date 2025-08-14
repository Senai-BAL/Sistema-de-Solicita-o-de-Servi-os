# 🛠️ Instalação e Configuração - SENAI Lab

> **Guia completo de instalação e configuração do sistema**  
> **Versão:** v2.9.7 | **Atualizado:** 14/08/2025

---

## 🔧 **Pré-requisitos**

- **Node.js** (para Firebase CLI)
- **Conta Firebase** (gratuita)
- **Git** (para controle de versão)
- **Python** (para testes locais - opcional)

---

## 🚀 **Instalação Rápida**

### **1. Clone o repositório**
```bash
git clone https://github.com/GetuliovmSantos/Sistema-de-Solicita-o-de-Servi-os.git
cd senai-lab-webapp
```

### **2. Configure o Firebase**
```bash
npm install -g firebase-tools
firebase login
firebase init
```

### **3. Configure as credenciais**
```bash
# Copie o arquivo de exemplo
cp public/shared/firebase-config.example.js public/shared/firebase-config.js

# Edite com suas credenciais do Firebase Console
```

### **4. Deploy**
```bash
firebase deploy
```

---

## ⚙️ **Configuração Detalhada**

### **🔥 Firebase Setup**

#### **1. Criar Projeto Firebase**
1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Adicionar projeto"
3. Escolha um nome (ex: senai-lab-sistema)
4. Configure Analytics (opcional)
5. Crie o projeto

#### **2. Configurar Firestore**
1. Vá para "Firestore Database"
2. Clique em "Criar banco de dados"
3. Escolha modo "Produção"
4. Selecione localização (preferencialmente Brasil)

#### **3. Configurar Storage**
1. Vá para "Storage"
2. Clique em "Começar"
3. Aceite as regras padrão
4. Confirme localização

#### **4. Configurar Hosting**
1. Vá para "Hosting"
2. Clique em "Começar"
3. Instale Firebase CLI se necessário
4. Configure domínio personalizado (opcional)

### **🔐 Configuração de Credenciais**

#### **1. Obter Credenciais**
1. No Firebase Console, vá para "Configurações do Projeto"
2. Clique na aba "Geral"
3. Role até "Seus aplicativos"
4. Clique em "Configuração" (ícone de engrenagem)
5. Copie as credenciais do objeto `firebaseConfig`

#### **2. Configurar Arquivo**
```javascript
// public/shared/firebase-config.js
const firebaseConfig = {
  apiKey: "sua-api-key-aqui",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto-id",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789",
  appId: "sua-app-id"
};

// Não altere esta linha
window.firebaseConfig = firebaseConfig;
```

### **🛡️ Configuração de Segurança**

#### **1. Regras do Firestore**
```javascript
// firebase/firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Solicitações públicas
    match /solicitacoes/{document} {
      allow create: if true;
      allow read: if true;
      allow update, delete: if true;
    }
    
    // Admin logs
    match /admin_logs/{document} {
      allow read, write: if true;
    }
    
    // Bloquear todo o resto
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

#### **2. Regras do Storage**
```javascript
// firebase/storage.rules
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /senai-arquivos/{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

### **🔒 Configuração do Dashboard Admin**

#### **1. Definir Senha do Admin**
```javascript
// Em public/admin.html (linha ~50)
const ADMIN_CONFIG = {
  password: 'SUA_SENHA_SEGURA_AQUI', // ⚠️ ALTERE!
  sessionDuration: 24 * 60 * 60 * 1000, // 24 horas
  sessionKey: 'senai_admin_session'
};
```

#### **2. Configurar Múltiplos Usuários** (Opcional)
```javascript
const ADMIN_USERS = {
  'admin1': {
    name: 'Administrador 1',
    password: 'senha123'
  },
  'admin2': {
    name: 'Administrador 2', 
    password: 'outrasenha456'
  }
};
```

---

## 🚀 **Deploy e Hosting**

### **📤 Deploy Manual**
```bash
# Build e deploy completo
firebase deploy

# Deploy apenas Hosting
firebase deploy --only hosting

# Deploy apenas Firestore Rules
firebase deploy --only firestore:rules

# Deploy apenas Storage Rules  
firebase deploy --only storage
```

### **🌐 Deploy Automático com GitHub Actions**
```yaml
# .github/workflows/firebase-hosting.yml
name: Deploy to Firebase Hosting

on:
  push:
    branches: [ main ]

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - uses: FirebaseExtended/action-hosting-deploy@v0
      with:
        repoToken: '${{ secrets.GITHUB_TOKEN }}'
        firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
        projectId: seu-projeto-id
```

---

## 🧪 **Testes e Validação**

### **🌐 Servidor Local**
```bash
# Usando Python
cd public
python -m http.server 8080

# Usando Node.js
npx serve public -p 8080

# Usando Firebase
firebase serve --only hosting
```

### **✅ Checklist de Validação**
- [ ] Formulário principal funciona
- [ ] Upload de arquivos funciona
- [ ] Dashboard admin carrega
- [ ] Login admin funciona
- [ ] Filtros funcionam
- [ ] Exportação PDF funciona
- [ ] Design responsivo
- [ ] Performance adequada

---

## 🔧 **Troubleshooting**

### **❌ Problemas Comuns**

#### **"Firebase not defined"**
```javascript
// Verificar se firebase-config.js está carregado
// Verificar se as credenciais estão corretas
```

#### **"Permission denied"**
```javascript
// Verificar regras do Firestore
// Verificar regras do Storage
// Verificar se o projeto está ativo
```

#### **Upload não funciona**
```javascript
// Verificar regras do Storage
// Verificar se o bucket existe
// Verificar conexão com internet
```

#### **Dashboard não carrega**
```javascript
// Verificar senha do admin
// Verificar console do navegador
// Verificar se Firestore está configurado
```

### **🔍 Debug**
```javascript
// Ativar logs detalhados (adicionar em firebase-service.js)
firebase.firestore().enableNetwork().then(() => {
  console.log('Firestore conectado');
});

// Verificar configuração
console.log('Firebase Config:', firebase.app().options);
```

---

## 💡 **Dicas e Boas Práticas**

### **🔐 Segurança**
- ✅ **Nunca** commite `firebase-config.js`
- ✅ Use senhas **fortes** para admin
- ✅ Configure **HTTPS** em produção
- ✅ Monitore **logs** regularmente

### **⚡ Performance**
- ✅ Ative **compressão** no Firebase Hosting
- ✅ Configure **cache** adequado
- ✅ Otimize **imagens** antes do upload
- ✅ Use **indices** no Firestore

### **🔧 Manutenção**
- ✅ **Backup** regular dos dados
- ✅ **Monitore** custos do Firebase
- ✅ **Atualize** dependências
- ✅ **Teste** após mudanças

---

## 📊 **Monitoramento**

### **📈 Firebase Analytics**
- **Performance**: Tempo de carregamento
- **Crashlytics**: Erros e travamentos
- **Storage**: Uso e custos
- **Firestore**: Queries e performance

### **🔍 Google Analytics** (Opcional)
```html
<!-- Em public/index.html e admin.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_TRACKING_ID');
</script>
```

---

**📚 Documentação Relacionada:**
- [Funcionalidades Detalhadas](FUNCIONALIDADES.md)
- [Dashboard Administrativo](ADMIN.md)
- [Sistema de Relatórios PDF](PDF-EXPORT.md)
- [Pipeline de Desenvolvimento](../PIPELINE-COMMIT.md)
