# 🔧 SENAI Lab - Sistema de Solicitação de Serviços

![SENAI Lab](https://img.shields.io/badge/SENAI-Lab-blue?style=for-the-badge)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

## 📋 Descrição

Sistema web completo para solicitação de serviços do SENAI Lab, permitindo aos colaboradores solicitar:

- 🏗️ **Espaço Maker**: Reserva de espaços e equipamentos
- 🖨️ **Serviços**: Impressão, Impressão 3D, Manutenção, Arte Digital
- 📦 **Empréstimo**: Solicitação de empréstimo de itens

**Inclui dashboard administrativo** para gerenciamento completo das solicitações.

## ✨ Funcionalidades

### 👥 **Para Colaboradores (index.html)**
- ✅ **Formulário Dinâmico**: Interface adaptativa baseada no tipo de serviço
- ✅ **Validações em Tempo Real**: Verificação automática de dados e limites
- ✅ **Máscara de WhatsApp**: Formatação automática (xx)xxxxx-xxxx
- ✅ **Upload de Arquivos**: Envio automático para GitHub
- ✅ **Cache Offline**: Funcionamento sem internet
- ✅ **Monitor de Uso**: Controle de recursos Firebase
- ✅ **Design Responsivo**: Otimizado para mobile e desktop
- ✅ **Integração Firebase**: Salvamento seguro no Firestore

### 🔐 **Para Administradores (admin.html)**
- ✅ **Autenticação Segura**: Login por senha com sessão persistente
- ✅ **Dashboard Completo**: Visualização de todas as solicitações
- ✅ **Estatísticas em Tempo Real**: Cards com métricas importantes
- ✅ **Gestão de Status**: Atualização de status das solicitações
- ✅ **Sistema de Comentários**: Adição de comentários administrativos
- ✅ **Filtros Avançados**: Por serviço, status e período
- ✅ **Visualização de Arquivos**: Acesso direto aos arquivos enviados
- ✅ **Auto-refresh**: Atualização automática a cada 30 segundos
- ✅ **Design Responsivo**: Interface otimizada para todos os dispositivos

## 🚀 Tecnologias

- **Frontend**: HTML5, CSS3, JavaScript Vanilla
- **Backend**: Firebase Firestore
- **Hosting**: Firebase Hosting
- **Arquivos**: Upload automático para GitHub

## � Configuração

### 1. Configuração Firebase

1. **Copie o arquivo de exemplo**:
   ```bash
   cp public/shared/firebase-config.example.js public/shared/firebase-config.js
   ```

2. **Configure suas credenciais**:
   - Acesse o [Console Firebase](https://console.firebase.google.com/)
   - Crie um projeto ou selecione um existente
   - Vá em "Configurações do Projeto" → "Seus aplicativos" → "Configuração"
   - Copie as credenciais e substitua em `public/shared/firebase-config.js`

### 2. Configuração GitHub (para upload de arquivos)

1. **Copie o arquivo de exemplo**:
   ```bash
   cp public/shared/github-config.example.js public/shared/github-config.js
   ```

2. **Configure suas credenciais**:
   - Acesse [GitHub Settings → Tokens](https://github.com/settings/tokens)
   - Clique em "Generate new token (classic)"
   - Marque as permissões: `repo` (Full control of private repositories)
   - Copie o token gerado
   - Substitua as credenciais em `public/shared/github-config.js`

## 💰 Modelo de Custos

**100% Gratuito** dentro dos limites:
- 📊 **Firebase**: 20.000 writes/dia, 10GB hosting, 360MB/dia bandwidth
- 🐙 **GitHub**: 1GB storage, 5k API requests/hora

## 📁 Upload de Arquivos

- ✅ **Upload para GitHub**: Arquivos enviados automaticamente para repositório
- ✅ **Compressão automática**: Imagens comprimidas antes do upload
- ✅ **Organização por pastas**: `impressao/`, `impressao-3d/`, `manutencao/`, `emprestimo/`
- ✅ **URLs públicas**: Links permanentes para todos os arquivos
- ✅ **Limite**: 100MB por arquivo
- ✅ **Retry automático**: Reenvio em caso de falha

## 🌐 URLs de Acesso

### 👥 **Para Colaboradores**
- **URL Principal**: `https://seu-dominio.com/` ou `https://seu-dominio.com/index.html`
- **Função**: Solicitação de serviços
- **Acesso**: Público (todos os colaboradores)

### 🔐 **Para Administradores**
- **URL Admin**: `https://seu-dominio.com/admin.html`
- **Função**: Gerenciamento de solicitações
- **Acesso**: Restrito (senha necessária)
- **Senha Padrão**: `senai@admin2024` (⚠️ **ALTERE IMEDIATAMENTE**)

## 🏗️ Estrutura do Projeto

```
senai-lab-webapp/
├── public/
│   ├── index.html                       # Aplicação principal (colaboradores)
│   ├── admin.html                       # Dashboard administrativo
│   └── shared/                          # Configurações compartilhadas
│       ├── firebase-config.example.js   # Exemplo configuração Firebase
│       ├── firebase-config.js          # Suas credenciais Firebase (não commitado)
│       ├── github-config.example.js    # Exemplo configuração GitHub
│       └── github-config.js           # Suas credenciais GitHub (não commitado)
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
cp public/shared/firebase-config.example.js public/shared/firebase-config.js

# Copie o arquivo de exemplo do GitHub
cp public/shared/github-config.example.js public/shared/github-config.js

# Edite ambos os arquivos com suas credenciais
# Firebase: Substitua os valores de exemplo pelas suas credenciais Firebase
# GitHub: Substitua pelas suas credenciais GitHub (token com permissões 'repo')
```

**Importante**: Os arquivos `*-config.js` contêm credenciais e não devem ser commitados no Git.

### 4. Configure o Dashboard Administrativo

1. **Edite a senha do admin** em `public/admin.html`:
   ```javascript
   const ADMIN_CONFIG = {
     password: 'sua_senha_segura_aqui', // ⚠️ ALTERE ESTA SENHA!
     sessionDuration: 24 * 60 * 60 * 1000, // 24 horas
     sessionKey: 'senai_admin_session'
   };
   ```

2. **Acesse o dashboard**:
   - URL: `https://seu-dominio.com/admin.html`
   - Senha: A que você definiu no passo anterior

### 5. Deploy
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

## 🔐 Dashboard Administrativo

### 📋 **Funcionalidades do Admin**

#### 🏠 **Tela Inicial**
- **Cards de Estatísticas**: Total, Pendentes, Em Andamento, Concluídas
- **Métricas em Tempo Real**: Atualizadas automaticamente
- **Indicadores Visuais**: Cores e ícones para fácil identificação

#### 📊 **Gestão de Solicitações**
- **Listagem Completa**: Todas as solicitações com detalhes
- **Filtros Avançados**: Por serviço, status e período
- **Visualização de Arquivos**: Acesso direto aos arquivos enviados
- **Atualização de Status**: Pendente → Em Andamento → Concluído/Cancelado

#### 💬 **Sistema de Comentários**
- **Comentários Administrativos**: Adicionar observações internas
- **Histórico**: Visualizar todos os comentários anteriores
- **Timestamps**: Data e hora de cada comentário

#### 🔒 **Segurança**
- **Autenticação por Senha**: Login seguro com sessão persistente
- **Sessão Temporizada**: Expira em 24 horas
- **Logout Automático**: Segurança adicional

#### 📱 **Interface Responsiva**
- **Design Adaptativo**: Funciona em desktop, tablet e mobile
- **Auto-refresh**: Atualização automática a cada 30 segundos
- **Indicadores de Status**: Feedback visual em tempo real

### 🚀 **Como Usar o Dashboard**

1. **Acesse**: `https://seu-dominio.com/admin.html`
2. **Faça Login**: Use a senha configurada
3. **Visualize**: Estatísticas e solicitações
4. **Gerencie**: Atualize status e adicione comentários
5. **Filtre**: Use os filtros para encontrar solicitações específicas

### ⚠️ **Importante - Segurança**
- **Altere a senha padrão** em `admin.html`
- **Mantenha as credenciais seguras**
- **Não compartilhe a senha** com usuários não autorizados
- **Use HTTPS em produção**

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
