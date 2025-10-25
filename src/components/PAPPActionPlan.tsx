import { useQuery } from '@tanstack/react-query';
import { Brain, Sparkles, Loader2, AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

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

  // Simulação de dados de retorno baseada na preferência dominante
  const strategyMap = {
    Visual: [
      "Crie Mapas Mentais coloridos e diagramas para cada novo conceito.",
      "Use a técnica de 'Palácio da Memória' (Memory Palace) para organizar informações visuais.",
      "Transforme anotações em infográficos ou esboços visuais.",
    ],
    Auditivo: [
      "Grave-se explicando o conteúdo em voz alta (Auto-explicação ativa).",
      "Participe de debates e discussões para reforçar o aprendizado.",
      "Use a técnica de 'Prática de Recuperação' (Retrieval Practice) falando sobre o tópico sem consultar anotações.",
    ],
    Cinestesico: [
      "Desenvolva 'Experimentos de Pensamento' ou simulações práticas do conceito.",
      "Use o método de 'Feynman' (ensinar o conceito a alguém) para reforçar o aprendizado ativo.",
      "Caminhe ou use gestos enquanto estuda para incorporar o movimento ao pensamento.",
    ],
  };

  await new Promise(resolve => setTimeout(resolve, 1500)); // Simula delay de rede/processamento

  return strategyMap[vakResult.dominant];
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
            {actionPlan.map((step, index) => (
              <li key={index} className="text-base font-medium">
                {step}
              </li>
            ))}
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
