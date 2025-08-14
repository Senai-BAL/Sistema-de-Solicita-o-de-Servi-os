# 🔧 SENAI Lab - Sistema de Solicitação de Serviços

![SENAI Lab](https://img.shields.io/badge/SENAI-Lab-blue?style=for-the-badge)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Version](https://img.shields.io/badge/Version-2.9.7-success?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Produção-success?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

## 📋 Descrição

Sistema web completo para solicitação de serviços do **SENAI Lab**, permitindo aos colaboradores solicitar diversos serviços e aos interlocutores gerenciar essas solicitações através de um dashboard administrativo robusto.

**🎯 Principais Serviços:**
- 🏗️ **Espaço Maker** - Reserva de equipamentos
- 🖨️ **Impressão** - Documentos A3/A4 com limites automáticos
- 📐 **Impressão 3D** - Peças em ABS/PLA
- 🔧 **Manutenção** - Solicitações de reparo
- 🎨 **Arte Digital** - Projetos criativos
- 📦 **Empréstimo** - Itens do laboratório

## ✨ Características Principais

### 👥 **Para Colaboradores**
- ✅ **Interface intuitiva** com validações em tempo real
- ✅ **Upload múltiplo** de arquivos com preview
- ✅ **Formulários inteligentes** adaptados por serviço
- ✅ **Design responsivo** otimizado para mobile
- ✅ **Integração Firebase** para salvamento seguro

### 🔐 **Para Administradores**
- ✅ **Dashboard completo** com estatísticas em tempo real
- ✅ **Sistema multiusuário** com autenticação segura
- ✅ **Gestão de status** com fluxo automatizado
- ✅ **Comentários administrativos** com histórico
- ✅ **Filtros avançados** por serviço, status e período
- ✅ **Exportação PDF** com configurações personalizáveis
- ✅ **Monitor de storage** com analytics de custos
- ✅ **Auditoria completa** de ações e acessos

## 🚀 Tecnologias

- **Frontend**: HTML5, CSS3, JavaScript Vanilla
- **Backend**: Firebase Firestore + Storage
- **Hosting**: Firebase Hosting
- **Deploy**: Scripts automatizados (PowerShell/Bash)

## 💰 Modelo de Custos

**100% Gratuito** dentro dos limites do Firebase:
- 📊 **Firestore**: 20.000 writes/dia
- 💾 **Storage**: 1GB gratuito
- 🌐 **Hosting**: 10GB + 360MB/dia bandwidth

## 🚀 Pipeline de Desenvolvimento

### **Sistema Automatizado de Commits**
O projeto possui scripts automatizados para padronizar commits e deploys:

```powershell
# Windows - Commit básico
.\scripts\pipeline.ps1 -NovaVersao "2.9.8" -Descricao "nova funcionalidade"

# Linux/Mac - Commit básico  
./scripts/pipeline.sh -v 2.9.8 -d "nova funcionalidade"

# Deploy para produção (adicionar -Producao ou -p)
```

**✨ Automatiza:**
- Atualização de versões em todos os arquivos
- Commits estruturados seguindo padrão definido
- Testes locais com servidor Python
- Deploy semi-automático para produção

## 🛠️ Instalação Rápida

### **Pré-requisitos**
- Node.js (Firebase CLI)
- Conta Firebase (gratuita)
- Git

### **Setup em 4 passos**
```bash
# 1. Clone o repositório
git clone https://github.com/GetuliovmSantos/Sistema-de-Solicita-o-de-Servi-os.git
cd senai-lab-webapp

# 2. Configure Firebase
npm install -g firebase-tools
firebase login
firebase init

# 3. Configure credenciais
cp public/shared/firebase-config.example.js public/shared/firebase-config.js
# (Edite com suas credenciais do Firebase Console)

# 4. Deploy
firebase deploy
```

### **⚙️ Configuração Admin**
```javascript
// Em public/admin.html - altere a senha padrão
const ADMIN_CONFIG = {
  password: 'SUA_SENHA_SEGURA_AQUI', // ⚠️ ALTERE!
  sessionDuration: 24 * 60 * 60 * 1000
};
```

## 📊 Demo e URLs

- **🌐 Produção**: [senai-lab-6fe79.web.app](https://senai-lab-6fe79.web.app)
- **👥 Formulário**: `/index.html` (público)
- **🔐 Dashboard**: `/admin.html` (senha necessária)

## 📚 Documentação Completa

| 📄 Documento | 📝 Descrição |
|--------------|--------------|
| [📋 Funcionalidades](docs/FUNCIONALIDADES.md) | Detalhes completos de todas as funcionalidades |
| [🛠️ Instalação](docs/INSTALACAO.md) | Guia técnico completo de instalação |
| [🔐 Dashboard Admin](docs/ADMIN.md) | Manual do painel administrativo |
| [📊 Sistema PDF](docs/PDF-EXPORT.md) | Relatórios e exportação |
| [🏗️ Arquitetura](docs/ARQUITETURA.md) | Estrutura técnica do sistema |
| [🚀 Pipeline](PIPELINE-COMMIT.md) | Processo de desenvolvimento |
| [📜 Changelog](CHANGELOG.md) | Histórico de versões |

## 🔧 Scripts de Desenvolvimento

| 🖥️ Plataforma | 📝 Comando | 🎯 Função |
|---------------|-----------|----------|
| **Windows** | `.\scripts\pipeline.ps1` | Automação PowerShell |
| **Linux/Mac** | `./scripts/pipeline.sh` | Automação Bash |
| **Manual** | `PIPELINE-COMMIT.md` | Processo manual |

## 🏗️ Estrutura do Projeto

```
senai-lab-webapp/
├── 📁 public/              # Aplicação web
│   ├── 🌐 index.html       # Interface colaboradores
│   ├── 🔐 admin.html       # Dashboard administrativo
│   └── 📁 assets/          # CSS/JS modularizados
├── 📁 docs/                # Documentação completa
├── 📁 scripts/             # Automação de deploy
├── 📁 firebase/            # Configurações Firebase
├── 🚀 PIPELINE-COMMIT.md   # Processo de desenvolvimento
└── 📜 CHANGELOG.md         # Histórico de versões
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/NovaFuncionalidade`)
3. Use os scripts de pipeline para commits
4. Abra um Pull Request

## 👥 Autores

- **Getulio Vagner** - *Desenvolvimento inicial* - [@GetuliovmSantos](https://github.com/GetuliovmSantos)
- **Chagas Junior** - *Desenvolvimento inicial* - [@FChJunior](https://github.com/FChJunior)

## 📞 Suporte

- **Email**: getulio.santos@docente.senai-ce.org.br
- **WhatsApp**: (85) 98730-0874

## 📝 Licença

Este projeto está sob a licença MIT. Veja [LICENSE](LICENSE) para detalhes.

---

⭐ **Se este projeto foi útil, deixe uma estrela!**
