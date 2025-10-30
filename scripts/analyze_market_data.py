import json
import os

def analyze_market_data(input_file, output_file):
    """
    Lê dados de mercado de um arquivo JSON, processa e gera um resumo analítico em Markdown.
    Simula o serviço de análise de dados para o Dashboard de Estatísticas em Tempo Real.
    """
    try:
        # 1. Ler o arquivo JSON
        with open(input_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except FileNotFoundError:
        print(f"Erro: Arquivo de entrada não encontrado em {input_file}")
        return
    except json.JSONDecodeError:
        print(f"Erro: Falha ao decodificar JSON do arquivo {input_file}")
        return

    # 2. Processar os dados e formatar o resumo
    summary = f"# Análise de Mercado - {data.get('date', 'Data Desconhecida')}\n\n"
    summary += "## 📈 Crescimento do Setor de Comunicação e Avaliação\n\n"
    summary += "Os dados de mercado confirmam o alto potencial de crescimento do setor, com taxas anuais compostas (CAGR) robustas em todas as áreas-chave:\n\n"
    
    # Tabela de Insights de Mercado
    market_data = data.get('market_insights', {})
    if market_data:
        summary += "| Mercado | Tamanho (2024, USD Bilhões) | CAGR (%) | Tamanho Projetado (USD Bilhões) |\n"
        summary += "| :--- | :--- | :--- | :--- |\n"
        for market, metrics in market_data.items():
            title = metrics.get('title', 'N/A')
            size_2024 = metrics.get('size_2024_billion_usd', 'N/A')
            cagr = metrics.get('cagr_percent', 'N/A')
            size_proj = metrics.get('size_2031_billion_usd', metrics.get('size_2033_billion_usd', 'N/A'))
            
            # Formatação da projeção
            if size_proj != 'N/A':
                if 'size_2031_billion_usd' in metrics:
                    proj_text = f"{size_proj} (até 2031)"
                elif 'size_2033_billion_usd' in metrics:
                    proj_text = f"{size_proj} (até 2033)"
                else:
                    proj_text = size_proj
            else:
                proj_text = 'N/A'
                
            summary += f"| {title} | {size_2024} | {cagr} | {proj_text} |\n"
        summary += "\n"

    # Tendências Chave
    trends = data.get('trends', [])
    if trends:
        summary += "## 💡 Tendências Chave e Foco Estratégico\n\n"
        summary += "A análise de mercado aponta para as seguintes tendências que devem guiar o desenvolvimento do ComunicaPro:\n"
        for i, trend in enumerate(trends, 1):
            summary += f"{i}. **{trend}**\n"
        summary += "\n"
    
    # Foco em Recursos Avançados
    advanced_features = data.get('advanced_feature_focus', [])
    if advanced_features:
        summary += "## 🚀 Próximos Recursos Avançados (Alinhamento com o Mercado)\n\n"
        summary += "Para manter a competitividade, os esforços de desenvolvimento devem se concentrar em:\n"
        for feature in advanced_features:
            summary += f"- {feature}\n"
        summary += "\n"

    # 3. Escrever o resultado no arquivo de saída
    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(summary)
        print(f"Sucesso: Análise de mercado gerada em {output_file}")
    except Exception as e:
        print(f"Erro ao escrever o arquivo de saída: {e}")

if __name__ == "__main__":
    # Define os caminhos relativos ao diretório do script
    base_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.join(base_dir, '..')
    
    input_file_path = os.path.join(project_root, 'research_data', 'market_insights_30oct2025.json')
    output_file_path = os.path.join(project_root, 'research_data', 'market_analysis_30oct2025.md')
    
    analyze_market_data(input_file_path, output_file_path)
