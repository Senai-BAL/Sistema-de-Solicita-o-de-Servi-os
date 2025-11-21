/* 📊 SENAI Lab - Monitoramento de Quotas Firebase
 * Arquivo: public/shared/quota-monitor.js
 * Descrição: Monitora uso de Firestore e Storage para evitar exceder Free Tier
 * Versão: v3.1.0
 */

class QuotaMonitor {
  constructor() {
    this.storageKey = 'senai_quota_stats';
    this.stats = this.loadStats();
    this.limits = {
      firestore: {
        reads: 50000,      // por dia
        writes: 20000,     // por dia
        deletes: 20000     // por dia
      },
      storage: {
        uploads: 20000,    // por dia
        size: 5 * 1024 * 1024 * 1024  // 5GB total
      }
    };

    this.resetIfNewDay();
    this.startAutoSave();

    console.log('📊 Quota Monitor inicializado');
  }

  loadStats() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        const stats = JSON.parse(saved);
        return stats;
      }
    } catch (error) {
      console.warn('⚠️ Erro ao carregar stats de quota:', error);
    }

    return this.createEmptyStats();
  }

  createEmptyStats() {
    return {
      date: new Date().toISOString().split('T')[0],
      firestore: {
        reads: 0,
        writes: 0,
        deletes: 0
      },
      storage: {
        uploads: 0,
        totalSize: 0
      },
      history: []
    };
  }

  resetIfNewDay() {
    const today = new Date().toISOString().split('T')[0];
    if (this.stats.date !== today) {
      // Salvar histórico
      this.stats.history.push({
        date: this.stats.date,
        firestore: { ...this.stats.firestore },
        storage: { uploads: this.stats.storage.uploads }
      });

      // Manter apenas últimos 30 dias
      if (this.stats.history.length > 30) {
        this.stats.history = this.stats.history.slice(-30);
      }

      // Reset contadores diários
      this.stats.date = today;
      this.stats.firestore = { reads: 0, writes: 0, deletes: 0 };
      this.stats.storage.uploads = 0;

      this.saveStats();
      console.log('🔄 Quotas resetadas para novo dia');
    }
  }

  saveStats() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.stats));
    } catch (error) {
      console.error('❌ Erro ao salvar stats de quota:', error);
    }
  }

  startAutoSave() {
    // Salvar a cada 30 segundos
    setInterval(() => {
      this.saveStats();
    }, 30000);
  }

  // 📖 FIRESTORE OPERATIONS
  trackRead(count = 1) {
    this.stats.firestore.reads += count;
    this.checkLimits();
  }

  trackWrite(count = 1) {
    this.stats.firestore.writes += count;
    this.checkLimits();
  }

  trackDelete(count = 1) {
    this.stats.firestore.deletes += count;
    this.checkLimits();
  }

  // 📦 STORAGE OPERATIONS
  trackUpload(fileSize) {
    this.stats.storage.uploads += 1;
    this.stats.storage.totalSize += fileSize;
    this.checkLimits();
  }

  // ⚠️ VERIFICAÇÃO DE LIMITES
  checkLimits() {
    const warnings = [];

    // Firestore Reads
    const readsPercent = (this.stats.firestore.reads / this.limits.firestore.reads) * 100;
    if (readsPercent >= 70) {
      warnings.push({
        type: 'firestore-reads',
        message: `Firestore Reads: ${readsPercent.toFixed(1)}% usado (${this.stats.firestore.reads}/${this.limits.firestore.reads})`,
        level: readsPercent >= 90 ? 'critical' : 'warning'
      });
    }

    // Firestore Writes
    const writesPercent = (this.stats.firestore.writes / this.limits.firestore.writes) * 100;
    if (writesPercent >= 70) {
      warnings.push({
        type: 'firestore-writes',
        message: `Firestore Writes: ${writesPercent.toFixed(1)}% usado (${this.stats.firestore.writes}/${this.limits.firestore.writes})`,
        level: writesPercent >= 90 ? 'critical' : 'warning'
      });
    }

    // Storage Uploads
    const uploadsPercent = (this.stats.storage.uploads / this.limits.storage.uploads) * 100;
    if (uploadsPercent >= 70) {
      warnings.push({
        type: 'storage-uploads',
        message: `Storage Uploads: ${uploadsPercent.toFixed(1)}% usado (${this.stats.storage.uploads}/${this.limits.storage.uploads})`,
        level: uploadsPercent >= 90 ? 'critical' : 'warning'
      });
    }

    // Storage Size
    const sizePercent = (this.stats.storage.totalSize / this.limits.storage.size) * 100;
    if (sizePercent >= 70) {
      warnings.push({
        type: 'storage-size',
        message: `Storage Size: ${sizePercent.toFixed(1)}% usado (${this.formatBytes(this.stats.storage.totalSize)}/${this.formatBytes(this.limits.storage.size)})`,
        level: sizePercent >= 90 ? 'critical' : 'warning'
      });
    }

    // Mostrar avisos
    warnings.forEach(warning => {
      if (warning.level === 'critical') {
        console.error(`🚨 ${warning.message}`);
        this.showAlert(warning);
      } else {
        console.warn(`⚠️ ${warning.message}`);
      }
    });
  }

  showAlert(warning) {
    // Mostrar apenas uma vez por dia para cada tipo de warning
    const alertKey = `quota_alert_${warning.type}_${this.stats.date}`;
    if (localStorage.getItem(alertKey)) {
      return; // Já mostrou hoje
    }

    if (typeof ToastManager !== 'undefined') {
      ToastManager.show(warning.message, 'warning', 10000);
    } else {
      alert(`⚠️ ALERTA DE QUOTA\n\n${warning.message}\n\nConsidere reduzir o uso para não exceder o Free Tier.`);
    }

    localStorage.setItem(alertKey, 'shown');
  }

  // 📊 RELATÓRIOS
  getStats() {
    return {
      today: {
        firestore: {
          reads: this.stats.firestore.reads,
          writes: this.stats.firestore.writes,
          deletes: this.stats.firestore.deletes,
          readsPercent: (this.stats.firestore.reads / this.limits.firestore.reads * 100).toFixed(1),
          writesPercent: (this.stats.firestore.writes / this.limits.firestore.writes * 100).toFixed(1)
        },
        storage: {
          uploads: this.stats.storage.uploads,
          totalSize: this.stats.storage.totalSize,
          uploadsPercent: (this.stats.storage.uploads / this.limits.storage.uploads * 100).toFixed(1),
          sizePercent: (this.stats.storage.totalSize / this.limits.storage.size * 100).toFixed(1)
        }
      },
      limits: this.limits,
      history: this.stats.history
    };
  }

  printReport() {
    const stats = this.getStats();
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 SENAI Lab - Quota Usage Report');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📅 Date: ${this.stats.date}`);
    console.log('');
    console.log('🔥 Firestore:');
    console.log(`  Reads:   ${stats.today.firestore.reads.toLocaleString()} / ${this.limits.firestore.reads.toLocaleString()} (${stats.today.firestore.readsPercent}%)`);
    console.log(`  Writes:  ${stats.today.firestore.writes.toLocaleString()} / ${this.limits.firestore.writes.toLocaleString()} (${stats.today.firestore.writesPercent}%)`);
    console.log(`  Deletes: ${stats.today.firestore.deletes.toLocaleString()} / ${this.limits.firestore.deletes.toLocaleString()}`);
    console.log('');
    console.log('📦 Storage:');
    console.log(`  Uploads: ${stats.today.storage.uploads.toLocaleString()} / ${this.limits.storage.uploads.toLocaleString()} (${stats.today.storage.uploadsPercent}%)`);
    console.log(`  Size:    ${this.formatBytes(stats.today.storage.totalSize)} / ${this.formatBytes(this.limits.storage.size)} (${stats.today.storage.sizePercent}%)`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// 🌐 INSTÂNCIA GLOBAL
window.QuotaMonitor = QuotaMonitor;

// Inicializar apenas se habilitado no ambiente
if (window.ENV && window.ENV.config.enableQuotaMonitor) {
  window.quotaMonitor = new QuotaMonitor();

  // Mostrar relatório no console
  window.quotaMonitor.printReport();

  // Comando útil para debug
  window.showQuotaReport = () => window.quotaMonitor.printReport();
  console.log('💡 Use showQuotaReport() para ver relatório de quotas');
}
