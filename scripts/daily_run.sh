#!/bin/bash

# Define o diretório do projeto
PROJECT_DIR="$(dirname "$0")/.."
cd "$PROJECT_DIR"

# 1. Executar o script de atualização Python
echo "--- Executando script de atualização diária ---"
python3 scripts/daily_update.py

# Verifica se o arquivo de dados foi modificado
if git diff --exit-code research_data/daily_trends.json > /dev/null; then
    echo "Nenhuma mudança nos dados de pesquisa. Encerrando."
    exit 0
fi

# 2. Adicionar os arquivos modificados
echo "--- Adicionando arquivos ao Git ---"
git add research_data/daily_trends.json
git add scripts/daily_update.py
git add src/types/research.d.ts
git add src/lib/dailyTrends.ts

# 3. Commitar as mudanças
DATE=$(date +%Y-%m-%d)
COMMIT_MESSAGE="feat(daily-update): Dados de pesquisa e tendências atualizados em $DATE"
echo "--- Commitando com a mensagem: $COMMIT_MESSAGE ---"
git commit -m "$COMMIT_MESSAGE"

# 4. Fazer push para o repositório
echo "--- Fazendo push para o repositório remoto ---"
git push origin main

echo "--- Atualização diária concluída com sucesso ---"
