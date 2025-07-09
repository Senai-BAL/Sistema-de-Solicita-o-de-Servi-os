// 🔥 SERVIÇOS FIREBASE CENTRALIZADOS
// Arquivo: public/shared/firebase-service.js

class FirebaseService {
  constructor() {
    if (!window.firebaseConfig) {
      throw new Error('Firebase configuration not found');
    }
    
    if (!firebase.apps.length) {
      firebase.initializeApp(window.firebaseConfig);
    }
    
    this.db = firebase.firestore();
    this.enableOfflineSupport();
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
    try {
      const snapshot = await this.db.collection('solicitacoes').orderBy('d', 'desc').get();
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('❌ Erro ao buscar solicitações:', error);
      throw error;
    }
  }

  async getRequestById(id) {
    try {
      const doc = await this.db.collection('solicitacoes').doc(id).get();
      if (doc.exists) {
        return { id: doc.id, ...doc.data() };
      }
      return null;
    } catch (error) {
      console.error('❌ Erro ao buscar solicitação:', error);
      throw error;
    }
  }

  async getRequestsByFilter(filters = {}) {
    try {
      let query = this.db.collection('solicitacoes');

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
      const docRef = await this.db.collection('solicitacoes').add({
        ...data,
        d: Date.now(),
        st: 'p' // status: pendente
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
      const updateData = {
        'admin.status': status,
        'admin.data_atualizacao': Date.now(),
        'admin.responsavel': adminData.responsavel || 'Administrador'
      };

      // Adicionar comentário se fornecido
      if (adminData.comment) {
        updateData['admin.comentarios'] = firebase.firestore.FieldValue.arrayUnion({
          texto: adminData.comment,
          timestamp: Date.now(),
          autor: adminData.responsavel || 'Administrador'
        });
      }

      // Adicionar prioridade se fornecida
      if (adminData.priority) {
        updateData['admin.prioridade'] = adminData.priority;
      }

      await this.db.collection('solicitacoes').doc(requestId).update(updateData);
      
      // Log da ação administrativa
      await this.logAdminAction(requestId, 'status_update', {
        old_status: adminData.oldStatus,
        new_status: status,
        comment: adminData.comment,
        admin: adminData.responsavel || 'Administrador'
      });

      console.log('✅ Status atualizado:', requestId);
      return true;
    } catch (error) {
      console.error('❌ Erro ao atualizar status:', error);
      throw error;
    }
  }

  async addComment(requestId, comment, author = 'Administrador') {
    try {
      await this.db.collection('solicitacoes').doc(requestId).update({
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
      await this.db.collection('solicitacoes').doc(requestId).update({
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
    return this.db.collection('solicitacoes')
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
    return this.db.collection('solicitacoes')
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

// 🌟 EXPORT PARA USO GLOBAL
if (typeof window !== 'undefined') {
  window.FirebaseService = FirebaseService;
}