// 🔥 SERVIÇOS FIREBASE CENTRALIZADOS
// Arquivo: public/shared/firebase-service.js

// 🧪 CONFIGURAÇÃO DE AMBIENTE
const ENVIRONMENT_CONFIG = {
  // Altere para 'production' ou 'test' conforme necessário
  mode: 'test', // 'production' ou 'test'
  collections: {
    production: 'solicitacoes',
    test: 'solicitacoes_test'
  }
};

class FirebaseService {
  constructor() {
    if (!window.firebaseConfig) {
      throw new Error('Firebase configuration not found');
    }
    
    if (!firebase.apps.length) {
      firebase.initializeApp(window.firebaseConfig);
    }
    
    this.db = firebase.firestore();
    this.collectionName = ENVIRONMENT_CONFIG.collections[ENVIRONMENT_CONFIG.mode];
    this.enableOfflineSupport();
    
    // Log do ambiente atual
    console.log(`🔥 Firebase Service iniciado em modo: ${ENVIRONMENT_CONFIG.mode.toUpperCase()}`);
    console.log(`📂 Coleção: ${this.collectionName}`);
    
    // Teste de conectividade automático
    this.testConnection();
  }

  // 🧪 TESTE DE CONECTIVIDADE
  async testConnection() {
    try {
      console.log('🧪 Testando conectividade Firebase...');
      const testDoc = await this.db.collection(this.collectionName).limit(1).get();
      console.log('✅ Conexão Firebase OK - Regras funcionando');
      return true;
    } catch (error) {
      console.warn('⚠️ Possível problema de conexão/permissão:', error.code);
      if (error.code === 'permission-denied') {
        console.warn('🔒 ATENÇÃO: Verifique as regras do Firestore no Console Firebase');
        console.warn('📋 Instruções em: CORRECAO-PERMISSOES-FIREBASE.md');
      }
      return false;
    }
  }

  // 🔧 CONFIGURAÇÃO INICIAL
  async enableOfflineSupport() {
    try {
      await this.db.enablePersistence();
      console.log('✅ Cache offline ativado');
    } catch (err) {
      console.warn('⚠️ Cache offline não disponível:', err.code);
    }
  }

  // 📊 OPERAÇÕES DE LEITURA
  async getAllRequests() {
    // 🎯 ESTRATÉGIA UNIFICADA: Lista de coleções para tentar em ordem
    const collectionsToTry = this.collectionName === 'solicitacoes_test' 
      ? ['solicitacoes_test', 'solicitacoes'] 
      : ['solicitacoes'];

    let lastError = null;

    for (const collection of collectionsToTry) {
      try {
        console.log(`🔍 Tentando coleção: ${collection}`);
        const snapshot = await this.db.collection(collection).orderBy('d', 'desc').get();
        console.log(`✅ Sucesso em ${collection}: ${snapshot.docs.length} solicitações`);
        
        // � CACHE: Se não é a coleção principal, atualizar referência
        if (collection !== this.collectionName) {
          console.log(`🔄 Coleção ${this.collectionName} indisponível, usando ${collection}`);
        }

        return snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        console.warn(`❌ Falha na coleção ${collection}:`, error.code);
        lastError = error;
        continue; // Tentar próxima coleção
      }
    }

    // 🚨 Todas as tentativas falharam
    console.error('❌ Erro em todas as coleções tentadas:', lastError);
    throw new Error(`Falha ao acessar dados: ${lastError.message}`);
  }

  async getRequestById(id) {
    // 🎯 USAR MESMA ESTRATÉGIA DE FALLBACK
    const collectionsToTry = this.collectionName === 'solicitacoes_test' 
      ? ['solicitacoes_test', 'solicitacoes'] 
      : ['solicitacoes'];

    for (const collection of collectionsToTry) {
      try {
        console.log(`� Buscando ID ${id} na coleção: ${collection}`);
        const doc = await this.db.collection(collection).doc(id).get();
        if (doc.exists) {
          console.log(`✅ Documento encontrado em ${collection}`);
          return { id: doc.id, ...doc.data() };
        }
      } catch (error) {
        console.warn(`❌ Falha ao buscar em ${collection}:`, error.code);
        continue;
      }
    }

    // Não encontrado em nenhuma coleção
    console.log(`❌ Documento ${id} não encontrado em nenhuma coleção`);
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
      console.error('❌ Erro ao buscar solicitações com filtro:', error);
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
      
      console.log('✅ Solicitação criada:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('❌ Erro ao criar solicitação:', error);
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
          admin: adminData.responsavel || 'Administrador'
        }
      });

      await this.db.collection(this.collectionName).doc(requestId).update(updateData);
      
      // Log da ação administrativa
      await this.logAdminAction(requestId, 'status_update', {
        old_status: oldStatus,
        new_status: status,
        comment: adminData.comment,
        admin: adminData.responsavel || 'Administrador',
        timestamp: currentTimestamp
      });

      console.log('✅ Status atualizado:', requestId, `${oldStatus} → ${status}`);
      return true;
    } catch (error) {
      console.error('❌ Erro ao atualizar status:', error);
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

      console.log('✅ Comentário adicionado:', requestId);
      return true;
    } catch (error) {
      console.error('❌ Erro ao adicionar comentário:', error);
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

      console.log('✅ Prioridade definida:', requestId);
      return true;
    } catch (error) {
      console.error('❌ Erro ao definir prioridade:', error);
      throw error;
    }
  }

  // 🗑️ DELETAR SOLICITAÇÃO
  async deleteRequest(requestId) {
    try {
      await this.db.collection(this.collectionName).doc(requestId).delete();
      
      // Log da ação
      await this.logAdminAction(requestId, 'request_deleted', {
        admin: 'Sistema'
      });

      console.log('✅ Solicitação deletada:', requestId);
      return true;
    } catch (error) {
      console.error('❌ Erro ao deletar solicitação:', error);
      throw error;
    }
  }

  // 🧹 DELETAR MÚLTIPLAS SOLICITAÇÕES (BATCH)
  async deleteMultipleRequests(requestIds) {
    try {
      const batch = this.db.batch();
      
      requestIds.forEach(requestId => {
        const docRef = this.db.collection(this.collectionName).doc(requestId);
        batch.delete(docRef);
      });

      await batch.commit();
      
      // Log da ação
      await this.logAdminAction('BATCH', 'multiple_requests_deleted', {
        count: requestIds.length,
        admin: 'Sistema'
      });

      console.log(`✅ ${requestIds.length} solicitações deletadas em batch`);
      return true;
    } catch (error) {
      console.error('❌ Erro ao deletar solicitações em batch:', error);
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
      console.warn('⚠️ Erro ao registrar log:', error);
      // Não falhar a operação principal por causa do log
    }
  }

  async getAdminLogs(requestId = null, limit = 100) {
    try {
      let query = this.db.collection('admin_logs');
      
      if (requestId) {
        query = query.where('solicitacao_id', '==', requestId);
      }
      
      const snapshot = await query
        .orderBy('timestamp', 'desc')
        .limit(limit)
        .get();
        
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('❌ Erro ao buscar logs:', error);
      return [];
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
      console.error('❌ Erro ao calcular estatísticas:', error);
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
        console.error('❌ Erro no listener:', error);
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
        console.error('❌ Erro no listener:', error);
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
      console.error('❌ Erro ao inicializar Firebase Service:', error);
      throw error;
    }
  };
  
  console.log('✅ Firebase Service disponível globalmente');
}