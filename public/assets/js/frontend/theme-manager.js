/* ==========================================
   SENAI Lab v3.0.1 - Theme Manager
   Sistema de gerenciamento de temas
   ========================================== */

// ===== CONFIGURAÇÃO DE TEMAS =====

// Temas disponíveis
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

// ===== FUNÇÕES DE TEMA =====

// Função segura para aplicar tema
function applyTheme(theme) {
  // Só aceita 'light' ou 'dark'
  const validTheme = theme === 'dark' ? 'dark' : 'light';
  document.body.classList.remove(THEMES.light.class, THEMES.dark.class);
  document.body.classList.add(THEMES[validTheme].class);
  
  // Atualizar ícone do botão de tema
  const icon = document.getElementById('themeIcon');
  if (icon) {
    icon.textContent = validTheme === 'light' ? '🌙' : '☀️';
  }
  
  // Salvar preferência
  localStorage.setItem('senai-theme', validTheme);
  
  // Log apenas em modo de desenvolvimento
  if (window.location.hostname === 'localhost') {
    console.log(`🎨 Tema aplicado: ${validTheme}`);
  }
}

// Alterna entre claro e escuro
function toggleTheme() {
  const current = localStorage.getItem('senai-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
}

// Obter tema atual
function getCurrentTheme() {
  return localStorage.getItem('senai-theme') || 'light';
}

// Verificar se é tema escuro
function isDarkTheme() {
  return getCurrentTheme() === 'dark';
}

// ===== INICIALIZAÇÃO =====

// Inicialização do sistema de temas
function initializeThemeSystem() {
  // Carregar tema salvo
  let saved = localStorage.getItem('senai-theme');
  if (saved !== 'light' && saved !== 'dark') {
    saved = 'light';
  }
  
  // Aplicar tema
  applyTheme(saved);
  
  // Configurar botão de alternância
  const btn = document.getElementById('toggleThemeBtn');
  if (btn) {
    btn.addEventListener('click', toggleTheme);
    
    // Adicionar tooltip
    btn.title = `Alternar para tema ${saved === 'light' ? 'escuro' : 'claro'}`;
    
    // Atualizar tooltip quando tema mudar
    btn.addEventListener('click', () => {
      setTimeout(() => {
        const current = getCurrentTheme();
        btn.title = `Alternar para tema ${current === 'light' ? 'escuro' : 'claro'}`;
      }, 100);
    });
  }
}

// ===== AUTO-INICIALIZAÇÃO =====

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', initializeThemeSystem);

// ===== EXPORTAÇÕES =====

// Exportar funções para uso global
window.applyTheme = applyTheme;
window.toggleTheme = toggleTheme;
window.getCurrentTheme = getCurrentTheme;
window.isDarkTheme = isDarkTheme;
