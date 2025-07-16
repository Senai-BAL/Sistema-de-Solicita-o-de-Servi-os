// ⏳ SENAI Lab - Sistema de Loading
// Arquivo: public/assets/js/shared/loading-manager.js
// Descrição: Gerenciamento de estados de loading com overlay

export class LoadingManager {
  static overlay = null;
  static isVisible = false;

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
      </div>
    `;

    document.body.appendChild(this.overlay);
  }

  // 👁️ MOSTRAR LOADING
  static show(message = 'Carregando...') {
    this.init();

    const messageElement = this.overlay.querySelector('.loading-message');
    if (messageElement) {
      messageElement.textContent = message;
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

      // Restaurar scroll do body
      document.body.style.overflow = '';
    }
  }

  // 🔄 ATUALIZAR MENSAGEM
  static updateMessage(message) {
    if (this.overlay && this.isVisible) {
      const messageElement = this.overlay.querySelector('.loading-message');
      if (messageElement) {
        messageElement.textContent = message;
      }
    }
  }

  // 📊 STATUS
  static getStatus() {
    return {
      isVisible: this.isVisible,
      message: this.overlay?.querySelector('.loading-message')?.textContent || ''
    };
  }

  // 🕐 LOADING COM TIMEOUT
  static showWithTimeout(message = 'Carregando...', timeout = 30000) {
    this.show(message);
    
    setTimeout(() => {
      if (this.isVisible) {
        this.hide();
        console.warn('Loading removido por timeout');
      }
    }, timeout);
  }
}

// 🌐 DISPONIBILIZAR GLOBALMENTE
window.LoadingManager = LoadingManager;

console.log('✅ Loading Manager Module carregado com sucesso');
