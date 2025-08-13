// 🔥 CONFIGURAÇÃO DO FIREBASE - EXEMPLO
// Arquivo: public/config/firebase-config.example.js
// 
// ⚠️ IMPORTANTE: 
// 1. Copie este arquivo para 'firebase-config.js'
// 2. Substitua os valores pelos seus dados do Firebase
// 3. Adicione 'firebase-config.js' ao .gitignore

window.firebaseConfig = {
  apiKey: "sua-api-key-aqui",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto-id",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// 📝 INSTRUÇÕES DE CONFIGURAÇÃO:
// 
// 1. Acesse o Firebase Console (https://console.firebase.google.com)
// 2. Selecione seu projeto
// 3. Vá em "Configurações do projeto" > "Suas aplicações"
// 4. Clique em "Configuração" do seu app web
// 5. Copie os valores e substitua acima
// 
// 🔒 SEGURANÇA:
// - Nunca faça commit do arquivo firebase-config.js
// - Use variáveis de ambiente em produção
// - Configure as regras do Firestore adequadamente
