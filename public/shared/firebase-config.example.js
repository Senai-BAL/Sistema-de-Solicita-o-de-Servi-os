// 🔥 CONFIGURAÇÃO FIREBASE - EXEMPLO
// Copie este arquivo para firebase-config.js e substitua pelas suas credenciais

const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com", // Atenção: use .appspot.com
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456",
  measurementId: "G-XXXXXXXXXX"
};

// Exportar para uso no projeto
window.firebaseConfig = firebaseConfig;

// Ambiente de teste: configure ENVIRONMENT_CONFIG.mode = 'test' no arquivo de configuração principal.
