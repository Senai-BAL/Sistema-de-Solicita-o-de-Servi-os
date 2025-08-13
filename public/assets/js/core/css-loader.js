/**
 * 📦 CSS Loader Dinâmico - SENAI Lab v2.9.3
 * 
 * Carrega CSS sob demanda para otimizar performance
 * Reduz o tempo de carregamento inicial
 */

class CSSLoader {
  constructor() {
    this.loadedCSS = new Set();
    this.cssMap = {
      // 📋 Componentes da Dashboard
      'kanban': 'assets/css/admin/kanban.css',
      'stats': 'assets/css/admin/stats.css',
      'request-card': 'assets/css/admin/request-card.css',
      'search-filter': 'assets/css/admin/search-filter.css',
      'table-responsive': 'assets/css/admin/table-responsive.css',
      
      // 🔧 Modais e Ações
      'modal-hibrido': 'assets/css/admin/modal-hibrido.css',
      'admin-delete-modal': 'assets/css/admin/admin-delete-modal.css',
      'audit-modal': 'assets/css/admin/audit-modal.css',
      'pdf-modal': 'assets/css/admin/pdf-modal.css',
      'theme-modal': 'assets/css/admin/theme-modal.css',
      
      // 🎯 Funcionalidades Específicas
      'comments': 'assets/css/admin/comments.css',
      'timeline': 'assets/css/admin/timeline.css',
      'actions': 'assets/css/admin/actions.css',
      'files': 'assets/css/admin/files.css',
      'export-buttons': 'assets/css/admin/export-buttons.css',
      'quick-actions': 'assets/css/admin/quick-actions.css'
    };
    
    console.log('📦 CSS Loader inicializado');
  }

  // 🎯 CARREGAR CSS ESPECÍFICO
  async loadCSS(module) {
    if (this.loadedCSS.has(module)) {
      console.log(`📦 CSS '${module}' já carregado`);
      return Promise.resolve();
    }

    const cssPath = this.cssMap[module];
    if (!cssPath) {
      console.warn(`📦 CSS '${module}' não encontrado no mapa`);
      return Promise.reject(`Módulo ${module} não encontrado`);
    }

    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = cssPath;
      
      link.onload = () => {
        this.loadedCSS.add(module);
        console.log(`✅ CSS '${module}' carregado`);
        resolve();
      };
      
      link.onerror = () => {
        console.error(`❌ Erro ao carregar CSS '${module}'`);
        reject(`Erro ao carregar ${module}`);
      };
      
      document.head.appendChild(link);
    });
  }

  // 🎯 CARREGAR MÚLTIPLOS CSS
  async loadMultiple(modules) {
    console.log(`📦 Carregando CSS modules: ${modules.join(', ')}`);
    
    const promises = modules.map(module => this.loadCSS(module));
    
    try {
      await Promise.all(promises);
      console.log(`✅ Todos os CSS carregados: ${modules.join(', ')}`);
    } catch (error) {
      console.error('❌ Erro ao carregar alguns CSS:', error);
    }
  }

  // 🎯 CARREGAR CSS PARA VIEW ESPECÍFICA
  async loadForView(viewName) {
    const viewModules = {
      'dashboard': ['kanban', 'stats', 'request-card', 'search-filter'],
      'list': ['table-responsive', 'search-filter', 'actions'],
      'calendar': ['modal-hibrido', 'request-card'], // Para futuro sistema de calendário
      'audit': ['audit-modal', 'timeline', 'table-responsive'],
      'files': ['files', 'modal-hibrido'],
      'export': ['export-buttons', 'pdf-modal']
    };

    const modules = viewModules[viewName] || [];
    if (modules.length > 0) {
      await this.loadMultiple(modules);
    }
  }

  // 🎯 PRÉ-CARREGAR CSS CRÍTICOS
  preloadCritical() {
    // CSS que provavelmente será usado logo
    const criticalModules = ['request-card', 'modal-hibrido', 'search-filter'];
    
    setTimeout(() => {
      this.loadMultiple(criticalModules);
    }, 1000); // Carrega após 1 segundo
  }
}

// 🌐 DISPONIBILIZAR GLOBALMENTE
window.CSSLoader = CSSLoader;
window.cssLoader = new CSSLoader();

// 🚀 INICIALIZAÇÃO
document.addEventListener('DOMContentLoaded', () => {
  window.cssLoader.preloadCritical();
});

console.log('📦 CSS Loader Module carregado');
