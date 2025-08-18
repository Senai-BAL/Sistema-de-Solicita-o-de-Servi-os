/* 🔧 SENAI Lab Admin        case 'espaco_maker':
            detailsHTML = `
                <div>
                    <p><strong>📅 Data da Reserva:</strong> ${dados.dr || 'N/A'}</p>
                    <p><strong>⏰ Horário de Início:</strong> ${dados.hi || 'N/A'}</p>
                    <p><strong>⏰ Horário de Fim:</strong> ${dados.hf || 'N/A'}</p>
                    ${dados.cb === 1 ? `<p><strong>💻 Chrome Books:</strong> ${dados.qcb || 0} unidades</p>` : '<p><strong>💻 Chrome Books:</strong> Não solicitado</p>'}
                    ${dados.cp === 1 ? `<p><strong>🖥️ Computadores:</strong> ${dados.qcp || 0} unidades</p>` : '<p><strong>🖥️ Computadores:</strong> Não solicitado</p>'}
                    ${dados.desc ? `<p><strong>📋 Descrição da Utilização:</strong><br>${dados.desc}</p>` : ''}
                </div>
            `;Utilitárias
 * Arquivo: publi                case 'arte_digital':
                case 'projeto':
                    detailsHTML = `
                        <div>
                            <p><strong>📋 Descrição:</strong><br>${dados.desc || 'N/A'}</p>
                        </div>
                    `;/js/admin/utils.js
 * Descrição: Funções auxiliares para formatação, validação e helpers gerais
 */

// 📝 FORMATAÇÃO DE DETALHES DA SOLICITAÇÃO
function formatRequestDetails(request) {
    if (!request || !request.dados) {
        return '<p style="color: #888;">Detalhes não disponíveis</p>';
    }

    const dados = request.dados;
    let detailsHTML = '';

    switch (request.s) {
        case 'espaco_maker':
            detailsHTML = `
                <div>
                    <p><strong>📅 Data da Reserva:</strong> ${dados.dr || 'N/A'}</p>
                    <p><strong>⏰ Horário de Início:</strong> ${dados.hi || 'N/A'}</p>
                    <p><strong>⏰ Horário de Fim:</strong> ${dados.hf || 'N/A'}</p>
                    ${dados.cb === 1 ? `<p><strong>� Chrome Books:</strong> ${dados.qcb || 0} unidades</p>` : ''}
                    ${dados.cp === 1 ? `<p><strong>🖥️ Computadores:</strong> ${dados.qcp || 0} unidades</p>` : ''}
                    ${dados.desc ? `<p><strong>📋 Descrição da Utilização:</strong><br>${dados.desc}</p>` : ''}
                </div>
            `;
            break;

        case 'servicos':
            switch (request.ts) {
                case 'impressao':
                    detailsHTML = `
                        <div>
                            <p><strong>📄 Tamanho da Folha:</strong> ${dados.tf || 'N/A'}</p>
                            <p><strong>📊 Quantidade de Cópias:</strong> ${dados.qc || 'N/A'} ${dados.qc === 1 ? 'folha' : 'folhas'}</p>
                            <p><strong>📑 Impressão:</strong> ${dados.fv === 1 ? 'Frente e Verso' : 'Apenas Frente'}</p>
                            <p><strong>🎨 Cores:</strong> ${dados.co === 1 ? 'Colorido' : 'Preto e Branco'}</p>
                            ${dados.es === 1 ? '<p><strong>📷 Escaneamento:</strong> Solicitado</p>' : ''}
                            ${dados.obs ? `<p><strong>📝 Observações:</strong><br>${dados.obs}</p>` : ''}
                        </div>
                    `;
                    break;

                case 'impressao_3d':
                    detailsHTML = `
                        <div>
                            <p><strong>🧱 Material:</strong> ${dados.mt || 'N/A'}</p>
                            <p><strong>📊 Quantidade:</strong> ${dados.qt || 'N/A'} ${dados.qt === 1 ? 'peça' : 'peças'}</p>
                            <p><strong>📁 Arquivo STL:</strong> ${dados.stl === 1 ? 'Possui arquivo STL' : 'Não possui arquivo STL'}</p>
                            ${dados.dp ? `<p><strong>📋 Descrição da Peça:</strong><br>${dados.dp}</p>` : ''}
                        </div>
                    `;
                    break;

                case 'manutencao':
                    detailsHTML = `
                        <div>
                            <p><strong>🔧 Descrição do Problema:</strong><br>${dados.prob || 'N/A'}</p>
                        </div>
                    `;
                    break;

                case 'arte_digital':
                case 'projeto':
                    detailsHTML = `
                        <div>
                            <p><strong>� Descrição:</strong><br>${dados.desc || 'N/A'}</p>
                            ${dados.observacoes ? `<p><strong>📝 Observações:</strong><br>${dados.observacoes}</p>` : ''}
                        </div>
                    `;
                    break;

                default:
                    detailsHTML = `
                        <div>
                            <p><strong>🔧 Tipo de Serviço:</strong> ${request.ts || 'N/A'}</p>
                            ${dados.descricao ? `<p><strong>📋 Descrição:</strong><br>${dados.descricao}</p>` : ''}
                            ${dados.observacoes ? `<p><strong>📝 Observações:</strong><br>${dados.observacoes}</p>` : ''}
                        </div>
                    `;
            }
            break;

        case 'emprestimo':
            detailsHTML = `
                <div>
                    <p><strong>📦 Item para Empréstimo:</strong> ${dados.ni || 'N/A'}</p>
                    ${dados.dr ? `<p><strong>📅 Data de Retirada:</strong> ${dados.dr}</p>` : ''}
                    ${dados.dd ? `<p><strong>🔄 Data de Devolução:</strong> ${dados.dd}</p>` : ''}
                    ${dados.fin ? `<p><strong>🎯 Finalidade:</strong><br>${dados.fin}</p>` : ''}
                </div>
            `;
            break;

        default:
            detailsHTML = `
                <div>
                    <p><strong>🔧 Tipo de Serviço:</strong> ${request.s || 'N/A'}</p>
                    <pre style="background: #f5f5f5; padding: 10px; border-radius: 4px; font-size: 0.8rem; overflow-x: auto;">${JSON.stringify(dados, null, 2)}</pre>
                </div>
            `;
    }

    return detailsHTML;
}

// 📝 FORMATAÇÃO DE DETALHES DA SOLICITAÇÃO - DADOS ESTRUTURADOS
function formatRequestDetailsStructured(request) {
    if (!request || !request.dados) {
        return [{ label: 'Detalhes', value: 'Não disponíveis' }];
    }

    const dados = request.dados;
    let detailsArray = [];

    switch (request.s) {
        case 'espaco_maker':
            detailsArray = [
                { label: 'Data da Reserva', value: dados.dr || 'N/A' },
                { label: 'Horário de Início', value: dados.hi || 'N/A' },
                { label: 'Horário de Fim', value: dados.hf || 'N/A' },
                { label: 'Chrome Books', value: dados.cb === 1 ? `${dados.qcb || 0} unidades` : 'Não solicitado' },
                { label: 'Computadores', value: dados.cp === 1 ? `${dados.qcp || 0} unidades` : 'Não solicitado' }
            ];
            if (dados.desc) {
                detailsArray.push({ label: 'Descrição da Utilização', value: dados.desc, isLong: true });
            }
            break;

        case 'servicos':
            switch (request.ts) {
                case 'impressao':
                    detailsArray = [
                        { label: 'Tamanho da Folha', value: dados.tf || 'N/A' },
                        { label: 'Quantidade de Cópias', value: `${dados.qc || 'N/A'} ${dados.qc === 1 ? 'folha' : 'folhas'}` },
                        { label: 'Tipo de Impressão', value: dados.fv === 1 ? 'Frente e Verso' : 'Apenas Frente' },
                        { label: 'Cores', value: dados.co === 1 ? 'Colorido' : 'Preto e Branco' },
                        { label: 'Escaneamento', value: dados.es === 1 ? 'Solicitado' : 'Não solicitado' }
                    ];
                    if (dados.obs) {
                        detailsArray.push({ label: 'Observações', value: dados.obs, isLong: true });
                    }
                    break;

                case 'impressao_3d':
                    detailsArray = [
                        { label: 'Material', value: dados.mt || 'N/A' },
                        { label: 'Quantidade', value: `${dados.qt || 'N/A'} ${dados.qt === 1 ? 'peça' : 'peças'}` },
                        { label: 'Arquivo STL', value: dados.stl === 1 ? 'Possui arquivo STL' : 'Não possui arquivo STL' }
                    ];
                    if (dados.dp) {
                        detailsArray.push({ label: 'Descrição da Peça', value: dados.dp, isLong: true });
                    }
                    if (dados.obs) {
                        detailsArray.push({ label: 'Observações', value: dados.obs, isLong: true });
                    }
                    break;

                case 'manutencao':
                    detailsArray = [
                        { label: 'Descrição do Problema', value: dados.prob || 'N/A', isLong: true }
                    ];
                    break;

                case 'arte_digital':
                case 'projeto':
                    detailsArray = [
                        { label: 'Descrição', value: dados.desc || 'N/A', isLong: true }
                    ];
                    if (dados.observacoes) {
                        detailsArray.push({ label: 'Observações', value: dados.observacoes, isLong: true });
                    }
                    break;

                default:
                    detailsArray = [
                        { label: 'Tipo de Serviço', value: request.ts || 'N/A' }
                    ];
                    if (dados.descricao) {
                        detailsArray.push({ label: 'Descrição', value: dados.descricao, isLong: true });
                    }
                    if (dados.observacoes) {
                        detailsArray.push({ label: 'Observações', value: dados.observacoes, isLong: true });
                    }
            }
            break;

        case 'emprestimo':
            detailsArray = [
                { label: 'Item para Empréstimo', value: dados.ni || 'N/A' },
                { label: 'Data de Retirada', value: dados.dr || 'N/A' },
                { label: 'Data de Devolução', value: dados.dd || 'N/A' }
            ];
            if (dados.fin) {
                detailsArray.push({ label: 'Finalidade', value: dados.fin, isLong: true });
            }
            break;

        default:
            detailsArray = [
                { label: 'Tipo de Serviço', value: request.s || 'N/A' },
                { label: 'Dados', value: JSON.stringify(dados, null, 2), isLong: true, isCode: true }
            ];
    }

    return detailsArray;
}

// 🏷️ OBTER NOME EXIBÍVEL DO SERVIÇO
function getServiceDisplayName(service) {
    const displayNames = {
        'espaco_maker': 'Espaço Maker',
        'servicos': 'Serviços',
        'emprestimo': 'Empréstimo'
    };
    return displayNames[service] || service;
}

// 📁 AGRUPAR SOLICITAÇÕES POR SERVIÇO
function groupRequestsByService(requests) {
    return requests.reduce((groups, request) => {
        const service = request.s || 'outros';
        if (!groups[service]) {
            groups[service] = [];
        }
        groups[service].push(request);
        return groups;
    }, {});
}

// 📊 CALCULAR ESTATÍSTICAS DETALHADAS
function calculateDetailedStats(requests) {
    const stats = {
        total: requests.length,
        por_status: {},
        por_servico: {},
        por_mes: {},
        por_prioridade: {},
        arquivos_totais: 0,
        tamanho_total_arquivos: 0
    };

    // Inicializar contadores
    const status_types = ['pendente', 'em_andamento', 'concluido', 'cancelado'];
    const service_types = ['espaco_maker', 'servicos', 'emprestimo'];
    const priorities = ['alta', 'media', 'baixa'];

    status_types.forEach(status => stats.por_status[status] = 0);
    service_types.forEach(service => stats.por_servico[service] = 0);
    priorities.forEach(priority => stats.por_prioridade[priority] = 0);

    requests.forEach(request => {
        // Contar por status
        const status = request.admin?.status || 'pendente';
        if (stats.por_status[status] !== undefined) {
            stats.por_status[status]++;
        }

        // Contar por serviço
        const service = request.s;
        if (stats.por_servico[service] !== undefined) {
            stats.por_servico[service]++;
        }

        // Contar por prioridade
        const priority = request.admin?.prioridade;
        if (priority && stats.por_prioridade[priority] !== undefined) {
            stats.por_prioridade[priority]++;
        }

        // Contar por mês
        const date = new Date(request.d);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        if (!stats.por_mes[monthKey]) {
            stats.por_mes[monthKey] = 0;
        }
        stats.por_mes[monthKey]++;

        // Contar arquivos
        if (request.arq && request.arq.length > 0) {
            stats.arquivos_totais += request.arq.length;
            request.arq.forEach(arquivo => {
                stats.tamanho_total_arquivos += arquivo.s || 0;
            });
        }
    });

    return stats;
}

// 📄 GERAR CSV PARA DIFERENTES TIPOS
function generateCSV(requests, type = 'all') {
    if (!requests.length) return 'Nenhum dado disponível';

    const headers = [
        'ID',
        'Data',
        'Colaborador',
        'Email',
        'WhatsApp',
        'Serviço',
        'Tipo Serviço',
        'Status',
        'Prioridade',
        'Comentários'
    ];

    const rows = requests.map(request => [
        request.id || '',
        formatDate(request.d),
        request.c || '',
        request.e || '',
        request.w || '',
        getServiceName(request.s, request.ts),
        request.ts || '',
        request.admin?.status || 'pendente',
        request.admin?.prioridade || '',
        request.admin?.comentarios?.length || 0
    ]);

    return [headers, ...rows].map(row => 
        row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')
    ).join('\n');
}

// 📊 GERAR RESUMO EXECUTIVO
function generateExecutiveSummary(firestoreData, downloadedFiles) {
    const { requests, stats } = firestoreData;
    const now = new Date();
    
    return `
SENAI LAB - RESUMO EXECUTIVO
============================

Data de Geração: ${now.toLocaleString('pt-BR')}
Tipo de Backup: Completo com Arquivos Firebase Storage
Versão do Sistema: 2.9.5

ESTATÍSTICAS GERAIS
-------------------
Total de Solicitações: ${requests.length}
- Pendentes: ${stats.por_status?.pendente || 0}
- Em Andamento: ${stats.por_status?.em_andamento || 0}
- Concluídas: ${stats.por_status?.concluido || 0}
- Canceladas: ${stats.por_status?.cancelado || 0}

POR TIPO DE SERVIÇO
-------------------
- Espaço Maker: ${stats.por_servico?.espaco_maker || 0}
- Serviços: ${stats.por_servico?.servicos || 0}
- Empréstimos: ${stats.por_servico?.emprestimo || 0}

ARQUIVOS
--------
Total de Arquivos no Firebase Storage: ${downloadedFiles.length}
Arquivos Baixados com Sucesso: ${downloadedFiles.filter(f => f.downloaded).length}
Arquivos com Erro: ${downloadedFiles.filter(f => !f.downloaded).length}
Tamanho Total: ${(downloadedFiles.reduce((sum, f) => sum + (f.sizeBytes || 0), 0) / 1024 / 1024).toFixed(2)} MB

PERÍODO DE ATIVIDADE
--------------------
Primeira Solicitação: ${requests.length > 0 ? formatDate(Math.min(...requests.map(r => r.d))) : 'N/A'}
Última Solicitação: ${requests.length > 0 ? formatDate(Math.max(...requests.map(r => r.d))) : 'N/A'}

OBSERVAÇÕES
-----------
✅ Backup completo realizado com sucesso
✅ Todos os dados preservados em múltiplos formatos
✅ Sistema pronto para limpeza e início de novo ciclo
✅ Custo de operação mantido em R$ 0,00

---
Gerado automaticamente pelo Sistema SENAI Lab v2.9.8
    `.trim();
}

// 📁 EXTRAIR PASTA DO PATH
function getFolderFromPath(path) {
    if (!path) return 'outros';
    
    // Extrair pasta do GitHub path
    const parts = path.split('/');
    if (parts.length > 1) {
        return parts[parts.length - 2]; // Penúltima parte (pasta)
    }
    
    return 'raiz';
}

// 📊 VALIDAR CONFIGURAÇÃO SISTEMA
function validateSystemConfig() {
    const issues = [];
    
    // Verificar configurações básicas
    if (ADMIN_CONFIG.password === 'senai@admin2025') {
        issues.push('⚠️ Senha padrão ainda em uso - altere em config.js');
    }
    
    if (!window.firebaseConfig) {
        issues.push('❌ Configuração Firebase não encontrada');
    }
    
    if (!window.githubConfig) {
        issues.push('❌ Configuração GitHub não encontrada');
    }
    
    return issues;
}

// 🔄 CONFIRMAR LIMPEZA TOTAL
function confirmTotalCleanup(requestsCount, filesCount) {
    setTimeout(() => {
        const userConfirm = confirm(`
🗂️ BACKUP COMPLETO REALIZADO!

📊 Dados salvos:
   • ${requestsCount} solicitações
   • ${filesCount} arquivos do GitHub
   • Múltiplos formatos (JSON, CSV, TXT)

🧹 PRÓXIMO PASSO: LIMPEZA TOTAL
   Esta ação irá APAGAR TUDO:
   • Todas as solicitações do Firestore
   • Todos os arquivos do GitHub
   • Sistema volta ao estado inicial

⚠️ ATENÇÃO: Esta ação é IRREVERSÍVEL!
   Certifique-se de que o backup foi baixado.

Deseja prosseguir com a LIMPEZA TOTAL?
        `);

        if (userConfirm) {
            performTotalCleanup();
        } else {
            ToastManager.show('Limpeza cancelada. Backup mantido e sistema preservado.', 'info');
        }
    }, 2000);
}

// 🧹 EXECUTAR LIMPEZA TOTAL
async function performTotalCleanup() {
    try {
        LoadingManager.show('Iniciando limpeza do sistema...');
        
        // 1. Verificar última limpeza
        const lastCleanup = localStorage.getItem('last_system_cleanup');
        const now = Date.now();
        const fiveDaysInMs = 5 * 24 * 60 * 60 * 1000; // 5 dias em millisegundos
        
        if (lastCleanup && (now - parseInt(lastCleanup)) < fiveDaysInMs) {
            const nextCleanup = new Date(parseInt(lastCleanup) + fiveDaysInMs);
            ToastManager.show(`Próxima limpeza programada para: ${nextCleanup.toLocaleDateString('pt-BR')}`, 'info');
            LoadingManager.hide();
            return;
        }

        LoadingManager.show('Limpando logs antigos do Firestore...');
        
        // 2. Limpar logs antigos do Firestore (> 5 dias)
        const cleanupResult = await cleanupOldLogs();
        
        LoadingManager.show('Otimizando cache local...');
        
        // 3. Limpar cache desnecessário
        cleanupLocalStorage();
        
        LoadingManager.show('Otimizando contadores...');
        
        // 4. Resetar contadores de uso se necessário
        resetUsageCounters();
        
        // 5. Registrar limpeza realizada
        localStorage.setItem('last_system_cleanup', now.toString());
        
        LoadingManager.hide();
        ToastManager.show(`Limpeza concluída! ${cleanupResult.deleted} logs antigos removidos. Próxima limpeza em 5 dias.`, 'success');
        
        // 6. Log da ação de limpeza
        AdminAuth.logUserAction('system_cleanup', {
            description: `Limpeza automática executada - ${cleanupResult.deleted} logs removidos`,
            logsDeleted: cleanupResult.deleted,
            nextCleanup: new Date(now + fiveDaysInMs).toISOString()
        });
        
    } catch (error) {
        console.error('❌ Erro na limpeza do sistema:', error);
        LoadingManager.hide();
        ToastManager.show('Erro durante limpeza do sistema: ' + error.message, 'error');
    }
}

// 🗑️ LIMPAR LOGS ANTIGOS DO FIRESTORE
async function cleanupOldLogs() {
    try {
        const db = firebase.firestore();
        const fiveDaysAgo = Date.now() - (5 * 24 * 60 * 60 * 1000);
        
        // Buscar logs antigos (admin_logs)
        const oldLogsQuery = await db.collection('admin_logs')
            .where('timestamp', '<', fiveDaysAgo)
            .get();
        
        const oldAccessQuery = await db.collection('admin_access_logs')
            .where('timestamp', '<', fiveDaysAgo)
            .get();
        
        let deletedCount = 0;
        const batch = db.batch();
        
        // Marcar logs administrativos para exclusão (mas manter logs críticos)
        oldLogsQuery.forEach(doc => {
            const data = doc.data();
            // Manter logs críticos (exclusões, alterações importantes)
            const criticalActions = ['request_deleted', 'status_update', 'priority_set'];
            
            if (!criticalActions.includes(data.acao) && !criticalActions.includes(data.action)) {
                batch.delete(doc.ref);
                deletedCount++;
            }
        });
        
        // Logs de acesso podem ser removidos normalmente
        oldAccessQuery.forEach(doc => {
            batch.delete(doc.ref);
            deletedCount++;
        });
        
        // Executar exclusão em lote
        if (deletedCount > 0) {
            await batch.commit();
        }
        
        return { deleted: deletedCount };
        
    } catch (error) {
        console.error('❌ Erro ao limpar logs do Firestore:', error);
        return { deleted: 0 };
    }
}

// 🧹 LIMPAR LOCALSTORAGE DESNECESSÁRIO
function cleanupLocalStorage() {
    try {
        // Lista de chaves que podem ser limpas se muito antigas
        const cleanableKeys = [
            'senai_admin_logs',
            'senai_access_logs',
            'toast_message_cache',
            'temp_upload_data'
        ];
        
        cleanableKeys.forEach(key => {
            const data = localStorage.getItem(key);
            if (data) {
                try {
                    const parsed = JSON.parse(data);
                    if (Array.isArray(parsed)) {
                        // Manter apenas os 15 mais recentes para logs
                        if (key.includes('logs') && parsed.length > 15) {
                            const recent = parsed.slice(-15);
                            localStorage.setItem(key, JSON.stringify(recent));
                        }
                    }
                } catch (e) {
                    // Se não conseguir parsear, remover
                    localStorage.removeItem(key);
                }
            }
        });
        
        // Limpar dados temporários de upload
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('temp_') && localStorage.getItem(key)) {
                try {
                    const data = JSON.parse(localStorage.getItem(key));
                    const oneHourAgo = Date.now() - (60 * 60 * 1000);
                    if (data.timestamp && data.timestamp < oneHourAgo) {
                        localStorage.removeItem(key);
                    }
                } catch (e) {
                    localStorage.removeItem(key);
                }
            }
        });
        
    } catch (error) {
        console.warn('⚠️ Erro ao limpar localStorage:', error);
    }
}

// 🔄 RESETAR CONTADORES DE USO
function resetUsageCounters() {
    try {
        // Resetar contadores diários se for um novo dia
        const today = new Date().toDateString();
        const lastReset = localStorage.getItem('lastReset');
        
        if (lastReset !== today) {
            localStorage.setItem('dailyWrites', '0');
            localStorage.setItem('dailyUploads', '0');
            localStorage.setItem('lastReset', today);
        }
        
        // Limpar cache de Toast messages antigas
        if (window.ToastManager && typeof ToastManager.cleanupMessageCache === 'function') {
            ToastManager.cleanupMessageCache();
        }
        
    } catch (error) {
        console.warn('⚠️ Erro ao resetar contadores:', error);
    }
}

console.log('🛠️ Admin Utils - Funções utilitárias carregadas');
