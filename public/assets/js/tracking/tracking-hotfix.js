/* ==========================================
   SENAI Lab v3.0.0 - Tracking Hotfix
   Correções emergenciais e compatibilidade
   ========================================== */

// Hotfixes para compatibilidade e correções emergenciais
class TrackingHotfix {
  
  static init() {
    // Aplicar correções em ordem
    this.fixConsoleErrors();
    this.fixMissingElements();
    this.fixFirebaseCompatibility();
    this.fixCSSIssues();
    this.addFallbackFunctions();
  }
  
  // Corrige erros de console relacionados a elementos ausentes
  static fixConsoleErrors() {
    // Suprime erros específicos conhecidos
    const originalError = console.error;
    console.error = function(...args) {
      const message = args.join(' ');
      
      // Filtrar erros conhecidos e não críticos
      const ignoredErrors = [
        'searchType is null',
        'loadingOverlay is null',
        'Firebase not fully loaded'
      ];
      
      const shouldIgnore = ignoredErrors.some(error => message.includes(error));
      
      if (!shouldIgnore) {
        originalError.apply(console, args);
      }
    };
  }
  
  // Cria elementos faltantes
  static fixMissingElements() {
    // Verificar e criar loadingOverlay se não existir
    if (!document.getElementById('loadingOverlay')) {
      const overlay = document.createElement('div');
      overlay.id = 'loadingOverlay';
      overlay.className = 'loading-overlay';
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
        display: none;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        color: var(--feedback-text);
        font-size: 18px;
      `;
      overlay.innerHTML = '<div>🔍 Buscando...</div>';
      document.body.appendChild(overlay);
    }
    
    // Verificar e criar searchResults se não existir
    if (!document.getElementById('searchResults')) {
      const results = document.createElement('div');
      results.id = 'searchResults';
      results.style.display = 'none';
      
      // Inserir após o formulário de busca
      const searchForm = document.querySelector('.search-container, .tracking-form, form');
      if (searchForm && searchForm.parentNode) {
        searchForm.parentNode.insertBefore(results, searchForm.nextSibling);
      } else {
        document.body.appendChild(results);
      }
    }
    
    // Verificar e criar solicitationDetails se não existir
    if (!document.getElementById('solicitationDetails')) {
      const details = document.createElement('div');
      details.id = 'solicitationDetails';
      details.style.display = 'none';
      
      // Inserir após searchResults
      const searchResults = document.getElementById('searchResults');
      if (searchResults && searchResults.parentNode) {
        searchResults.parentNode.insertBefore(details, searchResults.nextSibling);
      } else {
        document.body.appendChild(details);
      }
    }
  }
  
  // Corrige problemas de compatibilidade com Firebase
  static fixFirebaseCompatibility() {
    // Timeout para Firebase não carregado
    setTimeout(() => {
      if (!window.firebase) {
        if (window.Logger) {
          window.Logger.warn('Firebase não carregado, criando fallback');
        }
        this.createFirebaseFallback();
      }
    }, 3000);
    
    // Verificar se o Firestore está disponível
    if (window.firebase && !window.db) {
      try {
        window.db = window.firebase.firestore();
      } catch (error) {
        if (window.Logger) {
          window.Logger.warn('Erro ao inicializar Firestore:', error);
        }
      }
    }
  }
  
  // Cria fallback para Firebase quando não disponível
  static createFirebaseFallback() {
    window.firebase = {
      firestore: () => ({
        collection: () => ({
          where: () => ({
            get: () => Promise.resolve({ empty: true, docs: [] })
          }),
          doc: () => ({
            get: () => Promise.resolve({ exists: false })
          })
        })
      })
    };
    
    window.db = window.firebase.firestore();
    
    // Avisar que está em modo fallback
    if (typeof TrackingUtils !== 'undefined') {
      TrackingUtils.showError('Modo offline - algumas funcionalidades limitadas');
    }
  }
  
  // Corrige problemas de CSS
  static fixCSSIssues() {
    // Adicionar estilos críticos via JavaScript se CSS não carregou
    const criticalCSS = `
      .loading-overlay {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
        background: rgba(0,0,0,0.7) !important;
        display: none !important;
        justify-content: center !important;
        align-items: center !important;
        z-index: 9999 !important;
        color: var(--feedback-text) !important;
        font-size: 18px !important;
      }
      
      .error-message {
        background: var(--error) !important;
        color: var(--feedback-text) !important;
        padding: 10px !important;
        border-radius: 5px !important;
        margin: 10px 0 !important;
      }
      
      .success-message {
        background: var(--success) !important;
        color: var(--feedback-text) !important;
        padding: 10px !important;
        border-radius: 5px !important;
        margin: 10px 0 !important;
      }
      
      .no-results {
        text-align: center !important;
        padding: 40px 20px !important;
      }
      
      .result-item {
        border: 1px solid var(--border) !important;
        margin: 10px 0 !important;
        padding: 15px !important;
        border-radius: 5px !important;
        cursor: pointer !important;
        background: var(--surface) !important;
        color: var(--text) !important;
        transition: all 0.3s ease !important;
      }
      
      .result-item:hover {
        background: var(--surface-alt) !important;
        border-color: var(--success) !important;
        transform: translateY(-1px) !important;
        box-shadow: 0 4px 12px var(--shadow) !important;
      }
    `;
    
    // Criar stylesheet se não existir
    let hotfixStyles = document.getElementById('tracking-hotfix-styles');
    if (!hotfixStyles) {
      hotfixStyles = document.createElement('style');
      hotfixStyles.id = 'tracking-hotfix-styles';
      hotfixStyles.textContent = criticalCSS;
      document.head.appendChild(hotfixStyles);
    }
  }
  
  // Adiciona funções de fallback
  static addFallbackFunctions() {
    // Fallback para TrackingUtils se não existir
    if (typeof TrackingUtils === 'undefined') {
      window.TrackingUtils = {
        showError: (message) => {
          alert('Erro: ' + message);
        },
        showSuccess: (message) => {
          alert('Sucesso: ' + message);
        },
        determineSearchType: (query) => {
          if (query.includes('@')) return 'email';
          if (/^\d+$/.test(query.replace(/\D/g, ''))) return 'phone';
          return 'id';
        },
        formatDate: (timestamp) => {
          try {
            if (timestamp && timestamp.toDate) {
              return timestamp.toDate().toLocaleDateString('pt-BR');
            }
            if (timestamp) {
              return new Date(timestamp).toLocaleDateString('pt-BR');
            }
            return 'Data inválida';
          } catch (e) {
            return 'Data inválida';
          }
        },
        scrollToElement: (elementId, offset = 0) => {
          const element = document.getElementById(elementId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }
      };
    }
    
    // Fallback para TrackingDisplay se não existir
    if (typeof TrackingDisplay === 'undefined') {
      window.TrackingDisplay = {
        clearResults: () => {
          const searchResults = document.getElementById('searchResults');
          const solicitationDetails = document.getElementById('solicitationDetails');
          
          if (searchResults) {
            searchResults.style.display = 'none';
            searchResults.innerHTML = '';
          }
          
          if (solicitationDetails) {
            solicitationDetails.style.display = 'none';
            solicitationDetails.innerHTML = '';
          }
          
          const searchInput = document.getElementById('searchInput');
          if (searchInput) {
            searchInput.value = '';
            searchInput.focus();
          }
        }
      };
    }
  }
  
  // Função para debug de problemas
  static diagnostic() {
    const report = {
      firebase: !!window.firebase,
      db: !!window.db,
      trackingUtils: typeof TrackingUtils !== 'undefined',
      trackingSearch: typeof TrackingSearch !== 'undefined',
      trackingDisplay: typeof TrackingDisplay !== 'undefined',
      elements: {
        searchInput: !!document.getElementById('searchInput'),
        searchResults: !!document.getElementById('searchResults'),
        solicitationDetails: !!document.getElementById('solicitationDetails'),
        loadingOverlay: !!document.getElementById('loadingOverlay')
      }
    };
    
    console.log('🔍 Diagnóstico do Tracking:', report);
    return report;
  }
  
  // Função de emergência para resetar tudo
  static emergencyReset() {
    console.log('🚨 Reset de emergência do tracking...');
    
    // Limpar todos os containers
    ['searchResults', 'solicitationDetails'].forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        element.style.display = 'none';
        element.innerHTML = '';
      }
    });
    
    // Esconder loading
    const loading = document.getElementById('loadingOverlay');
    if (loading) {
      loading.style.display = 'none';
    }
    
    // Limpar campo de busca
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.value = '';
      searchInput.focus();
    }
    
    // Remover mensagens de erro
    document.querySelectorAll('.error-message, .success-message').forEach(msg => {
      msg.remove();
    });
    
    alert('Sistema resetado com sucesso!');
  }
}

// Aplicar hotfixes automaticamente
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    TrackingHotfix.init();
  }, 100);
});

// Expor funções globalmente para debug
window.TrackingHotfix = TrackingHotfix;
