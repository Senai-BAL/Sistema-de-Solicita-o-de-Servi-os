/* ==========================================
   SENAI Lab v3.0.0 - Tracking Main
   Script principal e inicialização
   ========================================== */

// Inicialização quando DOM carregar
document.addEventListener('DOMContentLoaded', function() {
  debugLog('DOM carregado, inicializando tracking...');
  
  try {
    initializeTrackingPage();
    setupEventListeners();
    debugLog('Tracking inicializado com sucesso');
  } catch (error) {
    console.error('❌ Erro ao inicializar tracking:', error);
    showMessage('Erro ao inicializar sistema de busca', 'error');
  }
});

// Função de inicialização principal
function initializeTrackingPage() {
  // Verificar elementos necessários
  const requiredElements = [
    'searchType',
    'searchInput',
    'searchResults',
    'solicitationDetails',
    'loadingOverlay'
  ];
  
  const missingElements = requiredElements.filter(id => !document.getElementById(id));
  
  if (missingElements.length > 0) {
    console.warn('⚠️ Elementos não encontrados:', missingElements);
  }
  
  // Focar no campo de busca
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.focus();
    debugLog('Foco definido no campo de busca');
  }
  
  // Atualizar placeholder inicial
  updateSearchPlaceholder();
  
  // Verificar conexão com Firebase
  checkFirebaseConnection();
  
  debugLog('Página de tracking inicializada');
}

// Configurar event listeners
function setupEventListeners() {
  // Enter para buscar
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        searchSolicitation();
        debugLog('Busca ativada via Enter');
      }
    });
    
    // Limpar mensagens ao digitar
    searchInput.addEventListener('input', function() {
      const messages = document.querySelectorAll('.message');
      if (messages.length > 0) {
        setTimeout(() => {
          messages.forEach(msg => msg.remove());
        }, 1000);
      }
    });
  }
  
  // Mudança no tipo de busca
  const searchType = document.getElementById('searchType');
  if (searchType) {
    searchType.addEventListener('change', updateSearchPlaceholder);
  }
  
  // Teclas de atalho
  document.addEventListener('keydown', function(e) {
    // Ctrl+K para focar na busca
    if (e.ctrlKey && e.key === 'k') {
      e.preventDefault();
      if (searchInput) {
        searchInput.focus();
        debugLog('Foco na busca via Ctrl+K');
      }
    }
    
    // Escape para limpar busca
    if (e.key === 'Escape') {
      newSearch();
      debugLog('Busca limpa via Escape');
    }
  });
  
  // Prevenir submit do formulário se existir
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      searchSolicitation();
    });
  });
  
  debugLog('Event listeners configurados');
}

// Verificar conexão com Firebase
async function checkFirebaseConnection() {
  try {
    // Fazer uma query simples para testar conexão
    await trackingDB.collection(collectionName).limit(1).get();
    debugLog('Conexão com Firebase verificada');
  } catch (error) {
    console.error('❌ Erro de conexão com Firebase:', error);
    showMessage('Erro de conexão com o banco de dados', 'error');
  }
}

// Função para recarregar configuração
function reloadConfig() {
  try {
    // Recarregar configurações se necessário
    debugLog('Configuração recarregada');
    showMessage('Configuração atualizada', 'success');
  } catch (error) {
    console.error('❌ Erro ao recarregar configuração:', error);
    showMessage('Erro ao atualizar configuração', 'error');
  }
}

// Função de limpeza de recursos
function cleanup() {
  // Remover event listeners se necessário
  // Limpar timers
  // Fechar conexões
  debugLog('Recursos limpos');
}

// Limpar recursos ao sair da página
window.addEventListener('beforeunload', cleanup);

// Função para debug de performance
function measurePerformance(label, fn) {
  if (TRACKING_CONFIG.mode === 'test') {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    debugLog(`${label} executado em ${(end - start).toFixed(2)}ms`);
    return result;
  }
  return fn();
}

// Função para monitoramento de erros
window.addEventListener('error', function(e) {
  console.error('❌ Erro global capturado:', e.error);
  debugLog('Erro capturado:', {
    message: e.message,
    filename: e.filename,
    lineno: e.lineno,
    colno: e.colno
  });
});

// Função para reportar problemas (futuro)
function reportIssue(issue) {
  debugLog('Problema reportado:', issue);
  // Implementar envio para sistema de monitoramento
}

// Exportar funções principais para uso global
window.trackingFunctions = {
  searchSolicitation,
  newSearch,
  updateSearchPlaceholder,
  showMessage,
  reloadConfig
};

debugLog('Script principal carregado');
