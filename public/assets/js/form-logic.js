/* 🔧 SENAI Lab - Lógica do Formulário
 * Arquivo: public/assets/js/form-logic.js
 * Descrição: Coleta de dados, validação e envio do formulário
 */

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
    fonte: 'github'
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
        co: formData.get('colorido') === 'on' ? 1 : 0
      };
    } else if (ts === 'impressao_3d') {
      data.dados = {
        mt: formData.get('material'),
        qt: parseInt(formData.get('quantidade3d')),
        stl: formData.get('possuiSTL') === 'on' ? 1 : 0,
        dp: formData.get('descricaoPeca')
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
      dd: formData.get('dataDevolucao')
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

  try {
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    loadingText.style.display = 'inline';

    if (!navigator.onLine) {
      throw new Error('Sem conexão com a internet.');
    }

    const formData = collectFormData();
    
    // Gerar informações de serviço para upload
    const serviceInfo = generateServiceInfo(formData);
    
    // 🔍 DEBUG: Mostrar novo padrão de nomenclatura
    console.log('🔧 NOVO PADRÃO DE NOMENCLATURA:');
    console.log(`📂 Pasta: senai-arquivos/`);
    console.log(`🏷️ Padrão: ${serviceInfo.tipo}_DATA_${serviceInfo.solicitante.replace(/[^a-zA-Z0-9]/g, '').slice(0, 20).toUpperCase()}_ARQUIVO`);
    console.log(`👤 Solicitante processado: ${serviceInfo.solicitante} → ${serviceInfo.solicitante.replace(/[^a-zA-Z0-9]/g, '').slice(0, 20).toUpperCase()}`);

    // Upload de arquivos para GitHub com novo padrão
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
    
    console.log('🔥 Tentando salvar na coleção:', collectionName);
    console.log('📄 Dados a serem salvos:', formData);
    
    try {
      const docRef = await db.collection(collectionName).add(formData);
      console.log('✅ Solicitação enviada com ID:', docRef.id);
      usageMonitor.addWrite();
      showSuccessScreen(docRef.id);
    } catch (firestoreError) {
      console.error('❌ Erro específico do Firestore:', firestoreError);
      
      // Tentar salvar com regras mais permissivas
      if (firestoreError.code === 'permission-denied') {
        console.log('🔄 Tentando com configuração alternativa...');
        
        // Tentar na coleção principal
        try {
          const docRef = await db.collection('solicitacoes').add(formData);
          console.log('✅ Solicitação salva na coleção principal com ID:', docRef.id);
          usageMonitor.addWrite();
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
    } else if (error.message.includes('GitHub')) {
      errorMessage += 'Problema no upload de arquivos.';
    } else if (error.message.includes('quota')) {
      errorMessage += 'Limite diário atingido.';
    } else if (error.code === 'unavailable') {
      errorMessage = '🌐 Firebase temporariamente indisponível. Tente novamente.';
    } else {
      errorMessage += `Detalhes: ${error.message}`;
    }

    showStatus(errorMessage, 'error');

    submitBtn.disabled = false;
    btnText.style.display = 'inline';
    loadingText.style.display = 'none';
  }
}

function validateForm() {
  const servico = document.getElementById('servico').value;

  if (!document.getElementById('colaborador').value.trim()) {
    showStatus('Por favor, informe o nome do colaborador.', 'error');
    return false;
  }

  if (!document.getElementById('email').value.trim()) {
    showStatus('Por favor, informe o email.', 'error');
    return false;
  }

  if (!document.getElementById('whatsapp').value.trim()) {
    showStatus('Por favor, informe o WhatsApp.', 'error');
    return false;
  }

  // Validar formato do WhatsApp
  const whatsapp = document.getElementById('whatsapp').value.replace(/\D/g, '');
  if (whatsapp.length !== 11) {
    showStatus('WhatsApp deve ter 11 dígitos: (xx)xxxxx-xxxx', 'error');
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
  document.getElementById('submissionId').textContent = '';
  document.getElementById('submitBtn').disabled = false;
  document.getElementById('btnText').style.display = 'inline';
  document.getElementById('loadingText').style.display = 'none';
  updateProgress();
}
