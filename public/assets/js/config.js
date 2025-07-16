/* 🔧 SENAI Lab - Configuração e Inicialização
 * Arquivo: public/assets/js/config.js
 * Descrição: Configurações gerais e validação de dependências
 */

// 🔥 VERIFICAR SE A CONFIGURAÇÃO FIREBASE FOI CARREGADA
if (!window.firebaseConfig) {
  alert('⚠️ Erro: Arquivo firebase-config.js não encontrado!\n\nPor favor:\n1. Copie shared/firebase-config.example.js para shared/firebase-config.js\n2. Substitua pelas suas credenciais Firebase');
  throw new Error('Firebase configuration not found');
}

// 🐙 VERIFICAR SE A CONFIGURAÇÃO GITHUB FOI CARREGADA
if (!window.githubConfig) {
  alert('⚠️ Erro: Arquivo github-config.js não encontrado!\n\nPor favor:\n1. Copie shared/github-config.example.js para shared/github-config.js\n2. Substitua pelas suas credenciais GitHub');
  throw new Error('GitHub configuration not found');
}

// Inicializar Firebase com a configuração externa
firebase.initializeApp(window.firebaseConfig);
const db = firebase.firestore();

// 🧪 CONFIGURAÇÃO DE AMBIENTE
const ENVIRONMENT_CONFIG = {
  // Altere para 'production' ou 'test' conforme necessário
  mode: 'test', // 'production' ou 'test'
  collections: {
    production: 'solicitacoes',
    test: 'solicitacoes_test'
  }
};

const collectionName = ENVIRONMENT_CONFIG.collections[ENVIRONMENT_CONFIG.mode];
console.log(`🔥 Firebase Service iniciado em modo: ${ENVIRONMENT_CONFIG.mode.toUpperCase()}`);
console.log(`📂 Coleção: ${collectionName}`);

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

// Ativar cache offline (opcional - pode causar problemas de permissão)
try {
  db.enablePersistence().catch((err) => {
    if (err.code === 'failed-precondition') {
      console.log('⚠️ Cache offline: Múltiplas abas abertas');
    } else if (err.code === 'unimplemented') {
      console.log('⚠️ Cache offline: Navegador não suporta');
    } else {
      console.log('⚠️ Cache offline não disponível:', err.code);
    }
  });
} catch (err) {
  console.log('⚠️ Erro ao habilitar cache offline:', err);
}

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
