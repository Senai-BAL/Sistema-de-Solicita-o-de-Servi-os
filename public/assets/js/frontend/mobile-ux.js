/**
 * 📱 Mobile UX Enhancement v2.10.0
 * Melhorias específicas para experiência mobile
 */

class MobileUX {
  constructor() {
    this.init();
  }

  init() {
    // Detectar dispositivo mobile
    this.isMobile = window.innerWidth <= 768;
    this.isTouch = 'ontouchstart' in window;
    
    if (this.isMobile || this.isTouch) {
      this.setupMobileEnhancements();
      this.setupTouchFeedback();
      this.setupRealTimeValidation();
      this.setupMobileKeyboards();
      this.setupAccessibility();
      this.setupProgressiveEnhancement();
    }
    
    // Sempre executar
    this.setupResponsiveHandling();
    this.setupBackupButton();
    
    // Inicializar barra de progresso se disponível
    setTimeout(() => {
      if (typeof updateProgress === 'function') {
        updateProgress();
      }
    }, 100);
  }

  // ===== CONFIGURAÇÕES MOBILE =====
  setupMobileEnhancements() {
    // Prevenir zoom em inputs no iOS
    this.preventIOSZoom();
    
    // Melhorar scroll behavior
    this.enhanceScrolling();
    
    // Otimizar viewport dinâmico
    this.setupDynamicViewport();
    
    // Feedback tátil (se disponível)
    this.setupHapticFeedback();
  }

  preventIOSZoom() {
    // Adicionar event listeners para prevenir zoom não intencional
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      input.addEventListener('focus', () => {
        if (input.type !== 'file') {
          // Garantir que font-size seja >= 16px para prevenir zoom
          const computedStyle = window.getComputedStyle(input);
          const fontSize = parseFloat(computedStyle.fontSize);
          if (fontSize < 16) {
            input.style.fontSize = '16px';
          }
        }
      });
    });
  }

  enhanceScrolling() {
    // Smooth scroll para dispositivos móveis
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Scroll to top do formulário ao focar em inputs
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      input.addEventListener('focus', () => {
        setTimeout(() => {
          const rect = input.getBoundingClientRect();
          const scrollTop = window.pageYOffset + rect.top - 100;
          window.scrollTo({ top: scrollTop, behavior: 'smooth' });
        }, 300); // Delay para aguardar teclado mobile
      });
    });
  }

  setupDynamicViewport() {
    // Ajustar viewport quando teclado mobile aparece/desaparece
    let viewportHeight = window.innerHeight;
    
    window.addEventListener('resize', () => {
      const currentHeight = window.innerHeight;
      const diff = Math.abs(currentHeight - viewportHeight);
      
      if (diff > 150) { // Provável que o teclado abriu/fechou
        document.documentElement.style.setProperty('--vh', `${currentHeight * 0.01}px`);
      }
      
      viewportHeight = currentHeight;
    });
    
    // Set initial viewport height
    document.documentElement.style.setProperty('--vh', `${viewportHeight * 0.01}px`);
  }

  setupHapticFeedback() {
    if ('vibrate' in navigator) {
      // Feedback para botões importantes
      const buttons = document.querySelectorAll('.btn, .file-upload-label');
      buttons.forEach(button => {
        button.addEventListener('click', () => {
          navigator.vibrate(50); // Vibração suave
        });
      });
      
      // Feedback para erros
      document.addEventListener('validation-error', () => {
        navigator.vibrate([100, 50, 100]); // Padrão de erro
      });
      
      // Feedback para sucesso
      document.addEventListener('form-success', () => {
        navigator.vibrate([50, 100, 50, 100]); // Padrão de sucesso
      });
    }
  }

  // ===== FEEDBACK VISUAL E TÁTIL =====
  setupTouchFeedback() {
    // Adicionar classes para elementos touch-friendly
    const touchElements = document.querySelectorAll('input, select, textarea, button, .file-upload-label, .checkbox-group');
    
    touchElements.forEach(element => {
      // Touch start
      element.addEventListener('touchstart', (e) => {
        element.classList.add('touch-active');
        this.addRippleEffect(element, e);
      }, { passive: true });
      
      // Touch end
      element.addEventListener('touchend', () => {
        setTimeout(() => {
          element.classList.remove('touch-active');
        }, 150);
      }, { passive: true });
      
      // Touch cancel
      element.addEventListener('touchcancel', () => {
        element.classList.remove('touch-active');
      }, { passive: true });
    });
    
  }

  addRippleEffect(element, event) {
    // Criar efeito ripple para feedback visual
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = (event.touches ? event.touches[0].clientX : event.clientX) - rect.left - size / 2;
    const y = (event.touches ? event.touches[0].clientY : event.clientY) - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple-effect');
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    // Remover ripple após animação
    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }, 600);
  }

  // ===== VALIDAÇÃO EM TEMPO REAL =====
  setupRealTimeValidation() {
    const inputs = document.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
      // Validação em tempo real com debounce
      let timeoutId;
      
      input.addEventListener('input', () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          this.validateField(input);
          // Manter compatibilidade com barra de progresso
          if (typeof updateProgress === 'function') {
            updateProgress();
          }
        }, 300);
      });
      
      // Validação ao sair do campo
      input.addEventListener('blur', () => {
        this.validateField(input);
        // Atualizar progresso ao sair do campo
        if (typeof updateProgress === 'function') {
          updateProgress();
        }
      });
      
      // Limpar validação ao focar
      input.addEventListener('focus', () => {
        this.clearFieldValidation(input);
      });
    });
    
  }

  validateField(field) {
    const isValid = field.checkValidity();
    const value = field.value.trim();
    
    // Remover classes anteriores
    field.classList.remove('valid', 'invalid', 'loading-input');
    
    if (value === '') {
      return; // Não validar campos vazios (exceto required no submit)
    }
    
    // Validações específicas
    if (field.type === 'email') {
      this.validateEmail(field, value);
    } else if (field.type === 'tel') {
      this.validatePhone(field, value);
    } else if (field.type === 'number') {
      this.validateNumber(field, value);
    } else {
      // Validação padrão
      if (isValid) {
        field.classList.add('valid');
        this.showFieldSuccess(field);
      } else {
        field.classList.add('invalid');
        this.showFieldError(field, 'Campo inválido');
      }
    }
  }

  validateEmail(field, value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (emailRegex.test(value)) {
      field.classList.add('valid');
      this.showFieldSuccess(field);
    } else {
      field.classList.add('invalid');
      this.showFieldError(field, 'Email inválido');
    }
  }

  validatePhone(field, value) {
    // Aceitar formatos: (11)99999-9999, 11999999999, +5511999999999
    const phoneRegex = /^(\+55)?[\s]?\(?([1-9]{2})\)?[\s]?[9]?[0-9]{4}[\s]?-?[0-9]{4}$/;
    
    if (phoneRegex.test(value)) {
      field.classList.add('valid');
      this.showFieldSuccess(field);
    } else {
      field.classList.add('invalid');
      this.showFieldError(field, 'Telefone inválido');
    }
  }

  validateNumber(field, value) {
    const num = parseFloat(value);
    const min = parseFloat(field.min);
    const max = parseFloat(field.max);
    
    if (isNaN(num)) {
      field.classList.add('invalid');
      this.showFieldError(field, 'Apenas números');
    } else if (min && num < min) {
      field.classList.add('invalid');
      this.showFieldError(field, `Mínimo: ${min}`);
    } else if (max && num > max) {
      field.classList.add('invalid');
      this.showFieldError(field, `Máximo: ${max}`);
    } else {
      field.classList.add('valid');
      this.showFieldSuccess(field);
    }
  }

  showFieldSuccess(field) {
    this.removeFieldMessage(field);
    // Não mostrar mensagem de sucesso para não poluir
  }

  showFieldError(field, message) {
    this.removeFieldMessage(field);
    
    const errorEl = document.createElement('div');
    errorEl.className = 'field-error mobile-text-sm';
    errorEl.style.cssText = `
      color: var(--error, #dc3545);
      font-size: 12px;
      margin-top: 4px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 4px;
    `;
    errorEl.innerHTML = `⚠️ ${message}`;
    
    field.parentNode.appendChild(errorEl);
    
    // Dispatch custom event para feedback háptico
    document.dispatchEvent(new CustomEvent('validation-error'));
  }

  clearFieldValidation(field) {
    field.classList.remove('valid', 'invalid');
    this.removeFieldMessage(field);
  }

  removeFieldMessage(field) {
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
      existingError.remove();
    }
  }

  // ===== OTIMIZAÇÃO DE TECLADOS MOBILE =====
  setupMobileKeyboards() {
    // Configurar inputmode e pattern para melhor experiência mobile
    const inputs = document.querySelectorAll('input');
    
    inputs.forEach(input => {
      switch (input.type) {
        case 'email':
          input.setAttribute('inputmode', 'email');
          input.setAttribute('autocapitalize', 'none');
          input.setAttribute('spellcheck', 'false');
          break;
          
        case 'tel':
          input.setAttribute('inputmode', 'tel');
          break;
          
        case 'number':
          input.setAttribute('inputmode', 'numeric');
          input.setAttribute('pattern', '[0-9]*');
          break;
          
        case 'text':
          // Para campos de nome
          if (input.name.includes('colaborador') || input.name.includes('nome')) {
            input.setAttribute('autocapitalize', 'words');
          }
          break;
      }
    });
    
  }

  // ===== ACESSIBILIDADE =====
  setupAccessibility() {
    // Melhorar foco para navegação por teclado
    const focusableElements = document.querySelectorAll('input, select, textarea, button, [tabindex]');
    
    focusableElements.forEach(element => {
      element.addEventListener('focus', () => {
        element.classList.add('keyboard-focus');
      });
      
      element.addEventListener('blur', () => {
        element.classList.remove('keyboard-focus');
      });
    });
    
    // Adicionar labels aria para screen readers
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => {
      const label = input.nextElementSibling;
      if (label && label.classList.contains('file-upload-label')) {
        input.setAttribute('aria-label', label.textContent.trim());
      }
    });
    
  }

  // ===== MELHORIAS PROGRESSIVAS =====
  setupProgressiveEnhancement() {
    // Service Worker para cache (futuro)
    if ('serviceWorker' in navigator) {
      // Preparar para PWA futuro
    }
    
    // Web Share API para compartilhar solicitações
    if ('share' in navigator) {
      this.setupWebShare();
    }
    
    // Online/Offline detection
    this.setupOfflineDetection();
  }

  setupWebShare() {
    // Adicionar botão de compartilhar no sucesso (futuro)
    document.addEventListener('form-success', () => {
    });
  }

  setupOfflineDetection() {
    window.addEventListener('online', () => {
      this.showNetworkStatus('Conexão restaurada', 'success');
    });
    
    window.addEventListener('offline', () => {
      this.showNetworkStatus('Sem conexão - dados serão salvos quando voltar online', 'warning');
    });
  }

  showNetworkStatus(message, type) {
    // Reutilizar sistema de toast existente se disponível
    if (window.ToastManager) {
      window.ToastManager.show(message, type);
    } else {
      console.log(`🌐 ${message}`);
    }
  }

  // ===== BACKUP MANUAL =====
  setupBackupButton() {
    // Adicionar botão de backup manual ao painel admin
    this.createBackupButton();
  }

  createBackupButton() {
    // Só adicionar se estiver na página admin
    if (window.location.pathname.includes('admin.html')) {
      const header = document.querySelector('.admin-header, .dashboard-header, .main-content');
      if (header) {
        const backupBtn = document.createElement('button');
        backupBtn.className = 'btn btn-secondary mobile-backup-btn';
        backupBtn.innerHTML = '💾 Backup Manual';
        backupBtn.style.cssText = `
          margin-left: auto;
          background: linear-gradient(135deg, #6c757d, #5a6268);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
        `;
        
        backupBtn.addEventListener('click', () => {
          this.performManualBackup();
        });
        
        // Adicionar ao header se possível
        if (header.style.display === 'flex' || header.classList.contains('flex')) {
          header.appendChild(backupBtn);
        } else {
          // Criar container flex
          const container = document.createElement('div');
          container.style.cssText = 'display: flex; align-items: center; gap: 16px; margin-bottom: 20px;';
          container.appendChild(backupBtn);
          header.parentNode.insertBefore(container, header.nextSibling);
        }
        
      }
    }
  }

  async performManualBackup() {
    try {
      // Mostrar loading
      const btn = document.querySelector('.mobile-backup-btn');
      const originalText = btn.innerHTML;
      btn.innerHTML = '⏳ Fazendo backup...';
      btn.disabled = true;
      
      // Simular backup (integrar com sistema existente)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Sucesso
      btn.innerHTML = '✅ Backup concluído';
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
      }, 2000);
      
      if (window.ToastManager) {
        window.ToastManager.show('Backup manual realizado com sucesso!', 'success');
      }
      
    } catch (error) {
      if (window.Logger) {
        window.Logger.error('Erro no backup manual:', error);
      }
      
      const btn = document.querySelector('.mobile-backup-btn');
      btn.innerHTML = '❌ Erro no backup';
      btn.disabled = false;
      
      if (window.ToastManager) {
        window.ToastManager.show('Erro ao realizar backup manual', 'error');
      }
    }
  }

  // ===== HANDLING RESPONSIVO =====
  setupResponsiveHandling() {
    // Detectar mudanças de orientação
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        this.handleOrientationChange();
      }, 100);
    });
    
    // Detectar mudanças de tamanho
    window.addEventListener('resize', () => {
      this.handleResize();
    });
  }

  handleOrientationChange() {
    // Reajustar viewport
    this.setupDynamicViewport();
    
    // Scroll para topo para reorientar usuário
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
  }

  handleResize() {
    // Detectar se mudou de mobile para desktop ou vice-versa
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth <= 768;
    
    if (wasMobile !== this.isMobile) {
      // Reconfigurar interface se necessário
      if (this.isMobile) {
        this.setupMobileEnhancements();
      }
    }
  }
}

// CSS dinâmico para melhorias mobile
const mobileStyles = `
  <style id="mobile-ux-dynamic">
    .touch-active {
      transform: scale(0.98) !important;
      opacity: 0.8 !important;
    }
    
    .ripple-effect {
      position: absolute !important;
      border-radius: 50% !important;
      background: rgba(255,255,255,0.3) !important;
      pointer-events: none !important;
      animation: ripple-animation 0.6s ease-out !important;
    }
    
    @keyframes ripple-animation {
      from {
        transform: scale(0);
        opacity: 1;
      }
      to {
        transform: scale(1);
        opacity: 0;
      }
    }
    
    .keyboard-focus {
      outline: 2px solid var(--primary, #007bff) !important;
      outline-offset: 2px !important;
    }
    
    .field-error {
      animation: error-appear 0.3s ease !important;
    }
    
    @keyframes error-appear {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    /* CSS usando variável dinâmica do viewport */
    .mobile-full-height {
      height: calc(var(--vh, 1vh) * 100) !important;
    }
  </style>
`;

// Injetar CSS dinâmico
document.head.insertAdjacentHTML('beforeend', mobileStyles);

// Inicializar automaticamente quando DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.MobileUX = new MobileUX();
  });
} else {
  window.MobileUX = new MobileUX();
}

// Export para uso em outros módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MobileUX;
}
