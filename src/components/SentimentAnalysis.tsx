/**
 * Componente de Análise de Sentimento para ComunicaPro
 * Integra análise avançada de sentimento em textos de comunicação
 * Data: 29/10/2025
 * Tendência: Inteligência Artificial Conversacional
 */

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { AlertCircle, Loader2, TrendingUp } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

interface SentimentResult {
  sentiment: 'positive' | 'neutral' | 'negative' | 'unknown';
  score: number;
  intensity: 'low' | 'medium' | 'high';
  keywords: string[];
  insights: string;
  tone: string;
  confidence: number;
  timestamp: string;
  text_length: number;
}

export const SentimentAnalysis: React.FC = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState<SentimentResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!text.trim()) {
      setError('Por favor, insira um texto para análise');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Simulação de chamada à API
      // Em produção, isso seria uma chamada a um endpoint backend
      const mockResult: SentimentResult = {
        sentiment: 'positive',
        score: 0.75,
        intensity: 'high',
        keywords: ['adorei', 'excelente', 'superou'],
        insights: 'Texto expressa satisfação e entusiasmo com a experiência.',
        tone: 'amigável e entusiasmado',
        confidence: 0.92,
        timestamp: new Date().toISOString(),
        text_length: text.length,
      };

      // Simular delay de processamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      setResult(mockResult);
    } catch (err) {
      setError('Erro ao analisar o sentimento. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'negative':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'neutral':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getSentimentLabel = (sentiment: string) => {
    const labels: Record<string, string> = {
      positive: 'Positivo',
      negative: 'Negativo',
      neutral: 'Neutro',
      unknown: 'Desconhecido',
    };
    return labels[sentiment] || sentiment;
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Análise de Sentimento com IA
          </CardTitle>
          <CardDescription>
            Analise o sentimento e o tom de seus textos de comunicação usando inteligência artificial avançada
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Input de Texto */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Texto para Análise</label>
            <Textarea
              placeholder="Digite ou cole o texto que deseja analisar..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={loading}
              className="min-h-32"
            />
            <p className="text-xs text-gray-500">
              {text.length} caracteres
            </p>
          </div>

          {/* Botão de Análise */}
          <Button
            onClick={handleAnalyze}
            disabled={loading || !text.trim()}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analisando...
              </>
            ) : (
              'Analisar Sentimento'
            )}
          </Button>

          {/* Erro */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Resultados */}
          {result && (
            <div className="space-y-4 pt-4 border-t">
              <div className="grid grid-cols-2 gap-4">
                {/* Sentimento */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">Sentimento</p>
                  <Badge className={`${getSentimentColor(result.sentiment)} border`}>
                    {getSentimentLabel(result.sentiment)}
                  </Badge>
                </div>

                {/* Score */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">Pontuação</p>
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          result.score > 0.5 ? 'bg-green-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${(result.score + 1) * 50}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold">{result.score.toFixed(2)}</span>
                  </div>
                </div>

                {/* Intensidade */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">Intensidade</p>
                  <Badge variant="outline">
                    {result.intensity === 'high' ? 'Alta' : result.intensity === 'medium' ? 'Média' : 'Baixa'}
                  </Badge>
                </div>

                {/* Confiança */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">Confiança</p>
                  <p className="text-lg font-semibold">{(result.confidence * 100).toFixed(0)}%</p>
                </div>
              </div>

              {/* Tom */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">Tom Detectado</p>
                <p className="text-sm text-gray-700">{result.tone}</p>
              </div>

              {/* Insights */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">Insights</p>
                <p className="text-sm text-gray-700">{result.insights}</p>
              </div>

              {/* Palavras-chave */}
              {result.keywords.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">Palavras-chave</p>
                  <div className="flex flex-wrap gap-2">
                    {result.keywords.map((keyword, index) => (
                      <Badge key={index} variant="secondary">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Timestamp */}
              <p className="text-xs text-gray-500 pt-2">
                Análise realizada em {new Date(result.timestamp).toLocaleString('pt-BR')}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Informações sobre a Tendência */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">📊 Tendência 2025</h3>
        <p className="text-sm text-blue-800">
          A análise de sentimento com IA é uma das principais tendências de comunicação digital em 2025.
          Ela permite entender melhor o tom e a intenção dos textos, facilitando uma comunicação mais eficaz e personalizada.
        </p>
      </div>
    </div>
  );
};

export default SentimentAnalysis;
