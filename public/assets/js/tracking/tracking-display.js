/* ==========================================
   SENAI Lab v3.0.0 - Tracking Display
   Funções de exibição de resultados
   ========================================== */

// Função para mostrar múltiplos resultados
function showSearchResults(results) {
  const container = document.getElementById('searchResults');
  if (!container) {
    console.error('❌ Container de resultados não encontrado');
    return;
  }
  
  debugLog(`Exibindo ${results.length} resultados`);
  
  let html = `
    <div class="results-header">
      <h3>📋 Encontradas ${results.length} solicitações:</h3>
    </div>
    <div class="results-list">
  `;
  
  results.forEach((result, index) => {
    const sanitized = sanitizeSolicitation(result);
    const date = formatSimpleDate(sanitized.timestamp);
    const status = getStatusText(sanitized.status);
    const service = getServiceText(sanitized.servicoSelecionado);
    
    // Preparar dados para o onclick (escape para JSON)
    const resultData = JSON.stringify(sanitized).replace(/"/g, '&quot;');
    
    html += `
      <div class="result-item" onclick="showSolicitationDetails(${resultData})" 
           style="animation-delay: ${index * 0.1}s">
        <div class="result-header">
          <strong>ID: ${sanitized.id}</strong>
          <span class="status-badge status-${sanitized.status}">${status}</span>
        </div>
        <div class="result-info">
          <p><strong>Solicitante:</strong> ${sanitized.colaborador}</p>
          <p><strong>Serviço:</strong> ${service}</p>
          <p><strong>Data:</strong> ${date}</p>
          ${sanitized.email ? `<p><strong>Email:</strong> ${sanitized.email}</p>` : ''}
        </div>
      </div>
    `;
  });
  
  html += '</div>';
  
  container.innerHTML = html;
  container.style.display = 'block';
  
  // Scroll suave para os resultados
  setTimeout(() => {
    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
  
  debugLog('Resultados múltiplos exibidos');
}

// Função para mostrar detalhes de uma solicitação
function showSolicitationDetails(solicitation) {
  const container = document.getElementById('solicitationDetails');
  if (!container) {
    console.error('❌ Container de detalhes não encontrado');
    return;
  }
  
  // Se recebeu string JSON, fazer parse
  if (typeof solicitation === 'string') {
    try {
      solicitation = JSON.parse(solicitation.replace(/&quot;/g, '"'));
    } catch (error) {
      console.error('❌ Erro ao fazer parse dos dados:', error);
      showMessage('Erro ao exibir detalhes da solicitação', 'error');
      return;
    }
  }
  
  const sanitized = sanitizeSolicitation(solicitation);
  const date = formatDate(sanitized.timestamp);
  const status = getStatusText(sanitized.status);
  const service = getServiceText(sanitized.servicoSelecionado);
  
  debugLog('Exibindo detalhes da solicitação:', sanitized.id);
  
  let html = `
    <div class="solicitation-card">
      <div class="card-header">
        <h2>📋 Detalhes da Solicitação</h2>
        <span class="status-badge status-${sanitized.status}">${status}</span>
      </div>
      
      <div class="card-content">
        <div class="detail-row">
          <strong>🆔 Código:</strong>
          <span>${sanitized.id}</span>
        </div>
        
        <div class="detail-row">
          <strong>📅 Data de Criação:</strong>
          <span>${date}</span>
        </div>
        
        <div class="detail-row">
          <strong>👤 Solicitante:</strong>
          <span>${sanitized.colaborador}</span>
        </div>
        
        <div class="detail-row">
          <strong>📧 Email:</strong>
          <span>${sanitized.email}</span>
        </div>
        
        <div class="detail-row">
          <strong>📱 Telefone:</strong>
          <span>${sanitized.telefone}</span>
        </div>
        
        <div class="detail-row">
          <strong>🔧 Serviço:</strong>
          <span>${service}</span>
        </div>
  `;
  
  // Adicionar descrição se existir
  if (sanitized.descricao && sanitized.descricao.trim() !== '') {
    html += `
        <div class="detail-row">
          <strong>📝 Descrição:</strong>
          <span>${sanitized.descricao}</span>
        </div>
    `;
  }
  
  // Adicionar observações se existir
  if (sanitized.observacoes && sanitized.observacoes.trim() !== '') {
    html += `
        <div class="detail-row">
          <strong>💬 Observações:</strong>
          <span>${sanitized.observacoes}</span>
        </div>
    `;
  }
  
  html += `
      </div>
      
      <div class="card-actions">
        <button onclick="newSearch()" class="btn-secondary">
          🔍 Nova Busca
        </button>
        <button onclick="printSolicitation()" class="btn-primary">
          🖨️ Imprimir
        </button>
      </div>
    </div>
  `;
  
  container.innerHTML = html;
  hideResults(); // Ocultar resultados múltiplos
  container.style.display = 'block';
  
  // Scroll suave para os detalhes
  setTimeout(() => {
    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
  
  showMessage('Solicitação encontrada!', 'success');
  debugLog('Detalhes da solicitação exibidos');
}

// Função para imprimir solicitação
function printSolicitation() {
  // Criar uma nova janela com estilos de impressão
  const printWindow = window.open('', '_blank');
  const solicitationCard = document.querySelector('.solicitation-card');
  
  if (!solicitationCard) {
    showMessage('Erro ao preparar impressão', 'error');
    return;
  }
  
  const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>SENAI Lab - Detalhes da Solicitação</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          margin: 20px; 
          color: #333;
          line-height: 1.6;
        }
        .card-header { 
          background: #667eea; 
          color: white; 
          padding: 20px; 
          text-align: center;
          margin-bottom: 20px;
        }
        .detail-row { 
          margin: 15px 0; 
          padding: 10px 0; 
          border-bottom: 1px solid #eee;
          display: flex;
          flex-wrap: wrap;
        }
        .detail-row strong { 
          min-width: 150px; 
          margin-right: 10px;
        }
        .status-badge {
          padding: 5px 10px;
          border-radius: 10px;
          font-size: 0.9em;
          margin-left: 10px;
        }
        @media print {
          .card-actions { display: none; }
          body { margin: 0; }
        }
      </style>
    </head>
    <body>
      ${solicitationCard.outerHTML}
    </body>
    </html>
  `;
  
  printWindow.document.write(printContent);
  printWindow.document.close();
  
  // Aguardar carregar e imprimir
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 500);
  
  debugLog('Impressão iniciada');
}

// Função para copiar código da solicitação
function copySolicitationId() {
  const codeElement = document.querySelector('.detail-row:first-child span');
  if (codeElement) {
    const code = codeElement.textContent;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code).then(() => {
        showMessage('Código copiado para a área de transferência!', 'success');
      }).catch(() => {
        showMessage('Erro ao copiar código', 'error');
      });
    } else {
      // Fallback para navegadores antigos
      const textArea = document.createElement('textarea');
      textArea.value = code;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      showMessage('Código copiado!', 'success');
    }
    
    debugLog('Código copiado:', code);
  }
}

debugLog('Módulo de exibição carregado');
