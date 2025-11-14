/**
 * Exibe mensagem de status temporária na tela
 * @deprecated Use ToastManager.show() diretamente
 * @param {string} message - Mensagem a ser exibida
 * @param {string} type - Tipo da mensagem (info, success, error, warning)
 */
function showStatus(message, type = 'info') {
    // Wrapper para manter compatibilidade - usar ToastManager.show() em novos códigos
    if (typeof ToastManager !== 'undefined' && ToastManager.show) {
        ToastManager.show(message, type, 4000);
    } else {
        // Fallback se ToastManager não estiver disponível
        console.log(`[${type.toUpperCase()}] ${message}`);
    }
}
