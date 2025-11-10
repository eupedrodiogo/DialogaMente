// DialogaMente/src/lib/dailyTrends.ts

import { DailyTrends } from '../types/research.d';
// Importa o arquivo JSON gerado pelo script de atualização
// O caminho é relativo ao diretório 'src'
import dailyTrendsData from '../../research_data/daily_trends.json';

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
