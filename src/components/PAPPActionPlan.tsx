import { useQuery } from '@tanstack/react-query';
import { Brain, Sparkles, Loader2, AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { PAPP_PROMPTS, CLT_PROMPT, VAK, MetacognitiveStage, Prompt } from '@/lib/pappPrompts';

// Simulação de tipo de dados do resultado do teste VAK
interface VAKResult {
  visual: number;
  auditivo: number;
  cinestesico: number;
  dominant: 'Visual' | 'Auditivo' | 'Cinestesico';
}

// Simulação da função que chamaria a Edge Function do Supabase
async function fetchPAPP(vakResult: VAKResult): Promise<string[]> {
  // Nesta fase, simulamos a chamada à Edge Function de IA.
  // Em um ambiente real, esta função faria um fetch para a URL da Supabase Edge Function
  // com o payload do resultado VAK, e a Edge Function usaria a API da OpenAI/Gemini
  // para gerar o plano de ação.

  console.log("Chamando Edge Function de IA com resultado VAK:", vakResult);

  // Simulação de dados de retorno baseada na preferência dominante e nos prompts metacognitivos
  const dominantVAK = vakResult.dominant as VAK;
  
  // 1. Filtra os prompts específicos para a modalidade dominante
  const dominantPrompts = PAPP_PROMPTS.filter(p => p.vak === dominantVAK);

  // 2. Seleciona um prompt de cada estágio metacognitivo para a modalidade dominante
  const selectedPrompts: Prompt[] = [];
  const stages: MetacognitiveStage[] = ['Planejamento', 'Monitoramento', 'Reflexão'];

  stages.forEach(stage => {
    const promptForStage = dominantPrompts.find(p => p.stage === stage);
    if (promptForStage) {
      selectedPrompts.push(promptForStage);
    }
  });

  // 3. Adiciona o prompt da Teoria da Carga Cognitiva (TCC)
  selectedPrompts.push(CLT_PROMPT);

  // 4. Adiciona 2 prompts genéricos de Processamento Profundo (simulando a IA)
  const genericStrategies = [
    { id: 'G001', text: "Auto-explicação: Explique o conceito para si mesmo como se estivesse ensinando a uma criança.", vak: dominantVAK, stage: 'Reflexão' as MetacognitiveStage },
    { id: 'G002', text: "Elaboração: Conecte o novo conceito a algo que você já sabe. Qual é a analogia mais estranha que você consegue criar?", vak: dominantVAK, stage: 'Planejamento' as MetacognitiveStage },
  ];
  selectedPrompts.push(...genericStrategies);

  // 5. Mapeia para o formato de retorno (apenas o texto do prompt)
  const finalActionPlan = selectedPrompts.map(p => `[${p.stage}] ${p.text}`);

  await new Promise(resolve => setTimeout(resolve, 1500)); // Simula delay de rede/processamento

  return finalActionPlan;

}

interface PAPPActionPlanProps {
  vakResult: VAKResult;
}

export function PAPPActionPlan({ vakResult }: PAPPActionPlanProps) {
  const { data: actionPlan, isLoading, isError, refetch } = useQuery({
    queryKey: ['pappActionPlan', vakResult.dominant],
    queryFn: () => fetchPAPP(vakResult),
    staleTime: Infinity,
  });

  const { dominant } = vakResult;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Sparkles className="h-6 w-6 text-primary" />
          Plano de Ação de Processamento Profundo (PAPP)
        </CardTitle>
        <CardDescription>
          Seu guia personalizado para a retenção de longo prazo, baseado no seu perfil **{dominant}** e nas mais recentes descobertas da ciência cognitiva.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="mb-4">
          <Brain className="h-4 w-4" />
          <AlertTitle>Atenção Científica (2025)</AlertTitle>
          <AlertDescription>
            A preferência **{dominant}** é apenas o ponto de partida. O segredo da memorização é o **Processamento Profundo**. Este plano traduz sua preferência em estratégias ativas de aprendizado.
          </AlertDescription>
        </Alert>

        {isLoading && (
          <div className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-2 text-sm text-muted-foreground">Gerando seu plano de ação personalizado com IA...</p>
          </div>
        )}

        {isError && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Erro ao Gerar Plano</AlertTitle>
            <AlertDescription>
              Não foi possível conectar com a Edge Function de IA. Tente novamente ou verifique a configuração do Supabase.
            </AlertDescription>
          </Alert>
        )}

        {actionPlan && (
          <ol className="space-y-4 list-decimal pl-5">
            {actionPlan.map((step, index) => {
              const [stage, ...rest] = step.split(']');
              const text = rest.join(']').trim();
              return (
              <li key={index} className="text-base font-medium">
                <span className="font-bold text-purple-600 dark:text-purple-400">{stage.replace('[', '')}</span>: {text}
                
              </li>
            );
            })}
          </ol>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={() => refetch()} disabled={isLoading} variant="outline">
          {isLoading ? 'Regerando...' : 'Regerar Plano'}
        </Button>
      </CardFooter>
    </Card>
  );
}

// Exemplo de uso (em Results.tsx):
// <PAPPActionPlan vakResult={{ visual: 40, auditivo: 35, cinestesico: 25, dominant: 'Visual' }} />
