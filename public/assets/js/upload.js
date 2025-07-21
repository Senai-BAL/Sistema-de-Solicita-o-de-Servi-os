/* 🔧 SENAI Lab - Sistema de Upload
 * Arquivo: public/assets/js/upload.js
 * Descrição: Funcionalidades de upload para GitHub e compressão de imagens
 */

// 🖼️ COMPRESSÃO DE IMAGENS
function compressImage(file, maxWidth = 1200, quality = 0.8) {
  return new Promise((resolve) => {
    if (!file.type.startsWith('image/')) {
      resolve(file); // Não é imagem, retorna original
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = function() {
      let { width, height } = this;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(this, 0, 0, width, height);

      canvas.toBlob((blob) => {
        // 🧹 CLEANUP: Liberar URL blob da memória
        URL.revokeObjectURL(img.src);
        
        // Criar novo arquivo com nome original
        const compressedFile = new File([blob], file.name, {
          type: 'image/jpeg',
          lastModified: Date.now()
        });
        resolve(compressedFile);
      }, 'image/jpeg', quality);
    };

    // 🚨 MEMORY LEAK FIX: Guardar URL para cleanup posterior
    const imageUrl = URL.createObjectURL(file);
    img.src = imageUrl;
    
    // 🛡️ SAFETY: Cleanup em caso de erro
    img.onerror = function() {
      URL.revokeObjectURL(imageUrl);
      resolve(file); // Retorna arquivo original se houver erro
    };
  });
}

// 🔄 CONVERTER ARQUIVO PARA BASE64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    // 🛡️ VALIDATION: Verificar se file é válido
    if (!file || !(file instanceof File || file instanceof Blob)) {
      reject(new Error('Arquivo inválido para conversão Base64'));
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      try {
        const result = reader.result;
        if (!result || typeof result !== 'string') {
          throw new Error('Resultado de leitura inválido');
        }
        const base64Data = result.split(',')[1];
        if (!base64Data) {
          throw new Error('Falha na conversão para Base64');
        }
        resolve(base64Data);
      } catch (error) {
        reject(new Error(`Erro na conversão Base64: ${error.message}`));
      }
    };
    reader.onerror = error => reject(new Error(`Erro na leitura do arquivo: ${error.message || 'Erro desconhecido'}`));
  });
}

// 🐙 UPLOAD PARA GITHUB COM NOVO PADRÃO DE NOMENCLATURA
async function uploadToGitHub(file, serviceInfo, progressCallback) {
  try {
    // 🛡️ VALIDATION: Verificar parâmetros obrigatórios
    if (!file) throw new Error('Arquivo não fornecido');
    if (!serviceInfo || !serviceInfo.tipo || !serviceInfo.solicitante) {
      throw new Error('Informações de serviço incompletas');
    }
    if (!GITHUB_CONFIG || !GITHUB_CONFIG.token) {
      throw new Error('Configuração do GitHub não encontrada');
    }

    // Comprimir imagem se necessário
    const fileToUpload = await compressImage(file);
    
    if (progressCallback) progressCallback(30);

    // Gerar novo padrão: TIPO_DATA_SOLICITANTE_NOMEDOARQUIVO
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD
    const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, ''); // HHMMSS
    const timestamp = `${dateStr}_${timeStr}`;
    
    // Limpar nome do solicitante (remover caracteres especiais)
    const cleanSolicitante = serviceInfo.solicitante
      .replace(/[^a-zA-Z0-9]/g, '')
      .slice(0, 20)
      .toUpperCase();
    
    // Limpar nome do arquivo original
    const originalName = file.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9._-]/g, '');
    const extension = file.name.split('.').pop();
    
    // Novo padrão: TIPO_DATA_SOLICITANTE_NOMEDOARQUIVO
    const fileName = `${serviceInfo.tipo}_${timestamp}_${cleanSolicitante}_${originalName}.${extension}`;
    
    // PASTA ÚNICA PARA TODOS OS ARQUIVOS
    const filePath = `senai-arquivos/${fileName}`;

    if (progressCallback) progressCallback(50);

    // Converter para base64
    const base64Content = await fileToBase64(fileToUpload);
    
    if (progressCallback) progressCallback(70);

    // API GitHub
    const response = await fetch(`https://api.github.com/repos/${GITHUB_CONFIG.username}/${GITHUB_CONFIG.repo}/contents/${filePath}`, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${GITHUB_CONFIG.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Upload: ${fileName}`,
        content: base64Content
      })
    });

    if (!response.ok) {
      let errorMessage = `GitHub API Error (${response.status}): `;
      try {
        const error = await response.json();
        errorMessage += error.message || 'Erro desconhecido';
        
        // 🔍 SPECIFIC ERROR HANDLING
        if (response.status === 401) {
          errorMessage = 'Token do GitHub inválido ou expirado';
        } else if (response.status === 403) {
          errorMessage = 'Limite de API do GitHub atingido ou sem permissão';
        } else if (response.status === 404) {
          errorMessage = 'Repositório não encontrado ou sem acesso';
        } else if (response.status >= 500) {
          errorMessage = 'Erro no servidor do GitHub. Tente novamente.';
        }
      } catch (parseError) {
        errorMessage += `Erro ${response.status} - ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();
    
    if (progressCallback) progressCallback(100);

    // URL pública do arquivo
    const publicUrl = `https://raw.githubusercontent.com/${GITHUB_CONFIG.username}/${GITHUB_CONFIG.repo}/${GITHUB_CONFIG.branch}/${filePath}`;

    // Registrar upload
    usageMonitor.addUpload();

    return {
      name: file.name,
      url: publicUrl,
      size: fileToUpload.size,
      originalSize: file.size,
      type: fileToUpload.type,
      compressed: file.type.startsWith('image/'),
      path: filePath
    };

  } catch (error) {
    console.error('❌ Erro no upload para GitHub:', error);
    throw error;
  }
}

// 🔄 RETRY PARA UPLOADS COM NOVO PADRÃO
async function retryUpload(file, serviceInfo, maxRetries) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await uploadToGitHub(file, serviceInfo);
    } catch (error) {
      console.warn(`❌ Tentativa ${attempt}/${maxRetries} falhou:`, error.message);

      if (attempt === maxRetries) {
        throw error;
      }

      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }
}
