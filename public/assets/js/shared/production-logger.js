/* 🔧 SENAI Lab - Logger de Produção
 * Arquivo: public/assets/js/shared/production-logger.js
 * Descrição: Sistema de logs otimizado para produção
 * Versão: 3.0.2
 */

class ProductionLogger {
    constructor() {
        this.isDevelopment = window.location.hostname === 'localhost' || 
                           window.location.hostname === '127.0.0.1' ||
                           window.location.search.includes('debug=true');
        this.logLevel = this.isDevelopment ? 'debug' : 'error';
    }

    // 🔧 Log de debug (apenas em desenvolvimento)
    debug(message, ...args) {
        if (this.isDevelopment) {
            console.log(`🔧 [DEBUG] ${message}`, ...args);
        }
    }

    // ℹ️ Log informativo (apenas em desenvolvimento)
    info(message, ...args) {
        if (this.isDevelopment) {
            console.info(`ℹ️ [INFO] ${message}`, ...args);
        }
    }

    // ⚠️ Log de warning (sempre ativo)
    warn(message, ...args) {
        console.warn(`⚠️ [WARN] ${message}`, ...args);
    }

    // ❌ Log de erro (sempre ativo)
    error(message, ...args) {
        console.error(`❌ [ERROR] ${message}`, ...args);
    }

    // ✅ Log de sucesso crítico (sempre ativo)
    success(message, ...args) {
        console.log(`✅ [SUCCESS] ${message}`, ...args);
    }

    // 📊 Log de auditoria (sempre ativo)
    audit(action, details = {}) {
        const auditLog = {
            timestamp: new Date().toISOString(),
            action,
            details,
            user: window.currentUser?.email || 'anonymous'
        };
        
        console.log(`📊 [AUDIT] ${action}:`, auditLog);
        
        // Enviar para sistema de auditoria se disponível
        if (window.AdminAuth && typeof window.AdminAuth.logUserAction === 'function') {
            window.AdminAuth.logUserAction(action, details);
        }
    }
}

// Instância global
window.Logger = new ProductionLogger();

// Aliases para compatibilidade
window.logDebug = (msg, ...args) => window.Logger.debug(msg, ...args);
window.logInfo = (msg, ...args) => window.Logger.info(msg, ...args);
window.logWarn = (msg, ...args) => window.Logger.warn(msg, ...args);
window.logError = (msg, ...args) => window.Logger.error(msg, ...args);
window.logSuccess = (msg, ...args) => window.Logger.success(msg, ...args);
window.logAudit = (action, details) => window.Logger.audit(action, details);

// Notificação de carregamento (apenas em desenvolvimento)
window.Logger.debug('Production Logger carregado');
