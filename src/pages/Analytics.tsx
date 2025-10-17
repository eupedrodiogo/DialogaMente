import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Users, TrendingUp, Award, Activity } from "lucide-react";

interface AnalyticsData {
  totalUsers: number;
  totalTests: number;
  profileDistribution: { name: string; value: number; color: string }[];
  testsOverTime: { date: string; count: number }[];
  averageScore: number;
}

const COLORS = {
  Visual: "#8B5CF6",
  Auditivo: "#3B82F6",
  Cinestésico: "#10B981",
};

export default function Analytics() {
  const [data, setData] = useState<AnalyticsData>({
    totalUsers: 0,
    totalTests: 0,
    profileDistribution: [],
    testsOverTime: [],
    averageScore: 0,
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      // Buscar total de usuários
      const { count: usersCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      // Buscar total de testes
      const { data: testsData, count: testsCount } = await supabase
        .from("test_results")
        .select("*", { count: "exact" });

      // Calcular distribuição de perfis
      const profileCounts: Record<string, number> = {
        Visual: 0,
        Auditivo: 0,
        Cinestésico: 0,
      };

      testsData?.forEach((test) => {
        const profile = test.profile_type;
        if (profile && profileCounts.hasOwnProperty(profile)) {
          profileCounts[profile]++;
        }
      });

      const profileDistribution = Object.entries(profileCounts).map(([name, value]) => ({
        name,
        value,
        color: COLORS[name as keyof typeof COLORS],
      }));

      // Calcular testes ao longo do tempo (últimos 7 dias)
      const testsOverTime = await getTestsOverTime();

      // Calcular média de pontuação
      const scores = testsData?.map((test) => {
        const maxScore = Math.max(
          test.visual_score || 0,
          test.auditory_score || 0,
          test.kinesthetic_score || 0
        );
        return maxScore;
      }) || [];
      
      const averageScore = scores.length > 0 
        ? scores.reduce((a, b) => a + b, 0) / scores.length 
        : 0;

      setData({
        totalUsers: usersCount || 0,
        totalTests: testsCount || 0,
        profileDistribution,
        testsOverTime,
        averageScore: Math.round(averageScore),
      });
    } catch (error) {
      console.error("Erro ao carregar analytics:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados de analytics.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getTestsOverTime = async () => {
    const days = 7;
    const result = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      
      const { count } = await supabase
        .from("test_results")
        .select("*", { count: "exact", head: true })
        .gte("created_at", `${dateStr}T00:00:00`)
        .lt("created_at", `${dateStr}T23:59:59`);
      
      result.push({
        date: date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
        count: count || 0,
      });
    }
    
    return result;
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

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Analytics Dashboard</h1>
        <p className="text-muted-foreground">
          Visualize métricas e insights sobre o uso da plataforma
        </p>
      </div>

      {/* Cards de Métricas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Usuários cadastrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Testes Realizados</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalTests}</div>
            <p className="text-xs text-muted-foreground">Testes completados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pontuação Média</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.averageScore}%</div>
            <p className="text-xs text-muted-foreground">Média geral</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.totalUsers > 0 
                ? Math.round((data.totalTests / data.totalUsers) * 100) 
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Usuários que completaram teste</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <Tabs defaultValue="distribution" className="space-y-4">
        <TabsList>
          <TabsTrigger value="distribution">Distribuição de Perfis</TabsTrigger>
          <TabsTrigger value="timeline">Testes ao Longo do Tempo</TabsTrigger>
        </TabsList>

        <TabsContent value="distribution" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Distribuição de Perfis de Comunicação</CardTitle>
              <CardDescription>
                Proporção de cada tipo de perfil identificado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={data.profileDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {data.profileDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {data.profileDistribution.map((profile) => (
                  <Card key={profile.name}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">{profile.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{profile.value}</div>
                      <p className="text-xs text-muted-foreground">
                        {data.totalTests > 0 
                          ? ((profile.value / data.totalTests) * 100).toFixed(1) 
                          : 0}% do total
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Testes Realizados - Últimos 7 Dias</CardTitle>
              <CardDescription>
                Evolução do número de testes completados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={data.testsOverTime}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#8B5CF6" 
                    strokeWidth={2}
                    name="Testes"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

