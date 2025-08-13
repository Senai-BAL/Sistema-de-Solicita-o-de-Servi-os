/* 🔧 SENAI Lab Admin - Filtros e Busca
 * Arquivo: public/assets/js/admin/filters.js
 * Descrição: Sistema de filtros, busca e controles de visualização
 */

// 🔍 SISTEMA DE BUSCA E FILTROS
function applySearchFilter() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();

    if (!searchTerm) {
        filteredRequests = applyFilters(currentRequests);
    } else {
        filteredRequests = currentRequests.filter(request => {
            const searchableText = [
                request.c,
                request.e,
                request.w,
                getServiceName(request.s, request.ts),
                JSON.stringify(request.dados)
            ].join(' ').toLowerCase();

            return searchableText.includes(searchTerm);
        });

        filteredRequests = applyFilters(filteredRequests);
    }

    if (currentViewMode === 'list') {
        renderRequestsList(filteredRequests);
    } else {
        renderKanbanBoard(filteredRequests);
    }
}

function applyFilters(requests) {
    const serviceFilter = document.getElementById('filterService').value;
    const statusFilter = document.getElementById('filterStatus').value;
    const priorityFilter = document.getElementById('filterPriority').value;
    const periodFilter = document.getElementById('filterPeriod').value;

    let filtered = requests;

    // Filtro por serviço
    if (serviceFilter) {
        filtered = filtered.filter(r => r.s === serviceFilter);
    }

    // Filtro por status
    if (statusFilter) {
        filtered = filtered.filter(r => {
            const status = r.admin?.status || 'pendente';
            return status === statusFilter;
        });
    }

    // Filtro por prioridade
    if (priorityFilter) {
        filtered = filtered.filter(r => r.admin?.prioridade === priorityFilter);
    }

    // Filtro por período
    if (periodFilter !== 'todos') {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfWeek = new Date(startOfDay);
        startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay());
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        filtered = filtered.filter(r => {
            const requestDate = new Date(r.d);

            switch (periodFilter) {
                case 'hoje':
                    return requestDate >= startOfDay;
                case 'semana':
                    return requestDate >= startOfWeek;
                case 'mes':
                    return requestDate >= startOfMonth;
                default:
                    return true;
            }
        });
    }

    return filtered.sort((a, b) => b.d - a.d); // Ordenar por data (mais recente primeiro)
}

// 🎯 CONTROLES DE VISUALIZAÇÃO
function toggleViewMode() {
    const listView = document.getElementById('listView');
    const kanbanView = document.getElementById('kanbanView');
    const viewModeBtn = document.getElementById('viewModeBtn');

    if (currentViewMode === 'list') {
        currentViewMode = 'kanban';
        listView.style.display = 'none';
        kanbanView.style.display = 'block';
        viewModeBtn.innerHTML = '📋 Alternar para Lista';
        renderKanbanBoard(filteredRequests);
    } else {
        currentViewMode = 'list';
        listView.style.display = 'block';
        kanbanView.style.display = 'none';
        viewModeBtn.innerHTML = '📋 Alternar para Kanban';
        renderRequestsList(filteredRequests);
    }
}

function filterByStatus(status) {
    document.getElementById('filterStatus').value = status;
    loadDashboard();
}

// 🎛️ MODAIS
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
}


