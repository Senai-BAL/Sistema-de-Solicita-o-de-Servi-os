# 🚀 SENAI Lab - Otimização Serverless Free Tier

**Versão:** 3.1.0
**Data:** Novembro 2025

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura de Ambientes](#arquitetura-de-ambientes)
3. [Limites do Firebase Free Tier](#limites-do-firebase-free-tier)
4. [Sistemas Implementados](#sistemas-implementados)
5. [Como Usar](#como-usar)
6. [Boas Práticas](#boas-práticas)
7. [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral

Esta atualização implementa um sistema completo de otimização para manter o SENAI Lab **100% gratuito** dentro do Firebase Free Tier (Spark Plan), com múltiplos ambientes para desenvolvimento seguro.

### Principais Recursos

- ✅ **Detecção automática de ambiente** (dev, staging, production)
- ✅ **Monitoramento rigoroso de quotas** Firebase
- ✅ **Sistema de backup automatizado** (evitar perda de dados)
- ✅ **Cache agressivo** para reduzir reads do Firestore
- ✅ **Compressão automática de imagens** (economizar Storage)
- ✅ **Firebase Emulators** para desenvolvimento local gratuito

---

## 🏗️ Arquitetura de Ambientes

### 1. Development (Local)
**Custo:** 🟢 **R$ 0,00** (100% gratuito)

- Usa **Firebase Emulators** localmente
- Dados completamente isolados
- Sem conexão com Firebase produção
- Perfeito para testes e desenvolvimento

**Como usar:**
```bash
npm run dev
# ou
npm run emulators
```

**URL:** `http://localhost:5000`
**Firestore Emulator:** `http://localhost:8080`
**Storage Emulator:** `http://localhost:9199`
**UI do Emulator:** `http://localhost:4000`

### 2. Staging (Compartilhado)
**Custo:** 🟢 **R$ 0,00** (compartilha quota com produção)

- Usa mesmo projeto Firebase
- Coleção separada: `solicitacoes_staging`
- Pasta Storage separada: `staging/`
- Ideal para testes com colegas

**Como usar:**
```bash
# Adicionar ?env=staging na URL
https://senai-lab-6fe79.web.app/?env=staging
```

### 3. Production
**Custo:** 🟢 **R$ 0,00** (dentro do Free Tier)

- Coleção: `solicitacoes`
- Pasta Storage: `production/`
- Cache ativo (5 minutos)
- Backup automático (24h)

**URL:** `https://senai-lab-6fe79.web.app`

---

## 📊 Limites do Firebase Free Tier

### Firestore (Banco de Dados)
| Recurso | Limite Diário | Monitorado |
|---------|---------------|------------|
| Reads | 50,000 | ✅ Sim |
| Writes | 20,000 | ✅ Sim |
| Deletes | 20,000 | ✅ Sim |
| Storage | 1 GB total | ❌ Não* |

### Cloud Storage (Arquivos)
| Recurso | Limite | Monitorado |
|---------|--------|------------|
| Storage | 5 GB | ✅ Sim |
| Downloads | 1 GB/dia | ❌ Não* |
| Uploads | 20,000/dia | ✅ Sim |

### Hosting (Site)
| Recurso | Limite | Gratuito |
|---------|--------|----------|
| Storage | 10 GB | ✅ Sim |
| Transfer | 360 MB/dia | ✅ Sim |

**\* Nota:** Firebase não fornece API para monitorar esses limites

---

## 🛠️ Sistemas Implementados

### 1. Environment Detector
**Arquivo:** `public/shared/environment-config.js`

Detecta automaticamente o ambiente e configura:
- Collection do Firestore
- Path do Storage
- Timeout de cache
- Enable/disable de features

**Uso:**
```javascript
console.log(window.ENV.environment); // 'development', 'staging' ou 'production'
console.log(window.ENV.getCollectionName()); // Nome da collection
```

### 2. Quota Monitor
**Arquivo:** `public/shared/quota-monitor.js`

Monitora uso diário e alerta quando atingir 70% do limite.

**Comandos úteis:**
```javascript
showQuotaReport() // Ver relatório de uso
window.quotaMonitor.getStats() // Obter estatísticas
```

**Exemplo de alerta:**
```
⚠️ Firestore Reads: 75.3% usado (37,650/50,000)
```

### 3. Backup System
**Arquivo:** `public/shared/backup-system.js`

Backup automático a cada 24h + backup manual.

**Comandos úteis:**
```javascript
createBackup() // Criar backup manual
listBackups() // Listar backups disponíveis
downloadBackup() // Baixar backup em JSON
```

**Features:**
- Backup local (localStorage)
- Export para JSON
- Restore completo
- Histórico de 7 dias

### 4. Firestore Cache
**Arquivo:** `public/shared/firestore-cache.js`

Cache inteligente para reduzir reads.

**Timeouts:**
- Development: 0s (sem cache)
- Staging: 1 minuto
- Production: 5 minutos

**Comandos úteis:**
```javascript
showCacheStats() // Ver estatísticas do cache
clearCache() // Limpar cache
```

**Economia estimada:** 60-80% de reads

### 5. Image Compressor
**Arquivo:** `public/shared/image-compressor.js`

Comprime imagens antes do upload.

**Configuração:**
- Max resolução: 1920x1920px
- Qualidade: 70%
- Max tamanho: 5MB

**Economia estimada:** 50-70% de Storage

---

## 💻 Como Usar

### Desenvolvimento Local (Recomendado)

1. **Iniciar Emulators:**
```bash
npm run dev
```

2. **Acessar:**
- Site: http://localhost:5000
- Firestore UI: http://localhost:4000
- Admin: http://localhost:5000/admin.html

3. **Desenvolver normalmente:**
- Todas as mudanças são locais
- Dados não afetam produção
- Quota ilimitada

### Staging (Testes com Equipe)

1. **Acessar URL com parâmetro:**
```
https://senai-lab-6fe79.web.app/?env=staging
```

2. **Indicador visual:**
Verá banner laranja no topo: "🌍 STAGING MODE"

3. **Dados isolados:**
- Collection: `solicitacoes_staging`
- Não mistura com produção

### Production (Uso Real)

**URL normal:** https://senai-lab-6fe79.web.app

**Recursos ativos:**
- ✅ Cache (5min)
- ✅ Quota Monitor
- ✅ Backup automático (24h)
- ✅ Compressão de imagens

---

## 🎯 Boas Práticas

### Para Desenvolvedores

1. **Sempre desenvolva localmente primeiro**
```bash
npm run dev
```

2. **Teste em staging antes de produção**
```
?env=staging
```

3. **Monitore quotas regularmente**
```javascript
showQuotaReport()
```

4. **Faça backup antes de mudanças grandes**
```javascript
createBackup()
```

### Para Economizar Quota

1. **Evite queries desnecessárias:**
```javascript
// ❌ Ruim - faz query toda vez
setInterval(() => loadData(), 1000);

// ✅ Bom - usa cache
const cached = firestoreCache.get('solicitacoes');
if (!cached) loadData();
```

2. **Use limit() nas queries:**
```javascript
// ❌ Ruim - carrega tudo
db.collection('solicitacoes').get()

// ✅ Bom - limita quantidade
db.collection('solicitacoes').limit(50).get()
```

3. **Comprima imagens antes de upload:**
```javascript
const compressed = await imageCompressor.compressImage(file);
await storage.ref().put(compressed);
```

4. **Invalide cache após writes:**
```javascript
await db.collection('solicitacoes').add(data);
firestoreCache.invalidate('solicitacoes'); // Limpar cache
```

---

## 🐛 Troubleshooting

### "Firebase configuration not found"

**Causa:** Ambiente development sem config local

**Solução:**
```bash
# Copiar exemplo
cp shared/firebase-config.example.js config/firebase-config.js

# Editar com suas credenciais
# OU usar emulators:
npm run dev
```

### "Quota exceeded"

**Causa:** Atingiu limite diário do Firebase

**Solução:**
1. Ver relatório:
```javascript
showQuotaReport()
```

2. Aguardar reset (meia-noite UTC)

3. Otimizar queries para reduzir uso

### Cache não está funcionando

**Verificar:**
```javascript
showCacheStats()
```

**Limpar e testar:**
```javascript
clearCache()
// Fazer operação novamente
```

### Backup falhou

**Verificar localStorage:**
```javascript
// Ver tamanho usado
const used = JSON.stringify(localStorage).length;
console.log(`LocalStorage: ${(used/1024).toFixed(2)} KB`);
```

**Se cheio, limpar backups antigos:**
```javascript
window.backupSystem.cleanOldBackups(2) // Manter apenas 2
```

---

## 📈 Monitoramento

### Dashboard de Quotas

Visualizar uso atual:
```javascript
showQuotaReport()
```

Saída esperada:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 SENAI Lab - Quota Usage Report
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📅 Date: 2025-11-21

🔥 Firestore:
  Reads:   1,234 / 50,000 (2.5%)
  Writes:  456 / 20,000 (2.3%)
  Deletes: 12 / 20,000 (0.1%)

📦 Storage:
  Uploads: 45 / 20,000 (0.2%)
  Size:    145.67 MB / 5 GB (2.8%)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Alertas Automáticos

Sistema alerta quando atingir:
- ⚠️ **70%** - Warning
- 🚨 **90%** - Critical

---

## 🔧 Configuração Avançada

### Ajustar Timeout de Cache

**Arquivo:** `public/shared/environment-config.js`

```javascript
production: {
  cacheTimeout: 5 * 60 * 1000, // 5 minutos (padrão)
  // Mudar para:
  cacheTimeout: 10 * 60 * 1000, // 10 minutos (mais economia)
}
```

### Ajustar Qualidade de Compressão

```javascript
production: {
  compressionQuality: 0.7, // 70% (padrão)
  // Mudar para:
  compressionQuality: 0.6, // 60% (mais economia, menos qualidade)
}
```

---

## 📚 Referências

- [Firebase Free Tier Limits](https://firebase.google.com/pricing)
- [Firebase Emulators](https://firebase.google.com/docs/emulator-suite)
- [Firestore Best Practices](https://firebase.google.com/docs/firestore/best-practices)

---

## ✅ Checklist de Deploy

Antes de fazer deploy para produção:

- [ ] Testou localmente com emulators
- [ ] Testou em staging
- [ ] Verificou quota atual (`showQuotaReport()`)
- [ ] Criou backup (`createBackup()`)
- [ ] Rodou testes (`npm test`)
- [ ] Validou sintaxe (`npm run validate`)

---

**Documentação gerada em:** 21/11/2025
**Versão:** 3.1.0
