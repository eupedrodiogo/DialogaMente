import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  TrendingUp, 
  Eye, 
  Ear, 
  Hand,
  Download,
  Share2,
  BarChart3,
  Clock
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { RadarChart } from '@/components/RadarChart';
import { SocialShare } from '@/components/SocialShare';

interface TestResult {
  id: string;
  created_at: string;
  visual_score: number;
  auditory_score: number;
  kinesthetic_score: number;
  dominant_profile: 'visual' | 'auditivo' | 'cinestesico';
  total_score: number;
}

/**
 * Página de Histórico de Testes
 * Exibe todos os testes realizados pelo usuário com análise de evolução
 */
export default function TestHistory() {
  const [tests, setTests] = useState<TestResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTest, setSelectedTest] = useState<TestResult | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadTestHistory();
  }, []);

  const loadTestHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        navigate('/');
        return;
      }

      const { data, error } = await supabase
        .from('test_results')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setTests(data || []);
      if (data && data.length > 0) {
        setSelectedTest(data[0]);
      }
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar o histórico de testes.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getProfileIcon = (profile: string) => {
    switch (profile) {
      case 'visual':
        return <Eye className="h-5 w-5" />;
      case 'auditivo':
        return <Ear className="h-5 w-5" />;
      case 'cinestesico':
        return <Hand className="h-5 w-5" />;
      default:
        return null;
    }
  };

  const getProfileColor = (profile: string) => {
    switch (profile) {
      case 'visual':
        return 'bg-blue-500';
      case 'auditivo':
        return 'bg-green-500';
      case 'cinestesico':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getProfileName = (profile: string) => {
    switch (profile) {
      case 'visual':
        return 'Visual';
      case 'auditivo':
        return 'Auditivo';
      case 'cinestesico':
        return 'Cinestésico';
      default:
        return 'Desconhecido';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const calculateEvolution = () => {
    if (tests.length < 2) return null;

    const latest = tests[0];
    const previous = tests[1];

    return {
      visual: latest.visual_score - previous.visual_score,
      auditory: latest.auditory_score - previous.auditory_score,
      kinesthetic: latest.kinesthetic_score - previous.kinesthetic_score,
    };
  };

  const evolution = calculateEvolution();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando histórico...</p>
        </div>
      </div>
    );
  }

  if (tests.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Nenhum Teste Realizado</CardTitle>
            <CardDescription>
              Você ainda não realizou nenhum teste de comunicação.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/test')} className="w-full">
              Fazer Primeiro Teste
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Histórico de Testes</h1>
          <p className="text-muted-foreground text-lg">
            Acompanhe sua evolução ao longo do tempo
          </p>
        </div>

        {/* Estatísticas Gerais */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total de Testes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{tests.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Perfil Atual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {getProfileIcon(tests[0].dominant_profile)}
                <span className="text-2xl font-bold">
                  {getProfileName(tests[0].dominant_profile)}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Pontuação Média</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {(tests.reduce((sum, t) => sum + t.total_score, 0) / tests.length).toFixed(0)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Último Teste</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4" />
                {new Date(tests[0].created_at).toLocaleDateString('pt-BR')}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Evolução */}
        {evolution && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Evolução Recente
              </CardTitle>
              <CardDescription>
                Comparação entre os dois últimos testes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium flex items-center gap-2">
                      <Eye className="h-4 w-4 text-blue-500" />
                      Visual
                    </span>
                    <Badge variant={evolution.visual >= 0 ? 'default' : 'destructive'}>
                      {evolution.visual >= 0 ? '+' : ''}{evolution.visual.toFixed(1)}%
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium flex items-center gap-2">
                      <Ear className="h-4 w-4 text-green-500" />
                      Auditivo
                    </span>
                    <Badge variant={evolution.auditory >= 0 ? 'default' : 'destructive'}>
                      {evolution.auditory >= 0 ? '+' : ''}{evolution.auditory.toFixed(1)}%
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium flex items-center gap-2">
                      <Hand className="h-4 w-4 text-orange-500" />
                      Cinestésico
                    </span>
                    <Badge variant={evolution.kinesthetic >= 0 ? 'default' : 'destructive'}>
                      {evolution.kinesthetic >= 0 ? '+' : ''}{evolution.kinesthetic.toFixed(1)}%
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Gráfico de Radar */}
        {selectedTest && (
          <RadarChart
            data={{
              visual: selectedTest.visual_score,
              auditivo: selectedTest.auditory_score,
              cinestesico: selectedTest.kinesthetic_score,
            }}
            title="Perfil Atual"
            description="Visualização do seu perfil de comunicação mais recente"
          />
        )}

        {/* Lista de Testes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Todos os Testes
            </CardTitle>
            <CardDescription>
              Histórico completo de testes realizados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tests.map((test, index) => (
                <div
                  key={test.id}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedTest(test)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full ${getProfileColor(test.dominant_profile)} flex items-center justify-center text-white`}>
                      {getProfileIcon(test.dominant_profile)}
                    </div>
                    <div>
                      <div className="font-semibold">
                        Teste #{tests.length - index}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(test.created_at)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right hidden md:block">
                      <div className="text-sm text-muted-foreground">Pontuação</div>
                      <div className="font-bold">{test.total_score}</div>
                    </div>

                    <Badge variant="outline">
                      {getProfileName(test.dominant_profile)}
                    </Badge>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/results?test_id=${test.id}`);
                      }}
                    >
                      Ver Detalhes
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Ações */}
        <div className="flex justify-center gap-4">
          <Button onClick={() => navigate('/test')} size="lg">
            Fazer Novo Teste
          </Button>
          <Button variant="outline" onClick={() => navigate('/analytics')} size="lg">
            <BarChart3 className="mr-2 h-4 w-4" />
            Ver Analytics
          </Button>
        </div>
      </div>
    </div>
  );
}

