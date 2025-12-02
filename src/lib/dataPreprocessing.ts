/**
 * @fileoverview Funções utilitárias para pré-processamento de dados
 * antes de serem enviados para modelos de Inteligência Artificial (LLMs).
 * Essencial para as funcionalidades de Análise de Sentimento e PAPP (Plano de Ação de Processamento Profundo).
 */

/**
 * Realiza o pré-processamento básico de uma string de texto.
 * As etapas incluem:
 * 1. Conversão para minúsculas.
 * 2. Remoção de espaços em branco extras (incluindo quebras de linha).
 * 3. Remoção de caracteres especiais e pontuação que podem não ser relevantes para o LLM.
 *
 * @param text A string de texto a ser pré-processada.
 * @returns A string de texto limpa e normalizada.
 */
export function preprocessTextForAI(text: string): string {
  if (!text) {
    return '';
  }

  let processedText = text.toLowerCase();

  // 1. Remoção de quebras de linha e tabulações
  processedText = processedText.replace(/[\r\n\t]+/g, ' ');

  // 2. Remoção de pontuação básica (mantendo acentos e caracteres específicos de idiomas)
  // Esta regex remove caracteres que não são letras, números ou espaços.
  // Pode ser ajustada dependendo da necessidade exata do LLM.
  processedText = processedText.replace(/[^\w\sáéíóúâêîôûãõç]/gi, '');

  // 3. Remoção de múltiplos espaços em branco
  processedText = processedText.replace(/\s\s+/g, ' ').trim();

  return processedText;
}

// Exemplo de uso (opcional, para testes)
// const rawText = "Olá, Mundo! Este é um teste. \n Com quebras de linha e  espaços duplos.";
// console.log(preprocessTextForAI(rawText)); // "olá mundo este é um teste com quebras de linha e espaços duplos"
