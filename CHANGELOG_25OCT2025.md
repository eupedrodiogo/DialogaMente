# Changelog - 25 de Outubro de 2025

## Versão 2.2.0 - Deep Processing Update

Esta atualização foca em trazer o projeto para o estado da arte da ciência cognitiva, distanciando-o do mito do "Estilo de Aprendizagem" e introduzindo um recurso avançado de inteligência artificial para otimizar a retenção de informação.

### ✨ Novas Funcionalidades

- **Plano de Ação de Processamento Profundo (PAPP):**
  - Novo componente `PAPPActionPlan.tsx` integrado à página de resultados (`/results`).
  - Recurso **IA-powered** (simulado via Supabase Edge Function) que gera um plano de 3 passos para o usuário aplicar sua **Preferência de Comunicação (VAK)** em estratégias de **Processamento Profundo (Deep Processing)**, a chave científica para a memorização de longo prazo.

### 🔬 Atualizações Científicas e de Dados

- **Revisão da Base Científica:** O arquivo `src/lib/scientificBasis.ts` foi completamente atualizado.
  - Incorporação da crítica científica de 2025 (Ref. Hattie & O'Leary) ao modelo VAK como "Estilo de Aprendizagem" fixo.
  - O foco do projeto é agora explicitamente no **Processamento Profundo** e em como a preferência VAK pode ser usada para a **codificação inicial** da informação, não para o aprendizado em si.
- **Atualização de Dados:** Versão do projeto atualizada para `2.2.0` no `package.json`.

### 🛠️ Melhorias e Refatoração

- **Integração de IA:** Estrutura pronta para integrar com Supabase Edge Functions e APIs de LLM (OpenAI/Gemini) para a geração de conteúdo dinâmico do PAPP.
- **Refatoração de Tipos:** Ajustes no `Results.tsx` para melhor tipagem e integração com o novo componente.
- **Documentação:** `README.md` atualizado para refletir a nova versão e o novo recurso PAPP.
