import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { Users, TrendingUp, Award, RefreshCw } from "lucide-react";

interface ComparisonData {
  userProfile: string;
  userScores: {
    visual: number;
    auditory: number;
    kinesthetic: number;
  };
  averageScores: {
    visual: number;
    auditory: number;
    kinesthetic: number;
  };
  percentile: number;
  totalUsers: number;
  sameProfileCount: number;
}

export default function Compare() {
  const [data, setData] = useState<ComparisonData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadComparisonData();
  }, []);

  const loadComparisonData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Autenticação necessária",
          description: "Faça login para comparar seus resultados.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Buscar último resultado do usuário
      const { data: userTests } = await supabase
        .from("test_results")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1);

      if (!userTests || userTests.length === 0) {
        toast({
          title: "Nenhum teste encontrado",
          description: "Complete um teste primeiro para comparar seus resultados.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const userTest = userTests[0];
      const userProfile = userTest.profile_type;

      // Buscar todos os resultados para calcular médias
      const { data: allTests } = await supabase
        .from("test_results")
        .select("*");

      if (!allTests || allTests.length === 0) {
        setLoading(false);
        return;
      }

      // Calcular médias globais
      const totalTests = allTests.length;
      const avgVisual = allTests.reduce((sum, t) => sum + (t.visual_score || 0), 0) / totalTests;
      const avgAuditory = allTests.reduce((sum, t) => sum + (t.auditory_score || 0), 0) / totalTests;
      const avgKinesthetic = allTests.reduce((sum, t) => sum + (t.kinesthetic_score || 0), 0) / totalTests;

      // Contar usuários com o mesmo perfil
      const sameProfileCount = allTests.filter(t => t.profile_type === userProfile).length;

      // Calcular percentil (baseado na pontuação máxima)
      const userMaxScore = Math.max(
        userTest.visual_score || 0,
        userTest.auditory_score || 0,
        userTest.kinesthetic_score || 0
      );
      
      const scoresBelow = allTests.filter(t => {
        const maxScore = Math.max(
          t.visual_score || 0,
          t.auditory_score || 0,
          t.kinesthetic_score || 0
        );
        return maxScore < userMaxScore;
      }).length;

      const percentile = Math.round((scoresBelow / totalTests) * 100);

      setData({
        userProfile,
        userScores: {
          visual: userTest.visual_score || 0,
          auditory: userTest.auditory_score || 0,
          kinesthetic: userTest.kinesthetic_score || 0,
        },
        averageScores: {
          visual: Math.round(avgVisual),
          auditory: Math.round(avgAuditory),
          kinesthetic: Math.round(avgKinesthetic),
        },
        percentile,
        totalUsers: totalTests,
        sameProfileCount,
      });
    } catch (error) {
      console.error("Erro ao carregar dados de comparação:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados de comparação.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card>
          <CardHeader>
            <CardTitle>Nenhum resultado disponível</CardTitle>
            <CardDescription>
              Complete um teste primeiro para comparar seus resultados com outros usuários.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.href = "/test"}>
              Fazer Teste Agora
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const barChartData = [
    {
      name: "Visual",
      "Você": data.userScores.visual,
      "Média": data.averageScores.visual,
    },
    {
      name: "Auditivo",
      "Você": data.userScores.auditory,
      "Média": data.averageScores.auditory,
    },
    {
      name: "Cinestésico",
      "Você": data.userScores.kinesthetic,
      "Média": data.averageScores.kinesthetic,
    },
  ];

  const radarChartData = [
    {
      subject: "Visual",
      user: data.userScores.visual,
      average: data.averageScores.visual,
      fullMark: 100,
    },
    {
      subject: "Auditivo",
      user: data.userScores.auditory,
      average: data.averageScores.auditory,
      fullMark: 100,
    },
    {
      subject: "Cinestésico",
      user: data.userScores.kinesthetic,
      average: data.averageScores.kinesthetic,
      fullMark: 100,
    },
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Compare Seus Resultados</h1>
          <p className="text-muted-foreground">
            Veja como você se compara com outros usuários da plataforma
          </p>
        </div>
        <Button onClick={loadComparisonData} variant="outline" size="icon">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Seu Perfil</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.userProfile}</div>
            <p className="text-xs text-muted-foreground">
              Perfil dominante identificado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Percentil</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.percentile}º</div>
            <p className="text-xs text-muted-foreground">
              Você está melhor que {data.percentile}% dos usuários
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mesmo Perfil</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.sameProfileCount}</div>
            <p className="text-xs text-muted-foreground">
              Usuários com perfil {data.userProfile}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos de Comparação */}
      <Tabs defaultValue="bar" className="space-y-4">
        <TabsList>
          <TabsTrigger value="bar">Gráfico de Barras</TabsTrigger>
          <TabsTrigger value="radar">Gráfico Radar</TabsTrigger>
        </TabsList>

        <TabsContent value="bar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Comparação de Pontuações</CardTitle>
              <CardDescription>
                Suas pontuações vs. média de todos os usuários ({data.totalUsers} testes)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Você" fill="#8B5CF6" />
                  <Bar dataKey="Média" fill="#94A3B8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="radar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Perfil Multidimensional</CardTitle>
              <CardDescription>
                Visualização radar das suas características vs. média
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={radarChartData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis domain={[0, 100]} />
                  <Radar
                    name="Você"
                    dataKey="user"
                    stroke="#8B5CF6"
                    fill="#8B5CF6"
                    fillOpacity={0.6}
                  />
                  <Radar
                    name="Média"
                    dataKey="average"
                    stroke="#94A3B8"
                    fill="#94A3B8"
                    fillOpacity={0.3}
                  />
                  <Legend />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Insights */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Insights Personalizados</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.percentile >= 75 && (
            <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-950 rounded-lg">
              <Award className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-green-900 dark:text-green-100">
                  Excelente desempenho!
                </p>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Você está no top 25% dos usuários. Suas habilidades de comunicação estão muito bem desenvolvidas.
                </p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <Users className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="font-medium text-blue-900 dark:text-blue-100">
                Comunidade {data.userProfile}
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                {((data.sameProfileCount / data.totalUsers) * 100).toFixed(1)}% dos usuários compartilham seu perfil dominante.
              </p>
            </div>
          </div>

          {data.userScores.visual > data.averageScores.visual + 10 && (
            <div className="flex items-start gap-3 p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
              <TrendingUp className="h-5 w-5 text-purple-600 mt-0.5" />
              <div>
                <p className="font-medium text-purple-900 dark:text-purple-100">
                  Destaque Visual
                </p>
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  Sua pontuação visual está significativamente acima da média. Você processa informações visuais excepcionalmente bem.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

