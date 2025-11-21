/* 🖼️ SENAI Lab - Compressor de Imagens
 * Arquivo: public/shared/image-compressor.js
 * Descrição: Comprime imagens antes do upload para economizar Storage
 * Versão: v3.1.0
 */

class ImageCompressor {
  constructor() {
    this.maxWidth = 1920;
    this.maxHeight = 1920;
    this.quality = window.ENV ? window.ENV.config.compressionQuality : 0.7;
    this.maxFileSize = window.ENV ? window.ENV.config.maxFileSize : 5 * 1024 * 1024;

    console.log(`🖼️ Image Compressor inicializado (quality: ${this.quality}, max: ${this.formatBytes(this.maxFileSize)})`);
  }

  async compressImage(file) {
    // Verificar se é imagem
    if (!file.type.startsWith('image/')) {
      return file; // Não é imagem, retornar original
    }

    // Se já for pequeno o suficiente, retornar original
    if (file.size < 500 * 1024) { // Menos de 500KB
      console.log(`✅ Imagem já otimizada: ${file.name} (${this.formatBytes(file.size)})`);
      return file;
    }

    try {
      console.log(`🖼️ Comprimindo: ${file.name} (${this.formatBytes(file.size)})...`);

      const compressedBlob = await this.compress(file);
      const compressedFile = new File([compressedBlob], file.name, {
        type: file.type,
        lastModified: Date.now()
      });

      const reduction = ((1 - (compressedFile.size / file.size)) * 100).toFixed(1);

      console.log(`✅ Compressão concluída: ${this.formatBytes(file.size)} → ${this.formatBytes(compressedFile.size)} (${reduction}% redução)`);

      return compressedFile;

    } catch (error) {
      console.warn(`⚠️ Erro ao comprimir ${file.name}, usando original:`, error);
      return file;
    }
  }

  compress(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const img = new Image();

        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            let { width, height } = img;

            // Redimensionar se necessário
            if (width > this.maxWidth || height > this.maxHeight) {
              const ratio = Math.min(this.maxWidth / width, this.maxHeight / height);
              width *= ratio;
              height *= ratio;
            }

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob(
              (blob) => {
                if (blob) {
                  resolve(blob);
                } else {
                  reject(new Error('Failed to compress image'));
                }
              },
              file.type,
              this.quality
            );
          } catch (error) {
            reject(error);
          }
        };

        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target.result;
      };

      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }

  async compressMultiple(files) {
    const compressed = [];

    for (const file of files) {
      const compressedFile = await this.compressImage(file);
      compressed.push(compressedFile);
    }

    return compressed;
  }

  validateFileSize(file) {
    if (file.size > this.maxFileSize) {
      throw new Error(`Arquivo muito grande: ${this.formatBytes(file.size)} (máximo: ${this.formatBytes(this.maxFileSize)})`);
    }
    return true;
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Criar thumbnail (versão ainda menor para previews)
  async createThumbnail(file, maxSize = 300) {
    if (!file.type.startsWith('image/')) {
      return null;
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const img = new Image();

        img.onload = () => {
          const canvas = document.createElement('canvas');
          let { width, height } = img;

          const ratio = Math.min(maxSize / width, maxSize / height);
          width *= ratio;
          height *= ratio;

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => resolve(blob),
            'image/jpeg',
            0.6
          );
        };

        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target.result;
      };

      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }
}

// 🌐 INSTÂNCIA GLOBAL
window.ImageCompressor = ImageCompressor;
window.imageCompressor = new ImageCompressor();

console.log('💡 Uso: imageCompressor.compressImage(file)');
