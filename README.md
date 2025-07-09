# 🔧 SENAI Lab - Sistema de Solicitação de Serviços

![SENAI Lab](https://img.shields.io/badge/SENAI-Lab-blue?style=for-the-badge)
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
- **Arquivos**: Links externos (Google Drive, Dropbox, OneDrive)

## 💰 Modelo de Custos

**100% Gratuito** dentro dos limites do Firebase:
- 📊 Firestore: 20.000 writes/dia
- 🌐 Hosting: 10GB
- 📶 Bandwidth: 360MB/dia
- 📁 Arquivos: Links externos (sem custo Firebase)

## 🏗️ Estrutura do Projeto

```
senai-lab-webapp/
├── public/
│   ├── index.html                    # Aplicação principal
│   ├── firebase-config.example.js    # Exemplo de configuração
│   └── firebase-config.js           # Suas credenciais (não commitado)
├── firebase.json                    # Configuração Firebase
├── firestore.rules                 # Regras de segurança
├── firestore.indexes.json          # Índices do Firestore
├── .gitignore                      # Arquivos ignorados pelo Git
└── README.md                       # Este arquivo
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

### 3. Configure as credenciais Firebase
```bash
# Copie o arquivo de exemplo
cp public/firebase-config.example.js public/firebase-config.js

# Edite o arquivo com suas credenciais
# Substitua os valores de exemplo pelas suas credenciais Firebase
```

**Importante**: O arquivo `firebase-config.js` contém suas credenciais e não deve ser commitado no Git.

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
- Upload via links externos

### 🏗️ Impressão 3D
- Seleção de material (ABS/PLA)
- Upload de arquivo STL ou descrição da peça
- Controle de quantidade

### 🔧 Manutenção
- Descrição detalhada do problema
- Upload de foto via link externo

### 🎨 Arte Digital/Projeto
- Descrição das ideias e utilização

### 📦 Empréstimo
- Nome do item
- Datas de retirada e devolução
- Foto obrigatória via link externo

## 🛡️ Segurança

- **Firestore Rules**: Apenas criação permitida, sem leitura/edição
- **Validação Client-Side**: Múltiplas camadas de validação
- **Sanitização**: Dados tratados antes do envio
- **Links Externos**: Arquivos não ficam no Firebase Storage

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

- **Seu Nome** - *Desenvolvimento inicial* - [SeuGitHub](https://github.com/seu-usuario)

## 📞 Suporte

Para suporte, entre em contato:
- Email: seu.email@senai.br
- WhatsApp: (xx) xxxxx-xxxx

## 🏆 Status do Projeto

✅ **Produção** - Sistema totalmente funcional e em uso

---

⭐ **Se este projeto foi útil, deixe uma estrela!**
