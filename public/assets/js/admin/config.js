/* 🔧 SENAI Lab Admin - Configurações
 * Arquivo: public/assets/js/admin/config.js
 * Descrição: Configurações globais e autenticação do dashboard administrativo
 */

// 🔐 CONFIGURAÇÃO DE AUTENTICAÇÃO
const ADMIN_CONFIG = {
    sessionDuration: 24 * 60 * 60 * 1000, // 24 horas
    sessionKey: 'senai_admin_session'
};

// 🌟 VARIÁVEIS GLOBAIS
let firebaseService;
let currentRequests = [];
let filteredRequests = [];
let currentViewMode = 'list'; // 'list' ou 'kanban'
let currentRequestId = null; // Para modal de comentário
let dashboardNotifications = null; // Para sistema de notificações

// Expor no escopo global
window.ADMIN_CONFIG = ADMIN_CONFIG;
window.firebaseService = firebaseService;
window.currentRequests = currentRequests;
window.filteredRequests = filteredRequests;
window.currentViewMode = currentViewMode;
