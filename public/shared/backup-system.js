/* 💾 SENAI Lab - Sistema de Backup Automatizado
 * Arquivo: public/shared/backup-system.js
 * Descrição: Backup automático e manual para Firestore (evitar perda de dados)
 * Versão: v3.1.0
 */

class BackupSystem {
  constructor(firebaseService) {
    this.firebaseService = firebaseService;
    this.storageKey = 'senai_backup_';
    this.backupInterval = 24 * 60 * 60 * 1000; // 24 horas
    this.maxLocalBackups = 7; // Manter últimos 7 backups locais

    console.log('💾 Backup System inicializado');

    // Iniciar backup automático se habilitado
    if (window.ENV && window.ENV.config.enableBackup) {
      this.startAutoBackup();
    }
  }

  startAutoBackup() {
    // Em desenvolvimento, não fazer backup imediato (evitar erro de inicialização)
    // Aguardar 5 segundos para garantir que Firebase está totalmente pronto
    const isDev = window.ENV && window.ENV.isDevelopment();
    const initialDelay = isDev ? 5000 : 1000;

    setTimeout(() => {
      this.checkAndBackup();
    }, initialDelay);

    // Agendar próximo backup
    setInterval(() => {
      this.checkAndBackup();
    }, this.backupInterval);

    console.log(`🔄 Backup automático ativado (a cada 24h, delay inicial: ${initialDelay}ms)`);
  }

  async checkAndBackup() {
    const lastBackup = localStorage.getItem('senai_last_backup');
    const now = Date.now();

    if (!lastBackup || (now - parseInt(lastBackup)) > this.backupInterval) {
      console.log('💾 Executando backup automático...');
      await this.createBackup('auto');
      localStorage.setItem('senai_last_backup', now.toString());
    }
  }

  async createBackup(type = 'manual') {
    try {
      console.log(`💾 Criando backup (${type})...`);

      const startTime = Date.now();
      const collectionName = window.ENV ? window.ENV.getCollectionName() : 'solicitacoes';

      // Buscar todos os dados
      const snapshot = await this.firebaseService.db
        .collection(collectionName)
        .get();

      // Track reads
      if (window.quotaMonitor) {
        window.quotaMonitor.trackRead(snapshot.size);
      }

      // Converter para JSON
      const data = [];
      snapshot.forEach(doc => {
        data.push({
          id: doc.id,
          ...doc.data()
        });
      });

      const backup = {
        version: '3.1.0',
        environment: window.ENV ? window.ENV.environment : 'unknown',
        collection: collectionName,
        timestamp: new Date().toISOString(),
        type: type,
        documentsCount: data.length,
        data: data
      };

      const backupSize = new Blob([JSON.stringify(backup)]).size;

      console.log(`✅ Backup criado: ${data.length} documentos (${this.formatBytes(backupSize)})`);
      console.log(`⏱️ Tempo: ${Date.now() - startTime}ms`);

      // Salvar localmente
      await this.saveLocal(backup);

      // Opcionalmente salvar no GitHub (se configurado)
      if (type === 'manual' && window.GITHUB_CONFIG) {
        await this.saveToGitHub(backup);
      }

      return backup;

    } catch (error) {
      console.error('❌ Erro ao criar backup:', error);
      throw error;
    }
  }

  async saveLocal(backup) {
    try {
      const key = `${this.storageKey}${backup.timestamp}`;
      localStorage.setItem(key, JSON.stringify(backup));

      // Limpar backups antigos
      this.cleanOldBackups();

      console.log(`💾 Backup salvo localmente: ${key}`);
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        console.warn('⚠️ localStorage cheio, limpando backups antigos...');
        this.cleanOldBackups(2); // Manter apenas 2 backups
        // Tentar novamente
        const key = `${this.storageKey}${backup.timestamp}`;
        localStorage.setItem(key, JSON.stringify(backup));
      } else {
        throw error;
      }
    }
  }

  cleanOldBackups(keepCount = this.maxLocalBackups) {
    const backupKeys = Object.keys(localStorage)
      .filter(key => key.startsWith(this.storageKey))
      .sort()
      .reverse(); // Mais recentes primeiro

    // Remover backups excedentes
    for (let i = keepCount; i < backupKeys.length; i++) {
      localStorage.removeItem(backupKeys[i]);
      console.log(`🗑️ Backup antigo removido: ${backupKeys[i]}`);
    }
  }

  listBackups() {
    const backups = Object.keys(localStorage)
      .filter(key => key.startsWith(this.storageKey))
      .map(key => {
        try {
          const backup = JSON.parse(localStorage.getItem(key));
          return {
            key: key,
            timestamp: backup.timestamp,
            type: backup.type,
            collection: backup.collection,
            documentsCount: backup.documentsCount,
            environment: backup.environment
          };
        } catch {
          return null;
        }
      })
      .filter(b => b !== null)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return backups;
  }

  async restoreBackup(backupKey) {
    if (!confirm('⚠️ ATENÇÃO: Restaurar backup irá SOBRESCREVER todos os dados atuais!\n\nDeseja continuar?')) {
      return;
    }

    try {
      console.log(`💾 Restaurando backup: ${backupKey}...`);

      const backupData = localStorage.getItem(backupKey);
      if (!backupData) {
        throw new Error('Backup não encontrado');
      }

      const backup = JSON.parse(backupData);
      const collectionName = window.ENV ? window.ENV.getCollectionName() : backup.collection;

      console.log(`📦 Restaurando ${backup.documentsCount} documentos para ${collectionName}...`);

      // Restaurar cada documento
      let restored = 0;
      const batch = this.firebaseService.db.batch();

      for (const doc of backup.data) {
        const docRef = this.firebaseService.db.collection(collectionName).doc(doc.id);
        const { id, ...data } = doc; // Remover ID do data
        batch.set(docRef, data);
        restored++;

        // Batch tem limite de 500 operações
        if (restored % 500 === 0) {
          await batch.commit();
          console.log(`✅ ${restored} documentos restaurados...`);

          // Track writes
          if (window.quotaMonitor) {
            window.quotaMonitor.trackWrite(500);
          }
        }
      }

      // Commit restante
      await batch.commit();

      // Track writes finais
      if (window.quotaMonitor) {
        window.quotaMonitor.trackWrite(restored % 500);
      }

      console.log(`✅ Backup restaurado: ${restored} documentos`);
      alert(`✅ Backup restaurado com sucesso!\n\n${restored} documentos foram restaurados.`);

      // Recarregar página
      location.reload();

    } catch (error) {
      console.error('❌ Erro ao restaurar backup:', error);
      alert(`❌ Erro ao restaurar backup:\n\n${error.message}`);
      throw error;
    }
  }

  async downloadBackup(backupKey = null) {
    try {
      let backup;

      if (backupKey) {
        // Download de backup existente
        const backupData = localStorage.getItem(backupKey);
        if (!backupData) {
          throw new Error('Backup não encontrado');
        }
        backup = JSON.parse(backupData);
      } else {
        // Criar novo backup para download
        backup = await this.createBackup('manual_download');
      }

      // Criar arquivo JSON
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      // Criar link de download
      const a = document.createElement('a');
      a.href = url;
      a.download = `senai-lab-backup-${backup.timestamp.replace(/:/g, '-')}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      console.log(`📥 Download iniciado: ${a.download}`);

    } catch (error) {
      console.error('❌ Erro ao fazer download do backup:', error);
      throw error;
    }
  }

  async uploadBackup(file) {
    try {
      console.log(`📤 Carregando backup: ${file.name}...`);

      const text = await file.text();
      const backup = JSON.parse(text);

      // Validar estrutura
      if (!backup.version || !backup.data || !Array.isArray(backup.data)) {
        throw new Error('Arquivo de backup inválido');
      }

      console.log(`✅ Backup válido: ${backup.documentsCount} documentos`);
      console.log(`📅 Data: ${backup.timestamp}`);
      console.log(`🌍 Ambiente: ${backup.environment}`);

      if (confirm(`Deseja restaurar este backup?\n\n${backup.documentsCount} documentos\nData: ${new Date(backup.timestamp).toLocaleString()}`)) {
        // Salvar temporariamente e restaurar
        const tempKey = `${this.storageKey}uploaded_${Date.now()}`;
        localStorage.setItem(tempKey, text);
        await this.restoreBackup(tempKey);
      }

    } catch (error) {
      console.error('❌ Erro ao carregar backup:', error);
      alert(`❌ Erro ao carregar backup:\n\n${error.message}`);
      throw error;
    }
  }

  async saveToGitHub(backup) {
    // TODO: Implementar integração com GitHub API
    // Por enquanto, apenas log
    console.log('📤 GitHub backup não implementado ainda');
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  printBackupList() {
    const backups = this.listBackups();
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('💾 SENAI Lab - Backups Disponíveis');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    if (backups.length === 0) {
      console.log('Nenhum backup encontrado');
    } else {
      backups.forEach((backup, index) => {
        console.log(`${index + 1}. ${new Date(backup.timestamp).toLocaleString()}`);
        console.log(`   Tipo: ${backup.type} | Docs: ${backup.documentsCount} | Env: ${backup.environment}`);
      });
    }
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('💡 Use backupSystem.downloadBackup() para baixar');
    console.log('💡 Use backupSystem.restoreBackup(key) para restaurar');
  }
}

// 🌐 INSTÂNCIA GLOBAL
window.BackupSystem = BackupSystem;

// Comandos úteis para debug (apenas se BackupSystem for instanciado)
if (window.backupSystem) {
  window.createBackup = () => window.backupSystem.createBackup('manual');
  window.listBackups = () => window.backupSystem.printBackupList();
  window.downloadBackup = () => window.backupSystem.downloadBackup();

  console.log('💡 Comandos de Backup disponíveis:');
  console.log('  - createBackup() - Criar backup manual');
  console.log('  - listBackups() - Listar backups');
  console.log('  - downloadBackup() - Baixar backup');
}
