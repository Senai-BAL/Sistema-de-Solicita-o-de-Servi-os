function ensureShowStatus(callback) {
  if (typeof showStatus === 'undefined') {
    const script = document.createElement('script');
    script.src = 'assets/js/frontend/showStatus.js';
    script.onload = function() {
      callback();
    };
    document.head.appendChild(script);
  } else {
    callback();
  }
}

/* 🔧 SENAI Lab - Inicialização Principal
 * Arquivo: public/assets/js/app.js
 * Descrição: Arquivo principal de inicialização da aplicação
 */

// 🚀 INICIALIZAÇÃO DA APLICAÇÃO

// Aguarda o carregamento do DOM e garante showStatus antes de inicializar

document.addEventListener('DOMContentLoaded', function() {
  ensureShowStatus(function() {
    // Inicializar todos os módulos
    initializeMultiFileManagers();
    setupFormNavigation();
    setupWhatsAppMask();
    
    // Configurar estado inicial
    updateProgress();
    usageMonitor.reset();
    
    // Mostrar status de carregamento
    showStatus('Sistema carregado - GitHub Storage ativo!', 'success');
    

  });
});
