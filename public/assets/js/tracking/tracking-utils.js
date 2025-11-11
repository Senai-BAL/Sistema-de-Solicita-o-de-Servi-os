/* ==========================================
   SENAI Lab v3.0.0 - Tracking Utilities
   Utilitários para tracking
   ========================================== */

// Utilitários para tracking
class TrackingUtils {
  
  // Sanitiza entrada do usuário
  static sanitizeInput(input) {
    if (!input) return '';
    return input.toString().trim().replace(/[<>'"]/g, '');
  }
  
  // Valida entrada baseado no tipo
  static validateInput(type, value) {
    const config = TRACKING_CONFIG.searchTypes[type];
    if (!config) return { valid: false, error: 'Tipo de busca inválido' };
    
    const cleanValue = this.sanitizeInput(value);
    if (!cleanValue) return { valid: false, error: 'Campo obrigatório' };
    
    // Para telefone, remove caracteres não numéricos
    if (type === 'phone') {
      const numericValue = cleanValue.replace(/\D/g, '');
      if (!config.pattern.test(numericValue)) {
        return { valid: false, error: config.errorMsg };
      }
      return { valid: true, value: numericValue };
    }
    
    if (!config.pattern.test(cleanValue)) {
      return { valid: false, error: config.errorMsg };
    }
    
    return { valid: true, value: cleanValue };
  }
  
  // Determina automaticamente o tipo de busca baseado na entrada
  static determineSearchType(query) {
    const cleanQuery = this.sanitizeInput(query);
    
    // Verifica se é email - validação mais rigorosa
    if (cleanQuery.includes('@')) {
      const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      if (emailRegex.test(cleanQuery)) {
        return 'email';
      }
    }
    
    // Verifica se é telefone
    const numericOnly = cleanQuery.replace(/\D/g, '');
    
    // Telefone brasileiro: 10 ou 11 dígitos
    if (numericOnly.length >= 10 && numericOnly.length <= 11) {
      // Verificações adicionais para telefone brasileiro
      if (numericOnly.length === 11) {
        // Celular: deve começar com DDD válido (11-99) e 9 como 3º dígito
        const ddd = numericOnly.substring(0, 2);
        const ninthDigit = numericOnly.charAt(2);
        if (parseInt(ddd) >= 11 && parseInt(ddd) <= 99 && ninthDigit === '9') {
          return 'phone';
        }
      } else if (numericOnly.length === 10) {
        // Telefone fixo: deve começar com DDD válido (11-99)
        const ddd = numericOnly.substring(0, 2);
        if (parseInt(ddd) >= 11 && parseInt(ddd) <= 99) {
          return 'phone';
        }
      }
    }
    
    // Se tem apenas números mas não é telefone, pode ser ID
    if (/^\d+$/.test(cleanQuery)) {
      return 'id';
    }
    
    // Se tem formato de ID típico (letras + números + hífens)
    if (/^[A-Za-z0-9\-_]+$/.test(cleanQuery) && cleanQuery.length > 5) {
      return 'id';
    }
    
    // Por padrão, assume que é ID se não se encaixa em nenhum padrão
    return 'id';
  }
  
  // Formata data para exibição
  static formatDate(timestamp) {
    if (!timestamp) return 'Data não disponível';
    
    let date;
    if (timestamp.toDate) {
      date = timestamp.toDate(); // Firestore Timestamp
    } else if (timestamp.seconds) {
      date = new Date(timestamp.seconds * 1000);
    } else {
      date = new Date(timestamp);
    }
    
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  // Formata telefone para exibição
  static formatPhone(phone) {
    if (!phone) return '';
    const clean = phone.replace(/\D/g, '');
    if (clean.length === 11) {
      return `(${clean.slice(0,2)}) ${clean.slice(2,7)}-${clean.slice(7)}`;
    } else if (clean.length === 10) {
      return `(${clean.slice(0,2)}) ${clean.slice(2,6)}-${clean.slice(6)}`;
    }
    return phone;
  }
  
  // Gera label do status
  static getStatusLabel(status) {
    if (!status || status === null || status === undefined) {
      return '⏳ Pendente'; // Status padrão
    }
    
    return TRACKING_CONFIG.statusLabels[status] || `📋 ${status}`;
  }
  
  // Gera label do serviço
  static getServiceLabel(service, specificService = null) {
    // Se há um tipo específico de serviço (como impressao, impressao_3d), usar esse
    if (specificService && specificService !== null && specificService !== undefined && specificService !== '') {
      const label = TRACKING_CONFIG.serviceLabels[specificService];
      if (label) {
        return label;
      } else {
        return `⚙️ ${specificService}`;
      }
    }
    
    // Senão, usar o serviço geral
    if (service && service !== null && service !== undefined && service !== '') {
      const label = TRACKING_CONFIG.serviceLabels[service];
      if (label) {
        return label;
      } else {
        return `⚙️ ${service}`;
      }
    }
    
    return `⚙️ Serviço`;
  }
  
  // Mostra loading
  static showLoading(message = 'Buscando solicitação...') {
    const overlay = document.getElementById('loadingOverlay');
    const loadingText = overlay?.querySelector('p');
    if (loadingText) loadingText.textContent = message;
    if (overlay) overlay.style.display = 'flex';
  }
  
  // Esconde loading
  static hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) overlay.style.display = 'none';
  }
  
  // Mostra mensagem de erro
  static showError(message) {
    this.hideLoading();
    const content = document.getElementById('trackingContent');
    
    // Remove erros anteriores
    const oldError = content?.querySelector('.error-message');
    if (oldError) oldError.remove();
    
    if (content) {
      const errorDiv = document.createElement('div');
      errorDiv.className = 'error-message';
      errorDiv.innerHTML = `
        <div class="error-content">
          <span class="error-icon">⚠️</span>
          <span class="error-text">${message}</span>
          <button onclick="this.parentElement.parentElement.remove()" class="error-close">✕</button>
        </div>
      `;
      content.insertBefore(errorDiv, content.firstChild);
    }
  }
  
  // Mostra mensagem de sucesso
  static showSuccess(message) {
    const content = document.getElementById('trackingContent');
    
    if (content) {
      const successDiv = document.createElement('div');
      successDiv.className = 'success-message';
      successDiv.innerHTML = `
        <div class="success-content">
          <span class="success-icon">✅</span>
          <span class="success-text">${message}</span>
        </div>
      `;
      content.insertBefore(successDiv, content.firstChild);
      
      // Remove após 3 segundos
      setTimeout(() => {
        if (successDiv.parentNode) {
          successDiv.remove();
        }
      }, 3000);
    }
  }
  
  // Trunca texto longo
  static truncateText(text, maxLength = 100) {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }
  
  // Gera ID único para elementos
  static generateId() {
    return 'tracking_' + Math.random().toString(36).substr(2, 9);
  }
  
  // Scroll suave para elemento
  static scrollToElement(elementId, offset = 0) {
    const element = document.getElementById(elementId);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }
  
  // Escape HTML
  static escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  // Atualiza placeholder do campo de busca
  static updateSearchPlaceholder() {
    const searchType = document.getElementById('searchType');
    const searchInput = document.getElementById('searchInput');
    
    if (!searchType || !searchInput) return;
    
    const selectedType = searchType.value;
    
    const placeholders = {
      'id': 'Digite o código da solicitação (ex: SOL-240101-001)',
      'email': 'Digite o email completo (ex: usuario@email.com)',
      'phone': 'Digite o telefone com DDD (ex: 11999887766)'
    };
    
    const titles = {
      'id': 'Buscar por código único da solicitação',
      'email': 'Buscar por endereço de email usado na solicitação',
      'phone': 'Buscar por número de telefone/WhatsApp'
    };
    
    if (placeholders[selectedType]) {
      searchInput.placeholder = placeholders[selectedType];
      searchInput.title = titles[selectedType];
    }
    
    // Validar input atual se houver algo digitado
    const currentValue = searchInput.value.trim();
    if (currentValue) {
      this.validateCurrentInput(selectedType, currentValue);
    }
  }
  
  // Valida input atual e mostra aviso se não corresponde ao tipo selecionado
  static validateCurrentInput(selectedType, value) {
    const autoDetectedType = this.determineSearchType(value);
    const searchInput = document.getElementById('searchInput');
    
    // Remove avisos anteriores
    const existingWarning = document.querySelector('.input-type-warning');
    if (existingWarning) {
      existingWarning.remove();
    }
    
    if (selectedType !== autoDetectedType && value.length > 2) {
      const warningDiv = document.createElement('div');
      warningDiv.className = 'input-type-warning';
      warningDiv.style.cssText = `
        background: #fff3cd;
        border: 1px solid #ffeaa7;
        color: #856404;
        padding: 8px 12px;
        border-radius: 4px;
        font-size: 0.9rem;
        margin-top: 5px;
        display: flex;
        align-items: center;
        gap: 8px;
      `;
      
      let warningText = '';
      switch (autoDetectedType) {
        case 'email':
          warningText = '⚠️ O texto parece ser um email. Considere selecionar "Email" na busca.';
          break;
        case 'phone':
          warningText = '⚠️ O texto parece ser um telefone. Considere selecionar "Telefone" na busca.';
          break;
        case 'id':
          warningText = '⚠️ O texto parece ser um código. Considere selecionar "Código da Solicitação" na busca.';
          break;
      }
      
      warningDiv.innerHTML = `
        <span>${warningText}</span>
        <button onclick="this.parentElement.remove()" style="background: none; border: none; color: #856404; cursor: pointer; font-size: 16px; margin-left: auto;">&times;</button>
      `;
      
      searchInput.parentElement.appendChild(warningDiv);
    }
  }
}

// Função global para compatibilidade com HTML inline
window.updateSearchPlaceholder = () => TrackingUtils.updateSearchPlaceholder();

// Debug removido para produção - v3.0.2
