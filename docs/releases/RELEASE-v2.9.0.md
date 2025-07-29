# 📦 SENAI Lab - Release v2.9.0

## Principais novidades

- 🔥 Upload de arquivos agora 100% via Firebase Storage (GitHub removido)
- 🧪 Ambiente de teste garantido: nunca salva dados de teste na produção
- 🛡️ Fallback seguro: só salva na produção se o modo for 'production'
- 📝 Documentação, README e changelog atualizados
- 🚫 Removidas todas as dependências, instruções e menções ao GitHub
- 💡 Mensagens e instruções refletem uso do Firebase Storage
- 🖼️ Interface e feedbacks ajustados para novo fluxo de upload

## Orientações

- Para testar, mantenha ENVIRONMENT_CONFIG.mode como 'test'
- Todos os arquivos e solicitações vão para a coleção 'solicitacoes_test' e para o Firebase Storage
- Produção só é usada se explicitamente configurado

## Atualização recomendada

- Atualize seu ambiente local e revise as permissões do Firebase
- Consulte o README para instruções de configuração
- Veja o changelog para histórico completo

---

> Release gerada automaticamente por GitHub Copilot em 29/07/2025
