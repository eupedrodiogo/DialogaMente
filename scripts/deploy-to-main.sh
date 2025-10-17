#!/bin/bash

# Script de Deploy para Branch Main
# ComunicaPro v2.0.0

set -e  # Parar em caso de erro

echo "=================================="
echo "Deploy ComunicaPro - Branch Main"
echo "=================================="
echo ""

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar se está na branch main
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo -e "${YELLOW}⚠ Você não está na branch main!${NC}"
    echo "Branch atual: $CURRENT_BRANCH"
    read -p "Deseja continuar mesmo assim? (s/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        echo "Deploy cancelado."
        exit 1
    fi
fi

# Verificar se há mudanças não commitadas
if [[ -n $(git status -s) ]]; then
    echo -e "${YELLOW}⚠ Há mudanças não commitadas!${NC}"
    git status -s
    echo ""
    read -p "Deseja fazer commit antes de continuar? (S/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Nn]$ ]]; then
        read -p "Mensagem do commit: " COMMIT_MSG
        git add -A
        git commit -m "$COMMIT_MSG"
        echo -e "${GREEN}✓ Commit realizado${NC}"
    fi
fi

echo ""
echo -e "${BLUE}1. Limpando build anterior...${NC}"
rm -rf dist
echo -e "${GREEN}✓ Build anterior removido${NC}"

echo ""
echo -e "${BLUE}2. Instalando dependências...${NC}"
npm ci --silent
echo -e "${GREEN}✓ Dependências instaladas${NC}"

echo ""
echo -e "${BLUE}3. Executando build de produção...${NC}"
npm run build
echo -e "${GREEN}✓ Build concluído${NC}"

echo ""
echo -e "${BLUE}4. Criando arquivo .nojekyll...${NC}"
touch dist/.nojekyll
echo -e "${GREEN}✓ Arquivo .nojekyll criado${NC}"

echo ""
echo -e "${BLUE}5. Copiando build para diretório docs/...${NC}"
# Criar diretório docs se não existir
mkdir -p docs

# Copiar conteúdo do dist para docs
cp -r dist/* docs/
echo -e "${GREEN}✓ Build copiado para docs/${NC}"

echo ""
echo -e "${BLUE}6. Adicionando arquivos ao git...${NC}"
git add docs/
git add dist/
echo -e "${GREEN}✓ Arquivos adicionados${NC}"

echo ""
echo -e "${BLUE}7. Criando commit de deploy...${NC}"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
git commit -m "deploy: Atualização do build - $TIMESTAMP" || echo "Nenhuma mudança para commitar"
echo -e "${GREEN}✓ Commit criado${NC}"

echo ""
echo -e "${BLUE}8. Enviando para GitHub...${NC}"
git push origin main
echo -e "${GREEN}✓ Push concluído${NC}"

echo ""
echo "=================================="
echo -e "${GREEN}✓ DEPLOY CONCLUÍDO COM SUCESSO!${NC}"
echo "=================================="
echo ""
echo "A aplicação será atualizada em alguns minutos em:"
echo "https://eupedrodiogo.github.io/comunicapro/"
echo ""
echo "Próximos passos:"
echo "1. Acesse GitHub Settings → Pages"
echo "2. Configure Source: Deploy from a branch"
echo "3. Selecione branch: main"
echo "4. Selecione folder: /docs"
echo "5. Clique em Save"
echo ""

