# 🌐 Public - Aplicação Web

Esta pasta contém todos os arquivos da aplicação web do SENAI Lab que são servidos publicamente.

## 📁 Estrutura de Arquivos

### `index.html`
- **Função**: Interface principal para colaboradores
- **Público-alvo**: Todos os colaboradores do SENAI Lab
- **Funcionalidades**:
  - Formulário dinâmico de solicitações
  - Sistema de múltiplos arquivos (v2.5.0)
  - Upload automático para GitHub
  - Validações em tempo real
  - Interface responsiva

### `admin.html`
- **Função**: Dashboard administrativo
- **Público-alvo**: Administradores do sistema
- **Funcionalidades**:
  - Gestão completa de solicitações
  - Estatísticas em tempo real
  - Sistema de comentários
  - Exportação PDF avançada
  - Backup completo + limpeza
  - Auto-refresh (30s)

### `shared/` - Configurações Compartilhadas

**📚 Documentação completa**: [`shared/README.md`](shared/README.md)

#### Arquivos de Configuração
- `firebase-config.js` - Credenciais Firebase (não commitado)
- `github-config.js` - Credenciais GitHub (não commitado)
- `firebase-service.js` - Serviços Firebase centralizados

#### Arquivos de Exemplo
- `firebase-config.example.js` - Template para configuração Firebase
- `github-config.example.js` - Template para configuração GitHub

## 🔧 Configuração Inicial

### 1. Configurar Firebase
```bash
cp shared/firebase-config.example.js shared/firebase-config.js
# Editar firebase-config.js com suas credenciais
```

### 2. Configurar GitHub
```bash
cp shared/github-config.example.js shared/github-config.js
# Editar github-config.js com suas credenciais
```

## 🌍 Ambientes

### Produção
- **Coleção**: `solicitacoes`
- **Repositório**: `senai-lab-arquivos`
- **Modo**: `production`

### Teste
- **Coleção**: `solicitacoes_test`
- **Repositório**: `senai-lab-test`
- **Modo**: `test`

O ambiente é controlado em `shared/firebase-service.js`:
```javascript
const ENVIRONMENT_CONFIG = {
  mode: 'test', // 'production' ou 'test'
  // ...
}
```

## 🎯 Funcionalidades por Arquivo

### index.html - Interface Colaboradores
- ✅ **Solicitações**: Espaço Maker, Serviços, Empréstimos
- ✅ **Upload Múltiplo**: Vários arquivos por categoria
- ✅ **Preview**: Visualização de imagens
- ✅ **Nomenclatura**: Padrão `TIPO_DATA_SOLICITANTE_ARQUIVO.ext`
- ✅ **Validações**: Tipos, tamanhos, formatos
- ✅ **Offline**: Cache para funcionamento sem internet

### admin.html - Dashboard Admin
- ✅ **Autenticação**: Senha local configurável
- ✅ **Visualização**: Lista e cards das solicitações
- ✅ **Filtros**: Por serviço, status, período
- ✅ **Gestão**: Atualização de status e comentários
- ✅ **Relatórios**: Exportação PDF configurável
- ✅ **Backup**: Sistema completo com limpeza

## 🔐 Segurança

### Credenciais Sensíveis (⚠️ Não commitar)
- `shared/firebase-config.js`
- `shared/github-config.js`

### Configuração Admin
Localizada em `admin.html` (~linha 1075):
```javascript
const ADMIN_CONFIG = {
  password: 'senai@admin2025', // ⚠️ ALTERE!
  sessionDuration: 24 * 60 * 60 * 1000,
  sessionKey: 'senai_admin_session'
};
```

## 📊 Tecnologias Utilizadas

- **HTML5**: Estrutura semântica
- **CSS3**: Estilização moderna e responsiva
- **JavaScript Vanilla**: Lógica da aplicação
- **Firebase**: Firestore para dados
- **GitHub API**: Upload de arquivos

## 🚀 Como Servir

### Desenvolvimento Local
```bash
# Servidor simples Python
python -m http.server 8000

# Ou Node.js
npx http-server .

# Ou PHP
php -S localhost:8000
```

### Produção (Firebase Hosting)
```bash
firebase deploy --only hosting
```

## 🔗 Links Relacionados

- **Configurações Gerais**: [`../docs/CONFIG.md`](../docs/CONFIG.md)
- **Firebase Config**: [`../firebase/`](../firebase/)
- **Releases**: [`../docs/releases/`](../docs/releases/)
- **README Principal**: [`../README.md`](../README.md)

## 📱 Compatibilidade

- ✅ **Desktop**: Funcionalidade completa
- ✅ **Tablet**: Interface adaptada
- ✅ **Mobile**: Otimizada para smartphones
- ✅ **PWA**: Instalável como app

---

**Última atualização**: 16 de julho de 2025
