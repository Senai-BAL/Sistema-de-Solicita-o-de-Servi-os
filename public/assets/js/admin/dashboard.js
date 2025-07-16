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
        container.innerHTML = '<div class="loading"><p>Nenhuma solicitação encontrada</p></div>';
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
            card.addEventListener('dragstart', handleDragStart);
            card.addEventListener('dragend', handleDragEnd);

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

function addComment(requestId) {
    currentRequestId = requestId;
    openModal('commentModal');
    document.getElementById('commentText').focus();
}

async function submitComment() {
    const comment = document.getElementById('commentText').value.trim();
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
            document.getElementById('commentText').value = '';
            closeModal('commentModal');
            await loadDashboard();
        }

        LoadingManager.hide();
    } catch (error) {
        LoadingManager.hide();
        ToastManager.show('Erro ao adicionar comentário', 'error');
    }
}

function viewDetails(requestId) {
    const request = currentRequests.find(r => r.id === requestId);
    if (!request) return;

    const modal = document.getElementById('detailsModal');
    const content = document.getElementById('detailsContent');

    content.innerHTML = `
        <h3 style="color: #1e3c72; margin-bottom: 20px;">
            ${getServiceName(request.s, request.ts)} - ${request.c}
        </h3>
        
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <h4>📋 Informações Básicas</h4>
            <p><strong>Colaborador:</strong> ${request.c}</p>
            <p><strong>Email:</strong> ${request.e}</p>
            <p><strong>WhatsApp:</strong> ${request.w || 'N/A'}</p>
            <p><strong>Data:</strong> ${formatDate(request.d)}</p>
            <p><strong>Status:</strong> ${getStatusBadge(request.admin?.status || 'pendente')}</p>
            ${request.admin?.prioridade ? `<p><strong>Prioridade:</strong> <span class="priority-${request.admin.prioridade}">${request.admin.prioridade.toUpperCase()}</span></p>` : ''}
        </div>

        <div style="background: #f0f8ff; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <h4>📝 Detalhes da Solicitação</h4>
            ${formatRequestDetails(request)}
        </div>

        ${request.arq && request.arq.length > 0 ? `
            <div style="background: #f0fff0; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <h4>📎 Arquivos Anexos</h4>
                ${request.arq.map(arquivo => `
                    <div style="margin: 10px 0; padding: 10px; background: white; border-radius: 4px; border: 1px solid #ddd;">
                        <a href="${arquivo.u}" target="_blank" style="text-decoration: none; color: #1976d2; font-weight: bold;">
                            📄 ${arquivo.n}
                        </a>
                        <p style="font-size: 0.8rem; color: #666; margin: 5px 0 0 0;">
                            Tamanho: ${(arquivo.s / 1024).toFixed(1)} KB | Tipo: ${arquivo.t}
                        </p>
                    </div>
                `).join('')}
            </div>
        ` : ''}

        ${request.admin?.comentarios && request.admin.comentarios.length > 0 ? `
            <div style="background: #fff8e1; padding: 15px; border-radius: 8px;">
                <h4>💬 Comentários Administrativos</h4>
                ${request.admin.comentarios.map(comment => `
                    <div style="background: white; padding: 12px; margin: 10px 0; border-radius: 4px; border-left: 4px solid #2196f3;">
                        <div style="font-size: 0.9rem; color: #555; margin-bottom: 8px;">
                            <strong>${comment.autor}</strong> - ${formatDate(comment.timestamp)}
                        </div>
                        <div style="color: #333;">${comment.texto}</div>
                    </div>
                `).join('')}
            </div>
        ` : ''}
    `;

    openModal('detailsModal');
}

function formatRequestDetails(request) {
    // Esta função será expandida no arquivo utils.js
    return '<p>Detalhes da solicitação...</p>';
}

console.log('📋 Admin Dashboard - Funções do dashboard carregadas');
