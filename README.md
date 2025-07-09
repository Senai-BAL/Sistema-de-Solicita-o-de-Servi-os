# 🔧 SENAI Lab - Sistema de Solicitação de Serviços

![SENAI Lab]## 📁 Upload de Arquivos

- ✅ **Upload para GitHub**: Arquivos enviados automaticamente para repositório
- ✅ **Compressão automática**: Imagens comprimidas antes do upload
- ✅ **Organização por pastas**: `impressao/`, `impressao-3d/`, `manutencao/`, `emprestimo/`
- ✅ **URLs públicas**: Links permanentes para todos os arquivos
- ✅ **Limite**: 100MB por arquivo
- ✅ **Retry automático**: Reenvio em caso de falhaields.io/badge/SENAI-Lab-blue?style=for-the-badge)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

## 📋 Descrição

Sistema web para solicitação de serviços do SENAI Lab, permitindo aos colaboradores solicitar:

- 🏗️ **Espaço Maker**: Reserva de espaços e equipamentos
- 🖨️ **Serviços**: Impressão, Impressão 3D, Manutenção, Arte Digital
- 📦 **Empréstimo**: Solicitação de empréstimo de itens

## ✨ Funcionalidades

- ✅ **Formulário Dinâmico**: Interface adaptativa baseada no tipo de serviço
- ✅ **Validações em Tempo Real**: Verificação automática de dados e limites
- ✅ **Máscara de WhatsApp**: Formatação automática (xx)xxxxx-xxxx
- ✅ **Cache Offline**: Funcionamento sem internet
- ✅ **Monitor de Uso**: Controle de recursos Firebase
- ✅ **Design Responsivo**: Otimizado para mobile e desktop
- ✅ **Integração Firebase**: Salvamento seguro no Firestore

## 🚀 Tecnologias

- **Frontend**: HTML5, CSS3, JavaScript Vanilla
- **Backend**: Firebase Firestore
- **Hosting**: Firebase Hosting
- **Arquivos**: Upload automático para GitHub

## � Configuração

### 1. Configuração Firebase

1. **Copie o arquivo de exemplo**:
   ```bash
   cp public/firebase-config.example.js public/firebase-config.js
   ```

2. **Configure suas credenciais**:
   - Acesse o [Console Firebase](https://console.firebase.google.com/)
   - Crie um projeto ou selecione um existente
   - Vá em "Configurações do Projeto" → "Seus aplicativos" → "Configuração"
   - Copie as credenciais e substitua em `public/firebase-config.js`

### 2. Configuração GitHub (para upload de arquivos)

1. **Copie o arquivo de exemplo**:
   ```bash
   cp public/github-config.example.js public/github-config.js
   ```

2. **Configure suas credenciais**:
   - Acesse [GitHub Settings → Tokens](https://github.com/settings/tokens)
   - Clique em "Generate new token (classic)"
   - Marque as permissões: `repo` (Full control of private repositories)
   - Copie o token gerado
   - Substitua as credenciais em `public/github-config.js`

## 💰 Modelo de Custos

**100% Gratuito** dentro dos limites:
- 📊 **Firebase**: 20.000 writes/dia, 10GB hosting, 360MB/dia bandwidth
- 🐙 **GitHub**: 1GB storage, 5k API requests/hora

## � Upload de Arquivos

### index.html (GitHub Storage)
- ✅ **Upload para GitHub**: Arquivos enviados automaticamente para repositório
- ✅ **Compressão automática**: Imagens comprimidas antes do upload
- ✅ **Organização por pastas**: `impressao/`, `impressao-3d/`, `manutencao/`, `emprestimo/`
- ✅ **URLs públicas**: Links permanentes para todos os arquivos
- ✅ **Limite**: 100MB por arquivo
- ✅ **Retry automático**: Reenvio em caso de falha

### teste.html (Google Drive)
- ✅ **Upload para Google Drive**: Integração com Google Drive API
- ✅ **Drag & Drop**: Interface intuitiva
- ✅ **Preview**: Visualização prévia de imagens
- ✅ **Limite**: 10MB por arquivo

## 🏗️ Estrutura do Projeto

```
senai-lab-webapp/
├── public/
│   ├── index.html                       # Aplicação principal
│   ├── firebase-config.example.js       # Exemplo configuração Firebase
│   ├── firebase-config.js              # Suas credenciais Firebase (não commitado)
│   ├── github-config.example.js        # Exemplo configuração GitHub
│   └── github-config.js               # Suas credenciais GitHub (não commitado)
├── firebase.json                       # Configuração Firebase
├── firestore.rules                     # Regras de segurança
├── firestore.indexes.json              # Índices do Firestore
├── .gitignore                          # Arquivos ignorados pelo Git
├── LICENSE                             # Licença MIT
└── README.md                           # Este arquivo
```

## 🛠️ Instalação e Uso

### Pré-requisitos
- Node.js (para Firebase CLI)
- Conta Firebase
- Git

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/senai-lab-webapp.git
cd senai-lab-webapp
```

### 2. Configure o Firebase
```bash
npm install -g firebase-tools
firebase login
firebase init
```

### 3. Configure as credenciais
```bash
# Copie o arquivo de exemplo do Firebase
cp public/firebase-config.example.js public/firebase-config.js

# Copie o arquivo de exemplo do GitHub
cp public/github-config.example.js public/github-config.js

# Edite ambos os arquivos com suas credenciais
# Firebase: Substitua os valores de exemplo pelas suas credenciais Firebase
# GitHub: Substitua pelas suas credenciais GitHub (token com permissões 'repo')
```

**Importante**: Os arquivos `*-config.js` contêm credenciais e não devem ser commitados no Git.

### 4. Deploy
```bash
firebase deploy
```

## 📊 Funcionalidades por Serviço

### 🏗️ Espaço Maker
- Reserva de data e horário
- Seleção de equipamentos (Chrome Books, Computadores)
- Descrição da utilização

### 🖨️ Impressão
- Limites automáticos (A3: 10 folhas, A4: 30 folhas)
- Opções: Frente/verso, Colorido, Escaneamento
- Upload de arquivos para GitHub

### 🏗️ Impressão 3D
- Seleção de material (ABS/PLA)
- Upload de arquivo STL ou descrição da peça
- Controle de quantidade

### 🔧 Manutenção
- Descrição detalhada do problema
- Upload de foto para GitHub

### 🎨 Arte Digital/Projeto
- Descrição das ideias e utilização

### 📦 Empréstimo
- Nome do item
- Datas de retirada e devolução
- Foto obrigatória com upload para GitHub

## 🛡️ Segurança

- **Firestore Rules**: Apenas criação permitida, sem leitura/edição
- **Validação Client-Side**: Múltiplas camadas de validação
- **Sanitização**: Dados tratados antes do envio
- **GitHub Storage**: Arquivos armazenados de forma segura

## 📱 Responsividade

- **Mobile-First**: Design otimizado para dispositivos móveis
- **Breakpoints**: Adaptação para tablet e desktop
- **Touch-Friendly**: Botões e campos adequados para toque

## 🔄 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Autores

- **Getulio Vagner ** - *Desenvolvimento inicial* - [SeuGitHub](https://github.com/GetuliovmSantos)
- **Chagas Junior ** - *Desenvolvimento inicial* - [SeuGitHub](https://github.com/FChJunior)

## 📞 Suporte

Para suporte, entre em contato:
- Email: getulio.santos@docente.senai-ce.org.br
- WhatsApp: (85) 98730-0874

## 🏆 Status do Projeto

✅ **Produção** - Sistema totalmente funcional e em uso

---

⭐ **Se este projeto foi útil, deixe uma estrela!**
