// 🍞 SENAI Lab - Sistema de Notificações Toast
// Arquivo: public/assets/js/shared/toast-manager.js
// Descrição: Gerenciamento de notificações toast elegantes

class ToastManager {
  static toastContainer = null;
  static toastCounter = 0;
  static maxToasts = 2; // 🔢 MÁXIMO 2 notificações na tela
  static toastQueue = []; // 📋 FILA de toasts pendentes
  static duplicateTimeout = 1500; // 🚫 ANTI-SPAM: 1.5 segundos (reduzido)
  static lastMessages = new Map(); // 💾 CACHE de mensagens recentes

  // 🚀 INICIALIZAR CONTAINER
  static init() {
    if (this.toastContainer) return;

    this.toastContainer = document.createElement('div');
    this.toastContainer.className = 'toast-container';
    this.toastContainer.id = 'toastContainer';
    document.body.appendChild(this.toastContainer);
  }

  // 🍞 MOSTRAR TOAST COM ANTI-SPAM (OTIMIZADO)
  static show(message, type = 'info', duration = 3000) {
    // 🚫 ANTI-SPAM: Verificar duplicatas recentes
    const messageKey = `${type}:${message}`;
    const now = Date.now();
    
    if (this.lastMessages.has(messageKey)) {
      const lastTime = this.lastMessages.get(messageKey);
      if (now - lastTime < this.duplicateTimeout) {
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
      return null;
    }

    // ✅ CRIAR TOAST DIRETAMENTE
    return this.createToast(message, type, duration);
  }

  // 🏗️ CRIAR TOAST (método separado) - COM EMPILHAMENTO DINÂMICO
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
      <div class="toast-content" style="display: flex; align-items: flex-start; gap: 8px; width: 100%; padding: 2px 0;">
        <span class="toast-icon" style="font-size: 16px; flex-shrink: 0; margin-top: 1px;">${this.getTypeIcon(type)}</span>
        <div class="toast-text" style="flex: 1; min-width: 0;">
          <div class="toast-message" style="font-size: 13px; line-height: 1.4; font-weight: 500; margin: 0; word-wrap: break-word; hyphens: auto;">${message}</div>
        </div>
        <div class="toast-controls" style="display: flex; align-items: flex-start; gap: 4px; flex-shrink: 0; margin-top: 1px;">
          <span class="toast-time" style="font-size: 10px; opacity: 0.7;">${timeString}</span>
          <button class="toast-close" onclick="ToastManager.remove('${toastId}')" style="
            background: none; 
            border: none; 
            color: rgba(255,255,255,0.8); 
            font-size: 14px; 
            cursor: pointer; 
            padding: 2px; 
            line-height: 1;
            border-radius: 50%;
            width: 18px;
            height: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
          " onmouseover="this.style.background='rgba(255,255,255,0.2)'" onmouseout="this.style.background='none'">&times;</button>
        </div>
      </div>
    `;

    // ✨ EFEITOS HOVER SUTIS PARA FILA
    toast.addEventListener('mouseenter', () => {
      toast.style.transform = `translateX(0px) scale(1.02)`;
      toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.25)';
    });
    
    toast.addEventListener('mouseleave', () => {
      toast.style.transform = `translateX(0px) scale(1)`;
      toast.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
    });

    // 🛡️ DEBUG: Verificar container
    if (!this.toastContainer) {
      console.error('❌ Toast container não existe!');
      return null;
    }

    // 🛡️ DEBUG: Verificar se container está no DOM
    if (!document.body.contains(this.toastContainer)) {
      console.error('❌ Toast container não está no DOM!');
      return null;
    }

    // ✨ ESTILOS COMPACTOS E FLEXÍVEIS - ALTURA AUTOMÁTICA
    toast.style.cssText = `
      position: fixed !important;
      right: 15px !important;
      z-index: 10000 !important;
      background: ${this.getTypeColor(type)} !important;
      color: white !important;
      padding: 12px 14px !important;
      border-radius: 8px !important;
      width: 320px !important;
      max-width: 320px !important;
      min-height: 44px !important;
      max-height: 120px !important;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15) !important;
      transform: translateX(350px) !important;
      transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55) !important;
      display: flex !important;
      align-items: flex-start !important;
      opacity: 0 !important;
      visibility: visible !important;
      word-wrap: break-word !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      font-size: 13px !important;
      line-height: 1.4 !important;
      border: 1px solid rgba(255,255,255,0.2) !important;
      backdrop-filter: blur(10px) !important;
      overflow: hidden !important;
    `;

    // Adicionar ao container primeiro (para calcular posições)
    this.toastContainer.appendChild(toast);


    // 🎬 ANIMAÇÃO DE ENTRADA RÁPIDA - SLIDE DA DIREITA
    requestAnimationFrame(() => {
      // 📊 REPOSICIONAR TODOS OS TOASTS após renderização
      this.repositionAllToasts();
      
      requestAnimationFrame(() => { // Double RAF para garantir
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(0)';
      });
    });

    // Auto-remover com timing otimizado para fila
    if (duration > 0) {
      setTimeout(() => {
        this.remove(toastId);
      }, duration);
    }

    return toastId;
  }

  // 📊 REPOSICIONAR TODOS OS TOASTS - FILA COM ALTURA DINÂMICA
  static repositionAllToasts() {
    if (!this.toastContainer) return;
    
    const toasts = Array.from(this.toastContainer.querySelectorAll('.toast'));
    const baseTop = 15; // Distância mínima do topo
    let currentTop = baseTop;
    
    toasts.forEach((toast, index) => {
      toast.style.top = `${currentTop}px`;
      
      // Calcular altura real do toast + gap
      const toastHeight = toast.offsetHeight || 44; // Fallback para altura mínima
      const gap = 8; // Gap entre toasts
      currentTop += toastHeight + gap;
    });
  }

  // 🎨 OBTER COR POR TIPO - CORES COMPACTAS E MODERNAS
  static getTypeColor(type) {
    const colors = {
      'success': 'linear-gradient(90deg, #28a745, #34ce57)',
      'error': 'linear-gradient(90deg, #dc3545, #ff4757)', 
      'warning': 'linear-gradient(90deg, #ffc107, #ffda3a)',
      'info': 'linear-gradient(90deg, #17a2b8, #00d2ff)'
    };
    return colors[type] || 'linear-gradient(90deg, #17a2b8, #00d2ff)';
  }

  // 📋 PROCESSAR FILA DE TOASTS (CORRIGIDO COM REPOSICIONAMENTO)
  static processQueue() {
    if (!this.toastContainer) return;
    
    const currentToasts = this.toastContainer.querySelectorAll('.toast');
    const availableSlots = this.maxToasts - currentToasts.length;
    

    
    for (let i = 0; i < availableSlots && this.toastQueue.length > 0; i++) {
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

  // 🗑️ REMOVER TOAST - ANIMAÇÃO RÁPIDA PARA DIREITA
  static remove(toastId) {
    const toast = document.getElementById(toastId);
    if (!toast) return;



    // Animar saída rápida - deslizar para direita
    toast.style.transform = 'translateX(350px) scale(0.9)';
    toast.style.opacity = '0';

    // Remover do DOM após animação rápida
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);

        
        // 📊 REPOSICIONAR TOASTS RESTANTES
        this.repositionAllToasts();
      }
      
      // 🔄 PROCESSAR FILA imediatamente
      setTimeout(() => this.processQueue(), 50); // Delay mínimo
    }, 250); // Animação mais rápida
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

  // 🎯 OBTER ÍCONE DO TIPO (COMPACTO)
  static getTypeIcon(type) {
    const icons = {
      'success': '✅',
      'error': '❌',
      'warning': '⚠️',
      'info': 'ℹ️'
    };
    return icons[type] || 'ℹ️';
  }

  // 📊 MÉTODOS DE CONVENIÊNCIA - DURAÇÕES OTIMIZADAS PARA FILA
  static success(message, duration = 2500) {
    return this.show(message, 'success', duration);
  }

  static error(message, duration = 4000) {
    return this.show(message, 'error', duration);
  }

  static warning(message, duration = 3000) {
    return this.show(message, 'warning', duration);
  }

  static info(message, duration = 2000) {
    return this.show(message, 'info', duration);
  }
}

// 🌐 DISPONIBILIZAR GLOBALMENTE
window.ToastManager = ToastManager;


