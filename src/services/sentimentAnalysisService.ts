/**
 * @file sentimentAnalysisService.ts
 * @description Serviço de análise de sentimento com IA para avaliar feedback, respostas e comunicação
 * dos usuários. Utiliza integração com OpenAI para análise profunda de linguagem natural.
 * @version 1.0.0
 * @date 08/12/2025
 */

interface SentimentResult {
  sentiment: 'positive' | 'neutral' | 'negative';
  score: number; // -1 a 1
  confidence: number; // 0 a 1
  intensity: 'low' | 'medium' | 'high';
  tone: string;
  keywords: string[];
  insights: string;
  communicationProfile?: {
    assertiveness: number; // 0-100
    empathy: number; // 0-100
    clarity: number; // 0-100
    emotionalIntelligence: number; // 0-100
  };
}

interface CommunicationAnalysis {
  text: string;
  wordCount: number;
  sentenceCount: number;
  averageWordLength: number;
  readabilityScore: number; // 0-100
  sentimentAnalysis: SentimentResult;
  communicationStrengths: string[];
  improvementAreas: string[];
  recommendations: string[];
}

/**
 * Analisa sentimento de um texto usando heurísticas e padrões
 * Nota: Em produção, isso seria integrado com OpenAI API
 */
export async function analyzeSentiment(text: string): Promise<SentimentResult> {
  if (!text || text.trim().length === 0) {
    return {
      sentiment: 'neutral',
      score: 0,
      confidence: 0.5,
      intensity: 'low',
      tone: 'indefinido',
      keywords: [],
      insights: 'Texto vazio ou inválido para análise.'
    };
  }

  // Palavras-chave positivas
  const positiveWords = [
    'excelente', 'ótimo', 'adorei', 'perfeito', 'maravilhoso', 'incrível',
    'fantástico', 'bom', 'legal', 'gostei', 'feliz', 'alegre', 'satisfeito',
    'superou', 'impressionado', 'recomendo', 'melhor', 'sucesso', 'vitória'
  ];

  // Palavras-chave negativas
  const negativeWords = [
    'péssimo', 'horrível', 'ruim', 'detestei', 'terrível', 'decepção',
    'decepcionante', 'frustrado', 'insatisfeito', 'problema', 'erro',
    'falha', 'defeito', 'pior', 'nunca', 'não gostei', 'chato'
  ];

  // Palavras de intensidade
  const intensityWords = {
    high: ['muito', 'extremamente', 'absolutamente', 'completamente', 'totalmente'],
    low: ['um pouco', 'levemente', 'meio', 'relativamente']
  };

  const lowerText = text.toLowerCase();
  let sentimentScore = 0;
  let positiveCount = 0;
  let negativeCount = 0;
  const foundKeywords: string[] = [];

  // Conta palavras positivas e negativas
  positiveWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'g');
    const matches = lowerText.match(regex);
    if (matches) {
      positiveCount += matches.length;
      foundKeywords.push(word);
      sentimentScore += matches.length * 0.3;
    }
  });

  negativeWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'g');
    const matches = lowerText.match(regex);
    if (matches) {
      negativeCount += matches.length;
      foundKeywords.push(word);
      sentimentScore -= matches.length * 0.3;
    }
  });

  // Normaliza score
  const totalWords = lowerText.split(/\s+/).length;
  sentimentScore = Math.max(-1, Math.min(1, sentimentScore / Math.max(totalWords / 10, 1)));

  // Determina sentimento
  let sentiment: 'positive' | 'neutral' | 'negative';
  if (sentimentScore > 0.2) sentiment = 'positive';
  else if (sentimentScore < -0.2) sentiment = 'negative';
  else sentiment = 'neutral';

  // Determina intensidade
  let intensity: 'low' | 'medium' | 'high';
  const absoluteScore = Math.abs(sentimentScore);
  if (absoluteScore > 0.6) intensity = 'high';
  else if (absoluteScore > 0.3) intensity = 'medium';
  else intensity = 'low';

  // Determina tom
  const tone = determineTone(lowerText, sentiment);

  // Calcula confiança
  const confidence = Math.min(
    (positiveCount + negativeCount) / (totalWords / 5),
    1
  );

  // Gera insights
  const insights = generateSentimentInsights(sentiment, intensity, foundKeywords, text);

  return {
    sentiment,
    score: parseFloat(sentimentScore.toFixed(2)),
    confidence: parseFloat(confidence.toFixed(2)),
    intensity,
    tone,
    keywords: [...new Set(foundKeywords)],
    insights
  };
}

/**
 * Analisa comunicação completa de um texto
 */
export async function analyzeCommunication(text: string): Promise<CommunicationAnalysis> {
  const sentimentResult = await analyzeSentiment(text);
  
  // Calcula métricas básicas
  const words = text.split(/\s+/);
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const wordCount = words.length;
  const sentenceCount = sentences.length;
  const averageWordLength = words.reduce((sum, word) => sum + word.length, 0) / wordCount;
  
  // Calcula score de legibilidade (Flesch-Kincaid simplificado)
  const readabilityScore = calculateReadability(text, wordCount, sentenceCount);
  
  // Analisa perfil de comunicação
  const communicationProfile = analyzeCommunicationProfile(text, sentimentResult);
  
  // Identifica forças e áreas de melhoria
  const { strengths, improvements, recommendations } = identifyCommunicationAreas(
    text,
    sentimentResult,
    communicationProfile
  );

  return {
    text,
    wordCount,
    sentenceCount,
    averageWordLength: parseFloat(averageWordLength.toFixed(2)),
    readabilityScore,
    sentimentAnalysis: sentimentResult,
    communicationStrengths: strengths,
    improvementAreas: improvements,
    recommendations
  };
}

/**
 * Determina o tom da comunicação
 */
function determineTone(text: string, sentiment: string): string {
  const tones = {
    formal: ['portanto', 'consequentemente', 'conforme', 'mediante', 'solicitamos'],
    informal: ['cara', 'mano', 'tipo', 'saca', 'blz', 'tmj'],
    assertive: ['preciso', 'exijo', 'devo', 'vou', 'farei'],
    passive: ['talvez', 'poderia', 'gostaria', 'se possível'],
    emotional: ['sinto', 'amo', 'odeio', 'adoro', 'detesto'],
    analytical: ['análise', 'dados', 'evidência', 'resultado', 'conclusão']
  };

  let detectedTone = 'neutro';
  let maxCount = 0;

  Object.entries(tones).forEach(([tone, keywords]) => {
    const count = keywords.filter(word => text.includes(word)).length;
    if (count > maxCount) {
      maxCount = count;
      detectedTone = tone;
    }
  });

  return detectedTone;
}

/**
 * Gera insights baseado na análise de sentimento
 */
function generateSentimentInsights(
  sentiment: string,
  intensity: string,
  keywords: string[],
  text: string
): string {
  let insight = '';

  if (sentiment === 'positive') {
    insight = `Comunicação positiva com ${intensity === 'high' ? 'forte' : intensity === 'medium' ? 'moderada' : 'leve'} intensidade. `;
  } else if (sentiment === 'negative') {
    insight = `Comunicação negativa com ${intensity === 'high' ? 'forte' : intensity === 'medium' ? 'moderada' : 'leve'} intensidade. `;
  } else {
    insight = `Comunicação neutra e equilibrada. `;
  }

  if (keywords.length > 0) {
    insight += `Palavras-chave detectadas: ${keywords.slice(0, 3).join(', ')}. `;
  }

  insight += `Recomendação: ${getRecommendationForSentiment(sentiment, intensity)}.`;

  return insight;
}

/**
 * Retorna recomendação baseada no sentimento
 */
function getRecommendationForSentiment(sentiment: string, intensity: string): string {
  if (sentiment === 'positive' && intensity === 'high') {
    return 'Mantenha essa energia positiva e compartilhe seu entusiasmo';
  } else if (sentiment === 'negative' && intensity === 'high') {
    return 'Considere expressar suas preocupações de forma mais construtiva';
  } else if (sentiment === 'neutral') {
    return 'Sua comunicação é equilibrada; considere adicionar mais personalidade';
  }
  return 'Continue desenvolvendo sua comunicação de forma consciente';
}

/**
 * Calcula score de legibilidade
 */
function calculateReadability(text: string, wordCount: number, sentenceCount: number): number {
  if (sentenceCount === 0 || wordCount === 0) return 50;
  
  const avgWordsPerSentence = wordCount / sentenceCount;
  const avgCharsPerWord = text.length / wordCount;
  
  // Flesch-Kincaid simplificado
  let score = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * (avgCharsPerWord / 5));
  score = Math.max(0, Math.min(100, score));
  
  return parseFloat(score.toFixed(2));
}

/**
 * Analisa perfil de comunicação
 */
function analyzeCommunicationProfile(text: string, sentiment: SentimentResult) {
  const lowerText = text.toLowerCase();
  
  // Assertividade: presença de palavras assertivas
  const assertiveWords = ['vou', 'farei', 'preciso', 'exijo', 'devo', 'é necessário'];
  const assertiveness = (assertiveWords.filter(w => lowerText.includes(w)).length / text.split(/\s+/).length) * 100;
  
  // Empatia: presença de palavras empáticas
  const empathyWords = ['entendo', 'compreendo', 'sinto', 'você', 'seu', 'sua', 'nos', 'nós'];
  const empathy = (empathyWords.filter(w => lowerText.includes(w)).length / text.split(/\s+/).length) * 100;
  
  // Clareza: baseada em legibilidade e estrutura
  const clarity = 100 - Math.abs(sentiment.score * 50);
  
  // Inteligência emocional: combinação de empatia e assertividade equilibrada
  const emotionalIntelligence = (empathy + assertiveness) / 2;
  
  return {
    assertiveness: Math.min(100, assertiveness * 10),
    empathy: Math.min(100, empathy * 10),
    clarity: Math.min(100, clarity),
    emotionalIntelligence: Math.min(100, emotionalIntelligence)
  };
}

/**
 * Identifica áreas de força e melhoria na comunicação
 */
function identifyCommunicationAreas(text: string, sentiment: SentimentResult, profile: any) {
  const strengths: string[] = [];
  const improvements: string[] = [];
  const recommendations: string[] = [];

  // Analisa forças
  if (profile.assertiveness > 60) {
    strengths.push('Comunicação assertiva e clara');
  }
  if (profile.empathy > 60) {
    strengths.push('Demonstra empatia e compreensão');
  }
  if (profile.clarity > 70) {
    strengths.push('Mensagem bem estruturada e legível');
  }

  // Analisa áreas de melhoria
  if (profile.assertiveness < 40) {
    improvements.push('Comunicação mais assertiva');
    recommendations.push('Use mais verbos de ação e declarações diretas');
  }
  if (profile.empathy < 40) {
    improvements.push('Maior foco em empatia');
    recommendations.push('Considere incluir reconhecimento das perspectivas alheias');
  }
  if (profile.clarity < 60) {
    improvements.push('Estrutura e clareza da mensagem');
    recommendations.push('Organize melhor seus pensamentos e use frases mais concisas');
  }

  return { strengths, improvements, recommendations };
}

/**
 * Exporta análise em formato JSON
 */
export function exportAnalysisAsJSON(analysis: CommunicationAnalysis): string {
  return JSON.stringify(analysis, null, 2);
}
