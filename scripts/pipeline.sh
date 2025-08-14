#!/bin/bash
# 🚀 SENAI Lab - Script de Pipeline Automatizada
# Arquivo: scripts/pipeline.sh
# Descrição: Automatiza o processo de commit seguindo PIPELINE-COMMIT.md

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

# Função para exibir ajuda
show_help() {
    echo -e "${CYAN}🚀 SENAI Lab - Pipeline de Commit v1.0.0${NC}"
    echo -e "${CYAN}================================================${NC}"
    echo ""
    echo "Uso: ./scripts/pipeline.sh [OPÇÕES]"
    echo ""
    echo "Opções:"
    echo "  -v, --version VERSAO     Nova versão (obrigatório, ex: 2.9.6)"
    echo "  -t, --type TIPO         Tipo do commit (padrão: feat)"
    echo "  -s, --scope ESCOPO      Escopo do commit (padrão: admin)"
    echo "  -d, --desc DESCRICAO    Descrição do commit"
    echo "  -p, --production        Deploy para produção"
    echo "  --skip-tests            Pular testes locais"
    echo "  -h, --help              Mostrar esta ajuda"
    echo ""
    echo "Exemplo:"
    echo "  ./scripts/pipeline.sh -v 2.9.6 -d 'sistema de limpeza automática'"
}

# Variáveis padrão
NOVA_VERSAO=""
TIPO_COMMIT="feat"
ESCOPO="admin"
DESCRICAO=""
PRODUCAO=false
SKIP_TESTS=false

# Processar argumentos
while [[ $# -gt 0 ]]; do
    case $1 in
        -v|--version)
            NOVA_VERSAO="$2"
            shift 2
            ;;
        -t|--type)
            TIPO_COMMIT="$2"
            shift 2
            ;;
        -s|--scope)
            ESCOPO="$2"
            shift 2
            ;;
        -d|--desc)
            DESCRICAO="$2"
            shift 2
            ;;
        -p|--production)
            PRODUCAO=true
            shift
            ;;
        --skip-tests)
            SKIP_TESTS=true
            shift
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        *)
            echo -e "${RED}❌ Opção desconhecida: $1${NC}"
            show_help
            exit 1
            ;;
    esac
done

# Verificar versão obrigatória
if [[ -z "$NOVA_VERSAO" ]]; then
    echo -e "${RED}❌ Erro: Versão é obrigatória${NC}"
    echo "Use: ./scripts/pipeline.sh -v 2.9.6"
    exit 1
fi

echo -e "${CYAN}🚀 SENAI Lab - Pipeline de Commit v1.0.0${NC}"
echo -e "${CYAN}================================================${NC}"

# Verificar se estamos no diretório correto
if [[ ! -f "public/admin.html" ]]; then
    echo -e "${RED}❌ Erro: Execute o script na raiz do projeto SENAI Lab${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}📋 ETAPA 1: Atualizando versão em todos os arquivos...${NC}"

# Função para atualizar versão
update_version() {
    local file_path="$1"
    local nova_versao="v$NOVA_VERSAO"
    
    if [[ -f "$file_path" ]]; then
        sed -i.bak "s/v2\.[0-9]\+\.[0-9]\+/$nova_versao/g" "$file_path"
        rm "$file_path.bak" 2>/dev/null
        echo -e "${GREEN}✅ Atualizado: $file_path${NC}"
    else
        echo -e "${YELLOW}⚠️  Arquivo não encontrado: $file_path${NC}"
    fi
}

# Atualizar versões nos arquivos
update_version "public/admin.html"
update_version "public/index.html"
update_version "README.md"

# Atualizar utils.js
if [[ -f "public/assets/js/admin/utils.js" ]]; then
    sed -i.bak "s/Versão: v[0-9]\+\.[0-9]\+\.[0-9]\+/Versão: v$NOVA_VERSAO/g" "public/assets/js/admin/utils.js"
    rm "public/assets/js/admin/utils.js.bak" 2>/dev/null
    echo -e "${GREEN}✅ Atualizado: public/assets/js/admin/utils.js${NC}"
fi

echo ""
echo -e "${YELLOW}🔍 ETAPA 2: Verificando alterações...${NC}"
git status --porcelain

echo ""
echo -e "${YELLOW}⚠️  ETAPA 3: Verificação manual necessária${NC}"
echo "📖 Verifique se precisa atualizar CHANGELOG.md"
echo "📦 Verifique se precisa criar release"

if [[ "$SKIP_TESTS" == false ]]; then
    echo ""
    echo -e "${YELLOW}🧪 ETAPA 4: Iniciando testes...${NC}"
    
    # Verificar se Python está disponível
    if command -v python3 &> /dev/null; then
        echo -e "${GREEN}✅ Python encontrado${NC}"
        echo "🌐 Iniciando servidor local na porta 8080..."
        
        # Iniciar servidor em background
        cd public && python3 -m http.server 8080 &> /dev/null &
        SERVER_PID=$!
        cd ..
        
        sleep 3
        echo -e "${GREEN}✅ Servidor iniciado em http://localhost:8080${NC}"
        echo "🔗 Acesse: http://localhost:8080/admin.html para testar"
        
        read -p "Pressione ENTER após testar ou 'q' para cancelar: " continuar
        if [[ "$continuar" == "q" ]]; then
            kill $SERVER_PID 2>/dev/null
            echo -e "${RED}❌ Pipeline cancelada pelo usuário${NC}"
            exit 1
        fi
        
        # Matar servidor
        kill $SERVER_PID 2>/dev/null
        
    else
        echo -e "${YELLOW}⚠️  Python não encontrado, pulando teste local${NC}"
    fi
fi

echo ""
echo -e "${YELLOW}📝 ETAPA 5: Preparando commit...${NC}"

if [[ -z "$DESCRICAO" ]]; then
    read -p "Digite a descrição do commit: " DESCRICAO
fi

# Montar mensagem do commit
COMMIT_MESSAGE="${TIPO_COMMIT}(${ESCOPO}): ${DESCRICAO}

Versão: v${NOVA_VERSAO}
Data: $(date '+%d/%m/%Y %H:%M')

Arquivos atualizados:"

# Adicionar arquivos modificados
ARQUIVOS_MODIFICADOS=$(git diff --name-only HEAD)
if [[ -n "$ARQUIVOS_MODIFICADOS" ]]; then
    COMMIT_MESSAGE+="\n$(echo "$ARQUIVOS_MODIFICADOS" | sed 's/^/- /')"
fi

echo ""
echo -e "${CYAN}📄 Mensagem do commit:${NC}"
echo -e "${WHITE}$COMMIT_MESSAGE${NC}"

read -p $'\nConfirmar commit? (s/N): ' confirmar
if [[ "$confirmar" != "s" && "$confirmar" != "S" ]]; then
    echo -e "${RED}❌ Commit cancelado${NC}"
    exit 1
fi

# Fazer o commit
git add .
git commit -m "$COMMIT_MESSAGE"

echo -e "${GREEN}✅ Commit realizado com sucesso!${NC}"

# Se for para produção
if [[ "$PRODUCAO" == true ]]; then
    echo ""
    echo -e "${YELLOW}🚀 ETAPA 6: Deploy para produção...${NC}"
    
    echo "🔄 Mudando para branch main..."
    git checkout main
    
    echo "🔀 Fazendo merge..."
    git merge test-environment-v2
    
    echo "📤 Fazendo push..."
    git push origin main
    
    echo ""
    echo -e "${CYAN}🌐 Deploy Firebase:${NC}"
    echo -e "${WHITE}Execute manualmente: firebase deploy${NC}"
    echo -e "${WHITE}Ou faça upload da pasta public/ para Firebase Hosting${NC}"
    
    echo ""
    echo -e "${GREEN}✅ Pipeline de produção concluída!${NC}"
    echo -e "${CYAN}🔗 Verifique: https://senai-lab-6fe79.web.app${NC}"
else
    echo ""
    echo -e "${GREEN}✅ Pipeline de desenvolvimento concluída!${NC}"
    echo -e "${YELLOW}💡 Use -p ou --production para fazer deploy${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Pipeline finalizada com sucesso!${NC}"
