# 📋 Changelog - SENAI Lab Sistema de Solicitação de Serviços

Todas as mudanças notáveis deste projeto serão documentadas neste arquivo.

## [2.5.0] - 2025-07-15

### 🆕 Adicionado
- **Sistema de Múltiplos Arquivos**: Possibilidade de enviar múltiplos arquivos por categoria
- **Preview de Imagens**: Visualização inline de imagens antes do envio
- **Interface Visual de Arquivos**: Lista interativa com cards para cada arquivo
- **Progress Bars Individuais**: Acompanhamento do upload de cada arquivo separadamente
- **Progress Bar Global**: Progresso geral do upload de todos os arquivos
- **Validação Aprimorada**: Verificação de tipo, tamanho e formato por categoria
- **Gerenciamento Visual**: Ações de remover e visualizar arquivos
- **Resumo Inteligente**: Contador e tamanho total dos arquivos selecionados

### 🔄 Modificado
- **Sistema de Nomenclatura**: Novo padrão `TIPO_DATA_SOLICITANTE_ARQUIVO.ext`
- **Organização de Arquivos**: Pasta única `senai-arquivos/` para todos os tipos
- **Interface de Upload**: Cards visuais substituindo inputs simples
- **Feedback de Status**: Status em tempo real para cada arquivo
- **Validação de Arquivos**: Sistema mais robusto e específico por tipo

### 🏷️ Padrão de Nomenclatura
```
Formato: TIPO_YYYYMMDD_HHMMSS_SOLICITANTE_ARQUIVO.ext

Exemplos:
- IMPRESSAO_20250715_143000_JOAO_documento.pdf
- IMPRESSAO_3D_20250715_143000_MARIA_modelo.stl
- MANUTENCAO_20250715_143000_PEDRO_problema.jpg
- EMPRESTIMO_20250715_143000_ANA_item.png
```

### 🛠️ Técnico
- **Classe MultiFileManager**: Nova classe para gerenciar múltiplos arquivos
- **Progress APIs**: Sistema de callbacks para acompanhamento de progresso
- **Validação por Categoria**: Diferentes regras para cada tipo de serviço
- **Memory Management**: Melhor gestão de URLs de preview de imagens
- **Error Handling**: Tratamento robusto de erros de upload

### 📊 Funcionalidades por Categoria
- **Impressão**: Múltiplos PDFs, DOCs, imagens
- **Impressão 3D**: Múltiplos arquivos STL
- **Manutenção**: Múltiplas fotos do problema
- **Empréstimo**: Múltiplas fotos do item

## [2.4.0] - 2025-07-10

### 🆕 Adicionado
- Sistema de upload para GitHub
- Compressão automática de imagens
- Monitor de uso de recursos
- Cache offline Firebase

### 🔄 Modificado
- Interface responsiva melhorada
- Validações em tempo real
- Máscara automática para WhatsApp

## [2.3.0] - 2025-07-05

### 🆕 Adicionado
- Dashboard administrativo
- Sistema de comentários
- Controle de status de solicitações
- Estatísticas em tempo real

### 🔄 Modificado
- Formulário dinâmico baseado no tipo de serviço
- Melhorias na validação de dados

## [2.2.0] - 2025-07-01

### 🆕 Adicionado
- Integração com Firebase Firestore
- Sistema de solicitações completo
- Formulário adaptativo

### 🔄 Modificado
- Estrutura do projeto reorganizada
- Configurações externalizadas

## [2.1.0] - 2025-06-25

### 🆕 Adicionado
- Interface inicial do projeto
- Formulário básico de solicitações
- Configuração Firebase inicial

## [2.0.0] - 2025-06-20

### 🆕 Adicionado
- Projeto inicial
- Estrutura base
- README inicial

---

## 📝 Formato do Changelog

Este changelog segue o formato de [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

### Tipos de Mudanças
- **Adicionado** para novas funcionalidades
- **Modificado** para mudanças em funcionalidades existentes
- **Removido** para funcionalidades removidas
- **Corrigido** para correções de bugs
- **Segurança** para vulnerabilidades

### Versionamento
- **MAJOR** (X.0.0): Mudanças incompatíveis
- **MINOR** (0.X.0): Novas funcionalidades compatíveis
- **PATCH** (0.0.X): Correções compatíveis
