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
      if (window.Logger) {
        window.Logger.error('Erro busca por ID:', error);
      }
      throw new Error('Erro ao buscar por código');
    }
  }
  
  // Busca por email
  static async searchByEmail(email) {
    try {
      const normalizedEmail = email.toLowerCase().trim();

      // Primeira tentativa: com orderBy (requer índice)
      try {
        const query = await trackingDB.collection(collectionName)
          .where('e', '==', normalizedEmail)
          .orderBy('d', 'desc')
          .limit(TRACKING_CONFIG.maxResults)
          .get();

        return query.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (indexError) {
        // Se falhar por falta de índice, fazer busca simples
        if (indexError.code === 'failed-precondition') {
          if (window.Logger) {
            window.Logger.warn('Índice não disponível, usando busca simples por email');
          }

          const query = await trackingDB.collection(collectionName)
            .where('e', '==', normalizedEmail)
            .limit(TRACKING_CONFIG.maxResults)
            .get();

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
      if (window.Logger) {
        window.Logger.error('Erro busca por email:', error);
      }
      throw new Error('Erro ao buscar por email');
    }
  }
  
  // Busca por telefone
  static async searchByPhone(phone) {
    try {
      const normalizedPhone = phone.replace(/\D/g, '');

      // Tentar diferentes formatos de telefone
      const phoneVariations = [
        normalizedPhone,              // 11999887766
        phone.trim(),                 // formato original
        `+55${normalizedPhone}`,      // +5511999887766
        `55${normalizedPhone}`        // 5511999887766
      ];

      // Primeira tentativa: com orderBy (requer índice)
      for (const phoneVar of phoneVariations) {
        try {
          const query = await trackingDB.collection(collectionName)
            .where('w', '==', phoneVar)
            .orderBy('d', 'desc')
            .limit(TRACKING_CONFIG.maxResults)
            .get();

          if (!query.empty) {
            return query.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          }
        } catch (indexError) {
          // Se falhar por falta de índice, fazer busca simples
          if (indexError.code === 'failed-precondition') {
            if (window.Logger) {
              window.Logger.warn(`Índice não disponível, usando busca simples para: "${phoneVar}"`);
            }

            const query = await trackingDB.collection(collectionName)
              .where('w', '==', phoneVar)
              .limit(TRACKING_CONFIG.maxResults)
              .get();

            if (!query.empty) {
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

      return [];

    } catch (error) {
      if (window.Logger) {
        window.Logger.error('Erro busca por telefone:', error);
      }
      throw new Error('Erro ao buscar por telefone');
    }
  }
}
