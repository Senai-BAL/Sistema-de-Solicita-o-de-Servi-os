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
        // Criar novo arquivo com nome original
        const compressedFile = new File([blob], file.name, {
          type: 'image/jpeg',
          lastModified: Date.now()
        });
        resolve(compressedFile);
      }, 'image/jpeg', quality);
    };

    img.src = URL.createObjectURL(file);
  });
}

// 🔄 CONVERTER ARQUIVO PARA BASE64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = error => reject(error);
  });
}

// 🐙 UPLOAD PARA GITHUB COM NOVO PADRÃO DE NOMENCLATURA
async function uploadToGitHub(file, serviceInfo, progressCallback) {
  try {
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
      const error = await response.json();
      throw new Error(`GitHub API Error: ${error.message}`);
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
