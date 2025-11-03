import { ProfileResult } from '../lib/types';

/**
 * @file recommendationService.ts
 * @description Serviço de recomendações inteligentes baseado no perfil de comunicação.
 * Este é um placeholder para a lógica de Machine Learning/IA que será implementada
 * para gerar recomendações personalizadas.
 */

interface Recommendation {
  id: string;
  type: 'course' | 'article' | 'exercise' | 'career';
  title: string;
  description: string;
  link: string;
  relevanceScore: number;
}

/**
 * Simula a geração de recomendações personalizadas com base no perfil.
 * @param profile O resultado do perfil de comunicação do usuário.
 * @returns Uma lista de recomendações.
 */
export async function getPersonalizedRecommendations(profile: ProfileResult): Promise<Recommendation[]> {
  // Lógica de IA/ML para gerar recomendações baseada em:
  // - profile.dominantPreference (Visual, Auditivo, Cinestésico)
  // - profile.score (Pontuação geral)
  // - profile.history (Histórico de testes)
  // - Tendências de mercado (dados externos)

  const { dominantPreference } = profile;
  const preferenceMap = {
    Visual: 'Visualização e Organização',
    Auditivo: 'Escuta Ativa e Oratória',
    Cinestésico: 'Prática e Interação',
  };
  const focusArea = preferenceMap[dominantPreference] || 'Desenvolvimento Geral';

  const recommendations: Recommendation[] = [
    {
      id: 'rec-1',
      type: 'course',
      title: `Curso Avançado de ${focusArea}`,
      description: `Aprimore suas habilidades de comunicação focadas em sua preferência ${dominantPreference} com este curso intensivo.`,
      link: '/courses/advanced-communication',
      relevanceScore: 0.95,
    },
    {
      id: 'rec-2',
      type: 'article',
      title: `5 Estratégias de Memorização para o Perfil ${dominantPreference}`,
      description: 'Artigo com técnicas baseadas em neurociência para otimizar sua retenção de informações.',
      link: '/blog/memorization-strategies',
      relevanceScore: 0.88,
    },
    {
      id: 'rec-3',
      type: 'exercise',
      title: `Desafio Diário: Treino de ${focusArea}`,
      description: 'Um exercício prático de 15 minutos para fortalecer sua modalidade de percepção dominante.',
      link: '/exercises/daily-challenge',
      relevanceScore: 0.92,
    },
    {
      id: 'rec-4',
      type: 'career',
      title: 'Caminhos de Carreira para Comunicadores',
      description: 'Descubra profissões onde seu perfil de comunicação é um diferencial competitivo.',
      link: '/career-paths',
      relevanceScore: 0.75,
    },
  ];

  return recommendations;
}

// Placeholder para o tipo ProfileResult, que deve ser definido em outro lugar
// Adicionando um tipo básico para evitar erros de compilação no placeholder
// O tipo real deve ser importado de '../lib/types'
export type BasicProfileResult = {
    dominantPreference: 'Visual' | 'Auditivo' | 'Cinestésico' | 'Não Definido';
    score: number;
    history: any[];
};

// Exemplo de uso (apenas para referência, não será executado)
/*
const mockProfile: BasicProfileResult = {
    dominantPreference: 'Visual',
    score: 85,
    history: []
};
getPersonalizedRecommendations(mockProfile).then(console.log);
*/
