/* ==========================================
   SENAI Lab v3.0.0 - Navigation Handler
   Gerenciamento de navegação entre telas
   ========================================== */

// ===== NAVEGAÇÃO ENTRE TELAS =====

// Mostrar formulário de nova solicitação
function showNewRequestForm() {
  const mainSelection = document.getElementById('mainSelection');
  const formContent = document.getElementById('formContent');
  
  if (mainSelection && formContent) {
    // Adicionar classe de saída
    mainSelection.style.opacity = '0';
    mainSelection.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
      mainSelection.style.display = 'none';
      formContent.style.display = 'block';
      formContent.style.opacity = '0';
      formContent.style.transform = 'translateY(20px)';
      
      // Animar entrada
      requestAnimationFrame(() => {
        formContent.style.transition = 'all 0.3s ease';
        formContent.style.opacity = '1';
        formContent.style.transform = 'translateY(0)';
      });
      
      // Scroll para o topo
      window.scrollTo(0, 0);
      
      // Focar no primeiro campo do formulário
      setTimeout(() => {
        const firstInput = document.querySelector('#formContent input');
        if (firstInput) {
          firstInput.focus();
        }
      }, 350);
    }, 300);
  }
}

// Mostrar tela de seleção principal
function showMainSelection() {
  const mainSelection = document.getElementById('mainSelection');
  const formContent = document.getElementById('formContent');
  
  if (mainSelection && formContent) {
    // Se estiver vindo do formulário, animar
    if (formContent.style.display !== 'none') {
      formContent.style.opacity = '0';
      formContent.style.transform = 'translateY(-20px)';
      
      setTimeout(() => {
        formContent.style.display = 'none';
        mainSelection.style.display = 'block';
        mainSelection.style.opacity = '0';
        mainSelection.style.transform = 'translateY(20px)';
        
        // Animar entrada
        requestAnimationFrame(() => {
          mainSelection.style.transition = 'all 0.3s ease';
          mainSelection.style.opacity = '1';
          mainSelection.style.transform = 'translateY(0)';
        });
      }, 300);
    } else {
      // Primeira carga
      formContent.style.display = 'none';
      mainSelection.style.display = 'block';
      mainSelection.style.opacity = '1';
      mainSelection.style.transform = 'translateY(0)';
    }
    
    // Scroll para o topo
    window.scrollTo(0, 0);
  }
}

// Ir para página de tracking
function goToTracking() {
  // Adicionar efeito visual antes de navegar
  const trackCard = document.getElementById('trackRequestCard');
  if (trackCard) {
    trackCard.style.transform = 'scale(0.95)';
    setTimeout(() => {
      window.location.href = 'tracking.html';
    }, 150);
  } else {
    window.location.href = 'tracking.html';
  }
}

// Função para lidar com o botão voltar
function handleBackButton() {
  const form = document.getElementById('senaiForm');
  let hasData = false;
  
  // Verificar se há dados no formulário
  if (form) {
    const inputs = form.querySelectorAll('input, select, textarea');
    for (let input of inputs) {
      if (input.value.trim() !== '' && input.type !== 'checkbox' && input.type !== 'radio') {
        hasData = true;
        break;
      }
      if ((input.type === 'checkbox' || input.type === 'radio') && input.checked) {
        hasData = true;
        break;
      }
    }
  }
  
  // Se há dados, confirmar antes de voltar
  if (hasData) {
    if (confirm('Há dados preenchidos no formulário. Deseja realmente voltar e perder essas informações?')) {
      form.reset();
      // Resetar campos específicos
      if (window.MultiFileManager) {
        window.MultiFileManager.clearAll();
      }
      showMainSelection();
    }
  } else {
    showMainSelection();
  }
}

// ===== INICIALIZAÇÃO =====

// Garantir que a tela inicial seja sempre a de seleção
document.addEventListener('DOMContentLoaded', function() {
  showMainSelection();
  
  // Adicionar listeners para teclado
  document.addEventListener('keydown', function(e) {
    // ESC para voltar
    if (e.key === 'Escape') {
      const formContent = document.getElementById('formContent');
      if (formContent && formContent.style.display !== 'none') {
        handleBackButton();
      }
    }
    
    // Tab navigation melhorada para cards
    if (e.key === 'Tab') {
      const mainSelection = document.getElementById('mainSelection');
      if (mainSelection && mainSelection.style.display !== 'none') {
        const cards = mainSelection.querySelectorAll('.selection-card');
        const focusedCard = document.activeElement;
        
        if (cards.length > 0 && !Array.from(cards).includes(focusedCard)) {
          // Se nenhum card está focado, focar no primeiro
          if (!e.shiftKey) {
            e.preventDefault();
            cards[0].focus();
          }
        }
      }
    }
    
    // Números 1 e 2 para seleção rápida
    if (e.key === '1') {
      const mainSelection = document.getElementById('mainSelection');
      if (mainSelection && mainSelection.style.display !== 'none') {
        showNewRequestForm();
      }
    }
    
    if (e.key === '2') {
      const mainSelection = document.getElementById('mainSelection');
      if (mainSelection && mainSelection.style.display !== 'none') {
        goToTracking();
      }
    }
  });
});

// Exportar funções para uso global
window.showNewRequestForm = showNewRequestForm;
window.showMainSelection = showMainSelection;
window.goToTracking = goToTracking;
window.handleBackButton = handleBackButton;
