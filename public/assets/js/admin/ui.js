/* 🔧 SENAI Lab Admin - Sistema de Interface
 * Arquivo: public/assets/js/admin/ui.js
 * Descrição: Classes utilitárias para interface e gerenciamento de dados
 */

// 📊 SISTEMA DE DADOS AVANÇADO
class DashboardManager {
    // Exclusão definitiva de solicitação (Firestore + Storage)
    static async deleteRequest(requestId) {
        try {
            LoadingManager.show('Excluindo solicitação e arquivos...');
            
            // Excluir do Firestore (agora inclui exclusão do Storage)
            const result = await firebaseService.deleteRequest(requestId);
            
            LoadingManager.hide();
            
            if (result.success) {
                // Mostrar feedback detalhado sobre arquivos deletados
                if (result.totalFiles > 0) {
                    const message = result.filesDeleted === result.totalFiles 
                        ? `✅ Solicitação e todos os ${result.totalFiles} arquivos excluídos!`
                        : `⚠️ Solicitação excluída, mas apenas ${result.filesDeleted}/${result.totalFiles} arquivos foram removidos.`;
                    
                    ToastManager.show(message, result.filesDeleted === result.totalFiles ? 'success' : 'warning');
                } else {
                    ToastManager.show('✅ Solicitação excluída (sem arquivos anexados).', 'success');
                }
                
                return true;
            } else {
                throw new Error('Falha na exclusão');
            }
        } catch (error) {
            LoadingManager.hide();
            console.error('❌ Erro na exclusão:', error);
            throw error;
        }
    }
    static async loadStats() {
        try {
            // 🔐 Registrar ação do usuário
            AdminAuth.logUserAction('loadStats', { description: 'Carregamento de dados do dashboard' });
            
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

            // 🔐 Obter usuário atual
            const currentUser = AdminAuth.getCurrentUser();
            const responsavel = currentUser ? `${currentUser.name} (@${currentUser.username})` : 'Administrador';

            // 🔐 Registrar ação do usuário
            AdminAuth.logUserAction('updateStatus', { 
                description: `Alterou status para: ${newStatus}`, 
                requestId, 
                newStatus, 
                comment 
            });

            const success = await firebaseService.updateRequestStatus(requestId, newStatus, {
                comment: comment,
                responsavel: responsavel
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
            // 🔐 Registrar ação do usuário
            AdminAuth.logUserAction('setPriority', { description: `Definiu prioridade: ${priority}`, requestId, priority });
            
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
