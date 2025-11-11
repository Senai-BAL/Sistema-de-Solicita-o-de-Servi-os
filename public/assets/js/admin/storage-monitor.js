/* 💾 SENAI Lab Admin - Storage Monitor
 * Arquivo: public/assets/js/admin/storage-monitor.js
 * Descrição: Sistema de monitoramento de Firebase Storage
 */

// 🏗️ CLASSE DE MONITORAMENTO DE STORAGE
class StorageMonitor {
  constructor() {
    this.storage = null; // Inicializar depois
    this.firebaseService = null;
    this.storageData = {
      totalSize: 0,
      totalFiles: 0,
      filesByType: {},
      filesByUser: {},
      largestFiles: [],
      orphanedFiles: [],
      estimatedCost: 0
    };
    this.storageLimit = 1024 * 1024 * 1024; // 1GB em bytes
    this.isLoading = false;
  }

  // 🔧 INICIALIZAR FIREBASE SERVICE
  async initFirebaseService() {
    if (this.firebaseService) return true;
    
    // Aguardar Firebase App estar pronto
    let attempts = 0;
    const maxAttempts = 10;
    
    while (attempts < maxAttempts) {
      try {
        // Verificar se Firebase App existe
        if (firebase.apps.length === 0) {
          // Aguardar um pouco mais
          await new Promise(resolve => setTimeout(resolve, 500));
          attempts++;
          continue;
        }
        
        // Inicializar Storage
        if (!this.storage) {
          this.storage = firebase.storage();
        }
        
        // Tentar obter FirebaseService global
        if (window.firebaseService) {
          this.firebaseService = window.firebaseService;
          return true;
        }
        
        // Tentar inicializar se não existir
        if (window.initializeFirebaseService) {
          try {
            this.firebaseService = await window.initializeFirebaseService();
            return true;
          } catch (error) {
            console.warn('⚠️ Erro ao inicializar Firebase Service:', error.message);
          }
        }
        
        // Fallback: criar nova instância
        if (window.FirebaseService) {
          try {
            this.firebaseService = new window.FirebaseService();
            return true;
          } catch (error) {
            console.warn('⚠️ Erro ao criar Firebase Service:', error.message);
          }
        }
        
        break;
      } catch (error) {
        console.warn('⚠️ Tentativa de inicialização falhou:', error.message);
        attempts++;
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    return false;
  }

  // 📊 ANÁLISE COMPLETA DO STORAGE
  async analyzeStorage() {
    if (this.isLoading) return;
    
    this.isLoading = true;
    try {
      // Verificar/inicializar Firebase Service
      const serviceReady = await this.initFirebaseService();
      if (!serviceReady || !this.firebaseService) {
        throw new Error('Firebase Service não disponível');
      }

      // 1. Buscar todas as solicitações com arquivos
      const requests = await this.firebaseService.getAllRequests();
      
      // 2. Reset dos dados
      this.resetStorageData();
      
      // 3. Analisar cada arquivo
      for (const request of requests) {
        if (request.arq && request.arq.length > 0) {
          for (const arquivo of request.arq) {
            await this.analyzeFile(arquivo, request);
          }
        }
      }
      
      // 4. Calcular estatísticas
      this.calculateStats();
      
      // 5. Buscar arquivos órfãos
      await this.findOrphanedFiles(requests);
      
      return this.storageData;
    } catch (error) {
      console.error('❌ Erro na análise do storage:', error);
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  // 🔄 RESET DOS DADOS
  resetStorageData() {
    this.storageData = {
      totalSize: 0,
      totalFiles: 0,
      filesByType: {},
      filesByUser: {},
      largestFiles: [],
      orphanedFiles: [],
      estimatedCost: 0
    };
  }

  // 📁 ANALISAR ARQUIVO INDIVIDUAL
  async analyzeFile(arquivo, request) {
    try {
      const size = arquivo.s || 0;
      const extension = this.getFileExtension(arquivo.n);
      const userName = request.n || 'Usuário Desconhecido';
      
      // Adicionar ao total
      this.storageData.totalSize += size;
      this.storageData.totalFiles++;
      
      // Agrupar por tipo
      if (!this.storageData.filesByType[extension]) {
        this.storageData.filesByType[extension] = {
          count: 0,
          totalSize: 0,
          files: []
        };
      }
      this.storageData.filesByType[extension].count++;
      this.storageData.filesByType[extension].totalSize += size;
      this.storageData.filesByType[extension].files.push({
        ...arquivo,
        requestId: request.id,
        userName: userName,
        requestDate: request.d
      });
      
      // Agrupar por usuário
      if (!this.storageData.filesByUser[userName]) {
        this.storageData.filesByUser[userName] = {
          count: 0,
          totalSize: 0,
          files: []
        };
      }
      this.storageData.filesByUser[userName].count++;
      this.storageData.filesByUser[userName].totalSize += size;
      this.storageData.filesByUser[userName].files.push({
        ...arquivo,
        requestId: request.id,
        requestDate: request.d
      });
      
      // Adicionar aos maiores arquivos
      this.storageData.largestFiles.push({
        ...arquivo,
        requestId: request.id,
        userName: userName,
        requestDate: request.d,
        extension: extension
      });
      
    } catch (error) {
      console.warn('⚠️ Erro ao analisar arquivo:', arquivo.n, error);
    }
  }

  // 📊 CALCULAR ESTATÍSTICAS
  calculateStats() {
    // Ordenar maiores arquivos
    this.storageData.largestFiles.sort((a, b) => (b.s || 0) - (a.s || 0));
    this.storageData.largestFiles = this.storageData.largestFiles.slice(0, 50); // Top 50
    
    // Calcular custo estimado (baseado nos preços do Firebase Storage)
    this.storageData.estimatedCost = this.calculateEstimatedCost();
  }

  // 💰 CALCULAR CUSTO ESTIMADO
  calculateEstimatedCost() {
    const sizeInGB = this.storageData.totalSize / (1024 * 1024 * 1024);
    
    // Preços do Firebase Storage (aproximados)
    const pricePerGBMonth = 0.026; // US$ 0.026 por GB/mês
    const pricePerDownload = 0.12; // US$ 0.12 por GB de download
    const pricePerOperation = 0.05 / 1000; // US$ 0.05 por 1000 operações
    
    // Estimativas conservadoras
    const storageCost = sizeInGB * pricePerGBMonth;
    const downloadCost = sizeInGB * 0.1 * pricePerDownload; // Assumindo 10% de downloads
    const operationsCost = this.storageData.totalFiles * 2 * pricePerOperation; // 2 operações por arquivo
    
    return {
      storage: storageCost,
      downloads: downloadCost,
      operations: operationsCost,
      total: storageCost + downloadCost + operationsCost
    };
  }

  // 🗑️ ENCONTRAR ARQUIVOS ÓRFÃOS
  async findOrphanedFiles(requests) {
    try {
      // Coletar todos os paths válidos
      const validPaths = new Set();
      requests.forEach(request => {
        if (request.arq && request.arq.length > 0) {
          request.arq.forEach(arquivo => {
            if (arquivo.p) validPaths.add(arquivo.p);
          });
        }
      });
      
      // Listar arquivos no Storage (simulado - Firebase não permite listar facilmente)
      // Por enquanto, vamos apenas reportar se há discrepâncias
      this.storageData.orphanedFiles = [];
      
    } catch (error) {
      console.warn('⚠️ Não foi possível verificar arquivos órfãos:', error);
    }
  }

  // 🔧 UTILITÁRIOS
  getFileExtension(filename) {
    if (!filename) return 'unknown';
    const extension = filename.split('.').pop().toLowerCase();
    return extension || 'unknown';
  }

  formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 4
    }).format(value);
  }

  getFileTypeIcon(extension) {
    const icons = {
      'pdf': '📄',
      'doc': '📝',
      'docx': '📝',
      'txt': '📄',
      'jpg': '🖼️',
      'jpeg': '🖼️',
      'png': '🖼️',
      'gif': '🖼️',
      'mp4': '🎥',
      'avi': '🎥',
      'zip': '📦',
      'rar': '📦',
      'exe': '⚙️',
      'unknown': '📁'
    };
    return icons[extension] || '📁';
  }

  // 📈 GERAR RELATÓRIO EXPORTÁVEL
  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalSize: this.formatFileSize(this.storageData.totalSize),
        totalFiles: this.storageData.totalFiles,
        usagePercentage: ((this.storageData.totalSize / this.storageLimit) * 100).toFixed(2),
        estimatedCost: this.formatCurrency(this.storageData.estimatedCost.total)
      },
      filesByType: Object.keys(this.storageData.filesByType).map(type => ({
        type: type,
        icon: this.getFileTypeIcon(type),
        count: this.storageData.filesByType[type].count,
        totalSize: this.formatFileSize(this.storageData.filesByType[type].totalSize),
        percentage: ((this.storageData.filesByType[type].totalSize / this.storageData.totalSize) * 100).toFixed(1)
      })).sort((a, b) => b.count - a.count),
      topUsers: Object.keys(this.storageData.filesByUser).map(user => ({
        name: user,
        count: this.storageData.filesByUser[user].count,
        totalSize: this.formatFileSize(this.storageData.filesByUser[user].totalSize),
        percentage: ((this.storageData.filesByUser[user].totalSize / this.storageData.totalSize) * 100).toFixed(1)
      })).sort((a, b) => this.storageData.filesByUser[b.name].totalSize - this.storageData.filesByUser[a.name].totalSize).slice(0, 10),
      largestFiles: this.storageData.largestFiles.slice(0, 20).map(file => ({
        name: file.n,
        size: this.formatFileSize(file.s || 0),
        type: file.extension,
        user: file.userName,
        date: new Date(file.requestDate).toLocaleDateString('pt-BR')
      })),
      costs: {
        storage: this.formatCurrency(this.storageData.estimatedCost.storage),
        downloads: this.formatCurrency(this.storageData.estimatedCost.downloads),
        operations: this.formatCurrency(this.storageData.estimatedCost.operations),
        total: this.formatCurrency(this.storageData.estimatedCost.total)
      }
    };
    
    return report;
  }
}

// 🌟 FUNÇÕES GLOBAIS DO STORAGE MONITOR

// Instância global
let storageMonitor = null;

// 🚀 INICIALIZAR MONITOR
async function initializeStorageMonitor() {
  if (!storageMonitor) {
    storageMonitor = new StorageMonitor();
  }
  
  // Garantir que o Firebase Service está pronto
  const serviceReady = await storageMonitor.initFirebaseService();
  if (!serviceReady) {
    throw new Error('Não foi possível inicializar o Firebase Service');
  }
  
  return storageMonitor;
}

// 📊 ABRIR MODAL DE STORAGE
async function openStorageModal() {
  const modal = document.getElementById('storageModal');
  if (!modal) {
    console.error('❌ Modal de storage não encontrado');
    return;
  }
  
  try {
    modal.classList.add('show');
    modal.style.display = 'flex';
    
    // Inicializar monitor se necessário
    await initializeStorageMonitor();
    
    // Carregar dados
    await loadStorageData();
  } catch (error) {
    console.error('❌ Erro ao abrir modal de storage:', error);
    
    // Fechar modal se houve erro
    modal.classList.remove('show');
    modal.style.display = 'none';
    
    if (window.showToast) {
      showToast('Erro ao carregar monitor de storage: ' + error.message, 'error');
    }
  }
}

// 🔒 FECHAR MODAL
function closeStorageModal() {
  const modal = document.getElementById('storageModal');
  if (modal) {
    modal.classList.remove('show');
    setTimeout(() => {
      modal.style.display = 'none';
    }, 300); // Aguarda animação
  }
}

// 🎯 FECHAR MODAL AO CLICAR FORA
document.addEventListener('click', function(event) {
  const modal = document.getElementById('storageModal');
  if (modal && modal.classList.contains('show')) {
    // Se clicou no overlay (fora do conteúdo do modal)
    if (event.target === modal) {
      closeStorageModal();
    }
  }
});

// ⌨️ FECHAR MODAL COM ESC
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    const modal = document.getElementById('storageModal');
    if (modal && modal.classList.contains('show')) {
      closeStorageModal();
    }
  }
});

// 📈 CARREGAR DADOS DO STORAGE
async function loadStorageData() {
  try {
    // Mostrar loading
    updateStorageUI({ loading: true });
    
    // Verificar se o monitor está inicializado
    if (!storageMonitor) {
      await initializeStorageMonitor();
    }
    
    // Analisar storage
    const data = await storageMonitor.analyzeStorage();
    
    // Atualizar UI
    updateStorageUI({ data, loading: false });
    
    // Atualizar card do dashboard
    updateStorageDashboardCard(data);
    
  } catch (error) {
    console.error('❌ Erro ao carregar dados do storage:', error);
    
    // Mostrar erro específico baseado no tipo
    let errorMessage = 'Erro desconhecido';
    if (error.message.includes('Firebase Service')) {
      errorMessage = 'Serviço Firebase não disponível. Recarregue a página.';
    } else if (error.message.includes('permission')) {
      errorMessage = 'Sem permissão para acessar dados.';
    } else {
      errorMessage = error.message;
    }
    
    updateStorageUI({ error: errorMessage, loading: false });
    
    if (window.showToast) {
      showToast('Erro ao carregar dados de storage: ' + errorMessage, 'error');
    }
  }
}

// 🎨 ATUALIZAR UI DO STORAGE
function updateStorageUI({ data, loading, error }) {
  if (loading) {
    // Mostrar estados de loading
    document.getElementById('totalStorageUsed').textContent = 'Calculando...';
    document.getElementById('totalFiles').textContent = 'Carregando...';
    document.getElementById('estimatedCost').textContent = 'Calculando...';
    document.getElementById('orphanedFiles').textContent = '-';
    return;
  }
  
  if (error) {
    document.getElementById('totalStorageUsed').textContent = 'Erro';
    document.getElementById('totalFiles').textContent = 'Erro';
    document.getElementById('estimatedCost').textContent = 'Erro';
    return;
  }
  
  if (!data) return;
  
  // Atualizar estatísticas principais
  const usagePercent = ((data.totalSize / storageMonitor.storageLimit) * 100).toFixed(1);
  document.getElementById('totalStorageUsed').textContent = storageMonitor.formatFileSize(data.totalSize);
  document.getElementById('totalFiles').textContent = data.totalFiles.toLocaleString();
  document.getElementById('estimatedCost').textContent = storageMonitor.formatCurrency(data.estimatedCost.total);
  document.getElementById('orphanedFiles').textContent = data.orphanedFiles.length.toString();
  
  // Atualizar barra de progresso
  const progressBar = document.getElementById('totalProgressBar');
  if (progressBar) {
    progressBar.style.width = `${Math.min(usagePercent, 100)}%`;
    progressBar.className = 'storage-progress-bar';
    if (usagePercent > 80) progressBar.classList.add('danger');
    else if (usagePercent > 60) progressBar.classList.add('warning');
  }
  
  // Atualizar limite
  const limitElement = document.getElementById('totalStorageLimit');
  if (limitElement) {
    limitElement.textContent = `de ${storageMonitor.formatFileSize(storageMonitor.storageLimit)} (${usagePercent}%)`;
  }
  
  // Atualizar tamanho médio
  const avgSize = data.totalFiles > 0 ? data.totalSize / data.totalFiles : 0;
  const avgElement = document.getElementById('avgFileSize');
  if (avgElement) {
    avgElement.textContent = `Tamanho médio: ${storageMonitor.formatFileSize(avgSize)}`;
  }
  
  // Atualizar breakdown por tipo
  updateFileTypeBreakdown(data.filesByType);
  
  // Atualizar custos detalhados
  updateCostBreakdown(data.estimatedCost);
  
  // Atualizar alertas
  updateCostAlerts(data, usagePercent);
}

// 📊 ATUALIZAR BREAKDOWN POR TIPO
function updateFileTypeBreakdown(filesByType) {
  const container = document.getElementById('fileTypeBreakdown');
  if (!container) return;
  
  const sortedTypes = Object.keys(filesByType)
    .map(type => ({
      type,
      ...filesByType[type],
      icon: storageMonitor.getFileTypeIcon(type)
    }))
    .sort((a, b) => b.totalSize - a.totalSize);
  
  container.innerHTML = sortedTypes.map(item => `
    <div class="file-type-item">
      <div class="file-type-name">
        <span>${item.icon}</span>
        <span>${item.type.toUpperCase()}</span>
      </div>
      <div class="file-type-size">${storageMonitor.formatFileSize(item.totalSize)}</div>
      <div class="file-type-count">${item.count}</div>
    </div>
  `).join('');
}

// 💰 ATUALIZAR BREAKDOWN DE CUSTOS
function updateCostBreakdown(costs) {
  const elements = {
    storageCostValue: costs.storage,
    downloadCostValue: costs.downloads,
    operationsCostValue: costs.operations,
    totalCostValue: costs.total
  };
  
  Object.keys(elements).forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = storageMonitor.formatCurrency(elements[id]);
    }
  });
}

// ⚠️ ATUALIZAR ALERTAS DE CUSTO
function updateCostAlerts(data, usagePercent) {
  const container = document.getElementById('costAlerts');
  if (!container) return;
  
  const alerts = [];
  
  if (usagePercent > 90) {
    alerts.push({
      type: 'danger',
      icon: '🚨',
      message: 'Uso do storage acima de 90%! Considere fazer limpeza.'
    });
  } else if (usagePercent > 70) {
    alerts.push({
      type: 'warning',
      icon: '⚠️',
      message: 'Uso do storage acima de 70%. Monitore o crescimento.'
    });
  }
  
  if (data.estimatedCost.total > 1) {
    alerts.push({
      type: 'warning',
      icon: '💰',
      message: 'Custo estimado acima de US$ 1.00/mês.'
    });
  }
  
  if (data.orphanedFiles.length > 0) {
    alerts.push({
      type: 'info',
      icon: '🧹',
      message: `${data.orphanedFiles.length} arquivos órfãos encontrados. Considere fazer limpeza.`
    });
  }
  
  container.innerHTML = alerts.map(alert => `
    <div class="cost-alert ${alert.type}">
      <span>${alert.icon}</span>
      <span>${alert.message}</span>
    </div>
  `).join('');
}

// 📊 ATUALIZAR CARD DO DASHBOARD
function updateStorageDashboardCard(data) {
  const usagePercent = ((data.totalSize / storageMonitor.storageLimit) * 100).toFixed(1);
  const element = document.getElementById('storageUsed');
  const changeElement = document.getElementById('storageChange');
  
  if (element) {
    element.textContent = storageMonitor.formatFileSize(data.totalSize);
  }
  
  if (changeElement) {
    changeElement.textContent = `${usagePercent}% usado`;
    changeElement.className = 'stat-change';
    if (usagePercent > 80) changeElement.classList.add('negative');
    else if (usagePercent > 60) changeElement.classList.add('warning');
    else changeElement.classList.add('positive');
  }
}

// 🔄 TROCAR TAB DO STORAGE
function switchStorageTab(tabName) {
  // Remover active de todas as tabs
  document.querySelectorAll('.storage-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  document.querySelectorAll('.storage-tab-panel').forEach(panel => {
    panel.classList.remove('active');
  });
  
  // Ativar tab selecionada
  const selectedTab = document.querySelector(`[onclick="switchStorageTab('${tabName}')"]`);
  const selectedPanel = document.getElementById(`storageTab${tabName.charAt(0).toUpperCase() + tabName.slice(1)}`);
  
  if (selectedTab) selectedTab.classList.add('active');
  if (selectedPanel) selectedPanel.classList.add('active');
  
  // Carregar conteúdo específico da tab
  loadTabContent(tabName);
}

// 📂 CARREGAR CONTEÚDO DA TAB
async function loadTabContent(tabName) {
  if (!storageMonitor || !storageMonitor.storageData) return;
  
  switch (tabName) {
    case 'files':
      loadFilesList();
      break;
    case 'users':
      loadUsersList();
      break;
    case 'costs':
      // Já carregado na atualização principal
      break;
  }
}

// 📁 CARREGAR LISTA DE ARQUIVOS
function loadFilesList() {
  const container = document.getElementById('storageFilesList');
  if (!container || !storageMonitor.storageData.largestFiles) return;
  
  container.innerHTML = storageMonitor.storageData.largestFiles.map(file => `
    <div class="storage-file-item">
      <div class="file-info">
        <div class="file-name">${storageMonitor.getFileTypeIcon(file.extension)} ${file.n}</div>
        <div class="file-details">
          <span>📏 ${storageMonitor.formatFileSize(file.s || 0)}</span>
          <span>👤 ${file.userName}</span>
          <span>📅 ${new Date(file.requestDate).toLocaleDateString('pt-BR')}</span>
        </div>
      </div>
      <div class="file-actions">
        <button class="btn-file-action btn-file-download" onclick="downloadFile('${file.p}')" title="Baixar">⬇️</button>
      </div>
    </div>
  `).join('');
}

// 👥 CARREGAR LISTA DE USUÁRIOS
function loadUsersList() {
  const container = document.getElementById('storageUsersList');
  if (!container || !storageMonitor.storageData.filesByUser) return;
  
  const sortedUsers = Object.keys(storageMonitor.storageData.filesByUser)
    .map(userName => ({
      name: userName,
      ...storageMonitor.storageData.filesByUser[userName]
    }))
    .sort((a, b) => b.totalSize - a.totalSize);
  
  container.innerHTML = sortedUsers.map(user => `
    <div class="storage-user-item">
      <div class="user-info-storage">
        <div class="user-avatar-storage">👤</div>
        <div class="user-details-storage">
          <div class="user-name-storage">${user.name}</div>
          <div class="user-usage-storage">${user.count} arquivos</div>
        </div>
      </div>
      <div class="user-stats-storage">
        <div class="user-total-size">${storageMonitor.formatFileSize(user.totalSize)}</div>
        <div class="user-file-count">${((user.totalSize / storageMonitor.storageData.totalSize) * 100).toFixed(1)}%</div>
      </div>
    </div>
  `).join('');
}

// 📊 EXPORTAR RELATÓRIO
function exportStorageReport() {
  if (!storageMonitor) return;
  
  const report = storageMonitor.generateReport();
  const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `storage-report-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// 🔄 ATUALIZAR LISTA DE ARQUIVOS
function refreshFilesList() {
  loadFilesList();
}

// 📥 DOWNLOAD DE ARQUIVO
async function downloadFile(filePath) {
  try {
    if (!filePath) return;
    
    const storage = firebase.storage();
    const ref = storage.ref(filePath);
    const url = await ref.getDownloadURL();
    
    window.open(url, '_blank');
  } catch (error) {
    console.error('❌ Erro ao baixar arquivo:', error);
    if (window.showToast) {
      showToast('Erro ao baixar arquivo', 'error');
    }
  }
}

// 🚀 INICIALIZAÇÃO
document.addEventListener('DOMContentLoaded', async () => {
  // Aguardar carregamento completo do Firebase com retry mais inteligente
  let attempts = 0;
  const maxAttempts = 20;
  
  const waitForFirebase = async () => {
    while (attempts < maxAttempts) {
      try {
        // Verificar se Firebase App foi inicializado
        if (firebase.apps.length > 0 && (window.firebaseService || window.FirebaseService)) {
          console.log('🔥 Firebase detectado, inicializando Storage Monitor...');
          await initializeStorageMonitor();
          console.log('💾 Storage Monitor inicializado com sucesso');
          return;
        }
        
        // Verificar se pelo menos o Firebase config existe
        if (window.firebaseConfig) {
          console.log('🔥 Firebase config encontrado, aguardando inicialização...');
        }
        
      } catch (error) {
        console.warn(`⚠️ Tentativa ${attempts + 1} falhou:`, error.message);
      }
      
      attempts++;
      await new Promise(resolve => setTimeout(resolve, 1000)); // Aguardar 1 segundo
    }
    
    console.warn('⚠️ Storage Monitor não pôde ser inicializado - Firebase não está pronto');
  };
  
  // Aguardar um pouco antes de começar as tentativas
  setTimeout(waitForFirebase, 2000);
});

// Debug removido para produção - v3.0.2
