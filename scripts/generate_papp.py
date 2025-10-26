#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para gerar o Plano de Ação de Processamento Profundo (PAPP)
usando a API OpenAI (LLM).

Este script simula a lógica que seria executada em uma Edge Function do Supabase
para gerar conteúdo personalizado com base no perfil de comunicação do usuário.
"""

import os
import json
from openai import OpenAI

# Configuração da API (A chave é carregada automaticamente do ambiente)
try:
    client = OpenAI()
except Exception as e:
    print(f"Erro ao inicializar o cliente OpenAI: {e}")
    # Fallback para simulação se a chave não estiver disponível
    class MockClient:
        class MockChat:
            class MockCompletions:
                def create(self, **kwargs):
                    return {
                        "choices": [
                            {
                                "message": {
                                    "content": json.dumps({
                                        "title": f"Plano de Ação (Simulado) para Perfil {kwargs['messages'][1]['content'].split('Perfil: ')[1].split(',')[0]}",
                                        "introduction": "Este é um plano de ação simulado. Para um plano real, configure a chave da API OpenAI.",
                                        "days": [
                                            {"day": 1, "theme": "Foco na Atenção", "task": "Simulação: Revise anotações usando cores e diagramas (Visual)."},
                                            {"day": 2, "theme": "Processamento Auditivo", "task": "Simulação: Transforme o conteúdo do dia 1 em um podcast curto (Auditivo)."},
                                            {"day": 3, "theme": "Aprendizagem Ativa", "task": "Simulação: Construa um modelo físico ou faça um role-play (Cinestésico)."},
                                            {"day": 4, "theme": "Revisão e Conexão", "task": "Simulação: Escreva um resumo à mão (Leitura/Escrita)."},
                                            {"day": 5, "theme": "Feedback e Ajuste", "task": "Simulação: Peça a um amigo para testar seu conhecimento (Interpessoal)."},
                                            {"day": 6, "theme": "Processamento Profundo", "task": "Simulação: Crie uma metáfora complexa para o tema (Elaboração)."},
                                            {"day": 7, "theme": "Consolidação", "task": "Simulação: Medite sobre o que aprendeu, focando na emoção (Emocional/Cognitivo)."}
                                        ]
                                    })
                                }
                            }
                        ]
                    }
            def __init__(self):
                self.completions = self.MockCompletions()
        def __init__(self):
            self.chat = self.MockChat()
    client = MockClient()

def generate_papp(profile_data: dict) -> dict:
    """
    Gera o Plano de Ação de Processamento Profundo (PAPP) usando um LLM.

    Args:
        profile_data: Dicionário com os dados do perfil do usuário.
                      Ex: {"visual": 45, "auditivo": 30, "cinestesico": 25, "objetivo": "Aprender a programar em Python"}

    Returns:
        Um dicionário representando o PAPP gerado.
    """
    try:
        # Extrair dados do perfil
        visual = profile_data.get("visual", 0)
        auditivo = profile_data.get("auditivo", 0)
        cinestesico = profile_data.get("cinestesico", 0)
        objetivo = profile_data.get("objetivo", "melhorar a comunicação interpessoal")

        # Construir o prompt para o LLM
        system_prompt = (
            "Você é um Neurocientista Cognitivo e Coach de Aprendizagem. Sua tarefa é criar um "
            "Plano de Ação de Processamento Profundo (PAPP) de 7 dias. O plano deve ser baseado "
            "no perfil de comunicação VAK do usuário e em seu objetivo. O PAPP deve focar em "
            "técnicas de aprendizado ativo e processamento profundo (como elaboração, auto-explicação, "
            "e prática de recuperação), e não apenas no estilo preferido. "
            "O resultado DEVE ser um objeto JSON válido no formato: "
            "{'title': str, 'introduction': str, 'days': [{'day': int, 'theme': str, 'task': str}, ...]}. "
            "A tarefa deve ser prática e acionável."
        )

        user_prompt = (
            f"Crie um PAPP de 7 dias. Perfil: Visual: {visual}%, Auditivo: {auditivo}%, Cinestésico: {cinestesico}%. "
            f"Objetivo do usuário: '{objetivo}'. "
            "Foque em aplicar o processamento profundo para atingir o objetivo, usando as modalidades como ferramentas de engajamento."
        )

        print(f"Enviando prompt para o LLM...")
        
        # Chamada à API
        response = client.chat.completions.create(
            model="gemini-2.5-flash", # Modelo otimizado para tarefas de geração
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            response_format={"type": "json_object"}
        )

        # Processar a resposta
        content = response.choices[0].message.content
        
        # Tenta limpar e carregar o JSON. O LLM pode ter truncado a resposta.
        try:
            # Tenta carregar diretamente (ideal)
            papp_result = json.loads(content)
        except json.JSONDecodeError:
            # Tenta limpar o bloco de código markdown
            if content.startswith("```json"):
                content = content[7:]
            if content.endswith("```"):
                content = content[:-3]
            
            # Tenta carregar novamente
            papp_result = json.loads(content.strip())
        
        return papp_result

    except json.JSONDecodeError:
        print("Erro: A resposta do LLM não é um JSON válido.")
        return {"error": "JSON Decode Error"}
    except Exception as e:
        print(f"Erro ao gerar PAPP: {e}")
        return {"error": str(e)}

if __name__ == "__main__":
    # Exemplo de dados de perfil para teste
    test_profile = {
        "visual": 60,
        "auditivo": 20,
        "cinestesico": 20,
        "objetivo": "Aprender a usar o framework React para desenvolver interfaces web."
    }

    print("--- Geração de PAPP Iniciada ---")
    papp = generate_papp(test_profile)
    print("--- Resultado do PAPP ---")
    print(json.dumps(papp, indent=4, ensure_ascii=False))

    # Salvar o resultado em um arquivo para simular a saída da Edge Function
    with open("papp_generated.json", "w", encoding="utf-8") as f:
        json.dump(papp, f, indent=4, ensure_ascii=False)
    print("\nResultado salvo em papp_generated.json")
