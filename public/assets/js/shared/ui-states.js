// 🎯 SENAI Lab - Sistema de Estados de UI
// Arquivo: public/assets/js/shared/ui-states.js
// Descrição: Gerenciamento centralizado de estados visuais e transições

class UIStates {
  static states = new Map();
  static transitions = new Map();
  static observers = new Set();

  // 🚀 INICIALIZAR SISTEMA
  static init() {
    this.injectCSS();
    this.setupGlobalStates();

  }

  // 🎨 ESTILOS PARA ESTADOS
  static injectCSS() {
    if (document.getElementById('ui-states-styles')) return;

    const style = document.createElement('style');
    style.id = 'ui-states-styles';
    style.textContent = `
      /* 🎯 ESTADOS BASE */
      .ui-state {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      /* 📱 ESTADOS DE CARREGAMENTO */
      .ui-loading {
        position: relative;
        pointer-events: none;
        opacity: 0.6;
      }

      .ui-loading-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 100;
        backdrop-filter: blur(2px);
      }

      .ui-loading-spinner {
        width: 24px;
        height: 24px;
        border: 3px solid #e0e0e0;
        border-top: 3px solid #007bff;
        border-radius: 50%;
        animation: ui-spin 1s linear infinite;
      }

      @keyframes ui-spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      /* ✅ ESTADO DE SUCESSO */
      .ui-success {
        border-color: #28a745 !important;
        background-color: rgba(40, 167, 69, 0.1) !important;
        animation: ui-success-pulse 0.6s ease;
      }

      @keyframes ui-success-pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.02); }
      }

      .ui-success-message {
        color: #155724;
        background: #d4edda;
        border: 1px solid #c3e6cb;
        padding: 8px 12px;
        border-radius: 4px;
        margin-top: 8px;
        animation: ui-slide-down 0.3s ease;
      }

      /* ❌ ESTADO DE ERRO */
      .ui-error {
        border-color: #dc3545 !important;
        background-color: rgba(220, 53, 69, 0.1) !important;
        animation: ui-shake 0.6s ease;
      }

      @keyframes ui-shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
      }

      .ui-error-message {
        color: #721c24;
        background: #f8d7da;
        border: 1px solid #f5c6cb;
        padding: 8px 12px;
        border-radius: 4px;
        margin-top: 8px;
        animation: ui-slide-down 0.3s ease;
      }

      /* ⚠️ ESTADO DE WARNING */
      .ui-warning {
        border-color: #ffc107 !important;
        background-color: rgba(255, 193, 7, 0.1) !important;
      }

      .ui-warning-message {
        color: #856404;
        background: #fff3cd;
        border: 1px solid #ffeaa7;
        padding: 8px 12px;
        border-radius: 4px;
        margin-top: 8px;
        animation: ui-slide-down 0.3s ease;
      }

      @keyframes ui-slide-down {
        from { 
          opacity: 0;
          transform: translateY(-10px);
        }
        to { 
          opacity: 1;
          transform: translateY(0);
        }
      }

      /* 💤 ESTADO INATIVO */
      .ui-inactive {
        opacity: 0.5;
        pointer-events: none;
        filter: grayscale(50%);
      }

      /* 🎯 ESTADO FOCADO */
      .ui-focused {
        box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
        border-color: #007bff;
        z-index: 10;
        position: relative;
      }

      /* 📍 ESTADO DESTACADO */
      .ui-highlighted {
        background: linear-gradient(45deg, rgba(255, 235, 59, 0.2), rgba(255, 235, 59, 0.1));
        border-left: 4px solid #ffeb3b;
        animation: ui-highlight-glow 2s infinite;
      }

      @keyframes ui-highlight-glow {
        0%, 100% { box-shadow: 0 0 10px rgba(255, 235, 59, 0.3); }
        50% { box-shadow: 0 0 20px rgba(255, 235, 59, 0.6); }
      }

      /* 🔄 ESTADOS DE TRANSIÇÃO */
      .ui-transition-fade {
        transition: opacity 0.3s ease;
      }

      .ui-transition-slide {
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .ui-transition-scale {
        transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      }

      /* 🎨 ESTADOS VISUAIS ESPECIAIS */
      .ui-pulse {
        animation: ui-pulse 2s infinite;
      }

      @keyframes ui-pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
      }

      .ui-bounce {
        animation: ui-bounce 1s ease;
      }

      @keyframes ui-bounce {
        0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
        40% { transform: translateY(-10px); }
        60% { transform: translateY(-5px); }
      }

      /* 📱 RESPONSIVIDADE */
      @media (max-width: 768px) {
        .ui-loading-overlay {
          backdrop-filter: blur(1px);
        }
        
        .ui-highlighted {
          border-left-width: 2px;
        }
      }

      /* 🎯 ESTADOS ESPECÍFICOS DE COMPONENTES */
      .ui-form-submitting {
        position: relative;
        overflow: hidden;
      }

      .ui-form-submitting::after {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 2px;
        background: linear-gradient(90deg, transparent, #007bff, transparent);
        animation: ui-progress-bar 2s infinite;
      }

      @keyframes ui-progress-bar {
        0% { left: -100%; }
        100% { left: 100%; }
      }

      .ui-card-loading {
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: ui-shimmer 1.5s infinite;
      }

      @keyframes ui-shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
    `;

    document.head.appendChild(style);
  }

  // 🎯 CONFIGURAR ESTADOS GLOBAIS
  static setupGlobalStates() {
    // Estados padrão para diferentes tipos de elementos
    this.defineState('button', {
      loading: ['ui-loading'],
      success: ['ui-success'],
      error: ['ui-error'],
      inactive: ['ui-inactive']
    });

    this.defineState('form', {
      submitting: ['ui-form-submitting', 'ui-loading'],
      success: ['ui-success'],
      error: ['ui-error']
    });

    this.defineState('card', {
      loading: ['ui-card-loading'],
      highlighted: ['ui-highlighted'],
      inactive: ['ui-inactive']
    });
  }

  // 📝 DEFINIR ESTADO
  static defineState(component, states) {
    this.states.set(component, states);
  }

  // 🎯 APLICAR ESTADO
  static setState(element, component, state, options = {}) {
    if (!element) return false;

    const { 
      duration = 3000, 
      message = null, 
      autoRevert = true,
      callback = null 
    } = options;

    // Limpar estados anteriores
    this.clearStates(element, component);

    // Aplicar novo estado
    const stateClasses = this.states.get(component)?.[state];
    if (!stateClasses) return false;

    stateClasses.forEach(cls => element.classList.add(cls));

    // Adicionar overlay de loading se necessário
    if (state === 'loading') {
      this.addLoadingOverlay(element);
    }

    // Adicionar mensagem se fornecida
    if (message) {
      this.addMessage(element, state, message);
    }

    // Auto-reverter estado
    if (autoRevert && duration > 0) {
      setTimeout(() => {
        this.clearStates(element, component);
        if (callback) callback();
      }, duration);
    }

    // Notificar observadores
    this.notifyObservers(element, component, state);

    return true;
  }

  // 🧹 LIMPAR ESTADOS
  static clearStates(element, component) {
    if (!element) return;

    const states = this.states.get(component);
    if (!states) return;

    // Remover todas as classes de estado
    Object.values(states).flat().forEach(cls => {
      element.classList.remove(cls);
    });

    // Remover overlay de loading
    this.removeLoadingOverlay(element);

    // Remover mensagens
    this.removeMessages(element);
  }

  // 🔄 ADICIONAR OVERLAY DE LOADING
  static addLoadingOverlay(element) {
    if (element.querySelector('.ui-loading-overlay')) return;

    const overlay = document.createElement('div');
    overlay.className = 'ui-loading-overlay';
    overlay.innerHTML = '<div class="ui-loading-spinner"></div>';
    
    element.style.position = element.style.position || 'relative';
    element.appendChild(overlay);
  }

  // ❌ REMOVER OVERLAY DE LOADING
  static removeLoadingOverlay(element) {
    const overlay = element.querySelector('.ui-loading-overlay');
    if (overlay) overlay.remove();
  }

  // 💬 ADICIONAR MENSAGEM
  static addMessage(element, state, message) {
    const messageEl = document.createElement('div');
    messageEl.className = `ui-${state}-message`;
    messageEl.textContent = message;
    
    element.appendChild(messageEl);
  }

  // 🗑️ REMOVER MENSAGENS
  static removeMessages(element) {
    const messages = element.querySelectorAll('[class*="-message"]');
    messages.forEach(msg => msg.remove());
  }

  // 👁️ ADICIONAR OBSERVADOR
  static addObserver(callback) {
    this.observers.add(callback);
  }

  // 📢 NOTIFICAR OBSERVADORES
  static notifyObservers(element, component, state) {
    this.observers.forEach(callback => {
      try {
        callback({ element, component, state, timestamp: Date.now() });
      } catch (error) {
        console.warn('Erro no observer UI State:', error);
      }
    });
  }

  // 🎯 MÉTODOS DE CONVENIÊNCIA

  // Botões
  static setButtonLoading(button, message = 'Processando...') {
    return this.setState(button, 'button', 'loading', { 
      message, 
      autoRevert: false 
    });
  }

  static setButtonSuccess(button, message = 'Sucesso!') {
    return this.setState(button, 'button', 'success', { 
      message, 
      duration: 2000 
    });
  }

  static setButtonError(button, message = 'Erro!') {
    return this.setState(button, 'button', 'error', { 
      message, 
      duration: 3000 
    });
  }

  // Formulários
  static setFormSubmitting(form) {
    return this.setState(form, 'form', 'submitting', { autoRevert: false });
  }

  static setFormSuccess(form, message = 'Formulário enviado com sucesso!') {
    return this.setState(form, 'form', 'success', { message, duration: 3000 });
  }

  static setFormError(form, message = 'Erro ao enviar formulário') {
    return this.setState(form, 'form', 'error', { message, duration: 4000 });
  }

  // Cards
  static setCardLoading(card) {
    return this.setState(card, 'card', 'loading', { autoRevert: false });
  }

  static highlightCard(card, duration = 5000) {
    return this.setState(card, 'card', 'highlighted', { duration });
  }

  // 🎨 TRANSIÇÕES ESPECIAIS
  static fadeOut(element, callback) {
    element.style.transition = 'opacity 0.3s ease';
    element.style.opacity = '0';
    setTimeout(() => {
      if (callback) callback();
      element.style.opacity = '';
      element.style.transition = '';
    }, 300);
  }

  static slideUp(element, callback) {
    element.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
    element.style.transform = 'translateY(-20px)';
    element.style.opacity = '0';
    setTimeout(() => {
      if (callback) callback();
      element.style.transform = '';
      element.style.opacity = '';
      element.style.transition = '';
    }, 300);
  }

  // 🔄 PROMISE WRAPPER PARA ASYNC OPERATIONS
  static async withState(element, component, operation, loadingMessage = null) {
    this.setState(element, component, 'loading', { 
      message: loadingMessage, 
      autoRevert: false 
    });

    try {
      const result = await operation();
      this.clearStates(element, component);
      this.setState(element, component, 'success', { duration: 2000 });
      return result;
    } catch (error) {
      this.clearStates(element, component);
      this.setState(element, component, 'error', { 
        message: error.message || 'Erro desconhecido',
        duration: 4000 
      });
      throw error;
    }
  }

  // 📊 ESTATÍSTICAS DE ESTADOS
  static getStateStats() {
    const activeStates = {};
    
    document.querySelectorAll('[class*="ui-"]').forEach(element => {
      const classes = Array.from(element.classList)
        .filter(cls => cls.startsWith('ui-'))
        .join(', ');
      
      if (classes) {
        activeStates[element.tagName] = activeStates[element.tagName] || [];
        activeStates[element.tagName].push(classes);
      }
    });

    return activeStates;
  }

  // 🧹 LIMPEZA GERAL
  static cleanup() {
    this.observers.clear();
    
    // Remover todos os overlays de loading
    document.querySelectorAll('.ui-loading-overlay').forEach(el => el.remove());
    
    // Remover todas as mensagens
    document.querySelectorAll('[class*="-message"]').forEach(el => el.remove());
    
    // Limpar classes de estado
    document.querySelectorAll('[class*="ui-"]').forEach(element => {
      Array.from(element.classList)
        .filter(cls => cls.startsWith('ui-'))
        .forEach(cls => element.classList.remove(cls));
    });
  }
}

// 🌐 DISPONIBILIZAR GLOBALMENTE
window.UIStates = UIStates;

// 🚀 INICIALIZAR AUTOMATICAMENTE
document.addEventListener('DOMContentLoaded', () => {
  UIStates.init();
});


