import json
import os
from datetime import date

def generate_summary(data_path, output_path):
    """
    Lê o arquivo JSON de estatísticas de mercado e gera um resumo analítico em Markdown.
    """
    try:
        with open(data_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except FileNotFoundError:
        return f"Erro: Arquivo de dados não encontrado em {data_path}"
    except json.JSONDecodeError:
        return f"Erro: Falha ao decodificar JSON em {data_path}"

    market_data = data.get('market_statistics', {})
    trends = data.get('key_trends', [])
    last_updated = data.get('last_updated', 'Data Desconhecida')

    summary = f"# Resumo Analítico de Mercado - {last_updated}\n\n"
    summary += "## 📈 Tendências e Estatísticas do Setor de Avaliação de Personalidade\n\n"
    summary += f"**Última Atualização dos Dados:** {last_updated}\n\n"
    summary += "Os dados de mercado mais recentes reforçam a importância estratégica do ComunicaPro, que atua em um setor de alto crescimento e valorização.\n\n"

    # Estatísticas de Soluções de Avaliação de Personalidade
    pa_data = market_data.get('personality_assessment_solutions', {})
    if pa_data:
        size_2025 = pa_data.get('market_size_2025_usd_billion', 'N/A')
        size_2030 = pa_data.get('market_size_2030_projected_usd_billion', 'N/A')
        cagr = pa_data.get('cagr_2025_2030_percent', 'N/A')
        cagr_source = pa_data.get('cagr_source', 'Fontes Diversas')

        summary += "### Soluções de Avaliação de Personalidade (Personality Assessment Solutions)\n\n"
        summary += f"- **Tamanho do Mercado (2025):** US$ {size_2025} Bilhões\n"
        summary += f"- **Projeção para 2030:** US$ {size_2030} Bilhões\n"
        summary += f"- **Taxa de Crescimento Anual Composta (CAGR):** {cagr}% (Fonte: {cagr_source})\n\n"

    # Tendências Chave
    if trends:
        summary += "## 💡 Tendências Chave do Mercado\n\n"
        summary += "O crescimento do setor é impulsionado por:\n"
        for i, trend in enumerate(trends):
            summary += f"{i+1}. **{trend}**\n"
        summary += "\n"
        summary += "A integração de recursos avançados, como o **Plano de Ação de Processamento Profundo (PAPP)**, alinha o ComunicaPro com a principal tendência de mercado: o uso de IA para análises mais profundas e personalizadas.\n"

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(summary)

    return f"Resumo analítico de mercado gerado com sucesso em {output_path}"

if __name__ == "__main__":
    # Define os caminhos dos arquivos
    data_file = os.path.join(os.path.dirname(__file__), '..', 'research_data', 'market_statistics.json')
    output_file = os.path.join(os.path.dirname(__file__), '..', 'research_findings', f'market_summary_{date.today().strftime("%Y%m%d")}.md')

    # Cria o diretório de saída se não existir
    os.makedirs(os.path.dirname(output_file), exist_ok=True)

    # Gera o resumo
    result = generate_summary(data_file, output_file)
    print(result)
