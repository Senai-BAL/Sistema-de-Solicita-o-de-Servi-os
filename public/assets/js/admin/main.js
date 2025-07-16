/* 🔧 SENAI Lab Admin - Carregador Principal
 * Arquivo: public/assets/js/admin/main.js
 * Descrição: Carregamento principal, event listeners e inicialização do dashboard
 */

// � INICIALIZAÇÃO DE VARIÁVEIS GLOBAIS
function initializeGlobalVariables() {
    window.firebaseService = window.firebaseService || null;
    window.currentRequests = window.currentRequests || [];
    window.filteredRequests = window.filteredRequests || [];
    window.currentViewMode = window.currentViewMode || 'list';
}

// �🔄 CARREGAMENTO DO DASHBOARD
async function loadDashboard() {
    try {
        LoadingManager.show('Carregando dados do dashboard...');

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
        ToastManager.show(`Dashboard atualizado! ${filteredRequests.length} solicitações carregadas.`, 'success');

        // ✨ INICIALIZAR SISTEMA DE BACKUP COMPLETO (apenas uma vez)
        setTimeout(() => {
            initializeCompleteBackupSystem();
        }, 1000);

    } catch (error) {
        LoadingManager.hide();
        console.error('❌ Erro ao carregar dashboard:', error);
        ToastManager.show('Erro ao carregar dashboard', 'error');
    }
}

// 🎛️ INTEGRAÇÃO COM O DASHBOARD (Backup)
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
    setTimeout(() => {
        if (AdminAuth.login(password)) {
            ToastManager.show('Login realizado com sucesso!', 'success');
            showDashboard();
        } else {
            errorDiv.textContent = '❌ Senha incorreta. Tente novamente.';
            errorDiv.style.display = 'block';

            // Reset do formulário
            loginBtn.disabled = false;
            loginText.style.display = 'inline';
            loginLoading.style.display = 'none';
            document.getElementById('adminPassword').value = '';
            document.getElementById('adminPassword').focus();
        }
    }, 1000);
});

// 📱 EVENT LISTENERS
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
    console.log('🔧 SENAI Lab - Dashboard Administrativo v2.0 com Backup Completo Iniciado');

    // Inicializar Firebase Service
    try {
        firebaseService = new FirebaseService();
        console.log('✅ Firebase Service inicializado');
    } catch (error) {
        console.error('❌ Erro ao inicializar Firebase:', error);
        ToastManager.show('Erro ao conectar com Firebase', 'error');
        return;
    }

    // Verificar se já está autenticado
    if (AdminAuth.isAuthenticated()) {
        showDashboard();
    } else {
        showLogin();
    }

    // Auto-refresh a cada 30 segundos se estiver autenticado
    setInterval(() => {
        if (AdminAuth.isAuthenticated() && document.getElementById('dashboard').classList.contains('show')) {
            loadDashboard();
        }
    }, 30000);

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

⚠️  CONFIGURAÇÃO DE SEGURANÇA:
    Altere a senha em ADMIN_CONFIG.password
    Senha atual: "${ADMIN_CONFIG.password}"
    
🎉 NOVO: Botão "🗂️ Backup Completo + Limpar" disponível!
`);

// Inicializar variáveis globais
initializeGlobalVariables();

console.log('🚀 Admin Main - Sistema principal carregado');
