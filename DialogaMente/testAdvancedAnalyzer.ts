import { analyzeAdvancedCommunication, AdvancedCommunicationProfile } from './src/services/advancedCommunicationAnalyzer';

async function runTest() {
  console.log("--- Teste do AdvancedCommunicationAnalyzer ---");

  const testText1 = "Adorei o novo recurso! É excelente e superou minhas expectativas. Farei o upgrade para o plano premium. É crucial que vocês mantenham essa qualidade.";
  const testText2 = "O produto é ok, mas o suporte é péssimo. Gostaria que vocês melhorassem a clareza das instruções. Talvez eu procure uma alternativa.";
  const testText3 = "Entendo que o processo é complexo, mas preciso de uma solução rápida. Vou tentar aplicar as sugestões que me deram.";

  console.log("\n--- Análise 1: Texto Positivo e Assertivo (Estilo Visual) ---");
  const result1: AdvancedCommunicationProfile = await analyzeAdvancedCommunication(testText1, 'Visual');
  console.log(JSON.stringify(result1, null, 2));

  console.log("\n--- Análise 2: Texto Negativo e Passivo (Estilo Auditivo) ---");
  const result2: AdvancedCommunicationProfile = await analyzeAdvancedCommunication(testText2, 'Auditivo');
  console.log(JSON.stringify(result2, null, 2));

  console.log("\n--- Análise 3: Texto Neutro e Empático (Estilo Cinestésico) ---");
  const result3: AdvancedCommunicationProfile = await analyzeAdvancedCommunication(testText3, 'Cinestésico');
  console.log(JSON.stringify(result3, null, 2));
}

runTest().catch(console.error);
