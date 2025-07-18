/* 🔧 SENAI Lab Admin - Funções do Dashboard
 * Arquivo: public/assets/js/admin/dashboard.js
 * Descrição: Funções principais do dashboard, renderização e interações
 */

// 🎨 SISTEMA DE INTERFACE
function formatDate(timestamp) {
    try {
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) {
            return new Date().toLocaleString('pt-BR');
        }
        return date.toLocaleString('pt-BR');
    } catch (error) {
        return new Date().toLocaleString('pt-BR');
    }
}

function getServiceName(service, subService) {
    const names = {
        'espaco_maker': 'Espaço Maker',
        'servicos': {
            'impressao': 'Impressão',
            'impressao_3d': 'Impressão 3D',
            'manutencao': 'Manutenção',
            'arte_digital': 'Arte Digital',
            'projeto': 'Projeto'
        },
        'emprestimo': 'Empréstimo'
    };

    if (service === 'servicos' && subService) {
        return names.servicos[subService] || subService;
    }

    return names[service] || service;
}

function getStatusBadge(status) {
    const badges = {
        'pendente': '<span class="status-badge pendente">⏳ Pendente</span>',
        'em_andamento': '<span class="status-badge em_andamento">🔄 Em Andamento</span>',
        'concluido': '<span class="status-badge concluido">✅ Concluído</span>',
        'cancelado': '<span class="status-badge cancelado">❌ Cancelado</span>'
    };

    return badges[status] || badges['pendente'];
}

function getPriorityClass(priority) {
    return priority ? `priority-${priority}` : '';
}

// 📋 RENDERIZAÇÃO DA LISTA
async function renderRequestsList(requests) {
    const container = document.getElementById('requestsList');

    if (requests.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>Nenhuma solicitação encontrada</p></div>';
        return;
    }

    let html = '';

    requests.forEach(request => {
        const status = request.admin?.status || 'pendente';
        const priority = request.admin?.prioridade || '';
        const serviceName = getServiceName(request.s, request.ts);
        const priorityClass = getPriorityClass(priority);

        html += `
          <div class="request-card ${priorityClass}" onclick="viewDetails('${request.id}')">
            ${priority ? `<div class="priority-indicator priority-${priority}">${priority.toUpperCase()}</div>` : ''}
            
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px;">
              <div style="flex: 1;">
                <h3 style="color: #1e3c72; margin-bottom: 8px; font-size: 1.1rem;">
                  ${serviceName} - ${request.c}
                </h3>
                <p style="color: #666; font-size: 0.9rem; margin-bottom: 5px;">
                  📧 ${request.e} | 📱 ${request.w || 'N/A'}
                </p>
                <p style="color: #888; font-size: 0.8rem;">
                  📅 ${formatDate(request.d)}
                </p>
              </div>
              <div style="text-align: right;">
                ${getStatusBadge(status)}
              </div>
            </div>
            
            <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; margin-bottom: 15px;">
              <h4 style="color: #333; font-size: 0.9rem; margin-bottom: 8px;">📋 Detalhes:</h4>
              <div style="font-size: 0.85rem; color: #555;">
                ${formatRequestDetails(request)}
              </div>
              ${request.arq && request.arq.length > 0 ? `
                <div style="margin-top: 10px;">
                  <strong>📎 Arquivos:</strong>
                  ${request.arq.map(arquivo => `
                    <a href="${arquivo.u}" target="_blank" style="display: inline-block; margin: 5px 5px 0 0; padding: 4px 8px; background: #e3f2fd; color: #1976d2; text-decoration: none; border-radius: 4px; font-size: 0.8rem;">
                      📄 ${arquivo.n}
                    </a>
                  `).join('')}
                </div>
              ` : ''}
            </div>

            <div class="quick-actions" onclick="event.stopPropagation();">
              <select onchange="updateStatus('${request.id}', this.value)" class="quick-action" style="margin-right: 8px;">
                <option value="">Status</option>
                <option value="pendente" ${status === 'pendente' ? 'selected' : ''}>⏳ Pendente</option>
                <option value="em_andamento" ${status === 'em_andamento' ? 'selected' : ''}>🔄 Em Andamento</option>
                <option value="concluido" ${status === 'concluido' ? 'selected' : ''}>✅ Concluído</option>
                <option value="cancelado" ${status === 'cancelado' ? 'selected' : ''}>❌ Cancelado</option>
              </select>
              
              <select onchange="setPriority('${request.id}', this.value)" class="quick-action">
                <option value="">Prioridade</option>
                <option value="alta" ${priority === 'alta' ? 'selected' : ''}>🔴 Alta</option>
                <option value="media" ${priority === 'media' ? 'selected' : ''}>🟡 Média</option>
                <option value="baixa" ${priority === 'baixa' ? 'selected' : ''}>🟢 Baixa</option>
              </select>
              
              <button onclick="addComment('${request.id}')" class="quick-action comment">
                💬 Comentar
              </button>
              
              <button onclick="viewDetails('${request.id}')" class="quick-action details">
                👁️ Detalhes
              </button>
            </div>

            ${request.admin?.comentarios && request.admin.comentarios.length > 0 ? `
              <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #eee;">
                <h4 style="color: #333; font-size: 0.9rem; margin-bottom: 10px;">💬 Comentários (${request.admin.comentarios.length}):</h4>
                ${request.admin.comentarios.slice(-2).map(comment => `
                  <div style="background: #f0f8ff; padding: 10px; margin-bottom: 8px; border-radius: 4px; border-left: 3px solid #2196f3;">
                    <div style="font-size: 0.85rem; color: #555; margin-bottom: 5px;">
                      <strong>${comment.autor}</strong> - ${formatDate(comment.timestamp)}
                    </div>
                    <div style="font-size: 0.9rem; color: #333;">
                      ${comment.texto}
                    </div>
                  </div>
                `).join('')}
                ${request.admin.comentarios.length > 2 ? `
                  <p style="font-size: 0.8rem; color: #666; text-align: center; margin-top: 5px;">
                    +${request.admin.comentarios.length - 2} comentários mais antigos (clique em "Detalhes" para ver todos)
                  </p>
                ` : ''}
              </div>
            ` : ''}
          </div>
        `;
    });

    container.innerHTML = html;
}

// 🎯 KANBAN BOARD
function renderKanbanBoard(requests) {
    const statusColumns = {
        'pendente': document.getElementById('kanban-pendente'),
        'em_andamento': document.getElementById('kanban-em_andamento'),
        'concluido': document.getElementById('kanban-concluido'),
        'cancelado': document.getElementById('kanban-cancelado')
    };

    // Limpar colunas
    Object.values(statusColumns).forEach(column => {
        column.innerHTML = '';
    });

    // Agrupar por status
    const groupedRequests = {};
    requests.forEach(request => {
        const status = request.admin?.status || 'pendente';
        if (!groupedRequests[status]) {
            groupedRequests[status] = [];
        }
        groupedRequests[status].push(request);
    });

    // Renderizar cards em cada coluna
    Object.entries(groupedRequests).forEach(([status, requests]) => {
        const column = statusColumns[status];
        if (!column) return;

        requests.forEach(request => {
            const serviceName = getServiceName(request.s, request.ts);
            const priority = request.admin?.prioridade || '';

            const card = document.createElement('div');
            card.className = `kanban-card ${getPriorityClass(priority)}`;
            card.draggable = true;
            card.dataset.requestId = request.id;
            card.dataset.currentStatus = status;

            card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
              <strong style="font-size: 0.9rem; color: #1e3c72;">${serviceName}</strong>
              ${priority ? `<span class="priority-indicator priority-${priority}" style="font-size: 0.7rem;">${priority.toUpperCase()}</span>` : ''}
            </div>
            <p style="font-size: 0.8rem; color: #666; margin-bottom: 8px;">${request.c}</p>
            <p style="font-size: 0.7rem; color: #888;">${formatDate(request.d)}</p>
            <div style="margin-top: 10px;">
              <button onclick="viewDetails('${request.id}')" style="font-size: 0.7rem; padding: 4px 8px; background: #e3f2fd; border: none; border-radius: 3px; cursor: pointer;">
                👁️ Ver
              </button>
              <button onclick="addComment('${request.id}')" style="font-size: 0.7rem; padding: 4px 8px; background: #f3e5f5; border: none; border-radius: 3px; cursor: pointer; margin-left: 5px;">
                💬 +
              </button>
            </div>
          `;

            // Drag and Drop events
            if (typeof handleDragStart === 'function') {
                card.addEventListener('dragstart', handleDragStart);
            }
            if (typeof handleDragEnd === 'function') {
                card.addEventListener('dragend', handleDragEnd);
            }

            column.appendChild(card);
        });
    });

    // Setup drop zones
    Object.entries(statusColumns).forEach(([status, column]) => {
        column.addEventListener('dragover', handleDragOver);
        column.addEventListener('drop', (e) => handleDrop(e, status));
    });
}

// 🎯 DRAG AND DROP HANDLERS
function handleDragEnd(e) {
    e.target.classList.remove('dragging');
}

function handleDragOver(e) {
    e.preventDefault();
}

async function handleDrop(e, newStatus) {
    e.preventDefault();
    const requestId = e.dataTransfer.getData('text/plain');
    const card = document.querySelector(`[data-request-id="${requestId}"]`);
    const currentStatus = card.dataset.currentStatus;

    if (currentStatus !== newStatus) {
        try {
            LoadingManager.show('Atualizando status...');
            await DashboardManager.updateStatus(requestId, newStatus);
            await loadDashboard();
            LoadingManager.hide();
            ToastManager.show('Status atualizado com sucesso!', 'success');
        } catch (error) {
            LoadingManager.hide();
            ToastManager.show('Erro ao atualizar status', 'error');
        }
    }
}

// 📋 MODAL HÍBRIDO - FUNÇÕES DE VISUALIZAÇÃO
function viewDetails(requestId) {
    const request = currentRequests.find(r => r.id === requestId);
    if (!request) {
        console.error('Solicitação não encontrada:', requestId);
        ToastManager.show('Solicitação não encontrada!', 'error');
        return;
    }

    // Armazenar o ID da solicitação atual para uso global
    currentRequestId = requestId;

    // Preencher cabeçalho do modal
    document.getElementById('modalSubtitle').textContent = `Solicitação #${requestId.substr(0, 8)}`;
    document.getElementById('modalDate').textContent = formatDate(request.d);

    // Preencher informações básicas
    const infoGrid = document.getElementById('modalInfoGrid');
    infoGrid.innerHTML = `
        <div class="info-item">
            <div class="info-label">Colaborador</div>
            <div class="info-value">${request.c}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Email</div>
            <div class="info-value">${request.e}</div>
        </div>
        <div class="info-item">
            <div class="info-label">WhatsApp</div>
            <div class="info-value">${request.w || 'Não informado'}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Data da Solicitação</div>
            <div class="info-value">${formatDate(request.d)}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Status</div>
            <div class="info-value">${getStatusBadge(request.admin?.status || 'pendente')}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Tipo de Serviço</div>
            <div class="info-value">${getServiceName(request.s, request.ts)}</div>
        </div>
        ${request.admin?.prioridade ? `
            <div class="info-item">
                <div class="info-label">Prioridade</div>
                <div class="info-value">
                    <span class="priority-indicator priority-${request.admin.prioridade}">
                        ${request.admin.prioridade.toUpperCase()}
                    </span>
                </div>
            </div>
        ` : ''}
        ${request.admin?.ultimaAtualizacao ? `
            <div class="info-item">
                <div class="info-label">Última Atualização</div>
                <div class="info-value">${formatDate(request.admin.ultimaAtualizacao)}</div>
            </div>
        ` : ''}
    `;

    // Preencher Detalhes da Solicitação
    const requestDetails = formatRequestDetailsStructured(request);
    const requestGrid = document.getElementById('modalRequestGrid');
    requestGrid.innerHTML = requestDetails.map(detail => {
        if (detail.isLong) {
            return `
                <div class="info-item full-width">
                    <div class="info-label">${detail.label}</div>
                    <div class="info-value${detail.isCode ? ' code-block' : ''}">${detail.value}</div>
                </div>
            `;
        } else {
            return `
                <div class="info-item">
                    <div class="info-label">${detail.label}</div>
                    <div class="info-value">${detail.value}</div>
                </div>
            `;
        }
    }).join('');

    // Preencher Arquivos
    const fileList = document.getElementById('modalFileList');
    if (request.arq && request.arq.length > 0) {
        fileList.innerHTML = request.arq.map(arquivo => `
            <div class="file-item">
            <div class="file-icon">${getFileIcon(arquivo.n)}</div>
            <div class="file-info">
                <div class="file-name">${arquivo.n}</div>
                <div class="file-meta">${(arquivo.s / 1024).toFixed(1)} KB • ${arquivo.t}</div>
            </div>
            <div class="file-actions">
                <button onclick="previewFile('${arquivo.u}', '${arquivo.n}', '${arquivo.t}')" class="btn-outline btn-sm">
                👁️ Visualizar
                </button>
                <button class="btn-secondary btn-sm" onclick="downloadArquivo('${arquivo.u}', '${arquivo.n}')">
                📥 Download
                </button>
            </div>
            </div>
        `).join('');
    } else {
        fileList.innerHTML = '<div style="color: #666; text-align: center; padding: 20px;">Nenhum arquivo anexado</div>';
    }

    // Preencher Timeline
    populateTimeline(request);

    // Preencher Ações
    populateActions(request);

    // Preencher Comentários
    populateComments(request);

    // Mostrar modal
    openModal('detailsModal');
}

// 📁 FUNÇÃO PARA ÍCONES DE ARQUIVO
function getFileIcon(filename) {
    const extension = filename.split('.').pop().toLowerCase();
    
    const icons = {
        // Imagens
        'jpg': '🖼️', 'jpeg': '🖼️', 'png': '🖼️', 'gif': '🖼️', 'svg': '🖼️', 'webp': '🖼️',
        // Documentos
        'pdf': '📄', 'doc': '📝', 'docx': '📝', 'txt': '📝', 'rtf': '📝',
        // Planilhas
        'xls': '📊', 'xlsx': '📊', 'csv': '📊',
        // Apresentações
        'ppt': '📊', 'pptx': '📊',
        // Vídeos
        'mp4': '🎥', 'avi': '🎥', 'mkv': '🎥', 'mov': '🎥', 'wmv': '🎥',
        // Áudios
        'mp3': '🎵', 'wav': '🎵', 'flac': '🎵', 'aac': '🎵',
        // Arquivos
        'zip': '📦', 'rar': '📦', '7z': '📦', 'tar': '📦',
        // Código
        'js': '💻', 'html': '💻', 'css': '💻', 'py': '💻', 'java': '💻', 'cpp': '💻'
    };
    
    return icons[extension] || '📄';
}

// 👁️ FUNÇÃO PARA VISUALIZAR ARQUIVO
function previewFile(fileUrl, fileName, fileType) {
    const extension = fileName.split('.').pop().toLowerCase();
    
    // Tipos de arquivo que podem ser visualizados diretamente
    const previewableTypes = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'pdf', 'txt', 'mp4', 'mp3'];
    
    if (previewableTypes.includes(extension)) {
        // Abrir em uma nova janela para visualização
        const previewWindow = window.open('', '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
        
        if (extension === 'pdf') {
            previewWindow.document.write(`
                <html>
                    <head>
                        <title>Visualizar: ${fileName}</title>
                        <style>
                            body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
                            .header { background: #f5f5f5; padding: 15px; margin-bottom: 20px; border-radius: 5px; }
                            .file-name { font-weight: bold; color: #333; }
                            .file-meta { color: #666; font-size: 0.9rem; margin-top: 5px; }
                            .actions { margin-top: 10px; }
                            .btn { padding: 8px 16px; margin-right: 10px; border: none; border-radius: 4px; cursor: pointer; }
                            .btn-primary { background: #007cba; color: white; }
                            .btn-secondary { background: #6c757d; color: white; }
                            iframe { width: 100%; height: 70vh; border: 1px solid #ddd; border-radius: 5px; }
                        </style>
                    </head>
                    <body>
                        <div class="header">
                            <div class="file-name">📄 ${fileName}</div>
                            <div class="file-meta">Tipo: ${fileType}</div>
                            <div class="actions">
                                <button class="btn btn-primary" onclick="window.open('${fileUrl}', '_blank')">📥 Download</button>
                                <button class="btn btn-secondary" onclick="window.close()">✖️ Fechar</button>
                            </div>
                        </div>
                        <iframe src="${fileUrl}" frameborder="0"></iframe>
                    </body>
                </html>
            `);
        } else if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(extension)) {
            previewWindow.document.write(`
                <html>
                    <head>
                        <title>Visualizar: ${fileName}</title>
                        <style>
                            body { margin: 0; padding: 20px; font-family: Arial, sans-serif; background: #f8f9fa; }
                            .header { background: white; padding: 15px; margin-bottom: 20px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                            .file-name { font-weight: bold; color: #333; }
                            .file-meta { color: #666; font-size: 0.9rem; margin-top: 5px; }
                            .actions { margin-top: 10px; }
                            .btn { padding: 8px 16px; margin-right: 10px; border: none; border-radius: 4px; cursor: pointer; }
                            .btn-primary { background: #007cba; color: white; }
                            .btn-secondary { background: #6c757d; color: white; }
                            .image-container { text-align: center; background: white; padding: 20px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                            .image-container img { max-width: 100%; max-height: 70vh; border-radius: 5px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
                        </style>
                    </head>
                    <body>
                        <div class="header">
                            <div class="file-name">🖼️ ${fileName}</div>
                            <div class="file-meta">Tipo: ${fileType}</div>
                            <div class="actions">
                                <button class="btn btn-primary" onclick="window.open('${fileUrl}', '_blank')">📥 Download</button>
                                <button class="btn btn-secondary" onclick="window.close()">✖️ Fechar</button>
                            </div>
                        </div>
                        <div class="image-container">
                            <img src="${fileUrl}" alt="${fileName}" />
                        </div>
                    </body>
                </html>
            `);
        } else if (extension === 'txt') {
            // Para arquivos de texto, fazer uma requisição para pegar o conteúdo
            fetch(fileUrl)
                .then(response => response.text())
                .then(text => {
                    previewWindow.document.write(`
                        <html>
                            <head>
                                <title>Visualizar: ${fileName}</title>
                                <style>
                                    body { margin: 0; padding: 20px; font-family: Arial, sans-serif; background: #f8f9fa; }
                                    .header { background: white; padding: 15px; margin-bottom: 20px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                                    .file-name { font-weight: bold; color: #333; }
                                    .file-meta { color: #666; font-size: 0.9rem; margin-top: 5px; }
                                    .actions { margin-top: 10px; }
                                    .btn { padding: 8px 16px; margin-right: 10px; border: none; border-radius: 4px; cursor: pointer; }
                                    .btn-primary { background: #007cba; color: white; }
                                    .btn-secondary { background: #6c757d; color: white; }
                                    .text-content { background: white; padding: 20px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); white-space: pre-wrap; font-family: monospace; font-size: 14px; line-height: 1.5; }
                                </style>
                            </head>
                            <body>
                                <div class="header">
                                    <div class="file-name">📝 ${fileName}</div>
                                    <div class="file-meta">Tipo: ${fileType}</div>
                                    <div class="actions">
                                        <button class="btn btn-primary" onclick="window.open('${fileUrl}', '_blank')">📥 Download</button>
                                        <button class="btn btn-secondary" onclick="window.close()">✖️ Fechar</button>
                                    </div>
                                </div>
                                <div class="text-content">${text}</div>
                            </body>
                        </html>
                    `);
                })
                .catch(error => {
                    previewWindow.document.write(`
                        <html>
                            <head><title>Erro</title></head>
                            <body>
                                <p>Erro ao carregar o arquivo: ${error.message}</p>
                                <button onclick="window.close()">Fechar</button>
                            </body>
                        </html>
                    `);
                });
        } else if (['mp4'].includes(extension)) {
            previewWindow.document.write(`
                <html>
                    <head>
                        <title>Visualizar: ${fileName}</title>
                        <style>
                            body { margin: 0; padding: 20px; font-family: Arial, sans-serif; background: #f8f9fa; }
                            .header { background: white; padding: 15px; margin-bottom: 20px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                            .file-name { font-weight: bold; color: #333; }
                            .file-meta { color: #666; font-size: 0.9rem; margin-top: 5px; }
                            .actions { margin-top: 10px; }
                            .btn { padding: 8px 16px; margin-right: 10px; border: none; border-radius: 4px; cursor: pointer; }
                            .btn-primary { background: #007cba; color: white; }
                            .btn-secondary { background: #6c757d; color: white; }
                            .video-container { text-align: center; background: white; padding: 20px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                            video { max-width: 100%; max-height: 70vh; border-radius: 5px; }
                        </style>
                    </head>
                    <body>
                        <div class="header">
                            <div class="file-name">🎥 ${fileName}</div>
                            <div class="file-meta">Tipo: ${fileType}</div>
                            <div class="actions">
                                <button class="btn btn-primary" onclick="window.open('${fileUrl}', '_blank')">📥 Download</button>
                                <button class="btn btn-secondary" onclick="window.close()">✖️ Fechar</button>
                            </div>
                        </div>
                        <div class="video-container">
                            <video controls>
                                <source src="${fileUrl}" type="video/mp4">
                                Seu navegador não suporta o elemento de vídeo.
                            </video>
                        </div>
                    </body>
                </html>
            `);
        }
    } else {
        // Para tipos não suportados, mostrar modal de informação
        alert(`Tipo de arquivo não suportado para visualização: ${extension}\n\nClique em "Download" para baixar o arquivo.`);
    }
}

// ⏱️ FUNÇÃO PARA POPULAR A TIMELINE (ESTILO CORREIOS)
function populateTimeline(request) {
    const timeline = document.getElementById('modalTimeline');
    if (!timeline) return;
    
    const currentStatus = request.admin?.status || 'pendente';
    const createdDate = request.d || Date.now();
    const updatedDate = request.admin?.ultimaAtualizacao || createdDate;
    
    // Definir os 4 estados da timeline
    const timelineStates = [
        {
            key: 'created',
            title: 'Solicitação criada',
            icon: '📋',
            timestamp: createdDate,
            completed: true // Sempre completo
        },
        {
            key: 'pending',
            title: 'Espera de aprovação',
            icon: '⏳',
            timestamp: createdDate,
            completed: currentStatus !== 'pendente'
        },
        {
            key: 'processing',
            title: currentStatus === 'cancelado' ? 'Cancelado' : 'Em processo',
            icon: currentStatus === 'cancelado' ? '❌' : '🔄',
            timestamp: currentStatus === 'em_andamento' || currentStatus === 'cancelado' ? updatedDate : null,
            completed: currentStatus === 'em_andamento' || currentStatus === 'cancelado' || currentStatus === 'concluido'
        },
        {
            key: 'completed',
            title: 'Concluído',
            icon: '✅',
            timestamp: currentStatus === 'concluido' ? updatedDate : null,
            completed: currentStatus === 'concluido'
        }
    ];
    
    // Gerar HTML da timeline estilo Correios
    timeline.innerHTML = `
        <div class="timeline-correios">
            ${timelineStates.map((state, index) => {
                const isActive = state.completed;
                const isLast = index === timelineStates.length - 1;
                const showTimestamp = state.timestamp && isActive;
                
                return `
                    <div class="timeline-step ${isActive ? 'active' : 'inactive'}">
                        <div class="timeline-step-marker">
                            <div class="timeline-step-icon">${state.icon}</div>
                            ${!isLast ? '<div class="timeline-step-line"></div>' : ''}
                        </div>
                        <div class="timeline-step-content">
                            <div class="timeline-step-title">${state.title}</div>
                            ${showTimestamp ? `<div class="timeline-step-time">${formatDate(state.timestamp)}</div>` : ''}
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

// Função auxiliar para texto do status
function getStatusText(status) {
    switch(status) {
        case 'pendente': return '⏳ Pendente';
        case 'em_andamento': return '🔄 Em Andamento';
        case 'concluido': return '✅ Concluído';
        case 'cancelado': return '❌ Cancelado';
        default: return '⏳ Pendente';
    }
}

// ⚡ FUNÇÃO PARA POPULAR AS AÇÕES
function populateActions(request) {
    const actions = document.getElementById('modalActions');
    if (!actions) return;
    
    const status = request.admin?.status || 'pendente';
    const priority = request.admin?.prioridade || 'media';
    
    let actionCards = '';
    
    // Card de Status
    actionCards += `
        <div class="action-card">
            <div class="card-title">🔄 Status</div>
            <div class="card-buttons">
    `;
    
    if (status === 'pendente') {
        actionCards += `
            <button class="btn-action success" onclick="updateStatus('${request.id}', 'em_andamento')">
                🔄 Iniciar
            </button>
            <button class="btn-action danger" onclick="updateStatus('${request.id}', 'cancelado')">
                ❌ Cancelar
            </button>
        `;
    } else if (status === 'em_andamento') {
        actionCards += `
            <button class="btn-action success" onclick="updateStatus('${request.id}', 'concluido')">
                ✅ Concluir
            </button>
            <button class="btn-action danger" onclick="updateStatus('${request.id}', 'cancelado')">
                ❌ Cancelar
            </button>
        `;
    } else if (status === 'concluido') {
        actionCards += `
            <button class="btn-action secondary" onclick="updateStatus('${request.id}', 'em_andamento')">
                🔄 Reabrir
            </button>
        `;
    } else if (status === 'cancelado') {
        actionCards += `
            <button class="btn-action secondary" onclick="updateStatus('${request.id}', 'pendente')">
                🔄 Reativar
            </button>
        `;
    }
    
    actionCards += `
            </div>
        </div>
    `;
    
    // Card de Prioridade com visual melhorada
    actionCards += `
        <div class="action-card">
            <div class="card-title">🎯 Prioridade</div>
            <div class="card-buttons priority-buttons">
                <button class="btn-action priority-high ${priority === 'alta' ? 'active' : ''}" onclick="setPriority('${request.id}', 'alta')">
                    🔴 Alta
                </button>
                <button class="btn-action priority-medium ${priority === 'media' ? 'active' : ''}" onclick="setPriority('${request.id}', 'media')">
                    🟡 Média
                </button>
                <button class="btn-action priority-low ${priority === 'baixa' ? 'active' : ''}" onclick="setPriority('${request.id}', 'baixa')">
                    🟢 Baixa
                </button>
            </div>
        </div>
    `;
    
    actions.innerHTML = actionCards;
}

// Função auxiliar para texto da prioridade
function getPriorityText(priority) {
    switch(priority) {
        case 'alta': return '🔴 Alta';
        case 'media': return '🟡 Média';
        case 'baixa': return '🟢 Baixa';
        default: return '🟡 Média';
    }
}

// ⚡ FUNÇÃO PARA POPULAR OS COMENTÁRIOS
function populateComments(request) {
    const comments = document.getElementById('modalComments');
    if (!comments) return;
    
    // Verificar diferentes estruturas de comentários
    const requestComments = request.admin?.comments || 
                           request.admin?.comentarios || 
                           request.comentarios || 
                           [];
    
    if (requestComments.length === 0) {
        comments.innerHTML = `
            <div class="no-comments">
                <div class="no-comments-icon">💬</div>
                <div class="no-comments-text">Nenhum comentário ainda</div>
            </div>
        `;
        return;
    }
    
    comments.innerHTML = requestComments.map((comment, index) => {
        // Tratar diferentes formatos de comentário com mais robustez
        let commentText = '';
        let commentAuthor = 'Administrador';
        let commentTimestamp = Date.now();
        
        if (typeof comment === 'string') {
            commentText = comment;
        } else if (typeof comment === 'object' && comment !== null) {
            // Verificar se o objeto tem as propriedades esperadas
            commentText = comment.texto || comment.text || comment.comment || comment.message || '';
            commentAuthor = comment.autor || comment.author || comment.user || 'Administrador';
            commentTimestamp = comment.timestamp || comment.time || comment.date || Date.now();
            
            // Se ainda não conseguimos extrair o texto, tentar JSON.stringify
            if (!commentText && comment !== null) {
                try {
                    // Tentar extrair texto de um objeto mais complexo
                    if (comment.toString() !== '[object Object]') {
                        commentText = comment.toString();
                    } else {
                        commentText = JSON.stringify(comment);
                    }
                } catch (e) {
                    commentText = 'Comentário inválido';
                }
            }
        } else {
            commentText = String(comment);
        }
        
        // Garantir que commentText seja uma string e não seja vazio
        commentText = String(commentText || '');
        commentAuthor = String(commentAuthor || 'Administrador');
        commentTimestamp = Number(commentTimestamp) || Date.now();
        
        if (!commentText || commentText.trim() === '') {
            commentText = 'Comentário sem texto';
        }
        
        return `
            <div class="comment-item">
                <div class="comment-header">
                    <div class="comment-author">${commentAuthor}</div>
                    <div class="comment-date">${formatDate(commentTimestamp)}</div>
                </div>
                <div class="comment-content">${commentText}</div>
            </div>
        `;
    }).join('');
}

// Função modificada para adicionar comentário da modal
function addCommentFromModal() {
    const commentText = document.getElementById('newComment').value.trim();
    if (!commentText || !currentRequestId) return;
    
    submitCommentText(commentText);
}

// Função para submeter comentário
async function submitCommentText(comment) {
    if (!comment || !currentRequestId) return;

    try {
        const success = await firebaseService.addComment(currentRequestId, comment, 'Administrador');

        if (success) {
            ToastManager.show('Comentário adicionado com sucesso!', 'success');
            document.getElementById('newComment').value = '';
            
            // Usar nossa função de refresh do modal
            await executeActionWithRefresh(
                async () => {}, // Ação vazia pois já foi executada
                currentRequestId
            );
        }
    } catch (error) {
        console.error('❌ Erro ao adicionar comentário:', error);
        ToastManager.show('Erro ao adicionar comentário', 'error');
    }
}

// � FUNÇÃO PARA ADICIONAR COMENTÁRIO (BOTÃO DE AÇÃO RÁPIDA)
function addComment(requestId) {
    const comment = prompt('Digite seu comentário:');
    if (comment && comment.trim()) {
        // Definir o currentRequestId temporariamente
        const tempCurrentRequestId = currentRequestId;
        currentRequestId = requestId;
        
        // Submeter comentário
        submitCommentText(comment.trim()).then(() => {
            // Restaurar o currentRequestId original
            currentRequestId = tempCurrentRequestId;
        });
    }
}

// Função para forçar download do arquivo anexado
function downloadArquivo(url, nome) {
    const link = document.createElement('a');
    link.href = url;
    link.download = nome || '';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// �🔄 FUNÇÕES DE INTERAÇÃO
// 🔄 FUNCIONALIDADE: AÇÃO → FECHAR MODAL → ATUALIZAR → REABRIR
async function executeActionWithRefresh(actionFunction, requestId, ...args) {
    try {
        // Executar a ação
        await actionFunction(requestId, ...args);
        
        // Fechar modal suavemente
        closeModal('detailsModal');
        
        // Mostrar loading com mensagem personalizada
        LoadingManager.show('Atualizando informações...');
        
        // Aguardar para garantir que o modal fechou
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Recarregar dashboard
        await loadDashboard();
        
        // Aguardar para garantir que os dados foram atualizados
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Esconder loading
        LoadingManager.hide();
        
        // Verificar se a solicitação ainda existe (não foi deletada)
        const updatedRequest = currentRequests.find(r => r.id === requestId);
        if (updatedRequest) {
            // Reabrir modal com dados atualizados
            setTimeout(() => {
                viewDetails(requestId);
                ToastManager.show('Informações atualizadas com sucesso!', 'success');
            }, 100);
        } else {
            ToastManager.show('Solicitação não encontrada após atualização', 'warning');
        }
        
    } catch (error) {
        LoadingManager.hide();
        console.error('❌ Erro ao executar ação:', error);
        ToastManager.show('Erro ao executar ação. Tente novamente.', 'error');
    }
}

async function updateStatus(requestId, newStatus) {
    if (newStatus) {
        await executeActionWithRefresh(
            async (id, status) => await DashboardManager.updateStatus(id, status),
            requestId,
            newStatus
        );
    }
}

async function setPriority(requestId, priority) {
    if (priority) {
        await executeActionWithRefresh(
            async (id, prio) => await DashboardManager.setPriority(id, prio),
            requestId,
            priority
        );
    }
}

// 🔄 SISTEMA DE TABS
function switchTab(tabName) {
    // Remover classes ativas
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // Adicionar classes ativas
    document.querySelector(`[onclick="switchTab('${tabName}')"]`).classList.add('active');
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    // Debug específico para aba de comentários
    if (tabName === 'comments') {
        console.log('🔍 Aba de comentários ativada');
        
        // Verificar se elementos existem
        const commentsTab = document.getElementById('comments-tab');
        const addCommentSection = document.querySelector('.add-comment-section');
        const commentForm = document.querySelector('.comment-form');
        const button = document.querySelector('.comment-form button');
        
        console.log('📋 Elementos encontrados:', {
            commentsTab: commentsTab ? 'OK' : 'ERRO',
            addCommentSection: addCommentSection ? 'OK' : 'ERRO',
            commentForm: commentForm ? 'OK' : 'ERRO',
            button: button ? 'OK' : 'ERRO'
        });
        
        // Verificar dimensões
        if (commentsTab) {
            const rect = commentsTab.getBoundingClientRect();
            console.log('📏 Dimensões da aba de comentários:', {
                width: rect.width,
                height: rect.height,
                top: rect.top,
                bottom: rect.bottom
            });
        }
    }
}

console.log('📋 Admin Dashboard - Funções do dashboard carregadas');
