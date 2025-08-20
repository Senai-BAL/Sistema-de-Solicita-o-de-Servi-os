/* ==========================================
   SENAI Lab v3.0.0 - Tracking Search
   Funções de busca do sistema
   ========================================== */

// Função principal de busca
async function searchSolicitation() {
  const searchType = document.getElementById('searchType')?.value;
  const searchQuery = document.getElementById('searchInput')?.value?.trim();
  
  debugLog(`Iniciando busca: ${searchType} = "${searchQuery}"`);
  
  // Validar entrada
  if (!validateSearchInput(searchType, searchQuery)) {
    return;
  }
  
  // Mostrar loading e limpar resultados
  showLoading(true);
  hideResults();
  
  try {
    const results = await performSearch(searchType, searchQuery);
    
    showLoading(false);
    
    if (results.length === 0) {
      showMessage('Nenhuma solicitação encontrada. Verifique os dados e tente novamente.', 'error');
      debugLog('Nenhum resultado encontrado');
    } else if (results.length === 1) {
      debugLog(`Resultado único encontrado: ${results[0].id}`);
      showSolicitationDetails(results[0]);
    } else {
      debugLog(`${results.length} resultados encontrados`);
      showSearchResults(results);
    }
    
  } catch (error) {
    console.error('❌ Erro na busca:', error);
    showLoading(false);
    showMessage('Erro ao buscar solicitação. Tente novamente.', 'error');
    debugLog('Erro na busca:', error);
  }
}

// Função para executar a busca no Firestore
async function performSearch(searchType, searchQuery) {
  const results = [];
  
  try {
    switch (searchType) {
      case 'id':
        // Busca direta por ID do documento
        const docRef = trackingDB.collection(collectionName).doc(searchQuery);
        const docSnap = await docRef.get();
        
        if (docSnap.exists) {
          const data = docSnap.data();
          results.push({ id: docSnap.id, ...data });
          debugLog('Busca por ID realizada', { id: docSnap.id });
        }
        break;
        
      case 'email':
        // Busca por email (case insensitive)
        const emailQuery = await trackingDB.collection(collectionName)
          .where('email', '==', searchQuery.toLowerCase())
          .get();
          
        emailQuery.forEach(doc => {
          const data = doc.data();
          results.push({ id: doc.id, ...data });
        });
        
        debugLog('Busca por email realizada', { 
          email: searchQuery.toLowerCase(), 
          count: results.length 
        });
        break;
        
      case 'phone':
        // Busca por telefone (remover formatação)
        const cleanPhone = searchQuery.replace(/\D/g, '');
        const phoneQuery = await trackingDB.collection(collectionName)
          .where('telefone', '==', cleanPhone)
          .get();
          
        phoneQuery.forEach(doc => {
          const data = doc.data();
          results.push({ id: doc.id, ...data });
        });
        
        debugLog('Busca por telefone realizada', { 
          telefone: cleanPhone, 
          count: results.length 
        });
        break;
        
      default:
        throw new Error(`Tipo de busca inválido: ${searchType}`);
    }
    
  } catch (error) {
    console.error('❌ Erro ao executar busca no Firestore:', error);
    throw error;
  }
  
  return results;
}

// Função para busca avançada (múltiplos critérios)
async function performAdvancedSearch(criteria) {
  const results = [];
  
  try {
    let query = trackingDB.collection(collectionName);
    
    // Aplicar filtros
    Object.keys(criteria).forEach(key => {
      if (criteria[key] && criteria[key].trim() !== '') {
        query = query.where(key, '==', criteria[key]);
      }
    });
    
    const querySnapshot = await query.get();
    querySnapshot.forEach(doc => {
      const data = doc.data();
      results.push({ id: doc.id, ...data });
    });
    
    debugLog('Busca avançada realizada', { criteria, count: results.length });
    
  } catch (error) {
    console.error('❌ Erro na busca avançada:', error);
    throw error;
  }
  
  return results;
}

// Função para busca por palavra-chave (futuro)
async function performKeywordSearch(keyword) {
  // Para implementar no futuro quando Firestore suportar full-text search
  // ou quando integrarmos com Algolia/Elasticsearch
  console.log('Busca por palavra-chave ainda não implementada:', keyword);
  return [];
}

debugLog('Módulo de busca carregado');
