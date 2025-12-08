/**
 * @file advancedGamificationService.ts
 * @description Serviço avançado de gamificação com sistema de progressão, desafios dinâmicos,
 * badges especiais, ranking e recompensas baseadas em comportamento e engajamento.
 * @version 2.0.0
 * @date 08/12/2025
 */

interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'tests' | 'social' | 'learning' | 'special' | 'market' | 'streak';
  icon: string;
  requirement: number;
  current: number;
  unlocked: boolean;
  unlockedDate?: Date;
  points: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  progressPercentage: number;
}

interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  objective: string;
  difficulty: 'easy' | 'medium' | 'hard';
  reward: number;
  completed: boolean;
  completionDate?: Date;
  expiresAt: Date;
  category: string;
}

interface UserProgress {
  userId: string;
  totalPoints: number;
  level: number;
  experience: number;
  experienceToNextLevel: number;
  achievements: Achievement[];
  dailyChallenges: DailyChallenge[];
  currentStreak: number;
  longestStreak: number;
  rank: number;
  rankTitle: string;
}

interface Leaderboard {
  rank: number;
  userId: string;
  userName: string;
  totalPoints: number;
  level: number;
  achievements: number;
}

/**
 * Definição de níveis e progressão
 */
const LEVEL_PROGRESSION = {
  1: { minExp: 0, title: 'Iniciante', icon: '🌱' },
  2: { minExp: 100, title: 'Aprendiz', icon: '📚' },
  3: { minExp: 250, title: 'Praticante', icon: '🎯' },
  4: { minExp: 450, title: 'Proficiente', icon: '⭐' },
  5: { minExp: 700, title: 'Especialista', icon: '🏆' },
  6: { minExp: 1000, title: 'Mestre', icon: '👑' },
  7: { minExp: 1500, title: 'Lenda', icon: '🔥' },
};

/**
 * Definição de conquistas avançadas
 */
const ADVANCED_ACHIEVEMENTS: Record<string, Omit<Achievement, 'current' | 'unlocked' | 'progressPercentage'>> = {
  'first-test': {
    id: 'first-test',
    title: 'Primeiro Passo',
    description: 'Complete seu primeiro teste de comunicação',
    category: 'tests',
    icon: '🚀',
    requirement: 1,
    points: 10,
    rarity: 'common'
  },
  'five-tests': {
    id: 'five-tests',
    title: 'Explorador',
    description: 'Complete 5 testes de comunicação',
    category: 'tests',
    icon: '🗺️',
    requirement: 5,
    points: 25,
    rarity: 'uncommon'
  },
  'ten-tests': {
    id: 'ten-tests',
    title: 'Veterano',
    description: 'Complete 10 testes de comunicação',
    category: 'tests',
    icon: '🎖️',
    requirement: 10,
    points: 50,
    rarity: 'rare'
  },
  'perfect-score': {
    id: 'perfect-score',
    title: 'Perfeição',
    description: 'Alcance uma pontuação perfeita (100) em um teste',
    category: 'special',
    icon: '💯',
    requirement: 1,
    points: 100,
    rarity: 'epic'
  },
  'consistency-week': {
    id: 'consistency-week',
    title: 'Consistente',
    description: 'Realize testes por 7 dias consecutivos',
    category: 'streak',
    icon: '🔥',
    requirement: 7,
    points: 75,
    rarity: 'rare'
  },
  'consistency-month': {
    id: 'consistency-month',
    title: 'Dedicado',
    description: 'Realize testes por 30 dias consecutivos',
    category: 'streak',
    icon: '🌟',
    requirement: 30,
    points: 200,
    rarity: 'epic'
  },
  'social-butterfly': {
    id: 'social-butterfly',
    title: 'Borboleta Social',
    description: 'Compartilhe seus resultados 5 vezes',
    category: 'social',
    icon: '🦋',
    requirement: 5,
    points: 40,
    rarity: 'uncommon'
  },
  'reviewer': {
    id: 'reviewer',
    title: 'Crítico Construtivo',
    description: 'Deixe 3 avaliações/reviews',
    category: 'social',
    icon: '⭐',
    requirement: 3,
    points: 30,
    rarity: 'uncommon'
  },
  'market-analyst': {
    id: 'market-analyst',
    title: 'Analista de Mercado',
    description: 'Visualize dados de mercado 10 vezes',
    category: 'market',
    icon: '📊',
    requirement: 10,
    points: 50,
    rarity: 'rare'
  },
  'ai-coach-user': {
    id: 'ai-coach-user',
    title: 'Aluno de IA',
    description: 'Use o AI Coach 5 vezes',
    category: 'learning',
    icon: '🤖',
    requirement: 5,
    points: 60,
    rarity: 'rare'
  },
  'improvement-master': {
    id: 'improvement-master',
    title: 'Mestre do Desenvolvimento',
    description: 'Melhore sua pontuação em 20 pontos em testes consecutivos',
    category: 'special',
    icon: '📈',
    requirement: 1,
    points: 150,
    rarity: 'epic'
  },
  'legend-status': {
    id: 'legend-status',
    title: 'Lenda Viva',
    description: 'Alcance o nível máximo (Lenda)',
    category: 'special',
    icon: '👑',
    requirement: 1,
    points: 500,
    rarity: 'legendary'
  }
};

/**
 * Desafios diários
 */
const DAILY_CHALLENGES: DailyChallenge[] = [
  {
    id: 'daily-1',
    title: 'Teste Matinal',
    description: 'Complete um teste no período da manhã',
    objective: 'Realize um teste entre 6h e 12h',
    difficulty: 'easy',
    reward: 15,
    completed: false,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    category: 'tests'
  },
  {
    id: 'daily-2',
    title: 'Compartilhador Social',
    description: 'Compartilhe seus resultados em redes sociais',
    objective: 'Compartilhe com pelo menos 1 pessoa',
    difficulty: 'easy',
    reward: 20,
    completed: false,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    category: 'social'
  },
  {
    id: 'daily-3',
    title: 'Aprendiz Dedicado',
    description: 'Visualize uma recomendação personalizada',
    objective: 'Acesse a página de recomendações',
    difficulty: 'easy',
    reward: 10,
    completed: false,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    category: 'learning'
  },
  {
    id: 'daily-4',
    title: 'Desafio de Melhoria',
    description: 'Supere sua pontuação anterior',
    objective: 'Faça um teste com pontuação maior que a anterior',
    difficulty: 'medium',
    reward: 50,
    completed: false,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    category: 'tests'
  },
  {
    id: 'daily-5',
    title: 'Crítico Construtivo',
    description: 'Deixe uma avaliação detalhada',
    objective: 'Escreva um review com mais de 50 caracteres',
    difficulty: 'medium',
    reward: 30,
    completed: false,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    category: 'social'
  }
];

/**
 * Calcula o nível baseado na experiência
 */
export function calculateLevel(experience: number): { level: number; title: string; icon: string } {
  let level = 1;
  let title = 'Iniciante';
  let icon = '🌱';

  Object.entries(LEVEL_PROGRESSION).forEach(([lvl, data]) => {
    if (experience >= data.minExp) {
      level = parseInt(lvl);
      title = data.title;
      icon = data.icon;
    }
  });

  return { level, title, icon };
}

/**
 * Calcula experiência necessária para o próximo nível
 */
export function getExperienceToNextLevel(currentLevel: number): number {
  const nextLevel = currentLevel + 1;
  const nextLevelData = LEVEL_PROGRESSION[nextLevel as keyof typeof LEVEL_PROGRESSION];
  return nextLevelData ? nextLevelData.minExp : Infinity;
}

/**
 * Adiciona pontos e experiência ao usuário
 */
export function addExperience(currentExp: number, pointsEarned: number): { newExp: number; leveledUp: boolean; newLevel: number } {
  const currentLevel = calculateLevel(currentExp).level;
  const newExp = currentExp + pointsEarned;
  const newLevel = calculateLevel(newExp).level;
  const leveledUp = newLevel > currentLevel;

  return { newExp, leveledUp, newLevel };
}

/**
 * Desbloqueia uma conquista
 */
export function unlockAchievement(achievementId: string): Achievement | null {
  const baseAchievement = ADVANCED_ACHIEVEMENTS[achievementId];
  if (!baseAchievement) return null;

  return {
    ...baseAchievement,
    current: baseAchievement.requirement,
    unlocked: true,
    unlockedDate: new Date(),
    progressPercentage: 100
  };
}

/**
 * Atualiza progresso de uma conquista
 */
export function updateAchievementProgress(
  achievement: Achievement,
  currentValue: number
): Achievement {
  const progressPercentage = Math.min(100, (currentValue / achievement.requirement) * 100);
  const unlocked = currentValue >= achievement.requirement;

  return {
    ...achievement,
    current: currentValue,
    unlocked,
    progressPercentage,
    unlockedDate: unlocked && !achievement.unlocked ? new Date() : achievement.unlockedDate
  };
}

/**
 * Gera desafios diários aleatórios
 */
export function generateDailyChallenges(): DailyChallenge[] {
  const shuffled = DAILY_CHALLENGES.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3); // Retorna 3 desafios aleatórios
}

/**
 * Calcula streak (sequência de dias com atividade)
 */
export function calculateStreak(testDates: Date[]): { currentStreak: number; longestStreak: number } {
  if (testDates.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  const sortedDates = testDates.sort((a, b) => b.getTime() - a.getTime());
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 1;

  for (let i = 0; i < sortedDates.length - 1; i++) {
    const diff = Math.floor((sortedDates[i].getTime() - sortedDates[i + 1].getTime()) / (1000 * 60 * 60 * 24));
    
    if (diff === 1) {
      tempStreak++;
    } else if (diff > 1) {
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 1;
    }
  }

  longestStreak = Math.max(longestStreak, tempStreak);

  // Verifica se o streak atual está ativo (última atividade foi ontem ou hoje)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const lastActivityDate = new Date(sortedDates[0]);
  lastActivityDate.setHours(0, 0, 0, 0);
  const daysDiff = Math.floor((today.getTime() - lastActivityDate.getTime()) / (1000 * 60 * 60 * 24));

  currentStreak = daysDiff <= 1 ? tempStreak : 0;

  return { currentStreak, longestStreak };
}

/**
 * Calcula ranking do usuário
 */
export function calculateRank(totalPoints: number): { rank: number; rankTitle: string } {
  const ranks = [
    { minPoints: 0, rank: 10, title: 'Bronze' },
    { minPoints: 500, rank: 9, title: 'Prata' },
    { minPoints: 1000, rank: 8, title: 'Ouro' },
    { minPoints: 2000, rank: 7, title: 'Platina' },
    { minPoints: 3500, rank: 6, title: 'Diamante' },
    { minPoints: 5000, rank: 5, title: 'Cristal' },
    { minPoints: 7500, rank: 4, title: 'Safira' },
    { minPoints: 10000, rank: 3, title: 'Rubi' },
    { minPoints: 15000, rank: 2, title: 'Esmeralda' },
    { minPoints: 25000, rank: 1, title: 'Lenda' }
  ];

  let userRank = ranks[0];
  for (const rankData of ranks) {
    if (totalPoints >= rankData.minPoints) {
      userRank = rankData;
    }
  }

  return { rank: userRank.rank, rankTitle: userRank.title };
}

/**
 * Gera leaderboard
 */
export function generateLeaderboard(users: Array<{ id: string; name: string; points: number; level: number; achievements: number }>): Leaderboard[] {
  return users
    .sort((a, b) => b.points - a.points)
    .map((user, index) => ({
      rank: index + 1,
      userId: user.id,
      userName: user.name,
      totalPoints: user.points,
      level: user.level,
      achievements: user.achievements
    }));
}

/**
 * Exporta dados de gamificação em JSON
 */
export function exportGamificationData(progress: UserProgress): string {
  return JSON.stringify(progress, null, 2);
}

/**
 * Retorna todas as conquistas disponíveis
 */
export function getAllAchievements(): Achievement[] {
  return Object.values(ADVANCED_ACHIEVEMENTS).map(achievement => ({
    ...achievement,
    current: 0,
    unlocked: false,
    progressPercentage: 0
  }));
}

/**
 * Retorna desafios diários padrão
 */
export function getDefaultDailyChallenges(): DailyChallenge[] {
  return DAILY_CHALLENGES;
}
