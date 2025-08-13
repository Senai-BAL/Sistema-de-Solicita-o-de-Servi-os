/* 🔧 SENAI Lab - Navegação e Interface
 * Arquivo: public/assets/js/navigation.js
 * Descrição: Controle de navegação do formulário, máscaras e eventos de interface
 */

// NAVEGAÇÃO DO FORMULÁRIO
function setupFormNavigation() {
  document.getElementById('servico').addEventListener('change', function () {
    const value = this.value;
    hideAllSections();
    
    // Resetar e esconder o select de tipo de serviço
    document.getElementById('tipoServico').style.display = 'none';
    document.getElementById('tipoServicoSelect').value = '';

    if (value === 'servicos') {
      document.getElementById('tipoServico').style.display = 'block';
    } else if (value === 'espaco_maker') {
      showSection('espacoMakerSection');
    } else if (value === 'emprestimo') {
      showSection('emprestimoSection');
    }
    updateProgress();
  });

  document.getElementById('tipoServicoSelect').addEventListener('change', function () {
    const value = this.value;
    hideAllSections();

    if (value === 'impressao') {
      showSection('impressaoSection');
    } else if (value === 'impressao_3d') {
      showSection('impressao3dSection');
    } else if (value === 'manutencao') {
      showSection('manutencaoSection');
    } else if (value === 'arte_digital' || value === 'projeto') {
      showSection('arteProjetoSection');
    }
    updateProgress();
  });

  document.getElementById('chromeBooks').addEventListener('change', function () {
    document.getElementById('qtdChromeBooks').style.display = this.checked ? 'block' : 'none';
  });

  document.getElementById('computadores').addEventListener('change', function () {
    document.getElementById('qtdComputadores').style.display = this.checked ? 'block' : 'none';
  });

  document.getElementById('possuiSTL').addEventListener('change', function () {
    const stlGroup = document.getElementById('arquivoSTLGroup');
    const descGroup = document.getElementById('descricaoPecaGroup');

    if (this.checked) {
      stlGroup.style.display = 'block';
      descGroup.style.display = 'none';
    } else {
      stlGroup.style.display = 'none';
      descGroup.style.display = 'block';
    }
  });

  // Event listeners para validação de datas
  document.getElementById('dataDevolucao').addEventListener('change', function () {
    const dataRetirada = document.getElementById('dataRetirada').value;
    const dataDevolucao = this.value;

    if (dataRetirada && dataDevolucao && new Date(dataDevolucao) <= new Date(dataRetirada)) {
      showStatus('A data de devolução deve ser posterior à data de retirada!', 'error');
      this.value = '';
    }
  });

  // Event listener para o formulário
  document.getElementById('senaiForm').addEventListener('submit', function (e) {
    e.preventDefault();
    if (validateForm()) {
      submitForm();
    }
  });

  // Event listeners para atualização de progresso
  document.addEventListener('input', updateProgress);
  document.addEventListener('change', updateProgress);
}

// 📱 MÁSCARA PARA WHATSAPP
function setupWhatsAppMask() {
  const whatsappInput = document.getElementById('whatsapp');
  
  whatsappInput.addEventListener('input', function (e) {
    let value = e.target.value.replace(/\D/g, ''); // Remove tudo que não é dígito
    let formattedValue = '';
    
    // Aplicar máscara baseada no comprimento
    if (value.length === 0) {
      formattedValue = '';
    } else if (value.length <= 2) {
      formattedValue = `(${value}`;
    } else if (value.length <= 7) {
      formattedValue = `(${value.substring(0, 2)}) ${value.substring(2)}`;
    } else if (value.length <= 11) {
      formattedValue = `(${value.substring(0, 2)}) ${value.substring(2, 7)}-${value.substring(7)}`;
    } else {
      // Limitar a 11 dígitos
      value = value.substring(0, 11);
      formattedValue = `(${value.substring(0, 2)}) ${value.substring(2, 7)}-${value.substring(7)}`;
    }
    
    e.target.value = formattedValue;
  });

  whatsappInput.addEventListener('keydown', function (e) {
    // Permitir backspace, delete, tab, escape, enter
    if ([8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
      // Permitir Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
      (e.keyCode === 65 && e.ctrlKey === true) ||
      (e.keyCode === 67 && e.ctrlKey === true) ||
      (e.keyCode === 86 && e.ctrlKey === true) ||
      (e.keyCode === 88 && e.ctrlKey === true)) {
      return;
    }
    // Garantir que é um número
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault();
    }
  });

  // Tratar especialmente o backspace para limpar melhor
  whatsappInput.addEventListener('keydown', function (e) {
    if (e.keyCode === 8) { // Backspace
      const currentValue = e.target.value;
      const cursorPosition = e.target.selectionStart;
      
      // Se o cursor está numa posição de caractere especial, mover para o dígito anterior
      if (cursorPosition > 0) {
        const charAtCursor = currentValue[cursorPosition - 1];
        if (charAtCursor === ')' || charAtCursor === '-') {
          e.preventDefault();
          // Remover o dígito anterior ao caractere especial
          const newValue = currentValue.substring(0, cursorPosition - 2) + currentValue.substring(cursorPosition);
          e.target.value = newValue;
          // Reposicionar cursor
          setTimeout(() => {
            e.target.setSelectionRange(cursorPosition - 2, cursorPosition - 2);
          }, 0);
          // Disparar evento input para reaplicar a máscara
          e.target.dispatchEvent(new Event('input'));
        }
      }
    }
  });

  // Tratar paste e casos especiais
  whatsappInput.addEventListener('paste', function (e) {
    e.preventDefault();
    const pastedText = (e.clipboardData || window.clipboardData).getData('text');
    const digitsOnly = pastedText.replace(/\D/g, '');
    
    // Aplicar máscara aos dígitos colados
    let formattedValue = '';
    if (digitsOnly.length === 0) {
      formattedValue = '';
    } else if (digitsOnly.length <= 2) {
      formattedValue = `(${digitsOnly}`;
    } else if (digitsOnly.length <= 7) {
      formattedValue = `(${digitsOnly.substring(0, 2)}) ${digitsOnly.substring(2)}`;
    } else if (digitsOnly.length <= 11) {
      formattedValue = `(${digitsOnly.substring(0, 2)}) ${digitsOnly.substring(2, 7)}-${digitsOnly.substring(7)}`;
    } else {
      // Limitar a 11 dígitos
      const limitedDigits = digitsOnly.substring(0, 11);
      formattedValue = `(${limitedDigits.substring(0, 2)}) ${limitedDigits.substring(2, 7)}-${limitedDigits.substring(7)}`;
    }
    
    e.target.value = formattedValue;
  });
}

// Função para inicializar estado dos campos
function initializeFieldStates() {
  // Desabilitar todos os campos obrigatórios de seções ocultas no início
  hideAllSections();
  updateProgress();
}

// Chamar a inicialização quando a página carrega
document.addEventListener('DOMContentLoaded', initializeFieldStates);

function hideAllSections() {
  document.querySelectorAll('.service-section').forEach(section => {
    section.classList.remove('active');
    // Desabilitar campos obrigatórios em seções ocultas
    const requiredFields = section.querySelectorAll('[required]');
    requiredFields.forEach(field => {
      field.disabled = true;
    });
  });
}

function showSection(sectionId) {
  const section = document.getElementById(sectionId);
  section.classList.add('active');
  // Habilitar campos obrigatórios na seção ativa
  const requiredFields = section.querySelectorAll('[required]');
  requiredFields.forEach(field => {
    field.disabled = false;
  });
}

function updateProgress() {
  const form = document.getElementById('senaiForm');
  const allInputs = form.querySelectorAll('input[required], select[required], textarea[required]');
  
  // Filtrar apenas campos visíveis e habilitados
  const visibleInputs = Array.from(allInputs).filter(input => {
    const parent = input.closest('.form-group, .service-section');
    return parent && window.getComputedStyle(parent).display !== 'none' && !input.disabled;
  });
  
  const filledInputs = visibleInputs.filter(input => {
    if (input.type === 'checkbox') return true;
    if (input.type === 'file') {
      // Para campos de arquivo, verificar se há arquivos selecionados
      return input.files && input.files.length > 0;
    }
    return input.value.trim() !== '';
  });

  const progress = visibleInputs.length > 0 ? Math.min((filledInputs.length / visibleInputs.length) * 100, 100) : 25;
  document.getElementById('progressFill').style.width = progress + '%';
}
