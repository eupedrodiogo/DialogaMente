/**
 * @file marketData2025.ts
 * @description Dados de mercado atualizados para 15 de Dezembro de 2025
 * Inclui tendências de comunicação corporativa, tamanho de mercado e projeções
 * @version 1.0.0
 * @date 15/12/2025
 */

export const MARKET_DATA_2025 = {
  timestamp: "2025-12-15T00:00:00Z",
  lastUpdated: "15 de Dezembro de 2025",
  
  marketSize: {
    preEmploymentTesting: {
      current: {
        value: 1970.56,
        currency: "USD Milhões",
        year: 2025,
        source: "Global Growth Insights"
      },
      projected: {
        value: 3395.92,
        currency: "USD Milhões",
        year: 2033,
        cagr: 7.04,
        source: "Global Growth Insights"
      },
      alternative: {
        value: 195.52,
        currency: "USD Milhões",
        year: 2024,
        projected2030: 485.1,
        source: "Market Growth Reports"
      }
    },
    psychometricSolutions: {
      current: {
        value: 5,
        currency: "USD Bilhões",
        year: 2025,
        source: "Psico-Smart"
      }
    },
    personalityAssessment: {
      current: 11.6,
      cagr: 12.4,
      projected: 37.7,
      period: "2025-2035",
      currency: "USD Bilhões",
      source: "Future Market Insights"
    },
    softSkillsTraining: {
      current: 33.39,
      currency: "USD Bilhões",
      year: 2024,
      cagr: 11.40,
      projected: 92.59,
      period: "2025-2033",
      source: "IMARC Group"
    },
    communicationTraining: {
      current: 4.5,
      currency: "USD Bilhões",
      year: 2024,
      cagr: 8.0,
      projected: 9.2,
      period: "2024-2033",
      source: "MarketIntelo"
    }
  },

  communicationTrends2026: [
    {
      rank: 1,
      trend: "Inteligência Artificial como Parceira",
      description: "A IA atua como parceira na comunicação, com integração de IA conversacional",
      adoption: "40%+ das empresas brasileiras",
      impact: "Alta",
      relevance: "Crítica"
    },
    {
      rank: 2,
      trend: "Mais Qualidade e Menos Quantidade",
      description: "Priorização de conteúdo de alta qualidade sobre volume",
      adoption: "Crescente",
      impact: "Alta",
      relevance: "Crítica"
    },
    {
      rank: 3,
      trend: "Comunicação Omnichannel",
      description: "Integração de múltiplos canais com foco em mobilidade",
      adoption: "Crescente",
      impact: "Alta",
      relevance: "Crítica"
    },
    {
      rank: 4,
      trend: "Humanização e Propósito",
      description: "Integração entre tecnologia e humanização com foco em transparência",
      adoption: "Crescente",
      impact: "Alta",
      relevance: "Crítica"
    },
    {
      rank: 5,
      trend: "Memórias Partilhadas",
      description: "Criação de experiências e narrativas que geram memórias partilhadas",
      adoption: "Emergente",
      impact: "Média",
      relevance: "Alta"
    }
  ],

  aiIntegration: {
    usage: {
      percentage: 40,
      description: "Percentual de empresas brasileiras que usam IA em marketing e conteúdo",
      year: 2025
    },
    applications: [
      "Gestão de anúncios",
      "Estratégias de mídia paga",
      "Geração de conteúdo",
      "Análise de sentimento",
      "Personalização de comunicação"
    ]
  },

  gamification: {
    marketSize: {
      current: 20.84,
      currency: "USD Bilhões",
      year: 2025,
      source: "Múltiplas fontes"
    },
    projected: {
      value: 116.68,
      currency: "USD Bilhões",
      year: 2032,
      source: "Múltiplas fontes"
    },
    educationGrowth: {
      increase: 15.4,
      period: "2019-2024",
      description: "Crescimento da gamificação na educação"
    }
  },

  scientificBasis: {
    vakModel: {
      status: "Amplamente utilizado, mas questionado",
      concern: "Modelo VAK é questionado como 'Estilo de Aprendizagem' fixo",
      recommendation: "Reenquadrar como 'Preferência de Comunicação e Modalidade de Percepção'",
      basis: "Neurociência Cognitiva e Psicologia Cognitiva Moderna"
    },
    deepProcessing: {
      importance: "Crítica",
      description: "Processamento Profundo (Deep Processing) é o fator mais crucial para aprendizado",
      source: "Daniel T. Willingham e Neurociência da Comunicação"
    }
  },

  recommendations: {
    forProject: [
      "Reforçar implementação do AI Communication Coach",
      "Focar na geração de conteúdo personalizado de alta qualidade",
      "Integrar dados de mercado em tempo real no Dashboard",
      "Garantir documentação clara sobre VAK e Processamento Profundo",
      "Implementar análise de sentimento com IA",
      "Criar experiências omnichannel"
    ]
  }
};

export const MARKET_INSIGHTS = {
  summary: "O mercado de testes de personalidade e comunicação está em forte crescimento, com projeção de atingir USD 3.4 bilhões até 2033. A IA é a tendência dominante, com 40%+ das empresas brasileiras já utilizando IA em marketing. A qualidade do conteúdo e a humanização são prioridades crescentes.",
  keyMetrics: {
    marketGrowthCAGR: "7-12%",
    aiAdoption: "40%+",
    softSkillsMarketSize: "USD 92.59 bilhões (2033)",
    personalityAssessmentGrowth: "12.4% CAGR"
  }
};
