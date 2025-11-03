import { useEffect, useState } from 'react';
import { getPersonalizedRecommendations } from '../services/recommendationService';
import { BasicProfileResult } from '../services/recommendationService'; // Usando o tipo placeholder
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, GraduationCap, Briefcase, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

// Mock de dados do perfil para demonstração
const mockProfile: BasicProfileResult = {
  dominantPreference: 'Visual', // Simula o resultado do teste do usuário
  score: 85,
  history: [],
};

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setIsLoading(true);
      // Em um ambiente real, o 'mockProfile' seria substituído pelo perfil real do usuário logado
      const data = await getPersonalizedRecommendations(mockProfile);
      setRecommendations(data);
      setIsLoading(false);
    };

    fetchRecommendations();
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'course':
        return <GraduationCap className="w-6 h-6 text-primary" />;
      case 'article':
        return <BookOpen className="w-6 h-6 text-primary" />;
      case 'exercise':
        return <ArrowRight className="w-6 h-6 text-primary" />;
      case 'career':
        return <Briefcase className="w-6 h-6 text-primary" />;
      default:
        return <ArrowRight className="w-6 h-6 text-primary" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="ml-2">Gerando recomendações personalizadas...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-2">Seu Plano de Desenvolvimento Personalizado</h1>
      <p className="text-lg text-muted-foreground mb-6">
        Baseado em seu perfil de comunicação **{mockProfile.dominantPreference}**, estas são as recomendações mais relevantes para o seu crescimento.
      </p>
      <Separator className="mb-8" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((rec) => (
          <Card key={rec.id} className="flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center space-x-3 mb-2">
                {getIcon(rec.type)}
                <CardTitle className="text-xl">{rec.title}</CardTitle>
              </div>
              <CardDescription className="capitalize text-sm font-medium text-primary">
                {rec.type} - Relevância: {(rec.relevanceScore * 100).toFixed(0)}%
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{rec.description}</p>
              <Button asChild className="w-full">
                <a href={rec.link} target="_blank" rel="noopener noreferrer">
                  Acessar Recurso <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-10 p-6 bg-secondary/50 rounded-lg border border-dashed">
        <h2 className="text-2xl font-semibold mb-2">Próximos Passos</h2>
        <p className="text-muted-foreground">
          As recomendações são geradas por um modelo de IA em constante aprendizado. Quanto mais você interage com a plataforma, mais precisas elas se tornam.
        </p>
      </div>
    </div>
  );
};

export default Recommendations;
