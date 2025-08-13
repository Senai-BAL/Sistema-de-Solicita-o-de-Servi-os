/* 🔧 SENAI Lab - Sistema de Múltiplos Arquivos
 * Arquivo: public/assets/js/multi-file-manager.js
 * Descrição: Classe para gerenciar múltiplos arquivos com preview e upload
 */

// 📁 SISTEMA DE MÚLTIPLOS ARQUIVOS
class MultiFileManager {
  constructor(inputId, listId, summaryId, progressId) {
    this.inputId = inputId;
    this.listId = listId;
    this.summaryId = summaryId;
    this.progressId = progressId;
    this.files = new Map();
    this.uploadQueue = [];
    this.isUploading = false;
    
    this.setupEventListeners();
  }

  setupEventListeners() {
    const input = document.getElementById(this.inputId);
    if (!input) return;

    input.addEventListener('change', (e) => {
      this.handleFileSelection(e.target.files);
    });
  }

  handleFileSelection(fileList) {
    const newFiles = Array.from(fileList);
    
    // Validar cada arquivo
    for (const file of newFiles) {
      if (!this.validateFile(file)) {
        continue;
      }

      // Adicionar arquivo à lista (evitar duplicatas)
      const fileKey = `${file.name}_${file.size}_${file.lastModified}`;
      if (!this.files.has(fileKey)) {
        this.files.set(fileKey, {
          file: file,
          id: fileKey,
          status: 'waiting',
          uploadResult: null,
          error: null
        });
      }
    }

    this.updateDisplay();
    this.updateSummary();
  }

  validateFile(file) {
    // Validar tamanho (100MB máximo)
    if (file.size > 100 * 1024 * 1024) {
      showStatus(`📁 Arquivo "${file.name}" muito grande! Máximo: 100MB`, 'error');
      return false;
    }

    // Validar tipo de arquivo baseado no inputId
    const allowedTypes = {
      'arquivoImpressao': ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'],
      'arquivoSTL': ['.stl'],
      'fotoProblema': ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
      'fotoItem': ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
    };

    if (allowedTypes[this.inputId]) {
      if (this.inputId.includes('foto') || this.inputId.includes('Problema') || this.inputId.includes('Item')) {
        // Para fotos, verificar mime type
        if (!allowedTypes[this.inputId].includes(file.type)) {
          showStatus(`❌ Tipo "${file.name}" não permitido! Aceitos: JPG, PNG, GIF`, 'error');
          return false;
        }
      } else {
        // Para outros arquivos, verificar extensão
        const extension = '.' + file.name.split('.').pop().toLowerCase();
        if (!allowedTypes[this.inputId].includes(extension)) {
          showStatus(`❌ Tipo "${file.name}" não permitido! Aceitos: ${allowedTypes[this.inputId].join(', ')}`, 'error');
          return false;
        }
      }
    }

    return true;
  }

  updateDisplay() {
    const listElement = document.getElementById(this.listId);
    if (!listElement) return;

    if (this.files.size === 0) {
      listElement.classList.add('empty');
      listElement.innerHTML = '';
      return;
    }

    listElement.classList.remove('empty');
    listElement.innerHTML = '';

    this.files.forEach((fileData, fileKey) => {
      const fileItem = this.createFileItem(fileData);
      listElement.appendChild(fileItem);
    });
  }

  createFileItem(fileData) {
    const { file, id, status, error } = fileData;
    const item = document.createElement('div');
    item.className = 'file-item';
    item.setAttribute('data-file-id', id);

    const isImage = file.type.startsWith('image/');
    const fileIcon = this.getFileIcon(file);
    const fileSize = this.formatFileSize(file.size);

    // Preview de imagem se for imagem
    let imagePreview = '';
    if (isImage) {
      const imageUrl = URL.createObjectURL(file);
      imagePreview = `<img src="${imageUrl}" alt="Preview" class="image-preview">`;
    }

    const statusClass = status === 'waiting' ? 'waiting' : 
                       status === 'uploading' ? 'uploading' :
                       status === 'success' ? 'success' : 'error';

    const statusText = status === 'waiting' ? 'Aguardando...' :
                      status === 'uploading' ? 'Enviando...' :
                      status === 'success' ? 'Enviado ✓' :
                      `Erro: ${error}`;

    item.innerHTML = `
      ${imagePreview}
      <div class="file-icon">${fileIcon}</div>
      <div class="file-info">
        <div class="file-name" title="${file.name}">${file.name}</div>
        <div class="file-size">${fileSize}</div>
        <div class="file-status ${statusClass}">${statusText}</div>
      </div>
      <div class="file-actions">
        ${isImage ? `<button type="button" class="file-action-btn preview" onclick="multiFileManagers['${this.inputId}'].previewImage('${id}')" title="Visualizar">👁️</button>` : ''}
        <button type="button" class="file-action-btn remove" onclick="multiFileManagers['${this.inputId}'].removeFile('${id}')" title="Remover" ${status === 'uploading' ? 'disabled' : ''}>🗑️</button>
      </div>
    `;

    return item;
  }

  getFileIcon(file) {
    if (file.type.startsWith('image/')) return '📷';
    if (file.name.toLowerCase().endsWith('.pdf')) return '📄';
    if (file.name.toLowerCase().endsWith('.stl')) return '📐';
    if (file.name.toLowerCase().includes('.doc')) return '📝';
    return '📁';
  }

  formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  updateSummary() {
    const summaryElement = document.getElementById(this.summaryId);
    if (!summaryElement) return;

    if (this.files.size === 0) {
      summaryElement.classList.add('empty');
      return;
    }

    summaryElement.classList.remove('empty');
    const totalSize = Array.from(this.files.values()).reduce((sum, fileData) => sum + fileData.file.size, 0);
    
    summaryElement.querySelector('.count').textContent = this.files.size;
    summaryElement.querySelector('.size').textContent = this.formatFileSize(totalSize);
  }

  removeFile(fileId) {
    this.files.delete(fileId);
    this.updateDisplay();
    this.updateSummary();
    showStatus('📁 Arquivo removido', 'info');
  }

  previewImage(fileId) {
    const fileData = this.files.get(fileId);
    if (!fileData || !fileData.file.type.startsWith('image/')) return;

    const imageUrl = URL.createObjectURL(fileData.file);
    window.open(imageUrl, '_blank');
  }

  async uploadAll(serviceInfo) {
    if (this.files.size === 0) return [];

    this.isUploading = true;
    const progressElement = document.getElementById(this.progressId);
    if (progressElement) {
      progressElement.classList.add('active');
    }

    const results = [];
    let completed = 0;
    const total = this.files.size;

    for (const [fileId, fileData] of this.files) {
      try {
        // Atualizar status do arquivo
        fileData.status = 'uploading';
        this.updateDisplay();

        // Fazer upload com novo padrão
        const result = await retryUpload(fileData.file, serviceInfo, 3);
        if (result) {
          fileData.status = 'success';
          fileData.uploadResult = result;
          results.push(result);
        } else {
          fileData.status = 'error';
          fileData.error = 'Falha no upload';
        }
      } catch (error) {
        fileData.status = 'error';
        fileData.error = error.message;
      }

      completed++;
      
      // Atualizar progresso global
      if (progressElement) {
        const progressBar = progressElement.querySelector('.global-progress-fill');
        const progressText = progressElement.querySelector('.global-progress-text');
        const percentage = (completed / total) * 100;
        
        if (progressBar) progressBar.style.width = `${percentage}%`;
        if (progressText) progressText.textContent = `Enviando... ${completed}/${total}`;
      }

      this.updateDisplay();
    }

    // Finalizar progresso
    if (progressElement) {
      setTimeout(() => {
        progressElement.classList.remove('active');
      }, 1000);
    }

    this.isUploading = false;
    return results;
  }

  getFiles() {
    return Array.from(this.files.values()).map(fileData => fileData.file);
  }

  hasFiles() {
    return this.files.size > 0;
  }

  clear() {
    this.files.clear();
    this.updateDisplay();
    this.updateSummary();
  }
}

// 📁 GERENCIADORES DE MÚLTIPLOS ARQUIVOS
let multiFileManagers = {};

// 📁 INICIALIZAR GERENCIADORES DE MÚLTIPLOS ARQUIVOS
function initializeMultiFileManagers() {
  multiFileManagers = {
    'arquivoImpressao': new MultiFileManager('arquivoImpressao', 'fileListImpressao', 'filesSummaryImpressao', 'globalProgressImpressao'),
    'arquivoSTL': new MultiFileManager('arquivoSTL', 'fileListSTL', 'filesSummarySTL', 'globalProgressSTL'),
    'fotoProblema': new MultiFileManager('fotoProblema', 'fileListProblema', 'filesSummaryProblema', 'globalProgressProblema'),
    'referenciaArte': new MultiFileManager('referenciaArte', 'fileListReferencia', 'filesSummaryReferencia', 'globalProgressReferencia'),
    'fotoItem': new MultiFileManager('fotoItem', 'fileListItem', 'filesSummaryItem', 'globalProgressItem')
  };
}
