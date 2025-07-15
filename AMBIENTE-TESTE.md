# 🧪 Ambiente de Teste - SENAI Lab

## 📋 Configuração do Ambiente de Teste

Este ambiente foi criado para permitir testes seguros de novas funcionalidades sem afetar o sistema de produção.

### 🔧 Configurações

#### Firebase Firestore
- **Produção**: `solicitacoes`
- **Teste**: `solicitacoes_test` ✅

#### GitHub Repository
- **Produção**: `senai-lab-arquivos`
- **Teste**: `senai-lab-test` ✅

#### Branch
- **Produção**: `main`
- **Teste**: `test-environment` ✅

### 🎛️ Como Alternar Entre Ambientes

#### Para Modo de Teste (Atual)
No arquivo `public/shared/firebase-service.js`, linha 7:
```javascript
mode: 'test', // 'production' ou 'test'
```

#### Para Modo de Produção
```javascript
mode: 'production', // 'production' ou 'test'
```

### 📂 Estrutura de Dados

#### Coleção Firebase: `solicitacoes_test`
- Mesma estrutura da produção
- Dados completamente isolados
- Não afeta a produção

#### Repositório GitHub: `senai-lab-test`
- Mesmo padrão de nomenclatura de arquivos
- Arquivos completamente isolados
- Não afeta a produção

### 🚀 Como Usar

1. **Certifique-se de estar na branch `test-environment`**
2. **Crie o repositório `senai-lab-test` no GitHub**
3. **Teste suas funcionalidades normalmente**
4. **Os dados ficarão em `solicitacoes_test`**
5. **Os arquivos ficarão em `senai-lab-test`**

### 🔄 Deploy para Teste

```bash
# Certificar que está na branch correta
git checkout test-environment

# Deploy para teste (usar URL diferente)
firebase deploy --project senai-lab-6fe79
```

### ⚠️ Importante

- **NUNCA** altere o modo para 'production' na branch `test-environment`
- **SEMPRE** verifique qual ambiente está ativo no console do navegador
- **Os dados de teste não aparecem na produção e vice-versa**

### 🔍 Verificação do Ambiente

Ao carregar a página, verifique no console do navegador:
```
🔥 Firebase Service iniciado em modo: TEST
📂 Coleção: solicitacoes_test
```

### 🛠️ Próximos Passos

1. **Criar repositório `senai-lab-test` no GitHub**
2. **Testar upload de arquivos**
3. **Testar criação de solicitações**
4. **Verificar isolamento completo**

---

**Data de Criação**: 15/07/2025  
**Versão**: 1.0  
**Autor**: Sistema SENAI Lab
