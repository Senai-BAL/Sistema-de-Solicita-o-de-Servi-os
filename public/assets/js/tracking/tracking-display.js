/* ==========================================
   SENAI Lab v3.0.0 - Tracking Display
   Exibição de resultados e detalhes
   ========================================== */

// Exibição de resultados e detalhes
class TrackingDisplay {
  
  // Mostra múltiplos resultados
  static showSearchResults(results) {
    const container = document.getElementById('searchResults');
    const detailsContainer = document.getElementById('solicitationDetails');
    
    if (!container) return;
    
    // Esconde detalhes e limpa resultados anteriores
    if (detailsContainer) detailsContainer.style.display = 'none';
    container.innerHTML = '';
    
    const resultsHtml = results.map((solicitation, index) => {
      // Pré-calcular os valores para evitar problemas de escopo
      let serviceLabel;
      try {
        serviceLabel = TrackingUtils.getServiceLabel(solicitation.s, solicitation.ts);
        // Fallback se retornar undefined
        if (!serviceLabel || serviceLabel === 'undefined') {
          serviceLabel = '⚙️ Serviço';
        }
      } catch (error) {
        console.error('Erro ao gerar service label:', error);
        serviceLabel = '⚙️ Serviço';
      }
      
      const statusLabel = TrackingUtils.getStatusLabel(solicitation.admin?.status || solicitation.status || solicitation.st) || '⏳ Pendente';
      const formattedDate = TrackingUtils.formatDate(solicitation.d) || 'Data inválida';
      const solicitante = solicitation.c || 'N/A';
      const email = solicitation.e || 'N/A';
      
      // Debug temporário  
      console.log(`🔍 Resultado ${index + 1}:`, {
        servicoField: solicitation.s,
        tipoServicoField: solicitation.ts,
        statusField: solicitation.st,
        statusFieldFull: solicitation.status,
        adminStatus: solicitation.admin?.status,
        serviceLabel: serviceLabel,
        statusLabel: statusLabel
      });
      
      return `
      <div class="result-item" onclick="TrackingDisplay.selectResult(${index})" data-index="${index}">
        <div class="result-header">
          <h3>📋 ${serviceLabel}</h3>
          <span class="result-status">${statusLabel}</span>
        </div>
        <div class="result-info">
          <p><strong>Código:</strong> ${solicitation.id}</p>
          <p><strong>Data:</strong> ${formattedDate}</p>
          <p><strong>Solicitante:</strong> ${solicitante}</p>
          <p><strong>Email:</strong> ${email}</p>
        </div>
        <div class="result-action">
          <span>👆 Clique para ver detalhes</span>
        </div>
      </div>
    `
    }).join('');
    
    container.innerHTML = `
      <h2>📊 Resultados da Busca (${results.length})</h2>
      <div class="results-list">
        ${resultsHtml}
      </div>
    `;
    
    // Armazena resultados para seleção posterior
    window.trackingResults = results;
    
    container.style.display = 'block';
    TrackingUtils.scrollToElement('searchResults', 20);
  }
  
  // Seleciona um resultado específico
  static selectResult(index) {
    if (window.trackingResults && window.trackingResults[index]) {
      this.currentSelectedIndex = index; // Armazenar índice selecionado
      this.showSolicitationDetails(window.trackingResults[index]);
    }
  }
  
  // Mostra detalhes de uma solicitação específica
  static showSolicitationDetails(solicitation) {
    const container = document.getElementById('solicitationDetails');
    const resultsContainer = document.getElementById('searchResults');
    
    if (!container) return;
    
    // Esconde resultados múltiplos
    if (resultsContainer) resultsContainer.style.display = 'none';
    
    // Pré-calcular valores para evitar problemas de escopo
    const statusValue = solicitation.admin?.status || solicitation.status || solicitation.st || 'pendente'; // Priorizar admin.status
    const statusLabel = TrackingUtils.getStatusLabel(statusValue);
    const serviceLabel = TrackingUtils.getServiceLabel(solicitation.s, solicitation.ts);
    const formattedDate = TrackingUtils.formatDate(solicitation.d);
    const lastModifiedDate = TrackingUtils.formatDate(solicitation.admin?.data_atualizacao || solicitation.lastModified || solicitation.d);
    const solicitante = solicitation.c || 'N/A';
    const email = solicitation.e || 'N/A';
    const telefone = TrackingUtils.formatPhone(solicitation.w) || 'N/A';
    const serviceDetails = this.generateServiceDetails(solicitation);
    
    container.innerHTML = `
      <div class="solicitation-details">
        <div class="solicitation-card">
          <div class="card-header">
            <h2>📋 Detalhes da Solicitação</h2>
            <span class="status-badge status-${statusValue}">
              ${statusLabel}
            </span>
          </div>
          
          <div class="card-content">
            
            <!-- Informações Básicas -->
            <h3>📊 Informações Básicas</h3>
            
            <div class="detail-row">
              <strong>Código:</strong>
              <span class="copyable" onclick="TrackingDisplay.copyToClipboard('${solicitation.id || 'N/A'}')" title="Clique para copiar">${solicitation.id || 'N/A'} 📋</span>
            </div>
            
            <div class="detail-row">
              <strong>Tipo de Serviço:</strong>
              <span>${serviceLabel || '⚙️ Serviço'}</span>
            </div>
            
            <div class="detail-row">
              <strong>Data da Solicitação:</strong>
              <span>${formattedDate || 'Data não disponível'}</span>
            </div>
            
            <div class="detail-row">
              <strong>Última Atualização:</strong>
              <span>${lastModifiedDate || 'Data não disponível'}</span>
            </div>
            
            <!-- Dados Pessoais -->
            <h3>👤 Dados do Solicitante</h3>
            
            <div class="detail-row">
              <strong>Nome:</strong>
              <span>${solicitante}</span>
            </div>
            
            <div class="detail-row">
              <strong>Email:</strong>
              <span>${email}</span>
            </div>
            
            <div class="detail-row">
              <strong>Telefone:</strong>
              <span>${telefone}</span>
            </div>
            
            ${serviceDetails}
            
          </div>
          
          <div class="card-actions">
            <button onclick="TrackingDisplay.clearResults()" class="btn-secondary">
              🔍 Nova Busca
            </button>
            <button onclick="window.print()" class="btn-primary">
              🖨️ Imprimir
            </button>
          </div>
        </div>
      </div>
    `;
    
    container.style.display = 'block';
    TrackingUtils.scrollToElement('solicitationDetails', 20);
  }
  
  // Gera detalhes específicos do serviço
  static generateServiceDetails(solicitation) {
    const service = solicitation.s;
    const specificService = solicitation.ts; // Tipo específico de serviço
    const actualService = specificService || service; // Usar tipo específico se disponível
    const serviceLabel = TrackingUtils.getServiceLabel(service, specificService);
    
    // Debug para ver todos os campos da solicitação
    console.log('🔍 Debug - Campos da solicitação:', {
      service: service,
      specificService: specificService,
      actualService: actualService,
      serviceLabel: serviceLabel,
      allFields: Object.keys(solicitation),
      fullSolicitation: solicitation
    });
    
    let serviceHtml = `
      <h3>⚙️ Detalhes do Serviço</h3>
    `;
    
    // Campos específicos baseados no tipo de serviço
    if (actualService === 'espaco_maker') {
      // Buscar valores nos lugares corretos (dados.dr, dados.hi etc.)
      const dataReserva = solicitation.dados?.dr || solicitation.dataReserva || 'N/A';
      const horarioInicio = solicitation.dados?.hi || solicitation.horarioInicio || 'N/A';
      const horarioFim = solicitation.dados?.hf || solicitation.horarioFim || 'N/A';
      const chromeBooks = solicitation.dados?.cb || solicitation.chromeBooks || 0;
      const qtdChromeBooks = solicitation.dados?.qcb || solicitation.qtdChromeBooksInput || 0;
      const computadores = solicitation.dados?.cp || solicitation.computadores || 0;
      const qtdComputadores = solicitation.dados?.qcp || solicitation.qtdComputadoresInput || 0;
      const descricao = solicitation.dados?.desc || solicitation.descricaoUtilizacao || '';
      
      serviceHtml += `
        <div class="detail-row"><strong>Data da Reserva:</strong> <span>${dataReserva}</span></div>
        <div class="detail-row"><strong>Horário:</strong> <span>${horarioInicio} às ${horarioFim}</span></div>
        <div class="detail-row"><strong>Chrome Books:</strong> <span>${chromeBooks ? `Sim (${qtdChromeBooks})` : 'Não'}</span></div>
        <div class="detail-row"><strong>Computadores:</strong> <span>${computadores ? `Sim (${qtdComputadores})` : 'Não'}</span></div>
        ${descricao ? `<div class="detail-row"><strong>Descrição:</strong> <span>${descricao}</span></div>` : ''}
      `;
    } else if (actualService === 'impressao') {
      // Debug específico para impressão - verificar dados e dados.tf, dados.qc etc.
      console.log('🖨️ Debug impressão completo:', {
        // Campos diretos (antigos)
        tamanhoFolha: solicitation.tamanhoFolha,
        qtdCopias: solicitation.qtdCopias,
        frenteVerso: solicitation.frenteVerso,
        colorido: solicitation.colorido,
        // Campos abreviados no objeto dados
        dados: solicitation.dados,
        dadosTf: solicitation.dados?.tf,
        dadosQc: solicitation.dados?.qc,
        dadosFv: solicitation.dados?.fv,
        dadosCo: solicitation.dados?.co,
        // Estrutura completa
        allKeys: Object.keys(solicitation)
      });
      
      // Buscar valores nos lugares corretos (dados.tf, dados.qc etc.)
      const tamanho = solicitation.dados?.tf || solicitation.tamanhoFolha || solicitation.tamanho;
      const quantidade = solicitation.dados?.qc || solicitation.qtdCopias || solicitation.quantidade || solicitation.copias;
      const frenteVerso = solicitation.dados?.fv || solicitation.frenteVerso;
      const colorido = solicitation.dados?.co || solicitation.colorido;
      
      serviceHtml += `
        <div class="detail-row"><strong>Tamanho:</strong> <span>${tamanho || 'N/A'}</span></div>
        <div class="detail-row"><strong>Quantidade:</strong> <span>${quantidade || 'N/A'} cópias</span></div>
        <div class="detail-row"><strong>Frente e Verso:</strong> <span>${frenteVerso ? 'Sim' : 'Não'}</span></div>
        <div class="detail-row"><strong>Colorido:</strong> <span>${colorido ? 'Sim' : 'Não'}</span></div>
      `;
    } else if (actualService === 'emprestimo') {
      // Buscar valores nos lugares corretos (dados.ni, dados.dr etc.)
      const nomeItem = solicitation.dados?.ni || solicitation.nomeItem || 'N/A';
      const dataRetirada = solicitation.dados?.dr || solicitation.dataRetirada || 'N/A';
      const dataDevolucao = solicitation.dados?.dd || solicitation.dataDevolucao || 'N/A';
      const finalidade = solicitation.dados?.fin || solicitation.finalidadeEmprestimo || '';
      
      serviceHtml += `
        <div class="detail-row"><strong>Item:</strong> <span>${nomeItem}</span></div>
        <div class="detail-row"><strong>Data Retirada:</strong> <span>${dataRetirada}</span></div>
        <div class="detail-row"><strong>Data Devolução:</strong> <span>${dataDevolucao}</span></div>
        ${finalidade ? `<div class="detail-row"><strong>Finalidade:</strong> <span>${finalidade}</span></div>` : ''}
      `;
    } else if (actualService === 'impressao_3d') {
      const material = solicitation.dados?.mt || 'N/A';
      const quantidade = solicitation.dados?.qt || 'N/A';
      const possuiSTL = solicitation.dados?.stl;
      const descricaoPeca = solicitation.dados?.dp || 'N/A';
      const observacoes = solicitation.dados?.obs || '';
      
      serviceHtml += `
        <div class="detail-row"><strong>Material:</strong> <span>${material}</span></div>
        <div class="detail-row"><strong>Quantidade:</strong> <span>${quantidade}</span></div>
        <div class="detail-row"><strong>Possui Arquivo STL:</strong> <span>${possuiSTL ? 'Sim' : 'Não'}</span></div>
        <div class="detail-row"><strong>Descrição da Peça:</strong> <span>${descricaoPeca}</span></div>
        ${observacoes ? `<div class="detail-row"><strong>Observações:</strong> <span>${observacoes}</span></div>` : ''}
      `;
    } else if (actualService === 'manutencao') {
      const descricaoProblema = solicitation.dados?.prob || 'N/A';
      
      serviceHtml += `
        <div class="detail-row"><strong>Descrição do Problema:</strong> <span>${descricaoProblema}</span></div>
      `;
    } else if (actualService === 'arte_digital' || actualService === 'projeto') {
      const descricao = solicitation.dados?.desc || 'N/A';
      
      serviceHtml += `
        <div class="detail-row"><strong>Descrição:</strong> <span>${descricao}</span></div>
      `;
    } else {
      serviceHtml += `
        <div class="detail-row"><strong>Tipo:</strong> <span>${serviceLabel}</span></div>
      `;
      
      // Mostrar todos os campos disponíveis se não reconhecer o serviço
      console.log('🔍 Serviço não reconhecido, campos disponíveis:', solicitation);
    }
    
    return serviceHtml;
  }
  
  // Limpa resultados e detalhes
  static clearResults() {
    const resultsContainer = document.getElementById('searchResults');
    const detailsContainer = document.getElementById('solicitationDetails');
    
    if (resultsContainer) {
      resultsContainer.style.display = 'none';
      resultsContainer.innerHTML = '';
    }
    
    if (detailsContainer) {
      detailsContainer.style.display = 'none';
      detailsContainer.innerHTML = '';
    }
    
    // Limpa campo de busca
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.value = '';
      searchInput.focus();
    }
    
    // Remove mensagens de erro
    const errorMsg = document.querySelector('.error-message');
    if (errorMsg) errorMsg.remove();
    
    // Limpa resultados armazenados
    window.trackingResults = null;
    this.currentSelectedIndex = null;
    
    // Limpar estado persistido
    if (window.trackingMain) {
      window.trackingMain.clearSearchState();
    }
  }
  
  // Copia texto para clipboard
  static async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      TrackingUtils.showSuccess('Código copiado para a área de transferência!');
    } catch (error) {
      console.error('Erro ao copiar:', error);
      
      // Fallback para navegadores mais antigos
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        TrackingUtils.showSuccess('Código copiado para a área de transferência!');
      } catch (fallbackError) {
        console.error('Erro no fallback:', fallbackError);
        TrackingUtils.showError('Não foi possível copiar automaticamente. Código: ' + text);
      }
      document.body.removeChild(textArea);
    }
  }
}

console.log('📊 Tracking Display carregado');
