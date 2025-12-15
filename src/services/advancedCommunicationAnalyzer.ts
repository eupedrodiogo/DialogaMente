/**
 * @file advancedCommunicationAnalyzer.ts
 * @description Serviço avançado de análise de comunicação com integração de IA
 * Combina análise de sentimento, perfil de comunicação e recomendações personalizadas
 * @version 1.0.0
 * @date 15/12/2025
 */

import { analyzeSentiment, analyzeCommunication } from './sentimentAnalysisService';

export interface AdvancedCommunicationProfile {
  userId?: string;
  timestamp: string;
  communicationStyle: 'Visual' | 'Auditivo' | 'Cinestésico' | 'Misto';
  sentimentAnalysis: any;
  communicationMetrics: {
    clarity: number; // 0-100
    assertiveness: number; // 0-100
    empathy: number; // 0-100
    emotionalIntelligence: number; // 0-100
    adaptability: number; // 0-100
  };
  strengths: string[];
  areasForImprovement: string[];
  personalizedRecommendations: string[];
  developmentPath: DevelopmentMilestone[];
  marketInsights: MarketInsight[];
}

export interface DevelopmentMilestone {
  week: number;
  focus: string;
  activities: string[];
  expectedOutcome: string;
  difficulty: 'Baixa' | 'Média' | 'Alta';
}

export interface MarketInsight {
  trend: string;
  relevance: 'Alta' | 'Média' | 'Baixa';
  application: string;
  impact: string;
}

/**
 * Analisa comunicação de forma avançada, combinando múltiplas dimensões
 */
export async function analyzeAdvancedCommunication(
  text: string,
  communicationStyle: 'Visual' | 'Auditivo' | 'Cinestésico' | 'Misto' = 'Misto'
): Promise<AdvancedCommunicationProfile> {
  
  // Análise de sentimento
  const sentimentResult = await analyzeSentiment(text);
  const communicationAnalysis = await analyzeCommunication(text);
  
  // Calcula métricas avançadas
  const metrics = calculateAdvancedMetrics(text, sentimentResult, communicationStyle);
  
  // Identifica forças e áreas de melhoria
  const { strengths, improvements } = identifyStrengthsAndImprovements(metrics, text);
  
  // Gera recomendações personalizadas
  const recommendations = generatePersonalizedRecommendations(
    metrics,
    communicationStyle,
    strengths,
    improvements
  );
  
  // Cria caminho de desenvolvimento
  const developmentPath = createDevelopmentPath(metrics, improvements);
  
  // Integra insights de mercado
  const marketInsights = getMarketInsights(communicationStyle, metrics);
  
  return {
    timestamp: new Date().toISOString(),
    communicationStyle,
    sentimentAnalysis: sentimentResult,
    communicationMetrics: metrics,
    strengths,
    areasForImprovement: improvements,
    personalizedRecommendations: recommendations,
    developmentPath,
    marketInsights
  };
}

/**
 * Calcula métricas avançadas de comunicação
 */
function calculateAdvancedMetrics(
  text: string,
  sentiment: any,
  style: string
): any {
  const words = text.split(/\s+/);
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  // Clareza: baseada em legibilidade e estrutura
  const clarity = calculateClarity(text, words, sentences);
  
  // Assertividade: presença de palavras assertivas
  const assertiveness = calculateAssertiveness(text);
  
  // Empatia: presença de palavras empáticas
  const empathy = calculateEmpathy(text);
  
  // Inteligência emocional: combinação equilibrada
  const emotionalIntelligence = (empathy + assertiveness) / 2;
  
  // Adaptabilidade: capacidade de variar o tom e estilo
  const adaptability = calculateAdaptability(text, style);
  
  return {
    clarity: Math.min(100, clarity),
    assertiveness: Math.min(100, assertiveness),
    empathy: Math.min(100, empathy),
    emotionalIntelligence: Math.min(100, emotionalIntelligence),
    adaptability: Math.min(100, adaptability)
  };
}

/**
 * Calcula score de clareza
 */
function calculateClarity(text: string, words: string[], sentences: string[]): number {
  if (sentences.length === 0 || words.length === 0) return 50;
  
  const avgWordsPerSentence = words.length / sentences.length;
  const avgCharsPerWord = text.length / words.length;
  
  // Ideal: 15-20 palavras por sentença, 4-5 caracteres por palavra
  const sentenceScore = Math.max(0, 100 - Math.abs(avgWordsPerSentence - 17.5) * 5);
  const wordScore = Math.max(0, 100 - Math.abs(avgCharsPerWord - 4.5) * 10);
  
  return (sentenceScore + wordScore) / 2;
}

/**
 * Calcula score de assertividade
 */
function calculateAssertiveness(text: string): number {
  const assertiveWords = [
    'vou', 'farei', 'preciso', 'exijo', 'devo', 'é necessário',
    'deve', 'será', 'é importante', 'é essencial', 'é crucial'
  ];
  
  const lowerText = text.toLowerCase();
  const totalWords = text.split(/\s+/).length;
  const assertiveCount = assertiveWords.filter(w => lowerText.includes(w)).length;
  
  return (assertiveCount / totalWords) * 100;
}

/**
 * Calcula score de empatia
 */
function calculateEmpathy(text: string): number {
  const empathyWords = [
    'entendo', 'compreendo', 'sinto', 'você', 'seu', 'sua',
    'nos', 'nós', 'reconheço', 'valorizo', 'aprecia', 'respeito',
    'considero', 'levo em conta', 'importa'
  ];
  
  const lowerText = text.toLowerCase();
  const totalWords = text.split(/\s+/).length;
  const empathyCount = empathyWords.filter(w => lowerText.includes(w)).length;
  
  return (empathyCount / totalWords) * 100;
}

/**
 * Calcula score de adaptabilidade
 */
function calculateAdaptability(text: string, style: string): number {
  // Verifica presença de diferentes tipos de linguagem
  const visualWords = ['vejo', 'visualizo', 'imagem', 'cores', 'forma', 'aparência'];
  const auditiveWords = ['ouço', 'soa', 'tom', 'ritmo', 'som', 'voz'];
  const kinestheticWords = ['sinto', 'toco', 'movimento', 'ação', 'experiência', 'prática'];
  
  const lowerText = text.toLowerCase();
  const visualCount = visualWords.filter(w => lowerText.includes(w)).length;
  const auditiveCount = auditiveWords.filter(w => lowerText.includes(w)).length;
  const kinestheticCount = kinestheticWords.filter(w => lowerText.includes(w)).length;
  
  // Quanto mais variado, maior a adaptabilidade
  const totalCount = visualCount + auditiveCount + kinestheticCount;
  const diversity = (totalCount > 0) ? 1 : 0;
  
  return diversity * 100;
}

/**
 * Identifica forças e áreas de melhoria
 */
function identifyStrengthsAndImprovements(
  metrics: any,
  text: string
): { strengths: string[]; improvements: string[] } {
  const strengths: string[] = [];
  const improvements: string[] = [];
  
  // Forças
  if (metrics.clarity > 70) {
    strengths.push('Comunicação clara e bem estruturada');
  }
  if (metrics.assertiveness > 60) {
    strengths.push('Comunicação assertiva e direta');
  }
  if (metrics.empathy > 60) {
    strengths.push('Demonstra empatia e compreensão');
  }
  if (metrics.emotionalIntelligence > 70) {
    strengths.push('Inteligência emocional desenvolvida');
  }
  if (metrics.adaptability > 50) {
    strengths.push('Capacidade de adaptar o estilo de comunicação');
  }
  
  // Áreas de melhoria
  if (metrics.clarity < 60) {
    improvements.push('Melhorar clareza e estrutura das mensagens');
  }
  if (metrics.assertiveness < 40) {
    improvements.push('Desenvolver comunicação mais assertiva');
  }
  if (metrics.empathy < 40) {
    improvements.push('Aumentar foco em empatia e compreensão');
  }
  if (metrics.emotionalIntelligence < 60) {
    improvements.push('Desenvolver inteligência emocional');
  }
  if (metrics.adaptability < 30) {
    improvements.push('Expandir repertório de estilos de comunicação');
  }
  
  return { strengths, improvements };
}

/**
 * Gera recomendações personalizadas
 */
function generatePersonalizedRecommendations(
  metrics: any,
  style: string,
  strengths: string[],
  improvements: string[]
): string[] {
  const recommendations: string[] = [];
  
  // Recomendações baseadas no estilo
  if (style === 'Visual') {
    recommendations.push('Use mais recursos visuais em suas comunicações');
    recommendations.push('Crie diagramas e mapas mentais para explicar conceitos');
  } else if (style === 'Auditivo') {
    recommendations.push('Pratique apresentações orais e discussões');
    recommendations.push('Grave suas ideias em áudio para melhorar a fluência');
  } else if (style === 'Cinestésico') {
    recommendations.push('Incorpore exemplos práticos em suas comunicações');
    recommendations.push('Pratique role-playing para desenvolver habilidades');
  }
  
  // Recomendações baseadas em métricas
  if (metrics.clarity < 70) {
    recommendations.push('Organize melhor seus pensamentos antes de comunicar');
    recommendations.push('Use frases mais concisas e diretas');
  }
  if (metrics.assertiveness < 60) {
    recommendations.push('Pratique usar mais verbos de ação em suas mensagens');
    recommendations.push('Desenvolva confiança ao expressar suas opiniões');
  }
  if (metrics.empathy < 60) {
    recommendations.push('Pratique ouvir ativamente antes de responder');
    recommendations.push('Considere as perspectivas alheias em suas comunicações');
  }
  
  return recommendations;
}

/**
 * Cria caminho de desenvolvimento personalizado
 */
function createDevelopmentPath(metrics: any, improvements: string[]): DevelopmentMilestone[] {
  const path: DevelopmentMilestone[] = [];
  
  // Semana 1: Fundamentos
  path.push({
    week: 1,
    focus: 'Consciência e Diagnóstico',
    activities: [
      'Registre suas comunicações diárias',
      'Identifique padrões de comunicação',
      'Reflita sobre pontos fortes e fracos'
    ],
    expectedOutcome: 'Autoconhecimento aprimorado',
    difficulty: 'Baixa'
  });
  
  // Semana 2-3: Desenvolvimento de Habilidades
  if (metrics.clarity < 70) {
    path.push({
      week: 2,
      focus: 'Melhorar Clareza',
      activities: [
        'Pratique escrever mensagens concisas',
        'Revise e edite suas comunicações',
        'Peça feedback sobre clareza'
      ],
      expectedOutcome: 'Comunicações mais claras',
      difficulty: 'Média'
    });
  }
  
  // Semana 4-5: Prática Avançada
  path.push({
    week: 4,
    focus: 'Integração de Habilidades',
    activities: [
      'Aplique novas habilidades em situações reais',
      'Monitore o impacto de suas comunicações',
      'Ajuste estratégias conforme necessário'
    ],
    expectedOutcome: 'Melhorias mensuráveis',
    difficulty: 'Média'
  });
  
  // Semana 6: Consolidação
  path.push({
    week: 6,
    focus: 'Consolidação e Planejamento Futuro',
    activities: [
      'Revise o progresso realizado',
      'Identifique próximos passos',
      'Estabeleça novas metas'
    ],
    expectedOutcome: 'Plano de desenvolvimento contínuo',
    difficulty: 'Baixa'
  });
  
  return path;
}

/**
 * Integra insights de mercado
 */
function getMarketInsights(style: string, metrics: any): MarketInsight[] {
  const insights: MarketInsight[] = [];
  
  // Insights baseados em tendências de mercado
  insights.push({
    trend: 'Inteligência Artificial como Parceira',
    relevance: 'Alta',
    application: 'Use ferramentas de IA para melhorar sua comunicação',
    impact: 'Aumento de 40%+ em efetividade'
  });
  
  insights.push({
    trend: 'Comunicação Omnichannel',
    relevance: 'Alta',
    application: 'Adapte sua comunicação para múltiplos canais',
    impact: 'Maior alcance e engajamento'
  });
  
  if (metrics.empathy > 60) {
    insights.push({
      trend: 'Humanização e Propósito',
      relevance: 'Alta',
      application: 'Mantenha o foco em humanização em suas comunicações',
      impact: 'Construção de relacionamentos mais fortes'
    });
  }
  
  insights.push({
    trend: 'Qualidade sobre Quantidade',
    relevance: 'Alta',
    application: 'Priorize comunicações de alta qualidade',
    impact: 'Maior impacto com menos esforço'
  });
  
  return insights;
}

/**
 * Exporta perfil de comunicação avançado em JSON
 */
export function exportAdvancedProfile(profile: AdvancedCommunicationProfile): string {
  return JSON.stringify(profile, null, 2);
}

/**
 * Compara perfis de comunicação ao longo do tempo
 */
export function compareProfiles(
  profile1: AdvancedCommunicationProfile,
  profile2: AdvancedCommunicationProfile
): any {
  const comparison = {
    timestamp1: profile1.timestamp,
    timestamp2: profile2.timestamp,
    improvements: {} as any,
    regressions: {} as any
  };
  
  // Compara métricas
  Object.keys(profile1.communicationMetrics).forEach(key => {
    const value1 = profile1.communicationMetrics[key as keyof typeof profile1.communicationMetrics];
    const value2 = profile2.communicationMetrics[key as keyof typeof profile2.communicationMetrics];
    const diff = (value2 as number) - (value1 as number);
    
    if (diff > 0) {
      comparison.improvements[key] = `+${diff.toFixed(2)}`;
    } else if (diff < 0) {
      comparison.regressions[key] = `${diff.toFixed(2)}`;
    }
  });
  
  return comparison;
}
