/**
 * 🔍 Advanced File Validator - SENAI Lab v2.9.8
 * Validação de arquivos com magic numbers e análise de segurança
 * Atualizado: Validação mais rigorosa e rate limiting
 */

const AdvancedFileValidator = {
    // Magic numbers para identificação de tipos de arquivo
    magicNumbers: {
        // PDF
        'pdf': [
            [0x25, 0x50, 0x44, 0x46], // %PDF
        ],
        
        // Images
        'jpg': [
            [0xFF, 0xD8, 0xFF, 0xE0], // JPEG JFIF
            [0xFF, 0xD8, 0xFF, 0xE1], // JPEG EXIF
            [0xFF, 0xD8, 0xFF, 0xE2], // JPEG
            [0xFF, 0xD8, 0xFF, 0xE3], // JPEG
            [0xFF, 0xD8, 0xFF, 0xE8], // JPEG
            [0xFF, 0xD8, 0xFF, 0xDB], // JPEG
        ],
        'png': [
            [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A], // PNG
        ],
        'gif': [
            [0x47, 0x49, 0x46, 0x38, 0x37, 0x61], // GIF87a
            [0x47, 0x49, 0x46, 0x38, 0x39, 0x61], // GIF89a
        ],
        'bmp': [
            [0x42, 0x4D], // BM
        ],
        'webp': [
            [0x52, 0x49, 0x46, 0x46], // RIFF (precisa verificar WEBP depois)
        ],
        
        // Documents
        'doc': [
            [0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1], // MS Office
        ],
        'docx': [
            [0x50, 0x4B, 0x03, 0x04], // ZIP (precisa verificar conteúdo)
            [0x50, 0x4B, 0x05, 0x06], // ZIP empty
            [0x50, 0x4B, 0x07, 0x08], // ZIP spanned
        ],
        'xls': [
            [0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1], // MS Office
        ],
        'xlsx': [
            [0x50, 0x4B, 0x03, 0x04], // ZIP
        ],
        'ppt': [
            [0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1], // MS Office
        ],
        'pptx': [
            [0x50, 0x4B, 0x03, 0x04], // ZIP
        ],
        
        // 3D Files
        'stl': [
            [0x73, 0x6F, 0x6C, 0x69, 0x64], // "solid" (ASCII STL)
            // Binary STL não tem magic number consistente, usa tamanho do header
        ],
        
        // Archives
        'zip': [
            [0x50, 0x4B, 0x03, 0x04],
            [0x50, 0x4B, 0x05, 0x06],
            [0x50, 0x4B, 0x07, 0x08],
        ],
        'rar': [
            [0x52, 0x61, 0x72, 0x21, 0x1A, 0x07, 0x00], // Rar!
            [0x52, 0x61, 0x72, 0x21, 0x1A, 0x07, 0x01, 0x00], // RAR v5
        ],
        '7z': [
            [0x37, 0x7A, 0xBC, 0xAF, 0x27, 0x1C], // 7z
        ],
        
        // Text
        'txt': [
            [0xEF, 0xBB, 0xBF], // UTF-8 BOM
            [0xFF, 0xFE], // UTF-16 LE BOM
            [0xFE, 0xFF], // UTF-16 BE BOM
        ],
        
        // Audio
        'mp3': [
            [0x49, 0x44, 0x33], // ID3
            [0xFF, 0xFB], // MP3
            [0xFF, 0xF3], // MP3
            [0xFF, 0xF2], // MP3
        ],
        'wav': [
            [0x52, 0x49, 0x46, 0x46], // RIFF
        ],
        
        // Video
        'mp4': [
            [0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70], // ftyp
            [0x00, 0x00, 0x00, 0x1C, 0x66, 0x74, 0x79, 0x70], // ftyp
            [0x00, 0x00, 0x00, 0x20, 0x66, 0x74, 0x79, 0x70], // ftyp
        ],
        'avi': [
            [0x52, 0x49, 0x46, 0x46], // RIFF
        ]
    },

    // Configurações de validação por tipo de serviço
    serviceValidation: {
        impressao: {
            allowedTypes: ['pdf', 'doc', 'docx', 'txt'],
            maxSize: 50 * 1024 * 1024, // 50MB
            maxFiles: 5,
            description: 'Documentos para impressão (PDF, DOC, DOCX, TXT)'
        },
        impressao3d: {
            allowedTypes: ['stl', 'zip', '7z'],
            maxSize: 100 * 1024 * 1024, // 100MB
            maxFiles: 3,
            description: 'Modelos 3D (STL) ou arquivos compactados'
        },
        manutencao: {
            allowedTypes: ['jpg', 'png', 'gif', 'bmp', 'webp', 'pdf', 'txt'],
            maxSize: 20 * 1024 * 1024, // 20MB
            maxFiles: 10,
            description: 'Fotos do problema ou documentos explicativos'
        },
        espacomaker: {
            allowedTypes: ['pdf', 'doc', 'docx', 'txt', 'jpg', 'png'],
            maxSize: 30 * 1024 * 1024, // 30MB
            maxFiles: 5,
            description: 'Documentos do projeto ou imagens de referência'
        },
        artedigital: {
            allowedTypes: ['jpg', 'png', 'gif', 'bmp', 'webp', 'pdf', 'zip'],
            maxSize: 50 * 1024 * 1024, // 50MB
            maxFiles: 10,
            description: 'Imagens, referências ou arquivos do projeto'
        },
        emprestimo: {
            allowedTypes: ['jpg', 'png', 'gif', 'bmp', 'webp'],
            maxSize: 10 * 1024 * 1024, // 10MB
            maxFiles: 5,
            description: 'Fotos do item a ser emprestado'
        }
    },

    // Rate limiting config
    rateLimiting: {
        maxUploadsPerMinute: 10,
        maxUploadsPerHour: 50,
        uploads: [],
        enabled: true
    },

    /**
     * Inicializar o validador
     */
    init() {
        this.setupEventListeners();
        this.loadUploadHistory();
    },

    /**
     * Configurar event listeners
     */
    setupEventListeners() {
        // Listener para inputs de arquivo
        document.addEventListener('change', (e) => {
            if (e.target.type === 'file') {
                this.validateFileInput(e.target);
            }
        });

        // Listener para drag & drop
        document.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.handleDragOver(e);
        });

        document.addEventListener('drop', (e) => {
            if (e.target.type === 'file' || e.target.closest('.file-upload-area')) {
                e.preventDefault();
                this.handleFileDrop(e);
            }
        });
    },

    /**
     * Validar input de arquivo
     */
    async validateFileInput(input) {
        const files = Array.from(input.files);
        const serviceType = this.getServiceType(input);
        
        // Rate limiting check
        if (!this.checkRateLimit()) {
            this.showError(input, 'Muitos uploads em pouco tempo. Aguarde alguns minutos.');
            input.value = '';
            return false;
        }

        const validationResults = [];
        
        for (const file of files) {
            const result = await this.validateFile(file, serviceType);
            validationResults.push(result);
            
            if (!result.valid) {
                this.showFileError(input, file, result.errors);
            } else {
                this.showFileSuccess(input, file);
            }
        }

        // Verificar se todos os arquivos são válidos
        const allValid = validationResults.every(r => r.valid);
        
        if (!allValid) {
            // Limpar input se houver arquivos inválidos
            input.value = '';
            return false;
        }

        // Registrar upload bem-sucedido
        this.recordUpload(files.length);
        
        return true;
    },

    /**
     * Validar arquivo individual
     */
    async validateFile(file, serviceType) {
        const result = {
            valid: true,
            errors: [],
            warnings: [],
            fileInfo: {
                name: file.name,
                size: file.size,
                type: file.type,
                lastModified: file.lastModified
            }
        };

        try {
            // 1. Validação básica
            if (!file.name || file.size === 0) {
                result.valid = false;
                result.errors.push('Arquivo vazio ou nome inválido');
                return result;
            }

            // 2. Validação de tamanho
            const config = this.serviceValidation[serviceType];
            if (config && file.size > config.maxSize) {
                result.valid = false;
                result.errors.push(`Arquivo muito grande. Máximo: ${this.formatFileSize(config.maxSize)}`);
            }

            // 3. Validação de magic number
            const magicNumberResult = await this.validateMagicNumber(file);
            if (!magicNumberResult.valid) {
                result.valid = false;
                result.errors.push(...magicNumberResult.errors);
            } else {
                result.detectedType = magicNumberResult.detectedType;
            }

            // 4. Validação de tipo permitido
            if (config && result.detectedType) {
                if (!config.allowedTypes.includes(result.detectedType)) {
                    result.valid = false;
                    result.errors.push(`Tipo não permitido. Aceitos: ${config.allowedTypes.join(', ')}`);
                }
            }

            // 5. Validações específicas por tipo
            if (result.detectedType) {
                const specificValidation = await this.validateSpecificType(file, result.detectedType);
                if (!specificValidation.valid) {
                    result.valid = false;
                    result.errors.push(...specificValidation.errors);
                }
                result.warnings.push(...specificValidation.warnings);
            }

            // 6. Validação de segurança
            const securityValidation = await this.validateSecurity(file);
            if (!securityValidation.valid) {
                result.valid = false;
                result.errors.push(...securityValidation.errors);
            }
            result.warnings.push(...securityValidation.warnings);

        } catch (error) {
            console.error('❌ Erro na validação:', error);
            result.valid = false;
            result.errors.push('Erro interno na validação do arquivo');
        }

        return result;
    },

    /**
     * Validar magic number do arquivo
     */
    async validateMagicNumber(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                const bytes = new Uint8Array(e.target.result);
                const detectedType = this.detectFileType(bytes);
                
                if (detectedType) {
                    resolve({
                        valid: true,
                        detectedType: detectedType,
                        errors: []
                    });
                } else {
                    // Tentar detectar por extensão se magic number falhar
                    const extension = this.getFileExtension(file.name);
                    const typeByExtension = this.getTypeByExtension(extension);
                    
                    if (typeByExtension) {
                        resolve({
                            valid: true,
                            detectedType: typeByExtension,
                            errors: [],
                            warnings: ['Tipo detectado pela extensão (magic number não reconhecido)']
                        });
                    } else {
                        resolve({
                            valid: false,
                            detectedType: null,
                            errors: ['Tipo de arquivo não reconhecido ou corrompido']
                        });
                    }
                }
            };
            
            reader.onerror = () => {
                resolve({
                    valid: false,
                    detectedType: null,
                    errors: ['Erro ao ler o arquivo']
                });
            };
            
            // Ler primeiros 32 bytes para magic number
            const blob = file.slice(0, 32);
            reader.readAsArrayBuffer(blob);
        });
    },

    /**
     * Detectar tipo de arquivo pelos magic numbers
     */
    detectFileType(bytes) {
        for (const [type, signatures] of Object.entries(this.magicNumbers)) {
            for (const signature of signatures) {
                if (this.matchesSignature(bytes, signature)) {
                    // Validações especiais
                    if (type === 'webp') {
                        // Verificar se é realmente WEBP (RIFF + WEBP)
                        const webpBytes = bytes.slice(8, 12);
                        const webpSignature = [0x57, 0x45, 0x42, 0x50]; // WEBP
                        if (this.matchesSignature(webpBytes, webpSignature)) {
                            return 'webp';
                        }
                        continue;
                    }
                    
                    if (type === 'wav') {
                        // Verificar se é WAV (RIFF + WAVE)
                        const waveBytes = bytes.slice(8, 12);
                        const waveSignature = [0x57, 0x41, 0x56, 0x45]; // WAVE
                        if (this.matchesSignature(waveBytes, waveSignature)) {
                            return 'wav';
                        }
                        continue;
                    }
                    
                    return type;
                }
            }
        }
        
        return null;
    },

    /**
     * Verificar se bytes correspondem à assinatura
     */
    matchesSignature(bytes, signature) {
        if (bytes.length < signature.length) {
            return false;
        }
        
        for (let i = 0; i < signature.length; i++) {
            if (bytes[i] !== signature[i]) {
                return false;
            }
        }
        
        return true;
    },

    /**
     * Validações específicas por tipo de arquivo
     */
    async validateSpecificType(file, type) {
        const result = { valid: true, errors: [], warnings: [] };
        
        switch (type) {
            case 'stl':
                const stlValidation = await this.validateSTL(file);
                Object.assign(result, stlValidation);
                break;
                
            case 'pdf':
                const pdfValidation = await this.validatePDF(file);
                Object.assign(result, pdfValidation);
                break;
                
            case 'jpg':
            case 'png':
            case 'gif':
            case 'bmp':
            case 'webp':
                const imageValidation = await this.validateImage(file);
                Object.assign(result, imageValidation);
                break;
        }
        
        return result;
    },

    /**
     * Validar arquivo STL
     */
    async validateSTL(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                const bytes = new Uint8Array(e.target.result);
                const result = { valid: true, errors: [], warnings: [] };
                
                // Verificar se é ASCII STL
                const header = new TextDecoder().decode(bytes.slice(0, 5));
                if (header === 'solid') {
                    // ASCII STL - verificar se termina com 'endsolid'
                    const content = new TextDecoder().decode(bytes);
                    if (!content.includes('endsolid')) {
                        result.warnings.push('Arquivo STL ASCII pode estar incompleto');
                    }
                } else {
                    // Binary STL - verificar tamanho
                    if (bytes.length < 84) {
                        result.valid = false;
                        result.errors.push('Arquivo STL binário muito pequeno');
                    } else {
                        // Verificar número de triângulos
                        const triangleCount = new DataView(bytes.buffer).getUint32(80, true);
                        const expectedSize = 80 + 4 + (triangleCount * 50);
                        
                        if (bytes.length !== expectedSize) {
                            result.warnings.push('Tamanho do arquivo STL não corresponde ao número de triângulos declarado');
                        }
                    }
                }
                
                resolve(result);
            };
            
            reader.onerror = () => {
                resolve({
                    valid: false,
                    errors: ['Erro ao ler arquivo STL']
                });
            };
            
            reader.readAsArrayBuffer(file);
        });
    },

    /**
     * Validar arquivo PDF
     */
    async validatePDF(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                const bytes = new Uint8Array(e.target.result);
                const result = { valid: true, errors: [], warnings: [] };
                
                // Verificar header PDF
                const header = new TextDecoder().decode(bytes.slice(0, 8));
                if (!header.startsWith('%PDF-')) {
                    result.valid = false;
                    result.errors.push('Header PDF inválido');
                    resolve(result);
                    return;
                }
                
                // Verificar footer %%EOF
                const tail = new TextDecoder().decode(bytes.slice(-20));
                if (!tail.includes('%%EOF')) {
                    result.warnings.push('PDF pode estar corrompido (footer %%EOF não encontrado)');
                }
                
                // Verificar versão PDF
                const version = header.substring(5, 8);
                const versionNum = parseFloat(version);
                if (versionNum > 2.0) {
                    result.warnings.push(`Versão PDF ${version} pode não ser compatível com todos os visualizadores`);
                }
                
                resolve(result);
            };
            
            reader.onerror = () => {
                resolve({
                    valid: false,
                    errors: ['Erro ao ler arquivo PDF']
                });
            };
            
            // Ler header e footer
            const headerBlob = file.slice(0, 100);
            reader.readAsArrayBuffer(headerBlob);
        });
    },

    /**
     * Validar imagem
     */
    async validateImage(file) {
        return new Promise((resolve) => {
            const img = new Image();
            const url = URL.createObjectURL(file);
            const result = { valid: true, errors: [], warnings: [] };
            
            img.onload = () => {
                // Verificar dimensões
                if (img.width < 10 || img.height < 10) {
                    result.warnings.push('Imagem muito pequena (menor que 10x10px)');
                }
                
                if (img.width > 10000 || img.height > 10000) {
                    result.warnings.push('Imagem muito grande (maior que 10000x10000px)');
                }
                
                // Verificar aspect ratio extremo
                const aspectRatio = img.width / img.height;
                if (aspectRatio > 10 || aspectRatio < 0.1) {
                    result.warnings.push('Proporção da imagem muito extrema');
                }
                
                URL.revokeObjectURL(url);
                resolve(result);
            };
            
            img.onerror = () => {
                result.valid = false;
                result.errors.push('Imagem corrompida ou formato inválido');
                URL.revokeObjectURL(url);
                resolve(result);
            };
            
            img.src = url;
        });
    },

    /**
     * Validações de segurança
     */
    async validateSecurity(file) {
        const result = { valid: true, errors: [], warnings: [] };
        
        // Verificar nome do arquivo
        const fileName = file.name;
        
        // Caracteres perigosos no nome
        const dangerousChars = /[<>:"|?*\x00-\x1f]/;
        if (dangerousChars.test(fileName)) {
            result.valid = false;
            result.errors.push('Nome do arquivo contém caracteres não permitidos');
        }
        
        // Nomes reservados do Windows
        const reservedNames = /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i;
        const baseName = fileName.split('.')[0];
        if (reservedNames.test(baseName)) {
            result.valid = false;
            result.errors.push('Nome do arquivo é reservado pelo sistema');
        }
        
        // Verificar múltiplas extensões (possível tentativa de bypass)
        const extensions = fileName.split('.').slice(1);
        if (extensions.length > 2) {
            result.warnings.push('Arquivo com múltiplas extensões detectado');
        }
        
        // Verificar tamanho suspeitamente pequeno para o tipo
        const minSizes = {
            'pdf': 100,
            'jpg': 100,
            'png': 100,
            'doc': 1024,
            'docx': 1024,
            'stl': 84
        };
        
        const detectedType = this.getFileExtension(fileName);
        if (minSizes[detectedType] && file.size < minSizes[detectedType]) {
            result.warnings.push('Arquivo suspeitamente pequeno para o tipo declarado');
        }
        
        return result;
    },

    /**
     * Verificar rate limiting
     */
    checkRateLimit() {
        if (!this.rateLimiting.enabled) {
            return true;
        }
        
        const now = Date.now();
        const oneMinute = 60 * 1000;
        const oneHour = 60 * 60 * 1000;
        
        // Limpar uploads antigos
        this.rateLimiting.uploads = this.rateLimiting.uploads.filter(
            timestamp => now - timestamp < oneHour
        );
        
        // Contar uploads na última hora e último minuto
        const uploadsLastHour = this.rateLimiting.uploads.length;
        const uploadsLastMinute = this.rateLimiting.uploads.filter(
            timestamp => now - timestamp < oneMinute
        ).length;
        
        // Verificar limites
        if (uploadsLastMinute >= this.rateLimiting.maxUploadsPerMinute) {
            console.warn('⚠️ Rate limit excedido (por minuto)');
            return false;
        }
        
        if (uploadsLastHour >= this.rateLimiting.maxUploadsPerHour) {
            console.warn('⚠️ Rate limit excedido (por hora)');
            return false;
        }
        
        return true;
    },

    /**
     * Registrar upload
     */
    recordUpload(fileCount = 1) {
        const now = Date.now();
        for (let i = 0; i < fileCount; i++) {
            this.rateLimiting.uploads.push(now);
        }
        this.saveUploadHistory();
    },

    /**
     * Salvar histórico de uploads
     */
    saveUploadHistory() {
        try {
            localStorage.setItem('senai_upload_history', JSON.stringify({
                uploads: this.rateLimiting.uploads,
                lastSave: Date.now()
            }));
        } catch (error) {
            console.warn('⚠️ Erro ao salvar histórico de uploads:', error);
        }
    },

    /**
     * Carregar histórico de uploads
     */
    loadUploadHistory() {
        try {
            const saved = localStorage.getItem('senai_upload_history');
            if (saved) {
                const data = JSON.parse(saved);
                const oneDay = 24 * 60 * 60 * 1000;
                
                // Carregar apenas uploads das últimas 24 horas
                if (Date.now() - data.lastSave < oneDay) {
                    this.rateLimiting.uploads = data.uploads || [];
                }
            }
        } catch (error) {
            console.warn('⚠️ Erro ao carregar histórico de uploads:', error);
        }
    },

    /**
     * Obter tipo de serviço do input
     */
    getServiceType(input) {
        // Tentar diferentes métodos para detectar o tipo de serviço
        const serviceField = document.querySelector('#tipoServico, [name="tipoServico"], [data-service]');
        if (serviceField) {
            return serviceField.value || serviceField.dataset.service;
        }
        
        // Fallback para detectar pelo ID ou classe do input
        const inputId = input.id || input.className;
        if (inputId.includes('impressao3d')) return 'impressao3d';
        if (inputId.includes('impressao')) return 'impressao';
        if (inputId.includes('manutencao')) return 'manutencao';
        if (inputId.includes('maker')) return 'espacomaker';
        if (inputId.includes('arte')) return 'artedigital';
        if (inputId.includes('emprestimo')) return 'emprestimo';
        
        return 'default';
    },

    /**
     * Obter extensão do arquivo
     */
    getFileExtension(filename) {
        return filename.split('.').pop().toLowerCase();
    },

    /**
     * Obter tipo por extensão (fallback)
     */
    getTypeByExtension(extension) {
        const extensionMap = {
            'pdf': 'pdf',
            'doc': 'doc', 'docx': 'docx',
            'xls': 'xls', 'xlsx': 'xlsx',
            'ppt': 'ppt', 'pptx': 'pptx',
            'jpg': 'jpg', 'jpeg': 'jpg',
            'png': 'png', 'gif': 'gif', 'bmp': 'bmp', 'webp': 'webp',
            'stl': 'stl',
            'zip': 'zip', 'rar': 'rar', '7z': '7z',
            'txt': 'txt',
            'mp3': 'mp3', 'wav': 'wav',
            'mp4': 'mp4', 'avi': 'avi'
        };
        
        return extensionMap[extension] || null;
    },

    /**
     * Formatar tamanho de arquivo
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },

    /**
     * Mostrar erro de arquivo
     */
    showFileError(input, file, errors) {
        console.error(`❌ Arquivo inválido: ${file.name}`, errors);
        
        // Criar ou encontrar container de erro
        let errorContainer = input.parentNode.querySelector('.file-validation-errors');
        if (!errorContainer) {
            errorContainer = document.createElement('div');
            errorContainer.className = 'file-validation-errors alert alert-danger mt-2';
            input.parentNode.appendChild(errorContainer);
        }
        
        const errorHTML = `
            <strong>❌ ${file.name}</strong><br>
            ${errors.map(error => `• ${error}`).join('<br>')}
        `;
        
        errorContainer.innerHTML = errorHTML;
        errorContainer.style.display = 'block';
        
        // Auto-remover após 10 segundos
        setTimeout(() => {
            if (errorContainer.parentNode) {
                errorContainer.parentNode.removeChild(errorContainer);
            }
        }, 10000);
    },

    /**
     * Mostrar sucesso de arquivo
     */
    showFileSuccess(input, file) {
        // Remover erros anteriores
        const errorContainer = input.parentNode.querySelector('.file-validation-errors');
        if (errorContainer) {
            errorContainer.style.display = 'none';
        }
        
        // Mostrar feedback de sucesso se disponível
        if (window.TooltipManager) {
            TooltipManager.showTemporary(
                input, 
                `✅ ${file.name} validado com sucesso`, 
                'success', 
                2000
            );
        }
    },

    /**
     * Mostrar erro geral
     */
    showError(input, message) {
        console.error('❌ Erro de validação:', message);
        
        if (window.ToastManager) {
            ToastManager.show(message, 'error');
        } else {
            alert(message);
        }
    },

    /**
     * Lidar com drag over
     */
    handleDragOver(e) {
        e.dataTransfer.dropEffect = 'copy';
        
        // Adicionar classe visual se disponível
        const target = e.target.closest('.file-upload-area') || e.target;
        target.classList.add('drag-over');
    },

    /**
     * Lidar com drop de arquivo
     */
    async handleFileDrop(e) {
        const target = e.target.closest('input[type="file"]') || e.target;
        target.classList.remove('drag-over');
        
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            // Simular seleção de arquivo
            const fileInput = target.querySelector('input[type="file"]') || target;
            if (fileInput) {
                // Criar lista de arquivos simulada
                const dt = new DataTransfer();
                files.forEach(file => dt.items.add(file));
                fileInput.files = dt.files;
                
                // Trigger validation
                await this.validateFileInput(fileInput);
            }
        }
    }
};

// Auto-inicializar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => AdvancedFileValidator.init());
} else {
    AdvancedFileValidator.init();
}

// Expor globalmente
window.AdvancedFileValidator = AdvancedFileValidator;
