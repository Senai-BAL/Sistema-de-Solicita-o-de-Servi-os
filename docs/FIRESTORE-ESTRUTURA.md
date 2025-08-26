# 📊 Estrutura de Dados do Firestore - SENAI Lab v3.0.1

Este documento descreve a organização completa dos dados no Firebase Firestore do sistema SENAI Lab.

## 🗃️ Coleções Principais

### 1. `solicitations` (Solicitações)
**Propósito**: Armazena todas as solicitações de serviços do sistema.

**Estrutura do Documento**:
```javascript
{
  // Campos obrigatórios
  id: "auto-generated-id",
  colaborador: "Nome do Colaborador",
  email: "email@exemplo.com",
  whatsapp: "(11)99999-9999",
  servico: "espaco_maker" | "servicos" | "emprestimo",
  status: "pendente" | "em_andamento" | "aprovado" | "concluido" | "cancelado",
  prioridade: "baixa" | "media" | "alta",
  timestamp: Timestamp,
  
  // Campos específicos por tipo de serviço
  tipoServicoSelect: "impressao" | "impressao_3d" | "manutencao" | "arte_digital", // Para "servicos"
  
  // Espaço Maker
  dataReserva: "YYYY-MM-DD",
  horarioInicio: "HH:mm",
  horarioFim: "HH:mm",
  chromeBooks: boolean,
  qtdChromeBooksInput: number,
  computadores: boolean,
  qtdComputadoresInput: number,
  descricaoUtilizacao: "string",
  
  // Impressão
  tamanhoFolha: "A3" | "A4",
  qtdCopias: number,
  frenteVerso: boolean,
  escanear: boolean,
  colorido: boolean,
  observacoesImpressao: "string",
  
  // Impressão 3D
  material: "ABS" | "PLA",
  quantidade3d: number,
  possuiSTL: boolean,
  descricaoPeca: "string", // Se não possui STL
  observacoes3d: "string",
  
  // Manutenção
  descricaoProblema: "string",
  
  // Arte Digital
  descricaoArteProjeto: "string",
  
  // Empréstimo
  nomeItem: "string",
  dataRetirada: "YYYY-MM-DD",
  dataDevolucao: "YYYY-MM-DD",
  finalidadeEmprestimo: "string",
  
  // Arquivos (URLs do Firebase Storage)
  files: {
    arquivoImpressao: ["url1", "url2", ...],
    arquivoSTL: ["url1", "url2", ...],
    fotoProblema: ["url1", "url2", ...],
    referenciaArte: ["url1", "url2", ...],
    fotoItem: ["url1", "url2", ...]
  },
  
  // Metadados
  lastModified: Timestamp,
  modifiedBy: "usuario-id" | "system",
  version: "3.0.1"
}
```

### 2. `comments` (Comentários)
**Propósito**: Comentários administrativos para cada solicitação.

**Estrutura do Documento**:
```javascript
{
  id: "auto-generated-id",
  solicitationId: "referencia-para-solicitation",
  userId: "usuario-que-comentou",
  userDisplayName: "Nome do Usuário",
  comment: "Texto do comentário",
  timestamp: Timestamp,
  isInternal: boolean, // true = visível só para admins
  type: "comment" | "status_change" | "priority_change"
}
```

### 3. `audit_logs` (Logs de Auditoria)
**Propósito**: Rastreamento de todas as ações administrativas.

**Estrutura do Documento**:
```javascript
{
  id: "auto-generated-id",
  userId: "usuario-que-executou-acao",
  userDisplayName: "Nome do Usuário",
  action: "updateStatus" | "setPriority" | "addComment" | "deleteRequest" | "exportData",
  targetId: "id-da-solicitacao-afetada", // null para ações globais
  details: {
    oldValue: "valor-anterior",
    newValue: "novo-valor",
    additionalInfo: "informacoes-extras"
  },
  timestamp: Timestamp,
  ipAddress: "192.168.1.1", // se disponível
  userAgent: "Mozilla/5.0..." // se disponível
}
```

### 4. `access_logs` (Logs de Acesso)
**Propósito**: Registro de logins e acessos ao sistema.

**Estrutura do Documento**:
```javascript
{
  id: "auto-generated-id",
  userId: "usuario-id",
  userDisplayName: "Nome do Usuário",
  loginTime: Timestamp,
  logoutTime: Timestamp, // null se ainda logado
  sessionDuration: number, // em minutos
  ipAddress: "192.168.1.1",
  userAgent: "Mozilla/5.0...",
  success: boolean
}
```

### 5. `users` (Usuários Administrativos)
**Propósito**: Gerenciamento de usuários com acesso administrativo.

**Estrutura do Documento**:
```javascript
{
  id: "usuario-id",
  username: "nome-usuario",
  displayName: "Nome de Exibição",
  email: "email@exemplo.com",
  role: "admin" | "moderator" | "viewer",
  passwordHash: "hash-bcrypt",
  createdAt: Timestamp,
  lastLogin: Timestamp,
  isActive: boolean,
  permissions: {
    canEdit: boolean,
    canDelete: boolean,
    canExport: boolean,
    canManageUsers: boolean
  }
}
```

## 🔍 Consultas Comuns

### Buscar Solicitações por Status
```javascript
db.collection('solicitations')
  .where('status', '==', 'pendente')
  .orderBy('timestamp', 'desc')
  .get()
```

### Buscar por Email/Telefone (Tracking)
```javascript
// Por email
db.collection('solicitations')
  .where('email', '==', email)
  .orderBy('timestamp', 'desc')
  .get()

// Por telefone
db.collection('solicitations')
  .where('whatsapp', '==', telefone)
  .orderBy('timestamp', 'desc')
  .get()
```

### Buscar Comentários de uma Solicitação
```javascript
db.collection('comments')
  .where('solicitationId', '==', solicitationId)
  .orderBy('timestamp', 'asc')
  .get()
```

### Logs de Auditoria por Período
```javascript
db.collection('audit_logs')
  .where('timestamp', '>=', startDate)
  .where('timestamp', '<=', endDate)
  .orderBy('timestamp', 'desc')
  .limit(50)
  .get()
```

## 📁 Firebase Storage - Estrutura de Arquivos

### Organização de Pastas
```
/solicitations/
  /{solicitation-id}/
    /impressao/
      - arquivo1.pdf
      - arquivo2.docx
    /stl/
      - modelo1.stl
      - modelo2.stl
    /fotos/
      - foto1.jpg
      - foto2.png
    /referencias/
      - ref1.jpg
      - ref2.pdf
```

### Nomenclatura de Arquivos
- **Padrão**: `{TIPO}_{DATA}_{SOLICITANTE}_{ARQUIVO}`
- **Exemplo**: `IMPRESSAO_20250820_JoaoSilva_documento.pdf`

## 🔐 Índices Recomendados

### Índices Compostos Necessários
1. **solicitations**: `status` + `timestamp` (DESC)
2. **solicitations**: `servico` + `timestamp` (DESC)  
3. **solicitations**: `prioridade` + `timestamp` (DESC)
4. **comments**: `solicitationId` + `timestamp` (ASC)
5. **audit_logs**: `userId` + `timestamp` (DESC)
6. **audit_logs**: `action` + `timestamp` (DESC)

### Configuração no `firestore.indexes.json`
```json
{
  "indexes": [
    {
      "collectionGroup": "solicitations",
      "queryScope": "COLLECTION",
      "fields": [
        {"fieldPath": "status", "order": "ASCENDING"},
        {"fieldPath": "timestamp", "order": "DESCENDING"}
      ]
    }
  ]
}
```

## 📊 Estatísticas e Métricas

### Campos Calculados
- **totalRequests**: Contagem total de documentos
- **statusCounts**: Contagem por status
- **serviceCounts**: Contagem por tipo de serviço
- **avgResponseTime**: Tempo médio de resposta
- **storageUsage**: Uso total do Firebase Storage

## 🔧 Manutenção

### Limpeza Automática
- **Logs antigos**: Remover audit_logs > 90 dias
- **Arquivos órfãos**: Verificar referências quebradas no Storage
- **Sessões expiradas**: Limpar access_logs de sessões antigas

### Backup
- **Frequência**: Diário via Cloud Functions
- **Retenção**: 30 dias para backup completo
- **Formato**: JSON exportado para Cloud Storage

## 🚀 Performance

### Otimizações
1. **Paginação**: Usar `startAfter()` para grandes listas
2. **Cache**: Implementar cache local para dados frequentes
3. **Batch Operations**: Agrupar escritas quando possível
4. **Lazy Loading**: Carregar detalhes sob demanda

### Limites do Firestore
- **Documentos por transação**: 500
- **Tamanho máximo do documento**: 1 MB
- **Escritas por segundo**: 10.000 (modo multi-regional)
- **Consultas simultâneas**: 1 milhão

---

*Última atualização: 20 de agosto de 2025 - v3.0.1*
