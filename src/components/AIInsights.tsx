/**
 * AI Insights Component
 * Componente para exibir insights gerados por IA
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Brain, 
  Lightbulb, 
  TrendingUp, 
  Target, 
  Briefcase, 
  MessageSquare,
  Sparkles,
  RefreshCw,
  Download
} from 'lucide-react';
import { analyzeProfileWithAI, type AIAnalysisResult, type UserProfile } from '@/services/aiAnalysis';
import { toast } from 'sonner';

interface AIInsightsProps {
  profile: UserProfile;
  onAnalysisComplete?: (analysis: AIAnalysisResult) => void;
}

export function AIInsights({ profile, onAnalysisComplete }: AIInsightsProps) {
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAnalysis();
  }, [profile]);

  const loadAnalysis = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await analyzeProfileWithAI(profile);
      setAnalysis(result);
      onAnalysisComplete?.(result);
      toast.success('Análise com IA concluída!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao gerar análise';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadAnalysis();
  };

  const handleDownload = () => {
    if (!analysis) return;
    
    const content = generateReportContent(analysis, profile);
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analise-ia-${profile.profileType}-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Relatório baixado com sucesso!');
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          {error}
          <Button onClick={handleRefresh} variant="outline" size="sm" className="ml-4">
            Tentar Novamente
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!analysis) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  Análise com Inteligência Artificial
                  <Badge variant="secondary" className="ml-2">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Powered by AI
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Insights personalizados baseados no seu perfil {profile.profileType}
                </CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleRefresh} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Atualizar
              </Button>
              <Button onClick={handleDownload} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Baixar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Target className="h-4 w-4" />
            <span>Confiança da análise: {(analysis.confidence * 100).toFixed(0)}%</span>
          </div>
        </CardContent>
      </Card>

      {/* Tabs com diferentes seções */}
      <Tabs defaultValue="insights" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="strengths">Pontos Fortes</TabsTrigger>
          <TabsTrigger value="improvements">Melhorias</TabsTrigger>
          <TabsTrigger value="recommendations">Recomendações</TabsTrigger>
          <TabsTrigger value="career">Carreira</TabsTrigger>
          <TabsTrigger value="tips">Dicas</TabsTrigger>
          <TabsTrigger value="traits">Traços</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-4">
          <InsightsSection
            title="Principais Insights"
            icon={<Lightbulb className="h-5 w-5" />}
            items={analysis.insights}
            color="blue"
          />
        </TabsContent>

        <TabsContent value="strengths" className="space-y-4">
          <InsightsSection
            title="Seus Pontos Fortes"
            icon={<TrendingUp className="h-5 w-5" />}
            items={analysis.strengths}
            color="green"
          />
        </TabsContent>

        <TabsContent value="improvements" className="space-y-4">
          <InsightsSection
            title="Áreas para Desenvolvimento"
            icon={<Target className="h-5 w-5" />}
            items={analysis.areasForImprovement}
            color="orange"
          />
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <InsightsSection
            title="Recomendações Práticas"
            icon={<MessageSquare className="h-5 w-5" />}
            items={analysis.recommendations}
            color="purple"
          />
        </TabsContent>

        <TabsContent value="career" className="space-y-4">
          <InsightsSection
            title="Sugestões de Carreira"
            icon={<Briefcase className="h-5 w-5" />}
            items={analysis.careerSuggestions}
            color="indigo"
          />
        </TabsContent>

        <TabsContent value="tips" className="space-y-4">
          <InsightsSection
            title="Dicas de Comunicação"
            icon={<MessageSquare className="h-5 w-5" />}
            items={analysis.communicationTips}
            color="teal"
          />
        </TabsContent>

        <TabsContent value="traits" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Traços de Personalidade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {analysis.personalityTraits.map((trait, index) => (
                  <Badge key={index} variant="outline" className="text-sm py-2 px-3">
                    {trait}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface InsightsSectionProps {
  title: string;
  icon: React.ReactNode;
  items: string[];
  color: string;
}

function InsightsSection({ title, icon, items, color }: InsightsSectionProps) {
  const colorClasses = {
    blue: 'bg-blue-500/10 text-blue-700 dark:text-blue-300',
    green: 'bg-green-500/10 text-green-700 dark:text-green-300',
    orange: 'bg-orange-500/10 text-orange-700 dark:text-orange-300',
    purple: 'bg-purple-500/10 text-purple-700 dark:text-purple-300',
    indigo: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300',
    teal: 'bg-teal-500/10 text-teal-700 dark:text-teal-300',
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {items.map((item, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className={`mt-1 p-1 rounded-full ${colorClasses[color as keyof typeof colorClasses] || colorClasses.blue}`}>
                <div className="h-2 w-2 rounded-full bg-current" />
              </div>
              <span className="flex-1 text-sm leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-1/4" />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/3" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-start gap-3">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 flex-1" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function generateReportContent(analysis: AIAnalysisResult, profile: UserProfile): string {
  return `# Relatório de Análise com IA - Perfil ${profile.profileType}

**Data:** ${new Date().toLocaleDateString('pt-BR')}
**Confiança da Análise:** ${(analysis.confidence * 100).toFixed(0)}%

---

## 📊 Pontuações do Perfil

- **Visual:** ${profile.scores.visual}%
- **Auditivo:** ${profile.scores.auditivo}%
- **Cinestésico:** ${profile.scores.cinestesico}%

---

## 💡 Principais Insights

${analysis.insights.map((item, i) => `${i + 1}. ${item}`).join('\n')}

---

## ✨ Pontos Fortes

${analysis.strengths.map((item, i) => `${i + 1}. ${item}`).join('\n')}

---

## 🎯 Áreas para Desenvolvimento

${analysis.areasForImprovement.map((item, i) => `${i + 1}. ${item}`).join('\n')}

---

## 📋 Recomendações Práticas

${analysis.recommendations.map((item, i) => `${i + 1}. ${item}`).join('\n')}

---

## 💼 Sugestões de Carreira

${analysis.careerSuggestions.map((item, i) => `${i + 1}. ${item}`).join('\n')}

---

## 💬 Dicas de Comunicação

${analysis.communicationTips.map((item, i) => `${i + 1}. ${item}`).join('\n')}

---

## 🧠 Traços de Personalidade

${analysis.personalityTraits.map((item, i) => `- ${item}`).join('\n')}

---

**Relatório gerado por:** ComunicaPro AI Analysis
**Tecnologia:** OpenAI GPT-4
`;
}

export default AIInsights;

