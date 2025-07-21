// ✨ SENAI Lab - Sistema de Micro-interactions
// Arquivo: public/assets/js/shared/micro-interactions.js
// Descrição: Micro-interações e feedback visual avançado

class MicroInteractions {
  static initialized = false;
  static observers = new Map();

  // 🚀 INICIALIZAR SISTEMA
  static init() {
    if (this.initialized) return;

    this.injectCSS();
    this.setupIntersectionObserver();
    this.setupGlobalListeners();
    this.initialized = true;
  }

  // 🎨 ESTILOS PARA MICRO-INTERAÇÕES
  static injectCSS() {
    if (document.getElementById('micro-interactions-styles')) return;

    const style = document.createElement('style');
    style.id = 'micro-interactions-styles';
    style.textContent = `
      /* ✨ MICRO-INTERACTIONS BASE */
      .micro-hover {
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        cursor: pointer;
      }

      .micro-hover:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      }

      .micro-press {
        transition: transform 0.1s ease;
      }

      .micro-press:active {
        transform: scale(0.98);
      }

      .micro-ripple {
        position: relative;
        overflow: hidden;
      }

      .micro-ripple::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        border-radius: 50%;
        background: rgba(255,255,255,0.3);
        transform: translate(-50%, -50%);
        transition: width 0.6s, height 0.6s;
      }

      .micro-ripple:active::before {
        width: 300px;
        height: 300px;
      }

      /* 🎯 FEEDBACK VISUAL STATES */
      .micro-loading {
        position: relative;
        pointer-events: none;
        opacity: 0.7;
      }

      .micro-loading::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 16px;
        height: 16px;
        border: 2px solid #ccc;
        border-top: 2px solid #007bff;
        border-radius: 50%;
        animation: micro-spin 1s linear infinite;
        transform: translate(-50%, -50%);
        z-index: 10;
      }

      @keyframes micro-spin {
        0% { transform: translate(-50%, -50%) rotate(0deg); }
        100% { transform: translate(-50%, -50%) rotate(360deg); }
      }

      .micro-success {
        background: #28a745 !important;
        color: white !important;
        animation: micro-pulse-success 0.6s ease;
      }

      .micro-error {
        background: #dc3545 !important;
        color: white !important;
        animation: micro-shake 0.6s ease;
      }

      @keyframes micro-pulse-success {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }

      @keyframes micro-shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
      }

      /* 📱 ENTRANCE ANIMATIONS */
      .micro-fade-in {
        animation: micro-fadeIn 0.5s ease;
      }

      .micro-slide-up {
        animation: micro-slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .micro-scale-in {
        animation: micro-scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      }

      @keyframes micro-fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      @keyframes micro-slideUp {
        from { 
          opacity: 0;
          transform: translateY(20px);
        }
        to { 
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes micro-scaleIn {
        from { 
          opacity: 0;
          transform: scale(0.8);
        }
        to { 
          opacity: 1;
          transform: scale(1);
        }
      }

      /* 🎨 SPECIAL EFFECTS */
      .micro-glow {
        box-shadow: 0 0 20px rgba(0,123,255,0.5);
        animation: micro-glow-pulse 2s infinite;
      }

      @keyframes micro-glow-pulse {
        0%, 100% { box-shadow: 0 0 20px rgba(0,123,255,0.5); }
        50% { box-shadow: 0 0 30px rgba(0,123,255,0.8); }
      }

      .micro-highlight {
        position: relative;
        overflow: hidden;
      }

      .micro-highlight::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
        transition: left 0.5s;
      }

      .micro-highlight:hover::before {
        left: 100%;
      }

      /* 📊 PROGRESS INDICATORS */
      .micro-progress-ring {
        display: inline-block;
        width: 20px;
        height: 20px;
      }

      .micro-progress-ring svg {
        width: 100%;
        height: 100%;
        transform: rotate(-90deg);
      }

      .micro-progress-ring circle {
        fill: none;
        stroke-width: 3;
        stroke-linecap: round;
      }

      .micro-progress-ring .bg {
        stroke: #e0e0e0;
      }

      .micro-progress-ring .progress {
        stroke: #007bff;
        stroke-dasharray: 63;
        stroke-dashoffset: 63;
        transition: stroke-dashoffset 0.3s ease;
      }
    `;

    document.head.appendChild(style);
  }

  // 👁️ OBSERVER PARA ANIMAÇÕES DE ENTRADA
  static setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const animationType = element.dataset.microAnimation || 'fade-in';
          
          element.classList.add(`micro-${animationType}`);
          observer.unobserve(element);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '50px'
    });

    this.observers.set('intersection', observer);
  }

  // 🎧 LISTENERS GLOBAIS
  static setupGlobalListeners() {
    // Auto-adicionar classes hover em elementos interativos
    document.addEventListener('mouseover', (e) => {
      const element = e.target;
      if (this.isInteractiveElement(element) && !element.classList.contains('micro-hover')) {
        element.classList.add('micro-hover');
      }
    });

    // Auto-adicionar efeito ripple em botões
    document.addEventListener('click', (e) => {
      const button = e.target.closest('button, .btn, .btn-action');
      if (button && !button.classList.contains('micro-ripple')) {
        button.classList.add('micro-ripple');
      }
    });
  }

  // 🎯 VERIFICAR SE ELEMENTO É INTERATIVO
  static isInteractiveElement(element) {
    const interactiveTags = ['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA'];
    const interactiveClasses = ['btn', 'card', 'stat-card', 'kanban-card', 'action-card'];
    
    return interactiveTags.includes(element.tagName) ||
           interactiveClasses.some(cls => element.classList.contains(cls)) ||
           element.hasAttribute('onclick') ||
           element.style.cursor === 'pointer';
  }

  // ✨ ADICIONAR ANIMAÇÃO DE ENTRADA
  static animateIn(element, type = 'fade-in', delay = 0) {
    if (!element) return;

    setTimeout(() => {
      element.classList.add(`micro-${type}`);
    }, delay);
  }

  // 📊 ANIMAR LISTA DE ELEMENTOS
  static animateList(elements, type = 'slide-up', stagger = 100) {
    if (!elements || elements.length === 0) return;

    elements.forEach((element, index) => {
      this.animateIn(element, type, index * stagger);
    });
  }

  // 🎯 FEEDBACK DE BOTÃO (LOADING → SUCCESS/ERROR)
  static buttonFeedback(button, promise) {
    if (!button || !promise) return promise;

    const originalText = button.textContent;
    const originalClass = button.className;

    // Estado loading
    button.classList.add('micro-loading');
    button.disabled = true;

    return promise
      .then(result => {
        // Estado success
        button.classList.remove('micro-loading');
        button.classList.add('micro-success');
        button.textContent = '✓ Sucesso';
        
        setTimeout(() => {
          button.className = originalClass;
          button.textContent = originalText;
          button.disabled = false;
        }, 2000);
        
        return result;
      })
      .catch(error => {
        // Estado error
        button.classList.remove('micro-loading');
        button.classList.add('micro-error');
        button.textContent = '✗ Erro';
        
        setTimeout(() => {
          button.className = originalClass;
          button.textContent = originalText;
          button.disabled = false;
        }, 2000);
        
        throw error;
      });
  }

  // 📈 PROGRESS RING ANIMADO
  static createProgressRing(percentage = 0) {
    const circumference = 2 * Math.PI * 10; // raio 10
    const offset = circumference - (percentage / 100) * circumference;

    return `
      <div class="micro-progress-ring">
        <svg>
          <circle class="bg" cx="10" cy="10" r="10"></circle>
          <circle class="progress" cx="10" cy="10" r="10" style="stroke-dashoffset: ${offset}"></circle>
        </svg>
      </div>
    `;
  }

  // 🎨 HIGHLIGHT TEMPORÁRIO
  static highlight(element, duration = 2000) {
    if (!element) return;

    element.classList.add('micro-glow');
    setTimeout(() => {
      element.classList.remove('micro-glow');
    }, duration);
  }

  // 📱 OBSERVER AUTOMÁTICO PARA NOVOS ELEMENTOS
  static observeForAnimation(element, animationType = 'fade-in') {
    if (!element) return;

    element.dataset.microAnimation = animationType;
    this.observers.get('intersection')?.observe(element);
  }

  // 🧹 LIMPAR TODAS AS ANIMAÇÕES
  static cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
    
    // Remover classes de animação ativas
    document.querySelectorAll('[class*="micro-"]').forEach(element => {
      element.className = element.className.replace(/micro-\w+/g, '').trim();
    });
  }

  // 🎯 MÉTODOS DE CONVENIÊNCIA
  static fadeIn(element, delay = 0) {
    this.animateIn(element, 'fade-in', delay);
  }

  static slideUp(element, delay = 0) {
    this.animateIn(element, 'slide-up', delay);
  }

  static scaleIn(element, delay = 0) {
    this.animateIn(element, 'scale-in', delay);
  }

  // 📊 STAGGER ANIMATIONS PARA GRIDS
  static staggerGrid(container, itemSelector = '.stat-card, .kanban-card', delay = 100) {
    if (!container) return;

    const items = container.querySelectorAll(itemSelector);
    this.animateList(items, 'scale-in', delay);
  }

  // 🎨 SPECIAL: CONFETTI EFFECT (para sucessos importantes)
  static confetti(element) {
    if (!element) return;

    // Criar partículas temporárias
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: absolute;
        width: 4px;
        height: 4px;
        background: hsl(${Math.random() * 360}, 70%, 60%);
        pointer-events: none;
        z-index: 9999;
        border-radius: 50%;
      `;

      const rect = element.getBoundingClientRect();
      particle.style.left = (rect.left + rect.width / 2) + 'px';
      particle.style.top = (rect.top + rect.height / 2) + 'px';

      document.body.appendChild(particle);

      // Animar partícula
      const angle = (Math.PI * 2 * i) / 20;
      const velocity = 100 + Math.random() * 100;
      
      particle.animate([
        { 
          transform: 'translate(0, 0) scale(1)',
          opacity: 1
        },
        { 
          transform: `translate(${Math.cos(angle) * velocity}px, ${Math.sin(angle) * velocity}px) scale(0)`,
          opacity: 0
        }
      ], {
        duration: 1000,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      }).onfinish = () => particle.remove();
    }
  }
}

// 🌐 DISPONIBILIZAR GLOBALMENTE
window.MicroInteractions = MicroInteractions;

// 🚀 INICIALIZAR AUTOMATICAMENTE
document.addEventListener('DOMContentLoaded', () => {
  MicroInteractions.init();
});

console.log('✅ Micro-interactions Manager carregado com sucesso');
