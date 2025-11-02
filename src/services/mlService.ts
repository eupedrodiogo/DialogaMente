// src/services/mlService.ts

/**
 * Simula a integração com um serviço de Machine Learning para prever tendências.
 * Em um ambiente de produção, esta função faria uma chamada a uma API de backend
 * (e.g., Supabase Edge Function ou um servidor Python/Flask) que executa o modelo de ML.
 * 
 * O modelo de ML (simulado aqui) prevê a tendência de crescimento de um perfil
 * de comunicação específico (e.g., Visual) nos próximos 30 dias.
 */

interface PredictionData {
  date: string; // Formato YYYY-MM-DD
  predictedCount: number;
}

interface PredictionResult {
  profile: "Visual" | "Auditivo" | "Cinestésico";
  trend: "Crescimento" | "Estabilidade" | "Declínio";
  confidence: number; // 0.0 a 1.0
  data: PredictionData[];
}

// Dados simulados de previsão
const mockPredictionData: PredictionResult[] = [
  {
    profile: "Visual",
    trend: "Crescimento",
    confidence: 0.85,
    data: [
      { date: "2025-11-03", predictedCount: 150 },
      { date: "2025-11-04", predictedCount: 155 },
      { date: "2025-11-05", predictedCount: 160 },
      { date: "2025-11-06", predictedCount: 165 },
      { date: "2025-11-07", predictedCount: 170 },
    ],
  },
  {
    profile: "Auditivo",
    trend: "Estabilidade",
    confidence: 0.70,
    data: [
      { date: "2025-11-03", predictedCount: 120 },
      { date: "2025-11-04", predictedCount: 121 },
      { date: "2025-11-05", predictedCount: 120 },
      { date: "2025-11-06", predictedCount: 122 },
      { date: "2025-11-07", predictedCount: 123 },
    ],
  },
  {
    profile: "Cinestésico",
    trend: "Declínio",
    confidence: 0.60,
    data: [
      { date: "2025-11-03", predictedCount: 90 },
      { date: "2025-11-04", predictedCount: 88 },
      { date: "2025-11-05", predictedCount: 85 },
      { date: "2025-11-06", predictedCount: 83 },
      { date: "2025-11-07", predictedCount: 80 },
    ],
  },
];

/**
 * Busca as previsões de tendências de perfis de comunicação.
 * @returns Uma promessa que resolve para um array de PredictionResult.
 */
export async function fetchProfilePredictions(): Promise<PredictionResult[]> {
  // Simula um atraso de rede
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Em produção, a chamada seria:
  // const { data, error } = await supabase.functions.invoke('predict-trends');
  
  return mockPredictionData;
}

/**
 * Função auxiliar para formatar os dados para o gráfico.
 * @param data Dados brutos da previsão.
 * @returns Dados formatados para o gráfico de linha.
 */
export function formatPredictionDataForChart(data: PredictionData[]) {
  return data.map(item => ({
    name: new Date(item.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
    "Previsão": item.predictedCount,
  }));
}

export type { PredictionResult, PredictionData };
