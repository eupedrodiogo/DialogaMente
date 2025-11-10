// DialogaMente/src/types/research.d.ts

export interface Insight {
  title: string;
  source: string;
  date: string;
  summary: string;
  keywords: string[];
}

export interface DailyTrends {
  last_updated: string;
  neuroscience_insights: Insight[];
  communication_trends: Insight[];
}

// O arquivo daily_trends.json será importado diretamente no código.
// Exemplo de uso:
// import dailyTrends from '../../research_data/daily_trends.json';
// const data: DailyTrends = dailyTrends as DailyTrends;
