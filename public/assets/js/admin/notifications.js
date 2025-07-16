/* 🔧 SENAI Lab Admin - Sistema de Notificações
 * Arquivo: public/assets/js/admin/notifications.js
 * Descrição: Sistema completo de notificações em tempo real para o dashboard
 */

// 🔔 SISTEMA DE NOTIFICAÇÕES EM TEMPO REAL
class NotificationManager {
    constructor() {
        this.hasPermission = false;
        this.lastKnownRequestsCount = 0;
        this.unsubscribeListener = null;
        this.isListening = false;
        this.seenRequestIds = new Set();

        this.init();
    }

    // 🔧 INICIALIZAÇÃO
    async init() {
        await this.requestPermission();
        this.loadSeenRequests();
    }

    // 🔐 SOLICITAR PERMISSÃO PARA NOTIFICAÇÕES
    async requestPermission() {
        try {
            if ('Notification' in window) {
                const permission = await Notification.requestPermission();
                this.hasPermission = permission === 'granted';

                if (this.hasPermission) {
                    console.log('✅ Permissão para notificações concedida');
                    ToastManager.show('Notificações ativadas! Você será avisado sobre novas solicitações.', 'success');
                } else {
                    console.log('❌ Permissão para notificações negada');
                    ToastManager.show('Permissão para notificações negada. Ative nas configurações do navegador.', 'warning');
                }
            } else {
                console.log('❌ Navegador não suporta notificações');
                ToastManager.show('Seu navegador não suporta notificações desktop.', 'warning');
            }
        } catch (error) {
            console.error('❌ Erro ao solicitar permissão:', error);
        }

        return this.hasPermission;
    }

    // 💾 GERENCIAR SOLICITAÇÕES JÁ VISTAS
    loadSeenRequests() {
        try {
            const seen = localStorage.getItem('senai_seen_requests');
            if (seen) {
                this.seenRequestIds = new Set(JSON.parse(seen));
            }
        } catch (error) {
            console.warn('Erro ao carregar solicitações vistas:', error);
        }
    }

    saveSeenRequests() {
        try {
            localStorage.setItem('senai_seen_requests', JSON.stringify([...this.seenRequestIds]));
        } catch (error) {
            console.warn('Erro ao salvar solicitações vistas:', error);
        }
    }

    markAsSeen(requestId) {
        this.seenRequestIds.add(requestId);
        this.saveSeenRequests();
    }

    // 🔄 INICIAR MONITORAMENTO EM TEMPO REAL
    startListening() {
        if (this.isListening || !this.hasPermission || !firebaseService) {
            return;
        }

        console.log('🔔 Iniciando monitoramento de notificações...');
        this.isListening = true;

        try {
            // Listener em tempo real do Firestore
            this.unsubscribeListener = firebaseService.onRequestsChange((requests) => {
                this.checkForNewRequests(requests);
            });

            ToastManager.show('Monitor de notificações ativo! 🔔', 'info');
        } catch (error) {
            console.error('❌ Erro ao iniciar listener:', error);
            this.isListening = false;
        }
    }

    // 🛑 PARAR MONITORAMENTO
    stopListening() {
        if (this.unsubscribeListener) {
            this.unsubscribeListener();
            this.unsubscribeListener = null;
        }
        this.isListening = false;
        console.log('🔔 Monitoramento de notificações parado');
    }

    // 🔍 VERIFICAR NOVAS SOLICITAÇÕES
    checkForNewRequests(requests) {
        if (!Array.isArray(requests)) return;

        // Primeira execução - marcar todas como vistas para não spammar
        if (this.lastKnownRequestsCount === 0) {
            this.lastKnownRequestsCount = requests.length;
            requests.forEach(request => this.markAsSeen(request.id));
            return;
        }

        // Verificar se há novas solicitações
        const newRequests = requests.filter(request => {
            // Considerar nova se:
            // 1. Não foi vista antes E
            // 2. Foi criada recentemente (últimos 5 minutos)
            const isNotSeen = !this.seenRequestIds.has(request.id);
            const isRecent = Date.now() - request.d < 5 * 60 * 1000; // 5 minutos

            return isNotSeen && isRecent;
        });

        // Mostrar notificações para novas solicitações
        newRequests.forEach(request => {
            this.showNotification(request);
            this.markAsSeen(request.id);
        });

        // Atualizar contador
        this.lastKnownRequestsCount = requests.length;
    }

    // 🔔 MOSTRAR NOTIFICAÇÃO
    showNotification(request) {
        if (!this.hasPermission) return;

        try {
            const serviceName = this.getServiceName(request.s, request.ts);
            const title = `🔧 Nova Solicitação SENAI Lab`;
            const body = `${serviceName} - ${request.c}\n📧 ${request.e}`;

            const notification = new Notification(title, {
                body: body,
                icon: this.getNotificationIcon(request.s),
                badge: '/favicon.ico',
                tag: `senai-request-${request.id}`, // Evita duplicatas
                requireInteraction: true, // Não some automaticamente
                data: {
                    requestId: request.id,
                    url: window.location.href
                }
            });

            // Eventos da notificação
            notification.onclick = () => {
                // Focar na aba e mostrar detalhes da solicitação
                window.focus();
                setTimeout(() => {
                    viewDetails(request.id);
                }, 500);
                notification.close();
            };

            notification.onerror = (error) => {
                console.error('❌ Erro na notificação:', error);
            };

            // Auto-close após 10 segundos se não interagir
            setTimeout(() => {
                notification.close();
            }, 10000);

            // Log para debug
            console.log(`🔔 Notificação enviada: ${serviceName} - ${request.c}`);

            // Toast interno também
            ToastManager.show(`Nova solicitação: ${serviceName} - ${request.c}`, 'info', 6000);

        } catch (error) {
            console.error('❌ Erro ao mostrar notificação:', error);
        }
    }

    // 🎨 ÍCONE DA NOTIFICAÇÃO BASEADO NO SERVIÇO
    getNotificationIcon(serviceType) {
        // Retorna data URL de ícones simples ou emoji como fallback
        const icons = {
            'espaco_maker': 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🏗️</text></svg>',
            'servicos': 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🖨️</text></svg>',
            'emprestimo': 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">📦</text></svg>'
        };

        return icons[serviceType] || 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🔧</text></svg>';
    }

    // 🏷️ NOME DO SERVIÇO
    getServiceName(service, subService) {
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

    // 📊 STATUS DAS NOTIFICAÇÕES
    getStatus() {
        return {
            hasPermission: this.hasPermission,
            isListening: this.isListening,
            seenCount: this.seenRequestIds.size,
            lastCount: this.lastKnownRequestsCount
        };
    }

    // 🧹 LIMPAR DADOS
    clearSeenRequests() {
        this.seenRequestIds.clear();
        this.saveSeenRequests();
        ToastManager.show('Histórico de notificações limpo', 'info');
    }

    // 🔄 REINICIAR SISTEMA
    restart() {
        this.stopListening();
        this.clearSeenRequests();
        setTimeout(() => {
            this.startListening();
        }, 1000);
    }
}

// 🌟 INTEGRAÇÃO COM O DASHBOARD
class DashboardWithNotifications {
    constructor() {
        this.notificationManager = new NotificationManager();
    }

    // 🔐 INICIAR QUANDO ADMIN FIZER LOGIN
    async onAdminLogin() {
        console.log('🔔 Admin logado - ativando notificações...');

        // Aguardar um pouco para garantir que o Firebase está pronto
        setTimeout(async () => {
            const hasPermission = await this.notificationManager.requestPermission();

            if (hasPermission) {
                this.notificationManager.startListening();

                // Mostrar status na interface
                this.updateNotificationStatus(true);
            }
        }, 2000);
    }

    // 🚪 PARAR QUANDO ADMIN FIZER LOGOUT
    onAdminLogout() {
        console.log('🔔 Admin deslogado - parando notificações...');
        this.notificationManager.stopListening();
        this.updateNotificationStatus(false);
    }

    // 🎨 ATUALIZAR STATUS NA INTERFACE
    updateNotificationStatus(isActive) {
        // Adicionar indicador visual no navbar
        const navbar = document.querySelector('.navbar-user');
        let indicator = document.getElementById('notificationIndicator');

        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'notificationIndicator';
            indicator.style.cssText = `
                display: flex;
                align-items: center;
                gap: 5px;
                padding: 5px 10px;
                border-radius: 15px;
                font-size: 12px;
                font-weight: bold;
                margin-left: 10px;
            `;

            if (navbar) {
                navbar.appendChild(indicator);
            }
        }

        if (isActive) {
            indicator.innerHTML = '🔔 Notificações Ativas';
            indicator.style.background = 'linear-gradient(45deg, #28a745, #20c997)';
            indicator.style.color = 'white';
        } else {
            indicator.innerHTML = '🔕 Notificações Inativas';
            indicator.style.background = '#6c757d';
            indicator.style.color = 'white';
        }
    }
}

// Expor classes no escopo global
window.NotificationManager = NotificationManager;
window.DashboardWithNotifications = DashboardWithNotifications;

console.log('🔔 Admin Notifications - Sistema de notificações carregado');
