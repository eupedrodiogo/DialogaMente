// DialogaMente/src/lib/dailyTrends.ts

import { DailyTrends } from '../types/research.d';
// Importa o arquivo JSON gerado pelo script de atualização
// O caminho é relativo ao diretório 'src'
import dailyTrendsData from '../../research_data/daily_trends.json';

// Função para simular a busca do arquivo Markdown
// Em um ambiente de produção, isso seria uma chamada de API para um servidor
// ou um endpoint de CDN que serve o arquivo estático.
export async function getDailySummary(): Promise<string> {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const dateStr = `${year}${month}${day}`;
  
  // O caminho é relativo ao diretório 'public' ou um endpoint acessível
  // Vamos simular a leitura do arquivo gerado no research_findings
  // Como estamos no lado do cliente (React), vamos simular a busca de um arquivo estático
  // que seria copiado para a pasta 'public' ou 'docs' no build.
  
  // Para o propósito do sandbox, vamos simular o conteúdo que seria retornado
  // por uma requisição fetch.
  
  // Conteúdo do arquivo gerado: daily_summary_20251111.md
  const mockSummary = `# Resumo Diário de Tendências (2025-11-11)

Este relatório consolida as principais tendências de comunicação e percepção identificadas na análise diária de dados.

## Aumento na Preferência Cinestésica em Comunicação Digital (Cinestésico)
**Métrica Chave:** Engajamento em Conteúdo Interativo
**Valor:** 0.05 aumento percentual
**Descrição:** Observado um crescimento de 5% no engajamento com conteúdo que exige interação física ou motora (ex: quizzes, simulações, realidade aumentada) em plataformas de comunicação profissional.

## Demanda por Relatórios Visuais de Desempenho (Visual)
**Métrica Chave:** Buscas por 'Dashboard de Comunicação'
**Valor:** 0.02 aumento percentual
**Descrição:** Pequeno aumento na busca por ferramentas que transformam dados de comunicação em gráficos e visualizações, indicando uma preferência por relatórios visuais claros.

## Eficácia de Podcasts e Áudio-aulas (Auditivo)
**Métrica Chave:** Taxa de Conclusão de Áudio-aulas
**Valor:** 0.85 taxa de conclusão
**Descrição:** A taxa de conclusão de módulos de treinamento baseados em áudio permanece alta (85%), reforçando a eficácia da modalidade auditiva para aprendizado contínuo.

---

*Relatório gerado automaticamente pelo \`daily_update.py\`.*`;

  // Em um cenário real, seria:
  // const response = await fetch(\`/research_findings/daily_summary_${dateStr}.md\`);
  // if (!response.ok) throw new Error('Falha ao buscar resumo diário');
  // return response.text();
  
  return Promise.resolve(mockSummary);
}

/**
 * Retorna os dados de tendências diárias de pesquisa.
 * @returns Os dados de tendências diárias tipados.
 */
export function getDailyTrends(): DailyTrends {
  // Força a tipagem do JSON importado
  return dailyTrendsData as DailyTrends;
}

/**
 * Retorna uma lista de palavras-chave de tendências para alimentar o LLM ou o sistema de recomendações.
 * @returns Um array de strings com as palavras-chave únicas.
 */
export function getTrendKeywords(): string[] {
  const trends = getDailyTrends();
  const keywords = new Set<string>();

  trends.neuroscience_insights.forEach(insight => {
    insight.keywords.forEach(keyword => keywords.add(keyword));
  });

  trends.communication_trends.forEach(trend => {
    trend.keywords.forEach(keyword => keywords.add(keyword));
  });

  return Array.from(keywords);
}

// Exemplo de como usar no PAPP ou Recomendações:
/*
const keywords = getTrendKeywords().join(', ');
const prompt = `Gere um PAPP, considerando as seguintes tendências: ${keywords}`;
*/
