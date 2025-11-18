// 🔥 SERVIÇOS FIREBASE CENTRALIZADOS
// Arquivo: public/shared/firebase-service.js

// 🧪 CONFIGURAÇÃO DE AMBIENTE
const ENVIRONMENT_CONFIG = {
  // Altere para 'production' ou 'test' conforme necessário
  mode: 'production', // 'production' ou 'test'
  collections: {
    production: 'solicitacoes',
    test: 'solicitacoes_test'
  }
};

class FirebaseService {
  constructor() {
    this.isMockMode = ENVIRONMENT_CONFIG.mode === 'mock';

    if (this.isMockMode) {
      this.initMockMode();
      return;
    }

    // Firebase Hosting auto-inicializa via /__/firebase/init.js
    // Se window.firebaseConfig existir (dev local), usar ela
    if (window.firebaseConfig && !firebase.apps.length) {
      firebase.initializeApp(window.firebaseConfig);
    }

    // Verificar se Firebase foi inicializado (hosting ou local)
    if (!firebase.apps.length) {
      throw new Error('Firebase not initialized. Make sure /__/firebase/init.js loaded or firebase-config.js exists.');
    }
    
    // Configuração moderna do Firestore 
    this.db = firebase.firestore();
    
    // Configurar settings básicas (sem cache persistente para evitar warnings)
    this.db.settings({
      ignoreUndefinedProperties: true
    });
    
    this.collectionName = ENVIRONMENT_CONFIG.collections[ENVIRONMENT_CONFIG.mode];
    
    // Teste de conectividade automático
    this.testConnection();
  }

  // 🧪 INICIALIZAR MODO MOCK
  initMockMode() {
    this.mockData = this.generateMockData();
  }

  // 📊 GERAR DADOS FICTÍCIOS
  generateMockData() {
    const services = ['impressao', 'formatacao', 'instalacao', 'manutencao'];
    const statuses = ['pendente', 'aprovado', 'em_andamento', 'concluido', 'cancelado'];
    const priorities = ['baixa', 'media', 'alta'];
    
    const mockRequests = [];
    
    for (let i = 1; i <= 20; i++) {
      const baseDate = Date.now() - (Math.random() * 30 * 24 * 60 * 60 * 1000); // Últimos 30 dias
      
      mockRequests.push({
        id: `mock_${i}`,
        n: `Usuario Teste ${i}`,
        e: `usuario${i}@teste.com`,
        s: services[Math.floor(Math.random() * services.length)],
        ts: `Serviço específico ${i}`,
        d: Math.floor(baseDate),
        descricao: `Descrição da solicitação fictícia número ${i} para teste do sistema.`,
        admin: {
          status: statuses[Math.floor(Math.random() * statuses.length)],
          prioridade: priorities[Math.floor(Math.random() * priorities.length)],
          data_criacao: Math.floor(baseDate),
          data_atualizacao: Math.floor(baseDate + Math.random() * 7 * 24 * 60 * 60 * 1000),
          responsavel: 'Admin Teste',
          comentarios: [
            {
              texto: `Comentário de teste para solicitação ${i}`,
              timestamp: Math.floor(baseDate + Math.random() * 3 * 24 * 60 * 60 * 1000),
              autor: 'Admin Teste'
            }
          ]
        },
        arq: i % 3 === 0 ? [
          {
            n: `arquivo_teste_${i}.pdf`,
            s: Math.floor(Math.random() * 1000000),
            p: `uploads/mock/arquivo_teste_${i}.pdf`
          }
        ] : []
      });
    }
    
    return mockRequests;
  }

  // 🧪 TESTE DE CONECTIVIDADE
  async testConnection() {
    try {
      await this.db.collection(this.collectionName).limit(1).get();
      return true;
    } catch (error) {
      if (window.Logger) {
        window.Logger.warn('Possível problema de conexão/permissão:', error.code);
        if (error.code === 'permission-denied') {
          window.Logger.warn('ATENÇÃO: Verifique as regras do Firestore no Console Firebase');
        }
      }
      return false;
    }
  }

  // 📊 OPERAÇÕES DE LEITURA
  async getAllRequests() {
    if (this.isMockMode) {
      return Promise.resolve([...this.mockData]);
    }
    
    // 🎯 ESTRATÉGIA UNIFICADA: Lista de coleções para tentar em ordem
    const collectionsToTry = [this.collectionName];

    let lastError = null;

    for (const collection of collectionsToTry) {
      try {
        const snapshot = await this.db.collection(collection).orderBy('d', 'desc').get();
        
        return snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        lastError = error;
        continue; // Tentar próxima coleção
      }
    }

    // 🚨 Todas as tentativas falharam
    if (window.Logger) {
      window.Logger.error('Erro em todas as coleções tentadas:', lastError);
    }
    throw new Error(`Falha ao acessar dados: ${lastError.message}`);
  }

  async getRequestById(id) {
    if (this.isMockMode) {
      const request = this.mockData.find(req => req.id === id);
      return Promise.resolve(request || null);
    }
    
    // 🎯 USAR MESMA ESTRATÉGIA DE FALLBACK
    const collectionsToTry = this.collectionName === 'solicitacoes_test' 
      ? ['solicitacoes_test', 'solicitacoes'] 
      : ['solicitacoes'];

    for (const collection of collectionsToTry) {
      try {
        const doc = await this.db.collection(collection).doc(id).get();
        if (doc.exists) {
          return { id: doc.id, ...doc.data() };
        }
      } catch (error) {
        continue;
      }
    }

    // Não encontrado em nenhuma coleção
    return null;
  }

  async getRequestsByFilter(filters = {}) {
    try {
      let query = this.db.collection(this.collectionName);

      // Aplicar filtros
      if (filters.service) {
        query = query.where('s', '==', filters.service);
      }

      if (filters.startDate) {
        query = query.where('d', '>=', filters.startDate);
      }

      if (filters.endDate) {
        query = query.where('d', '<=', filters.endDate);
      }

      const snapshot = await query.orderBy('d', 'desc').get();
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      if (window.Logger) {
        window.Logger.error('Erro ao buscar solicitações com filtro:', error);
      }
      throw error;
    }
  }

  // ✍️ OPERAÇÕES DE ESCRITA
  async createRequest(data) {
    try {
      const docRef = await this.db.collection(this.collectionName).add({
        ...data,
        d: Date.now(),
        st: 'p', // status: pendente
        admin: {
          status: 'pendente',
          prioridade: 'baixa', // Prioridade baixa por padrão
          data_criacao: Date.now(),
          timestamps: {
            created: Date.now(),
            approved: null,
            started: null,
            completed: null,
            cancelled: null,
            reopened: null
          }
        }
      });
      
      return docRef.id;
    } catch (error) {
      if (window.Logger) {
        window.Logger.error('Erro ao criar solicitação:', error);
      }
      throw error;
    }
  }

  async updateRequestStatus(requestId, status, adminData = {}) {
    try {
      // Primeiro, buscar o status atual para o log
      const currentDoc = await this.db.collection(this.collectionName).doc(requestId).get();
      const currentData = currentDoc.data();
      const oldStatus = currentData?.admin?.status || 'pendente';
      const currentTimestamp = Date.now();
      
      const updateData = {
        'admin.status': status,
        'admin.data_atualizacao': currentTimestamp,
        'admin.ultimaAtualizacao': currentTimestamp,
        'admin.responsavel': adminData.responsavel || 'Administrador'
      };

      // Inicializar estrutura de timestamps se não existir
      if (!currentData?.admin?.timestamps) {
        updateData['admin.timestamps'] = {
          created: currentData?.d || currentTimestamp,
          approved: null,
          started: null,
          completed: null,
          cancelled: null,
          reopened: null
        };
      }

      // Atualizar timestamp específico baseado no status
      switch (status) {
        case 'aprovado':
          updateData['admin.timestamps.approved'] = currentTimestamp;
          break;
        case 'em_andamento':
          updateData['admin.timestamps.started'] = currentTimestamp;
          break;
        case 'concluido':
          updateData['admin.timestamps.completed'] = currentTimestamp;
          break;
        case 'cancelado':
          updateData['admin.timestamps.cancelled'] = currentTimestamp;
          break;
        case 'reaberto':
          updateData['admin.timestamps.reopened'] = currentTimestamp;
          // Reset completed/cancelled se foi reaberto
          updateData['admin.timestamps.completed'] = null;
          updateData['admin.timestamps.cancelled'] = null;
          break;
      }

      // Adicionar à timeline de histórico
      if (!currentData?.admin?.status_history) {
        updateData['admin.status_history'] = [];
      }

      updateData['admin.status_history'] = firebase.firestore.FieldValue.arrayUnion({
        status: status,
        timestamp: currentTimestamp,
        admin: adminData.responsavel || 'Administrador',
        comment: adminData.comment || null,
        previous_status: oldStatus
      });

      // Adicionar comentário se fornecido
      if (adminData.comment) {
        updateData['admin.comentarios'] = firebase.firestore.FieldValue.arrayUnion({
          texto: adminData.comment,
          timestamp: currentTimestamp,
          autor: adminData.responsavel || 'Administrador',
          tipo: 'status_change',
          status_anterior: oldStatus,
          status_novo: status
        });
      }

      // Adicionar prioridade se fornecida
      if (adminData.priority) {
        updateData['admin.prioridade'] = adminData.priority;
      }

      // Inicializar logs se não existir
      if (!currentData?.admin?.logs) {
        updateData['admin.logs'] = [];
      }

      // Adicionar log detalhado da mudança
      updateData['admin.logs'] = firebase.firestore.FieldValue.arrayUnion({
        timestamp: currentTimestamp,
        action: 'status_update',
        details: {
          old_status: oldStatus,
          new_status: status,
          comment: adminData.comment || null,
          admin: adminData.responsavel || adminData.admin || 'Administrador'
        }
      });

      await this.db.collection(this.collectionName).doc(requestId).update(updateData);
      
      // Log da ação administrativa
      await this.logAdminAction(requestId, 'status_update', {
        old_status: oldStatus,
        new_status: status,
        comment: adminData.comment || null,
        admin: adminData.responsavel || adminData.admin || 'Administrador'
      });


      return true;
    } catch (error) {
      if (window.Logger) {
        window.Logger.error('Erro ao atualizar status:', error);
      }
      throw error;
    }
  }

  async addComment(requestId, comment, author = 'Administrador') {
    try {
      await this.db.collection(this.collectionName).doc(requestId).update({
        'admin.comentarios': firebase.firestore.FieldValue.arrayUnion({
          texto: comment,
          timestamp: Date.now(),
          autor: author
        }),
        'admin.data_atualizacao': Date.now()
      });

      // Log da ação
      await this.logAdminAction(requestId, 'comment_added', {
        comment,
        admin: author
      });

      return true;
    } catch (error) {
      if (window.Logger) {
        window.Logger.error('Erro ao adicionar comentário:', error);
      }
      throw error;
    }
  }

  async setPriority(requestId, priority, author = 'Administrador') {
    try {
      await this.db.collection(this.collectionName).doc(requestId).update({
        'admin.prioridade': priority,
        'admin.data_atualizacao': Date.now(),
        'admin.responsavel': author
      });

      await this.logAdminAction(requestId, 'priority_set', {
        priority,
        admin: author
      });


      return true;
    } catch (error) {
      if (window.Logger) {
        window.Logger.error('Erro ao definir prioridade:', error);
      }
      throw error;
    }
  }

  // 🗑️ DELETAR SOLICITAÇÃO
  async deleteRequest(requestId) {
    try {
      // 1. Buscar dados da solicitação antes de deletar para pegar arquivos
      const requestDoc = await this.db.collection(this.collectionName).doc(requestId).get();
      
      if (!requestDoc.exists) {
        throw new Error('Solicitação não encontrada');
      }
      
      const requestData = requestDoc.data();
      
      // 2. Deletar arquivos do Firebase Storage se houver
      let deletedFilesCount = 0;
      if (requestData.arq && requestData.arq.length > 0) {

        
        for (const arquivo of requestData.arq) {
          try {
            if (arquivo.p) { // p = path no storage
              const storage = window.storage || firebase.storage();
              const fileRef = storage.ref(arquivo.p);
              await fileRef.delete();
              deletedFilesCount++;

            }
          } catch (fileError) {
            if (window.Logger) {
              window.Logger.warn(`Falha ao deletar arquivo ${arquivo.n}:`, fileError.message);
            }
            // Continuar mesmo se um arquivo falhar
          }
        }
      }
      
      // 3. Deletar documento do Firestore
      await this.db.collection(this.collectionName).doc(requestId).delete();
      
      // 4. Log da ação com detalhes dos arquivos
      await this.logAdminAction(requestId, 'request_deleted', {
        admin: 'Sistema',
        filesDeleted: deletedFilesCount,
        totalFiles: requestData.arq ? requestData.arq.length : 0
      });

      return {
        success: true,
        filesDeleted: deletedFilesCount,
        totalFiles: requestData.arq ? requestData.arq.length : 0
      };
    } catch (error) {
      if (window.Logger) {
        window.Logger.error('Erro ao deletar solicitação:', error);
      }
      throw error;
    }
  }

  // 🧹 DELETAR MÚLTIPLAS SOLICITAÇÕES (BATCH)
  async deleteMultipleRequests(requestIds) {
    try {
      const batch = this.db.batch();
      let totalFilesDeleted = 0;
      let totalFiles = 0;
      
      // 1. Buscar todas as solicitações e coletar arquivos para deletar
      const requests = await Promise.all(
        requestIds.map(id => this.db.collection(this.collectionName).doc(id).get())
      );
      
      // 2. Deletar arquivos do Storage
      for (const requestDoc of requests) {
        if (requestDoc.exists) {
          const requestData = requestDoc.data();
          if (requestData.arq && requestData.arq.length > 0) {
            totalFiles += requestData.arq.length;
            
            for (const arquivo of requestData.arq) {
              try {
                if (arquivo.p) {
                  const storage = window.storage || firebase.storage();
                  const fileRef = storage.ref(arquivo.p);
                  await fileRef.delete();
                  totalFilesDeleted++;
                }
              } catch (fileError) {
                if (window.Logger) {
              window.Logger.warn(`Falha ao deletar arquivo ${arquivo.n}:`, fileError.message);
            }
              }
            }
          }
          
          // Adicionar ao batch para deletar do Firestore
          batch.delete(requestDoc.ref);
        }
      }

      // 3. Executar batch delete no Firestore
      await batch.commit();
      
      // 4. Log da ação
      await this.logAdminAction('BATCH', 'multiple_requests_deleted', {
        count: requestIds.length,
        filesDeleted: totalFilesDeleted,
        totalFiles: totalFiles,
        admin: 'Sistema'
      });


      return {
        success: true,
        requestsDeleted: requestIds.length,
        filesDeleted: totalFilesDeleted,
        totalFiles: totalFiles
      };
    } catch (error) {
      if (window.Logger) {
        window.Logger.error('Erro ao deletar solicitações em batch:', error);
      }
      throw error;
    }
  }

  // 📝 SISTEMA DE LOGS
  async logAdminAction(requestId, action, details = {}) {
    try {
      await this.db.collection('admin_logs').add({
        solicitacao_id: requestId,
        acao: action,
        detalhes: details,
        timestamp: Date.now(),
        admin: details.admin || 'Administrador'
      });
    } catch (error) {
      if (window.Logger) {
        window.Logger.warn('Erro ao registrar log:', error);
      }
      // Não falhar a operação principal por causa do log
    }
  }

  async getAdminLogs(requestId = null, limit = 100) {
    try {
      let query = this.db.collection('admin_logs');
      
      if (requestId) {
        // Para requestId específico, não usar orderBy para evitar índice composto
        query = query.where('solicitacao_id', '==', requestId).limit(limit);
      } else {
        // Para todos os logs, usar apenas orderBy por timestamp
        query = query.orderBy('timestamp', 'desc').limit(limit);
      }
      
      const snapshot = await query.get();
      
      let results = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Se buscou por requestId específico, ordenar localmente
      if (requestId) {
        results = results.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
      }
      
      return results;
    } catch (error) {
      if (window.Logger) {
        window.Logger.error('Erro ao buscar logs:', error);
      }
      return [];
    }
  }

  // 🧹 LIMPEZA DE ARQUIVOS ÓRFÃOS (OPCIONAL)
  async cleanupOrphanedFiles() {
    try {

      
      // 1. Buscar todas as solicitações
      const requests = await this.getAllRequests();
      
      // 2. Coletar todos os paths de arquivos válidos
      const validPaths = new Set();
      requests.forEach(request => {
        if (request.arq && request.arq.length > 0) {
          request.arq.forEach(arquivo => {
            if (arquivo.p) validPaths.add(arquivo.p);
          });
        }
      });
      
      // 3. Listar arquivos no Storage
      const storage = window.storage || firebase.storage();
      const listRef = storage.ref('uploads/');
      
      try {
        const listResult = await listRef.listAll();
        let orphanedCount = 0;
        
        // 4. Deletar arquivos órfãos
        for (const fileRef of listResult.items) {
          const fullPath = fileRef.fullPath;
          
          if (!validPaths.has(fullPath)) {
            try {
              await fileRef.delete();
              orphanedCount++;
            } catch (deleteError) {
              if (window.Logger) {
                window.Logger.warn(`Falha ao deletar arquivo órfão ${fullPath}:`, deleteError.message);
              }
            }
          }
        }

        return { orphanedFilesDeleted: orphanedCount };

      } catch (listError) {
        if (window.Logger) {
          window.Logger.warn('Não foi possível listar arquivos do Storage:', listError.message);
        }
        return { orphanedFilesDeleted: 0, error: 'Lista não disponível' };
      }

    } catch (error) {
      if (window.Logger) {
        window.Logger.error('Erro na limpeza de arquivos órfãos:', error);
      }
      throw error;
    }
  }

  // 📊 ESTATÍSTICAS E RELATÓRIOS
  async getStatistics(period = 'month') {
    try {
      const requests = await this.getAllRequests();
      
      // Calcular período
      const now = new Date();
      let startDate;
      
      switch (period) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'week':
          startDate = new Date(now);
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        default:
          startDate = new Date(0); // Todos os registros
      }

      const periodRequests = requests.filter(r => new Date(r.d) >= startDate);
      
      return {
        total: requests.length,
        period: {
          total: periodRequests.length,
          pendente: periodRequests.filter(r => !r.admin?.status || r.admin.status === 'pendente').length,
          em_andamento: periodRequests.filter(r => r.admin?.status === 'em_andamento').length,
          concluido: periodRequests.filter(r => r.admin?.status === 'concluido').length,
          cancelado: periodRequests.filter(r => r.admin?.status === 'cancelado').length
        },
        by_service: this.groupByService(periodRequests),
        by_day: this.groupByDay(periodRequests),
        avg_response_time: this.calculateAverageResponseTime(periodRequests)
      };
    } catch (error) {
      if (window.Logger) {
        window.Logger.error('Erro ao calcular estatísticas:', error);
      }
      throw error;
    }
  }

  // 🔧 FUNÇÕES AUXILIARES
  groupByService(requests) {
    const groups = {};
    requests.forEach(request => {
      const service = request.s;
      const subService = request.ts;
      const key = subService ? `${service}_${subService}` : service;
      
      groups[key] = (groups[key] || 0) + 1;
    });
    return groups;
  }

  groupByDay(requests) {
    const groups = {};
    requests.forEach(request => {
      const date = new Date(request.d).toISOString().split('T')[0];
      groups[date] = (groups[date] || 0) + 1;
    });
    return groups;
  }

  calculateAverageResponseTime(requests) {
    const completedRequests = requests.filter(r => 
      r.admin?.status === 'concluido' && r.admin?.data_atualizacao
    );

    if (completedRequests.length === 0) return 0;

    const totalTime = completedRequests.reduce((sum, request) => {
      const responseTime = request.admin.data_atualizacao - request.d;
      return sum + responseTime;
    }, 0);

    return Math.round(totalTime / completedRequests.length / (1000 * 60 * 60)); // Horas
  }

  // 🔄 LISTENERS EM TEMPO REAL
  onRequestsChange(callback) {
    return this.db.collection(this.collectionName)
      .orderBy('d', 'desc')
      .onSnapshot(snapshot => {
        const requests = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        callback(requests);
      }, error => {
        if (window.Logger) {
          window.Logger.error('Erro no listener:', error);
        }
      });
  }

  onRequestChange(requestId, callback) {
    return this.db.collection(this.collectionName)
      .doc(requestId)
      .onSnapshot(doc => {
        if (doc.exists) {
          callback({ id: doc.id, ...doc.data() });
        }
      }, error => {
        if (window.Logger) {
          window.Logger.error('Erro no listener:', error);
        }
      });
  }

  // 🧹 LIMPEZA
  detachListeners(unsubscribeFunctions) {
    unsubscribeFunctions.forEach(unsubscribe => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    });
  }
}

// 🌟 EXPORT GLOBAL PARA COMPATIBILIDADE
if (typeof window !== 'undefined') {
  window.FirebaseService = FirebaseService;
  
  // 🚀 FUNÇÃO DE INICIALIZAÇÃO GLOBAL
  window.initializeFirebaseService = async function() {
    try {
      const service = new FirebaseService();
      
      // Aguardar teste de conectividade
      await service.testConnection();

      return service;
    } catch (error) {
      if (window.Logger) {
        window.Logger.error('Erro ao inicializar Firebase Service:', error);
      }
      throw error;
    }
  };
}
