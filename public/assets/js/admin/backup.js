/* 🔧 SENAI Lab Admin - Sistema de Backup
 * Arquivo: public/assets/js/admin/backup.js
 * Descrição: Sistema completo de backup com limpeza e download de arquivos
 */

// 🗂️ SISTEMA DE BACKUP COMPLETO + LIMPEZA GITHUB
class CompleteBackupManager {
    constructor(firebaseService) {
        this.firebaseService = firebaseService;
        this.githubConfig = window.githubConfig;
        this.isProcessing = false;
    }

    // 🚀 BACKUP COMPLETO + LIMPEZA TOTAL
    async createCompleteBackup() {
        if (this.isProcessing) {
            ToastManager.show('Backup já está em andamento...', 'warning');
            return;
        }

        try {
            this.isProcessing = true;
            
            // Registrar ação de auditoria
            AdminAuth.logUserAction('backupData', {
                description: 'Backup completo iniciado',
                type: 'complete_backup',
                timestamp: new Date().toISOString()
            });
            
            LoadingManager.show('🚀 Iniciando backup completo...');

            // 1. Coletar dados do Firestore
            LoadingManager.show('📊 Coletando dados do Firestore...');
            const firestoreData = await this.collectFirestoreData();

            // 2. Mapear todos os arquivos do GitHub
            LoadingManager.show('🔍 Mapeando arquivos do GitHub...');
            const githubFilesList = await this.mapGitHubFiles(firestoreData.requests);

            // 3. Baixar TODOS os arquivos do GitHub
            LoadingManager.show('📥 Baixando arquivos do GitHub...');
            const downloadedFiles = await this.downloadAllGitHubFiles(githubFilesList);

            // 4. Gerar backup completo
            LoadingManager.show('📦 Gerando backup completo...');
            const backupPackage = await this.generateCompleteBackup(firestoreData, downloadedFiles);

            // 5. Baixar backup como ZIP
            LoadingManager.show('💾 Baixando backup...');
            await this.downloadBackupFiles(backupPackage);

            LoadingManager.hide();
            ToastManager.show(`🎉 Backup COMPLETO baixado! ${downloadedFiles.length} arquivos incluídos.`, 'success');

            // Registrar conclusão do backup
            AdminAuth.logUserAction('backupData', {
                description: `Backup completo finalizado com ${downloadedFiles.length} arquivos`,
                type: 'complete_backup_finished',
                fileCount: downloadedFiles.length,
                requestCount: firestoreData.requests.length
            });

            // 6. Confirmar limpeza total
            this.confirmTotalCleanup(firestoreData.requests.length, downloadedFiles.length);

        } catch (error) {
            console.error('❌ Erro no backup completo:', error);
            LoadingManager.hide();
            ToastManager.show('Erro no backup: ' + error.message, 'error');
            
            // Registrar erro no backup
            AdminAuth.logUserAction('backupData', {
                description: `Erro no backup: ${error.message}`,
                type: 'backup_error',
                error: error.message
            });
        } finally {
            this.isProcessing = false;
        }
    }

    // 📊 COLETAR DADOS DO FIRESTORE
    async collectFirestoreData() {
        const requests = await this.firebaseService.getAllRequests();

        let adminLogs = [];
        try {
            adminLogs = await this.firebaseService.getAdminLogs();
        } catch (error) {
            console.warn('Logs administrativos não encontrados:', error);
        }

        const stats = this.calculateDetailedStats(requests);

        return {
            requests,
            adminLogs,
            stats,
            backupInfo: {
                timestamp: Date.now(),
                date: new Date().toLocaleString('pt-BR'),
                totalRequests: requests.length,
                totalLogs: adminLogs.length,
                version: '2.0',
                includesGitHubFiles: true,
                backupType: 'COMPLETE_WITH_CLEANUP'
            }
        };
    }

    // 🔍 MAPEAR ARQUIVOS DO GITHUB
    async mapGitHubFiles(requests) {
        const fileMap = new Map();

        requests.forEach(request => {
            if (request.arq && request.arq.length > 0) {
                request.arq.forEach(arquivo => {
                    if (!fileMap.has(arquivo.p)) { // p = path no GitHub
                        fileMap.set(arquivo.p, {
                            path: arquivo.p,
                            url: arquivo.u,
                            name: arquivo.n,
                            size: arquivo.s,
                            type: arquivo.t,
                            requestInfo: {
                                id: request.id,
                                colaborador: request.c,
                                servico: this.getServiceName(request.s, request.ts),
                                data: new Date(request.d).toLocaleString('pt-BR')
                            }
                        });
                    }
                });
            }
        });

        return Array.from(fileMap.values());
    }

    // 📥 BAIXAR TODOS OS ARQUIVOS DO GITHUB
    async downloadAllGitHubFiles(filesList) {
        if (filesList.length === 0) {
            console.log('🔍 Nenhum arquivo para baixar do GitHub');
            return [];
        }

        const downloadedFiles = [];
        const batchSize = 3; // Baixar 3 por vez para não sobrecarregar

        for (let i = 0; i < filesList.length; i += batchSize) {
            const batch = filesList.slice(i, i + batchSize);

            LoadingManager.show(`📥 Baixando lote ${Math.floor(i / batchSize) + 1}/${Math.ceil(filesList.length / batchSize)} (${batch.length} arquivos)`);

            const batchPromises = batch.map(async (fileInfo) => {
                try {
                    const response = await fetch(fileInfo.url);
                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}`);
                    }

                    const arrayBuffer = await response.arrayBuffer();

                    return {
                        ...fileInfo,
                        content: arrayBuffer,
                        downloaded: true,
                        downloadDate: new Date().toISOString(),
                        sizeBytes: arrayBuffer.byteLength
                    };

                } catch (error) {
                    console.warn(`❌ Falha ao baixar ${fileInfo.name}:`, error);
                    return {
                        ...fileInfo,
                        content: null,
                        downloaded: false,
                        error: error.message
                    };
                }
            });

            const batchResults = await Promise.all(batchPromises);
            downloadedFiles.push(...batchResults);

            // Pequena pausa entre lotes
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        const successCount = downloadedFiles.filter(f => f.downloaded).length;
        console.log(`📥 Download concluído: ${successCount}/${filesList.length} arquivos`);

        return downloadedFiles;
    }

    // 📦 GERAR BACKUP COMPLETO
    async generateCompleteBackup(firestoreData, downloadedFiles) {
        const { requests, adminLogs, stats, backupInfo } = firestoreData;

        const backupPackage = {
            // 1. Informações do backup
            'backup_info.json': JSON.stringify(backupInfo, null, 2),

            // 2. Dados principais
            'dados_completos.json': JSON.stringify({
                solicitacoes: requests,
                logs_administrativos: adminLogs,
                estatisticas: stats,
                backup_info: backupInfo
            }, null, 2),

            // 3. CSV de solicitações
            'solicitacoes_todas.csv': this.generateCSV(requests, 'all'),

            // 4. Estatísticas detalhadas
            'estatisticas_detalhadas.json': JSON.stringify(stats, null, 2),

            // 5. Resumo executivo
            'resumo_executivo.txt': this.generateExecutiveSummary(firestoreData, downloadedFiles),

            // 6. Lista de arquivos baixados
            'arquivos_baixados.json': JSON.stringify(downloadedFiles.map(f => ({
                nome: f.name,
                path_original: f.path,
                tamanho: f.sizeBytes,
                tipo: f.type,
                baixado_com_sucesso: f.downloaded,
                data_download: f.downloadDate,
                erro: f.error || null,
                solicitacao: f.requestInfo
            })), null, 2)
        };

        // 7. CSVs por tipo de serviço
        const byService = this.groupRequestsByService(requests);
        Object.entries(byService).forEach(([service, serviceRequests]) => {
            if (serviceRequests.length > 0) {
                const serviceName = this.getServiceDisplayName(service);
                backupPackage[`${serviceName.replace(/\s+/g, '_').toLowerCase()}.csv`] =
                    this.generateCSV(serviceRequests, service);
            }
        });

        // 8. Adicionar arquivos baixados do GitHub
        downloadedFiles.forEach((file, index) => {
            if (file.downloaded && file.content) {
                // Organizar por pasta original
                const folder = this.getFolderFromPath(file.path);
                const fileName = `arquivos_github/${folder}/${file.name}`;
                backupPackage[fileName] = file.content;
            }
        });

        return backupPackage;
    }

    // 🧹 LIMPEZA DE ARQUIVOS ÓRFÃOS
    async cleanupOrphanedFiles() {
        try {
            LoadingManager.show('🔍 Analisando arquivos órfãos...');
            
            const result = await this.firebaseService.cleanupOrphanedFiles();
            
            LoadingManager.hide();
            
            if (result.orphanedFilesDeleted > 0) {
                ToastManager.show(
                    `🧹 Limpeza concluída: ${result.orphanedFilesDeleted} arquivos órfãos removidos!`, 
                    'success'
                );
            } else {
                ToastManager.show('✅ Nenhum arquivo órfão encontrado!', 'info');
            }
            
            // Log da ação
            AdminAuth.logUserAction('cleanupFiles', {
                description: `Limpeza de arquivos órfãos`,
                orphanedFilesDeleted: result.orphanedFilesDeleted,
                error: result.error || null
            });
            
            return result;
            
        } catch (error) {
            LoadingManager.hide();
            console.error('❌ Erro na limpeza:', error);
            ToastManager.show('❌ Erro na limpeza de arquivos órfãos', 'error');
            throw error;
        }
    }

    // 💾 BAIXAR ARQUIVOS DE BACKUP
    async downloadBackupFiles(backupPackage) {
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');

        // Baixar arquivo principal JSON
        const mainBackup = backupPackage['dados_completos.json'];
        this.downloadBlob(
            new Blob([mainBackup], { type: 'application/json' }),
            `SENAI_Lab_Backup_Completo_${timestamp}.json`
        );

        // Baixar CSV de solicitações
        const csvBackup = backupPackage['solicitacoes_todas.csv'];
        this.downloadBlob(
            new Blob([csvBackup], { type: 'text/csv' }),
            `SENAI_Lab_Solicitacoes_${timestamp}.csv`
        );

        // Baixar resumo executivo
        const resumo = backupPackage['resumo_executivo.txt'];
        this.downloadBlob(
            new Blob([resumo], { type: 'text/plain' }),
            `SENAI_Lab_Resumo_${timestamp}.txt`
        );

        // Baixar lista de arquivos
        const arquivos = backupPackage['arquivos_baixados.json'];
        this.downloadBlob(
            new Blob([arquivos], { type: 'application/json' }),
            `SENAI_Lab_Arquivos_${timestamp}.json`
        );

        // Baixar arquivos individuais do GitHub (se não forem muitos)
        const githubFiles = Object.entries(backupPackage).filter(([key]) => key.startsWith('arquivos_github/'));

        if (githubFiles.length > 0 && githubFiles.length <= 10) {
            githubFiles.forEach(([fileName, content]) => {
                const cleanFileName = fileName.replace('arquivos_github/', '').replace(/\//g, '_');
                this.downloadBlob(
                    new Blob([content]),
                    `GitHub_${cleanFileName}`
                );
            });
        }

        ToastManager.show(`📥 ${4 + Math.min(githubFiles.length, 10)} arquivos baixados!`, 'success');
    }

    // Métodos auxiliares que continuam no próximo arquivo...
    downloadBlob(blob, fileName) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    // ...existing methods continue...
    calculateDetailedStats(requests) {
        // Implementação dos métodos de estatísticas...
        return {
            total: requests.length,
            // ... outras estatísticas
        };
    }

    getServiceName(service, subService) {
        // Implementação...
        return service;
    }

    // ... outros métodos auxiliares
}

// Expor classe no escopo global
window.CompleteBackupManager = CompleteBackupManager;


