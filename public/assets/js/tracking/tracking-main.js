/* ==========================================
   SENAI Lab v3.0.0 - Tracking Main
   Integração principal do sistema
   ========================================== */

// Sistema principal de tracking
class TrackingMain {
  
  constructor() {
    this.initialize();
  }
  
  async initialize() {
    console.log('🚀 Inicializando Sistema de Tracking...');
    
    try {
      // Aguarda carregamento do Firebase
      await this.waitForFirebase();
      
      // Inicializa componentes
      this.setupEventListeners();
      this.setupTheme();
      
      // Não restaurar estado automaticamente
      // this.restoreSearchState();
      
      console.log('✅ Sistema de Tracking inicializado com sucesso');
      
    } catch (error) {
      console.error('❌ Erro ao inicializar tracking:', error);
      TrackingUtils.showError('Erro ao inicializar sistema. Recarregue a página.');
    }
  }
  
  async waitForFirebase() {
    return new Promise((resolve, reject) => {
      let attempts = 0;
      const maxAttempts = 30;
      
      const checkFirebase = () => {
        if (window.firebase && window.db) {
          resolve();
        } else if (attempts < maxAttempts) {
          attempts++;
          setTimeout(checkFirebase, 100);
        } else {
          reject(new Error('Firebase não carregado'));
        }
      };
      
      checkFirebase();
    });
  }
  
  setupEventListeners() {
    // Busca por Enter
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.handleSearch();
        }
      });
      
      // Auto-clear on focus (mas apenas se usuário começar a digitar)
      searchInput.addEventListener('input', () => {
        // Se usuário começar a digitar algo diferente, limpar estado
        const currentValue = searchInput.value.trim();
        const savedState = localStorage.getItem('tracking_search_state');
        
        if (savedState) {
          const state = JSON.parse(savedState);
          if (currentValue !== state.query) {
            this.clearSearchState();
            TrackingDisplay.clearResults();
          }
        }
        
        // Validar tipo de input em tempo real
        const searchType = document.getElementById('searchType');
        if (searchType && currentValue) {
          TrackingUtils.validateCurrentInput(searchType.value, currentValue);
        }
      });
    }
    
    // Mudança no tipo de busca
    const searchType = document.getElementById('searchType');
    if (searchType) {
      searchType.addEventListener('change', () => {
        TrackingUtils.updateSearchPlaceholder();
        
        // Validar input atual se houver
        const searchInput = document.getElementById('searchInput');
        if (searchInput && searchInput.value.trim()) {
          TrackingUtils.validateCurrentInput(searchType.value, searchInput.value.trim());
        }
      });
    }
    
    // Botão de busca
    const searchButton = document.getElementById('searchButton');
    if (searchButton) {
      searchButton.addEventListener('click', () => {
        this.handleSearch();
      });
    }
    
    // Botão de limpar
    const clearButton = document.getElementById('clearButton');
    if (clearButton) {
      clearButton.addEventListener('click', () => {
        TrackingDisplay.clearResults();
      });
    }
    
    // Botão de nova busca (se existir)
    const newSearchBtn = document.querySelector('.btn-new-search');
    if (newSearchBtn) {
      newSearchBtn.addEventListener('click', () => {
        TrackingDisplay.clearResults();
      });
    }
    
    // Configurar placeholder inicial
    TrackingUtils.updateSearchPlaceholder();
  }
  
  async handleSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchTypeSelect = document.getElementById('searchType');
    if (!searchInput || !searchTypeSelect) return;
    
    const query = searchInput.value.trim();
    const selectedType = searchTypeSelect.value;
    
    if (!query) {
      TrackingUtils.showError('Digite um código, email ou telefone para buscar');
      searchInput.focus();
      return;
    }
    
    // 🔍 VALIDAÇÃO: Verificar se o dado corresponde ao tipo selecionado
    const autoDetectedType = TrackingUtils.determineSearchType(query);
    
    if (selectedType !== autoDetectedType) {
      let errorMessage = '';
      
      switch (selectedType) {
        case 'id':
          errorMessage = 'Você selecionou "Código da Solicitação", mas o texto digitado não parece ser um código válido. Verifique se digitou corretamente ou mude o tipo de busca.';
          break;
        case 'email':
          errorMessage = 'Você selecionou "Email", mas o texto digitado não é um email válido. Certifique-se de incluir o @ e o domínio (ex: usuario@email.com).';
          break;
        case 'phone':
          errorMessage = 'Você selecionou "Telefone", mas o texto digitado não parece ser um número de telefone. Digite apenas números (ex: 11999887766).';
          break;
      }
      
      TrackingUtils.showError(errorMessage);
      searchInput.focus();
      return;
    }
    
    try {
      // Mostra loading
      this.showLoading(true);
      
      // Realiza busca com o tipo validado
      let results = [];
      
      switch (selectedType) {
        case 'id':
          results = await TrackingSearch.searchById(query);
          break;
          
        case 'email':
          results = await TrackingSearch.searchByEmail(query);
          break;
          
        case 'phone':
          results = await TrackingSearch.searchByPhone(query);
          break;
          
        default:
          throw new Error('Tipo de busca não reconhecido');
      }
      
      // Mostra resultados
      if (results.length === 0) {
        this.showNoResults(query, selectedType);
        this.clearSearchState(); // Limpar estado se não há resultados
      } else if (results.length === 1) {
        TrackingDisplay.showSolicitationDetails(results[0]);
        // Não salvar estado automaticamente
      } else {
        TrackingDisplay.showSearchResults(results);
        // Não salvar estado automaticamente
      }
      
    } catch (error) {
      console.error('❌ Erro na busca:', error);
      TrackingUtils.showError('Erro ao buscar. Tente novamente.');
    } finally {
      this.showLoading(false);
    }
  }
  
  showLoading(show) {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
      overlay.style.display = show ? 'flex' : 'none';
    }
    
    const searchButton = document.getElementById('searchButton');
    if (searchButton) {
      searchButton.disabled = show;
      searchButton.textContent = show ? '🔍 Buscando...' : '🔍 Buscar';
    }
  }
  
  showNoResults(query, searchType) {
    const container = document.getElementById('searchResults');
    if (!container) return;
    
    const typeLabel = {
      id: 'código',
      email: 'email',
      phone: 'telefone'
    }[searchType] || 'critério';
    
    container.innerHTML = `
      <div class="no-results">
        <div class="no-results-icon">🔍</div>
        <h2>Nenhum resultado encontrado</h2>
        <p>Não foram encontradas solicitações para o ${typeLabel}: <strong>${query}</strong></p>
        <div class="no-results-tips">
          <h3>💡 Dicas de busca:</h3>
          <ul>
            <li><strong>Código:</strong> Digite o código completo (ex: SOL-240101-001)</li>
            <li><strong>Email:</strong> Digite o email completo usado na solicitação</li>
            <li><strong>Telefone:</strong> Digite com ou sem formatação (ex: 11999887766)</li>
          </ul>
          
          ${searchType === 'email' || searchType === 'phone' ? `
          <div class="info-note" style="margin-top: 15px; padding: 10px; background: #e3f2fd; border-left: 4px solid #2196f3; border-radius: 4px;">
            <p style="margin: 0; font-size: 14px;">
              ℹ️ <strong>Informação:</strong> Os índices do Firebase ainda podem estar sendo construídos. 
              Isso pode afetar a velocidade das buscas por email e telefone temporariamente.
            </p>
          </div>
          ` : ''}
        </div>
        <button onclick="TrackingDisplay.clearResults()" class="btn-primary">
          🔍 Nova Busca
        </button>
      </div>
    `;
    
    container.style.display = 'block';
    TrackingUtils.scrollToElement('searchResults', 20);
  }
  
  setupTheme() {
    // Detecta preferência de tema
    const savedTheme = localStorage.getItem('trackingTheme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');
    this.applyTheme(theme);
    
    // Botão de tema
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
      });
    }
  }
  
  applyTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('trackingTheme', theme);
    
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
      themeToggle.title = theme === 'light' ? 'Modo Escuro' : 'Modo Claro';
    }
  }
  
  // 💾 PERSISTÊNCIA DE ESTADO
  saveSearchState(query, results, searchType) {
    try {
      const state = {
        query: query,
        results: results,
        searchType: searchType,
        timestamp: Date.now(),
        selectedIndex: TrackingDisplay.currentSelectedIndex || null
      };
      
      localStorage.setItem('tracking_search_state', JSON.stringify(state));
      console.log('💾 Estado da pesquisa salvo:', state);
    } catch (error) {
      console.warn('⚠️ Erro ao salvar estado da pesquisa:', error);
    }
  }
  
  async restoreSearchState() {
    try {
      const savedState = localStorage.getItem('tracking_search_state');
      if (!savedState) return;
      
      const state = JSON.parse(savedState);
      
      // Verificar se o estado não é muito antigo (24 horas)
      const maxAge = 24 * 60 * 60 * 1000; // 24 horas em ms
      if (Date.now() - state.timestamp > maxAge) {
        localStorage.removeItem('tracking_search_state');
        return;
      }
      
      console.log('🔄 Restaurando estado da pesquisa:', state);
      
      // Restaurar campo de busca
      const searchInput = document.getElementById('searchInput');
      if (searchInput && state.query) {
        searchInput.value = state.query;
      }
      
      // Restaurar resultados se existirem
      if (state.results && state.results.length > 0) {
        // Mostrar indicador que o estado foi restaurado
        this.showRestoredStateMessage();
        
        if (state.results.length === 1) {
          // Mostrar detalhes direto se era apenas um resultado
          TrackingDisplay.showSolicitationDetails(state.results[0]);
        } else {
          // Mostrar lista de resultados múltiplos
          TrackingDisplay.showSearchResults(state.results);
          
          // Restaurar seleção se havia uma
          if (state.selectedIndex !== null && state.selectedIndex >= 0) {
            setTimeout(() => {
              TrackingDisplay.selectResult(state.selectedIndex);
            }, 100);
          }
        }
      }
      
    } catch (error) {
      console.warn('⚠️ Erro ao restaurar estado da pesquisa:', error);
      localStorage.removeItem('tracking_search_state');
    }
  }
  
  clearSearchState() {
    localStorage.removeItem('tracking_search_state');
    console.log('🗑️ Estado da pesquisa limpo');
  }
  
  showRestoredStateMessage() {
    const message = document.createElement('div');
    message.className = 'restored-state-message';
    message.innerHTML = `
      <div style="background: #e3f2fd; border: 1px solid #2196f3; border-radius: 8px; padding: 12px; margin: 10px 0; color: #0d47a1; font-size: 14px; display: flex; align-items: center; gap: 8px;">
        <span>🔄</span>
        <span>Pesquisa anterior restaurada automaticamente</span>
        <button onclick="this.parentElement.parentElement.remove()" style="margin-left: auto; background: none; border: none; color: #0d47a1; cursor: pointer; font-size: 16px;">&times;</button>
      </div>
    `;
    
    const searchContainer = document.querySelector('.search-container') || document.querySelector('.container');
    if (searchContainer) {
      searchContainer.insertAdjacentElement('afterend', message);
      
      // Auto-remover após 5 segundos
      setTimeout(() => {
        if (message.parentElement) {
          message.remove();
        }
      }, 5000);
    }
  }
}

// Inicialização automática quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  // Aguarda um pouco para garantir que outros scripts carregaram
  setTimeout(() => {
    window.trackingMain = new TrackingMain();
  }, 500);
});

// Função global para compatibilidade com HTML inline
window.searchSolicitation = async () => {
  if (window.trackingMain) {
    await window.trackingMain.handleSearch();
  } else {
    console.error('Sistema de tracking não inicializado');
    alert('Sistema ainda não carregou. Aguarde um momento e tente novamente.');
  }
};

console.log('🎯 Tracking Main carregado');
