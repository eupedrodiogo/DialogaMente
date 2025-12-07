import sys
import os
import json
from datetime import datetime

# Adiciona o diretório 'scripts' ao path para importar sentiment_analysis
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sentiment_analysis import SentimentAnalyzer

def run_analysis_and_save(text_to_analyze: str, output_dir: str = "../research_findings"):
    """
    Executa a análise de sentimento em um texto e salva o resultado em um arquivo JSON.
    """
    
    # Garante que o diretório de saída exista
    os.makedirs(output_dir, exist_ok=True)
    
    analyzer = SentimentAnalyzer()
    
    print(f"Iniciando análise de sentimento para o texto: '{text_to_analyze[:50]}...'")
    
    # Executa a análise
    result = analyzer.analyze(text_to_analyze)
    
    # Define o nome do arquivo
    timestamp_str = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"sentiment_analysis_result_{timestamp_str}.json"
    output_path = os.path.join(output_dir, filename)
    
    # Salva o resultado
    try:
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(result, f, indent=4, ensure_ascii=False)
        print(f"Análise concluída e salva em: {output_path}")
        return output_path
    except Exception as e:
        print(f"Erro ao salvar o arquivo: {e}")
        return None

if __name__ == "__main__":
    # Texto de exemplo que simula uma nova informação ou dado
    new_data_text = "A integração da Inteligência Artificial nas estratégias de comunicação corporativa não é mais uma opção, mas uma necessidade urgente. Empresas que adotam a IA para personalizar mensagens e automatizar o atendimento ao cliente estão vendo um aumento significativo na satisfação e retenção. No entanto, a preocupação com a ética e a transparência algorítmica continua sendo um ponto de atenção crucial para manter a confiança do público."
    
    # O diretório de saída é ../research_findings, que é DialogaMente/research_findings
    run_analysis_and_save(new_data_text)
