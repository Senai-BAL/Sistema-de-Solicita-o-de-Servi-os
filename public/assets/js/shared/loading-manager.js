// ⏳ SENAI Lab - Sistema de Loading Avançado
// Arquivo: public/assets/js/shared/loading-manager.js
// Descrição: Gerenciamento de estados de loading com overlay e progresso

class LoadingManager {
  static overlay = null;
  static isVisible = false;
  static progressBar = null;
  static currentStep = 0;
  static totalSteps = 0;

  // 🚀 INICIALIZAR OVERLAY
  static init() {
    if (this.overlay) return;

    this.overlay = document.createElement('div');
    this.overlay.className = 'loading-overlay';
    this.overlay.id = 'loadingOverlay';
    this.overlay.style.display = 'none';
    
    this.overlay.innerHTML = `
      <div class="loading-content">
        <div class="loading-spinner"></div>
        <div class="loading-message">Carregando...</div>
        <div class="loading-progress" style="display: none;">
          <div class="progress-bar">
            <div class="progress-fill"></div>
          </div>
          <div class="progress-text">0%</div>
        </div>
        <div class="loading-details" style="display: none;"></div>
      </div>
    `;

    document.body.appendChild(this.overlay);
    this.progressBar = this.overlay.querySelector('.progress-fill');
  }

  // 👁️ MOSTRAR LOADING
  static show(message = 'Carregando...', showProgress = false) {
    this.init();

    const messageElement = this.overlay.querySelector('.loading-message');
    const progressElement = this.overlay.querySelector('.loading-progress');
    
    if (messageElement) {
      messageElement.textContent = message;
    }

    if (showProgress) {
      progressElement.style.display = 'block';
      this.setProgress(0);
    } else {
      progressElement.style.display = 'none';
    }

    this.overlay.style.display = 'flex';
    this.isVisible = true;

    // Prevenir scroll do body
    document.body.style.overflow = 'hidden';
  }

  // 🙈 OCULTAR LOADING
  static hide() {
    if (this.overlay) {
      this.overlay.style.display = 'none';
      this.isVisible = false;
      this.currentStep = 0;
      this.totalSteps = 0;

      // Restaurar scroll do body
      document.body.style.overflow = '';
      
      // Ocultar detalhes
      const detailsElement = this.overlay.querySelector('.loading-details');
      if (detailsElement) {
        detailsElement.style.display = 'none';
        detailsElement.textContent = '';
      }
    }
  }

  // 🔄 ATUALIZAR MENSAGEM
  static updateMessage(message, details = '') {
    if (this.overlay && this.isVisible) {
      const messageElement = this.overlay.querySelector('.loading-message');
      const detailsElement = this.overlay.querySelector('.loading-details');
      
      if (messageElement) {
        messageElement.textContent = message;
      }
      
      if (details && detailsElement) {
        detailsElement.textContent = details;
        detailsElement.style.display = 'block';
      }
    }
  }

  // 📊 DEFINIR PROGRESSO
  static setProgress(percentage, stepMessage = '') {
    if (this.overlay && this.isVisible) {
      const progressBar = this.overlay.querySelector('.progress-fill');
      const progressText = this.overlay.querySelector('.progress-text');
      
      if (progressBar) {
        progressBar.style.width = `${Math.min(100, Math.max(0, percentage))}%`;
      }
      
      if (progressText) {
        progressText.textContent = `${Math.round(percentage)}%`;
      }
      
      if (stepMessage) {
        this.updateMessage(stepMessage);
      }
    }
  }

  // 🪜 PROGRESSO POR ETAPAS
  static setSteps(total) {
    this.totalSteps = total;
    this.currentStep = 0;
    this.setProgress(0);
  }

  static nextStep(message = '') {
    if (this.totalSteps > 0) {
      this.currentStep++;
      const percentage = (this.currentStep / this.totalSteps) * 100;
      this.setProgress(percentage, message);
    }
  }

  // 📂 PROGRESSO DE UPLOAD
  static showUploadProgress(filename, percentage) {
    this.show(`Enviando: ${filename}`, true);
    this.setProgress(percentage, `${Math.round(percentage)}% concluído`);
  }

  // 🔄 LOADING PARA OPERAÇÕES ESPECÍFICAS
  static showForOperation(operation, details = '') {
    const messages = {
      'save': 'Salvando dados...',
      'load': 'Carregando informações...',
      'delete': 'Removendo item...',
      'upload': 'Enviando arquivo...',
      'download': 'Baixando arquivo...',
      'search': 'Pesquisando...',
      'filter': 'Aplicando filtros...',
      'export': 'Gerando arquivo...',
      'import': 'Importando dados...',
      'backup': 'Criando backup...',
      'cleanup': 'Otimizando sistema...',
      'auth': 'Verificando permissões...'
    };

    const message = messages[operation] || 'Processando...';
    this.show(message);
    
    if (details) {
      this.updateMessage(message, details);
    }
  }

  // 📊 STATUS
  static getStatus() {
    return {
      isVisible: this.isVisible,
      message: this.overlay?.querySelector('.loading-message')?.textContent || '',
      progress: this.currentStep,
      totalSteps: this.totalSteps
    };
  }

  // 🕐 LOADING COM TIMEOUT
  static showWithTimeout(message = 'Carregando...', timeout = 30000) {
    this.show(message);
    
    setTimeout(() => {
      if (this.isVisible) {
        this.hide();
        console.warn('⚠️ Loading removido por timeout após', timeout / 1000, 'segundos');
        
        if (window.ToastManager) {
          ToastManager.show('Operação demorou mais que o esperado e foi cancelada', 'warning');
        }
      }
    }, timeout);
  }

  // 🧪 SKELETON LOADING (Placeholder visual)
  static showSkeleton(targetElement, type = 'card') {
    if (typeof targetElement === 'string') {
      targetElement = document.querySelector(targetElement);
    }
    
    if (!targetElement) return;

    const skeletons = {
      'card': `
        <div class="skeleton-card">
          <div class="skeleton-line skeleton-title"></div>
          <div class="skeleton-line skeleton-text"></div>
          <div class="skeleton-line skeleton-text short"></div>
        </div>
      `,
      'table': `
        <div class="skeleton-table">
          <div class="skeleton-row">
            <div class="skeleton-cell"></div>
            <div class="skeleton-cell"></div>
            <div class="skeleton-cell"></div>
          </div>
        </div>
      `,
      'list': `
        <div class="skeleton-list">
          <div class="skeleton-item"></div>
          <div class="skeleton-item"></div>
          <div class="skeleton-item"></div>
        </div>
      `
    };

    targetElement.innerHTML = skeletons[type] || skeletons['card'];
    targetElement.classList.add('skeleton-loading');
  }

  static hideSkeleton(targetElement) {
    if (typeof targetElement === 'string') {
      targetElement = document.querySelector(targetElement);
    }
    
    if (targetElement) {
      targetElement.classList.remove('skeleton-loading');
    }
  }
}

// 🌐 DISPONIBILIZAR GLOBALMENTE
window.LoadingManager = LoadingManager;


