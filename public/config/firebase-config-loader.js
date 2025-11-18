// 🔥 FIREBASE CONFIG LOADER
// Arquivo: public/config/firebase-config-loader.js
// Carrega configuração do Firebase de forma segura

(function() {
  'use strict';

  // Tenta carregar a configuração do Firebase
  // Ordem de prioridade:
  // 1. window.firebaseConfig (já carregado via firebase-config.js)
  // 2. Firebase Hosting Reserved URLs (__/firebase/init.json)
  // 3. Ambiente de teste com exemplo

  if (window.firebaseConfig) {
    // Configuração já carregada via firebase-config.js
    console.log('🔥 Firebase config carregada de firebase-config.js');
    return;
  }

  // Tentar carregar do Firebase Hosting
  const loadFromHosting = async () => {
    try {
      const response = await fetch('/__/firebase/init.json');
      if (response.ok) {
        const config = await response.json();
        window.firebaseConfig = config;
        console.log('🔥 Firebase config carregada do Firebase Hosting');

        // Disparar evento para inicializar Firebase
        window.dispatchEvent(new Event('firebaseConfigLoaded'));
        return true;
      }
    } catch (error) {
      console.warn('⚠️ Não foi possível carregar config do Hosting:', error.message);
    }
    return false;
  };

  // Executar carregamento
  loadFromHosting().then(loaded => {
    if (!loaded) {
      console.error('❌ Firebase config não encontrada!');
      console.error('Certifique-se de que firebase-config.js existe ou que está rodando no Firebase Hosting');
    }
  });

})();
