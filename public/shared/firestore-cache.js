/* 🚀 SENAI Lab - Sistema de Cache para Firestore
 * Arquivo: public/shared/firestore-cache.js
 * Descrição: Cache agressivo para reduzir reads e economizar quota
 * Versão: v3.1.0
 */

class FirestoreCache {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = window.ENV ? window.ENV.getCacheTimeout() : 5 * 60 * 1000;
    this.storageKey = 'senai_firestore_cache';

    // Carregar cache persistente
    this.loadFromLocalStorage();

    // Limpar cache expirado periodicamente
    this.startCleanupInterval();

    console.log(`🚀 Firestore Cache inicializado (timeout: ${this.cacheTimeout}ms)`);
  }

  loadFromLocalStorage() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        const data = JSON.parse(saved);
        // Converter array de volta para Map
        Object.entries(data).forEach(([key, value]) => {
          // Apenas carregar se não estiver expirado
          if (value.expiresAt > Date.now()) {
            this.cache.set(key, value);
          }
        });
        console.log(`📦 ${this.cache.size} itens carregados do cache persistente`);
      }
    } catch (error) {
      console.warn('⚠️ Erro ao carregar cache:', error);
    }
  }

  saveToLocalStorage() {
    try {
      // Converter Map para objeto simples
      const data = {};
      this.cache.forEach((value, key) => {
        data[key] = value;
      });
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        console.warn('⚠️ localStorage cheio, limpando cache...');
        this.clear();
      } else {
        console.warn('⚠️ Erro ao salvar cache:', error);
      }
    }
  }

  startCleanupInterval() {
    // Limpar cache expirado a cada 5 minutos
    setInterval(() => {
      this.cleanExpired();
    }, 5 * 60 * 1000);

    // Salvar cache a cada 30 segundos
    setInterval(() => {
      this.saveToLocalStorage();
    }, 30000);
  }

  cleanExpired() {
    const now = Date.now();
    let cleaned = 0;

    this.cache.forEach((value, key) => {
      if (value.expiresAt < now) {
        this.cache.delete(key);
        cleaned++;
      }
    });

    if (cleaned > 0) {
      console.log(`🗑️ ${cleaned} itens expirados removidos do cache`);
      this.saveToLocalStorage();
    }
  }

  generateKey(collection, query = {}) {
    // Gerar chave única baseada na collection e query
    const queryStr = JSON.stringify(query);
    return `${collection}:${queryStr}`;
  }

  set(collection, data, query = {}) {
    const key = this.generateKey(collection, query);
    const cacheEntry = {
      data: data,
      cachedAt: Date.now(),
      expiresAt: Date.now() + this.cacheTimeout
    };

    this.cache.set(key, cacheEntry);

    // Salvar em localStorage (assíncrono para não bloquear)
    setTimeout(() => this.saveToLocalStorage(), 0);
  }

  get(collection, query = {}) {
    const key = this.generateKey(collection, query);
    const cached = this.cache.get(key);

    if (!cached) {
      return null;
    }

    // Verificar se expirou
    if (cached.expiresAt < Date.now()) {
      this.cache.delete(key);
      return null;
    }

    console.log(`💨 Cache HIT: ${key} (age: ${Math.floor((Date.now() - cached.cachedAt) / 1000)}s)`);
    return cached.data;
  }

  invalidate(collection, query = null) {
    if (query) {
      // Invalidar query específica
      const key = this.generateKey(collection, query);
      this.cache.delete(key);
      console.log(`🗑️ Cache invalidado: ${key}`);
    } else {
      // Invalidar toda a collection
      const keysToDelete = [];
      this.cache.forEach((value, key) => {
        if (key.startsWith(`${collection}:`)) {
          keysToDelete.push(key);
        }
      });
      keysToDelete.forEach(key => this.cache.delete(key));
      console.log(`🗑️ Cache invalidado: ${collection} (${keysToDelete.length} itens)`);
    }

    this.saveToLocalStorage();
  }

  clear() {
    this.cache.clear();
    localStorage.removeItem(this.storageKey);
    console.log('🗑️ Cache limpo completamente');
  }

  getStats() {
    const now = Date.now();
    let validEntries = 0;
    let expiredEntries = 0;
    let totalSize = 0;

    this.cache.forEach((value, key) => {
      if (value.expiresAt > now) {
        validEntries++;
      } else {
        expiredEntries++;
      }

      // Estimar tamanho
      totalSize += JSON.stringify(value).length;
    });

    return {
      entries: this.cache.size,
      valid: validEntries,
      expired: expiredEntries,
      sizeBytes: totalSize,
      sizeKB: (totalSize / 1024).toFixed(2),
      timeout: this.cacheTimeout
    };
  }

  printStats() {
    const stats = this.getStats();
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🚀 SENAI Lab - Firestore Cache Stats');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Total entries: ${stats.entries}`);
    console.log(`Valid: ${stats.valid} | Expired: ${stats.expired}`);
    console.log(`Size: ${stats.sizeKB} KB`);
    console.log(`Timeout: ${stats.timeout / 1000}s`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  }
}

// 🌐 INSTÂNCIA GLOBAL
window.FirestoreCache = FirestoreCache;
window.firestoreCache = new FirestoreCache();

// Comandos úteis
window.showCacheStats = () => window.firestoreCache.printStats();
window.clearCache = () => window.firestoreCache.clear();

console.log('💡 Comandos disponíveis:');
console.log('  - showCacheStats() - Mostrar estatísticas do cache');
console.log('  - clearCache() - Limpar todo o cache');
