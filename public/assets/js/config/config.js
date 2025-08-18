/* 🔧 SENAI Lab - Configuração e Inicialização
 * Arquivo: public/assets/js/config.js
 * Descrição: Configurações gerais e validação de dependências
 */

// 🔥 VERIFICAR SE A CONFIGURAÇÃO FIREBASE FOI CARREGADA
if (!window.firebaseConfig) {
  alert('⚠️ Erro: Arquivo firebase-config.js não encontrado!\n\nPor favor:\n1. Copie shared/firebase-config.example.js para shared/firebase-config.js\n2. Substitua pelas suas credenciais Firebase');
  throw new Error('Firebase configuration not found');
}

// Verificar se Firebase já foi inicializado pelo firebase-service.js
let db;
if (firebase.apps.length === 0) {
  // Inicializar Firebase apenas se não foi inicializado
  firebase.initializeApp(window.firebaseConfig);
  db = firebase.firestore();
} else {
  // Usar instância existente
  db = firebase.firestore();
}

// 🧪 CONFIGURAÇÃO DE AMBIENTE
const ENVIRONMENT_CONFIG = {
  // Configuração para teste - branch test-environment-v2
  mode: 'test', // 'production' ou 'test'
  collections: {
    production: 'solicitacoes',
    test: 'solicitacoes_test'
  }
};

// Proteger configuração contra alterações acidentais
Object.freeze(ENVIRONMENT_CONFIG);

const collectionName = ENVIRONMENT_CONFIG.collections[ENVIRONMENT_CONFIG.mode];

console.log(`📂 Usando coleção: ${collectionName} (modo: ${ENVIRONMENT_CONFIG.mode})`);

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
