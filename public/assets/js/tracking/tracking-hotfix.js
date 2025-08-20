/* ==========================================
   SENAI Lab v3.0.0 - Tracking Search Hotfix
   Hotfix para funcionar sem índices compostos
   ========================================== */

// Sobrescrever função de busca avançada temporariamente
async function performAdvancedSearchWithoutIndexes(criteria) {
  const results = [];
  
  try {
    debugLog('🔧 Usando busca sem índices compostos (hotfix)');
    
    // Buscar todos os documentos ordenados por timestamp
    const query = trackingDB.collection(collectionName)
      .orderBy('timestamp', 'desc')
      .limit(100); // Limitar para performance
      
    const querySnapshot = await query.get();
    
    // Filtrar no cliente
    querySnapshot.forEach(doc => {
      const data = doc.data();
      let match = true;
      
      // Aplicar filtros no cliente
      Object.keys(criteria).forEach(key => {
        if (criteria[key] && criteria[key].trim() !== '') {
          if (data[key] !== criteria[key]) {
            match = false;
          }
        }
      });
      
      if (match) {
        results.push({ id: doc.id, ...data });
      }
    });
    
    debugLog('🔧 Busca sem índices concluída', { 
      total_docs: querySnapshot.size, 
      filtered_results: results.length,
      criteria 
    });
    
  } catch (error) {
    debugLog('❌ Erro na busca sem índices:', error);
    throw error;
  }
  
  return results;
}

// Função para verificar se índices estão disponíveis
async function checkIndexAvailability() {
  try {
    // Tentar uma query que requer índice
    await trackingDB.collection(collectionName)
      .where('status', '==', 'pendente')
      .orderBy('timestamp', 'desc')
      .limit(1)
      .get();
      
    debugLog('✅ Índices compostos disponíveis');
    return true;
    
  } catch (error) {
    if (error.code === 'failed-precondition' && error.message.includes('index')) {
      debugLog('⚠️ Índices compostos não disponíveis, usando hotfix');
      return false;
    }
    throw error;
  }
}

// Função de busca inteligente que detecta índices
async function performSmartSearch(searchType, searchQuery) {
  // Para buscas simples (ID, email, telefone), usar função original
  if (['id', 'email', 'phone'].includes(searchType)) {
    return await performSearch(searchType, searchQuery);
  }
  
  // Para buscas complexas, verificar se índices estão disponíveis
  const indexesAvailable = await checkIndexAvailability();
  
  if (indexesAvailable) {
    return await performAdvancedSearch({ [searchType]: searchQuery });
  } else {
    return await performAdvancedSearchWithoutIndexes({ [searchType]: searchQuery });
  }
}

// Função para mostrar aviso sobre índices
function showIndexWarning() {
  const warningHtml = `
    <div class="message warning" style="margin: 20px 0;">
      <span>
        ⚠️ <strong>Aviso:</strong> Alguns índices do Firestore ainda estão sendo construídos. 
        As buscas podem estar mais lentas temporariamente.
        <br><br>
        🔗 <a href="https://console.firebase.google.com/project/senai-lab-6fe79/firestore/indexes" 
              target="_blank" style="color: #667eea; text-decoration: underline;">
              Verificar status dos índices
        </a>
      </span>
      <button onclick="this.parentElement.remove()">×</button>
    </div>
  `;
  
  const formContent = document.querySelector('.form-content');
  if (formContent && !document.querySelector('.index-warning')) {
    const warningDiv = document.createElement('div');
    warningDiv.className = 'index-warning';
    warningDiv.innerHTML = warningHtml;
    formContent.insertBefore(warningDiv, formContent.firstChild);
  }
}

// Verificar índices na inicialização
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const indexesAvailable = await checkIndexAvailability();
    if (!indexesAvailable) {
      showIndexWarning();
    }
  } catch (error) {
    debugLog('Erro ao verificar índices:', error);
  }
});

debugLog('🔧 Hotfix para índices carregado');
