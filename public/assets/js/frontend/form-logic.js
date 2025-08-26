/* 🔧 SENAI Lab - Lógica do Formulário v2.9.8
 * Arquivo: public/assets/js/form-logic.js
 * Descrição: Coleta de dados, validação e envio com UX melhorado
 */

// 🔧 VERIFICAÇÃO DE CONFIGURAÇÃO DE AMBIENTE (produção)
if (typeof ENVIRONMENT_CONFIG === 'undefined') {
  console.error('❌ ENVIRONMENT_CONFIG não encontrado! Verifique se config.js foi carregado.');
}

// 📋 COLETA DE DADOS OTIMIZADA
function collectFormData() {
  const form = document.getElementById('senaiForm');
  const formData = new FormData(form);

  const data = {
    c: formData.get('colaborador'),
    e: formData.get('email'),
    w: formData.get('whatsapp').replace(/\D/g, ''), // Remove máscara do WhatsApp
    s: formData.get('servico'),
    st: 'p',
    d: Date.now(),
    dados: {},
    fonte: 'firebase'
  };

  // Dados específicos por serviço
  if (data.s === 'espaco_maker') {
    data.dados = {
      dr: formData.get('dataReserva'),
      hi: formData.get('horarioInicio'),
      hf: formData.get('horarioFim'),
      cb: formData.get('chromeBooks') === 'on' ? 1 : 0,
      qcb: parseInt(formData.get('qtdChromeBooksInput')) || 0,
      cp: formData.get('computadores') === 'on' ? 1 : 0,
      qcp: parseInt(formData.get('qtdComputadoresInput')) || 0,
      desc: formData.get('descricaoUtilizacao')
    };
  } else if (data.s === 'servicos') {
    const ts = formData.get('tipoServicoSelect');
    data.ts = ts;

    if (ts === 'impressao') {
      data.dados = {
        tf: formData.get('tamanhoFolha'),
        qc: parseInt(formData.get('qtdCopias')),
        fv: formData.get('frenteVerso') === 'on' ? 1 : 0,
        es: formData.get('escanear') === 'on' ? 1 : 0,
        co: formData.get('colorido') === 'on' ? 1 : 0,
        obs: formData.get('observacoesImpressao') || ''
      };
    } else if (ts === 'impressao_3d') {
      data.dados = {
        mt: formData.get('material'),
        qt: parseInt(formData.get('quantidade3d')),
        stl: formData.get('possuiSTL') === 'on' ? 1 : 0,
        dp: formData.get('descricaoPeca'),
        obs: formData.get('observacoes3d') || ''
      };
    } else if (ts === 'manutencao') {
      data.dados = {
        prob: formData.get('descricaoProblema')
      };
    } else if (ts === 'arte_digital' || ts === 'projeto') {
      data.dados = {
        desc: formData.get('descricaoArteProjeto')
      };
    }
  } else if (data.s === 'emprestimo') {
    data.dados = {
      ni: formData.get('nomeItem'),
      dr: formData.get('dataRetirada'),
      dd: formData.get('dataDevolucao'),
      fin: formData.get('finalidadeEmprestimo') || ''
    };
  }

  return data;
}

// 🏷️ GERAR INFORMAÇÕES PARA UPLOAD
function generateServiceInfo(formData) {
  let tipo = '';
  
  if (formData.s === 'espaco_maker') {
    tipo = 'ESPACO_MAKER';
  } else if (formData.s === 'servicos') {
    const ts = formData.ts;
    if (ts === 'impressao') tipo = 'IMPRESSAO';
    else if (ts === 'impressao_3d') tipo = 'IMPRESSAO_3D';
    else if (ts === 'manutencao') tipo = 'MANUTENCAO';
    else if (ts === 'arte_digital') tipo = 'ARTE_DIGITAL';
    else if (ts === 'projeto') tipo = 'PROJETO';
    else tipo = 'SERVICOS';
  } else if (formData.s === 'emprestimo') {
    tipo = 'EMPRESTIMO';
  } else {
    tipo = 'OUTROS';
  }

  return {
    tipo: tipo,
    solicitante: formData.c || 'USUARIO',
    email: formData.e || ''
  };
}

// 🚀 ENVIO COM UPLOAD AUTOMÁTICO
async function submitForm() {
  const submitBtn = document.getElementById('submitBtn');
  const btnText = document.getElementById('btnText');
  const loadingText = document.getElementById('loadingText');
  const form = document.getElementById('senaiForm');

  try {
    // 🛡️ RATE LIMITING: Verificar limites de submissão
    if (window.rateLimiter) {
      const email = form.querySelector('input[name="email"]')?.value || 'anonymous';
      const rateLimitCheck = window.rateLimiter.isAllowed('form_submit', email);
      if (!rateLimitCheck.allowed) {
        // Mostrar feedback visual
        if (window.rateLimitUI) {
          window.rateLimitUI.showRateLimitWarning('form_submit', rateLimitCheck.message, rateLimitCheck.waitTime);
        }
        throw new Error(rateLimitCheck.message || 'Muitas submissões seguidas. Aguarde um momento.');
      }
    }

    // Estados UX v2.7.4
    if (window.UIStates) {
      UIStates.setFormSubmitting(form);
      UIStates.setButtonLoading(submitBtn, 'Enviando...');
    } else {
      // Fallback
      submitBtn.disabled = true;
      btnText.style.display = 'none';
      loadingText.style.display = 'inline';
    }

    if (!navigator.onLine) {
      throw new Error('Sem conexão com a internet.');
    }

    const formData = collectFormData();
    
    // Gerar informações de serviço para upload
    const serviceInfo = generateServiceInfo(formData);

    // Upload de arquivos para Firebase Storage
    const arquivos = [];
    const maxRetries = 3;

    // Upload baseado no tipo de serviço usando novos gerenciadores
    const uploadPromises = [];

    if (formData.s === 'servicos') {
      const tipoServico = formData.ts;

      if (tipoServico === 'impressao') {
        const manager = multiFileManagers['arquivoImpressao'];
        if (manager && manager.hasFiles()) {
          loadingText.textContent = '⏳ Enviando arquivos de impressão...';
          const results = await manager.uploadAll(serviceInfo);
          arquivos.push(...results);
        }
      } else if (tipoServico === 'impressao_3d') {
        const manager = multiFileManagers['arquivoSTL'];
        if (manager && manager.hasFiles()) {
          loadingText.textContent = '⏳ Enviando arquivos STL...';
          const results = await manager.uploadAll(serviceInfo);
          arquivos.push(...results);
        }
      } else if (tipoServico === 'manutencao') {
        const manager = multiFileManagers['fotoProblema'];
        if (manager && manager.hasFiles()) {
          loadingText.textContent = '⏳ Enviando fotos do problema...';
          const results = await manager.uploadAll(serviceInfo);
          arquivos.push(...results);
        }
      } else if (tipoServico === 'arte_digital' || tipoServico === 'projeto') {
        const manager = multiFileManagers['referenciaArte'];
        if (manager && manager.hasFiles()) {
          loadingText.textContent = '⏳ Enviando referências...';
          const results = await manager.uploadAll(serviceInfo);
          arquivos.push(...results);
        }
      }
    } else if (formData.s === 'emprestimo') {
      const manager = multiFileManagers['fotoItem'];
      if (manager && manager.hasFiles()) {
        loadingText.textContent = '⏳ Enviando fotos do item...';
        const results = await manager.uploadAll(serviceInfo);
        arquivos.push(...results);
      }
    }

    // Adicionar arquivos aos dados
    if (arquivos.length > 0) {
      formData.arq = arquivos.map(arq => ({
        n: arq.name,
        u: arq.url,
        s: arq.size,
        t: arq.type,
        p: arq.path
      }));
    }

    // Salvar no Firestore
    loadingText.textContent = '⏳ Salvando dados...';
    


    
    try {
      const docRef = await db.collection(collectionName).add(formData);
      usageMonitor.addWrite();
      
      // Estados de sucesso UX v2.7.4
      if (window.UIStates) {
        UIStates.setFormSuccess(form, 'Solicitação enviada com sucesso!');
        UIStates.setButtonSuccess(submitBtn, '✓ Enviado');
      }
      
      showSuccessScreen(docRef.id);
    } catch (firestoreError) {
      console.error('❌ Erro específico do Firestore:', firestoreError);
      
      // Tentar salvar com regras mais permissivas
      if (firestoreError.code === 'permission-denied') {
        // Tentar na coleção principal
        try {
          const docRef = await db.collection(ENVIRONMENT_CONFIG.collections[ENVIRONMENT_CONFIG.mode]).add(formData);
          usageMonitor.addWrite();
          
          // Estados de sucesso UX v2.7.4
          if (window.UIStates) {
            UIStates.setFormSuccess(form, 'Solicitação enviada com sucesso!');
            UIStates.setButtonSuccess(submitBtn, '✓ Enviado');
          }
          
          showSuccessScreen(docRef.id);
          return;
        } catch (secondError) {
          console.error('❌ Erro também na coleção principal:', secondError);
          throw firestoreError; // Relançar o erro original
        }
      } else {
        throw firestoreError;
      }
    }

  } catch (error) {
    console.error('❌ Erro ao enviar:', error);
    console.error('❌ Código do erro:', error.code);
    console.error('❌ Mensagem completa:', error.message);

    let errorMessage = 'Erro ao enviar solicitação. ';
    
    if (error.code === 'permission-denied') {
      errorMessage = '🔒 Erro de permissão no Firebase. Verifique as regras do Firestore.';
    } else if (error.message.includes('Storage')) {
      errorMessage += 'Problema no upload de arquivos.';
    } else if (error.message.includes('quota')) {
      errorMessage += 'Limite diário atingido.';
    } else if (error.code === 'unavailable') {
      errorMessage = '🌐 Firebase temporariamente indisponível. Tente novamente.';
    } else {
      errorMessage += `Detalhes: ${error.message}`;
    }

    // Estados de erro UX v2.7.4
    if (window.UIStates) {
      UIStates.setFormError(form, errorMessage);
      UIStates.setButtonError(submitBtn, '✗ Erro');
    } else {
      // Fallback
      showStatus(errorMessage, 'error');
      submitBtn.disabled = false;
      btnText.style.display = 'inline';
      loadingText.style.display = 'none';
    }
  }
}

function validateForm() {
  const servico = document.getElementById('servico').value;

  // 🛡️ ENHANCED VALIDATION: Nome do colaborador
  const colaborador = document.getElementById('colaborador').value.trim();
  if (!colaborador) {
    showStatus('Por favor, informe o nome do colaborador.', 'error');
    return false;
  }
  if (colaborador.length < 2) {
    showStatus('Nome do colaborador deve ter pelo menos 2 caracteres.', 'error');
    return false;
  }
  if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(colaborador)) {
    showStatus('Nome do colaborador deve conter apenas letras e espaços.', 'error');
    return false;
  }

  // 🛡️ ENHANCED VALIDATION: Email
  const email = document.getElementById('email').value.trim();
  if (!email) {
    showStatus('Por favor, informe o email.', 'error');
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showStatus('Por favor, informe um email válido.', 'error');
    return false;
  }

  // 🛡️ ENHANCED VALIDATION: WhatsApp
  const whatsappInput = document.getElementById('whatsapp').value.trim();
  if (!whatsappInput) {
    showStatus('Por favor, informe o WhatsApp.', 'error');
    return false;
  }

  // Validar formato do WhatsApp
  const whatsapp = whatsappInput.replace(/\D/g, '');
  if (whatsapp.length !== 11) {
    showStatus('WhatsApp deve ter 11 dígitos: (xx)xxxxx-xxxx', 'error');
    return false;
  }
  
  // 🛡️ VALIDATION: Verificar se não são todos números iguais
  if (/^(\d)\1{10}$/.test(whatsapp)) {
    showStatus('WhatsApp inválido. Digite um número real.', 'error');
    return false;
  }
  
  // 🛡️ VALIDATION: Verificar DDD válido (código de área brasileiro)
  const ddd = whatsapp.substring(0, 2);
  const validDDDs = ['11', '12', '13', '14', '15', '16', '17', '18', '19', '21', '22', '24', '27', '28', '31', '32', '33', '34', '35', '37', '38', '41', '42', '43', '44', '45', '46', '47', '48', '49', '51', '53', '54', '55', '61', '62', '63', '64', '65', '66', '67', '68', '69', '71', '73', '74', '75', '77', '79', '81', '82', '83', '84', '85', '86', '87', '88', '89', '91', '92', '93', '94', '95', '96', '97', '98', '99'];
  if (!validDDDs.includes(ddd)) {
    showStatus('DDD inválido. Digite um código de área brasileiro válido.', 'error');
    return false;
  }

  if (!servico) {
    showStatus('Por favor, selecione um serviço.', 'error');
    return false;
  }

  // Validações específicas por serviço
  if (servico === 'espaco_maker') {
    if (!document.getElementById('dataReserva').value) {
      showStatus('Por favor, informe a data de reserva.', 'error');
      return false;
    }
    if (!document.getElementById('horarioInicio').value) {
      showStatus('Por favor, informe o horário de início.', 'error');
      return false;
    }
    if (!document.getElementById('horarioFim').value) {
      showStatus('Por favor, informe o horário de fim.', 'error');
      return false;
    }
    if (!document.getElementById('descricaoUtilizacao').value.trim()) {
      showStatus('Por favor, descreva a utilização.', 'error');
      return false;
    }
  } else if (servico === 'servicos') {
    const tipoServico = document.getElementById('tipoServicoSelect').value;
    if (!tipoServico) {
      showStatus('Por favor, selecione o tipo de serviço.', 'error');
      return false;
    }

    if (tipoServico === 'impressao') {
      if (!document.getElementById('tamanhoFolha').value) {
        showStatus('Por favor, selecione o tamanho da folha.', 'error');
        return false;
      }
      if (!document.getElementById('qtdCopias').value) {
        showStatus('Por favor, informe a quantidade de cópias.', 'error');
        return false;
      }

      // Validar limites
      const tamanho = document.getElementById('tamanhoFolha').value;
      const qtd = parseInt(document.getElementById('qtdCopias').value);
      const frenteVerso = document.getElementById('frenteVerso').checked;

      let limite;
      if (tamanho === 'A3') {
        limite = frenteVerso ? 5 : 10;
      } else {
        limite = frenteVerso ? 60 : 30;
      }

      if (qtd > limite) {
        showStatus(`Limite excedido! Máximo: ${limite} folhas.`, 'error');
        return false;
      }
    } else if (tipoServico === 'impressao_3d') {
      if (!document.getElementById('material').value) {
        showStatus('Por favor, selecione o material.', 'error');
        return false;
      }
      if (!document.getElementById('quantidade3d').value) {
        showStatus('Por favor, informe a quantidade.', 'error');
        return false;
      }

      const possuiSTL = document.getElementById('possuiSTL').checked;
      if (!possuiSTL && !document.getElementById('descricaoPeca').value.trim()) {
        showStatus('Por favor, descreva a peça ou anexe arquivo STL.', 'error');
        return false;
      }
    } else if (tipoServico === 'manutencao') {
      if (!document.getElementById('descricaoProblema').value.trim()) {
        showStatus('Por favor, descreva o problema.', 'error');
        return false;
      }
    } else if (tipoServico === 'arte_digital' || tipoServico === 'projeto') {
      if (!document.getElementById('descricaoArteProjeto').value.trim()) {
        showStatus('Por favor, descreva o projeto.', 'error');
        return false;
      }
    }
  } else if (servico === 'emprestimo') {
    if (!document.getElementById('nomeItem').value.trim()) {
      showStatus('Por favor, informe o nome do item.', 'error');
      return false;
    }
    if (!document.getElementById('dataRetirada').value) {
      showStatus('Por favor, informe a data de retirada.', 'error');
      return false;
    }
    if (!document.getElementById('dataDevolucao').value) {
      showStatus('Por favor, informe a data de devolução.', 'error');
      return false;
    }
    if (!multiFileManagers['fotoItem'] || !multiFileManagers['fotoItem'].hasFiles()) {
      showStatus('Por favor, anexe pelo menos uma foto do item.', 'error');
      return false;
    }
  }

  return true;
}

function resetForm() {
  document.getElementById('senaiForm').reset();
  hideAllSections();
  
  // Resetar campos específicos
  document.getElementById('tipoServico').style.display = 'none';
  document.getElementById('tipoServicoSelect').value = '';
  document.getElementById('qtdChromeBooks').style.display = 'none';
  document.getElementById('qtdComputadores').style.display = 'none';
  document.getElementById('arquivoSTLGroup').style.display = 'block';
  document.getElementById('descricaoPecaGroup').style.display = 'none';
  
  // Limpar todos os gerenciadores de múltiplos arquivos
  Object.values(multiFileManagers).forEach(manager => {
    if (manager) {
      manager.clear();
    }
  });
  
  // Resetar tela
  document.getElementById('formContent').style.display = 'block';
  document.getElementById('successMessage').classList.remove('show');
  
  // Garantir que mainSelection está escondido
  const mainSelection = document.getElementById('mainSelection');
  if (mainSelection) {
    mainSelection.style.display = 'none';
    console.log('🙈 MainSelection escondido');
  }
  
  document.getElementById('submissionId').textContent = '';
  document.getElementById('submitBtn').disabled = false;
  document.getElementById('btnText').style.display = 'inline';
  document.getElementById('loadingText').style.display = 'none';
  updateProgress();
}
