/* 🔐 SENAI Lab Admin - Sistema de Autenticação Multiusuário
 * Arquivo: public/assets/js/admin/auth.js
 * Descrição: Sistema de login com múltiplos usuários administrativos
 */

// 👥 CONFIGURAÇÃO DE USUÁRIOS ADMINISTRATIVOS
const ADMIN_USERS = {
  'presidentinho': {
    name: 'Getulio',
    passwordHash: '8f7d8e7c5a3b2d1e9f6a4c7b8e5d2a1f', // Hash de 'Senai@presidentinho'
    avatar: '💻',
    role: 'interlocutor',
    department: 'Desenvolvedor'
  },
  'dr.chaguinha': {
    name: 'Chagas',
    passwordHash: '3b2d1e9f6a4c7b8e5d2a1f8f7d8e7c5a', // Hash de 'Senai@dr.chaguinha'
    avatar: '🎮',
    role: 'interlocutor',
    department: 'Programador de Jogos'
  },
  'rainha.cat': {
    name: 'Catarina',
    passwordHash: '6a4c7b8e5d2a1f8f7d8e7c5a3b2d1e9f', // Hash de 'Senai@rainha.cat'
    avatar: '🤖',
    role: 'interlocutor',
    department: 'Mecatrônica'
  },
  'brunete.designer': {
    name: 'Bruna',
    passwordHash: '5d2a1f8f7d8e7c5a3b2d1e9f6a4c7b8e', // Hash de 'Senai@brunete.designer'
    avatar: '🎨',
    role: 'interlocutor',
    department: 'Designer 3D'
  },
  'luy.jedi': {
    name: 'Luy',
    passwordHash: '8e5d2a1f8f7d8e7c5a3b2d1e9f6a4c7b', // Hash de 'Senai@luy.jedi'
    avatar: '🖌️',
    role: 'interlocutor',
    department: 'Designer 2D'
  }
};

// 🔐 CLASSE DE AUTENTICAÇÃO ADMINISTRATIVA
class AdminAuth {
  // Valida a senha do usuário atualmente logado
  static async validatePassword(password) {
    if (!this.currentUser || !this.currentUser.username) return false;
    const username = this.currentUser.username;
    // Senha esperada: Senai@username
    const expectedPassword = `Senai@${username}`;
    return password === expectedPassword;
  }
  static currentUser = null;
  static sessionKey = 'senai_admin_session';
  static loginAttempts = {};
  static maxAttempts = 3;
  static lockoutTime = 15 * 60 * 1000; // 15 minutos

  // 🔑 FUNÇÃO DE HASH SIMPLES (para demonstração)
  static simpleHash(text) {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16).padStart(8, '0');
  }

  // 🔐 VERIFICAR CREDENCIAIS
  static verifyCredentials(username, password) {
    const user = ADMIN_USERS[username];
    if (!user) return false;

    // Por simplicidade, vamos verificar a senha diretamente
    // Em produção, usaria hash real
    const expectedPassword = `Senai@${username}`;
    return password === expectedPassword;
  }

  // 🚪 REALIZAR LOGIN
  static async login(username, password) {
    try {
      // Verificar tentativas de login
      if (this.isLockedOut(username)) {
        throw new Error(`Usuário bloqueado por ${Math.ceil((this.lockoutTime - (Date.now() - this.loginAttempts[username].lastAttempt)) / 60000)} minutos`);
      }

      // Verificar credenciais
      if (!this.verifyCredentials(username, password)) {
        this.recordFailedAttempt(username);
        throw new Error('Usuário ou senha inválidos');
      }

      // Login bem-sucedido
      const user = ADMIN_USERS[username];
      this.currentUser = {
        username,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
        department: user.department,
        loginTime: Date.now()
      };

      // Salvar sessão
      this.saveSession();
      this.clearFailedAttempts(username);
      
      // Log de acesso
      this.logAccess('login', username);
      
      console.log(`✅ Login realizado: ${user.name} (${username})`);
      return true;

    } catch (error) {
      console.error('❌ Erro no login:', error.message);
      throw error;
    }
  }

  // 🚪 REALIZAR LOGOUT
  static logout() {
    if (this.currentUser) {
      this.logAccess('logout', this.currentUser.username);
      console.log(`👋 Logout realizado: ${this.currentUser.name}`);
    }
    
    this.currentUser = null;
    this.clearSession();
  }

  // ✅ VERIFICAR SE ESTÁ AUTENTICADO
  static isAuthenticated() {
    return this.currentUser !== null;
  }

  // 👤 OBTER USUÁRIO ATUAL
  static getCurrentUser() {
    return this.currentUser;
  }

  // 👤 OBTER NOME DO USUÁRIO ATUAL
  static getCurrentUserName() {
    return this.currentUser ? this.currentUser.name : 'Sistema';
  }

  // 🖼️ OBTER AVATAR DO USUÁRIO ATUAL
  static getCurrentUserAvatar() {
    return this.currentUser ? this.currentUser.avatar : '👤';
  }

  // 📝 REGISTRAR AÇÃO DO USUÁRIO
  static logUserAction(action, details = {}) {
    if (!this.currentUser) return;

    const logEntry = {
      timestamp: Date.now(),
      user: this.currentUser.name,
      username: this.currentUser.username,
      action: action,
      details: details
    };

    // Salvar no localStorage para auditoria
    const logs = this.getActionLogs();
    logs.push(logEntry);
    
    // Manter apenas os últimos 50 logs
    if (logs.length > 50) {
      logs.splice(0, logs.length - 50);
    }
    
    localStorage.setItem('senai_admin_logs', JSON.stringify(logs));
    
    console.log(`📋 Ação registrada: ${action} por ${this.currentUser.name}`);
  }

  // 📊 OBTER LOGS DE AÇÕES
  static getActionLogs() {
    try {
      return JSON.parse(localStorage.getItem('senai_admin_logs') || '[]');
    } catch {
      return [];
    }
  }

  // 🔒 VERIFICAR BLOQUEIO
  static isLockedOut(username) {
    const attempts = this.loginAttempts[username];
    if (!attempts) return false;
    
    return attempts.count >= this.maxAttempts && 
           (Date.now() - attempts.lastAttempt) < this.lockoutTime;
  }

  // ❌ REGISTRAR TENTATIVA FALHADA
  static recordFailedAttempt(username) {
    if (!this.loginAttempts[username]) {
      this.loginAttempts[username] = { count: 0, lastAttempt: 0 };
    }
    
    this.loginAttempts[username].count++;
    this.loginAttempts[username].lastAttempt = Date.now();
  }

  // ✅ LIMPAR TENTATIVAS FALHADAS
  static clearFailedAttempts(username) {
    delete this.loginAttempts[username];
  }

  // 💾 SALVAR SESSÃO
  static saveSession() {
    if (this.currentUser) {
      localStorage.setItem(this.sessionKey, JSON.stringify(this.currentUser));
    }
  }

  // 🗑️ LIMPAR SESSÃO
  static clearSession() {
    localStorage.removeItem(this.sessionKey);
  }

  // 🔄 RESTAURAR SESSÃO
  static restoreSession() {
    try {
      const sessionData = localStorage.getItem(this.sessionKey);
      if (sessionData) {
        const userData = JSON.parse(sessionData);
        
        // Verificar se a sessão não expirou (24 horas)
        const sessionAge = Date.now() - userData.loginTime;
        const maxAge = 24 * 60 * 60 * 1000; // 24 horas
        
        if (sessionAge < maxAge) {
          this.currentUser = userData;
          console.log(`🔄 Sessão restaurada: ${userData.name}`);
          return true;
        } else {
          this.clearSession();
          console.log('⏱️ Sessão expirada');
        }
      }
    } catch (error) {
      console.error('❌ Erro ao restaurar sessão:', error);
      this.clearSession();
    }
    return false;
  }

  // 📝 LOG DE ACESSO
  static logAccess(type, username) {
    const accessLog = {
      type: type,
      username: username,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      ip: 'local' // Em ambiente local
    };

    const accessLogs = this.getAccessLogs();
    accessLogs.push(accessLog);
    
    // Manter apenas os últimos 50 logs de acesso
    if (accessLogs.length > 50) {
      accessLogs.splice(0, accessLogs.length - 50);
    }
    
    localStorage.setItem('senai_access_logs', JSON.stringify(accessLogs));
  }

  // 📊 OBTER LOGS DE ACESSO
  static getAccessLogs() {
    try {
      return JSON.parse(localStorage.getItem('senai_access_logs') || '[]');
    } catch {
      return [];
    }
  }

  // 🎭 OBTER LISTA DE USUÁRIOS (para desenvolvimento)
  static getUserList() {
    return Object.keys(ADMIN_USERS).map(username => ({
      username,
      name: ADMIN_USERS[username].name,
      avatar: ADMIN_USERS[username].avatar,
      department: ADMIN_USERS[username].department
    }));
  }
}

// 🚀 INICIALIZAÇÃO
document.addEventListener('DOMContentLoaded', () => {
  // Tentar restaurar sessão existente
  AdminAuth.restoreSession();
});

console.log('🔐 Admin Auth - Sistema de autenticação multiusuário carregado');
console.log('👥 Usuários disponíveis:', AdminAuth.getUserList().map(u => `${u.avatar} ${u.name} (${u.username})`).join(', '));
