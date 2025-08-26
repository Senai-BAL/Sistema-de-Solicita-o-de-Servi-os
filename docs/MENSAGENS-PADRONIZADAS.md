# 💬 Padronização de Mensagens - SENAI Lab v3.0.0

Este documento define as mensagens padronizadas usadas em todo o sistema para garantir consistência na experiência do usuário.

## 🎨 Tipos de Mensagens

### ✅ Sucesso (Success)
- **Cor**: Verde (#4CAF50)
- **Duração**: 3-5 segundos
- **Ícone**: ✅, 🎉, ✨

### ⚠️ Aviso (Warning)
- **Cor**: Amarelo/Laranja (#FF9800)
- **Duração**: 4-6 segundos
- **Ícone**: ⚠️, ⏰, 💡

### ❌ Erro (Error)
- **Cor**: Vermelho (#F44336)
- **Duração**: 6-8 segundos (ou até o usuário fechar)
- **Ícone**: ❌, 🚫, ⚡

### ℹ️ Informação (Info)
- **Cor**: Azul (#2196F3)
- **Duração**: 4-5 segundos
- **Ícone**: ℹ️, 📋, 🔍

## 📝 Mensagens por Contexto

### Formulário de Solicitação (index.html)

#### Sucesso
```javascript
{
  title: "✅ Solicitação Enviada!",
  message: "Sua solicitação foi registrada com sucesso. Em breve entraremos em contato.",
  type: "success"
}
```

#### Erros de Validação
```javascript
{
  title: "⚠️ Campos Obrigatórios",
  message: "Por favor, preencha todos os campos marcados com *",
  type: "warning"
}

{
  title: "❌ Arquivo Inválido",
  message: "O arquivo deve ter no máximo 100MB e ser do tipo: PDF, DOC, JPG ou PNG",
  type: "error"
}

{
  title: "⚠️ Data Inválida",
  message: "A data de reserva deve ser futura e não pode ser em fins de semana",
  type: "warning"
}
```

#### Upload de Arquivos
```javascript
{
  title: "📤 Enviando Arquivo...",
  message: "Aguarde enquanto o arquivo é carregado",
  type: "info"
}

{
  title: "✅ Upload Concluído",
  message: "Arquivo enviado com sucesso",
  type: "success"
}

{
  title: "❌ Falha no Upload",
  message: "Erro ao enviar arquivo. Tente novamente ou verifique sua conexão",
  type: "error"
}
```

### Página de Tracking (tracking.html)

#### Busca
```javascript
{
  title: "🔍 Buscando...",
  message: "Procurando sua solicitação no sistema",
  type: "info"
}

{
  title: "✅ Solicitação Encontrada",
  message: "Exibindo detalhes da sua solicitação",
  type: "success"
}

{
  title: "❌ Não Encontrado",
  message: "Nenhuma solicitação encontrada com os dados informados. Verifique o código, email ou telefone",
  type: "error"
}

{
  title: "⚠️ Múltiplos Resultados",
  message: "Encontramos várias solicitações. Selecione a desejada na lista abaixo",
  type: "warning"
}
```

#### Validação de Entrada
```javascript
{
  title: "⚠️ Formato Inválido",
  message: "Por favor, digite um email válido (ex: usuario@exemplo.com)",
  type: "warning"
}

{
  title: "⚠️ Telefone Inválido",
  message: "Digite o telefone com DDD (ex: 11999887766)",
  type: "warning"
}

{
  title: "⚠️ Código Inválido",
  message: "O código deve ter pelo menos 8 caracteres",
  type: "warning"
}
```

### Dashboard Administrativo (admin.html)

#### Autenticação
```javascript
{
  title: "✅ Login Realizado",
  message: "Bem-vindo ao painel administrativo",
  type: "success"
}

{
  title: "❌ Credenciais Inválidas",
  message: "Usuário ou senha incorretos. Tente novamente",
  type: "error"
}

{
  title: "⚠️ Sessão Expirada",
  message: "Sua sessão expirou. Faça login novamente",
  type: "warning"
}
```

#### Operações CRUD
```javascript
{
  title: "✅ Status Atualizado",
  message: "Status da solicitação alterado para: {novo_status}",
  type: "success"
}

{
  title: "✅ Comentário Adicionado",
  message: "Seu comentário foi salvo com sucesso",
  type: "success"
}

{
  title: "⚠️ Confirmar Exclusão",
  message: "Tem certeza que deseja excluir esta solicitação? Esta ação não pode ser desfeita",
  type: "warning"
}

{
  title: "✅ Solicitação Excluída",
  message: "A solicitação foi removida permanentemente do sistema",
  type: "success"
}
```

#### Exportação
```javascript
{
  title: "📊 Gerando Relatório...",
  message: "Preparando dados para exportação. Aguarde...",
  type: "info"
}

{
  title: "✅ Relatório Gerado",
  message: "Download iniciado automaticamente",
  type: "success"
}

{
  title: "❌ Erro na Exportação",
  message: "Falha ao gerar relatório. Tente novamente ou contate o suporte",
  type: "error"
}
```

#### Sistema
```javascript
{
  title: "🔄 Dados Atualizados",
  message: "Dashboard sincronizado com as últimas informações",
  type: "success"
}

{
  title: "🧹 Limpeza Concluída",
  message: "Arquivos órfãos removidos. Espaço liberado: {tamanho}",
  type: "success"
}

{
  title: "💾 Backup Criado",
  message: "Backup manual gerado com sucesso",
  type: "success"
}
```

## 🎯 Diretrizes de UX

### Tom de Voz
- **Amigável**: Use linguagem próxima e acessível
- **Claro**: Evite jargões técnicos
- **Útil**: Sempre indique próximos passos quando possível
- **Profissional**: Mantenha seriedade em contextos de erro

### Estrutura da Mensagem
1. **Ícone** + **Ação/Status** (título)
2. **Explicação clara** do que aconteceu
3. **Próximo passo** (quando aplicável)

### Exemplos de Boas Práticas

#### ❌ Ruim
```
"Erro 404 - Request failed"
```

#### ✅ Bom
```
"❌ Solicitação Não Encontrada
Não conseguimos localizar uma solicitação com esse código. 
Verifique se digitou corretamente ou tente buscar por email."
```

### Consistência entre Plataformas
- Mesmos ícones para mesmos tipos de ação
- Cores padronizadas conforme tipo de mensagem
- Duração apropriada para cada tipo
- Posicionamento consistente (toast, modal, inline)

## 🔧 Implementação Técnica

### Toast Manager
```javascript
// Uso padronizado
ToastManager.show("✅ Operação realizada com sucesso", "success");
ToastManager.show("⚠️ Atenção necessária", "warning");  
ToastManager.show("❌ Erro encontrado", "error");
ToastManager.show("ℹ️ Informação relevante", "info");
```

### Classes CSS
```css
.toast.success { background: #4CAF50; }
.toast.warning { background: #FF9800; }
.toast.error { background: #F44336; }
.toast.info { background: #2196F3; }
```

### Acessibilidade
- **ARIA labels** para leitores de tela
- **Alto contraste** entre texto e fundo
- **Tempo suficiente** para leitura
- **Foco automático** em mensagens críticas

---

*Última atualização: 20 de agosto de 2025 - v3.0.0*
