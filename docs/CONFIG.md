# ⚙️ Configurações do SENAI Lab

**Versão Atual**: v2.9.5 (Documentação simplificada e versões corrigidas)  
**Data de Deploy**: 14 de agosto de 2025  
**Branch Produção**: `main`

## 🌐 URLs de Acesso

### Produção
- **App Principal**: https://senai-lab-6fe79.web.app
- **Dashboard Admin**: https://senai-lab-6fe79.web.app/admin.html
- **Firebase Console**: https://console.firebase.google.com/project/senai-lab-6fe79

### Repositórios
- **Produção**: Sistema hospedado no Firebase Hosting
- **Storage**: Firebase Storage para arquivos

## 🔧 Configurações do Sistema

### Firebase
- **Projeto**: senai-lab-6fe79
- **Região**: nam5 (North America)
- **Coleção Produção**: `solicitacoes`
- **Coleção Teste**: `solicitacoes_test`

### Autenticação Admin
- **Arquivo**: `public/admin.html` (linha ~1075)
- **Configuração**: `ADMIN_CONFIG.password`
- **Sessão**: 24 horas
- **⚠️ Importante**: Alterar senha padrão em produção

### GitHub Integration
- **Removido**: Sistema agora usa 100% Firebase Storage
- **Arquivos**: Upload direto para Firebase Storage

## 🌍 Ambientes

### Produção
- **Branch**: `main`
- **Modo**: `production`
- **Firebase Collection**: `solicitacoes`
- **Storage**: Firebase Storage

### Teste
- **Branch**: `test-environment-v2`
- **Modo**: `test`
- **Firebase Collection**: `solicitacoes_test`
- **Storage**: Firebase Storage (pasta test)

## 📊 Limites e Quotas

### Firebase (Free Tier)
- **Leituras**: 50.000/dia
- **Escritas**: 20.000/dia
- **Storage**: 1GB
- **Bandwidth**: 10GB/mês

## 🔐 Segurança

### Firestore Rules
- **Localização**: `firestore.rules`
- **Política**: Acesso público controlado por aplicação
- **Autenticação**: Local via senha (admin)

### Arquivos de Configuração (⚠️ Não commitar)
- `public/shared/firebase-config.js`

## 📞 Suporte

- **Email**: getulio.santos@docente.senai-ce.org.br
- **WhatsApp**: (85) 98730-0874
- **GitHub Issues**: [Reportar Problemas](https://github.com/GetuliovmSantos/Sistema-de-Solicita-o-de-Servi-os/issues)

---

**Última atualização**: 16 de julho de 2025
