/* 🔧 SENAI Lab - Sistema de Upload
 * Arquivo: public/assets/js/upload.js
 * Descrição: Funcionalidades de upload para Firebase Storage e compressão de imagens
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

// 🌐 UPLOAD PARA FIREBASE STORAGE
async function uploadToFirebaseStorage(file, serviceInfo, progressCallback) {
  // 🛡️ RATE LIMITING: Verificar limites de upload
  if (window.uploadRateLimiter) {
    const rateLimitCheck = window.uploadRateLimiter.checkUpload(file.size, serviceInfo.solicitante);
    if (!rateLimitCheck.allowed) {
      // Mostrar feedback visual do rate limit
      if (window.rateLimitUI) {
        window.rateLimitUI.showRateLimitWarning('file_upload', rateLimitCheck.message, rateLimitCheck.waitTime);
      }
      throw new Error(rateLimitCheck.message || 'Limite de upload atingido');
    }
  }

  // Validação básica
  if (!file) throw new Error('Arquivo não fornecido');
  if (!serviceInfo || !serviceInfo.tipo || !serviceInfo.solicitante) {
    throw new Error('Informações de serviço incompletas');
  }
  if (!window.firebaseConfig) throw new Error('Configuração do Firebase não encontrada');

  // Comprimir imagem se necessário
  const fileToUpload = await compressImage(file);
  if (progressCallback) progressCallback(20);

  // Gerar nome padronizado
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, '');
  const timestamp = `${dateStr}_${timeStr}`;
  const cleanSolicitante = serviceInfo.solicitante.replace(/[^a-zA-Z0-9]/g, '').slice(0, 20).toUpperCase();
  const originalName = file.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9._-]/g, '');
  const extension = file.name.split('.').pop();
  const fileName = `${serviceInfo.tipo}_${timestamp}_${cleanSolicitante}_${originalName}.${extension}`;

  // Caminho no Storage
  const storagePath = `uploads/${fileName}`;

  // Inicializar Firebase Storage
  const storage = firebase.storage();
  const ref = storage.ref(storagePath);

  // Upload
  const uploadTask = ref.put(fileToUpload);

  return new Promise((resolve, reject) => {
    uploadTask.on('state_changed',
      (snapshot) => {
        if (progressCallback) {
          const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          progressCallback(percent);
        }
      },
      (error) => {
        reject(error);
      },
      async () => {
        // Finalizado, obter URL pública
        const url = await ref.getDownloadURL();
        if (typeof usageMonitor !== 'undefined') usageMonitor.addUpload();
        resolve({
          name: file.name,
          url,
          size: fileToUpload.size,
          originalSize: file.size,
          type: fileToUpload.type,
          compressed: file.type.startsWith('image/'),
          path: storagePath
        });
      }
    );
  });
}

// 🔄 RETRY PARA UPLOADS COM NOVO PADRÃO
// 🔄 RETRY PARA UPLOADS NO FIREBASE STORAGE
async function retryUpload(file, serviceInfo, maxRetries, progressCallback) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await uploadToFirebaseStorage(file, serviceInfo, progressCallback);
    } catch (error) {
      console.warn(`❌ Tentativa ${attempt}/${maxRetries} falhou:`, error.message);
      if (attempt === maxRetries) throw error;
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }
}

