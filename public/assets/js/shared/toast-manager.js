// 🍞 SENAI Lab - Sistema de Notificações Toast
// Arquivo: public/assets/js/shared/toast-manager.js
// Descrição: Gerenciamento de notificações toast elegantes

export class ToastManager {
  static toastContainer = null;
  static toastCounter = 0;

  // 🚀 INICIALIZAR CONTAINER
  static init() {
    if (this.toastContainer) return;

    this.toastContainer = document.createElement('div');
    this.toastContainer.className = 'toast-container';
    this.toastContainer.id = 'toastContainer';
    document.body.appendChild(this.toastContainer);
  }

  // 🍞 MOSTRAR TOAST
  static show(message, type = 'info', duration = 3000) {
    this.init();

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

    // Limitar quantidade de toasts
    this.limitToasts();

    return toastId;
  }

  // 🗑️ REMOVER TOAST
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
    }, 300);
  }

  // 🧹 LIMITAR QUANTIDADE DE TOASTS
  static limitToasts() {
    const toasts = this.toastContainer.querySelectorAll('.toast');
    const maxToasts = 5;

    if (toasts.length > maxToasts) {
      // Remover os mais antigos
      for (let i = 0; i < toasts.length - maxToasts; i++) {
        this.remove(toasts[i].id);
      }
    }
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
