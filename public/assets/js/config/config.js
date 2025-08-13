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
  // Altere para 'production' ou 'test' conforme necessário
  mode: 'production', // 'production' ou 'test'
  collections: {
    production: 'solicitacoes',
    test: 'solicitacoes_test'
  }
};

const collectionName = ENVIRONMENT_CONFIG.collections[ENVIRONMENT_CONFIG.mode];
console.log(`� Config.js carregado - Modo: ${ENVIRONMENT_CONFIG.mode.toUpperCase()}`);
console.log(`📂 Coleção de fallback: ${collectionName}`);

// 🧪 TESTE DE CONECTIVIDADE (opcional)
async function testFirebaseConnection() {
  try {
    // Teste simples de leitura
    const testDoc = await db.collection(collectionName).limit(1).get();
    console.log('✅ Conexão Firebase OK - Regras funcionando');
    return true;
  } catch (error) {
    console.warn('⚠️ Possível problema de conexão/permissão:', error.code);
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

console.log(`
🔥 SENAI Lab - GitHub Storage (NOVO PADRÃO)
📊 Recursos utilizados:
   • Firestore: 20.000 writes/dia (gratuito)
   • GitHub: 1GB storage + 5k requests/hora (gratuito)
   • Firebase Hosting: 10GB (gratuito)

💡 Funcionalidades ativas:
   ✅ Upload automático para GitHub
   ✅ Compressão automática de imagens
   ✅ Progress bars visuais
   ✅ NOVO: Pasta única organizacional
   ✅ NOVO: Nomenclatura padronizada
   ✅ URLs públicas permanentes
   ✅ Retry automático em falhas

🎯 100% Gratuito - Custo: R$ 0,00

📂 Nova Estrutura GitHub:
   📁 senai-arquivos/
      📄 TIPO_DATA_SOLICITANTE_ARQUIVO
      📄 Ex: IMPRESSAO_20250715_123000_JOAO_documento.pdf
      📸 Ex: EMPRESTIMO_20250715_140500_MARIA_foto.jpg
      📷 Ex: MANUTENCAO_20250715_160000_PEDRO_problema.png

🏢 Organização: Senai-BAL
📁 Repositório: senai-lab-arquivos
`);
