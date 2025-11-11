# 📊 SENAI Lab - Índices do Firestore

## 🎯 **Índices Essenciais para Performance**

> **Última atualização**: 29/08/2025  
> **Versão**: v3.0.2

### ⚡ **Problema de Performance Identificado**
O Firestore exige índices compostos para consultas que combinam filtros e ordenação:
- `where('status', '==', 'pendente')` + `orderBy('timestamp', 'desc')`

### 🔧 **Índices Obrigatórios**

#### **1. Índice Principal - Status + Timestamp**
**Coleções**: `solicitacoes` e `solicitacoes_test`
**Campos**:
- `status` (Ascending)
- `timestamp` (Descending)

**Como criar**: Firebase Console → Firestore → Índices → Criar índice composto

#### Para Admin Dashboard
**Collection**: `solicitacoes`
**Campos**:
- `servicoSelecionado` (Ascending)
- `timestamp` (Descending)

#### Para Relatórios por Colaborador
**Collection**: `solicitacoes_test` / `solicitacoes`
**Campos**:
- `colaborador` (Ascending)
- `timestamp` (Descending)

## 🚀 Como Criar os Índices

### Método 1: Via Link Direto (RECOMENDADO)
1. **Clique no link fornecido pelo erro** (acima)
2. Será direcionado ao Firebase Console
3. Confirme a criação do índice
4. Aguarde a construção (5-10 minutos)

### Método 2: Via Firebase Console Manual
1. Acesse: https://console.firebase.google.com/project/senai-lab-6fe79/firestore/indexes
2. Clique em "Create Index"
3. Selecione a collection: `solicitacoes_test`
4. Adicione os campos:
   - Campo 1: `status` (Ascending)
   - Campo 2: `timestamp` (Descending)
5. Repita para `solicitacoes`

### Método 3: Via CLI do Firebase (Avançado)
```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Configurar projeto
firebase use senai-lab-6fe79

# Deploy índices
firebase deploy --only firestore:indexes
```

## 📋 Status dos Índices

### ✅ Funcionando Automaticamente
- **Busca por Email**: Campo único, sem índice necessário
- **Busca por Telefone**: Campo único, sem índice necessário  
- **Busca por ID**: Busca direta por documento
- **Queries simples**: Ordenação apenas por timestamp

### ❌ Requerem Índice Composto
- **Status + Data**: `where('status') + orderBy('timestamp')`
- **Serviço + Data**: `where('servicoSelecionado') + orderBy('timestamp')`
- **Múltiplos filtros**: Combinações de campos

### ⏳ Pendentes de Criação
1. **URGENTE**: `status` + `timestamp` para collection `solicitacoes_test`
2. **URGENTE**: `status` + `timestamp` para collection `solicitacoes`
3. **Opcional**: `servicoSelecionado` + `timestamp` para admin

## 🎯 Configuração via Arquivo (firestore.indexes.json)

```json
{
  "indexes": [
    {
      "collectionGroup": "solicitacoes_test",
      "queryScope": "COLLECTION",
      "fields": [
        {"fieldPath": "status", "order": "ASCENDING"},
        {"fieldPath": "timestamp", "order": "DESCENDING"}
      ]
    },
    {
      "collectionGroup": "solicitacoes",
      "queryScope": "COLLECTION", 
      "fields": [
        {"fieldPath": "status", "order": "ASCENDING"},
        {"fieldPath": "timestamp", "order": "DESCENDING"}
      ]
    },
    {
      "collectionGroup": "solicitacoes",
      "queryScope": "COLLECTION",
      "fields": [
        {"fieldPath": "servicoSelecionado", "order": "ASCENDING"},
        {"fieldPath": "timestamp", "order": "DESCENDING"}
      ]
    }
  ]
}
```

## 🔍 Alternativas para Evitar Índices Compostos

### Opção 1: Filtro no Cliente (Coleções Pequenas)
```javascript
// ❌ Requer índice composto
db.collection('solicitacoes_test')
  .where('status', '==', 'pendente')
  .orderBy('timestamp', 'desc')

// ✅ Sem índice composto - filtra no cliente
db.collection('solicitacoes_test')
  .orderBy('timestamp', 'desc')
  .limit(50)
  .get()
  .then(snapshot => {
    const filtered = snapshot.docs
      .filter(doc => doc.data().status === 'pendente')
      .slice(0, 10);
  });
```

### Opção 2: Queries Separadas
```javascript
// ✅ Buscar primeiro por status
const statusQuery = await db.collection('solicitacoes_test')
  .where('status', '==', 'pendente')
  .get();

// ✅ Ordenar no cliente
const sorted = statusQuery.docs
  .sort((a, b) => b.data().timestamp - a.data().timestamp)
  .slice(0, 10);
```

## ⚡ Performance e Custos

### Tempo de Construção dos Índices
- **Coleções pequenas** (< 100 docs): 1-5 minutos
- **Coleções médias** (100-1000 docs): 5-15 minutos  
- **Coleções grandes** (> 1000 docs): 15+ minutos

### Custos Firestore
- **Leituras**: Cada documento lido = 1 operação
- **Índices**: Mantidos automaticamente, sem custo extra
- **Queries**: Custo baseado em documentos retornados

### Otimizações Implementadas
- ✅ **Limit()**: Reduz documentos lidos
- ✅ **Cache Local**: Firestore faz cache automático
- ✅ **Queries Diretas**: Busca por ID/email/telefone sem índices

## 🚨 Ações Imediatas

### 1. CRIAR ÍNDICE PRINCIPAL (URGENTE)
```
🔗 CLIQUE AQUI: https://console.firebase.google.com/v1/r/project/senai-lab-6fe79/firestore/indexes?create_composite=Cllwcm9qZWN0cy9zZW5haS1sYWItNmZlNzkvZGF0YWJhc2VzLyhkZWZhdWx0KS9jb2xsZWN0aW9uR3JvdXBzL3NvbGljaXRhY29lc190ZXN0L2luZGV4ZXMvXxABGgoKBnN0YXR1cxABGg0KCXRpbWVzdGFtcBACGgwKCF9fbmFtZV9fEAI
```

### 2. Verificar Status
- Acesse: https://console.firebase.google.com/project/senai-lab-6fe79/firestore/indexes
- Status: 🟡 Building → ✅ Ready

### 3. Re-testar Sistema
- Aguardar conclusão da construção (5-10 min)
- Executar novamente: http://localhost:8080/firebase-report.html
- Verificar se query complexa funciona

## 📈 Resultados Esperados

### Após Correção dos Índices:
- ✅ **Query Complexa**: < 100ms
- ✅ **Tracking v3.0.0**: Totalmente funcional
- ✅ **Admin Dashboard**: Filtros operacionais
- ✅ **Relatórios**: Geração automática habilitada

---

🔥 **PRÓXIMO PASSO**: Clique no link acima para criar o índice e resolver o erro!
