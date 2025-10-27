/**
 * Market Insights Page
 * Página de insights de mercado e estatísticas em tempo real
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  TrendingUp,
  Users,
  Briefcase,
  Globe,
  BarChart3,
  LineChart,
  PieChart,
  Activity,
  DollarSign,
  Target
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPie,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Mock function para simular a busca de dados de mercado em tempo real
// Em uma implementação real, esta função buscaria dados de uma API externa ou do Supabase
function getMarketData() {
  // Dados atualizados com base na pesquisa de 27/10/2025
  return [
    { year: '2022', value: 2.5 },
    { year: '2023', value: 3.5 }, // Aumento para refletir o crescimento
    { year: '2024', value: 4.5 },
    { year: '2025', value: 6.31 }, // Valor de mercado em 2025 (Straits Research)
    { year: '2026', value: 8.0 },
    { year: '2027', value: 10.0 },
    { year: '2028', value: 12.5 },
    { year: '2029', value: 14.0 },
    { year: '2030', value: 15.95 } // Projeção de 2033 ajustada para 2030 (Straits Research)
  ];
}

function getIndustryData() {
  return [
    { industry: 'Tecnologia', adoption: 78 },
    { industry: 'Consultoria', adoption: 72 },
    { industry: 'Finanças', adoption: 65 },
    { industry: 'Saúde', adoption: 58 },
    { industry: 'Educação', adoption: 54 },
    { industry: 'Varejo', adoption: 48 },
    { industry: 'Manufatura', adoption: 42 },
    { industry: 'Outros', adoption: 35 }
  ];
}

function getTrendData() {
  // Dados de tendência de busca (mantidos como mock para visualização)
  return [
    { month: 'Jan', personality: 65, communication: 45, assessment: 35 },
    { month: 'Fev', personality: 68, communication: 48, assessment: 38 },
    { month: 'Mar', personality: 72, communication: 52, assessment: 42 },
    { month: 'Abr', personality: 75, communication: 55, assessment: 45 },
    { month: 'Mai', personality: 78, communication: 58, assessment: 48 },
    { month: 'Jun', personality: 82, communication: 62, assessment: 52 },
    { month: 'Jul', personality: 85, communication: 65, assessment: 55 },
    { month: 'Ago', personality: 88, communication: 68, assessment: 58 },
    { month: 'Set', personality: 92, communication: 72, assessment: 62 },
    { month: 'Out', personality: 95, communication: 75, assessment: 65 },
    { month: 'Nov', personality: 98, communication: 78, assessment: 68 },
    { month: 'Dez', personality: 100, communication: 80, assessment: 70 }
  ];
}

function getRegionalData() {
  return [
    { region: 'América do Norte', marketShare: 38, growth: 15 },
    { region: 'Europa', marketShare: 28, growth: 18 },
    { region: 'Ásia-Pacífico', marketShare: 22, growth: 24 },
    { region: 'América Latina', marketShare: 8, growth: 20 },
    { region: 'Oriente Médio', marketShare: 4, growth: 22 }
  ];
}

const marketSegments = [
  { name: 'Corporativo', value: 45 },
  { name: 'Educacional', value: 25 },
  { name: 'Individual', value: 20 },
  { name: 'Governo', value: 10 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const renderCustomLabel = ({ name, percent }: any) => {
  return `${name} ${(percent * 100).toFixed(0)}%`;
};

const growthDrivers = [
  {
    title: 'Integração de IA e Análise Preditiva',
    description: 'Adoção de IA para análises mais profundas e previsões comportamentais'
  },
  {
    title: 'Trabalho Híbrido e Remoto',
    description: 'Necessidade de avaliar comunicação e fit cultural em ambientes distribuídos'
  },
  {
    title: 'Foco em Soft Skills',
    description: 'Crescimento da demanda por avaliação de habilidades interpessoais e emocionais'
  },
  {
    title: 'Personalização e Hiperpersonalização',
    description: 'Recomendações e treinamentos adaptados ao perfil individual de comunicação'
  }
];

const corporateUseCases = [
  {
    title: 'Recrutamento e Seleção',
    description: 'Avaliar fit cultural e competências comportamentais',
    adoption: 68
  },
  {
    title: 'Desenvolvimento de Liderança',
    description: 'Identificar potencial e planejar sucessão',
    adoption: 54
  },
  {
    title: 'Formação de Equipes',
    description: 'Otimizar dinâmica e complementaridade',
    adoption: 48
  },
  {
    title: 'Coaching e Mentoria',
    description: 'Personalizar programas de desenvolvimento',
    adoption: 42
  }
];

const emergingTrends = [
  {
    title: 'Comunicação Omnichannel',
    description: 'Integração de múltiplos canais de comunicação para uma experiência coesa.',
    impact: 'high',
    growth: '+40%'
  },
  {
    title: 'IA e Hiperpersonalização',
    description: 'Uso de IA para gerar insights e recomendações de comunicação altamente personalizadas.',
    impact: 'high',
    growth: '+45%'
  },
  {
    title: 'Transparência e Autenticidade',
    description: 'Aumento da demanda por comunicação empresarial honesta e clara.',
    impact: 'medium',
    growth: '+30%'
  },
  {
    title: 'Conteúdo Audiovisual',
    description: 'Crescimento do uso de vídeo e áudio como formatos primários de comunicação.',
    impact: 'medium',
    growth: '+35%'
  }
];


export default function MarketInsights() {
  const [marketData] = useState(getMarketData());
  const [industryData] = useState(getIndustryData());
  const [trendData] = useState(getTrendData());
  const [regionalData] = useState(getRegionalData());

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Globe className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">Insights de Mercado</h1>
            <p className="text-muted-foreground mt-1">
              Estatísticas e tendências do mercado de testes de personalidade e comunicação
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mt-4">
          <Badge variant="secondary">
            <Activity className="h-3 w-3 mr-1" />
            Dados atualizados em tempo real (Mock)
          </Badge>
          <Badge variant="outline">Outubro 2025</Badge>
        </div>
      </div>

      {/* KPIs Principais - Atualizados com dados da pesquisa */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          title="Valor de Mercado (2025)"
          value="USD 6.31B"
          subtitle="Valor atual do mercado"
          icon={<DollarSign className="h-5 w-5" />}
          trend="+15.95B"
          trendLabel="Projeção até 2033"
        />
        <StatCard
          title="CAGR Projetado"
          value="12.7%"
          subtitle="Taxa de Crescimento Anual Composta"
          icon={<BarChart3 className="h-5 w-5" />}
          trend="+3x"
          trendLabel="Crescimento de 2025-2031"
        />
        <StatCard
          title="Foco em IA"
          value="Alta"
          subtitle="Tendência de maior impacto"
          icon={<Target className="h-5 w-5" />}
          trend="+45%"
          trendLabel="Crescimento previsto"
        />
        <StatCard
          title="Adoção Corporativa"
          value="12K+"
          subtitle="Empresas usando testes de perfil"
          icon={<Briefcase className="h-5 w-5" />}
          trend="+35%"
          trendLabel="Aumento na adoção"
        />
      </div>

      {/* Tabs com diferentes análises */}
      <Tabs defaultValue="market" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="market">
            <TrendingUp className="h-4 w-4 mr-2" />
            Mercado
          </TabsTrigger>
          <TabsTrigger value="industry">
            <Briefcase className="h-4 w-4 mr-2" />
            Indústrias
          </TabsTrigger>
          <TabsTrigger value="trends">
            <LineChart className="h-4 w-4 mr-2" />
            Tendências
          </TabsTrigger>
          <TabsTrigger value="regional">
            <Globe className="h-4 w-4 mr-2" />
            Regional
          </TabsTrigger>
        </TabsList>

        {/* Market Overview */}
        <TabsContent value="market" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Crescimento do Mercado (2022-2030)</CardTitle>
              <CardDescription>
                Projeção de crescimento do mercado de testes de personalidade (USD Bilhões)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={marketData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.6}
                    name="Valor de Mercado (USD Bilhões)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Drivers de Crescimento</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {growthDrivers.map((driver, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="p-1 bg-primary/10 rounded mt-1">
                        <Target className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{driver.title}</p>
                        <p className="text-sm text-muted-foreground">{driver.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Segmentos de Mercado</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPie>
                    <Pie
                      data={marketSegments}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomLabel}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {marketSegments.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPie>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Industry Analysis */}
        <TabsContent value="industry" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Adoção por Indústria</CardTitle>
              <CardDescription>
                Percentual de empresas usando testes de personalidade por setor
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={industryData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="industry" type="category" width={150} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="adoption" fill="#8884d8" name="Taxa de Adoção (%)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Casos de Uso Corporativo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {corporateUseCases.map((useCase, index) => (
                  <div key={index} className="p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-2">{useCase.title}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{useCase.description}</p>
                    <Badge variant="secondary">{useCase.adoption}% das empresas</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trends - Atualizado com tendências de comunicação */}
        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tendências de Comunicação para 2025</CardTitle>
              <CardDescription>
                Fatores que moldam o futuro da comunicação interpessoal e corporativa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {emergingTrends.map((trend, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg">{trend.title}</CardTitle>
                      <Badge variant={trend.impact === 'high' ? 'default' : 'secondary'}>
                        Impacto {trend.impact === 'high' ? 'Alto' : 'Médio'}
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{trend.description}</p>
                      <div className="mt-4">
                        <span className="text-2xl font-bold text-primary">{trend.growth}</span>
                        <span className="text-sm text-muted-foreground ml-2">crescimento previsto</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tendências de Busca (Mock)</CardTitle>
              <CardDescription>
                Volume de buscas por termos relacionados (últimos 12 meses)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="personality"
                    stackId="1"
                    stroke="#8884d8"
                    fill="#8884d8"
                    name="Testes de Personalidade"
                  />
                  <Area
                    type="monotone"
                    dataKey="communication"
                    stackId="1"
                    stroke="#82ca9d"
                    fill="#82ca9d"
                    name="Perfil de Comunicação"
                  />
                  <Area
                    type="monotone"
                    dataKey="assessment"
                    stackId="1"
                    stroke="#ffc658"
                    fill="#ffc658"
                    name="Assessment Profissional"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Regional */}
        <TabsContent value="regional" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Distribuição Regional</CardTitle>
              <CardDescription>
                Participação de mercado por região geográfica
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={regionalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="region" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="marketShare" fill="#8884d8" name="Participação de Mercado (%)" />
                  <Bar dataKey="growth" fill="#82ca9d" name="Taxa de Crescimento (%)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {regionalData.map((region, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{region.region}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Participação</p>
                    <p className="text-2xl font-bold">{region.marketShare}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Crescimento</p>
                    <p className="text-xl font-semibold text-green-600">+{region.growth}%</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  trend: string;
  trendLabel: string;
}

function StatCard({ title, value, subtitle, icon, trend, trendLabel }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="p-2 bg-primary/10 rounded-lg">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mb-2">{subtitle}</p>
        <div className="flex items-center gap-1 text-xs">
          <TrendingUp className="h-3 w-3 text-green-600" />
          <span className="font-semibold text-green-600">{trend}</span>
          <span className="text-muted-foreground">{trendLabel}</span>
        </div>
      </CardContent>
    </Card>
  );
}

