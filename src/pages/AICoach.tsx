/**
 * AI Coach Page
 * Página de coaching com IA para desenvolvimento de comunicação
 */

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Bot,
  Send,
  Sparkles,
  BookOpen,
  Target,
  Calendar,
  MessageSquare,
  Loader2,
  User,
  TrendingUp,
  Download
} from 'lucide-react';
import {
  askCommunicationBot,
  generateContentRecommendations,
  generateDevelopmentPlan,
  type UserProfile
} from '@/services/aiAnalysis';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AICoach() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Olá! Sou seu coach de comunicação com IA. Como posso ajudá-lo hoje a desenvolver suas habilidades de comunicação?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Carregar perfil do usuário
  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    }
  });

  const { data: testResults } = useQuery({
    queryKey: ['latest-test-result', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      const { data, error } = await supabase
        .from('test_results')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id
  });

  useEffect(() => {
    if (testResults) {
      setUserProfile({
        profileType: testResults.profile_type as 'Visual' | 'Auditivo' | 'Cinestésico',
        scores: {
          visual: testResults.visual_score || 0,
          auditivo: testResults.auditory_score || 0,
          cinestesico: testResults.kinesthetic_score || 0
        }
      });
    }
  }, [testResults]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await askCommunicationBot(input, userProfile || undefined);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      toast.error('Erro ao processar mensagem');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickQuestion = (question: string) => {
    setInput(question);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Bot className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold flex items-center gap-2">
              AI Coach
              <Badge variant="secondary" className="ml-2">
                <Sparkles className="h-3 w-3 mr-1" />
                Beta
              </Badge>
            </h1>
            <p className="text-muted-foreground mt-1">
              Seu coach pessoal de comunicação com inteligência artificial
            </p>
          </div>
        </div>
        
        {userProfile && (
          <Alert className="mt-4">
            <TrendingUp className="h-4 w-4" />
            <AlertDescription>
              Coach personalizado para perfil <strong>{userProfile.profileType}</strong>
            </AlertDescription>
          </Alert>
        )}
      </div>

      <Tabs defaultValue="chat" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="chat">
            <MessageSquare className="h-4 w-4 mr-2" />
            Chat
          </TabsTrigger>
          <TabsTrigger value="recommendations">
            <BookOpen className="h-4 w-4 mr-2" />
            Recomendações
          </TabsTrigger>
          <TabsTrigger value="plan">
            <Target className="h-4 w-4 mr-2" />
            Plano de Desenvolvimento
          </TabsTrigger>
          <TabsTrigger value="resources">
            <Calendar className="h-4 w-4 mr-2" />
            Recursos
          </TabsTrigger>
        </TabsList>

        {/* Chat Tab */}
        <TabsContent value="chat" className="space-y-4">
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle>Converse com seu AI Coach</CardTitle>
              <CardDescription>
                Faça perguntas sobre comunicação, peça conselhos ou discuta desafios
              </CardDescription>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col gap-4">
              {/* Messages Area */}
              <ScrollArea className="flex-1 pr-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {message.role === 'assistant' && (
                        <div className="p-2 bg-primary/10 rounded-full h-fit">
                          <Bot className="h-4 w-4 text-primary" />
                        </div>
                      )}
                      
                      <div
                        className={`max-w-[80%] rounded-lg p-4 ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        <span className="text-xs opacity-70 mt-2 block">
                          {message.timestamp.toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      
                      {message.role === 'user' && (
                        <div className="p-2 bg-primary/10 rounded-full h-fit">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {loading && (
                    <div className="flex gap-3 justify-start">
                      <div className="p-2 bg-primary/10 rounded-full h-fit">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                      <div className="bg-muted rounded-lg p-4">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              <Separator />

              {/* Quick Questions */}
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Perguntas rápidas:</p>
                <div className="flex flex-wrap gap-2">
                  {quickQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickQuestion(question)}
                      disabled={loading}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Input Area */}
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Digite sua mensagem..."
                  disabled={loading}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} disabled={loading || !input.trim()}>
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations">
          <RecommendationsSection profile={userProfile} />
        </TabsContent>

        {/* Development Plan Tab */}
        <TabsContent value="plan">
          <DevelopmentPlanSection profile={userProfile} />
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources">
          <ResourcesSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function RecommendationsSection({ profile }: { profile: UserProfile | null }) {
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const loadRecommendations = async () => {
    if (!profile) {
      toast.error('Complete o teste primeiro para receber recomendações personalizadas');
      return;
    }

    setLoading(true);
    try {
      const recs = await generateContentRecommendations(profile);
      setRecommendations(recs);
    } catch (error) {
      toast.error('Erro ao carregar recomendações');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profile) {
      loadRecommendations();
    }
  }, [profile]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recomendações Personalizadas</CardTitle>
        <CardDescription>
          Conteúdos selecionados especialmente para o seu perfil
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : recommendations.length > 0 ? (
          <ul className="space-y-3">
            {recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                <BookOpen className="h-5 w-5 text-primary mt-0.5" />
                <span className="flex-1">{rec}</span>
              </li>
            ))}
          </ul>
        ) : (
          <Alert>
            <AlertDescription>
              Complete o teste de perfil para receber recomendações personalizadas
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}

function DevelopmentPlanSection({ profile }: { profile: UserProfile | null }) {
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [timeframe, setTimeframe] = useState<30 | 60 | 90>(30);

  const loadPlan = async () => {
    if (!profile) {
      toast.error('Complete o teste primeiro para gerar um plano de desenvolvimento');
      return;
    }

    setLoading(true);
    try {
      const devPlan = await generateDevelopmentPlan(profile, timeframe);
      setPlan(devPlan);
    } catch (error) {
      toast.error('Erro ao gerar plano de desenvolvimento');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profile) {
      loadPlan();
    }
  }, [profile, timeframe]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Plano de Desenvolvimento</CardTitle>
            <CardDescription>
              Roteiro personalizado para evoluir suas habilidades
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {[30, 60, 90].map((days) => (
              <Button
                key={days}
                variant={timeframe === days ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeframe(days as 30 | 60 | 90)}
              >
                {days} dias
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : plan ? (
          <div className="space-y-6">
            <PlanSection title="Objetivos" items={plan.goals} icon={<Target />} />
            <PlanSection title="Ações Semanais" items={plan.weeklyActions} icon={<Calendar />} />
            <PlanSection title="Marcos" items={plan.milestones} icon={<TrendingUp />} />
            <PlanSection title="Recursos" items={plan.resources} icon={<BookOpen />} />
          </div>
        ) : (
          <Alert>
            <AlertDescription>
              Complete o teste de perfil para gerar um plano de desenvolvimento
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}

function PlanSection({ title, items, icon }: { title: string; items: string[]; icon: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-semibold flex items-center gap-2 mb-3">
        {icon}
        {title}
      </h3>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-2 text-sm">
            <span className="text-primary mt-1">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ResourcesSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recursos de Aprendizado</CardTitle>
        <CardDescription>
          Materiais complementares para seu desenvolvimento
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {resources.map((resource, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{resource.title}</CardTitle>
                <CardDescription>{resource.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Acessar
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

const quickQuestions = [
  'Como melhorar minha comunicação?',
  'Dicas para apresentações',
  'Como lidar com conflitos?',
  'Networking eficaz'
];

const resources = [
  {
    title: 'Guia de Comunicação Eficaz',
    description: 'E-book completo sobre técnicas de comunicação'
  },
  {
    title: 'Templates de Apresentação',
    description: 'Modelos profissionais para suas apresentações'
  },
  {
    title: 'Exercícios Práticos',
    description: 'Atividades para desenvolver suas habilidades'
  },
  {
    title: 'Vídeo-aulas',
    description: 'Masterclasses sobre comunicação profissional'
  }
];

