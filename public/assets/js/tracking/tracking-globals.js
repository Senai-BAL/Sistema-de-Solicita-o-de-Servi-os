/* ==========================================
   SENAI Lab v3.0.0 - Tracking Global Functions
   Funções globais para sistema de tracking
   ========================================== */

// 🔍 FUNÇÕES GLOBAIS PARA TRACKING
function searchSolicitation() {
  if (window.trackingMain) {
    window.trackingMain.handleSearch();
  } else {
    console.error('TrackingMain não encontrado');
  }
}

function clearSearch() {
  // Limpar campos
  const searchInput = document.getElementById('searchInput');
  const searchType = document.getElementById('searchType');
  
  if (searchInput) {
    searchInput.value = '';
    searchInput.focus();
  }
  
  if (searchType) {
    searchType.selectedIndex = 0;
    updateSearchPlaceholder();
  }
  
  // Limpar resultados
  if (window.TrackingDisplay) {
    window.TrackingDisplay.clearResults();
  }
  
  // Limpar localStorage
  localStorage.removeItem('tracking_search_state');
  
  // Limpar elementos de resultado
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
  
  // Mostrar feedback visual
  showClearFeedback();
  
  console.log('🗑️ Busca limpa com sucesso');
}

function showClearFeedback() {
  const feedback = document.createElement('div');
  feedback.className = 'clear-feedback';
  feedback.innerHTML = '🗑️ Busca limpa com sucesso!';
  feedback.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--success);
    color: var(--feedback-text);
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px var(--shadow);
    z-index: 10000;
    font-weight: 600;
    animation: slideInRight 0.3s ease-out;
    border: 1px solid var(--border);
  `;
  
  document.body.appendChild(feedback);
  
  setTimeout(() => {
    feedback.style.animation = 'slideOutRight 0.3s ease-in';
    setTimeout(() => {
      if (feedback.parentElement) {
        feedback.remove();
      }
    }, 300);
  }, 2000);
}

function updateSearchPlaceholder() {
  const searchType = document.getElementById('searchType');
  const searchInput = document.getElementById('searchInput');
  
  if (!searchType || !searchInput) return;
  
  const placeholders = {
    'id': 'Digite o código da solicitação...',
    'email': 'Digite o email usado na solicitação...',
    'phone': 'Digite o telefone com DDD (ex: 11999887766)...'
  };
  
  searchInput.placeholder = placeholders[searchType.value] || 'Digite os dados...';
}

// 🎨 SISTEMA DE TEMAS
const THEMES = {
  light: {
    name: 'Light Professional',
    class: 'theme-light-professional',
    icon: '💼',
  },
  dark: {
    name: 'Dark Slate',
    class: 'theme-dark-slate',
    icon: '🌚',
  }
};

// Função segura para aplicar tema
function applyTheme(theme) {
  // Só aceita 'light' ou 'dark'
  const validTheme = theme === 'dark' ? 'dark' : 'light';
  document.body.classList.remove(THEMES.light.class, THEMES.dark.class);
  document.body.classList.add(THEMES[validTheme].class);
  const icon = document.getElementById('themeIcon');
  if (icon) icon.textContent = validTheme === 'light' ? '🌙' : '☀️';
  localStorage.setItem('senai-theme', validTheme);
}

// Alterna entre claro e escuro
function toggleTheme() {
  const current = localStorage.getItem('senai-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
}

// 🚀 INICIALIZAÇÃO
document.addEventListener('DOMContentLoaded', function() {
  let saved = localStorage.getItem('senai-theme');
  if (saved !== 'light' && saved !== 'dark') saved = 'light';
  applyTheme(saved);
  const btn = document.getElementById('toggleThemeBtn');
  if (btn) btn.addEventListener('click', toggleTheme);
});
