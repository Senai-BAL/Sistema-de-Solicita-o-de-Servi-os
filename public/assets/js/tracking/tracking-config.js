/* ==========================================
   SENAI Lab v3.0.1 - Tracking Configuration
   Configurações específicas para tracking
   ========================================== */

// Configuração Firebase para tracking
let trackingDB;

// Inicializar Firebase
if (!firebase || !firebase.firestore) {
  console.error('⚠️ Erro: Firebase não inicializado!');
  alert('⚠️ Erro: Firebase não inicializado! Recarregue a página.');
  throw new Error('Firebase not initialized');
}

// Firebase já foi inicializado pelo /__/firebase/init.js em produção
// ou por firebase-config.js em desenvolvimento
if (firebase.apps.length === 0 && window.firebaseConfig) {
  firebase.initializeApp(window.firebaseConfig);
}
trackingDB = firebase.firestore();

// Configurações específicas para tracking
const TRACKING_CONFIG = {
  searchTypes: {
    id: {
      label: 'Código da Solicitação',
      placeholder: 'Digite o código da solicitação...',
      pattern: /^[a-zA-Z0-9]{15,}$/,
      errorMsg: 'Código deve ter pelo menos 15 caracteres'
    },
    email: {
      label: 'Email',
      placeholder: 'Digite o email usado na solicitação...',
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      errorMsg: 'Digite um email válido'
    },
    phone: {
      label: 'Telefone',
      placeholder: 'Digite o telefone com DDD (ex: 11999887766)...',
      pattern: /^\d{10,11}$/,
      errorMsg: 'Digite um telefone válido (10 ou 11 dígitos)'
    }
  },
  
  maxResults: 10,
  searchTimeout: 15000,
  
  statusLabels: {
    // Status abreviados (originais)
    'pendente': '⏳ Pendente',
    'p': '⏳ Pendente',
    'em_andamento': '🔄 Em Andamento',
    'a': '🔄 Em Andamento',
    'aprovado': '✅ Aprovado',
    'rejeitado': '❌ Rejeitado',
    'r': '❌ Rejeitado',
    'concluido': '🎉 Concluído',
    'c': '🎉 Concluído',
    'cancelado': '🚫 Cancelado',
    
    // Status completos (que o admin usa)
    'reaberto': '🔄 Reaberto'
  },
  
  serviceLabels: {
    'espaco_maker': '🏭 Espaço Maker',
    'servicos': '⚙️ Serviços',
    'emprestimo': '📦 Empréstimo',
    'impressao': '🖨️ Impressão',
    'impressao_3d': '🏗️ Impressão 3D',
    'manutencao': '🔧 Manutenção',
    'arte_digital': '🎨 Arte Digital'
  },
  
  collections: {
    production: 'solicitacoes',
    test: 'solicitacoes_test'
  },
  mode: 'production',
  version: 'v3.0.1'
};

// Nome da coleção ativa
const collectionName = TRACKING_CONFIG.collections[TRACKING_CONFIG.mode];

// Função de debug
function debugLog(message, data = null) {
  if (TRACKING_CONFIG.mode === 'test') {
    console.log(`🔍 [TRACKING] ${message}`, data);
  }
}

// Verificar se está tudo configurado
if (trackingDB) {
  console.log(`🔍 SENAI Lab Tracking ${TRACKING_CONFIG.version} iniciado - Modo: ${TRACKING_CONFIG.mode.toUpperCase()}`);
  console.log(`📊 Usando coleção: ${collectionName}`);
} else {
  console.error('❌ Erro ao inicializar Firebase Firestore');
}
