import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Trophy, Star, Target, Zap, Award, Lock, CheckCircle2, Globe } from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  requirement: number;
  current: number;
  unlocked: boolean;
  category: "tests" | "social" | "learning" | "special";
  points: number;
}

export default function Achievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Autenticação necessária",
          description: "Faça login para ver suas conquistas.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Buscar dados do usuário
      const { data: testsData, count: testsCount } = await supabase
        .from("test_results")
        .select("*", { count: "exact" })
        .eq("user_id", user.id);

      const { data: reviewsData, count: reviewsCount } = await supabase
        .from("reviews")
        .select("*", { count: "exact" })
        .eq("user_id", user.id);

      // Definir conquistas
      // NOVAS CONQUISTAS 27/10/2025
      const aiInsightsUsed = testsData?.some(t => t.ai_insights_used) || false;
      const marketInsightsViewed = true; // Simular que o usuário visualizou a nova página
      // FIM NOVAS CONQUISTAS
      const allAchievements: Achievement[] = [
        {
          id: "first_test",
          title: "Primeiro Passo",
          description: "Complete seu primeiro teste de comunicação",
          icon: Star,
          requirement: 1,
          current: testsCount || 0,
          unlocked: (testsCount || 0) >= 1,
          category: "tests",
          points: 10,
        },
        {
          id: "five_tests",
          title: "Explorador",
          description: "Complete 5 testes de comunicação",
          icon: Target,
          requirement: 5,
          current: testsCount || 0,
          unlocked: (testsCount || 0) >= 5,
          category: "tests",
          points: 50,
        },
        {
          id: "ten_tests",
          title: "Mestre da Comunicação",
          description: "Complete 10 testes de comunicação",
          icon: Trophy,
          requirement: 10,
          current: testsCount || 0,
          unlocked: (testsCount || 0) >= 10,
          category: "tests",
          points: 100,
        },
        {
          id: "first_review",
          title: "Voz Ativa",
          description: "Deixe sua primeira avaliação",
          icon: Award,
          requirement: 1,
          current: reviewsCount || 0,
          unlocked: (reviewsCount || 0) >= 1,
          category: "social",
          points: 25,
        },
        {
          id: "perfect_score",
          title: "Perfeccionista",
          description: "Obtenha 100% em um teste",
          icon: Zap,
          requirement: 1,
          current: testsData?.some(t => 
            Math.max(t.visual_score || 0, t.auditory_score || 0, t.kinesthetic_score || 0) === 100
          ) ? 1 : 0,
          unlocked: testsData?.some(t => 
            Math.max(t.visual_score || 0, t.auditory_score || 0, t.kinesthetic_score || 0) === 100
          ) || false,
          category: "special",
          points: 150,
        },
        {
          id: "all_profiles",
          title: "Camaleão",
          description: "Descubra todos os 3 perfis de comunicação",
          icon: Trophy,
          requirement: 3,
          current: new Set(testsData?.map(t => t.profile_type)).size || 0,
          unlocked: new Set(testsData?.map(t => t.profile_type)).size >= 3,
          category: "learning",
          points: 200,
        },
        {
          id: "ai_insights_user",
          title: "Mente Analítica",
          description: "Use o recurso de Insights de IA (PAPP) pela primeira vez",
          icon: Zap,
          requirement: 1,
          current: aiInsightsUsed ? 1 : 0,
          unlocked: aiInsightsUsed,
          category: "special",
          points: 75,
        },
        {
          id: "market_explorer",
          title: "Explorador de Mercado",
          description: "Visite a página de Insights de Mercado",
          icon: Globe,
          requirement: 1,
          current: marketInsightsViewed ? 1 : 0,
          unlocked: marketInsightsViewed,
          category: "social",
          points: 50,
        },
      ];

      setAchievements(allAchievements);
      
      const points = allAchievements
        .filter(a => a.unlocked)
        .reduce((sum, a) => sum + a.points, 0);
      
      setTotalPoints(points);
    } catch (error) {
      console.error("Erro ao carregar conquistas:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar suas conquistas.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "tests": return Target;
      case "social": return Award;
      case "learning": return Star;
      case "special": return Trophy;
      default: return Star;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "tests": return "bg-blue-500";
      case "social": return "bg-green-500";
      case "learning": return "bg-purple-500";
      case "special": return "bg-yellow-500";
      default: return "bg-gray-500";
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

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const completionPercentage = (unlockedCount / totalCount) * 100;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Conquistas</h1>
        <p className="text-muted-foreground">
          Acompanhe seu progresso e desbloqueie recompensas especiais
        </p>
      </div>

      {/* Resumo de Progresso */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            Seu Progresso
          </CardTitle>
          <CardDescription>
            {unlockedCount} de {totalCount} conquistas desbloqueadas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Progresso Total</span>
              <span className="text-sm text-muted-foreground">
                {completionPercentage.toFixed(0)}%
              </span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
          </div>
          
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            <span className="text-2xl font-bold">{totalPoints}</span>
            <span className="text-muted-foreground">pontos totais</span>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Conquistas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {achievements.map((achievement) => {
          const Icon = achievement.icon;
          const progress = Math.min((achievement.current / achievement.requirement) * 100, 100);
          
          return (
            <Card 
              key={achievement.id} 
              className={`relative overflow-hidden ${
                achievement.unlocked ? "border-primary" : "opacity-75"
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-lg ${getCategoryColor(achievement.category)}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  {achievement.unlocked ? (
                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                  ) : (
                    <Lock className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                <CardTitle className="text-lg mt-4">{achievement.title}</CardTitle>
                <CardDescription>{achievement.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progresso</span>
                    <span className="font-medium">
                      {achievement.current}/{achievement.requirement}
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  
                  <div className="flex items-center justify-between pt-2">
                    <Badge variant={achievement.unlocked ? "default" : "secondary"}>
                      {achievement.category}
                    </Badge>
                    <span className="text-sm font-medium text-yellow-600">
                      +{achievement.points} pts
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Mensagem de Incentivo */}
      {unlockedCount < totalCount && (
        <Card className="mt-8 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Continue Progredindo!
            </CardTitle>
            <CardDescription>
              Você está a {totalCount - unlockedCount} conquista(s) de completar sua coleção.
              Continue fazendo testes e interagindo com a plataforma para desbloquear mais recompensas!
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  );
}

