# 🔥 Firebase Configuration

Esta pasta contém todas as configurações centralizadas do Firebase para o projeto SENAI Lab.

## 📁 Arquivos

### `firestore.rules`
- **Função**: Regras de segurança do Firestore
- **Política Atual**: Acesso público controlado pela aplicação
- **Coleções**: `solicitacoes` (produção) e `solicitacoes_test` (teste)

### `firestore.indexes.json`
- **Função**: Definição de índices para otimização de consultas
- **Localização**: nam5 (North America)
- **Database**: (default)

## ⚙️ Como usar

### Deploy de Rules
```bash
firebase deploy --only firestore:rules
```

### Deploy de Indexes  
```bash
firebase deploy --only firestore:indexes
```

### Deploy Completo
```bash
firebase deploy
```

## 🔄 Estrutura de Referências

O arquivo `firebase.json` na raiz do projeto referencia os arquivos desta pasta:

```json
{
  "firestore": {
    "rules": "firebase/firestore.rules",
    "indexes": "firebase/firestore.indexes.json"
  }
}
```

## 🌍 Ambientes

- **Produção**: Coleção `solicitacoes`
- **Teste**: Coleção `solicitacoes_test`

Ambos os ambientes usam as mesmas regras e índices.

## 🔗 Links Relacionados

- **Configurações Gerais**: [`../docs/CONFIG.md`](../docs/CONFIG.md)
- **Firebase Console**: https://console.firebase.google.com/project/senai-lab-6fe79
- **Documentação**: https://firebase.google.com/docs

---

**Última atualização**: 16 de julho de 2025
