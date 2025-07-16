/* 🔧 SENAI Lab Admin - Sistema de Interface
 * Arquivo: public/assets/js/admin/ui.js
 * Descrição: Classes utilitárias para interface, autenticação e gerenciamento de dados
 */

// 🔒 SISTEMA DE AUTENTICAÇÃO
class AdminAuth {
    static isAuthenticated() {
        const session = localStorage.getItem(ADMIN_CONFIG.sessionKey);
        if (!session) return false;

        try {
            const data = JSON.parse(session);
            const now = Date.now();

            if (now > data.expires) {
                this.logout();
                return false;
            }

            return true;
        } catch {
            this.logout();
            return false;
        }
    }

    static login(password) {
        if (password === ADMIN_CONFIG.password) {
            const session = {
                timestamp: Date.now(),
                expires: Date.now() + ADMIN_CONFIG.sessionDuration
            };

            localStorage.setItem(ADMIN_CONFIG.sessionKey, JSON.stringify(session));
            return true;
        }
        return false;
    }

    static logout() {
        localStorage.removeItem(ADMIN_CONFIG.sessionKey);
    }
}

// 🎨 SISTEMA DE TOAST NOTIFICATIONS
class ToastManager {
    static show(message, type = 'info', duration = 4000) {
        const toastContainer = document.getElementById('toastContainer');

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };

        toast.innerHTML = `
          <span class="toast-icon">${icons[type] || icons.info}</span>
          <span class="toast-message">${message}</span>
          <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
        `;

        toastContainer.appendChild(toast);

        // Animar entrada
        setTimeout(() => toast.classList.add('show'), 100);

        // Remover automaticamente
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }
}

// 🔄 SISTEMA DE LOADING
class LoadingManager {
    static show(message = 'Carregando...') {
        const overlay = document.getElementById('loadingOverlay');
        const messageEl = document.getElementById('loadingMessage');
        messageEl.textContent = message;
        overlay.style.display = 'flex';
    }

    static hide() {
        const overlay = document.getElementById('loadingOverlay');
        overlay.style.display = 'none';
    }
}

// 📊 SISTEMA DE DADOS AVANÇADO
class DashboardManager {
    static async loadStats() {
        try {
            const requests = await firebaseService.getAllRequests();
            currentRequests = requests;

            const stats = {
                total: requests.length,
                pending: requests.filter(r => !r.admin?.status || r.admin.status === 'pendente').length,
                inProgress: requests.filter(r => r.admin?.status === 'em_andamento').length,
                completed: requests.filter(r => r.admin?.status === 'concluido').length,
                cancelled: requests.filter(r => r.admin?.status === 'cancelado').length,
                today: requests.filter(r => {
                    const today = new Date();
                    const requestDate = new Date(r.d);
                    return requestDate.toDateString() === today.toDateString();
                }).length
            };

            return { stats, requests };
        } catch (error) {
            console.error('❌ Erro ao carregar dados:', error);
            ToastManager.show('Erro ao carregar dados: ' + error.message, 'error');
            return { stats: {}, requests: [] };
        }
    }

    static async updateStatus(requestId, newStatus, comment = '') {
        try {
            LoadingManager.show('Atualizando status...');

            const success = await firebaseService.updateRequestStatus(requestId, newStatus, {
                comment: comment,
                responsavel: 'Administrador'
            });

            if (success) {
                ToastManager.show(`Status atualizado para: ${this.getStatusName(newStatus)}`, 'success');
                await loadDashboard();
            }

            LoadingManager.hide();
            return success;
        } catch (error) {
            LoadingManager.hide();
            ToastManager.show('Erro ao atualizar status', 'error');
            return false;
        }
    }

    static async setPriority(requestId, priority) {
        try {
            const success = await firebaseService.setPriority(requestId, priority);
            if (success) {
                ToastManager.show(`Prioridade definida: ${priority.toUpperCase()}`, 'success');
                await loadDashboard();
            }
            return success;
        } catch (error) {
            ToastManager.show('Erro ao definir prioridade', 'error');
            return false;
        }
    }

    static getStatusName(status) {
        const names = {
            'pendente': 'Pendente',
            'em_andamento': 'Em Andamento',
            'concluido': 'Concluído',
            'cancelado': 'Cancelado'
        };
        return names[status] || status;
    }
}

// Expor classes no escopo global
window.AdminAuth = AdminAuth;
window.ToastManager = ToastManager;
window.LoadingManager = LoadingManager;
window.DashboardManager = DashboardManager;

console.log('🔧 Admin UI - Classes de interface carregadas');
