/**
 * AI Analysis Service
 * Serviço de análise com IA usando OpenAI GPT-4
 * 
 * @module aiAnalysis
 * @description Fornece análises avançadas de perfil de comunicação usando IA
 */

import OpenAI from 'openai';

// Inicializar cliente OpenAI
// No ambiente Node.js, a chave é lida automaticamente da variável de ambiente OPENAI_API_KEY.
const openai = new OpenAI();

/**
 * Interface para resultado de análise com IA
 */
export interface AIAnalysisResult {
  insights: string[];
  recommendations: string[];
  strengths: string[];
  areasForImprovement: string[];
  careerSuggestions: string[];
  communicationTips: string[];
  personalityTraits: string[];
  confidence: number;
}

/**
 * Interface para dados do perfil do usuário
 */
export interface UserProfile {
  profileType: 'Visual' | 'Auditivo' | 'Cinestésico';
  scores: {
    visual: number;
    auditivo: number;
    cinestesico: number;
  };
  answers?: Array<{
    question: string;
    answer: string;
  }>;
  metadata?: {
    completionTime?: number;
    testDate?: string;
    previousTests?: number;
  };
}

/**
 * Analisa o perfil de comunicação do usuário usando IA
 * 
 * @param profile - Dados do perfil do usuário
 * @returns Análise detalhada com insights e recomendações
 */
export async function analyzeProfileWithAI(
  profile: UserProfile
): Promise<AIAnalysisResult> {
  try {
    const prompt = buildAnalysisPrompt(profile);
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: [
        {
          role: 'system',
          content: `Você é um especialista em análise de perfis de comunicação e psicologia organizacional. 
          Sua função é fornecer insights profundos, práticos e personalizados sobre o perfil de comunicação do usuário.
          Seja específico, construtivo e motivador em suas análises.
          Responda sempre em português brasileiro.`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    const response = completion.choices[0]?.message?.content || '';
    return parseAIResponse(response);
    
  } catch (error) {
    console.error('Erro ao analisar perfil com IA:', error);
    throw new Error('Não foi possível gerar análise com IA. Tente novamente.');
  }
}

/**
 * Constrói o prompt para análise do perfil
 */
function buildAnalysisPrompt(profile: UserProfile): string {
  const { profileType, scores, metadata } = profile;
  
  return `
Analise o seguinte perfil de comunicação e forneça insights detalhados:

**Perfil Identificado:** ${profileType}

**Pontuações:**
- Visual: ${scores.visual}%
- Auditivo: ${scores.auditivo}%
- Cinestésico: ${scores.cinestesico}%

${metadata?.completionTime ? `**Tempo de Conclusão:** ${Math.round(metadata.completionTime / 60)} minutos` : ''}
${metadata?.previousTests ? `**Testes Anteriores:** ${metadata.previousTests}` : ''}

Por favor, forneça uma análise estruturada no seguinte formato JSON:

{
  "insights": [
    "3-5 insights principais sobre o perfil de comunicação"
  ],
  "recommendations": [
    "3-5 recomendações práticas para melhorar a comunicação"
  ],
  "strengths": [
    "3-4 pontos fortes do perfil identificado"
  ],
  "areasForImprovement": [
    "3-4 áreas que podem ser desenvolvidas"
  ],
  "careerSuggestions": [
    "3-5 sugestões de carreiras adequadas ao perfil"
  ],
  "communicationTips": [
    "5-7 dicas práticas de comunicação para o dia a dia"
  ],
  "personalityTraits": [
    "4-6 traços de personalidade associados ao perfil"
  ],
  "confidence": 0.85
}

Seja específico, prático e motivador. Use exemplos concretos quando possível.
`;
}

/**
 * Faz parsing da resposta da IA
 */
function parseAIResponse(response: string): AIAnalysisResult {
  try {
    // Tentar extrair JSON da resposta
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        insights: parsed.insights || [],
        recommendations: parsed.recommendations || [],
        strengths: parsed.strengths || [],
        areasForImprovement: parsed.areasForImprovement || [],
        careerSuggestions: parsed.careerSuggestions || [],
        communicationTips: parsed.communicationTips || [],
        personalityTraits: parsed.personalityTraits || [],
        confidence: parsed.confidence || 0.8
      };
    }
    
    // Fallback: retornar resposta como insights
    return {
      insights: [response],
      recommendations: [],
      strengths: [],
      areasForImprovement: [],
      careerSuggestions: [],
      communicationTips: [],
      personalityTraits: [],
      confidence: 0.7
    };
    
  } catch (error) {
    console.error('Erro ao fazer parsing da resposta:', error);
    throw new Error('Erro ao processar análise da IA');
  }
}

/**
 * Gera recomendações personalizadas de conteúdo
 * 
 * @param profile - Perfil do usuário
 * @returns Lista de recomendações de conteúdo
 */
export async function generateContentRecommendations(
  profile: UserProfile
): Promise<string[]> {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: [
        {
          role: 'system',
          content: 'Você é um curador de conteúdo especializado em desenvolvimento de habilidades de comunicação.'
        },
        {
          role: 'user',
          content: `Sugira 5 tópicos de artigos ou cursos relevantes para alguém com perfil de comunicação ${profile.profileType}. 
          Liste apenas os títulos, um por linha.`
        }
      ],
      temperature: 0.8,
      max_tokens: 300
    });

    const response = completion.choices[0]?.message?.content || '';
    return response.split('\n').filter(line => line.trim().length > 0);
    
  } catch (error) {
    console.error('Erro ao gerar recomendações:', error);
    return [];
  }
}

/**
 * Gera um plano de desenvolvimento personalizado
 * 
 * @param profile - Perfil do usuário
 * @param timeframe - Período do plano (30, 60, 90 dias)
 * @returns Plano de desenvolvimento estruturado
 */
export async function generateDevelopmentPlan(
  profile: UserProfile,
  timeframe: 30 | 60 | 90 = 30
): Promise<{
  goals: string[];
  weeklyActions: string[];
  milestones: string[];
  resources: string[];
}> {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: [
        {
          role: 'system',
          content: 'Você é um coach de desenvolvimento profissional especializado em comunicação.'
        },
        {
          role: 'user',
          content: `Crie um plano de desenvolvimento de ${timeframe} dias para alguém com perfil ${profile.profileType}.
          
          Forneça a resposta em formato JSON:
          {
            "goals": ["3 objetivos principais"],
            "weeklyActions": ["5-7 ações semanais"],
            "milestones": ["3-4 marcos importantes"],
            "resources": ["4-5 recursos recomendados"]
          }`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    const response = completion.choices[0]?.message?.content || '';
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return {
      goals: [],
      weeklyActions: [],
      milestones: [],
      resources: []
    };
    
  } catch (error) {
    console.error('Erro ao gerar plano de desenvolvimento:', error);
    return {
      goals: [],
      weeklyActions: [],
      milestones: [],
      resources: []
    };
  }
}

/**
 * Chatbot de suporte - responde dúvidas sobre comunicação
 * 
 * @param question - Pergunta do usuário
 * @param profile - Perfil do usuário (opcional)
 * @returns Resposta do chatbot
 */
export async function askCommunicationBot(
  question: string,
  profile?: UserProfile
): Promise<string> {
  try {
    const systemMessage = profile
      ? `Você é um assistente especializado em comunicação. O usuário tem perfil ${profile.profileType}. 
         Responda de forma clara, prática e personalizada para esse perfil.`
      : `Você é um assistente especializado em comunicação e desenvolvimento de habilidades interpessoais. 
         Responda de forma clara, prática e motivadora.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: [
        {
          role: 'system',
          content: systemMessage
        },
        {
          role: 'user',
          content: question
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    return completion.choices[0]?.message?.content || 'Desculpe, não consegui processar sua pergunta.';
    
  } catch (error) {
    console.error('Erro no chatbot:', error);
    return 'Desculpe, ocorreu um erro ao processar sua pergunta. Tente novamente.';
  }
}

/**
 * Analisa sentimento de texto livre
 * 
 * @param text - Texto a ser analisado
 * @returns Análise de sentimento
 */
export async function analyzeSentiment(text: string): Promise<{
  sentiment: 'positive' | 'neutral' | 'negative';
  confidence: number;
  emotions: string[];
}> {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: [
        {
          role: 'system',
          content: 'Você é um especialista em análise de sentimento e emoções em texto.'
        },
        {
          role: 'user',
          content: `Analise o sentimento do seguinte texto e retorne em JSON:
          
          "${text}"
          
          Formato esperado:
          {
            "sentiment": "positive|neutral|negative",
            "confidence": 0.85,
            "emotions": ["lista de emoções detectadas"]
          }`
        }
      ],
      temperature: 0.3,
      max_tokens: 200
    });

    const response = completion.choices[0]?.message?.content || '';
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return {
      sentiment: 'neutral',
      confidence: 0.5,
      emotions: []
    };
    
  } catch (error) {
    console.error('Erro ao analisar sentimento:', error);
    return {
      sentiment: 'neutral',
      confidence: 0,
      emotions: []
    };
  }
}

export default {
  analyzeProfileWithAI,
  generateContentRecommendations,
  generateDevelopmentPlan,
  askCommunicationBot,
  analyzeSentiment
};

