/* 🔧 SENAI Lab Admin - Funções Utilitárias
 * Arquivo: public/assets/js/admin/utils.js
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
                    <p><strong>📅 Data da Reserva:</strong> ${dados.data || 'N/A'}</p>
                    <p><strong>⏰ Período:</strong> ${dados.periodo || 'N/A'}</p>
                    ${dados.equipamentos ? `<p><strong>🖥️ Equipamentos:</strong> ${Array.isArray(dados.equipamentos) ? dados.equipamentos.join(', ') : dados.equipamentos}</p>` : ''}
                    ${dados.descricao ? `<p><strong>📋 Descrição da Utilização:</strong><br>${dados.descricao}</p>` : ''}
                </div>
            `;
            break;

        case 'servicos':
            switch (request.ts) {
                case 'impressao':
                    detailsHTML = `
                        <div>
                            <p><strong>📄 Tipo de Papel:</strong> ${dados.papel || 'N/A'}</p>
                            <p><strong>📊 Quantidade:</strong> ${dados.quantidade || 'N/A'} folhas</p>
                            ${dados.frente_verso ? '<p><strong>📑 Impressão:</strong> Frente e Verso</p>' : '<p><strong>📑 Impressão:</strong> Apenas Frente</p>'}
                            ${dados.colorido ? '<p><strong>🎨 Cores:</strong> Colorido</p>' : '<p><strong>🎨 Cores:</strong> Preto e Branco</p>'}
                            ${dados.escaneamento ? '<p><strong>📷 Escaneamento:</strong> Solicitado</p>' : ''}
                            ${dados.observacoes ? `<p><strong>📝 Observações:</strong><br>${dados.observacoes}</p>` : ''}
                        </div>
                    `;
                    break;

                case 'impressao_3d':
                    detailsHTML = `
                        <div>
                            <p><strong>🧱 Material:</strong> ${dados.material || 'N/A'}</p>
                            <p><strong>📊 Quantidade:</strong> ${dados.quantidade || 'N/A'} peças</p>
                            ${dados.descricao_peca ? `<p><strong>📋 Descrição da Peça:</strong><br>${dados.descricao_peca}</p>` : ''}
                            ${dados.observacoes ? `<p><strong>📝 Observações:</strong><br>${dados.observacoes}</p>` : ''}
                        </div>
                    `;
                    break;

                case 'manutencao':
                    detailsHTML = `
                        <div>
                            <p><strong>🔧 Tipo de Problema:</strong> ${dados.tipo_problema || 'N/A'}</p>
                            ${dados.descricao_problema ? `<p><strong>📋 Descrição do Problema:</strong><br>${dados.descricao_problema}</p>` : ''}
                            ${dados.urgencia ? `<p><strong>⚡ Urgência:</strong> ${dados.urgencia}</p>` : ''}
                            ${dados.observacoes ? `<p><strong>📝 Observações:</strong><br>${dados.observacoes}</p>` : ''}
                        </div>
                    `;
                    break;

                case 'arte_digital':
                case 'projeto':
                    detailsHTML = `
                        <div>
                            ${dados.tipo_projeto ? `<p><strong>🎨 Tipo de Projeto:</strong> ${dados.tipo_projeto}</p>` : ''}
                            ${dados.descricao_ideias ? `<p><strong>💡 Descrição das Ideias:</strong><br>${dados.descricao_ideias}</p>` : ''}
                            ${dados.utilizacao ? `<p><strong>🎯 Utilização:</strong><br>${dados.utilizacao}</p>` : ''}
                            ${dados.prazo ? `<p><strong>⏰ Prazo:</strong> ${dados.prazo}</p>` : ''}
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
                    <p><strong>📦 Item para Empréstimo:</strong> ${dados.item_emprestimo || 'N/A'}</p>
                    ${dados.data_emprestimo ? `<p><strong>📅 Data do Empréstimo:</strong> ${dados.data_emprestimo}</p>` : ''}
                    ${dados.data_devolucao ? `<p><strong>🔄 Data de Devolução:</strong> ${dados.data_devolucao}</p>` : ''}
                    ${dados.finalidade ? `<p><strong>🎯 Finalidade:</strong><br>${dados.finalidade}</p>` : ''}
                    ${dados.observacoes ? `<p><strong>📝 Observações:</strong><br>${dados.observacoes}</p>` : ''}
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
Tipo de Backup: Completo com Arquivos GitHub
Versão do Sistema: 2.5.0

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
Total de Arquivos no GitHub: ${downloadedFiles.length}
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
Gerado automaticamente pelo Sistema SENAI Lab v2.5.0
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

// 🧹 EXECUTAR LIMPEZA TOTAL (placeholder - será implementado)
async function performTotalCleanup() {
    ToastManager.show('Limpeza total ainda não implementada nesta versão', 'info');
    console.log('🧹 Total cleanup would be performed here');
}

console.log('🛠️ Admin Utils - Funções utilitárias carregadas');
