# ⚙️ Configurações do SENAI Lab

**Versão Atual**: v2.6.0 (Otimizações de Interface e Performance)  
**Data de Deploy**: 18 de julho de 2025  
**Branch Produção**: `main`

## 🌐 URLs de Acesso

### Produção
- **App Principal**: https://senai-lab-6fe79.web.app
- **Dashboard Admin**: https://senai-lab-6fe79.web.app/admin.html
- **Firebase Console**: https://console.firebase.google.com/project/senai-lab-6fe79

### Repositórios GitHub
- **Produção**: [senai-lab-arquivos](https://github.com/GetuliovmSantos/senai-lab-arquivos)
- **Teste**: [senai-lab-test](https://github.com/GetuliovmSantos/senai-lab-test)

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
- **API**: GitHub REST API v3
- **Permissões necessárias**: `repo` (controle total de repositórios)
- **Configuração**: `public/shared/github-config.js`

## 🌍 Ambientes

### Produção
- **Branch**: `main`
- **Modo**: `production`
- **Firebase Collection**: `solicitacoes`
- **GitHub Repo**: `senai-lab-arquivos`

### Teste
- **Branch**: `test-environment`
- **Modo**: `test`
- **Firebase Collection**: `solicitacoes_test`
- **GitHub Repo**: `senai-lab-test`

## 📊 Limites e Quotas

### Firebase (Free Tier)
- **Leituras**: 50.000/dia
- **Escritas**: 20.000/dia
- **Storage**: 1GB
- **Bandwidth**: 10GB/mês

### GitHub
- **Storage**: Ilimitado (repositórios públicos)
- **API Rate Limit**: 5.000 requests/hora (autenticado)

## 🔐 Segurança

### Firestore Rules
- **Localização**: `firestore.rules`
- **Política**: Acesso público controlado por aplicação
- **Autenticação**: Local via senha (admin)

### Arquivos de Configuração (⚠️ Não commitar)
- `public/shared/firebase-config.js`
- `public/shared/github-config.js`

## 📞 Suporte

- **Email**: getulio.santos@docente.senai-ce.org.br
- **WhatsApp**: (85) 98730-0874
- **GitHub Issues**: [Reportar Problemas](https://github.com/GetuliovmSantos/Sistema-de-Solicita-o-de-Servi-os/issues)

---

**Última atualização**: 16 de julho de 2025
