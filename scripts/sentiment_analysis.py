#!/usr/bin/env python3
"""
Módulo de Análise de Sentimento para ComunicaPro
Utiliza OpenAI API para análise avançada de sentimento em textos
Data: 29/10/2025
Tendência: Inteligência Artificial na Comunicação
"""

import os
import json
from typing import Dict, List, Optional
from datetime import datetime
from openai import OpenAI


class SentimentAnalyzer:
    """
    Analisador de sentimento usando OpenAI GPT para análise profunda.
    Fornece classificação de sentimento, intensidade e insights.
    """
    
    def __init__(self):
        """Inicializa o cliente OpenAI com credenciais do ambiente."""
        self.client = OpenAI()
        self.model = "gpt-4.1-mini"
        
    def analyze(self, text: str) -> Dict:
        """
        Analisa o sentimento de um texto.
        
        Args:
            text: Texto a ser analisado
            
        Returns:
            Dict contendo:
                - sentiment: Classificação (positive, neutral, negative)
                - score: Pontuação de -1 a 1
                - intensity: Intensidade (low, medium, high)
                - keywords: Palavras-chave identificadas
                - insights: Análise detalhada
        """
        
        prompt = f"""Analise o sentimento do seguinte texto em português:

"{text}"

Forneça uma resposta em JSON com a seguinte estrutura:
{{
    "sentiment": "positive" | "neutral" | "negative",
    "score": <número entre -1 e 1>,
    "intensity": "low" | "medium" | "high",
    "keywords": [<lista de palavras-chave>],
    "insights": "<análise detalhada em 1-2 frases>",
    "tone": "<tom detectado: formal, informal, agressivo, amigável, etc>",
    "confidence": <número entre 0 e 1>
}}"""

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": "Você é um especialista em análise de sentimento e processamento de linguagem natural. Sempre responda em JSON válido."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.3,
                max_tokens=500
            )
            
            # Extrair a resposta JSON
            response_text = response.choices[0].message.content
            result = json.loads(response_text)
            
            # Adicionar metadados
            result["timestamp"] = datetime.now().isoformat()
            result["text_length"] = len(text)
            
            return result
            
        except json.JSONDecodeError:
            return {
                "error": "Falha ao processar resposta JSON",
                "sentiment": "unknown",
                "timestamp": datetime.now().isoformat()
            }
        except Exception as e:
            return {
                "error": str(e),
                "sentiment": "unknown",
                "timestamp": datetime.now().isoformat()
            }
    
    def batch_analyze(self, texts: List[str]) -> List[Dict]:
        """
        Analisa múltiplos textos.
        
        Args:
            texts: Lista de textos a analisar
            
        Returns:
            Lista de resultados de análise
        """
        results = []
        for text in texts:
            results.append(self.analyze(text))
        return results
    
    def get_summary_statistics(self, results: List[Dict]) -> Dict:
        """
        Calcula estatísticas agregadas de múltiplas análises.
        
        Args:
            results: Lista de resultados de análise
            
        Returns:
            Dict com estatísticas agregadas
        """
        if not results:
            return {}
        
        sentiments = [r.get("sentiment") for r in results if "sentiment" in r]
        scores = [r.get("score", 0) for r in results if "score" in r]
        
        positive_count = sentiments.count("positive")
        neutral_count = sentiments.count("neutral")
        negative_count = sentiments.count("negative")
        
        return {
            "total_analyzed": len(results),
            "positive_count": positive_count,
            "neutral_count": neutral_count,
            "negative_count": negative_count,
            "positive_percentage": (positive_count / len(results) * 100) if results else 0,
            "average_score": sum(scores) / len(scores) if scores else 0,
            "timestamp": datetime.now().isoformat()
        }


def main():
    """Função principal para teste do módulo."""
    analyzer = SentimentAnalyzer()
    
    # Textos de exemplo para teste
    test_texts = [
        "Adorei o produto! Superou minhas expectativas e o atendimento foi excelente.",
        "O produto é ok, nada de especial. Funciona como esperado.",
        "Péssima experiência. O produto chegou com defeito e o suporte não responde."
    ]
    
    print("=" * 60)
    print("ComunicaPro - Análise de Sentimento")
    print("=" * 60)
    print()
    
    # Analisar textos individuais
    results = []
    for text in test_texts:
        print(f"Analisando: {text[:50]}...")
        result = analyzer.analyze(text)
        results.append(result)
        print(f"  Sentimento: {result.get('sentiment', 'N/A')}")
        print(f"  Score: {result.get('score', 'N/A')}")
        print(f"  Intensidade: {result.get('intensity', 'N/A')}")
        print()
    
    # Estatísticas agregadas
    stats = analyzer.get_summary_statistics(results)
    print("=" * 60)
    print("Estatísticas Agregadas:")
    print("=" * 60)
    print(json.dumps(stats, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
