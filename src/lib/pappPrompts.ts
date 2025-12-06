// src/lib/pappPrompts.ts

/**
 * Prompts Metacognitivos Avançados para o Plano de Ação de Processamento Profundo (PAPP).
 * Baseado na Teoria da Carga Cognitiva (TCC) e na pesquisa sobre Metacognição (Stanton, 2021; Edutopia, 2021).
 * Estes prompts são projetados para estimular o Processamento Profundo (Deep Processing)
 * e são categorizados por Preferência de Comunicação (VAK) e Estágio Metacognitivo.
 */

export type VAK = 'Visual' | 'Auditivo' | 'Cinestésico';
export type MetacognitiveStage = 'Planejamento' | 'Monitoramento' | 'Reflexão';

export interface Prompt {
  id: string;
  text: string;
  vak: VAK;
  stage: MetacognitiveStage;
}

export const PAPP_PROMPTS: Prompt[] = [
  // --- Planejamento ---
  {
    id: 'P001',
    text: 'Antes de começar, desenhe um mapa mental ou diagrama que represente o que você espera aprender. Quais são os 3 pontos-chave que você precisa "ver"?',
    vak: 'Visual',
    stage: 'Planejamento',
  },
  {
    id: 'P002',
    text: 'Como você pode transformar este novo conceito em uma conversa? Planeje uma breve explicação em voz alta para alguém (ou para si mesmo) antes de ler o material.',
    vak: 'Auditivo',
    stage: 'Planejamento',
  },
  {
    id: 'P003',
    text: 'Qual ação prática você pode realizar para aplicar este conhecimento imediatamente? Planeje um pequeno experimento ou simulação para "sentir" o conceito.',
    vak: 'Cinestésico',
    stage: 'Planejamento',
  },

  // --- Monitoramento ---
  {
    id: 'M001',
    text: 'Enquanto estuda, crie um código de cores para destacar as informações: Verde para "Entendido", Amarelo para "Revisar", Vermelho para "Não Entendido". O que está mais amarelo?',
    vak: 'Visual',
    stage: 'Monitoramento',
  },
  {
    id: 'M002',
    text: 'Pare e se pergunte: "Se eu tivesse que explicar isso por telefone agora, quais seriam as minhas 3 frases principais?". Se a explicação não for clara, volte e ouça/leia novamente.',
    vak: 'Auditivo',
    stage: 'Monitoramento',
  },
  {
    id: 'M003',
    text: 'Qual é a sensação de estar aprendendo isso? Se você se sentir passivo, mude de posição, levante-se ou anote o conceito à mão para reativar o engajamento físico.',
    vak: 'Cinestésico',
    stage: 'Monitoramento',
  },

  // --- Reflexão ---
  {
    id: 'R001',
    text: 'Desenhe um gráfico de barras que represente seu nível de domínio sobre os tópicos. O que você pode fazer para que a barra mais baixa chegue ao topo?',
    vak: 'Visual',
    stage: 'Reflexão',
  },
  {
    id: 'R002',
    text: 'Grave um áudio de 60 segundos resumindo o que você aprendeu. Ao ouvir, identifique as partes que soam vagas ou confusas. Isso indica onde você precisa aprofundar.',
    vak: 'Auditivo',
    stage: 'Reflexão',
  },
  {
    id: 'R003',
    text: 'Como você pode usar este novo conhecimento para resolver um problema real em sua vida ou trabalho? Crie um "Plano de Ação de 3 Passos" para aplicar o conceito.',
    vak: 'Cinestésico',
    stage: 'Reflexão',
  },
];

// Adicionando um prompt geral baseado na Teoria da Carga Cognitiva (TCC)
export const CLT_PROMPT: Prompt = {
    id: 'CLT01',
    text: 'Para reduzir a Carga Cognitiva Extrínseca: O que neste material é **distração** e o que é **essencial**? Concentre-se apenas no essencial para o Processamento Profundo.',
    vak: 'Visual', // Pode ser qualquer um, pois é um prompt de design/estrutura
    stage: 'Monitoramento',
};

// Estrutura de dados para uso futuro no LLM
export const PAPP_STRUCTURE = {
    VAK_CATEGORIES: ['Visual', 'Auditivo', 'Cinestésico'],
    METACOGNITIVE_STAGES: ['Planejamento', 'Monitoramento', 'Reflexão'],
};
