# 🔐 Dashboard Administrativo - SENAI Lab

> **Guia completo do painel administrativo**  
> **Versão:** v3.0.2 | **Atualizado:** 29/08/2025

---

## 🚀 **Acesso ao Dashboard**

### **🌐 URL de Acesso**
```
https://seu-dominio.com/admin.html
# ou
http://localhost:8080/admin.html (desenvolvimento)
```

### **🔐 Sistema de Login**
- **Senha única** configurável
- **Sessão persistente** (24 horas)
- **Logout automático** por segurança
- **Múltiplos usuários** (opcional)

---

## 📊 **Interface Principal**

### **🏠 Tela Inicial**

#### **📈 Cards de Estatísticas**
```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│   📊 TOTAL  │ ⏳ PENDENTE │ 🔄 ANDAMENTO│ ✅ CONCLUÍDO │
│     234     │     12      │      8      │     214     │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

#### **🔄 Atualização Automática**
- **Auto-refresh**: A cada 5 minutos
- **Botão manual**: "🔄 Atualizar Agora"
- **Indicador visual**: Última atualização

### **📋 Lista de Solicitações**

#### **🎯 Visualização Compacta**
```
📊 IMPRESSÃO | 14/08/2025 | João Silva
⏳ Pendente | 30 folhas A4 | 📎 2 arquivos
🔗 Ver Detalhes | 💬 Comentários | 📝 Ações

📐 IMPRESSÃO 3D | 13/08/2025 | Maria Santos  
🔄 Em Andamento | PLA Azul | 📎 1 arquivo
🔗 Ver Detalhes | 💬 Comentários | 📝 Ações
```

#### **📱 Interface Responsiva**
- **Desktop**: 3 colunas com detalhes
- **Tablet**: 2 colunas adaptadas
- **Mobile**: 1 coluna empilhada

---

## 🔧 **Funcionalidades Administrativas**

### **📊 Gestão de Status**

#### **🔄 Fluxo de Status**
```
⏳ Pendente → 🔄 Em Andamento → ✅ Concluído
                    ↓
                ❌ Cancelado
```

#### **⚡ Atualização Rápida**
1. **Clique no status** atual
2. **Selecione novo status** no dropdown
3. **Confirme** a alteração
4. **Log automático** da ação

### **💬 Sistema de Comentários**

#### **📝 Adicionar Comentário**
```
┌─────────────────────────────────────────┐
│ 💬 Adicionar Comentário Administrativo │
├─────────────────────────────────────────┤
│ [Texto do comentário...]                │
│                                         │
│ [📝 Adicionar]  [❌ Cancelar]          │
└─────────────────────────────────────────┘
```

#### **📋 Histórico de Comentários**
```
👤 Admin João | 14/08/2025 14:30
💬 "Aguardando material chegar"

👤 Admin Maria | 13/08/2025 09:15  
💬 "Solicitação aprovada"
```

### **🏷️ Sistema de Prioridades**

#### **📊 Níveis de Prioridade**
- 🔴 **Alta**: Urgente, prazos críticos
- 🟡 **Média**: Prazo normal
- 🟢 **Baixa**: Sem pressa (padrão)

#### **⚡ Definição Automática**
```javascript
// Regras automáticas
- Manutenção = 🔴 Alta (sempre)
- Impressão 3D = 🟡 Média (material específico)
- Demais = 🟢 Baixa (padrão)
```

---

## 🔍 **Sistema de Filtros**

### **📅 Filtros Disponíveis**

#### **🎯 Por Serviço**
- 🏗️ Espaço Maker
- 🖨️ Impressão
- 📐 Impressão 3D
- 🔧 Manutenção
- 🎨 Arte Digital
- 📦 Empréstimo

#### **📊 Por Status**
- ⏳ Pendente
- 🔄 Em Andamento
- ✅ Concluído
- ❌ Cancelado

#### **📅 Por Período**
- 📆 Hoje
- 📅 Esta Semana
- 📊 Este Mês
- 🗓️ Personalizado

### **🔎 Busca Avançada**
```
┌─────────────────────────────────────────┐
│ 🔍 [Buscar por nome, serviço, etc...]  │
├─────────────────────────────────────────┤
│ 📊 Serviço: [Todos ▼]                  │
│ 📈 Status: [Todos ▼]                   │
│ 📅 De: [__/__/____] Até: [__/__/____] │
│                                         │
│ [🔍 Buscar]  [🗑️ Limpar]             │
└─────────────────────────────────────────┘
```

---

## 📊 **Modal de Detalhes**

### **🔍 Informações Completas**

#### **📋 Aba "Detalhes"**
```
┌─────────────────────────────────────────┐
│ 📊 IMPRESSÃO #12345                     │
├─────────────────────────────────────────┤
│ 👤 Solicitante: João Silva              │
│ 📞 WhatsApp: (85) 98765-4321           │
│ 📅 Data: 14/08/2025 14:30              │
│ ⏳ Status: Pendente                     │
│ 🏷️ Prioridade: Baixa                   │
│                                         │
│ 📝 Descrição:                          │
│ "Imprimir relatório mensal..."          │
│                                         │
│ 📎 Arquivos (2):                       │
│ • relatório.pdf (2.1 MB)               │
│ • anexo.docx (1.3 MB)                  │
└─────────────────────────────────────────┘
```

#### **💬 Aba "Comentários"**
```
┌─────────────────────────────────────────┐
│ 💬 COMENTÁRIOS ADMINISTRATIVOS          │
├─────────────────────────────────────────┤
│ 👤 Admin João | 14/08/2025 14:30       │
│ 💬 "Aguardando aprovação da chefia"     │
│                                         │
│ 👤 Admin Maria | 13/08/2025 09:15      │
│ 💬 "Documentos conferidos"              │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ [Novo comentário...]                │ │
│ │ [📝 Adicionar]                     │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

#### **⚡ Aba "Ações"**
```
┌─────────────────────────────────────────┐
│ ⚡ AÇÕES RÁPIDAS                        │
├─────────────────────────────────────────┤
│ 📊 Alterar Status:                      │
│ [⏳ Pendente ▼] [💾 Salvar]            │
│                                         │
│ 🏷️ Alterar Prioridade:                 │
│ [🟢 Baixa ▼] [💾 Salvar]              │
│                                         │
│ 📱 Ações:                              │
│ [📞 WhatsApp] [📧 Email] [🗑️ Excluir] │
└─────────────────────────────────────────┘
```

---

## 📊 **Sistema de Relatórios**

### **📋 Exportação PDF**

#### **⚙️ Configurações Avançadas**
```
┌─────────────────────────────────────────┐
│ 📋 CONFIGURAR RELATÓRIO PDF             │
├─────────────────────────────────────────┤
│ ✅ Incluir estatísticas resumidas       │
│ ✅ Incluir detalhes das solicitações    │
│ ✅ Usar cores por status                │
│ ✅ Incluir arquivos anexados            │
│                                         │
│ 📅 Período:                            │
│ ◉ Filtro atual  ○ Personalizado       │
│                                         │
│ [📋 Gerar PDF]  [❌ Cancelar]          │
└─────────────────────────────────────────┘
```

#### **📊 Conteúdo do Relatório**
- **📈 Estatísticas**: Cards com totais
- **📋 Listagem**: Todas as solicitações filtradas
- **🎨 Design**: Layout profissional SENAI
- **📄 Formato**: A4, quebra de página automática

### **📊 Monitor de Storage**

#### **💾 Analytics de Arquivos**
```
┌─────────────────────────────────────────┐
│ 💾 MONITOR DE STORAGE                   │
├─────────────────────────────────────────┤
│ 📊 Total: 2.5 GB de 5 GB (50%)        │
│ 📁 Arquivos: 1,234 arquivos            │
│ 💰 Custo Estimado: R$ 0,15/mês         │
│                                         │
│ 📈 Por Tipo:                           │
│ • 📄 PDF: 45% (1.1 GB)                │
│ • 📷 Imagens: 30% (750 MB)             │
│ • 📐 STL: 20% (500 MB)                 │
│ • 📝 Outros: 5% (125 MB)               │
└─────────────────────────────────────────┘
```

---

## 🛡️ **Segurança e Auditoria**

### **📊 Logs de Atividade**

#### **👥 Logs de Acesso**
```
📅 14/08/2025 14:30 | 👤 Admin João
🔐 Login realizado | IP: 192.168.1.100

📅 14/08/2025 14:25 | 👤 Admin Maria  
🚪 Logout automático | Sessão expirada
```

#### **⚡ Logs de Ações**
```
📅 14/08/2025 14:30 | 👤 Admin João
📊 Status alterado: Pendente → Em Andamento
🆔 Solicitação: #12345

📅 14/08/2025 14:28 | 👤 Admin João
💬 Comentário adicionado: "Aprovado pela chefia"
🆔 Solicitação: #12345
```

### **🔒 Configuração de Segurança**

#### **🔐 Senhas e Sessões**
```javascript
// Configuração em admin.html
const ADMIN_CONFIG = {
  password: 'SUA_SENHA_FORTE_AQUI',
  sessionDuration: 24 * 60 * 60 * 1000, // 24h
  maxFailedAttempts: 3,
  lockoutDuration: 15 * 60 * 1000 // 15min
};
```

#### **👥 Múltiplos Usuários**
```javascript
const ADMIN_USERS = {
  'joao.admin': {
    name: 'João Silva',
    password: 'senha123',
    permissions: ['read', 'write', 'delete']
  },
  'maria.admin': {
    name: 'Maria Santos',
    password: 'outrasenha456', 
    permissions: ['read', 'write']
  }
};
```

---

## 📱 **Mobile e Responsividade**

### **📊 Layout Adaptativo**

#### **💻 Desktop (> 1024px)**
- **3 colunas**: Filtros | Lista | Detalhes
- **Sidebar**: Navegação lateral
- **Modals**: Centralizados

#### **📱 Tablet (768px - 1024px)**
- **2 colunas**: Lista | Detalhes
- **Sidebar**: Colapsável
- **Modals**: Adaptados

#### **📱 Mobile (< 768px)**
- **1 coluna**: Stack vertical
- **Menu**: Hambúrguer
- **Modals**: Tela cheia

### **👆 Touch-Friendly**
- **Botões grandes**: Mínimo 44px
- **Espaçamento**: 16px entre elementos
- **Swipe**: Gestos para ações
- **Zoom**: Textos legíveis

---

## 🔧 **Manutenção e Troubleshooting**

### **⚠️ Problemas Comuns**

#### **🔐 "Senha incorreta"**
```javascript
// Verificar em admin.html linha ~50
const ADMIN_CONFIG = {
  password: 'sua_senha_aqui' // ← Verificar
};
```

#### **📊 "Dados não carregam"**
- ✅ Verificar conexão internet
- ✅ Verificar regras Firestore
- ✅ Verificar console do navegador
- ✅ Verificar configuração Firebase

#### **📁 "Upload não funciona"**
- ✅ Verificar regras Storage
- ✅ Verificar tamanho do arquivo
- ✅ Verificar tipo do arquivo
- ✅ Verificar quota Firebase

### **🔍 Debug Mode**
```javascript
// Ativar logs detalhados (adicionar no topo de admin.html)
window.DEBUG_MODE = true;

// Console mostrará:
// - Queries Firestore
// - Upload progress  
// - Estados da aplicação
// - Erros detalhados
```

---

## 📈 **Métricas e Analytics**

### **📊 KPIs Principais**
- **📈 Total de solicitações**: Crescimento mensal
- **⚡ Tempo médio**: Pendente → Concluído
- **📊 Taxa de conclusão**: % concluídas vs canceladas
- **🏆 Serviços populares**: Ranking por volume

### **📅 Relatórios Periódicos**
- **📊 Diário**: Atividade do dia
- **📈 Semanal**: Resumo da semana
- **📊 Mensal**: Relatório executivo
- **📅 Anual**: Análise de tendências

---

**📚 Documentação Relacionada:**
- [Funcionalidades Detalhadas](FUNCIONALIDADES.md)
- [Instalação e Configuração](INSTALACAO.md)
- [Sistema de Relatórios PDF](PDF-EXPORT.md)
- [Pipeline de Desenvolvimento](../PIPELINE-COMMIT.md)
