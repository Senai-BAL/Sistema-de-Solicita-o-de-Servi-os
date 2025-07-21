# Release v2.7.4

## Novidades
- Auditoria agora puxa logs diretamente do Firestore, exibindo todos os tipos de ações e detalhes reais do banco.
- Adaptação automática para diferentes formatos de log (status, prioridade, comentários, etc).
- Visualização aprimorada para logs genéricos e de sistema.

## Correções
- Tratamento robusto para campos ausentes ou diferentes no Firestore.
- Melhoria na exibição dos detalhes das ações.

## Observações
- Para logs de acesso, ainda é utilizado o método local. Caso queira migrar, informe a estrutura da coleção.

---
Atualização realizada em 21/07/2025.
