/**
 * @file AdvancedCommunicationInsights.tsx
 * @description Componente React para exibir análise avançada de comunicação
 * @version 1.0.0
 * @date 15/12/2025
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface CommunicationMetrics {
  clarity: number;
  assertiveness: number;
  empathy: number;
  emotionalIntelligence: number;
  adaptability: number;
}

interface AdvancedCommunicationInsightsProps {
  metrics: CommunicationMetrics;
  strengths: string[];
  improvements: string[];
  recommendations: string[];
  marketInsights: any[];
  communicationStyle: string;
}

export const AdvancedCommunicationInsights: React.FC<AdvancedCommunicationInsightsProps> = ({
  metrics,
  strengths,
  improvements,
  recommendations,
  marketInsights,
  communicationStyle
}) => {
  const [activeTab, setActiveTab] = useState('metrics');

  // Prepara dados para o gráfico de radar
  const radarData = [
    { name: 'Clareza', value: metrics.clarity },
    { name: 'Assertividade', value: metrics.assertiveness },
    { name: 'Empatia', value: metrics.empathy },
    { name: 'Inteligência Emocional', value: metrics.emotionalIntelligence },
    { name: 'Adaptabilidade', value: metrics.adaptability }
  ];

  // Prepara dados para o gráfico de barras
  const barData = [
    { name: 'Clareza', value: metrics.clarity },
    { name: 'Assertividade', value: metrics.assertiveness },
    { name: 'Empatia', value: metrics.empathy },
    { name: 'IE', value: metrics.emotionalIntelligence },
    { name: 'Adaptabilidade', value: metrics.adaptability }
  ];

  const getMetricColor = (value: number) => {
    if (value >= 80) return 'text-green-600';
    if (value >= 60) return 'text-blue-600';
    if (value >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMetricBadgeColor = (value: number) => {
    if (value >= 80) return 'bg-green-100 text-green-800';
    if (value >= 60) return 'bg-blue-100 text-blue-800';
    if (value >= 40) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="w-full space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Análise Avançada de Comunicação</CardTitle>
          <CardDescription>
            Perfil de Comunicação: <span className="font-semibold">{communicationStyle}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="metrics">Métricas</TabsTrigger>
              <TabsTrigger value="strengths">Forças</TabsTrigger>
              <TabsTrigger value="recommendations">Recomendações</TabsTrigger>
              <TabsTrigger value="market">Mercado</TabsTrigger>
            </TabsList>

            {/* Aba de Métricas */}
            <TabsContent value="metrics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Gráfico de Radar */}
                <div className="bg-white p-4 rounded-lg border">
                  <h3 className="text-lg font-semibold mb-4">Perfil de Competências</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="name" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <Radar name="Competências" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                {/* Gráfico de Barras */}
                <div className="bg-white p-4 rounded-lg border">
                  <h3 className="text-lg font-semibold mb-4">Comparação de Métricas</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={barData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Métricas Detalhadas */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Detalhamento das Métricas</h3>
                
                {Object.entries(metrics).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium capitalize">{key}</span>
                      <Badge className={getMetricBadgeColor(value as number)}>
                        {value}%
                      </Badge>
                    </div>
                    <Progress value={value as number} className="h-2" />
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Aba de Forças */}
            <TabsContent value="strengths" className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-4">Pontos Fortes Identificados</h3>
                <div className="space-y-3">
                  {strengths.length > 0 ? (
                    strengths.map((strength, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                        <span className="text-green-600 font-bold">✓</span>
                        <span className="text-gray-700">{strength}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">Nenhum ponto forte identificado ainda.</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Áreas para Desenvolvimento</h3>
                <div className="space-y-3">
                  {improvements.length > 0 ? (
                    improvements.map((improvement, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <span className="text-blue-600 font-bold">→</span>
                        <span className="text-gray-700">{improvement}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">Nenhuma área de desenvolvimento identificada.</p>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Aba de Recomendações */}
            <TabsContent value="recommendations" className="space-y-4">
              <h3 className="text-lg font-semibold">Recomendações Personalizadas</h3>
              <div className="space-y-3">
                {recommendations.length > 0 ? (
                  recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <span className="text-purple-600 font-bold">{index + 1}</span>
                      <span className="text-gray-700">{rec}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">Nenhuma recomendação disponível.</p>
                )}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">💡 Dica Especial</h4>
                <p className="text-blue-800">
                  Combine suas recomendações com as tendências de mercado para maximizar o impacto de sua comunicação.
                  Foque em qualidade sobre quantidade e sempre busque a humanização em suas interações.
                </p>
              </div>
            </TabsContent>

            {/* Aba de Insights de Mercado */}
            <TabsContent value="market" className="space-y-4">
              <h3 className="text-lg font-semibold">Insights de Mercado Relevantes</h3>
              <div className="space-y-3">
                {marketInsights.length > 0 ? (
                  marketInsights.map((insight, index) => (
                    <div key={index} className="p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-200">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-orange-900">{insight.trend}</h4>
                        <Badge variant="outline" className="bg-orange-100 text-orange-800">
                          {insight.relevance}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">
                        <strong>Aplicação:</strong> {insight.application}
                      </p>
                      <p className="text-sm text-gray-700">
                        <strong>Impacto:</strong> {insight.impact}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">Nenhum insight de mercado disponível.</p>
                )}
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-900 mb-2">📊 Tendências Principais (2026)</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• <strong>IA como Parceira:</strong> Integração de IA conversacional em comunicações</li>
                  <li>• <strong>Omnichannel:</strong> Comunicação integrada em múltiplos canais</li>
                  <li>• <strong>Qualidade:</strong> Prioridade em conteúdo de alta qualidade</li>
                  <li>• <strong>Humanização:</strong> Foco em transparência e propósito</li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedCommunicationInsights;
