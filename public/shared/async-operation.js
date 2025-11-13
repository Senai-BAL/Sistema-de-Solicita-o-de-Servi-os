/* 🔧 SENAI Lab - Helper de Operações Assíncronas
 * Arquivo: public/shared/async-operation.js
 * Descrição: Helper para evitar duplicação de padrões try-catch com loading/toast
 */

/**
 * Classe auxiliar para executar operações assíncronas com feedback visual padrão
 */
class AsyncOperation {
  /**
   * Executa operação assíncrona com loading e feedback automático
   * @param {Function} operation - Função assíncrona a executar
   * @param {Object} messages - Mensagens personalizadas
   * @param {string} messages.loading - Mensagem durante execução
   * @param {string} messages.success - Mensagem de sucesso
   * @param {string} messages.error - Mensagem de erro
   * @param {boolean} showSuccessToast - Se deve exibir toast de sucesso (padrão: true)
   * @returns {Promise<any>} Resultado da operação
   * @throws {Error} Erro da operação
   */
  static async execute(operation, messages = {}, showSuccessToast = true) {
    const defaultMessages = {
      loading: 'Carregando...',
      success: 'Operação realizada com sucesso!',
      error: 'Erro ao executar operação'
    };

    const msgs = { ...defaultMessages, ...messages };

    try {
      // Mostrar loading
      if (typeof LoadingManager !== 'undefined' && LoadingManager.show) {
        LoadingManager.show(msgs.loading);
      }

      // Executar operação
      const result = await operation();

      // Mostrar sucesso
      if (showSuccessToast && typeof ToastManager !== 'undefined' && ToastManager.show) {
        ToastManager.show(msgs.success, 'success');
      }

      return result;

    } catch (error) {
      // Log do erro
      if (window.Logger) {
        window.Logger.error(msgs.error, error);
      } else {
        console.error(msgs.error, error);
      }

      // Mostrar erro
      if (typeof ToastManager !== 'undefined' && ToastManager.show) {
        ToastManager.show(msgs.error, 'error');
      }

      // Re-lançar erro para tratamento específico se necessário
      throw error;

    } finally {
      // Sempre esconder loading
      if (typeof LoadingManager !== 'undefined' && LoadingManager.hide) {
        LoadingManager.hide();
      }
    }
  }

  /**
   * Executa operação sem exibir toast de sucesso (útil para operações silenciosas)
   * @param {Function} operation - Função assíncrona a executar
   * @param {Object} messages - Mensagens personalizadas
   * @returns {Promise<any>} Resultado da operação
   */
  static async executeSilent(operation, messages = {}) {
    return this.execute(operation, messages, false);
  }

  /**
   * Executa múltiplas operações em paralelo
   * @param {Array<Function>} operations - Array de funções assíncronas
   * @param {Object} messages - Mensagens personalizadas
   * @returns {Promise<Array>} Array com resultados
   */
  static async executeParallel(operations, messages = {}) {
    const operation = () => Promise.all(operations.map(op => op()));
    return this.execute(operation, {
      loading: messages.loading || 'Executando operações...',
      success: messages.success || 'Todas as operações concluídas!',
      error: messages.error || 'Erro ao executar operações'
    });
  }

  /**
   * Executa operação com retry automático
   * @param {Function} operation - Função assíncrona a executar
   * @param {number} maxRetries - Número máximo de tentativas (padrão: 3)
   * @param {number} delay - Delay entre tentativas em ms (padrão: 1000)
   * @param {Object} messages - Mensagens personalizadas
   * @returns {Promise<any>} Resultado da operação
   */
  static async executeWithRetry(operation, maxRetries = 3, delay = 1000, messages = {}) {
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const customMessages = {
          ...messages,
          loading: messages.loading || `Tentativa ${attempt}/${maxRetries}...`
        };

        return await this.execute(operation, customMessages);

      } catch (error) {
        lastError = error;

        if (attempt < maxRetries) {
          // Aguardar antes de tentar novamente
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    // Se todas as tentativas falharam
    const errorMsg = messages.error || `Falha após ${maxRetries} tentativas`;

    if (typeof ToastManager !== 'undefined' && ToastManager.show) {
      ToastManager.show(errorMsg, 'error');
    }

    throw lastError;
  }
}

// Expor no escopo global
if (typeof window !== 'undefined') {
  window.AsyncOperation = AsyncOperation;
}

// Exemplos de uso:
/*

// 1. Uso básico
await AsyncOperation.execute(
  () => firebaseService.updateRequest(id, data),
  {
    loading: 'Salvando dados...',
    success: 'Dados salvos com sucesso!',
    error: 'Erro ao salvar dados'
  }
);

// 2. Operação silenciosa (sem toast de sucesso)
const result = await AsyncOperation.executeSilent(
  () => firebaseService.getData(),
  { loading: 'Carregando...', error: 'Erro ao carregar' }
);

// 3. Múltiplas operações em paralelo
await AsyncOperation.executeParallel([
  () => firebaseService.loadRequests(),
  () => firebaseService.loadStats(),
  () => firebaseService.loadLogs()
], {
  loading: 'Carregando todos os dados...',
  success: 'Dados carregados!',
  error: 'Erro ao carregar dados'
});

// 4. Com retry automático
await AsyncOperation.executeWithRetry(
  () => firebaseService.unstableOperation(),
  3,  // 3 tentativas
  2000,  // 2 segundos entre tentativas
  {
    success: 'Operação concluída!',
    error: 'Falha após múltiplas tentativas'
  }
);

*/
