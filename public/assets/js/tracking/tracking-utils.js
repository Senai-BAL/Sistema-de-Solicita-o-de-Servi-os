/* ==========================================
   SENAI Lab v3.0.0 - Tracking Utils
   Funções utilitárias do sistema
   ========================================== */

// Função para mostrar/ocultar loading
function showLoading(show) {
  const overlay = document.getElementById('loadingOverlay');
  if (overlay) {
    overlay.style.display = show ? 'flex' : 'none';
    debugLog(`Loading ${show ? 'exibido' : 'ocultado'}`);
  }
}

// Função para ocultar resultados
function hideResults() {
  const searchResults = document.getElementById('searchResults');
  const solicitationDetails = document.getElementById('solicitationDetails');
  
  if (searchResults) searchResults.style.display = 'none';
  if (solicitationDetails) solicitationDetails.style.display = 'none';
  
  debugLog('Resultados ocultados');
}

// Função para limpar busca
function newSearch() {
  hideResults();
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.value = '';
    searchInput.focus();
  }
  debugLog('Nova busca iniciada');
}

// Função para atualizar placeholder
function updateSearchPlaceholder() {
  const searchType = document.getElementById('searchType')?.value;
  const searchInput = document.getElementById('searchInput');
  
  if (searchType && searchInput && PLACEHOLDERS[searchType]) {
    searchInput.placeholder = PLACEHOLDERS[searchType];
    searchInput.value = '';
    searchInput.focus();
    debugLog(`Placeholder atualizado para: ${searchType}`);
  }
}

// Função para converter status
function getStatusText(status) {
  return STATUS_MAP[status] || status;
}

// Função para converter serviço
function getServiceText(service) {
  return SERVICE_MAP[service] || service;
}

// Função para mostrar mensagens
function showMessage(message, type = 'info') {
  // Remover mensagens existentes
  const existingMessages = document.querySelectorAll('.message');
  existingMessages.forEach(msg => msg.remove());
  
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${type}`;
  messageDiv.innerHTML = `
    <span>${message}</span>
    <button onclick="this.parentElement.remove()">×</button>
  `;
  
  // Inserir mensagem no início do form-content
  const formContent = document.querySelector('.form-content');
  if (formContent) {
    formContent.insertBefore(messageDiv, formContent.firstChild);
  }
  
  // Auto remover após timeout
  setTimeout(() => {
    if (messageDiv.parentElement) {
      messageDiv.remove();
    }
  }, TRACKING_CONFIG.messageTimeout);
  
  debugLog(`Mensagem exibida: ${type} - ${message}`);
}

// Função para validar entrada
function validateSearchInput(searchType, searchQuery) {
  if (!searchQuery || searchQuery.trim() === '') {
    showMessage('Digite algo para buscar!', 'error');
    return false;
  }
  
  // Validações específicas por tipo
  switch (searchType) {
    case 'id':
      if (searchQuery.length < 3) {
        showMessage('O código da solicitação deve ter pelo menos 3 caracteres', 'error');
        return false;
      }
      break;
      
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(searchQuery)) {
        showMessage('Digite um email válido', 'error');
        return false;
      }
      break;
      
    case 'phone':
      const phoneRegex = /^\d{10,11}$/;
      if (!phoneRegex.test(searchQuery.replace(/\D/g, ''))) {
        showMessage('Digite um telefone válido (apenas números, 10-11 dígitos)', 'error');
        return false;
      }
      break;
  }
  
  return true;
}

// Função para formatar data
function formatDate(timestamp) {
  try {
    if (timestamp && timestamp.toDate) {
      // Firestore Timestamp
      return timestamp.toDate().toLocaleString('pt-BR');
    } else if (timestamp) {
      // String ou número
      return new Date(timestamp).toLocaleString('pt-BR');
    }
    return 'Data não disponível';
  } catch (error) {
    debugLog('Erro ao formatar data:', error);
    return 'Data inválida';
  }
}

// Função para formatar data simples
function formatSimpleDate(timestamp) {
  try {
    if (timestamp && timestamp.toDate) {
      return timestamp.toDate().toLocaleDateString('pt-BR');
    } else if (timestamp) {
      return new Date(timestamp).toLocaleDateString('pt-BR');
    }
    return 'Data não disponível';
  } catch (error) {
    debugLog('Erro ao formatar data simples:', error);
    return 'Data inválida';
  }
}

// Função para escape HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Função para sanitizar dados da solicitação
function sanitizeSolicitation(solicitation) {
  return {
    id: escapeHtml(solicitation.id || ''),
    colaborador: escapeHtml(solicitation.colaborador || ''),
    email: escapeHtml(solicitation.email || ''),
    telefone: escapeHtml(solicitation.telefone || ''),
    servicoSelecionado: solicitation.servicoSelecionado || '',
    status: solicitation.status || 'pendente',
    descricao: escapeHtml(solicitation.descricao || ''),
    observacoes: escapeHtml(solicitation.observacoes || ''),
    timestamp: solicitation.timestamp
  };
}

debugLog('Funções utilitárias carregadas');
