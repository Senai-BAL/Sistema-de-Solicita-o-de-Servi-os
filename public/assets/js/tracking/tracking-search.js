/* ==========================================
   SENAI Lab v3.0.0 - Tracking Search
   Lógica de busca no Firebase
   ========================================== */

// Lógica de busca no Firebase
class TrackingSearch {
  
  // Busca por ID específico
  static async searchById(id) {
    try {
      const doc = await trackingDB.collection(collectionName).doc(id).get();
      
      if (doc.exists) {
        const data = doc.data();
        return [{ id: doc.id, ...data }];
      } else {
        // Nenhum documento encontrado
      }
      return [];
    } catch (error) {
      console.error('Erro busca por ID:', error);
      throw new Error('Erro ao buscar por código');
    }
  }
  
  // Busca por email
  static async searchByEmail(email) {
    try {
      console.log(`🔍 Iniciando busca por email: "${email}"`);
      
      // Normalizar email
      const normalizedEmail = email.toLowerCase().trim();
      console.log(`📧 Email normalizado: "${normalizedEmail}"`);
      
      // Primeira tentativa: com orderBy (requer índice) - CAMPO CORRETO: 'e'
      try {
        console.log('📊 Tentando busca com orderBy...');
        const query = await trackingDB.collection(collectionName)
          .where('e', '==', normalizedEmail)
          .orderBy('d', 'desc')
          .limit(TRACKING_CONFIG.maxResults)
          .get();
        
        console.log(`✅ Busca com orderBy bem-sucedida: ${query.size} resultado(s)`);
        return query.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (indexError) {
        // Se falhar por falta de índice, fazer busca simples
        if (indexError.code === 'failed-precondition') {
          console.warn('⚠️ Índice não disponível, usando busca simples por email');
          
          const query = await trackingDB.collection(collectionName)
            .where('e', '==', normalizedEmail)
            .limit(TRACKING_CONFIG.maxResults)
            .get();
          
          console.log(`✅ Busca simples bem-sucedida: ${query.size} resultado(s)`);
          
          // Ordenar no cliente
          const results = query.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          return results.sort((a, b) => {
            const timeA = a.d || 0;
            const timeB = b.d || 0;
            return timeB - timeA;
          });
        }
        throw indexError;
      }
    } catch (error) {
      console.error('❌ Erro busca por email:', error);
      
      // Tentar busca de debug
      try {
        console.log('🔧 Executando busca de debug...');
        const debugQuery = await trackingDB.collection(collectionName)
          .limit(5)
          .get();
        
        console.log(`📊 Total de documentos na coleção: ${debugQuery.size}`);
        debugQuery.docs.forEach((doc, index) => {
          const data = doc.data();
          console.log(`📄 Doc ${index + 1}: email="${data.e}", id="${doc.id}"`);
        });
      } catch (debugError) {
        console.error('❌ Erro na busca de debug:', debugError);
      }
      
      throw new Error('Erro ao buscar por email');
    }
  }
  
  // Busca por telefone
  static async searchByPhone(phone) {
    try {
      console.log(`📱 Iniciando busca por telefone: "${phone}"`);
      
      // Normalizar telefone (remover caracteres não numéricos)
      const normalizedPhone = phone.replace(/\D/g, '');
      console.log(`📱 Telefone normalizado: "${normalizedPhone}"`);
      
      // Tentar diferentes formatos de telefone
      const phoneVariations = [
        normalizedPhone,              // 11999887766
        phone.trim(),                 // formato original
        `+55${normalizedPhone}`,      // +5511999887766
        `55${normalizedPhone}`        // 5511999887766
      ];
      
      console.log('📱 Variações de telefone a testar:', phoneVariations);
      
      // Primeira tentativa: com orderBy (requer índice) - CAMPO CORRETO: 'w'
      for (const phoneVar of phoneVariations) {
        try {
          console.log(`📊 Tentando busca com orderBy para: "${phoneVar}"`);
          const query = await trackingDB.collection(collectionName)
            .where('w', '==', phoneVar)
            .orderBy('d', 'desc')
            .limit(TRACKING_CONFIG.maxResults)
            .get();
          
          if (!query.empty) {
            console.log(`✅ Busca com orderBy bem-sucedida: ${query.size} resultado(s) para "${phoneVar}"`);
            return query.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          }
        } catch (indexError) {
          // Se falhar por falta de índice, fazer busca simples
          if (indexError.code === 'failed-precondition') {
            console.warn(`⚠️ Índice não disponível, usando busca simples para: "${phoneVar}"`);
            
            const query = await trackingDB.collection(collectionName)
              .where('w', '==', phoneVar)
              .limit(TRACKING_CONFIG.maxResults)
              .get();
            
            if (!query.empty) {
              console.log(`✅ Busca simples bem-sucedida: ${query.size} resultado(s) para "${phoneVar}"`);
              
              // Ordenar no cliente
              const results = query.docs.map(doc => ({ id: doc.id, ...doc.data() }));
              return results.sort((a, b) => {
                const timeA = a.d || 0;
                const timeB = b.d || 0;
                return timeB - timeA;
              });
            }
          } else {
            throw indexError;
          }
        }
      }
      
      console.log('📱 Nenhuma variação de telefone encontrou resultados');
      return [];
      
    } catch (error) {
      console.error('❌ Erro busca por telefone:', error);
      
      // Tentar busca de debug
      try {
        console.log('🔧 Executando busca de debug para telefones...');
        const debugQuery = await trackingDB.collection(collectionName)
          .limit(5)
          .get();
        
        console.log(`📊 Total de documentos na coleção: ${debugQuery.size}`);
        debugQuery.docs.forEach((doc, index) => {
          const data = doc.data();
          console.log(`📄 Doc ${index + 1}: whatsapp="${data.w}", id="${doc.id}"`);
        });
      } catch (debugError) {
        console.error('❌ Erro na busca de debug:', debugError);
      }
      
      throw new Error('Erro ao buscar por telefone');
    }
  }
}

console.log('🔍 Tracking Search carregado - Modo Produção');
