/* 🔧 SENAI Lab Admin - Funções do Dashboard v2.7.3
 * Arquivo: public/assets/js/admin/dashboard.js
 * Descrição: Funções principais do dashboard com UX melhorado
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
        'pendente': '<span class="status-badge status-pendente">⏳ Pendente</span>',
        'aprovado': '<span class="status-badge status-aprovado">✅ Aprovado</span>',
        'em_andamento': '<span class="status-badge status-em_andamento">🔄 Em Andamento</span>',
        'concluido': '<span class="status-badge status-concluido">🎉 Concluído</span>',
        'cancelado': '<span class="status-badge status-cancelado">❌ Cancelado</span>',
        'reaberto': '<span class="status-badge status-reaberto">🔄 Reaberto</span>'
    };

    return badges[status] || badges['pendente'];
}

function getServiceIcon(service, subService) {
    const icons = {
        'espaco_maker': '🔧',
        'servicos': {
            'impressao': '🖨️',
            'impressao_3d': '🏗️',
            'manutencao': '🔧',
            'arte_digital': '🎨',
            'projeto': '📐'
        },
        'emprestimo': '📦'
    };

    if (service === 'servicos' && subService) {
        return icons.servicos[subService] || '⚙️';
    }

    return icons[service] || '📋';
}

function getPriorityClass(priority) {
    return priority ? `priority-${priority}` : '';
}

function getPriorityIcon(priority) {
    const icons = {
        'alta': '🔴',
        'media': '🟡',
        'baixa': '🟢'
    };
    return icons[priority] || '';
}

// 📋 RENDERIZAÇÃO DA LISTA
/* 🎨 MODELO TABELA RESPONSIVA - Renderização Principal com UX v2.7.3 */
async function renderRequestsList(requests) {
    const container = document.getElementById('requestsList');

    // Mostrar skeleton enquanto carrega
    if (window.SkeletonManager) {
        SkeletonManager.showRequestsTable(container);
    }

    if (requests.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>Nenhuma solicitação encontrada</p></div>';
        return;
    }

    // Simular delay para demonstrar skeleton (remover em produção)
    await new Promise(resolve => setTimeout(resolve, 500));

    let html = `
        <div class="table-container">
            <table class="requests-table">
                <thead>
                    <tr>
                        <th>Serviço</th>
                        <th>Solicitante</th>
                        <th>Data</th>
                        <th>Status</th>
                        <th>Prioridade</th>
                        <th>Arquivos</th>
                        <th>Comentários</th>
                    </tr>
                </thead>
                <tbody>
    `;

    requests.forEach((request, index) => {
        const status = request.admin?.status || 'pendente';
        const priority = request.admin?.prioridade || 'baixa';
        const serviceName = getServiceName(request.s, request.ts);
        const priorityClass = getPriorityClass(priority);

        html += `
            <tr class="table-row ${priorityClass} micro-hover" 
                onclick="viewDetails('${request.id}')" 
                data-micro-animation="slide-up">
                <!-- Serviço -->
                <td class="service-cell">
                    <div class="service-info-table">
                        <span class="service-icon-table">${getServiceIcon(request.s, request.ts)}</span>
                        <div class="service-details-table">
                            <strong>${serviceName}</strong>
                            <small>#${request.id.substr(0, 8)}</small>
                        </div>
                    </div>
                </td>

                <!-- Solicitante -->
                <td class="requester-cell">
                    <div class="requester-info">
                        <span class="requester-name">${request.c}</span>
                        <small class="requester-email">${request.e}</small>
                    </div>
                </td>

                <!-- Data -->
                <td class="date-cell">
                    <span class="date-text">${formatDate(request.d)}</span>
                </td>

                <!-- Status -->
                <td class="status-cell">
                    ${getStatusBadge(status)}
                </td>

                <!-- Prioridade -->
                <td class="priority-cell">
                    ${priority ? `
                        <span class="priority-badge-table priority-${priority}">
                            ${getPriorityIcon(priority)} ${priority.toUpperCase()}
                        </span>
                    ` : '<span class="no-priority">-</span>'}
                </td>

                <!-- Arquivos -->
                <td class="files-cell">
                    ${request.arq?.length ? `
                        <span class="files-count">
                            📎 ${request.arq.length} arquivo(s)
                        </span>
                    ` : '<span class="no-files">-</span>'}
                </td>

                <!-- Comentários -->
                <td class="comments-cell">
                    ${request.admin?.comentarios?.length ? `
                        <span class="comments-count">
                            💬 ${request.admin.comentarios.length}
                        </span>
                    ` : '<span class="no-comments">-</span>'}
                </td>
            </tr>
        `;
    });

    html += `
                </tbody>
            </table>
        </div>
    `;

    container.innerHTML = html;

    // Animar entrada dos elementos
    if (window.MicroInteractions) {
        const rows = container.querySelectorAll('.table-row');
        MicroInteractions.animateList(rows, 'slide-up', 50);
    }
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
            
            // Registrar ação de auditoria
            AdminAuth.logUserAction('updateStatus', {
                description: `Status alterado de "${currentStatus}" para "${newStatus}"`,
                requestId: requestId,
                previousStatus: currentStatus,
                newStatus: newStatus
            });
            
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

    // Atualizar informações do usuário atual no modal
    document.getElementById('modalUserAvatar').textContent = AdminAuth.getCurrentUserAvatar();
    document.getElementById('modalUserName').textContent = AdminAuth.getCurrentUserName();

    // Registrar ação de visualização
    AdminAuth.logUserAction('viewDetails', {
        description: `Visualização de detalhes da solicitação`,
        requestId: requestId,
        service: getServiceName(request.s, request.ts)
    });

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
        <div class="info-item">
            <div class="info-label">Prioridade</div>
            <div class="info-value">
                <span class="priority-indicator priority-${request.admin?.prioridade || 'baixa'}">
                    ${getPriorityIcon(request.admin?.prioridade || 'baixa')} ${(request.admin?.prioridade || 'baixa').toUpperCase()}
                </span>
            </div>
        </div>
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

// ⏱️ FUNÇÃO PARA POPULAR A TIMELINE COM NOVA ESTRUTURA DE STATUS
function populateTimeline(request) {
    const timeline = document.getElementById('modalTimeline');
    if (!timeline) return;
    
    const requestId = request.id; // Extrair o ID da solicitação
    const currentStatus = request.admin?.status || 'pendente';
    const createdDate = request.d || Date.now();
    const adminData = request.admin || {};
    
    // Buscar datas reais dos logs administrativos com nova estrutura
    const statusHistory = getStatusHistory(request);
    
    // Definir os estados da timeline baseado no fluxo: Pendente → Aprovado → Iniciar → Concluir → Reabrir
    const timelineStates = [
        {
            key: 'created',
            title: 'Solicitação Criada',
            icon: '📋',
            timestamp: statusHistory.created || createdDate,
            completed: true, // Sempre completo
            description: 'Solicitação enviada pelo colaborador',
            user: `📤 ${request.c}`
        },
        {
            key: 'approved',
            title: currentStatus === 'cancelado' ? 'Cancelada' : 'Aprovada',
            icon: currentStatus === 'cancelado' ? '❌' : '✅',
            timestamp: statusHistory.approved || (currentStatus === 'cancelado' ? statusHistory.cancelled : null),
            completed: ['aprovado', 'em_andamento', 'concluido', 'reaberto', 'cancelado'].includes(currentStatus),
            description: currentStatus === 'cancelado' ? 'Solicitação cancelada' : 'Aprovada para execução',
            user: AuditManager.getUserForStatusChange(requestId, currentStatus === 'cancelado' ? 'cancelado' : 'aprovado')?.name
        },
        {
            key: 'started',
            title: currentStatus === 'cancelado' ? 'Processo Interrompido' : 'Execução Iniciada',
            icon: currentStatus === 'cancelado' ? '⚠️' : '🔧',
            timestamp: statusHistory.processing || statusHistory.started || (currentStatus === 'cancelado' ? statusHistory.cancelled : null),
            completed: ['em_andamento', 'concluido', 'reaberto'].includes(currentStatus) || (currentStatus === 'cancelado' && statusHistory.processing),
            description: currentStatus === 'cancelado' ? 'Execução foi interrompida' : 'Serviço em andamento',
            user: AuditManager.getUserForStatusChange(requestId, currentStatus === 'cancelado' ? 'cancelado' : 'em_andamento')?.name
        },
        {
            key: 'completed',
            title: currentStatus === 'reaberto' ? 'Reaberto para Nova Execução' : 'Concluído',
            icon: currentStatus === 'reaberto' ? '🔄' : '🎉',
            timestamp: statusHistory.completed || statusHistory.reopened || (currentStatus === 'concluido' ? adminData.data_atualizacao : null),
            completed: currentStatus === 'concluido' || currentStatus === 'reaberto',
            description: currentStatus === 'reaberto' ? 'Reaberto para nova execução' : 'Serviço finalizado com sucesso',
            user: AuditManager.getUserForStatusChange(requestId, currentStatus)?.name
        }
    ];
    
    // Ajustar estados para reaberto
    if (currentStatus === 'reaberto') {
        timelineStates.push({
            key: 'reexecution',
            title: 'Aguardando Nova Execução',
            icon: '⏳',
            timestamp: null,
            completed: false,
            description: 'Aguardando início da nova execução'
        });
    }
    
    // Filtrar estados baseado no status atual
    let visibleStates = timelineStates;
    if (currentStatus === 'cancelado') {
        // Para cancelados, mostrar até onde chegou
        const cancelIndex = timelineStates.findIndex(state => state.timestamp === statusHistory.cancelled);
        if (cancelIndex > 0) {
            visibleStates = timelineStates.slice(0, cancelIndex + 1);
        } else {
            visibleStates = timelineStates.slice(0, 2); // Criada + Cancelada
        }
    }
    
    // Gerar HTML da timeline estilo Correios com dados reais
    timeline.innerHTML = `
        <div class="timeline-correios">
            ${visibleStates.map((state, index) => {
                const isActive = state.completed;
                const isLast = index === visibleStates.length - 1;
                const showTimestamp = state.timestamp && isActive;
                
                return `
                    <div class="timeline-step ${isActive ? 'active' : 'inactive'}">
                        <div class="timeline-step-marker">
                            <div class="timeline-step-icon">${state.icon}</div>
                            ${!isLast ? '<div class="timeline-step-line"></div>' : ''}
                        </div>
                        <div class="timeline-step-content">
                            <div class="timeline-step-title">${state.title}</div>
                            <div class="timeline-step-description" style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 2px;">${state.description}</div>
                            ${showTimestamp ? `<div class="timeline-step-time">${formatDateTime(state.timestamp)}</div>` : ''}
                            ${state.user ? `<div class="timeline-step-user" style="font-size: 0.75rem; color: var(--primary-blue); margin-top: 4px; font-weight: 500;">👤 ${state.user}</div>` : ''}
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

// 📜 FUNÇÃO PARA OBTER HISTÓRICO DE STATUS COM NOVA ESTRUTURA
function getStatusHistory(request) {
    const history = {
        created: request.d,
        approved: null,
        processing: null,
        completed: null,
        cancelled: null,
        reopened: null
    };
    
    const adminData = request.admin || {};
    
    // PRIORIDADE 1: Usar admin.timestamps se existir (nova estrutura)
    if (adminData.timestamps) {
        history.created = adminData.timestamps.created || request.d;
        history.approved = adminData.timestamps.approved;
        history.processing = adminData.timestamps.started;
        history.completed = adminData.timestamps.completed;
        history.cancelled = adminData.timestamps.cancelled;
        history.reopened = adminData.timestamps.reopened;
        return history;
    }
    
    // PRIORIDADE 2: Usar status_history se existir
    if (adminData.status_history && adminData.status_history.length > 0) {
        adminData.status_history.forEach(entry => {
            switch(entry.status) {
                case 'aprovado':
                    if (!history.approved) history.approved = entry.timestamp;
                    break;
                case 'em_andamento':
                    if (!history.approved) history.approved = entry.timestamp;
                    history.processing = entry.timestamp;
                    break;
                case 'concluido':
                    if (!history.approved) history.approved = adminData.data_atualizacao || adminData.ultimaAtualizacao;
                    if (!history.processing) history.processing = adminData.data_atualizacao || adminData.ultimaAtualizacao;
                    history.completed = entry.timestamp;
                    break;
                case 'cancelado':
                    history.cancelled = entry.timestamp;
                    break;
                case 'reaberto':
                    history.reopened = entry.timestamp;
                    // Reset completed/cancelled se foi reaberto
                    history.completed = null;
                    history.cancelled = null;
                    break;
            }
        });
        return history;
    }
    
    // FALLBACK: Usar logs antigos
    const logs = adminData.logs || [];
    logs.forEach(log => {
        if (log.action === 'status_update') {
            const newStatus = log.details?.new_status;
            const timestamp = log.timestamp;
            
            switch(newStatus) {
                case 'aprovado':
                    if (!history.approved) history.approved = timestamp;
                    break;
                case 'em_andamento':
                    if (!history.approved) history.approved = timestamp;
                    history.processing = timestamp;
                    break;
                case 'concluido':
                    if (!history.approved) history.approved = adminData.data_atualizacao || adminData.ultimaAtualizacao;
                    if (!history.processing) history.processing = adminData.data_atualizacao || adminData.ultimaAtualizacao;
                    history.completed = timestamp;
                    break;
                case 'cancelado':
                    history.cancelled = timestamp;
                    break;
                case 'reaberto':
                    history.reopened = timestamp;
                    break;
            }
        }
    });
    
    // Se não houver dados específicos, usar as datas de admin como último fallback
    if (!history.approved && adminData.data_atualizacao && (adminData.status !== 'pendente')) {
        history.approved = adminData.data_atualizacao;
    }
    
    return history;
}

// 🕐 FUNÇÃO PARA FORMATAÇÃO DE DATA E HORA MAIS COMPLETA
function formatDateTime(timestamp) {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    const timeStr = date.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
    });
    
    if (diffDays === 0) {
        return `Hoje às ${timeStr}`;
    } else if (diffDays === 1) {
        return `Ontem às ${timeStr}`;
    } else if (diffDays < 7) {
        return `${diffDays} dias atrás às ${timeStr}`;
    } else {
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
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

// ⚡ FUNÇÃO PARA POPULAR AS AÇÕES COM FLUXO CORRETO
function populateActions(request) {
    const actions = document.getElementById('modalActions');
    if (!actions) return;
    
    const status = request.admin?.status || 'pendente';
    const priority = request.admin?.prioridade || 'baixa';
    
    let actionCards = '';
    
    // Card de Status com fluxo: Pendente -> Aprovado/Cancelar -> Iniciar/Cancelar -> Concluir/Cancelar -> Reabrir
    actionCards += `
        <div class="action-card">
            <div class="card-title">🔄 Controle de Status</div>
            <div class="card-buttons">
    `;
    
    // FLUXO CORRETO: Pendente → Aprovado → Iniciar → Concluir → Reabrir
    if (status === 'pendente') {
        actionCards += `
            <button class="btn-action success" onclick="updateStatus('${request.id}', 'aprovado')" title="Aprovar solicitação">
                ✅ Aprovar
            </button>
            <button class="btn-action danger" onclick="updateStatus('${request.id}', 'cancelado')" title="Cancelar solicitação">
                ❌ Cancelar
            </button>
        `;
    } else if (status === 'aprovado') {
        actionCards += `
            <button class="btn-action success" onclick="updateStatus('${request.id}', 'em_andamento')" title="Iniciar execução do serviço">
                🚀 Iniciar
            </button>
            <button class="btn-action danger" onclick="updateStatus('${request.id}', 'cancelado')" title="Cancelar após aprovação">
                ❌ Cancelar
            </button>
        `;
    } else if (status === 'em_andamento') {
        actionCards += `
            <button class="btn-action success" onclick="updateStatus('${request.id}', 'concluido')" title="Marcar como concluído">
                🎉 Concluir
            </button>
            <button class="btn-action danger" onclick="updateStatus('${request.id}', 'cancelado')" title="Cancelar execução">
                ❌ Cancelar
            </button>
        `;
    } else if (status === 'concluido') {
        actionCards += `
            <button class="btn-action secondary" onclick="updateStatus('${request.id}', 'reaberto')" title="Reabrir para nova execução">
                🔄 Reabrir
            </button>
            <div style="margin-top: 8px; padding: 8px; background: #e8f5e8; border-radius: 6px; font-size: 12px; color: #2e7d32;">
                ✅ Serviço concluído com sucesso!
            </div>
        `;
    } else if (status === 'cancelado') {
        actionCards += `
            <button class="btn-action secondary" onclick="updateStatus('${request.id}', 'pendente')" title="Reativar solicitação">
                🔄 Reativar
            </button>
            <div style="margin-top: 8px; padding: 8px; background: #ffebee; border-radius: 6px; font-size: 12px; color: #c62828;">
                ❌ Solicitação cancelada
            </div>
        `;
    } else if (status === 'reaberto') {
        actionCards += `
            <button class="btn-action success" onclick="updateStatus('${request.id}', 'em_andamento')" title="Iniciar nova execução">
                🚀 Iniciar
            </button>
            <button class="btn-action danger" onclick="updateStatus('${request.id}', 'cancelado')" title="Cancelar reexecução">
                ❌ Cancelar
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
            <div class="card-title">🎯 Definir Prioridade</div>
            <div class="card-buttons priority-buttons">
                <button class="btn-action priority-high ${priority === 'alta' ? 'active' : ''}" onclick="setPriority('${request.id}', 'alta')" title="Prioridade alta - Urgente">
                    🔴 Alta
                </button>
                <button class="btn-action priority-medium ${priority === 'media' ? 'active' : ''}" onclick="setPriority('${request.id}', 'media')" title="Prioridade média - Normal">
                    🟡 Média
                </button>
                <button class="btn-action priority-low ${priority === 'baixa' ? 'active' : ''}" onclick="setPriority('${request.id}', 'baixa')" title="Prioridade baixa - Quando possível">
                    🟢 Baixa
                </button>
            </div>
        </div>
    `;

    // Card de Informações do Status Atual
    const statusInfo = getStatusInfo(status);
    actionCards += `
        <div class="action-card">
            <div class="card-title">📊 Status Atual</div>
            <div style="padding: 12px; background: ${statusInfo.bgColor}; border-radius: 8px; border-left: 4px solid ${statusInfo.borderColor};">
                <div style="font-weight: 600; color: ${statusInfo.textColor}; margin-bottom: 4px;">
                    ${statusInfo.icon} ${statusInfo.title}
                </div>
                <div style="font-size: 12px; color: ${statusInfo.descColor};">
                    ${statusInfo.description}
                </div>
                ${request.admin?.data_atualizacao ? `
                    <div style="font-size: 11px; color: #666; margin-top: 6px;">
                        Atualizado: ${formatDateTime(request.admin.data_atualizacao)}
                    </div>
                ` : ''}
            </div>
        </div>
    `;
    
    actions.innerHTML = actionCards;
}

// 📊 FUNÇÃO PARA OBTER INFORMAÇÕES DO STATUS COM NOVOS STATUS
function getStatusInfo(status) {
    const statusMap = {
        'pendente': {
            icon: '⏳',
            title: 'Aguardando Aprovação',
            description: 'Solicitação precisa ser analisada e aprovada',
            bgColor: '#fff8e1',
            borderColor: '#ff9800',
            textColor: '#e65100',
            descColor: '#bf360c'
        },
        'aprovado': {
            icon: '✅',
            title: 'Aprovado',
            description: 'Solicitação aprovada, aguardando início da execução',
            bgColor: '#e8f8f5',
            borderColor: '#26a69a',
            textColor: '#00695c',
            descColor: '#00796b'
        },
        'em_andamento': {
            icon: '🔄',
            title: 'Em Execução',
            description: 'Serviço sendo executado ativamente',
            bgColor: '#e3f2fd',
            borderColor: '#2196f3',
            textColor: '#0d47a1',
            descColor: '#1565c0'
        },
        'concluido': {
            icon: '🎉',
            title: 'Concluído',
            description: 'Serviço finalizado com sucesso',
            bgColor: '#e8f5e8',
            borderColor: '#4caf50',
            textColor: '#2e7d32',
            descColor: '#388e3c'
        },
        'cancelado': {
            icon: '❌',
            title: 'Cancelado',
            description: 'Solicitação foi cancelada',
            bgColor: '#ffebee',
            borderColor: '#f44336',
            textColor: '#c62828',
            descColor: '#d32f2f'
        },
        'reaberto': {
            icon: '🔄',
            title: 'Reaberto',
            description: 'Solicitação reaberta para nova execução',
            bgColor: '#f3e5f5',
            borderColor: '#9c27b0',
            textColor: '#6a1b9a',
            descColor: '#7b1fa2'
        }
    };
    
    return statusMap[status] || statusMap['pendente'];
}

// Função auxiliar para texto da prioridade
function getPriorityText(priority) {
    switch(priority) {
        case 'alta': return '🔴 Alta';
        case 'media': return '🟡 Média';
        case 'baixa': return '🟢 Baixa';
        default: return '� Baixa';
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
    
    // Registrar ação de auditoria
    AdminAuth.logUserAction('addComment', {
        description: `Comentário adicionado na solicitação`,
        requestId: currentRequestId,
        commentPreview: commentText.substring(0, 50) + (commentText.length > 50 ? '...' : '')
    });
    
    submitCommentText(commentText);
}

// Função para submeter comentário
async function submitCommentText(comment) {
    if (!comment || !currentRequestId) return;

    try {
        // Obter nome do usuário autenticado
        const userName = AdminAuth.getCurrentUserName();
        const userAvatar = AdminAuth.getCurrentUserAvatar();
        
        const success = await firebaseService.addComment(currentRequestId, comment, `${userAvatar} ${userName}`);

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
        // Obter status atual para auditoria
        const currentRequest = currentRequests.find(r => r.id === requestId);
        const currentStatus = currentRequest?.admin?.status || 'pendente';
        
        // Registrar ação de auditoria
        AdminAuth.logUserAction('updateStatus', {
            description: `Status alterado de "${currentStatus}" para "${newStatus}" via modal`,
            requestId: requestId,
            previousStatus: currentStatus,
            newStatus: newStatus
        });
        
        await executeActionWithRefresh(
            async (id, status) => await DashboardManager.updateStatus(id, status),
            requestId,
            newStatus
        );
    }
}

async function setPriority(requestId, priority) {
    if (priority) {
        // Obter prioridade atual para auditoria
        const currentRequest = currentRequests.find(r => r.id === requestId);
        const currentPriority = currentRequest?.admin?.prioridade || 'normal';
        
        // Registrar ação de auditoria
        AdminAuth.logUserAction('setPriority', {
            description: `Prioridade alterada de "${currentPriority}" para "${priority}"`,
            requestId: requestId,
            previousPriority: currentPriority,
            newPriority: priority
        });
        
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
