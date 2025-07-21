// 🍞 SENAI Lab - Sistema de Notificações Toast
// Arquivo: public/assets/js/shared/toast-manager.js
// Descrição: Gerenciamento de notificações toast elegantes

class ToastManager {
  static toastContainer = null;
  static toastCounter = 0;
  static maxToasts = 3; // 🔢 LIMITE REDUZIDO de 5 para 3
  static toastQueue = []; // 📋 FILA de toasts pendentes
  static duplicateTimeout = 2000; // 🚫 ANTI-SPAM: 2 segundos entre toasts iguais
  static lastMessages = new Map(); // 💾 CACHE de mensagens recentes

  // 🚀 INICIALIZAR CONTAINER
  static init() {
    if (this.toastContainer) return;

    this.toastContainer = document.createElement('div');
    this.toastContainer.className = 'toast-container';
    this.toastContainer.id = 'toastContainer';
    document.body.appendChild(this.toastContainer);
  }

  // 🍞 MOSTRAR TOAST COM ANTI-SPAM
  static show(message, type = 'info', duration = 3000) {
    // 🚫 ANTI-SPAM: Verificar duplicatas recentes
    const messageKey = `${type}:${message}`;
    const now = Date.now();
    
    if (this.lastMessages.has(messageKey)) {
      const lastTime = this.lastMessages.get(messageKey);
      if (now - lastTime < this.duplicateTimeout) {
        console.log(`🚫 Toast duplicado ignorado: ${message}`);
        return null; // Ignora toast duplicado
      }
    }
    
    // 📝 REGISTRAR MENSAGEM
    this.lastMessages.set(messageKey, now);
    
    // 🧹 LIMPAR MENSAGENS ANTIGAS DO CACHE
    this.cleanupMessageCache();

    this.init();

    // 📊 VERIFICAR LIMITE antes de criar
    const currentToasts = this.toastContainer.querySelectorAll('.toast');
    if (currentToasts.length >= this.maxToasts) {
      // 🔄 ADICIONAR À FILA se exceder limite
      this.toastQueue.push({ message, type, duration });
      console.log(`📋 Toast adicionado à fila: ${this.toastQueue.length} pendentes`);
      this.processQueue(); // Tentar processar fila
      return null;
    }

    return this.createToast(message, type, duration);
  }

  // 🏗️ CRIAR TOAST (método separado)
  static createToast(message, type, duration) {
    const toast = document.createElement('div');
    const toastId = `toast-${++this.toastCounter}`;
    
    toast.className = `toast ${type}`;
    toast.id = toastId;
    
    const now = new Date();
    const timeString = now.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    toast.innerHTML = `
      <div class="toast-header">
        <span class="toast-title">${this.getTypeTitle(type)}</span>
        <span class="toast-time">${timeString}</span>
      </div>
      <div class="toast-message">${message}</div>
      <button class="toast-close" onclick="ToastManager.remove('${toastId}')">&times;</button>
    `;

    // Adicionar ao container
    this.toastContainer.appendChild(toast);

    // Animar entrada
    requestAnimationFrame(() => {
      toast.style.transform = 'translateX(0)';
    });

    // Auto-remover após duração especificada
    if (duration > 0) {
      setTimeout(() => {
        this.remove(toastId);
      }, duration);
    }

    return toastId;
  }

  // 📋 PROCESSAR FILA DE TOASTS
  static processQueue() {
    const currentToasts = this.toastContainer.querySelectorAll('.toast');
    
    while (this.toastQueue.length > 0 && currentToasts.length < this.maxToasts) {
      const { message, type, duration } = this.toastQueue.shift();
      this.createToast(message, type, duration);
    }
  }

  // 🧹 LIMPAR CACHE DE MENSAGENS ANTIGAS
  static cleanupMessageCache() {
    const now = Date.now();
    const expireTime = this.duplicateTimeout * 2; // 4 segundos
    
    for (const [key, time] of this.lastMessages.entries()) {
      if (now - time > expireTime) {
        this.lastMessages.delete(key);
      }
    }
  }

  // 🗑️ REMOVER TOAST COM PROCESSAMENTO DE FILA
  static remove(toastId) {
    const toast = document.getElementById(toastId);
    if (!toast) return;

    // Animar saída
    toast.style.transform = 'translateX(100%)';
    toast.style.opacity = '0';

    // Remover do DOM após animação
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
      
      // 🔄 PROCESSAR FILA após remover
      this.processQueue();
    }, 300);
  }

  // 🧹 LIMPAR TODOS OS TOASTS E FILA
  static clear() {
    if (!this.toastContainer) return;
    
    // Limpar toasts ativos
    const toasts = this.toastContainer.querySelectorAll('.toast');
    toasts.forEach(toast => this.remove(toast.id));
    
    // Limpar fila e cache
    this.toastQueue = [];
    this.lastMessages.clear();
    
    console.log('🧹 Todos os toasts e fila limpos');
  }

  // 🏷️ OBTER TÍTULO DO TIPO
  static getTypeTitle(type) {
    const titles = {
      'success': '✅ Sucesso',
      'error': '❌ Erro',
      'warning': '⚠️ Aviso',
      'info': 'ℹ️ Informação'
    };
    return titles[type] || 'ℹ️ Informação';
  }

  // 🧹 LIMPAR TODOS OS TOASTS
  static clear() {
    if (this.toastContainer) {
      this.toastContainer.innerHTML = '';
    }
  }

  // 📊 MÉTODOS DE CONVENIÊNCIA
  static success(message, duration = 3000) {
    return this.show(message, 'success', duration);
  }

  static error(message, duration = 5000) {
    return this.show(message, 'error', duration);
  }

  static warning(message, duration = 4000) {
    return this.show(message, 'warning', duration);
  }

  static info(message, duration = 3000) {
    return this.show(message, 'info', duration);
  }
}

// 🌐 DISPONIBILIZAR GLOBALMENTE
window.ToastManager = ToastManager;

console.log('✅ Toast Manager Module carregado com sucesso');
