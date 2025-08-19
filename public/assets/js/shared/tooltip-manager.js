/**
 * 💡 Tooltip Manager - SENAI Lab v2.9.8
 * Sistema de tooltips contextuais e inteligentes
 */

const TooltipManager = {
    // Configurações padrão
    config: {
        defaultPosition: 'top',
        delay: 500,
        duration: 3000,
        maxWidth: 300,
        enabled: true
    },

    // Tooltips padrão do sistema
    defaultTooltips: {
        // Botões de ação
        '.btn-primary': 'Ação principal do formulário',
        '.btn-secondary': 'Ação secundária ou cancelar',
        '.btn-danger': 'Ação que pode ser irreversível',
        '.btn-success': 'Confirmar ou salvar alterações',
        
        // Ícones comuns
        '.fa-edit': 'Editar item',
        '.fa-trash': 'Excluir item',
        '.fa-eye': 'Visualizar detalhes',
        '.fa-download': 'Baixar arquivo',
        '.fa-upload': 'Enviar arquivo',
        '.fa-refresh': 'Atualizar dados',
        '.fa-filter': 'Filtrar resultados',
        '.fa-search': 'Buscar',
        '.fa-plus': 'Adicionar novo item',
        '.fa-cog': 'Configurações',
        '.fa-user': 'Perfil do usuário',
        '.fa-logout': 'Sair do sistema',
        
        // Status indicators
        '.status-pendente': 'Solicitação aguardando análise',
        '.status-em-andamento': 'Solicitação sendo processada',
        '.status-concluido': 'Solicitação finalizada com sucesso',
        '.status-cancelado': 'Solicitação cancelada',
        
        // Forms
        '[required]': 'Campo obrigatório',
        '[type="file"]': 'Clique para selecionar arquivos',
        '[type="date"]': 'Selecione uma data',
        '[type="time"]': 'Selecione um horário',
        
        // Navigation
        '.nav-link': 'Navegar para esta seção',
        '.breadcrumb-item': 'Voltar para esta página',
        
        // Admin specific
        '#export-pdf': 'Gerar relatório em PDF',
        '#export-excel': 'Exportar dados para Excel',
        '#storage-monitor': 'Monitor de uso do Firebase Storage',
        '#audit-log': 'Visualizar log de auditoria',
        '#refresh-data': 'Atualizar dados do dashboard',
        '#filter-clear': 'Limpar todos os filtros'
    },

    // Tooltips contextuais baseados no conteúdo
    contextualTooltips: {
        impressao: {
            title: 'Serviço de Impressão',
            description: 'Documentos A3 (máx. 10) e A4 (máx. 30)',
            icon: '🖨️'
        },
        impressao3d: {
            title: 'Impressão 3D',
            description: 'Peças em ABS ou PLA',
            icon: '📐'
        },
        manutencao: {
            title: 'Manutenção',
            description: 'Solicitação de reparo ou manutenção',
            icon: '🔧'
        },
        espacomaker: {
            title: 'Espaço Maker',
            description: 'Reserva de equipamentos e espaço',
            icon: '🏗️'
        },
        artedigital: {
            title: 'Arte Digital',
            description: 'Projetos criativos e design',
            icon: '🎨'
        },
        emprestimo: {
            title: 'Empréstimo',
            description: 'Itens disponíveis para empréstimo',
            icon: '📦'
        }
    },

    /**
     * Inicializar sistema de tooltips
     */
    init() {
        console.log('🔄 Inicializando TooltipManager v2.9.8...');
        
        // Aplicar tooltips padrão
        this.applyDefaultTooltips();
        
        // Aplicar tooltips contextuais
        this.applyContextualTooltips();
        
        // Inicializar tooltips dinâmicos
        this.initDynamicTooltips();
        
        // Observer para novos elementos
        this.initMutationObserver();
        
        console.log('✅ TooltipManager inicializado com sucesso');
    },

    /**
     * Aplicar tooltips padrão do sistema
     */
    applyDefaultTooltips() {
        Object.entries(this.defaultTooltips).forEach(([selector, text]) => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (!element.hasAttribute('data-tooltip')) {
                    this.addTooltip(element, text);
                }
            });
        });
    },

    /**
     * Aplicar tooltips contextuais baseados no tipo de serviço
     */
    applyContextualTooltips() {
        // Tooltip para cards de serviço
        document.querySelectorAll('[data-service-type]').forEach(element => {
            const serviceType = element.getAttribute('data-service-type');
            const contextInfo = this.contextualTooltips[serviceType];
            
            if (contextInfo) {
                const tooltip = `${contextInfo.icon} ${contextInfo.title}\n${contextInfo.description}`;
                this.addTooltip(element, tooltip, 'bottom');
            }
        });

        // Tooltip para status com informações contextuais
        document.querySelectorAll('[data-status]').forEach(element => {
            const status = element.getAttribute('data-status');
            const statusInfo = this.getStatusTooltip(status);
            this.addTooltip(element, statusInfo, 'top');
        });
    },

    /**
     * Inicializar tooltips dinâmicos baseados no conteúdo
     */
    initDynamicTooltips() {
        // Tooltip para elementos truncados
        document.querySelectorAll('.text-truncate, .truncate').forEach(element => {
            if (element.scrollWidth > element.clientWidth) {
                this.addTooltip(element, element.textContent.trim(), 'top');
            }
        });

        // Tooltip para imagens com alt text
        document.querySelectorAll('img[alt]').forEach(img => {
            if (img.alt) {
                this.addTooltip(img, img.alt, 'bottom');
            }
        });

        // Tooltip para links externos
        document.querySelectorAll('a[href^="http"]:not([data-tooltip])').forEach(link => {
            this.addTooltip(link, `🔗 Abrir: ${link.href}`, 'bottom');
        });

        // Tooltip para campos de formulário com placeholder
        document.querySelectorAll('input[placeholder]:not([data-tooltip])').forEach(input => {
            const placeholder = input.getAttribute('placeholder');
            if (placeholder && placeholder !== input.getAttribute('data-tooltip')) {
                this.addTooltip(input, `💡 ${placeholder}`, 'top');
            }
        });
    },

    /**
     * Adicionar tooltip a um elemento
     */
    addTooltip(element, text, position = 'top', type = 'default') {
        // Não sobrescrever tooltips existentes
        if (element.hasAttribute('data-tooltip')) {
            return;
        }

        element.classList.add('tooltip');
        element.setAttribute('data-tooltip', text);
        element.setAttribute('role', 'tooltip');
        
        if (position !== 'top') {
            element.setAttribute('data-tooltip-position', position);
        }
        
        if (type !== 'default') {
            element.classList.add(`tooltip-${type}`);
        }

        // Acessibilidade
        element.setAttribute('aria-label', text);
        element.setAttribute('tabindex', '0');
    },

    /**
     * Remover tooltip de um elemento
     */
    removeTooltip(element) {
        element.classList.remove('tooltip', 'tooltip-success', 'tooltip-warning', 'tooltip-error', 'tooltip-info');
        element.removeAttribute('data-tooltip');
        element.removeAttribute('data-tooltip-position');
        element.removeAttribute('role');
        element.removeAttribute('aria-label');
        
        // Manter tabindex se já existia
        if (element.getAttribute('tabindex') === '0') {
            element.removeAttribute('tabindex');
        }
    },

    /**
     * Atualizar tooltip de um elemento
     */
    updateTooltip(element, newText, newPosition = null, newType = null) {
        element.setAttribute('data-tooltip', newText);
        element.setAttribute('aria-label', newText);
        
        if (newPosition) {
            element.setAttribute('data-tooltip-position', newPosition);
        }
        
        if (newType) {
            // Remover classes de tipo antigas
            element.classList.remove('tooltip-success', 'tooltip-warning', 'tooltip-error', 'tooltip-info');
            element.classList.add(`tooltip-${newType}`);
        }
    },

    /**
     * Obter tooltip contextual para status
     */
    getStatusTooltip(status) {
        const statusMap = {
            'pendente': '⏳ Aguardando análise da equipe',
            'em_andamento': '🔄 Sendo processada pela equipe',
            'em-andamento': '🔄 Sendo processada pela equipe',
            'concluido': '✅ Finalizada com sucesso',
            'concluído': '✅ Finalizada com sucesso',
            'cancelado': '❌ Cancelada pela administração'
        };
        
        return statusMap[status] || `📋 Status: ${status}`;
    },

    /**
     * Adicionar tooltips específicos para elementos do admin
     */
    initAdminTooltips() {
        // Tooltips para métricas do dashboard
        document.querySelectorAll('.metric-card').forEach((card, index) => {
            const metricNames = [
                'Total de solicitações no sistema',
                'Solicitações aguardando análise',
                'Solicitações em processamento',
                'Solicitações finalizadas'
            ];
            
            if (metricNames[index]) {
                this.addTooltip(card, metricNames[index], 'bottom', 'info');
            }
        });

        // Tooltips para filtros
        document.querySelectorAll('#filter-service option').forEach(option => {
            if (option.value) {
                const serviceInfo = this.contextualTooltips[option.value];
                if (serviceInfo) {
                    this.addTooltip(option, `${serviceInfo.icon} ${serviceInfo.description}`, 'right');
                }
            }
        });

        // Tooltip para storage monitor
        const storageBtn = document.querySelector('#storage-monitor-btn');
        if (storageBtn) {
            this.addTooltip(storageBtn, '📊 Monitorar uso do Firebase Storage\nVerificar arquivos e custos', 'left', 'info');
        }

        // Tooltip para export PDF
        const exportBtn = document.querySelector('#export-pdf-btn');
        if (exportBtn) {
            this.addTooltip(exportBtn, '📋 Gerar relatório PDF\nIncluir filtros aplicados', 'left', 'success');
        }
    },

    /**
     * Observer para detectar novos elementos DOM
     */
    initMutationObserver() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // Reprocessar tooltips para novos elementos
                        this.processNewElement(node);
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    },

    /**
     * Processar novos elementos adicionados ao DOM
     */
    processNewElement(element) {
        // Aplicar tooltips padrão aos novos elementos
        Object.entries(this.defaultTooltips).forEach(([selector, text]) => {
            if (element.matches && element.matches(selector)) {
                this.addTooltip(element, text);
            }
            
            // Processar elementos filhos
            const children = element.querySelectorAll(selector);
            children.forEach(child => {
                if (!child.hasAttribute('data-tooltip')) {
                    this.addTooltip(child, text);
                }
            });
        });

        // Processar tooltips contextuais
        if (element.hasAttribute && element.hasAttribute('data-service-type')) {
            const serviceType = element.getAttribute('data-service-type');
            const contextInfo = this.contextualTooltips[serviceType];
            if (contextInfo) {
                const tooltip = `${contextInfo.icon} ${contextInfo.title}\n${contextInfo.description}`;
                this.addTooltip(element, tooltip, 'bottom');
            }
        }
    },

    /**
     * Habilitar/desabilitar sistema de tooltips
     */
    toggle(enabled = null) {
        this.config.enabled = enabled !== null ? enabled : !this.config.enabled;
        
        const tooltips = document.querySelectorAll('.tooltip');
        tooltips.forEach(tooltip => {
            tooltip.style.pointerEvents = this.config.enabled ? 'auto' : 'none';
        });
    },

    /**
     * Limpar todos os tooltips
     */
    clear() {
        const tooltips = document.querySelectorAll('.tooltip');
        tooltips.forEach(tooltip => {
            this.removeTooltip(tooltip);
        });
    },

    /**
     * Tooltip temporário para feedback de ações
     */
    showTemporary(element, text, type = 'success', duration = 2000) {
        const originalTooltip = element.getAttribute('data-tooltip');
        const originalType = element.className.match(/tooltip-(\w+)/)?.[1];
        
        this.updateTooltip(element, text, null, type);
        
        // Forçar exibição
        element.classList.add('tooltip-show');
        
        setTimeout(() => {
            element.classList.remove('tooltip-show');
            
            if (originalTooltip) {
                this.updateTooltip(element, originalTooltip, null, originalType);
            } else {
                this.removeTooltip(element);
            }
        }, duration);
    }
};

// Auto-inicializar quando DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => TooltipManager.init());
} else {
    TooltipManager.init();
}

// Inicializar tooltips específicos do admin se estivermos na página admin
if (window.location.pathname.includes('admin.html')) {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => TooltipManager.initAdminTooltips(), 1000);
    });
}

// Expor globalmente para uso manual
window.TooltipManager = TooltipManager;
