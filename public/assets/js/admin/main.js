/* 🔧 SENAI Lab Admin - Carregador Principal
 * Arquivo: public/assets/js/admin/main.js
 * Descrição: Carregamento principal, event listeners e inicialização do dashboard
 */

// 🔄 INICIALIZAÇÃO DE MANAGERS
function initializeManagers() {
    // Verificar se os managers estão disponíveis
    if (typeof LoadingManager !== 'undefined') {
        LoadingManager.init();
    } else {
        console.warn('⚠️ LoadingManager não encontrado');
    }
    
    if (typeof ToastManager !== 'undefined') {
        ToastManager.init();
    } else {
        console.warn('⚠️ ToastManager não encontrado');
    }
}

// 🍞 HELPER PARA TOASTS COM VERIFICAÇÃO
function showToast(message, type = 'info', duration = 3000) {
    if (typeof ToastManager !== 'undefined') {
        ToastManager.show(message, type, duration);
    } else {
        console.log(`[${type.toUpperCase()}] ${message}`);
    }
}

// 🔄 INICIALIZAÇÃO DE VARIÁVEIS GLOBAIS
function initializeGlobalVariables() {
    window.firebaseService = window.firebaseService || null;
    window.currentRequests = window.currentRequests || [];
    window.filteredRequests = window.filteredRequests || [];
    window.currentViewMode = window.currentViewMode || 'list';
}

// 🔄 CARREGAMENTO DO DASHBOARD
async function loadDashboard() {
    try {
        // Verificar se os managers estão disponíveis
        if (typeof LoadingManager === 'undefined') {
            console.warn('⚠️ LoadingManager não disponível, carregando sem overlay');
        } else {
            LoadingManager.show('Carregando dados do dashboard...');
        }

        const { stats, requests } = await DashboardManager.loadStats();

        // Atualizar variáveis globais
        currentRequests = requests;
        window.currentRequests = requests;

        updateStatsDisplay(stats);

        filteredRequests = applyFilters(requests);
        window.filteredRequests = filteredRequests;

        if (currentViewMode === 'list') {
            await renderRequestsList(filteredRequests);
        } else {
            renderKanbanBoard(filteredRequests);
        }

        LoadingManager.hide();
        showToast(`Dashboard atualizado! ${filteredRequests.length} solicitações carregadas.`, 'success');

        // ✨ INICIALIZAR SISTEMA DE BACKUP COMPLETO (apenas uma vez)
        setTimeout(() => {
            initializeCompleteBackupSystem();
        }, 1000);

    } catch (error) {
        if (typeof LoadingManager !== 'undefined') {
            LoadingManager.hide();
        }
        console.error('❌ Erro ao carregar dashboard:', error);
        showToast('Erro ao carregar dashboard', 'error');
    }
}

// � FUNÇÃO PARA ATUALIZAR DISPLAY DE ESTATÍSTICAS
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

// �🎛️ INTEGRAÇÃO COM O DASHBOARD (Backup)
function addCompleteBackupButton() {
    const exportControls = document.querySelector('.export-controls');
    if (!exportControls || document.getElementById('completeBackupBtn')) return;

    const backupBtn = document.createElement('button');
    backupBtn.id = 'completeBackupBtn';
    backupBtn.className = 'btn backup';
    backupBtn.innerHTML = '🗂️ Backup Completo + Limpar';
    backupBtn.onclick = performCompleteBackup;

    exportControls.appendChild(backupBtn);
}

// 🚀 EXECUTAR BACKUP COMPLETO
async function performCompleteBackup() {
    if (confirm('⚠️ ATENÇÃO: Esta ação fará backup completo e APAGARÁ todos os dados. Tem certeza?')) {
        const backupManager = new CompleteBackupManager(firebaseService);
        await backupManager.createCompleteBackup();
    }
}

// 🔧 INICIALIZAR SISTEMA
function initializeCompleteBackupSystem() {
    addCompleteBackupButton();
    console.log('🗂️ Sistema de Backup Completo + Limpeza ativo!');
}

// 🔐 SISTEMA DE LOGIN/LOGOUT
document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;
    const loginBtn = document.getElementById('loginBtn');
    const loginText = document.getElementById('loginText');
    const loginLoading = document.getElementById('loginLoading');
    const errorDiv = document.getElementById('loginError');

    // UI de loading
    loginBtn.disabled = true;
    loginText.style.display = 'none';
    loginLoading.style.display = 'inline';
    errorDiv.style.display = 'none';

    // Simular delay de verificação
    setTimeout(async () => {
        try {
            const success = await AdminAuth.login(username, password);
            
            if (success) {
                const currentUser = AdminAuth.getCurrentUser();
                showToast(`${currentUser.avatar} Bem-vindo, ${currentUser.name}!`, 'success');
                showDashboard();
            }
        } catch (error) {
            errorDiv.textContent = `❌ ${error.message}`;
            errorDiv.style.display = 'block';

            // Reset do formulário
            loginBtn.disabled = false;
            loginText.style.display = 'inline';
            loginLoading.style.display = 'none';
            document.getElementById('adminPassword').value = '';
            
            // Se o erro for de usuário não encontrado, focar no campo username
            if (error.message && error.message.includes('Usuário')) {
                document.getElementById('adminUsername').focus();
            } else {
                document.getElementById('adminPassword').focus();
            }
        }
    }, 1000);
});

// 🔐 SISTEMA DE LOGIN/LOGOUT
function showDashboard() {
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('dashboard').classList.add('show');

    // ✨ ATUALIZAR INFO DO USUÁRIO NO NAVBAR
    updateUserNavbar();

    // ✨ INICIALIZAR NOTIFICAÇÕES
    if (!dashboardNotifications) {
        dashboardNotifications = new DashboardWithNotifications();
    }
    dashboardNotifications.onAdminLogin();

    loadDashboard();
}

// 👤 ATUALIZAR NAVBAR COM INFO DO USUÁRIO
function updateUserNavbar() {
    const currentUser = AdminAuth.getCurrentUser();
    if (currentUser) {
        document.getElementById('userAvatar').textContent = currentUser.avatar;
        document.getElementById('userName').textContent = currentUser.name;
        document.getElementById('userRole').textContent = `@${currentUser.username}`;
    }
}

function logout() {
    if (confirm('Tem certeza que deseja sair?')) {
        // ✨ PARAR NOTIFICAÇÕES
        if (dashboardNotifications) {
            dashboardNotifications.onAdminLogout();
        }

        AdminAuth.logout();
        showToast('Logout realizado com sucesso!', 'success');
        showLogin();
    }
}

function showLogin() {
    document.getElementById('loginContainer').style.display = 'flex';
    document.getElementById('dashboard').classList.remove('show');
    document.getElementById('adminUsername').value = '';
    document.getElementById('adminPassword').value = '';
    document.getElementById('adminUsername').focus();
}

// 📱 EVENT LISTENERS - FORMULÁRIO DE LOGIN
document.getElementById('filterService').addEventListener('change', loadDashboard);
document.getElementById('filterStatus').addEventListener('change', loadDashboard);
document.getElementById('filterPriority').addEventListener('change', loadDashboard);
document.getElementById('filterPeriod').addEventListener('change', loadDashboard);

// Fechar modal clicando fora
window.addEventListener('click', function (e) {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
});

// 🎯 DRAG AND DROP HANDLERS
function handleDragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.dataset.requestId);
    e.target.classList.add('dragging');
}

// ⚡ INICIALIZAÇÃO
document.addEventListener('DOMContentLoaded', function () {
    console.log('🔧 SENAI Lab - Dashboard Administrativo v2.6.0 Sistema Multiusuário Iniciado');

    // ✨ Inicializar managers primeiro
    initializeManagers();
    
    // Inicializar variáveis globais
    initializeGlobalVariables();

    // Inicializar Firebase Service
    try {
        firebaseService = new FirebaseService();
        console.log('✅ Firebase Service inicializado');
    } catch (error) {
        console.error('❌ Erro ao inicializar Firebase:', error);
        if (typeof ToastManager !== 'undefined') {
            ToastManager.show('Erro ao conectar com Firebase', 'error');
        }
        return;
    }

    // Verificar se já está autenticado
    if (AdminAuth.isAuthenticated()) {
        showDashboard();
    } else {
        showLogin();
    }

    // Auto-refresh a cada 1 minuto se estiver autenticado
    setInterval(() => {
        if (AdminAuth.isAuthenticated() && document.getElementById('dashboard').classList.contains('show')) {
            loadDashboard();
        }
    }, 60000);

    // Atualização imediata ao carregar
    if (AdminAuth.isAuthenticated()) {
        loadDashboard();
    }

    // Mostrar toast de boas-vindas
    setTimeout(() => {
        if (AdminAuth.isAuthenticated()) {
            ToastManager.show('Dashboard v2.0 com Backup Completo carregado! 🚀', 'success');
        }
    }, 1000);
});

console.log(`
🗂️ SENAI Lab - Dashboard com Sistema de Backup Completo + Limpeza

🆕 NOVIDADES - SISTEMA DE BACKUP COMPLETO:
    ✅ Backup completo Firestore + GitHub
    ✅ Download de TODOS os arquivos
    ✅ Múltiplos formatos (JSON, CSV, TXT)
    ✅ Limpeza total automática
    ✅ Sistema 100% gratuito mantido
    ✅ Notificações desktop nativas
    ✅ Monitoramento em tempo real
    ✅ Exportação PDF HABILITADA! 📋

🔔 Recursos mantidos:
    ✅ Toast notifications elegantes
    ✅ Modal de detalhes completos
    ✅ Busca por texto em tempo real
    ✅ Vista Kanban com drag & drop
    ✅ Sistema de prioridades
    ✅ Exportação para Excel
    ✅ Interface responsiva
    ✅ Comentários expandidos

🚀 Fluxo do Backup Completo:
    1. Coleta dados Firestore
    2. Baixa TODOS os arquivos GitHub
    3. Gera backup completo
    4. Apaga TUDO do Firestore
    5. Apaga TUDO do GitHub
    6. Sistema volta ao estado inicial

💰 RESULTADO: CUSTO ZERO PERMANENTE

⚠️  SISTEMA MULTIUSUÁRIO ATIVO:
    ✅ 5 usuários configurados
    ✅ Auditoria completa habilitada
    ✅ Controle de acesso por usuário
    
🎉 NOVO: Sistema de usuários admins + Botão "🗂️ Backup Completo + Limpar" disponível!
`);

// Inicializar variáveis globais
initializeGlobalVariables();

// 🔄 FUNÇÃO DE ATUALIZAÇÃO MANUAL
async function refreshDashboard() {
    const refreshBtn = document.querySelector('.btn-refresh');
    
    if (!refreshBtn) return;
    
    try {
        // Adicionar classe de loading
        refreshBtn.classList.add('updating');
        refreshBtn.disabled = true;
        refreshBtn.textContent = '⏳ Atualizando...';
        
        // Mostrar loading manager
        LoadingManager.show('Atualizando dados...');
        
        // Aguardar um pouco para UX
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Carregar dashboard
        await loadDashboard();
        
        // Esconder loading
        LoadingManager.hide();
        
        // Mostrar toast de sucesso
        ToastManager.show('Dados atualizados com sucesso! 🔄', 'success');
        
    } catch (error) {
        console.error('❌ Erro ao atualizar dashboard:', error);
        LoadingManager.hide();
        ToastManager.show('Erro ao atualizar dados', 'error');
    } finally {
        // Restaurar botão
        refreshBtn.classList.remove('updating');
        refreshBtn.disabled = false;
        refreshBtn.textContent = '🔄 Atualizar';
    }
}

// Tornar função global
window.refreshDashboard = refreshDashboard;

console.log('🚀 Admin Main - Sistema principal carregado');
