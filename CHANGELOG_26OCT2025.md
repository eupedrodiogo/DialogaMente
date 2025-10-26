# CHANGELOG - 26 de Outubro de 2025

## v2.2.1 - Atualização Diária: Neurociência e IA

Esta atualização foca em aprimorar a base científica do projeto e introduzir a infraestrutura para um recurso avançado de Inteligência Artificial.

### ✨ Novidades

*   **PAPP IA-Powered:** O **Plano de Ação de Processamento Profundo (PAPP)** foi atualizado para ser gerado por um Large Language Model (LLM) externo (via API, simulado em `scripts/generate_papp.py`). Isso permite recomendações de estratégias de aprendizado ativas e personalizadas com base no perfil de comunicação e objetivo do usuário.
*   **Base Científica Atualizada:** O arquivo de base científica (`src/lib/scientificBasis.ts`) foi revisado para:
    *   Incluir o conceito do modelo **VARK** (Visual, Auditivo, Leitura/Escrita, Cinestésico) para maior precisão no contexto digital.
    *   Reforçar a importância do **Processamento Profundo (Deep Processing)** em detrimento dos 'estilos de aprendizagem' fixos, alinhado com as descobertas mais recentes da Neurociência Cognitiva.
*   **Script de Geração de PAPP:** Adicionado um script de exemplo (`scripts/generate_papp.py`) para demonstrar a integração futura com a API de LLM (OpenAI/Gemini), simulando a lógica de uma Edge Function do Supabase.

### 🐛 Correções e Melhorias

*   **Documentação:** Atualização do `README.md` para refletir a nova versão (`v2.2.1`) e o aprimoramento do PAPP com IA.
*   **Disclaimer Científico:** Revisão do disclaimer no código (`src/lib/scientificBasis.ts`) para maior clareza sobre o reenquadramento do VAK/VARK como **Preferência de Comunicação**.

