/* ==========================================
   SENAI Lab v3.0.0 - Tracking Config
   Configurações do sistema de tracking
   ========================================== */

// Configuração Firebase para tracking
let trackingDB;

// Inicializar Firebase
if (!window.firebaseConfig) {
  console.error('⚠️ Erro: Configuração Firebase não encontrada!');
  alert('⚠️ Erro: Configuração Firebase não encontrada!');
  throw new Error('Firebase configuration not found');
}

if (firebase.apps.length === 0) {
  firebase.initializeApp(window.firebaseConfig);
}
trackingDB = firebase.firestore();

// Configuração de ambiente
const TRACKING_CONFIG = {
  mode: 'test', // ou 'production'
  collections: {
    production: 'solicitacoes',
    test: 'solicitacoes_test'
  },
  searchTimeout: 10000, // 10 segundos
  messageTimeout: 5000,  // 5 segundos
  version: 'v3.0.0'
};

// Nome da coleção ativa
const collectionName = TRACKING_CONFIG.collections[TRACKING_CONFIG.mode];

// Log de inicialização
console.log(`🔍 SENAI Lab Tracking ${TRACKING_CONFIG.version} iniciado`);
console.log(`📊 Usando coleção: ${collectionName}`);
console.log(`🔧 Modo: ${TRACKING_CONFIG.mode}`);

// Configurações de placeholder
const PLACEHOLDERS = {
  'id': 'Digite o código da solicitação (ex: abc123def456)',
  'email': 'Digite seu email (ex: joao@empresa.com)',
  'phone': 'Digite seu telefone com DDD (ex: 11999887766)'
};

// Status maps
const STATUS_MAP = {
  'pendente': '⏳ Pendente',
  'em_andamento': '⚙️ Em Andamento',
  'concluido': '✅ Concluído',
  'cancelado': '❌ Cancelado'
};

const SERVICE_MAP = {
  'espaco_maker': '🔧 Espaço Maker',
  'servicos': '⚙️ Serviços',
  'emprestimo': '📦 Empréstimo'
};

// Função de debug
function debugLog(message, data = null) {
  if (TRACKING_CONFIG.mode === 'test') {
    console.log(`🔍 [TRACKING] ${message}`, data);
  }
}

// Verificar se está tudo configurado
if (trackingDB) {
  debugLog('Firebase Firestore inicializado com sucesso');
} else {
  console.error('❌ Erro ao inicializar Firebase Firestore');
}
