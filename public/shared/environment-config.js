/* 🌍 SENAI Lab - Configuração de Ambientes
 * Arquivo: public/shared/environment-config.js
 * Descrição: Detecção automática de ambiente e configuração
 * Versão: v3.1.0
 */

// 🔍 DETECTOR DE AMBIENTE
class EnvironmentDetector {
  constructor() {
    this.environment = this.detectEnvironment();
    this.config = this.getEnvironmentConfig();

    console.log(`🌍 Ambiente detectado: ${this.environment}`);
    console.log(`📦 Configuração:`, this.config);
  }

  detectEnvironment() {
    const hostname = window.location.hostname;

    // Development - Firebase Emulators ou localhost
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'development';
    }

    // Staging - Subdomínio staging ou URL específica
    if (hostname.includes('staging') || hostname.includes('-staging')) {
      return 'staging';
    }

    // Production - Firebase Hosting
    if (hostname.includes('web.app') || hostname.includes('firebaseapp.com')) {
      return 'production';
    }

    // Default para production (custom domain)
    return 'production';
  }

  getEnvironmentConfig() {
    const configs = {
      development: {
        name: 'Development',
        useEmulators: true,
        firestoreCollection: 'solicitacoes_dev',
        storagePath: 'development',
        debugMode: true,
        cacheTimeout: 60 * 1000, // 1 minuto para testar cache
        enableBackup: true, // Habilitar para testes
        enableQuotaMonitor: true, // Habilitar para testes
        maxFileSize: 10 * 1024 * 1024, // 10MB
        compressionQuality: 0.8
      },
      staging: {
        name: 'Staging',
        useEmulators: false,
        firestoreCollection: 'solicitacoes_staging',
        storagePath: 'staging',
        debugMode: true,
        cacheTimeout: 60 * 1000, // 1 minuto
        enableBackup: true,
        enableQuotaMonitor: true,
        maxFileSize: 5 * 1024 * 1024, // 5MB
        compressionQuality: 0.7
      },
      production: {
        name: 'Production',
        useEmulators: false,
        firestoreCollection: 'solicitacoes',
        storagePath: 'production',
        debugMode: false,
        cacheTimeout: 5 * 60 * 1000, // 5 minutos
        enableBackup: true,
        enableQuotaMonitor: true,
        maxFileSize: 5 * 1024 * 1024, // 5MB
        compressionQuality: 0.7
      }
    };

    return configs[this.environment];
  }

  isProduction() {
    return this.environment === 'production';
  }

  isDevelopment() {
    return this.environment === 'development';
  }

  isStaging() {
    return this.environment === 'staging';
  }

  getCollectionName() {
    return this.config.firestoreCollection;
  }

  getStoragePath() {
    return this.config.storagePath;
  }

  shouldUseEmulators() {
    return this.config.useEmulators;
  }

  getCacheTimeout() {
    return this.config.cacheTimeout;
  }

  isDebugMode() {
    return this.config.debugMode;
  }
}

// 🌐 INSTÂNCIA GLOBAL
window.EnvironmentDetector = EnvironmentDetector;
window.ENV = new EnvironmentDetector();

// 🎨 ADICIONAR INDICADOR VISUAL DE AMBIENTE (apenas dev/staging)
if (!window.ENV.isProduction()) {
  const indicator = document.createElement('div');
  indicator.id = 'env-indicator';
  indicator.innerHTML = `
    <style>
      #env-indicator {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: ${window.ENV.isDevelopment() ? '#4CAF50' : '#FF9800'};
        color: white;
        text-align: center;
        padding: 4px 8px;
        font-size: 12px;
        font-weight: bold;
        z-index: 999999;
        font-family: monospace;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      }
      body {
        padding-top: 28px !important;
      }
    </style>
    🌍 ${window.ENV.config.name.toUpperCase()} MODE
    ${window.ENV.shouldUseEmulators() ? ' | 🔧 Emulators Active' : ''}
    | Collection: ${window.ENV.getCollectionName()}
  `;
  document.addEventListener('DOMContentLoaded', () => {
    document.body.insertBefore(indicator, document.body.firstChild);
  });
}

// 📊 LOG DE INICIALIZAÇÃO
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('🌍 SENAI Lab - Environment Configuration');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`Environment: ${window.ENV.environment}`);
console.log(`Collection: ${window.ENV.getCollectionName()}`);
console.log(`Storage Path: ${window.ENV.getStoragePath()}`);
console.log(`Use Emulators: ${window.ENV.shouldUseEmulators()}`);
console.log(`Debug Mode: ${window.ENV.isDebugMode()}`);
console.log(`Cache Timeout: ${window.ENV.getCacheTimeout()}ms`);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
