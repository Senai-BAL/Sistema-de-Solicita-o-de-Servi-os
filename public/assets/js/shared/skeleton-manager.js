// 💀 SENAI Lab - Sistema de Skeleton Screens
// Arquivo: public/assets/js/shared/skeleton-manager.js
// Descrição: Gerenciamento de skeleton screens para melhor UX

class SkeletonManager {
  static skeletonContainer = null;
  static activeSkeletons = new Map();

  // 🚀 INICIALIZAR SISTEMA
  static init() {
    this.injectCSS();
  }

  // 🎨 INJETAR ESTILOS CSS DINAMICAMENTE
  static injectCSS() {
    if (document.getElementById('skeleton-styles')) return;

    const style = document.createElement('style');
    style.id = 'skeleton-styles';
    style.textContent = `
      /* 💀 SKELETON BASE STYLES */
      .skeleton {
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: skeleton-loading 1.5s infinite;
        border-radius: 4px;
        position: relative;
        overflow: hidden;
      }

      .skeleton::after {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
        animation: skeleton-shimmer 2s infinite;
      }

      @keyframes skeleton-loading {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }

      @keyframes skeleton-shimmer {
        0% { left: -100%; }
        100% { left: 100%; }
      }

      /* 📊 SKELETON ESPECÍFICOS */
      .skeleton-card {
        width: 100%;
        height: 120px;
        margin-bottom: 16px;
        border-radius: 8px;
      }

      .skeleton-row {
        width: 100%;
        height: 48px;
        margin-bottom: 8px;
        border-radius: 6px;
      }

      .skeleton-text {
        height: 16px;
        margin-bottom: 8px;
        border-radius: 3px;
      }

      .skeleton-text.large { height: 20px; }
      .skeleton-text.small { height: 12px; }
      .skeleton-text.w-75 { width: 75%; }
      .skeleton-text.w-50 { width: 50%; }
      .skeleton-text.w-25 { width: 25%; }

      .skeleton-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
      }

      .skeleton-button {
        width: 100px;
        height: 32px;
        border-radius: 6px;
      }

      /* 📱 SKELETON TABLE */
      .skeleton-table {
        width: 100%;
        border-collapse: collapse;
      }

      .skeleton-table td {
        padding: 12px;
        border-bottom: 1px solid #f0f0f0;
      }

      /* 🎨 DARK MODE SUPPORT */
      @media (prefers-color-scheme: dark) {
        .skeleton {
          background: linear-gradient(90deg, #2a2a2a 25%, #3a3a3a 50%, #2a2a2a 75%);
        }
        
        .skeleton::after {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
        }
      }
    `;

    document.head.appendChild(style);
  }

  // 📊 SKELETON PARA DASHBOARD STATS
  static showDashboardStats(container) {
    if (!container) return;

    const skeletonHTML = `
      <div class="stats-grid">
        ${Array(4).fill(0).map(() => `
          <div class="stat-card">
            <div class="skeleton skeleton-text w-75" style="margin-bottom: 12px;"></div>
            <div class="skeleton skeleton-text large w-50" style="margin-bottom: 8px;"></div>
            <div class="skeleton skeleton-text small w-25"></div>
          </div>
        `).join('')}
      </div>
    `;

    container.innerHTML = skeletonHTML;
    this.activeSkeletons.set('dashboard-stats', container);
  }

  // 📋 SKELETON PARA TABELA DE SOLICITAÇÕES
  static showRequestsTable(container) {
    if (!container) return;

    const skeletonHTML = `
      <div class="table-container">
        <table class="skeleton-table">
          <thead>
            <tr>
              ${['ID', 'Solicitante', 'Serviço', 'Status', 'Data', 'Ações'].map(header => `
                <th><div class="skeleton skeleton-text w-75"></div></th>
              `).join('')}
            </tr>
          </thead>
          <tbody>
            ${Array(8).fill(0).map(() => `
              <tr>
                <td><div class="skeleton skeleton-text w-50"></div></td>
                <td>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <div class="skeleton skeleton-avatar"></div>
                    <div class="skeleton skeleton-text w-75"></div>
                  </div>
                </td>
                <td><div class="skeleton skeleton-text w-75"></div></td>
                <td><div class="skeleton skeleton-button"></div></td>
                <td><div class="skeleton skeleton-text w-50"></div></td>
                <td>
                  <div style="display: flex; gap: 4px;">
                    <div class="skeleton skeleton-button"></div>
                    <div class="skeleton skeleton-button"></div>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    container.innerHTML = skeletonHTML;
    this.activeSkeletons.set('requests-table', container);
  }

  // 📱 SKELETON PARA CARDS KANBAN
  static showKanbanCards(container, count = 3) {
    if (!container) return;

    const skeletonHTML = Array(count).fill(0).map(() => `
      <div class="kanban-card">
        <div class="skeleton skeleton-text w-75" style="margin-bottom: 8px;"></div>
        <div class="skeleton skeleton-text small w-50" style="margin-bottom: 8px;"></div>
        <div class="skeleton skeleton-text w-25" style="margin-bottom: 12px;"></div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div class="skeleton skeleton-text small w-25"></div>
          <div class="skeleton skeleton-button"></div>
        </div>
      </div>
    `).join('');

    container.innerHTML = skeletonHTML;
    this.activeSkeletons.set(`kanban-${container.id}`, container);
  }

  // 📋 SKELETON PARA FORMULÁRIO
  static showForm(container) {
    if (!container) return;

    const skeletonHTML = `
      <div class="form-skeleton">
        ${Array(6).fill(0).map(() => `
          <div class="form-group" style="margin-bottom: 20px;">
            <div class="skeleton skeleton-text w-25" style="margin-bottom: 8px;"></div>
            <div class="skeleton skeleton-row"></div>
          </div>
        `).join('')}
        <div style="display: flex; gap: 12px; margin-top: 24px;">
          <div class="skeleton skeleton-button" style="width: 120px;"></div>
          <div class="skeleton skeleton-button" style="width: 100px;"></div>
        </div>
      </div>
    `;

    container.innerHTML = skeletonHTML;
    this.activeSkeletons.set('form', container);
  }

  // 📊 SKELETON PARA MODAL DE DETALHES
  static showModalDetails(container) {
    if (!container) return;

    const skeletonHTML = `
      <div class="modal-skeleton">
        <div class="skeleton skeleton-text large w-75" style="margin-bottom: 16px;"></div>
        <div class="skeleton skeleton-text w-50" style="margin-bottom: 24px;"></div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px;">
          <div>
            <div class="skeleton skeleton-text w-25" style="margin-bottom: 8px;"></div>
            <div class="skeleton skeleton-text w-75" style="margin-bottom: 16px;"></div>
            <div class="skeleton skeleton-text w-25" style="margin-bottom: 8px;"></div>
            <div class="skeleton skeleton-text w-50"></div>
          </div>
          <div>
            <div class="skeleton skeleton-text w-25" style="margin-bottom: 8px;"></div>
            <div class="skeleton skeleton-card" style="height: 80px;"></div>
          </div>
        </div>

        <div style="display: flex; gap: 8px; margin-top: 20px;">
          <div class="skeleton skeleton-button"></div>
          <div class="skeleton skeleton-button"></div>
          <div class="skeleton skeleton-button"></div>
        </div>
      </div>
    `;

    container.innerHTML = skeletonHTML;
    this.activeSkeletons.set('modal-details', container);
  }

  // 🧹 REMOVER SKELETON ESPECÍFICO
  static hide(skeletonId) {
    if (this.activeSkeletons.has(skeletonId)) {
      this.activeSkeletons.delete(skeletonId);
    }
  }

  // 🧹 LIMPAR TODOS OS SKELETONS
  static hideAll() {
    this.activeSkeletons.clear();
  }

  // 📊 SKELETON RESPONSIVO AUTOMÁTICO
  static showResponsive(container, type, options = {}) {
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth < 1024;

    switch (type) {
      case 'dashboard':
        if (isMobile) {
          this.showDashboardStats(container);
        } else {
          this.showDashboardStats(container);
        }
        break;
        
      case 'table':
        if (isMobile) {
          this.showKanbanCards(container, 5);
        } else {
          this.showRequestsTable(container);
        }
        break;
        
      case 'form':
        this.showForm(container);
        break;
        
      case 'modal':
        this.showModalDetails(container);
        break;
        
      default:
        this.showKanbanCards(container, options.count || 3);
    }
  }

  // 📱 UTILITÁRIO: DETECTAR TIPO DE DISPOSITIVO
  static getDeviceType() {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  // 🎯 MÉTODO DE CONVENIÊNCIA PARA ESTADOS COMUNS
  static showLoading(element, type = 'default') {
    const loadingStates = {
      'card': () => this.showKanbanCards(element, 1),
      'table': () => this.showRequestsTable(element), 
      'form': () => this.showForm(element),
      'modal': () => this.showModalDetails(element),
      'stats': () => this.showDashboardStats(element),
      'default': () => this.showKanbanCards(element, 3)
    };

    if (loadingStates[type]) {
      loadingStates[type]();
    }
  }
}

// 🌐 DISPONIBILIZAR GLOBALMENTE
window.SkeletonManager = SkeletonManager;

// 🚀 INICIALIZAR AUTOMATICAMENTE
document.addEventListener('DOMContentLoaded', () => {
  SkeletonManager.init();
});

console.log('✅ Skeleton Manager carregado com sucesso');
