/* ==========================================
   SENAI Lab v3.0.0 - Firebase Data Analyzer
   Script para análise detalhada dos dados
   ========================================== */

// Executar no console do navegador para análise detalhada
async function analyzeFirebaseData() {
    console.log('🔍 INICIANDO ANÁLISE DETALHADA DO FIREBASE');
    console.log('==========================================');
    
    try {
        // Verificar configuração
        console.log('📋 CONFIGURAÇÃO:');
        console.log('Project ID:', window.firebaseConfig?.projectId);
        console.log('Auth Domain:', window.firebaseConfig?.authDomain);
        
        if (!db) {
            console.error('❌ Database não inicializado');
            return;
        }
        
        // Analisar collection de teste
        await analyzeCollection('solicitacoes_test', '🧪 DADOS DE TESTE');
        
        // Analisar collection de produção
        await analyzeCollection('solicitacoes', '🚀 DADOS DE PRODUÇÃO');
        
        // Analisar logs
        await analyzeCollection('admin_logs_test', '📋 LOGS DE TESTE');
        
        console.log('✅ ANÁLISE COMPLETA');
        
    } catch (error) {
        console.error('❌ Erro na análise:', error);
    }
}

async function analyzeCollection(collectionName, title) {
    console.log(`\n${title}`);
    console.log('='.repeat(title.length));
    
    try {
        // Contar total de documentos
        const snapshot = await db.collection(collectionName).get();
        console.log(`📊 Total de documentos: ${snapshot.size}`);
        
        if (snapshot.empty) {
            console.log('⚠️ Collection vazia');
            return;
        }
        
        // Analisar estrutura
        const fields = new Set();
        const statusCount = {};
        const serviceCount = {};
        const dates = [];
        
        snapshot.forEach(doc => {
            const data = doc.data();
            
            // Coletar campos
            Object.keys(data).forEach(key => fields.add(key));
            
            // Contar status
            if (data.status) {
                statusCount[data.status] = (statusCount[data.status] || 0) + 1;
            }
            
            // Contar serviços
            if (data.servicoSelecionado) {
                serviceCount[data.servicoSelecionado] = (serviceCount[data.servicoSelecionado] || 0) + 1;
            }
            
            // Coletar datas
            if (data.timestamp) {
                const date = data.timestamp.toDate ? data.timestamp.toDate() : new Date(data.timestamp);
                dates.push(date);
            }
        });
        
        // Relatório de campos
        console.log(`\n🗂️ Campos encontrados (${fields.size}):`);
        Array.from(fields).sort().forEach(field => {
            console.log(`  - ${field}`);
        });
        
        // Relatório de status
        if (Object.keys(statusCount).length > 0) {
            console.log('\n📊 Distribuição de Status:');
            Object.entries(statusCount).forEach(([status, count]) => {
                console.log(`  - ${status}: ${count}`);
            });
        }
        
        // Relatório de serviços
        if (Object.keys(serviceCount).length > 0) {
            console.log('\n🔧 Distribuição de Serviços:');
            Object.entries(serviceCount).forEach(([service, count]) => {
                console.log(`  - ${service}: ${count}`);
            });
        }
        
        // Relatório de datas
        if (dates.length > 0) {
            dates.sort();
            const oldest = dates[0];
            const newest = dates[dates.length - 1];
            console.log('\n📅 Período dos dados:');
            console.log(`  - Mais antigo: ${oldest.toLocaleString('pt-BR')}`);
            console.log(`  - Mais recente: ${newest.toLocaleString('pt-BR')}`);
        }
        
        // Amostras de dados
        console.log('\n🔍 Amostra dos últimos 3 documentos:');
        const latest = await db.collection(collectionName)
            .orderBy('timestamp', 'desc')
            .limit(3)
            .get();
            
        latest.forEach((doc, index) => {
            console.log(`\n  📄 Documento ${index + 1} (ID: ${doc.id}):`);
            const data = doc.data();
            Object.entries(data).forEach(([key, value]) => {
                if (key === 'timestamp' && value?.toDate) {
                    console.log(`    ${key}: ${value.toDate().toLocaleString('pt-BR')}`);
                } else {
                    console.log(`    ${key}: ${JSON.stringify(value)}`);
                }
            });
        });
        
    } catch (error) {
        console.error(`❌ Erro ao analisar collection '${collectionName}':`, error);
    }
}

// Função para testar operações CRUD
async function testCRUDOperations() {
    console.log('\n🧪 TESTANDO OPERAÇÕES CRUD');
    console.log('===========================');
    
    const testCollection = 'solicitacoes_test';
    let testDocId;
    
    try {
        // CREATE
        console.log('➕ Testando CREATE...');
        const testData = {
            colaborador: 'Teste CRUD',
            email: 'crud@teste.com',
            telefone: '11888888888',
            servicoSelecionado: 'servicos',
            status: 'pendente',
            descricao: 'Teste de operações CRUD',
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            isCrudTest: true
        };
        
        const docRef = await db.collection(testCollection).add(testData);
        testDocId = docRef.id;
        console.log(`✅ CREATE: Documento criado com ID ${testDocId}`);
        
        // READ
        console.log('📖 Testando READ...');
        const docSnap = await docRef.get();
        if (docSnap.exists) {
            console.log('✅ READ: Documento encontrado');
            console.log('  Dados:', docSnap.data());
        } else {
            console.log('❌ READ: Documento não encontrado');
        }
        
        // UPDATE
        console.log('✏️ Testando UPDATE...');
        await docRef.update({
            status: 'em_andamento',
            observacoes: 'Atualizado via teste CRUD'
        });
        console.log('✅ UPDATE: Documento atualizado');
        
        // READ após UPDATE
        const updatedDoc = await docRef.get();
        console.log('📖 Dados após UPDATE:', updatedDoc.data());
        
        // DELETE
        console.log('🗑️ Testando DELETE...');
        await docRef.delete();
        console.log('✅ DELETE: Documento removido');
        
        // Verificar se foi deletado
        const deletedDoc = await docRef.get();
        if (!deletedDoc.exists) {
            console.log('✅ Confirmado: Documento foi deletado');
        }
        
        console.log('🎉 Todos os testes CRUD passaram!');
        
    } catch (error) {
        console.error('❌ Erro nos testes CRUD:', error);
        
        // Limpar em caso de erro
        if (testDocId) {
            try {
                await db.collection(testCollection).doc(testDocId).delete();
                console.log('🧹 Documento de teste removido');
            } catch (cleanupError) {
                console.error('❌ Erro na limpeza:', cleanupError);
            }
        }
    }
}

// Função para verificar índices
async function checkIndexes() {
    console.log('\n📊 VERIFICANDO PERFORMANCE DE QUERIES');
    console.log('=====================================');
    
    const testCollection = 'solicitacoes_test';
    
    try {
        // Query por email
        console.log('🔍 Testando query por email...');
        const start1 = performance.now();
        const emailQuery = await db.collection(testCollection)
            .where('email', '==', 'teste@email.com')
            .limit(5)
            .get();
        const end1 = performance.now();
        console.log(`✅ Query por email: ${emailQuery.size} resultados em ${(end1 - start1).toFixed(2)}ms`);
        
        // Query por telefone
        console.log('🔍 Testando query por telefone...');
        const start2 = performance.now();
        const phoneQuery = await db.collection(testCollection)
            .where('telefone', '==', '11999999999')
            .limit(5)
            .get();
        const end2 = performance.now();
        console.log(`✅ Query por telefone: ${phoneQuery.size} resultados em ${(end2 - start2).toFixed(2)}ms`);
        
        // Query por status
        console.log('🔍 Testando query por status...');
        const start3 = performance.now();
        const statusQuery = await db.collection(testCollection)
            .where('status', '==', 'pendente')
            .limit(10)
            .get();
        const end3 = performance.now();
        console.log(`✅ Query por status: ${statusQuery.size} resultados em ${(end3 - start3).toFixed(2)}ms`);
        
        // Query ordenada por timestamp
        console.log('🔍 Testando query ordenada...');
        const start4 = performance.now();
        const orderedQuery = await db.collection(testCollection)
            .orderBy('timestamp', 'desc')
            .limit(10)
            .get();
        const end4 = performance.now();
        console.log(`✅ Query ordenada: ${orderedQuery.size} resultados em ${(end4 - start4).toFixed(2)}ms`);
        
    } catch (error) {
        console.error('❌ Erro ao verificar índices:', error);
    }
}

console.log('🔧 Scripts de análise carregados. Execute:');
console.log('  - analyzeFirebaseData() para análise completa');
console.log('  - testCRUDOperations() para testar operações');
console.log('  - checkIndexes() para verificar performance');
