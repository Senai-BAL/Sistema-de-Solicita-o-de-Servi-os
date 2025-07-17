/* 🔧 SENAI Lab Admin - Funções do Dashboard
 * Arquivo: public/assets/js/admin/dashboard.js
 * Descrição: Funções principais do dashboard, renderização e interações
 */

// 🔐 SISTEMA DE LOGIN/LOGOUT
function showDashboard() {
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('dashboard').classList.add('show');

    // ✨ INICIALIZAR NOTIFICAÇÕES
    if (!dashboardNotifications) {
        dashboardNotifications = new DashboardWithNotifications();
    }
    dashboardNotifications.onAdminLogin();

    loadDashboard();
}

function logout() {
    if (confirm('Tem certeza que deseja sair?')) {
        // ✨ PARAR NOTIFICAÇÕES
        if (dashboardNotifications) {
            dashboardNotifications.onAdminLogout();
        }

        AdminAuth.logout();
        ToastManager.show('Logout realizado com sucesso!', 'success');
        showLogin();
    }
}

function showLogin() {
    document.getElementById('loginContainer').style.display = 'flex';
    document.getElementById('dashboard').classList.remove('show');
    document.getElementById('adminPassword').focus();
}

// 🎨 SISTEMA DE INTERFACE
function updateStatsDisplay(stats) {
    document.getElementById('totalRequests').textContent = stats.total || 0;
    document.getElementById('pendingRequests').textContent = stats.pending || 0;
    document.getElementById('inProgressRequests').textContent = stats.inProgress || 0;
    document.getElementById('completedRequests').textContent = stats.completed || 0;

    // Atualizar indicadores de mudança
    document.getElementById('totalChange').textContent = `+${stats.today || 0} hoje`;
    document.getElementById('pendingChange').textContent = stats.pending > 5 ? 'Requer atenção' : 'Sob controle';
    document.getElementById('progressChange').textContent = 'Em processo';
    document.getElementById('completedChange').textContent = 'Finalizadas';
}

function formatDate(timestamp) {
    return new Date(timestamp).toLocaleString('pt-BR');
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
        await DashboardManager.updateStatus(requestId, newStatus);
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
                <div class="file-icon">📄</div>
                <div class="file-info">
                    <div class="file-name">${arquivo.n}</div>
                    <div class="file-meta">${(arquivo.s / 1024).toFixed(1)} KB • ${arquivo.t}</div>
                </div>
                <div class="file-actions">
                    <a href="${arquivo.u}" target="_blank" class="file-action-btn">
                        📥 Download
                    </a>
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

// ⏱️ FUNÇÃO PARA POPULAR A TIMELINE
function populateTimeline(request) {
    const timeline = document.getElementById('modalTimeline');
    if (!timeline) return;
    
    let timelineItems = [];
    
    // Criação da solicitação
    timelineItems.push({
        timestamp: request.d || Date.now(),
        title: 'Solicitação Criada',
        description: `Solicitação de ${getServiceName(request.s, request.ts)} foi criada por ${request.c || 'Usuário'}`,
        type: 'created'
    });
    
    // Comentários (verificar se existem)
    if (request.admin?.comments && Array.isArray(request.admin.comments)) {
        request.admin.comments.forEach(comment => {
            timelineItems.push({
                timestamp: comment.timestamp || Date.now(),
                title: 'Comentário Adicionado',
                description: `${comment.autor || 'Administrador'}: ${comment.texto}`,
                type: 'comment'
            });
        });
    }
    
    // Mudanças de status
    if (request.admin?.status && request.admin.status !== 'pendente') {
        timelineItems.push({
            timestamp: request.admin.ultimaAtualizacao || request.d || Date.now(),
            title: 'Status Atualizado',
            description: `Status alterado para: ${getStatusText(request.admin.status)}`,
            type: 'status'
        });
    }
    
    // Mudanças de prioridade
    if (request.admin?.priority) {
        timelineItems.push({
            timestamp: request.admin.ultimaAtualizacao || request.d || Date.now(),
            title: 'Prioridade Definida',
            description: `Prioridade definida como: ${getPriorityText(request.admin.priority)}`,
            type: 'priority'
        });
    }
    
    // Ordenar por timestamp
    timelineItems.sort((a, b) => a.timestamp - b.timestamp);
    
    // Se não há itens, mostrar mensagem
    if (timelineItems.length === 0) {
        timeline.innerHTML = `
            <div class="timeline-empty">
                <div class="timeline-empty-icon">📋</div>
                <div class="timeline-empty-text">Nenhum evento registrado ainda</div>
            </div>
        `;
        return;
    }
    
    timeline.innerHTML = timelineItems.map(item => {
        const icon = item.type === 'created' ? '📋' : 
                    item.type === 'comment' ? '💬' : 
                    item.type === 'status' ? '🔄' : 
                    item.type === 'priority' ? '🎯' : '📝';
        
        return `
            <div class="timeline-item">
                <div class="timeline-marker">${icon}</div>
                <div class="timeline-content">
                    <div class="timeline-title">${item.title}</div>
                    <div class="timeline-description">${item.description}</div>
                    <div class="timeline-time">${formatDate(item.timestamp)}</div>
                </div>
            </div>
        `;
    }).join('');
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
    const priority = request.admin?.priority || 'media';
    
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
    
    // Card de Prioridade com visual melhorado
    actionCards += `
        <div class="action-card">
            <div class="card-title">🎯 Prioridade</div>
            <div class="priority-current">
                <span class="priority-label">Atual:</span>
                <span class="priority-badge priority-${priority}">${getPriorityText(priority)}</span>
            </div>
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
    
    comments.innerHTML = requestComments.map(comment => `
        <div class="comment-item">
            <div class="comment-header">
                <div class="comment-author">${comment.autor || 'Administrador'}</div>
                <div class="comment-date">${formatDate(comment.timestamp || Date.now())}</div>
            </div>
            <div class="comment-content">${comment.texto || comment.text || ''}</div>
        </div>
    `).join('');
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
        LoadingManager.show('Adicionando comentário...');

        const success = await firebaseService.addComment(currentRequestId, {
            texto: comment,
            autor: 'Administrador',
            timestamp: Date.now()
        });

        if (success) {
            ToastManager.show('Comentário adicionado com sucesso!', 'success');
            document.getElementById('newComment').value = '';
            // Recarregar comentários na aba
            const request = await firebaseService.getRequestById(currentRequestId);
            if (request) {
                populateComments(request);
            }
        }

        LoadingManager.hide();
    } catch (error) {
        LoadingManager.hide();
        ToastManager.show('Erro ao adicionar comentário', 'error');
    }
}

// 🔄 FUNÇÕES DE INTERAÇÃO
async function updateStatus(requestId, newStatus) {
    if (newStatus) {
        await DashboardManager.updateStatus(requestId, newStatus);
    }
}

async function setPriority(requestId, priority) {
    if (priority) {
        await DashboardManager.setPriority(requestId, priority);
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
}

console.log('📋 Admin Dashboard - Funções do dashboard carregadas');
