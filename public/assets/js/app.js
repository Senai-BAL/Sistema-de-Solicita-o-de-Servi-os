/* 🔧 SENAI Lab - Inicialização Principal
 * Arquivo: public/assets/js/app.js
 * Descrição: Arquivo principal de inicialização da aplicação
 */

// 🚀 INICIALIZAÇÃO DA APLICAÇÃO
document.addEventListener('DOMContentLoaded', function() {
  // Inicializar todos os módulos
  initializeMultiFileManagers();
  setupFormNavigation();
  setupWhatsAppMask();
  
  // Configurar estado inicial
  updateProgress();
  usageMonitor.reset();
  
  // Mostrar status de carregamento
  showStatus('✅ Sistema carregado - GitHub Storage ativo!', 'success');
  
  console.log('🔧 SENAI Lab - Sistema inicializado com sucesso!');
});
