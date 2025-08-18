/* 🔧 SENAI Lab - Rate Limiter Frontend v2.9.8
 * Arquivo: public/assets/js/shared/rate-limiter.js
 * Descrição: Controle de taxa de uploads e ações no frontend
 */

class RateLimiter {
    constructor() {
        this.actions = new Map();
        this.limits = {
            'file_upload': { max: 10, window: 60000 }, // 10 uploads por minuto
            'form_submit': { max: 3, window: 60000 }, // 3 submissões por minuto
            'search_query': { max: 20, window: 60000 }, // 20 buscas por minuto
            'api_call': { max: 10, window: 60000 } // 10 chamadas API por minuto
        };
    }

    /**
     * Verificar se ação é permitida
     */
    isAllowed(actionType, userId = 'anonymous') {
        const key = `${actionType}_${userId}`;
        const limit = this.limits[actionType];
        
        if (!limit) {
            console.warn(`Rate limit não configurado para: ${actionType}`);
            return true;
        }

        const now = Date.now();
        const userActions = this.actions.get(key) || [];
        
        // Remover ações antigas (fora da janela de tempo)
        const validActions = userActions.filter(timestamp => 
            (now - timestamp) < limit.window
        );

        // Verificar se excedeu o limite
        if (validActions.length >= limit.max) {
            const oldestAction = Math.min(...validActions);
            const waitTime = limit.window - (now - oldestAction);
            
            console.warn(`Rate limit atingido para ${actionType}. Aguarde ${Math.ceil(waitTime / 1000)}s`);
            return {
                allowed: false,
                waitTime: waitTime,
                message: this.getRateLimitMessage(actionType, waitTime)
            };
        }

        // Registrar a ação
        validActions.push(now);
        this.actions.set(key, validActions);

        return { allowed: true };
    }

    /**
     * Obter mensagem de rate limit user-friendly
     */
    getRateLimitMessage(actionType, waitTime) {
        const seconds = Math.ceil(waitTime / 1000);
        const messages = {
            'file_upload': `Muitos uploads seguidos. Aguarde ${seconds} segundos antes de enviar outro arquivo.`,
            'form_submit': `Muitas submissões. Aguarde ${seconds} segundos antes de enviar novamente.`,
            'search_query': `Muitas buscas seguidas. Aguarde ${seconds} segundos.`,
            'api_call': `Muitas requisições. Aguarde ${seconds} segundos antes de tentar novamente.`
        };

        return messages[actionType] || `Limite atingido. Aguarde ${seconds} segundos.`;
    }

    /**
     * Limpar histórico de ações (limpeza automática)
     */
    cleanup() {
        const now = Date.now();
        const maxWindow = Math.max(...Object.values(this.limits).map(l => l.window));

        for (const [key, actions] of this.actions.entries()) {
            const validActions = actions.filter(timestamp => 
                (now - timestamp) < maxWindow
            );
            
            if (validActions.length === 0) {
                this.actions.delete(key);
            } else {
                this.actions.set(key, validActions);
            }
        }
    }

    /**
     * Configurar novos limites
     */
    setLimit(actionType, max, windowMs) {
        this.limits[actionType] = { max, window: windowMs };
    }

    /**
     * Obter estatísticas de uso
     */
    getStats() {
        const stats = {};
        for (const [key, actions] of this.actions.entries()) {
            const [actionType] = key.split('_');
            if (!stats[actionType]) {
                stats[actionType] = { users: 0, totalActions: 0 };
            }
            stats[actionType].users++;
            stats[actionType].totalActions += actions.length;
        }
        return stats;
    }
}

// Rate limiter específico para uploads
class UploadRateLimiter extends RateLimiter {
    constructor() {
        super();
        // Limites mais rigorosos para uploads
        this.limits = {
            'file_upload': { max: 10, window: 60000 }, // 10 arquivos por minuto
            'concurrent_uploads': { max: 2, window: 10000 }, // Máximo 2 uploads simultâneos
            'total_size': { max: 50 * 1024 * 1024, window: 300000 } // 50MB em 5 minutos
        };
        
        this.uploadSizes = new Map();
    }

    /**
     * Verificar upload considerando tamanho
     */
    checkUpload(fileSize, userId = 'anonymous') {
        // Verificar limite de arquivos
        const fileCheck = this.isAllowed('file_upload', userId);
        if (!fileCheck.allowed) {
            return fileCheck;
        }

        // Verificar limite de tamanho total
        const sizeCheck = this.checkTotalSize(fileSize, userId);
        if (!sizeCheck.allowed) {
            return sizeCheck;
        }

        return { allowed: true };
    }

    /**
     * Verificar limite de tamanho total
     */
    checkTotalSize(fileSize, userId) {
        const key = `total_size_${userId}`;
        const now = Date.now();
        const window = this.limits.total_size.window;
        
        let userSizes = this.uploadSizes.get(key) || [];
        
        // Remover uploads antigos
        userSizes = userSizes.filter(upload => (now - upload.timestamp) < window);
        
        // Calcular tamanho total
        const totalSize = userSizes.reduce((sum, upload) => sum + upload.size, 0);
        
        if (totalSize + fileSize > this.limits.total_size.max) {
            const oldestUpload = Math.min(...userSizes.map(u => u.timestamp));
            const waitTime = window - (now - oldestUpload);
            
            return {
                allowed: false,
                waitTime: waitTime,
                message: `Limite de upload atingido (${this.formatBytes(this.limits.total_size.max)} em 5 min). Aguarde ${Math.ceil(waitTime / 1000)}s.`
            };
        }

        // Registrar o upload
        userSizes.push({ size: fileSize, timestamp: now });
        this.uploadSizes.set(key, userSizes);

        return { allowed: true };
    }

    formatBytes(bytes) {
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

// Instância global
window.rateLimiter = new RateLimiter();
window.uploadRateLimiter = new UploadRateLimiter();

// Limpeza automática a cada 5 minutos
setInterval(() => {
    window.rateLimiter.cleanup();
    window.uploadRateLimiter.cleanup();
}, 5 * 60 * 1000);

console.log('🛡️ Rate Limiter inicializado - Proteção contra spam ativa');
