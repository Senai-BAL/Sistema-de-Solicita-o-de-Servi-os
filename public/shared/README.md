# ⚙️ Shared - Configurações Compartilhadas

Esta pasta contém arquivos de configuração e serviços compartilhados entre as interfaces do SENAI Lab.

## 📁 Arquivos

### Configurações (⚠️ Credenciais Sensíveis)

#### `firebase-config.js`
- **Função**: Credenciais do Firebase
- **Status**: ❌ **NÃO COMMITAR** (incluído no .gitignore)
- **Origem**: Copiado de `firebase-config.example.js`
- **Conteúdo**: API keys, project ID, etc.

#### `github-config.js`  
- **Função**: Credenciais do GitHub API
- **Status**: ❌ **NÃO COMMITAR** (incluído no .gitignore)
- **Origem**: Copiado de `github-config.example.js`
- **Conteúdo**: Token, repositório, usuário

### Templates de Configuração

#### `firebase-config.example.js`
- **Função**: Template para configuração Firebase
- **Status**: ✅ Pode ser commitado (sem credenciais)
- **Uso**: Base para criar `firebase-config.js`

#### `github-config.example.js`
- **Função**: Template para configuração GitHub
- **Status**: ✅ Pode ser commitado (sem credenciais)  
- **Uso**: Base para criar `github-config.js`

### Serviços

#### `firebase-service.js`
- **Função**: Classe centralizada para operações Firebase
- **Funcionalidades**:
  - Gestão de ambientes (produção/teste)
  - CRUD de solicitações
  - Cache offline
  - Tratamento de erros
- **Ambientes**: Produção (`solicitacoes`) e Teste (`solicitacoes_test`)

## 🔧 Configuração Inicial

### 1. Configurar Firebase
```bash
# Na pasta public/shared/
cp firebase-config.example.js firebase-config.js

# Editar firebase-config.js:
window.firebaseConfig = {
  apiKey: "sua-api-key",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto-id",
  // ... outras configurações
};
```

### 2. Configurar GitHub
```bash
# Na pasta public/shared/
cp github-config.example.js github-config.js

# Editar github-config.js:
window.githubConfig = {
  username: 'seu-usuario',
  repo: 'seu-repositorio',
  token: 'seu-token-github',
  branch: 'main'
};
```

## 🌍 Ambientes Suportados

### Produção
```javascript
// firebase-service.js
const ENVIRONMENT_CONFIG = {
  mode: 'production',
  collections: {
    production: 'solicitacoes'
  }
};
```

### Teste
```javascript
// firebase-service.js
const ENVIRONMENT_CONFIG = {
  mode: 'test',
  collections: {
    test: 'solicitacoes_test'
  }
};
```

## 🔐 Segurança

### Arquivos Protegidos (⚠️ .gitignore)
- `firebase-config.js` - Credenciais Firebase
- `github-config.js` - Token GitHub

### Permissões GitHub Token
Para `github-config.js`, o token deve ter:
- ✅ **repo** (Full control of private repositories)
- ✅ **public_repo** (Access public repositories)

## 🔗 Como os Arquivos São Usados

### Em `index.html`:
```html
<script src="shared/firebase-config.js"></script>
<script src="shared/github-config.js"></script>
<script src="shared/firebase-service.js"></script>
```

### Em `admin.html`:
```html
<script src="shared/firebase-config.js"></script>
<script src="shared/github-config.js"></script>
<script src="shared/firebase-service.js"></script>
```

## 📊 Firebase Service - Funcionalidades

### Gestão de Dados
- `saveRequest()` - Salvar solicitação
- `getAllRequests()` - Buscar todas as solicitações
- `updateRequestStatus()` - Atualizar status
- `addComment()` - Adicionar comentário

### Controle de Ambiente
- Alternância automática entre produção/teste
- Logs informativos no console
- Isolamento completo de dados

### Cache Offline
- Funcionamento sem internet
- Sincronização automática
- Persistência local

## 🚨 Importante

1. **NUNCA** commite arquivos `*-config.js`
2. **SEMPRE** use os templates como base
3. **VERIFIQUE** as permissões do token GitHub
4. **TESTE** em ambiente de desenvolvimento primeiro

## 🔗 Links Relacionados

- **Configurações Gerais**: [`../../docs/CONFIG.md`](../../docs/CONFIG.md)
- **Firebase Setup**: [`../../firebase/`](../../firebase/)
- **README Principal**: [`../../README.md`](../../README.md)

---

**Última atualização**: 16 de julho de 2025
