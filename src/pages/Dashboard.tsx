import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { 
  TrendingUp, 
  Eye, 
  Ear, 
  Hand, 
  Trophy, 
  Calendar,
  BarChart3,
  Target,
  Award
} from "lucide-react";

interface TestHistory {
  id: string;
  session_id: string;
  answers: Record<number, string>;
  created_at: string;
  result_type: "visual" | "auditivo" | "cinestesico";
  scores: {
    visual: number;
    auditivo: number;
    cinestesico: number;
  };
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState<TestHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [achievements, setAchievements] = useState<string[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const { data, error } = await supabase
        .from("test_progress")
        .select("*")
        .order("created_at", { ascending: false });

      if (data && !error) {
        const processedHistory = data.map(item => {
          const scores = calculateScores(item.answers as Record<number, string>);
          return {
            ...item,
            result_type: scores.primary,
            scores: scores.scores
          };
        });
        setHistory(processedHistory as TestHistory[]);
        checkAchievements(processedHistory);
      }
    } catch (error) {
      console.error("Erro ao carregar histórico:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateScores = (answers: Record<number, string>) => {
    const scores = {
      visual: 0,
      auditivo: 0,
      cinestesico: 0
    };

    Object.values(answers).forEach((answer) => {
      if (answer === "a") scores.visual++;
      else if (answer === "b") scores.auditivo++;
      else if (answer === "c") scores.cinestesico++;
    });

    const primary = Object.entries(scores).reduce((a, b) => 
      scores[a[0] as keyof typeof scores] > scores[b[0] as keyof typeof scores] ? a : b
    )[0] as "visual" | "auditivo" | "cinestesico";

    return { primary, scores };
  };

  const checkAchievements = (testHistory: any[]) => {
    const badges: string[] = [];
    
    if (testHistory.length >= 1) badges.push("Primeira Jornada");
    if (testHistory.length >= 3) badges.push("Explorador");
    if (testHistory.length >= 5) badges.push("Autoconhecimento Master");
    if (testHistory.length >= 10) badges.push("Guru da Comunicação");
    
    const types = new Set(testHistory.map(t => t.result_type));
    if (types.size === 3) badges.push("Versátil");
    
    setAchievements(badges);
  };

  const getProfileIcon = (type: string) => {
    switch (type) {
      case "visual": return <Eye className="w-5 h-5" />;
      case "auditivo": return <Ear className="w-5 h-5" />;
      case "cinestesico": return <Hand className="w-5 h-5" />;
      default: return null;
    }
  };

  const getProfileColor = (type: string) => {
    switch (type) {
      case "visual": return "from-blue-500 to-purple-500";
      case "auditivo": return "from-green-500 to-teal-500";
      case "cinestesico": return "from-orange-500 to-red-500";
      default: return "from-gray-500 to-gray-700";
    }
  };

  const getProfileName = (type: string) => {
    switch (type) {
      case "visual": return "Visual";
      case "auditivo": return "Auditivo";
      case "cinestesico": return "Cinestésico";
      default: return "Desconhecido";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando seu histórico...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-4"
          >
            ← Voltar ao Início
          </Button>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Meu Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">
            Acompanhe sua evolução e conquistas
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Testes Realizados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{history.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Continue explorando seu perfil
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Target className="w-4 h-4" />
                Perfil Dominante
              </CardTitle>
            </CardHeader>
            <CardContent>
              {history.length > 0 && (
                <div className="flex items-center gap-2">
                  {getProfileIcon(history[0].result_type)}
                  <span className="text-2xl font-bold">
                    {getProfileName(history[0].result_type)}
                  </span>
                </div>
              )}
              {history.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Faça seu primeiro teste
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                Conquistas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{achievements.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {achievements.length > 0 ? "Parabéns!" : "Comece a desbloquear"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Achievements */}
        {achievements.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Suas Conquistas
              </CardTitle>
              <CardDescription>
                Badges desbloqueados pela sua jornada de autoconhecimento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {achievements.map((badge, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="px-4 py-2 text-sm bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30"
                  >
                    <Trophy className="w-4 h-4 mr-2" />
                    {badge}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Histórico de Testes
            </CardTitle>
            <CardDescription>
              Veja sua evolução ao longo do tempo
            </CardDescription>
          </CardHeader>
          <CardContent>
            {history.length === 0 ? (
              <div className="text-center py-12">
                <TrendingUp className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-muted-foreground mb-4">
                  Você ainda não realizou nenhum teste
                </p>
                <Button onClick={() => navigate("/test")}>
                  Fazer Primeiro Teste
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {history.map((test, index) => (
                  <div
                    key={test.id}
                    className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-full bg-gradient-to-r ${getProfileColor(test.result_type)}`}>
                          <div className="text-white">
                            {getProfileIcon(test.result_type)}
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold">
                            Perfil {getProfileName(test.result_type)}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(test.created_at).toLocaleDateString("pt-BR", {
                              day: "2-digit",
                              month: "long",
                              year: "numeric"
                            })}
                          </p>
                        </div>
                      </div>
                      {index === 0 && (
                        <Badge variant="secondary">Mais Recente</Badge>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <Eye className="w-4 h-4" /> Visual
                        </span>
                        <span className="font-medium">{test.scores.visual}</span>
                      </div>
                      <Progress value={(test.scores.visual / 30) * 100} className="h-2" />
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <Ear className="w-4 h-4" /> Auditivo
                        </span>
                        <span className="font-medium">{test.scores.auditivo}</span>
                      </div>
                      <Progress value={(test.scores.auditivo / 30) * 100} className="h-2" />
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <Hand className="w-4 h-4" /> Cinestésico
                        </span>
                        <span className="font-medium">{test.scores.cinestesico}</span>
                      </div>
                      <Progress value={(test.scores.cinestesico / 30) * 100} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="mt-8 text-center">
          <Button
            size="lg"
            onClick={() => navigate("/test")}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            Fazer Novo Teste
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
