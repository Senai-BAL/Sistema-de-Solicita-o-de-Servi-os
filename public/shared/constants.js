/* 🔧 SENAI Lab - Constantes Compartilhadas
 * Arquivo: public/shared/constants.js
 * Descrição: Constantes centralizadas para evitar duplicação
 */

// 📦 SERVIÇOS E SUBSERVIÇOS
const SERVICE_NAMES = {
  'espaco_maker': 'Espaço Maker',
  'servicos': {
    'impressao': 'Impressão',
    'manutencao': 'Manutenção',
    'emprestimo': 'Empréstimo'
  }
};

const SERVICE_ICONS = {
  'espaco_maker': '🔧',
  'impressao': '🖨️',
  'manutencao': '🛠️',
  'emprestimo': '📦'
};

// 📊 STATUS DE SOLICITAÇÕES
const STATUS_CONFIG = {
  'pendente': {
    label: 'Pendente',
    icon: '⏳',
    color: '#f39c12'
  },
  'em_andamento': {
    label: 'Em Andamento',
    icon: '🔧',
    color: '#3498db'
  },
  'concluido': {
    label: 'Concluído',
    icon: '✅',
    color: '#2ecc71'
  },
  'cancelado': {
    label: 'Cancelado',
    icon: '❌',
    color: '#e74c3c'
  }
};

// 📱 DDDs VÁLIDOS DO BRASIL
const DDD_VALIDOS = [
  // Região Sudeste
  '11', '12', '13', '14', '15', '16', '17', '18', '19', // SP
  '21', '22', '24', // RJ
  '27', '28', // ES
  '31', '32', '33', '34', '35', '37', '38', // MG

  // Região Sul
  '41', '42', '43', '44', '45', '46', // PR
  '47', '48', '49', // SC
  '51', '53', '54', '55', // RS

  // Região Centro-Oeste
  '61', // DF
  '62', '64', // GO
  '63', // TO
  '65', '66', // MT
  '67', // MS

  // Região Nordeste
  '71', '73', '74', '75', '77', // BA
  '79', // SE
  '81', '87', // PE
  '82', // AL
  '83', // PB
  '84', // RN
  '85', '88', // CE
  '86', '89', // PI

  // Região Norte
  '68', '69', // AC/RO
  '91', '93', '94', // PA
  '92', '97', // AM
  '95', // RR
  '96', // AP
  '98', '99'  // MA
];

// 🎨 TEMAS DISPONÍVEIS
const THEMES = {
  light: {
    name: 'Modo Claro',
    '--primary-color': '#0066cc',
    '--background-color': '#f5f7fa',
    '--text-color': '#333',
    '--card-background': '#fff'
  },
  dark: {
    name: 'Modo Escuro',
    '--primary-color': '#4a9eff',
    '--background-color': '#1a1a2e',
    '--text-color': '#eee',
    '--card-background': '#16213e'
  },
  auto: {
    name: 'Automático',
    description: 'Ajusta baseado nas configurações do sistema'
  }
};

// 🔔 TIPOS DE NOTIFICAÇÃO
const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// ⏱️ DURAÇÕES PADRÃO
const DURATIONS = {
  TOAST_DEFAULT: 3000,
  TOAST_SHORT: 2000,
  TOAST_LONG: 5000,
  LOADING_TIMEOUT: 30000
};

// 📏 LIMITES E VALIDAÇÕES
const LIMITS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_FILES: 5,
  MIN_PASSWORD_LENGTH: 8,
  MAX_COMMENT_LENGTH: 500,
  MAX_DESCRIPTION_LENGTH: 1000
};

// 🔑 FUNÇÕES AUXILIARES
const CONSTANTS_HELPERS = {
  /**
   * Obtém configuração de status
   * @param {string} status - Código do status
   * @returns {object} Configuração do status
   */
  getStatusConfig(status) {
    return STATUS_CONFIG[status] || STATUS_CONFIG.pendente;
  },

  /**
   * Obtém nome do serviço
   * @param {string} service - Código do serviço
   * @param {string} subService - Código do subserviço (opcional)
   * @returns {string} Nome formatado
   */
  getServiceName(service, subService = null) {
    if (subService && SERVICE_NAMES[service] && typeof SERVICE_NAMES[service] === 'object') {
      return SERVICE_NAMES[service][subService] || subService;
    }
    return SERVICE_NAMES[service] || service;
  },

  /**
   * Valida DDD brasileiro
   * @param {string} ddd - DDD a validar
   * @returns {boolean} true se válido
   */
  isValidDDD(ddd) {
    return DDD_VALIDOS.includes(ddd);
  },

  /**
   * Valida tamanho de arquivo
   * @param {number} size - Tamanho em bytes
   * @returns {boolean} true se dentro do limite
   */
  isValidFileSize(size) {
    return size <= LIMITS.MAX_FILE_SIZE;
  }
};

// Expor no escopo global
if (typeof window !== 'undefined') {
  window.SERVICE_NAMES = SERVICE_NAMES;
  window.SERVICE_ICONS = SERVICE_ICONS;
  window.STATUS_CONFIG = STATUS_CONFIG;
  window.DDD_VALIDOS = DDD_VALIDOS;
  window.THEMES = THEMES;
  window.TOAST_TYPES = TOAST_TYPES;
  window.DURATIONS = DURATIONS;
  window.LIMITS = LIMITS;
  window.CONSTANTS_HELPERS = CONSTANTS_HELPERS;
}
