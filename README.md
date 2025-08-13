# 📑 Sumário
- [Descrição](#-descrição)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Última Atualização](#-última-atualização)
- [Configuração](#️-configuração)
- [Modelo de Custos](#-modelo-de-custos)
- [Upload de Arquivos](#-upload-de-arquivos)
- [Documentação e Configurações](#-documentação-e-configurações)
- [Estrutura do Projeto](#️-estrutura-do-projeto)
- [Instalação e Uso](#️-instalação-e-uso)
- [Funcionalidades por Serviço](#-funcionalidades-por-serviço)
- [Dashboard Administrativo](#-dashboard-administrativo)
- [Exportação PDF Avançada](#-exportação-pdf-avançada---nova-funcionalidade)
- [Histórico de Versões](#️-histórico-de-versões)
- [Segurança](#️-segurança)
- [Responsividade](#-responsividade)
- [Contribuição](#-contribuição)
- [Licença](#-licença)
- [Autores](#-autores)
- [Suporte](#-suporte)
- [Status do Projeto](#-status-do-projeto)
- [Como Testar a Funcionalidade PDF](#-como-testar-a-funcionalidade-pdf)

# 🔧 SENAI Lab - Sistema de Solicitação de Serviços

![SENAI Lab](https://img.shields.io/badge/SENAI-Lab-blue?style=for-the-badge)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Version](https://img.shields.io/badge/Version-2.9.3-success?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Teste-success?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)
![Last Update](https://img.shields.io/badge/Última_Atualização-Agosto_2025-informational?style=for-the-badge)

## 📋 Descrição

Sistema web completo para solicitação de serviços do SENAI Lab, permitindo aos colaboradores solicitar:


**Inclui dashboard administrativo** para gerenciamento completo das solicitações.

## ✨ Funcionalidades

### 👥 **Para Colaboradores (index.html)**
**Versão Atual**: v2.9.3 (Sistema de monitoramento Firebase Storage, modal com analytics, integração admin, correções de inicialização)  
- ✅ **Validações em Tempo Real**: Verificação automática de dados e limites
- ✅ **Máscara de WhatsApp**: Formatação automática (xx)xxxxx-xxxx
- ✅ **Upload Múltiplo**: Envio de múltiplos arquivos por categoria
- ✅ **Preview de Imagens**: Visualização inline de fotos
- ✅ **Progress Visual**: Barras de progresso individuais e globais
- ✅ **Nomenclatura Padronizada**: Sistema organizacional TIPO_DATA_SOLICITANTE_ARQUIVO
- ✅ **Cache Offline**: Funcionamento sem internet
- ✅ **Monitor de Uso**: Controle de recursos Firebase
- ✅ **Design Responsivo**: Otimizado para mobile e desktop
- ✅ **Integração Firebase**: Salvamento seguro no Firestore

### 🔐 **Para Interlocutores do Lab (admin.html)**
- ✅ **Sistema Multiusuário**: Login individual com credenciais específicas por interlocutor
- ✅ **Auditoria Completa**: Rastreamento completo de ações por interlocutor
- ✅ **Modal de Auditoria**: Sistema de logs com timeline de ações
- ✅ **Dashboard Completo**: Visualização de todas as solicitações em lista otimizada
- ✅ **Estatísticas em Tempo Real**: Cards com métricas importantes
- ✅ **Gestão de Status**: Atualização via modal com fluxo inteligente e rastreamento
- ✅ **Sistema de Prioridades**: Definição automática (baixa) e gestão manual
- ✅ **Sistema de Comentários**: Adição de comentários administrativos com autor
- ✅ **Filtros Avançados**: Por serviço, status e período
- ✅ **Lista Infinita**: Scroll infinito sem limitação de altura
- ✅ **Atualização Inteligente**: Auto-refresh de 5min + botão manual
- ✅ **Modal Híbrido**: Timeline, ações e comentários centralizados
- ✅ **Visualização de Arquivos**: Preview e download direto
- ✅ **Design Responsivo**: Interface otimizada para todos os dispositivos

## 🚀 Tecnologias

- **Frontend**: HTML5, CSS3, JavaScript Vanilla
- **Backend**: Firebase Firestore
- **Hosting**: Firebase Hosting
- **Arquivos**: Upload automático para Firebase Storage
- **Organização**: Sistema de nomenclatura padronizada

## 🆕 Última Atualização

**Versão Atual**: v2.9.1  
**Data**: 29 de julho de 2025  
**Principais Melhorias**:
- Auditoria multiusuário: logs de acesso e ações centralizados no Firestore
- Estatísticas reais e robustas no painel de auditoria
- Limite de 50 registros por usuário nos logs
- Modal de auditoria aprimorado (ações, acessos, estatísticas)
- Código de auditoria e autenticação refatorado
- Tratamento de campos alternativos e valores indefinidos
- Regras do Firestore revisadas
- Remoção de dependências e referências obsoletas

## ⚙️ Configuração

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

   // ...apenas Firebase, não é mais necessário configurar GitHub

## 💰 Modelo de Custos

**100% Gratuito** dentro dos limites:
- 📊 **Firebase**: 20.000 writes/dia, 10GB hosting, 360MB/dia bandwidth, 1GB storage

## 📁 Upload de Arquivos

### 🆕 **Sistema de Múltiplos Arquivos (Atualização 2025)**
- ✅ **Upload Múltiplo**: Múltiplos arquivos por categoria de serviço
- ✅ **Preview Visual**: Visualização de imagens antes do envio
- ✅ **Progress Individual**: Acompanhamento do upload de cada arquivo
- ✅ **Validação Avançada**: Tipo, tamanho e formato automático
- ✅ **Nomenclatura Inteligente**: `TIPO_DATA_SOLICITANTE_ARQUIVO.ext`
- ✅ **Pasta Organizacional**: Todos os arquivos em `senai-arquivos/`
- ✅ **Gerenciamento Visual**: Lista interativa com ações (remover, preview)

### 🔧 **Recursos Técnicos**
- ✅ **Upload para Firebase Storage**: Arquivos enviados automaticamente para o storage do projeto
- ✅ **Compressão automática**: Imagens comprimidas antes do upload
- ✅ **URLs públicas**: Links permanentes para todos os arquivos
- ✅ **Limite**: 100MB por arquivo
- ✅ **Retry automático**: Reenvio em caso de falha
- ✅ **Tipos suportados**: PDF, DOC, JPG, PNG, STL

### 📂 **Estrutura Organizacional**
```
📁 senai-arquivos/
├── 📄 IMPRESSAO_20250715_123000_JOAO_documento.pdf
├── 📐 IMPRESSAO_3D_20250715_140500_MARIA_modelo.stl
├── 📷 MANUTENCAO_20250715_160000_PEDRO_foto1.jpg
├── 📷 MANUTENCAO_20250715_160000_PEDRO_foto2.jpg
└── 📸 EMPRESTIMO_20250715_180000_ANA_item.png
```

## 📄 Documentação e Configurações

- **Configurações**: [`docs/CONFIG.md`](docs/CONFIG.md) - URLs, credenciais e configurações
- **Releases**: [`docs/releases/`](docs/releases/) - Histórico detalhado de versões
- **Changelog**: [`CHANGELOG.md`](CHANGELOG.md) - Histórico completo de mudanças e versões

> 🧪 **Ambiente de Teste**: Documentação específica disponível apenas na branch `test-environment`

## 🏗️ Estrutura do Projeto

```
senai-lab-webapp/
├── public/                             # 🌐 Aplicação Web
│   ├── index.html                      # Interface principal (colaboradores)
│   ├── admin.html                      # Dashboard administrativo
│   ├── assets/                         # Recursos da aplicação
│   │   ├── css/                        # Estilos CSS modularizados
│   │   │   ├── admin/                  # Estilos do painel administrativo
│   │   │   │   ├── actions.css        # Estilos de ações
│   │   │   │   ├── dashboard.css      # Layout do dashboard
│   │   │   │   └── ...               # Outros módulos CSS admin
│   │   │   ├── index/                 # Estilos da página principal
│   │   │   │   ├── buttons.css       # Estilos de botões
│   │   │   │   ├── form.css         # Estilos de formulários
│   │   │   │   └── ...              # Outros módulos CSS index
│   │   │   ├── admin.css             # CSS principal admin
│   │   │   ├── common.css            # Estilos compartilhados
│   │   │   └── index.css             # CSS principal index
│   │   └── js/                        # Scripts JavaScript
│   └── shared/                         # Configurações compartilhadas
│       ├── firebase-config.example.js  # Exemplo configuração Firebase
│       ├── firebase-config.js          # Suas credenciais Firebase (não commitado)
│       ├── firebase-service.js         # Serviços Firebase centralizados
│       ├── github-config.example.js    # Exemplo configuração GitHub
│       └── github-config.js            # Suas credenciais GitHub (não commitado)
├── docs/                               # 📚 Documentação
│   ├── CONFIG.md                       # Configurações centrais
│   └── releases/                       # Releases específicas
│       ├── README.md                   # Índice de releases
│       └── RELEASE-v2.5.0.md          # Release v2.5.0
├── firebase/                           # 🔥 Configurações Firebase
│   ├── README.md                       # Documentação Firebase
│   ├── firestore.rules                 # Regras de segurança
│   └── firestore.indexes.json          # Índices do Firestore
├── firebase.json                       # Configuração principal (referencia firebase/)
├── .firebaserc                         # Projetos Firebase
├── CHANGELOG.md                        # Histórico de mudanças
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

### 4. Configure as Regras do Firestore

1. **Vá para o Firebase Console**:
   - Acesse [Firebase Console](https://console.firebase.google.com/)
   - Selecione seu projeto
   - Vá para "Firestore Database" → "Rules"

2. **Cole as regras do arquivo `firestore.rules`**:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Permitir criação de solicitações para qualquer usuário (formulário público)
       // Permitir leitura para qualquer usuário (dashboard admin com autenticação local)
       // Permitir atualização/exclusão para qualquer usuário (controle no app)
       match /solicitacoes/{document} {
         allow create: if true;
         allow read: if true;
         allow update, delete: if true;
       }
       
       // Bloquear tudo mais
       match /{document=**} {
         allow read, write: if false;
       }
     }
   }
   ```

3. **Publique as regras**: Clique em "Publicar"

**Importante**: 
- ✅ **Formulário público**: Pode criar solicitações
- ✅ **Dashboard admin**: Pode ler/atualizar/deletar solicitações (protegido por senha)
- ❌ **Tudo mais**: Bloqueado por padrão
- 🔐 **Segurança**: O controle de acesso está na autenticação por senha do dashboard

### 5. Configure o Dashboard Administrativo

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

### 6. Deploy
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
- **Exportação PDF**: Relatórios completos com configurações avançadas ✨ **NOVO!**

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

#### 📊 **Monitor de Storage** ✨ **NOVO v2.9.3!**
- **Analytics Completo**: Análise detalhada do uso do Firebase Storage
- **Cálculo de Custos**: Estimativa automática baseada nos preços do Firebase
- **Visualização por Tipo**: Distribuição de arquivos por categoria (STL, PDF, imagens, etc.)
- **Métricas Detalhadas**: Tamanho total, quantidade de arquivos, tamanho médio
- **Interface Modal**: Tabs organizadas para visão geral, arquivos, usuários e custos
- **Dados em Tempo Real**: Conectado diretamente à API do Firebase Storage

## 📋 **Exportação PDF Avançada - Nova Funcionalidade**

#### 🎯 **Características do Sistema PDF**
- **📊 Relatórios Profissionais**: Layout moderno com cabeçalho personalizado
- **⚙️ Configurações Avançadas**: Modal com opções personalizáveis
- **🎨 Cores Inteligentes**: Status coloridos para fácil identificação
- **📈 Estatísticas Visuais**: Resumo executivo com métricas importantes
- **📱 Responsivo**: Funciona perfeitamente em mobile e desktop

#### 🔧 **Opções de Configuração**

##### **📊 Conteúdo do Relatório:**
- ✅ **Estatísticas Resumidas**: Cards com totais por status
- ✅ **Detalhamento Completo**: Tabela com todas as solicitações
- ✅ **Cores por Status**: Verde (Concluído), Azul (Em Andamento), Amarelo (Pendente), Vermelho (Cancelado)

##### **🎨 Personalização Visual:**
- **Cabeçalho Profissional**: Logo SENAI Lab + data/hora de geração
- **Layout Responsivo**: Quebra de página automática
- **Tipografia Otimizada**: Fonte Helvetica para melhor legibilidade
- **Cores Institucionais**: Azul SENAI (#1e3c72) como cor principal

##### **📄 Informações Incluídas:**
- Data e hora de geração
- Total de solicitações
- Filtros aplicados (se houver)
- Colaborador responsável
- Detalhes de cada solicitação
- Status com cores diferenciadas
- Níveis de prioridade
- Paginação automática

#### 🚀 **Como Usar**

1. **Acesse o Dashboard**: Entre no painel administrativo
2. **Aplique Filtros**: (Opcional) Filtre por serviço, status, período
3. **Clique em "📋 Relatório PDF"**: Botão na seção de exportação
4. **Configure Opções**: Modal abrirá com configurações disponíveis
5. **Gere o PDF**: Clique em "📋 Gerar PDF" e o download iniciará automaticamente

#### 📊 **Exemplo de Uso Prático**

```bash
# Cenário: Relatório mensal de manutenções
1. Filtrar por: Serviço = "Manutenção" + Período = "Este Mês"
2. Abrir configurações PDF
3. Habilitar: ✅ Estatísticas + ✅ Detalhes + ✅ Cores
4. Gerar relatório: "senai-lab-relatorio-2025-07-10.pdf"
```

#### 🎯 **Casos de Uso**

##### **📈 Para Gestão:**
- Relatórios mensais de atividade
- Análise de produtividade por período
- Acompanhamento de SLAs

##### **📊 Para Auditoria:**
- Histórico completo de solicitações
- Comprovação de atendimentos
- Documentação de processos

##### **📋 Para Apresentações:**
- Relatórios executivos
- Dashboards impressos
- Métricas para reuniões

#### 🔧 **Detalhes Técnicos**

##### **Tecnologia Utilizada:**
- **Biblioteca**: jsPDF 2.5.1
- **Renderização**: Frontend (sem servidor)
- **Tamanho**: ~200KB adicional
- **Compatibilidade**: Todos os navegadores modernos

##### **Performance:**
- ⚡ **Geração Rápida**: < 2 segundos para 100 registros
- 💾 **Tamanho Otimizado**: ~1-5MB por relatório
- 🖨️ **Qualidade Print**: 300 DPI equivalente
- 📱 **Mobile Friendly**: Funciona em dispositivos móveis

#### ⚠️ **Limitações e Considerações**

- **Volume Máximo**: Recomendado até 1000 registros por PDF
- **Memoria**: Relatórios muito grandes podem consumir memória
- **Internet**: Biblioteca carregada via CDN (funciona offline após primeiro acesso)

#### 🆕 **Novidades desta Implementação**

✨ **Recursos Únicos:**
- Modal de configurações interativo
- Preview das opções antes da geração
- Contadores em tempo real
- Design 100% personalizado para SENAI Lab
- Integração perfeita com filtros existentes

## 🗂️ **Histórico de Versões**

- **2.7.5.0** — Base estável (estrutura pronta, sem tema dinâmico)
- **2.7.5.1** — Tema Claro funcional (aplicação e persistência no admin)
- **2.7.5.2** — Tema Escuro funcional (aplicação e persistência no admin)
**2.7.5.3** — Tema Personalizado (inputs de cor, aplicação e persistência)

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

- **Getulio Vagner** - *Desenvolvimento inicial* - [SeuGitHub](https://github.com/GetuliovmSantos)
- **Chagas Junior** - *Desenvolvimento inicial* - [SeuGitHub](https://github.com/FChJunior)

## 📞 Suporte

Para suporte, entre em contato:
- Email: getulio.santos@docente.senai-ce.org.br
- WhatsApp: (85) 98730-0874

## 🏆 Status do Projeto

✅ **Produção** - Sistema totalmente funcional e em uso

---

⭐ **Se este projeto foi útil, deixe uma estrela!**

### 🧪 **Como Testar a Funcionalidade PDF**

#### **Teste Básico:**
```bash
# 1. Acesse o arquivo de teste
http://localhost:5000/teste-pdf.html  # ou sua URL do Firebase

# 2. Clique em "📋 Teste PDF Básico"
# 3. Verifique se o download automático funciona
# 4. Abra o arquivo "senai-lab-teste-basico.pdf"
```

#### **Teste Avançado:**
```bash
# 1. Clique em "📊 Teste PDF Avançado"
# 2. Verifique:
#    - Tabela com dados simulados
#    - Cores diferentes por status
#    - Estatísticas resumidas
#    - Layout profissional
```

#### **Teste no Dashboard:**
```bash
# 1. Acesse admin.html
# 2. Faça login com senha
# 3. Clique em "📋 Relatório PDF"
# 4. Configure opções no modal
# 5. Gere o relatório final
```