/* 🔧 SENAI Lab Admin - Sistema de Exportação
 * Arquivo: public/assets/js/admin/export.js
 * Descrição: Funções de exportação para Excel e PDF com configurações avançadas
 */

// 📊 EXPORTAÇÃO DE DADOS
function exportToExcel() {
    ToastManager.show('Preparando exportação para Excel...', 'info');

    // Registrar ação de auditoria
    AdminAuth.logUserAction('exportData', {
        description: `Exportação Excel iniciada com ${filteredRequests.length} registros`,
        format: 'excel',
        recordCount: filteredRequests.length
    });

    // Criar dados para exportação
    const exportData = filteredRequests.map(request => ({
        'ID': request.id,
        'Data': formatDate(request.d),
        'Colaborador': request.c,
        'Email': request.e,
        'WhatsApp': request.w || '',
        'Serviço': getServiceName(request.s, request.ts),
        'Status': request.admin?.status || 'pendente',
        'Prioridade': request.admin?.prioridade || '',
        'Comentários': request.admin?.comentarios?.length || 0
    }));

    // Converter para CSV (simulação - em produção use uma lib como XLSX)
    const csv = convertToCSV(exportData);
    downloadFile(csv, 'senai-lab-solicitacoes.csv', 'text/csv');

    ToastManager.show('Arquivo Excel exportado com sucesso!', 'success');
}

function exportToPDF() {
    // Atualizar informações no modal
    updatePDFConfigModal();
    // Abrir modal de configurações
    openModal('pdfConfigModal');
}

function updatePDFConfigModal() {
    const stats = {
        total: filteredRequests.length,
        pendente: filteredRequests.filter(r => !r.admin?.status || r.admin.status === 'pendente').length,
        em_andamento: filteredRequests.filter(r => r.admin?.status === 'em_andamento').length,
        concluido: filteredRequests.filter(r => r.admin?.status === 'concluido').length,
        cancelado: filteredRequests.filter(r => r.admin?.status === 'cancelado').length
    };

    // Atualizar contadores
    document.getElementById('pdfTotalRequests').textContent = stats.total;
    document.getElementById('pdfPendingCount').textContent = stats.pendente;
    document.getElementById('pdfProgressCount').textContent = stats.em_andamento;
    document.getElementById('pdfCompletedCount').textContent = stats.concluido;

    // Verificar filtros aplicados
    const activeFilters = [];
    const serviceFilter = document.getElementById('filterService').value;
    const statusFilter = document.getElementById('filterStatus').value;
    const priorityFilter = document.getElementById('filterPriority').value;
    const periodFilter = document.getElementById('filterPeriod').value;

    if (serviceFilter) activeFilters.push(`Serviço: ${serviceFilter}`);
    if (statusFilter) activeFilters.push(`Status: ${statusFilter}`);
    if (priorityFilter) activeFilters.push(`Prioridade: ${priorityFilter}`);
    if (periodFilter && periodFilter !== 'todos') activeFilters.push(`Período: ${periodFilter}`);

    document.getElementById('pdfFilters').textContent = activeFilters.length > 0 ? activeFilters.join(', ') : 'Nenhum';

    // Definir período
    if (periodFilter === 'hoje') {
        document.getElementById('pdfPeriod').textContent = 'Hoje';
    } else if (periodFilter === 'semana') {
        document.getElementById('pdfPeriod').textContent = 'Esta semana';
    } else if (periodFilter === 'mes') {
        document.getElementById('pdfPeriod').textContent = 'Este mês';
    } else {
        document.getElementById('pdfPeriod').textContent = 'Todos os registros';
    }
}

function generatePDFWithConfig() {
    const includeStats = document.getElementById('pdfIncludeStats').checked;
    const includeDetails = document.getElementById('pdfIncludeDetails').checked;
    const colorStatus = document.getElementById('pdfColorStatus').checked;

    // Fechar modal
    closeModal('pdfConfigModal');

    // Aguardar a biblioteca carregar se necessário
    const checkAndGeneratePDF = () => {
        if (typeof window.jspdf !== 'undefined' || typeof window.jsPDF !== 'undefined') {
            generatePDFReportNow(includeStats, includeDetails, colorStatus);
        } else {
            ToastManager.show('Aguardando biblioteca PDF carregar...', 'info');
            setTimeout(checkAndGeneratePDF, 500);
        }
    };

    checkAndGeneratePDF();
}

function generatePDFReportNow(includeStats = true, includeDetails = true, colorStatus = true) {
    try {
        ToastManager.show('Gerando relatório PDF...', 'info');

        // Registrar ação de auditoria
        AdminAuth.logUserAction('exportData', {
            description: `Exportação PDF iniciada com ${filteredRequests.length} registros`,
            format: 'pdf',
            recordCount: filteredRequests.length,
            includeStats,
            includeDetails,
            colorStatus
        });

        // Verificar se jsPDF está disponível
        if (typeof window.jspdf === 'undefined' && typeof window.jsPDF === 'undefined') {
            throw new Error('Biblioteca jsPDF não carregada');
        }

        // Tentar diferentes formas de acesso à biblioteca
        let jsPDF;
        if (window.jspdf && window.jspdf.jsPDF) {
            jsPDF = window.jspdf.jsPDF;
        } else if (window.jsPDF) {
            jsPDF = window.jsPDF;
        } else {
            throw new Error('jsPDF não encontrado');
        }

        const doc = new jsPDF();

        // Configurar fonte para suportar caracteres especiais
        doc.setFont('helvetica');

        // Cabeçalho do relatório
        const now = new Date();
        const dateStr = now.toLocaleDateString('pt-BR');
        const timeStr = now.toLocaleTimeString('pt-BR');

        // Título principal
        doc.setFontSize(20);
        doc.setTextColor(30, 60, 114); // Cor azul do SENAI
        doc.text('SENAI Lab - Relatorio de Solicitacoes', 20, 25);

        // Linha separadora
        doc.setDrawColor(30, 60, 114);
        doc.setLineWidth(0.5);
        doc.line(20, 30, 190, 30);

        // Informações do relatório
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Gerado em: ${dateStr} as ${timeStr}`, 20, 40);
        doc.text(`Total de solicitacoes: ${filteredRequests.length}`, 20, 45);
        doc.text(`Administrador: Sistema SENAI Lab`, 20, 50);

        // Estatísticas resumidas
        const stats = {
            total: filteredRequests.length,
            pendente: filteredRequests.filter(r => !r.admin?.status || r.admin.status === 'pendente').length,
            em_andamento: filteredRequests.filter(r => r.admin?.status === 'em_andamento').length,
            concluido: filteredRequests.filter(r => r.admin?.status === 'concluido').length,
            cancelado: filteredRequests.filter(r => r.admin?.status === 'cancelado').length
        };

        if (includeStats) {
            // Box de estatísticas
            doc.setDrawColor(200, 200, 200);
            doc.setFillColor(248, 249, 250);
            doc.roundedRect(20, 60, 170, 25, 3, 3, 'FD');

            doc.setFontSize(12);
            doc.setTextColor(51, 51, 51);
            doc.text('Resumo Estatistico:', 25, 70);

            doc.setFontSize(9);
            doc.text(`Pendentes: ${stats.pendente}`, 25, 76);
            doc.text(`Em Andamento: ${stats.em_andamento}`, 70, 76);
            doc.text(`Concluidas: ${stats.concluido}`, 120, 76);
            doc.text(`Canceladas: ${stats.cancelado}`, 160, 76);
        }

        // Preparar dados para a tabela
        let yPosition = includeStats ? 100 : 65;
        const pageHeight = doc.internal.pageSize.height;
        const margin = 20;

        // Detalhamento das solicitações (se habilitado)
        if (includeDetails && filteredRequests.length > 0) {
            // Cabeçalho da tabela
            doc.setFontSize(14);
            doc.setTextColor(30, 60, 114);
            doc.text('Detalhamento das Solicitacoes', 20, yPosition);
            yPosition += 10;

            // Headers da tabela
            doc.setFontSize(8);
            doc.setTextColor(51, 51, 51);
            doc.setFont('helvetica', 'bold');

            const headers = ['Data', 'Colaborador', 'Servico', 'Status', 'Prioridade'];
            const columnWidths = [25, 45, 45, 25, 25];
            let xPosition = 20;

            // Desenhar headers
            headers.forEach((header, index) => {
                doc.text(header, xPosition, yPosition);
                xPosition += columnWidths[index];
            });

            // Linha após headers
            doc.setDrawColor(200, 200, 200);
            doc.line(20, yPosition + 2, 185, yPosition + 2);
            yPosition += 8;

            // Dados da tabela
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(7);

            filteredRequests.forEach((request, index) => {
                // Verificar se precisa de nova página
                if (yPosition > pageHeight - 30) {
                    doc.addPage();
                    yPosition = 30;

                    // Repetir headers na nova página
                    doc.setFont('helvetica', 'bold');
                    doc.setFontSize(8);
                    xPosition = 20;
                    headers.forEach((header, index) => {
                        doc.text(header, xPosition, yPosition);
                        xPosition += columnWidths[index];
                    });
                    doc.line(20, yPosition + 2, 185, yPosition + 2);
                    yPosition += 8;
                    doc.setFont('helvetica', 'normal');
                    doc.setFontSize(7);
                }

                // Dados da linha
                const rowData = [
                    formatDate(request.d),
                    truncateText(request.c, 20),
                    truncateText(getServiceName(request.s, request.ts), 20),
                    getStatusText(request.admin?.status || 'pendente'),
                    request.admin?.prioridade || 'N/A'
                ];

                // Colorir linha alternada
                if (index % 2 === 0) {
                    doc.setFillColor(248, 249, 250);
                    doc.rect(20, yPosition - 4, 165, 6, 'F');
                }

                // Definir cor do texto baseado no status (se habilitado)
                const status = request.admin?.status || 'pendente';
                if (colorStatus) {
                    if (status === 'concluido') {
                        doc.setTextColor(39, 174, 96); // Verde
                    } else if (status === 'cancelado') {
                        doc.setTextColor(231, 76, 60); // Vermelho
                    } else if (status === 'em_andamento') {
                        doc.setTextColor(52, 152, 219); // Azul
                    } else {
                        doc.setTextColor(241, 196, 15); // Amarelo escuro para pendente
                    }
                } else {
                    doc.setTextColor(51, 51, 51); // Cor padrão se coloração desabilitada
                }

                xPosition = 20;
                rowData.forEach((data, colIndex) => {
                    if (colIndex === 3) { // Coluna de status
                        doc.text(data, xPosition, yPosition);
                    } else {
                        doc.setTextColor(51, 51, 51); // Cor padrão para outras colunas
                        doc.text(data, xPosition, yPosition);
                    }
                    xPosition += columnWidths[colIndex];
                });

                yPosition += 6;
            });
        } // Fim do if (includeDetails)

        // Rodapé
        const totalPages = doc.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(100, 100, 100);
            doc.text(`Pagina ${i} de ${totalPages}`, 20, pageHeight - 10);
            doc.text('SENAI Lab - Sistema de Solicitacao de Servicos', 105, pageHeight - 10, { align: 'center' });
            doc.text(`Gerado em ${dateStr}`, 190, pageHeight - 10, { align: 'right' });
        }

        // Salvar o PDF
        const fileName = `senai-lab-relatorio-${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}.pdf`;
        doc.save(fileName);

        ToastManager.show(`Relatório PDF gerado com sucesso! ${filteredRequests.length} solicitações incluídas.`, 'success');

    } catch (error) {
        console.error('Erro ao gerar PDF:', error);
        ToastManager.show('Erro ao gerar PDF: ' + error.message, 'error');
    }
}

// Funções auxiliares para o PDF
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
}

function getStatusText(status) {
    const statusMap = {
        'pendente': 'Pendente',
        'em_andamento': 'Em Andamento',
        'concluido': 'Concluido',
        'cancelado': 'Cancelado'
    };
    return statusMap[status] || status;
}

function convertToCSV(data) {
    if (!data.length) return '';

    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\n');

    return csvContent;
}

function downloadFile(content, fileName, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}


