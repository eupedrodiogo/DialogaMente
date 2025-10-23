// DialogaMente/src/lib/scientificBasis.ts

/**
 * @fileoverview Documentação da base científica e teórica do ComunicaPro.
 * O modelo VAK (Visual, Auditivo, Cinestésico) é reenquadrado de 'Estilo de Aprendizagem'
 * para 'Preferência de Comunicação e Modalidade de Percepção', em alinhamento
 * com o consenso científico moderno.
 */

export const SCIENTIFIC_BASIS = {
  title: "Base Científica e Reenquadramento Teórico",
  model: "VAK (Visual, Auditivo, Cinestésico)",
  disclaimer: "O modelo VAK, embora popular, é amplamente questionado pela ciência cognitiva moderna como um 'Estilo de Aprendizagem' fixo. Não há evidências que suportem a ideia de que o aprendizado melhora quando o método de ensino corresponde ao estilo preferido do indivíduo. O ComunicaPro utiliza o VAK não como um estilo de aprendizagem, mas sim como uma ferramenta para identificar **Preferências de Comunicação e Modalidades de Percepção**.",
  reframe: {
    title: "VAK como Preferência de Comunicação",
    description: "Nossa aplicação foca na relevância do VAK para a **memorização**, a **comunicação interpessoal** e a **forma como o indivíduo processa e expressa informações**.",
    points: [
      "**Comunicação Interpessoal:** Entender a preferência de comunicação ajuda a adaptar a forma como você se expressa para ser mais eficaz ao interagir com outras pessoas.",
      "**Processamento de Informação:** O resultado indica a modalidade sensorial (Visual, Auditiva ou Cinestésica) que você tende a priorizar ao absorver e reter novas informações.",
      "**Memorização:** O VAK é relevante para a memória, sugerindo que a forma como a informação é codificada (ex: desenhando, ouvindo, praticando) pode influenciar a retenção.",
    ],
  },
  advancedConcept: {
    title: "A Importância da Evidência do Significado",
    source: "Daniel T. Willingham, Ciência Cognitiva",
    explanation: "O fator mais crucial para o aprendizado e a comunicação eficaz é o **Significado** do conteúdo. O resultado do seu perfil VAK deve ser usado para ajudar você a redefinir o significado do conteúdo, conectando-o com o que já sabe e com suas necessidades, e não como uma limitação sobre como você pode aprender.",
  },
  modalities: [
    {
      type: "Visual",
      characteristics: "Pessoas que preferem ver informações (gráficos, diagramas, textos, cores) para compreender e se comunicar.",
      communicationTip: "Use recursos visuais, como slides e anotações, e preste atenção à linguagem corporal.",
    },
    {
      type: "Auditivo",
      characteristics: "Pessoas que preferem ouvir informações (palestras, discussões, áudio) e se comunicam bem através da fala.",
      communicationTip: "Use tom de voz, ritmo e clareza. Repita informações importantes em voz alta.",
    },
    {
      type: "Cinestésico",
      characteristics: "Pessoas que preferem 'fazer' ou 'tocar' (experiências práticas, movimento) para processar e se comunicar.",
      communicationTip: "Use exemplos práticos, simulações e incentive a participação ativa.",
    },
  ],
};
