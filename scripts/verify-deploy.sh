#!/bin/bash

# Script de Verificação Pós-Deploy
# ComunicaPro v2.0.0

echo "=================================="
echo "Verificação de Deploy - ComunicaPro"
echo "=================================="
echo ""

BASE_URL="https://eupedrodiogo.github.io/comunicapro"

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para verificar URL
check_url() {
    local url=$1
    local description=$2
    
    echo -n "Verificando $description... "
    
    status_code=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    
    if [ "$status_code" -eq 200 ]; then
        echo -e "${GREEN}✓ OK${NC} (Status: $status_code)"
        return 0
    else
        echo -e "${RED}✗ FALHOU${NC} (Status: $status_code)"
        return 1
    fi
}

# Contador de sucessos e falhas
SUCCESS=0
FAILED=0

echo "1. Verificando Páginas Principais"
echo "-----------------------------------"

# Página inicial
if check_url "$BASE_URL/" "Página Inicial"; then
    ((SUCCESS++))
else
    ((FAILED++))
fi

# Instruções
if check_url "$BASE_URL/instrucoes" "Instruções"; then
    ((SUCCESS++))
else
    ((FAILED++))
fi

# Teste
if check_url "$BASE_URL/test" "Teste de Comunicação"; then
    ((SUCCESS++))
else
    ((FAILED++))
fi

# Pricing
if check_url "$BASE_URL/pricing" "Planos e Preços"; then
    ((SUCCESS++))
else
    ((FAILED++))
fi

# Reviews
if check_url "$BASE_URL/reviews" "Avaliações"; then
    ((SUCCESS++))
else
    ((FAILED++))
fi

# Suporte
if check_url "$BASE_URL/suporte" "Suporte"; then
    ((SUCCESS++))
else
    ((FAILED++))
fi

echo ""
echo "2. Verificando Novos Recursos (v2.0.0)"
echo "---------------------------------------"

# Analytics
if check_url "$BASE_URL/analytics" "Dashboard Analytics"; then
    ((SUCCESS++))
else
    ((FAILED++))
fi

# Conquistas
if check_url "$BASE_URL/conquistas" "Sistema de Conquistas"; then
    ((SUCCESS++))
else
    ((FAILED++))
fi

# Comparação
if check_url "$BASE_URL/comparar" "Comparação de Resultados"; then
    ((SUCCESS++))
else
    ((FAILED++))
fi

echo ""
echo "3. Verificando Assets PWA"
echo "-------------------------"

# Manifest
if check_url "$BASE_URL/manifest.json" "Manifest.json"; then
    ((SUCCESS++))
else
    ((FAILED++))
fi

# Service Worker
if check_url "$BASE_URL/sw.js" "Service Worker"; then
    ((SUCCESS++))
else
    ((FAILED++))
fi

# Página Offline
if check_url "$BASE_URL/offline.html" "Página Offline"; then
    ((SUCCESS++))
else
    ((FAILED++))
fi

echo ""
echo "4. Verificando Assets Estáticos"
echo "--------------------------------"

# Favicon
if check_url "$BASE_URL/favicon.ico" "Favicon"; then
    ((SUCCESS++))
else
    ((FAILED++))
fi

# Robots.txt
if check_url "$BASE_URL/robots.txt" "Robots.txt"; then
    ((SUCCESS++))
else
    ((FAILED++))
fi

echo ""
echo "=================================="
echo "Resumo da Verificação"
echo "=================================="
echo -e "${GREEN}Sucessos: $SUCCESS${NC}"
echo -e "${RED}Falhas: $FAILED${NC}"
echo ""

TOTAL=$((SUCCESS + FAILED))
PERCENTAGE=$((SUCCESS * 100 / TOTAL))

echo "Taxa de Sucesso: $PERCENTAGE%"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ DEPLOY VALIDADO COM SUCESSO!${NC}"
    echo ""
    echo "Todos os endpoints estão respondendo corretamente."
    echo "A aplicação está pronta para uso em produção."
    exit 0
else
    echo -e "${YELLOW}⚠ ATENÇÃO: Algumas verificações falharam${NC}"
    echo ""
    echo "Por favor, verifique os endpoints que falharam."
    echo "Pode levar alguns minutos para o GitHub Pages propagar as mudanças."
    exit 1
fi

