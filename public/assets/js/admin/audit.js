/* 📊 SENAI Lab Admin - Sistema de Auditoria
 * Arquivo: public/assets/js/admin/audit.js
 * Descrição: Funcionalidades para visualização de logs e auditoria
 */

// 📊 CLASSE DE AUDITORIA
class AuditManager {
  static currentTab = 'actions';
  static filteredLogs = [];

  // 🎯 VERIFICAR SE AÇÃO É RELEVANTE
  static isRelevantAction(action) {
    // Lista de ações que NÃO devem aparecer nos logs (muito spam)
    const irrelevantActions = [
      'loadStats',           // Carregamento de dados (muito frequente)
      'auditRefresh',        // Refresh de auditoria
      'systemCheck',         // Verificações automáticas
      'heartbeat',           // Pings de sistema
      'sessionCheck'         // Verificações de sessão
    ];
    
    // Lista de ações IMPORTANTES que sempre devem aparecer
    const criticalActions = [
      'updateStatus',        // Alteração de status
      'setPriority',         // Definição de prioridade
      'addComment',          // Adicionar comentários
      'deleteRequest',       // Exclusão de solicitações
      'exportData',          // Exportação de dados
      'backupData',          // Backup manual
      'login',               // Login (importante para segurança)
      'logout'               // Logout
    ];
    
    // Se não for uma ação irrelevante, considerar relevante
    return !irrelevantActions.includes(action);
  }

  // 🔄 ALTERNAR ABAS DO MODAL DE AUDITORIA
  static switchTab(tabName) {
    // Remover ativa de todas as abas
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

    // Ativar aba selecionada
    document.querySelector(`button[onclick="switchAuditTab('${tabName}')"]`).classList.add('active');
    document.getElementById(`${tabName}-audit-tab`).classList.add('active');

    this.currentTab = tabName;
    this.loadTabContent(tabName);
  } // <-- Adiciona o fechamento do método switchTab

  // 📋 CARREGAR CONTEÚDO DA ABA
  static loadTabContent(tabName) {
    switch (tabName) {
      case 'actions':
        this.loadActionLogs();
        break;
      case 'access':
        this.loadAccessLogs();
        break;
      case 'stats':
        this.loadAuditStats();
        break;
    }
  }

  // 📋 CARREGAR LOGS DE AÇÕES (Firestore)
  static async loadActionLogs() {
    const container = document.getElementById('actionLogsContainer');
    container.innerHTML = `<div class="loading-audit">Carregando logs...</div>`;
    try {
      const db = firebase.firestore();
      const logsRef = db.collection('admin_logs');
      // Buscar os 15 logs mais recentes de todos os usuários
      const snapshot = await logsRef.orderBy('timestamp', 'desc').limit(15).get();
      // Filtrar para remover ações irrelevantes (loadStats, etc)
      const logs = snapshot.docs.map(doc => doc.data()).filter(log => 
        this.isRelevantAction(log.action || log.acao)
      );
      
      if (logs.length === 0) {
        container.innerHTML = `
          <div class="loading-audit">
            📝 Nenhuma ação relevante registrada ainda
          </div>
        `;
        return;
      }
      const logsHtml = logs.map(log => AuditManager.createActionLogItem(log)).join('');
      container.innerHTML = logsHtml;
      // Atualizar filtros de usuário
      AuditManager.updateUserFilter(logs);
    } catch (error) {
      container.innerHTML = `<div class="loading-audit">Erro ao carregar logs</div>`;
      console.error('Erro ao buscar logs do Firestore:', error);
    }
  }

  // 🔑 CARREGAR LOGS DE ACESSO
  static async loadAccessLogs() {
    const container = document.getElementById('accessLogsContainer');
    container.innerHTML = `<div class="loading-audit">Carregando logs de acesso...</div>`;
    try {
      const db = firebase.firestore();
      const accessRef = db.collection('admin_access_logs');
      // Buscar os 15 logs de acesso mais recentes de todos os usuários
      const snapshot = await accessRef.orderBy('timestamp', 'desc').limit(15).get();
      const logs = snapshot.docs.map(doc => doc.data());
      if (logs.length === 0) {
        container.innerHTML = `
          <div class="loading-audit">
            🔐 Nenhum acesso registrado ainda
          </div>
        `;
        return;
      }
      // Ordenar por timestamp decrescente
      const sortedLogs = logs.sort((a, b) => b.timestamp - a.timestamp);
      const logsHtml = sortedLogs.map(log => this.createAccessLogItem(log)).join('');
      container.innerHTML = logsHtml;
    } catch (error) {
      container.innerHTML = `<div class="loading-audit">Erro ao carregar logs de acesso</div>`;
      console.error('Erro ao buscar logs de acesso do Firestore:', error);
    }
  }

  // 📊 CARREGAR ESTATÍSTICAS DE AUDITORIA (Firestore)
  static async loadAuditStats() {
    const container = document.getElementById('auditStatsContainer');
    container.innerHTML = `<div class="loading-audit">Carregando estatísticas...</div>`;
    try {
      const db = firebase.firestore();
      const logsRef = db.collection('admin_logs');
      // Buscar os 15 logs de ações mais recentes
      const snapshot = await logsRef.orderBy('timestamp', 'desc').limit(15).get();
      const actionLogs = snapshot.docs.map(doc => doc.data()).filter(log => 
        this.isRelevantAction(log.action || log.acao)
      );

      // Buscar os 15 logs de acesso mais recentes do Firestore
      const accessSnapshot = await db.collection('admin_access_logs').orderBy('timestamp', 'desc').limit(15).get();
      const accessLogs = accessSnapshot.docs.map(doc => doc.data());

      const stats = this.calculateAuditStats(actionLogs, accessLogs);
      const statsHtml = `
        <div class="audit-stats-grid">
          <div class="audit-stat-card">
            <div class="audit-stat-title">Total de Ações</div>
            <div class="audit-stat-value">${stats.totalActions}</div>
            <div class="audit-stat-description">Ações relevantes registradas</div>
          </div>
          <div class="audit-stat-card">
            <div class="audit-stat-title">Total de Acessos</div>
            <div class="audit-stat-value">${stats.totalAccess}</div>
            <div class="audit-stat-description">Logins e logouts registrados</div>
          </div>
          <div class="audit-stat-card">
            <div class="audit-stat-title">Usuário Mais Ativo</div>
            <div class="audit-stat-value">${stats.mostActiveUser.avatar}</div>
            <div class="audit-stat-description">${stats.mostActiveUser.name} (${stats.mostActiveUser.count} ações)</div>
          </div>
          <div class="audit-stat-card">
            <div class="audit-stat-title">Ações Hoje</div>
            <div class="audit-stat-value">${stats.actionsToday}</div>
            <div class="audit-stat-description">Ações realizadas nas últimas 24h</div>
          </div>
          <div class="audit-stat-card">
            <div class="audit-stat-title">Ação Mais Comum</div>
            <div class="audit-stat-value">${stats.mostCommonAction.action}</div>
            <div class="audit-stat-description">${stats.mostCommonAction.count} ocorrências</div>
          </div>
          <div class="audit-stat-card">
            <div class="audit-stat-title">Usuários Únicos</div>
            <div class="audit-stat-value">${stats.uniqueUsers}</div>
            <div class="audit-stat-description">Usuários que fizeram login</div>
          </div>
        </div>
      `;
      container.innerHTML = statsHtml;
    } catch (error) {
      container.innerHTML = `<div class="loading-audit">Erro ao carregar estatísticas</div>`;
      console.error('Erro ao buscar estatísticas do Firestore:', error);
    }
  }

  // 📋 CRIAR ITEM DE LOG DE AÇÃO
  static createActionLogItem(log) {
    // Adaptação para Firestore: campos acao, admin, detalhes, etc.
    const timeStr = new Date(log.timestamp).toLocaleString('pt-BR');
    // Username: tenta pegar do campo admin, senão 'sistema'
    const username = log.admin || log.username || 'sistema';
    // Busca userObj pelo nome ou username
    const userObj = AdminAuth.getUserList().find(u => u.name === username || u.username === username);
    const avatar = userObj ? userObj.avatar : '👤';
    // Nome do usuário: tenta pegar do campo admin, senão do userObj, senão 'Sistema'
    const nomeUsuario = log.admin || (userObj ? userObj.name : 'Sistema');
    // Ação: tenta pegar do campo acao, senão do action
    const acaoRaw = log.acao || log.action || 'desconhecida';
    const acao = this.getActionName(acaoRaw);
    
    // Descrição inteligente
    let descricao = 'Sem detalhes';
    if (log.detalhes) {
      // Comentário
      if (log.detalhes.comment && log.detalhes.comment.trim()) {
        descricao = log.detalhes.comment;
      }
      // Status
      else if (log.detalhes.new_status && log.detalhes.old_status) {
        descricao = `Status alterado de "${log.detalhes.old_status}" para "${log.detalhes.new_status}"`;
      }
      // Prioridade
      else if (log.detalhes.priority) {
        descricao = `Prioridade definida para: ${log.detalhes.priority}`;
      }
      // Admin
      else if (log.detalhes.admin) {
        descricao = `Admin responsável: ${log.detalhes.admin}`;
      }
      // Outros detalhes
      else {
        // Tenta mostrar o campo mais relevante
        const keys = Object.keys(log.detalhes);
        if (keys.length > 0) {
          descricao = keys.map(k => `${k}: ${log.detalhes[k]}`).join(' | ');
        } else {
          descricao = 'Sem detalhes';
        }
      }
    } else if (log.details && log.details.description) {
      descricao = log.details.description;
    }
    
    return `
      <div class="audit-log-item">
        <div class="audit-log-avatar-container">
          <span class="audit-log-avatar">${avatar}</span>
        </div>
        <div class="audit-log-content">
          <div class="audit-log-header">
            <span class="audit-log-action">${acao}</span>
            <span class="audit-log-time">${timeStr}</span>
          </div>
          <div class="audit-log-details">${descricao}</div>
          <div class="audit-log-user">
            <span class="audit-log-username">${nomeUsuario}</span>
            <span class="audit-log-mention">@${username}</span>
          </div>
        </div>
      </div>
    `;
  }

  // 🔑 CRIAR ITEM DE LOG DE ACESSO
  static createAccessLogItem(log) {
    const timeStr = new Date(log.timestamp).toLocaleString('pt-BR');
    const user = AdminAuth.getUserList().find(u => u.username === log.username);
    const avatar = user ? user.avatar : '👤';
    const name = user ? user.name : log.username;

    return `
      <div class="access-log-item">
        <div class="audit-log-avatar-container">
          <span class="audit-log-avatar">${avatar}</span>
        </div>
        <div class="access-log-content">
          <div class="access-log-header">
            <span class="access-log-type ${log.type}">
              ${log.type === 'login' ? '🔐 Entrada' : '🚪 Saída'}
            </span>
            <span class="access-log-time">${timeStr}</span>
          </div>
          <div class="access-log-user-info">
            <span class="audit-log-username">${name}</span>
            <span class="audit-log-mention">@${log.username}</span>
          </div>
        </div>
      </div>
    `;
  }

  // 📊 CALCULAR ESTATÍSTICAS
  static calculateAuditStats(actionLogs, accessLogs) {
    const now = Date.now();
    const oneDayAgo = now - (24 * 60 * 60 * 1000);

    // Contar ações por usuário (tratando campos alternativos)
    const userActions = {};
    actionLogs.forEach(log => {
      const username = log.username || log.admin || log.user || 'sistema';
      userActions[username] = (userActions[username] || 0) + 1;
    });

    // Encontrar usuário mais ativo
    let mostActiveUser = { name: 'Nenhum', count: 0, avatar: '👤' };
    Object.entries(userActions).forEach(([username, count]) => {
      let user = AdminAuth.getUserList().find(u => u.username === username);
      if (!user) user = AdminAuth.getUserList().find(u => u.name === username);
      if (count > mostActiveUser.count) {
        mostActiveUser = {
          name: user ? user.name : username,
          count: count,
          avatar: user ? user.avatar : '👤'
        };
      }
    });

    // Contar ações por tipo (tratando campos alternativos)
    const actionTypes = {};
    actionLogs.forEach(log => {
      const action = log.action || log.acao || 'desconhecida';
      actionTypes[action] = (actionTypes[action] || 0) + 1;
    });

    // Encontrar ação mais comum
    let mostCommonAction = { action: 'Nenhuma', count: 0 };
    Object.entries(actionTypes).forEach(([action, count]) => {
      if (count > mostCommonAction.count) {
        mostCommonAction = { action: this.getActionName(action), count: count };
      }
    });

    // Usuários únicos (tratando campos alternativos)
    const uniqueUsers = new Set(accessLogs.map(log => log.username || log.admin || log.user || 'sistema')).size;

    // Ações hoje
    const actionsToday = actionLogs.filter(log => log.timestamp > oneDayAgo).length;

    return {
      totalActions: actionLogs.length,
      totalAccess: accessLogs.length,
      mostActiveUser,
      actionsToday,
      mostCommonAction,
      uniqueUsers
    };
  }

  // 🏷️ OBTER NOME AMIGÁVEL DA AÇÃO
  static getActionName(action) {
    const actionNames = {
      'loadStats': '📊 Carregamento de Dados',
      'updateStatus': '🔄 Alteração de Status',
      'setPriority': '⚡ Definição de Prioridade',
      'exportData': '📤 Exportação de Dados',
      'backupData': '🗂️ Backup de Dados'
    };
    return actionNames[action] || `🔧 ${action}`;
  }

  // 🔍 ATUALIZAR FILTRO DE USUÁRIOS
  static updateUserFilter(logs) {
    const userFilter = document.getElementById('auditUserFilter');
    const uniqueUsers = [...new Set(logs.map(log => log.username))];
    
    // Limpar opções existentes (exceto "Todos")
    userFilter.innerHTML = '<option value="">Todos os usuários</option>';
    
    // Adicionar usuários únicos
    uniqueUsers.forEach(username => {
      const user = AdminAuth.getUserList().find(u => u.username === username);
      const name = user ? user.name : username;
      const avatar = user ? user.avatar : '👤';
      
      const option = document.createElement('option');
      option.value = username;
      option.textContent = `${avatar} ${name}`;
      userFilter.appendChild(option);
    });
  }

  // 🔍 FILTRAR LOGS DE AUDITORIA (Firestore)
  static async filterAuditLogs() {
    const userFilter = document.getElementById('auditUserFilter').value;
    const actionFilter = document.getElementById('auditActionFilter').value;
    const container = document.getElementById('actionLogsContainer');
    container.innerHTML = `<div class="loading-audit">Filtrando logs...</div>`;
    try {
      const db = firebase.firestore();
      const logsRef = db.collection('admin_logs');
      // Buscar os 15 logs mais recentes
      const snapshot = await logsRef.orderBy('timestamp', 'desc').limit(15).get();
      let logs = snapshot.docs.map(doc => doc.data()).filter(log => 
        this.isRelevantAction(log.action || log.acao)
      );
      // Aplicar filtros
      if (userFilter) {
        logs = logs.filter(log => log.username === userFilter);
      }
      if (actionFilter) {
        logs = logs.filter(log => log.action === actionFilter);
      }
      // Re-renderizar logs filtrados
      if (logs.length === 0) {
        container.innerHTML = `
          <div class="loading-audit">
            🔍 Nenhum log encontrado com os filtros aplicados
          </div>
        `;
        return;
      }
      const sortedLogs = logs.sort((a, b) => b.timestamp - a.timestamp);
      const logsHtml = sortedLogs.map(log => this.createActionLogItem(log)).join('');
      container.innerHTML = logsHtml;
    } catch (error) {
      container.innerHTML = `<div class="loading-audit">Erro ao filtrar logs</div>`;
      console.error('Erro ao filtrar logs do Firestore:', error);
    }
  }

  // 🔄 ATUALIZAR LOGS
  static refreshAuditLogs() {
    AdminAuth.logUserAction('auditRefresh', { description: 'Atualização manual dos logs de auditoria' });
    this.loadTabContent(this.currentTab);
    showToast('Logs de auditoria atualizados!', 'success');
  }

  // 📋 OBTER LOGS DE UMA SOLICITAÇÃO ESPECÍFICA
  static getRequestLogs(requestId) {
    const actionLogs = AdminAuth.getActionLogs();
    return actionLogs.filter(log => 
      log.details && log.details.requestId === requestId
    ).sort((a, b) => a.timestamp - b.timestamp); // Ordem cronológica
  }

  // 👤 OBTER USUÁRIO QUE FEZ AÇÃO EM STATUS
  static getUserForStatusChange(requestId, status) {
    const logs = this.getRequestLogs(requestId);
    const statusLog = logs.find(log => 
      log.action === 'updateStatus' && 
      log.details.newStatus === status
    );
    
    if (statusLog) {
      return {
        name: statusLog.user,
        username: statusLog.username,
        timestamp: statusLog.timestamp
      };
    }
    
    return null;
  }
}

// 🔄 FUNÇÃO GLOBAL PARA ALTERNAR ABAS
function switchAuditTab(tabName) {
  AuditManager.switchTab(tabName);
}

// 🔄 FUNÇÃO GLOBAL PARA FILTRAR LOGS
function filterAuditLogs() {
  AuditManager.filterAuditLogs();
}

// 🔄 FUNÇÃO GLOBAL PARA ATUALIZAR LOGS
function refreshAuditLogs() {
  AuditManager.refreshAuditLogs();
}

// 🚀 FUNÇÃO PARA ABRIR MODAL DE AUDITORIA
function openAuditModal() {
  openModal('auditModal');
  AuditManager.loadTabContent('actions');
}


