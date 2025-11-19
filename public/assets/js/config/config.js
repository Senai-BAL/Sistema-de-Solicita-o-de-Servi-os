/* 🔧 SENAI Lab - Configuração e Inicialização
 * Arquivo: public/assets/js/config.js
 * Descrição: Configurações gerais e validação de dependências
 */

// 🔥 VERIFICAR E INICIALIZAR FIREBASE
// Firebase Hosting auto-inicializa via /__/firebase/init.js
// Se window.firebaseConfig existir (dev local), usar ela
let db;

if (typeof firebase === 'undefined') {
  alert('⚠️ Erro: Firebase SDK não carregado!\n\nVerifique se os scripts do Firebase estão sendo carregados corretamente.');
  throw new Error('Firebase SDK not loaded');
}

if (firebase.apps.length === 0) {
  // Tentar inicializar com config local se existir
  if (window.firebaseConfig) {
    console.log('🔧 Inicializando Firebase com configuração local...');
    firebase.initializeApp(window.firebaseConfig);
    db = firebase.firestore();
  } else {
    // Em produção, /__/firebase/init.js já deve ter inicializado
    alert('⚠️ Erro: Firebase não foi inicializado!\n\nEm desenvolvimento: copie firebase-config.example.js para firebase-config.js\nEm produção: verifique se /__/firebase/init.js está carregando');
    throw new Error('Firebase not initialized');
  }
} else {
  // Firebase já inicializado (por init.js ou firebase-config.js)
  console.log('✅ Firebase já inicializado');
  db = firebase.firestore();
}

// 🧪 CONFIGURAÇÃO DE AMBIENTE - PRODUÇÃO
window.ENVIRONMENT_CONFIG = {
  // Configuração para produção - v2.10.0
  mode: 'production', // 'production' ou 'test'
  collections: {
    production: 'solicitacoes',
    test: 'solicitacoes_test'
  }
};

// Garantir que não seja sobrescrita
Object.freeze(window.ENVIRONMENT_CONFIG);

const ENVIRONMENT_CONFIG = window.ENVIRONMENT_CONFIG;
const collectionName = ENVIRONMENT_CONFIG.collections[ENVIRONMENT_CONFIG.mode];

if (window.Logger) {
  window.Logger.debug(`Modo de ambiente: ${ENVIRONMENT_CONFIG.mode}`);
  window.Logger.debug(`Coleção: ${collectionName}`);
}

// 🧪 TESTE DE CONECTIVIDADE (opcional em produção)
async function testFirebaseConnection() {
  try {
    // Teste simples de leitura
    const testDoc = await db.collection(collectionName).limit(1).get();
    console.log('✅ Conexão Firebase OK');
    return true;
  } catch (error) {
    console.warn('⚠️ Possível problema de conexão:', error.code);
    if (error.code === 'permission-denied') {
      console.warn('🔒 Verifique as regras do Firestore');
    }
    return false;
  }
}

// Executar teste após carregamento
setTimeout(() => {
  testFirebaseConnection();
}, 2000);

// Cache offline agora é gerenciado pelo firebase-service.js

// 🐙 CONFIGURAÇÃO GITHUB API (carregada externamente)
const GITHUB_CONFIG = window.githubConfig;
