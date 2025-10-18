/**
 * Serviço de Insights com IA
 * Integração com OpenAI para análise personalizada de perfis de comunicação
 */

interface CommunicationProfile {
  visual: number;
  auditivo: number;
  cinestesico: number;
  dominantProfile: 'visual' | 'auditivo' | 'cinestesico';
  testResults?: any[];
}

interface AIInsight {
  summary: string;
  strengths: string[];
  areasForImprovement: string[];
  recommendations: string[];
  careerSuggestions: string[];
  communicationTips: string[];
}

/**
 * Gera insights personalizados usando IA
 */
export async function generateAIInsights(profile: CommunicationProfile): Promise<AIInsight> {
  try {
    const prompt = buildPrompt(profile);
    
    // Fazer requisição para API OpenAI via edge function do Supabase
    const response = await fetch('/api/ai-insights', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, profile }),
    });

    if (!response.ok) {
      throw new Error('Falha ao gerar insights');
    }

    const data = await response.json();
    return parseAIResponse(data.insights);
  } catch (error) {
    console.error('Erro ao gerar insights com IA:', error);
    return getFallbackInsights(profile);
  }
}

/**
 * Constrói o prompt para a IA
 */
function buildPrompt(profile: CommunicationProfile): string {
  return `
Você é um especialista em comunicação e desenvolvimento pessoal. Analise o seguinte perfil de comunicação e forneça insights detalhados e personalizados.

**Perfil do Usuário:**
- Visual: ${profile.visual}%
- Auditivo: ${profile.auditivo}%
- Cinestésico: ${profile.cinestesico}%
- Perfil Dominante: ${profile.dominantProfile}

**Instruções:**
Forneça uma análise estruturada em formato JSON com os seguintes campos:

1. **summary**: Um resumo executivo do perfil (2-3 frases)
2. **strengths**: Lista de 4-5 pontos fortes baseados no perfil
3. **areasForImprovement**: Lista de 3-4 áreas para desenvolvimento
4. **recommendations**: Lista de 5-6 recomendações práticas e acionáveis
5. **careerSuggestions**: Lista de 4-5 sugestões de carreira alinhadas ao perfil
6. **communicationTips**: Lista de 5-6 dicas específicas de comunicação

**Formato de Resposta (JSON):**
{
  "summary": "string",
  "strengths": ["string"],
  "areasForImprovement": ["string"],
  "recommendations": ["string"],
  "careerSuggestions": ["string"],
  "communicationTips": ["string"]
}

Seja específico, prático e motivador. Use linguagem profissional mas acessível.
`.trim();
}

/**
 * Processa a resposta da IA
 */
function parseAIResponse(response: string): AIInsight {
  try {
    // Tentar parsear como JSON
    const parsed = JSON.parse(response);
    return {
      summary: parsed.summary || '',
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
      areasForImprovement: Array.isArray(parsed.areasForImprovement) ? parsed.areasForImprovement : [],
      recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [],
      careerSuggestions: Array.isArray(parsed.careerSuggestions) ? parsed.careerSuggestions : [],
      communicationTips: Array.isArray(parsed.communicationTips) ? parsed.communicationTips : [],
    };
  } catch (error) {
    console.error('Erro ao parsear resposta da IA:', error);
    throw error;
  }
}

/**
 * Retorna insights de fallback baseados em regras
 */
function getFallbackInsights(profile: CommunicationProfile): AIInsight {
  const insights: Record<string, AIInsight> = {
    visual: {
      summary: 'Você é predominantemente visual, processando informações melhor através de imagens, gráficos e demonstrações visuais. Sua capacidade de visualizar conceitos é um grande diferencial.',
      strengths: [
        'Excelente memória visual e espacial',
        'Facilidade para criar e interpretar gráficos e diagramas',
        'Boa organização visual de informações',
        'Capacidade de pensar em imagens e padrões',
        'Atenção aos detalhes visuais'
      ],
      areasForImprovement: [
        'Desenvolver habilidades de escuta ativa',
        'Praticar comunicação verbal sem apoio visual',
        'Melhorar a expressão através da fala',
        'Fortalecer a memória auditiva'
      ],
      recommendations: [
        'Use mapas mentais e diagramas para organizar ideias',
        'Crie apresentações visuais impactantes',
        'Utilize cores e símbolos para destacar informações importantes',
        'Pratique técnicas de visualização para memorização',
        'Explore ferramentas de design e infográficos',
        'Assista vídeos educacionais e tutoriais visuais'
      ],
      careerSuggestions: [
        'Designer Gráfico ou UX/UI Designer',
        'Arquiteto ou Designer de Interiores',
        'Fotógrafo ou Videomaker',
        'Analista de Dados com foco em visualização',
        'Diretor de Arte ou Ilustrador'
      ],
      communicationTips: [
        'Use apresentações visuais em reuniões',
        'Desenhe diagramas para explicar conceitos complexos',
        'Organize seu espaço de trabalho de forma visual',
        'Utilize quadros brancos e post-its',
        'Crie listas visuais e checklists',
        'Compartilhe imagens e infográficos em comunicações'
      ]
    },
    auditivo: {
      summary: 'Você é predominantemente auditivo, aprendendo e processando informações melhor através da audição e discussão. Sua habilidade de comunicação verbal é um ponto forte.',
      strengths: [
        'Excelente comunicação verbal',
        'Boa memória auditiva',
        'Facilidade para aprender através de discussões',
        'Habilidade para detectar nuances na fala',
        'Capacidade de expressar ideias claramente'
      ],
      areasForImprovement: [
        'Desenvolver habilidades de visualização',
        'Melhorar a interpretação de gráficos e diagramas',
        'Praticar a leitura de linguagem corporal',
        'Fortalecer a memória visual'
      ],
      recommendations: [
        'Participe de podcasts e audiolivros',
        'Grave suas ideias e reflexões em áudio',
        'Participe de grupos de discussão e debates',
        'Use música para melhorar o foco',
        'Explique conceitos em voz alta para memorizar',
        'Pratique apresentações orais regularmente'
      ],
      careerSuggestions: [
        'Professor ou Instrutor',
        'Locutor ou Podcaster',
        'Advogado ou Mediador',
        'Músico ou Produtor Musical',
        'Consultor ou Coach'
      ],
      communicationTips: [
        'Prefira chamadas de voz a mensagens escritas',
        'Participe ativamente de reuniões verbais',
        'Use tom de voz adequado para transmitir emoções',
        'Pratique a escuta ativa',
        'Grave lembretes em áudio',
        'Explique ideias verbalmente antes de escrever'
      ]
    },
    cinestesico: {
      summary: 'Você é predominantemente cinestésico, aprendendo melhor através da prática e experiência direta. Sua capacidade de aprender fazendo é um grande diferencial.',
      strengths: [
        'Excelente coordenação motora',
        'Aprendizado rápido através da prática',
        'Boa memória muscular',
        'Habilidade para trabalhos manuais',
        'Energia e dinamismo'
      ],
      areasForImprovement: [
        'Desenvolver paciência para aprendizado teórico',
        'Melhorar habilidades de comunicação escrita',
        'Praticar a concentração em tarefas estáticas',
        'Fortalecer a memória visual e auditiva'
      ],
      recommendations: [
        'Busque experiências práticas de aprendizado',
        'Faça pausas frequentes para movimento',
        'Use objetos físicos para entender conceitos',
        'Pratique esportes e atividades físicas',
        'Experimente antes de estudar teoria',
        'Utilize técnicas hands-on sempre que possível'
      ],
      careerSuggestions: [
        'Cirurgião ou Fisioterapeuta',
        'Engenheiro ou Técnico',
        'Chef de Cozinha',
        'Atleta ou Personal Trainer',
        'Artesão ou Escultor'
      ],
      communicationTips: [
        'Use gestos e linguagem corporal ao falar',
        'Demonstre conceitos fisicamente quando possível',
        'Organize reuniões com atividades práticas',
        'Faça caminhadas durante conversas importantes',
        'Use objetos e protótipos em apresentações',
        'Pratique role-playing para treinar situações'
      ]
    }
  };

  return insights[profile.dominantProfile] || insights.visual;
}

/**
 * Gera recomendações de conteúdo personalizado
 */
export async function generateContentRecommendations(
  profile: CommunicationProfile
): Promise<string[]> {
  const recommendations: Record<string, string[]> = {
    visual: [
      'Curso de Design Thinking',
      'Workshop de Infográficos',
      'Livro: "Pensamento Visual" de Dan Roam',
      'Curso de Data Visualization',
      'Tutorial de Mapas Mentais'
    ],
    auditivo: [
      'Podcast sobre Comunicação Eficaz',
      'Curso de Oratória',
      'Livro: "Como Falar em Público" de Dale Carnegie',
      'Workshop de Storytelling',
      'Curso de Técnicas de Apresentação'
    ],
    cinestesico: [
      'Workshop de Design Sprint',
      'Curso de Prototipagem Rápida',
      'Livro: "A Arte da Ação" de Stephen Bungay',
      'Curso de Metodologias Ágeis',
      'Workshop de Lean Startup'
    ]
  };

  return recommendations[profile.dominantProfile] || recommendations.visual;
}

/**
 * Analisa evolução do perfil ao longo do tempo
 */
export function analyzeProfileEvolution(
  currentProfile: CommunicationProfile,
  previousProfile: CommunicationProfile
): {
  hasImproved: boolean;
  changes: string[];
  insights: string[];
} {
  const changes: string[] = [];
  const insights: string[] = [];

  // Calcular mudanças
  const visualChange = currentProfile.visual - previousProfile.visual;
  const auditivoChange = currentProfile.auditivo - previousProfile.auditivo;
  const cinestesicoChange = currentProfile.cinestesico - previousProfile.cinestesico;

  if (Math.abs(visualChange) > 5) {
    changes.push(`Visual: ${visualChange > 0 ? '+' : ''}${visualChange.toFixed(1)}%`);
  }
  if (Math.abs(auditivoChange) > 5) {
    changes.push(`Auditivo: ${auditivoChange > 0 ? '+' : ''}${auditivoChange.toFixed(1)}%`);
  }
  if (Math.abs(cinestesicoChange) > 5) {
    changes.push(`Cinestésico: ${cinestesicoChange > 0 ? '+' : ''}${cinestesicoChange.toFixed(1)}%`);
  }

  // Gerar insights
  if (changes.length === 0) {
    insights.push('Seu perfil permaneceu estável, mostrando consistência.');
  } else {
    insights.push('Seu perfil está evoluindo! Continue praticando.');
    
    if (visualChange > 10) {
      insights.push('Grande melhora nas habilidades visuais!');
    }
    if (auditivoChange > 10) {
      insights.push('Excelente progresso na comunicação verbal!');
    }
    if (cinestesicoChange > 10) {
      insights.push('Notável desenvolvimento nas habilidades práticas!');
    }
  }

  const hasImproved = changes.length > 0 && (visualChange > 0 || auditivoChange > 0 || cinestesicoChange > 0);

  return { hasImproved, changes, insights };
}

