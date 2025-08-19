/* 🔧 SENAI Lab - Rate Limit UI v2.9.8
 * Arquivo: public/assets/js/shared/rate-limit-ui.js
 * Descrição: Interface visual para rate limiting
 */

class RateLimitUI {
    constructor() {
        this.toastContainer = null;
        this.createToastContainer();
        this.rateLimitWarnings = new Set();
    }

    /**
     * Criar container para toasts de rate limit
     */
    createToastContainer() {
        if (!this.toastContainer) {
            this.toastContainer = document.createElement('div');
            this.toastContainer.id = 'rate-limit-toasts';
            this.toastContainer.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                pointer-events: none;
            `;
            document.body.appendChild(this.toastContainer);
        }
    }

    /**
     * Mostrar aviso de rate limit
     */
    showRateLimitWarning(actionType, message, waitTime) {
        // Evitar toasts duplicados
        const warningKey = `${actionType}_${Date.now()}`;
        if (this.rateLimitWarnings.has(actionType)) {
            return;
        }

        this.rateLimitWarnings.add(actionType);

        const toast = document.createElement('div');
        toast.className = 'rate-limit-toast';
        toast.innerHTML = `
            <div class="rate-limit-content">
                <div class="rate-limit-icon">🛡️</div>
                <div class="rate-limit-text">
                    <strong>Limite atingido!</strong>
                    <p>${message}</p>
                </div>
                <div class="rate-limit-countdown" data-wait-time="${waitTime}">
                    ${Math.ceil(waitTime / 1000)}s
                </div>
            </div>
        `;

        toast.style.cssText = `
            background: linear-gradient(135deg, #ff6b6b, #ee5a24);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            margin-bottom: 10px;
            box-shadow: 0 4px 20px rgba(255, 107, 107, 0.3);
            border-left: 4px solid #c0392b;
            animation: slideInRight 0.3s ease-out;
            pointer-events: auto;
            cursor: pointer;
            max-width: 350px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;

        // CSS para animação (se não existir)
        if (!document.getElementById('rate-limit-styles')) {
            const styles = document.createElement('style');
            styles.id = 'rate-limit-styles';
            styles.textContent = `
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                
                @keyframes slideOutRight {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }

                .rate-limit-content {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .rate-limit-icon {
                    font-size: 24px;
                    flex-shrink: 0;
                }

                .rate-limit-text {
                    flex: 1;
                }

                .rate-limit-text strong {
                    display: block;
                    font-size: 14px;
                    margin-bottom: 4px;
                }

                .rate-limit-text p {
                    margin: 0;
                    font-size: 12px;
                    opacity: 0.9;
                    line-height: 1.3;
                }

                .rate-limit-countdown {
                    background: rgba(255, 255, 255, 0.2);
                    padding: 8px 12px;
                    border-radius: 20px;
                    font-weight: bold;
                    font-size: 14px;
                    min-width: 40px;
                    text-align: center;
                }

                .rate-limit-toast:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 25px rgba(255, 107, 107, 0.4);
                    transition: all 0.2s ease;
                }
            `;
            document.head.appendChild(styles);
        }

        this.toastContainer.appendChild(toast);

        // Countdown visual
        const countdownElement = toast.querySelector('.rate-limit-countdown');
        const countdownInterval = setInterval(() => {
            const remaining = parseInt(countdownElement.dataset.waitTime);
            const newRemaining = remaining - 1000;
            
            if (newRemaining <= 0) {
                clearInterval(countdownInterval);
                this.removeToast(toast, actionType);
            } else {
                countdownElement.dataset.waitTime = newRemaining;
                countdownElement.textContent = Math.ceil(newRemaining / 1000) + 's';
            }
        }, 1000);

        // Remover ao clicar
        toast.addEventListener('click', () => {
            clearInterval(countdownInterval);
            this.removeToast(toast, actionType);
        });

        // Auto-remover após o tempo de espera
        setTimeout(() => {
            clearInterval(countdownInterval);
            this.removeToast(toast, actionType);
        }, waitTime + 500);
    }

    /**
     * Remover toast com animação
     */
    removeToast(toast, actionType) {
        if (toast && toast.parentNode) {
            toast.style.animation = 'slideOutRight 0.3s ease-in forwards';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
                this.rateLimitWarnings.delete(actionType);
            }, 300);
        }
    }

    /**
     * Mostrar indicador de progresso para rate limit
     */
    showUploadRateProgress(actionType, currentCount, maxCount, windowTime) {
        const progressBarId = `rate-progress-${actionType}`;
        let progressBar = document.getElementById(progressBarId);

        if (!progressBar) {
            progressBar = document.createElement('div');
            progressBar.id = progressBarId;
            progressBar.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: rgba(255, 255, 255, 0.95);
                padding: 12px 16px;
                border-radius: 8px;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
                border-left: 4px solid #3498db;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                font-size: 13px;
                max-width: 280px;
                z-index: 9999;
            `;
            document.body.appendChild(progressBar);
        }

        const percentage = (currentCount / maxCount) * 100;
        const remaining = maxCount - currentCount;
        const color = percentage > 80 ? '#e74c3c' : percentage > 60 ? '#f39c12' : '#27ae60';

        progressBar.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                <span style="font-weight: 600; color: #2c3e50;">Uploads:</span>
                <span style="color: ${color}; font-weight: bold;">${currentCount}/${maxCount}</span>
            </div>
            <div style="background: #ecf0f1; height: 4px; border-radius: 2px; overflow: hidden;">
                <div style="background: ${color}; height: 100%; width: ${percentage}%; transition: all 0.3s ease;"></div>
            </div>
            <div style="margin-top: 4px; color: #7f8c8d; font-size: 11px;">
                ${remaining} restantes (${Math.ceil(windowTime / 1000 / 60)} min)
            </div>
        `;

        // Auto-remover quando não precisar mais
        if (currentCount === 0) {
            setTimeout(() => {
                if (progressBar && progressBar.parentNode) {
                    progressBar.style.opacity = '0';
                    progressBar.style.transform = 'translateY(20px)';
                    progressBar.style.transition = 'all 0.3s ease';
                    setTimeout(() => {
                        if (progressBar.parentNode) {
                            progressBar.parentNode.removeChild(progressBar);
                        }
                    }, 300);
                }
            }, 2000);
        }
    }

    /**
     * Decorator para funções que precisam de rate limiting
     */
    static withRateLimit(actionType, originalFunction) {
        return async function(...args) {
            if (window.rateLimiter) {
                const userId = getCurrentUserId(); // Função para obter ID do usuário
                const check = window.rateLimiter.isAllowed(actionType, userId);
                
                if (!check.allowed) {
                    window.rateLimitUI?.showRateLimitWarning(
                        actionType, 
                        check.message, 
                        check.waitTime
                    );
                    throw new Error(check.message);
                }
            }
            
            return await originalFunction.apply(this, args);
        };
    }
}

// Função auxiliar para obter ID do usuário atual
function getCurrentUserId() {
    // Tentar obter email do formulário atual
    const emailInput = document.querySelector('input[name="email"], input[type="email"]');
    if (emailInput && emailInput.value) {
        return emailInput.value;
    }
    
    // Tentar obter do localStorage/sessionStorage
    const storedUser = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
    if (storedUser) {
        try {
            const userData = JSON.parse(storedUser);
            return userData.email || userData.id || 'anonymous';
        } catch (e) {
            return storedUser;
        }
    }
    
    return 'anonymous';
}

// Instância global
window.rateLimitUI = new RateLimitUI();

console.log('🛡️ Rate Limit UI inicializado - Interface visual ativa');
