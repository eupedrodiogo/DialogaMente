import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Zap, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { fetchProfilePredictions, PredictionResult, formatPredictionDataForChart } from "@/services/mlService";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export default function PredictionCard() {
  const [predictions, setPredictions] = useState<PredictionResult[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadPredictions();
  }, []);

  const loadPredictions = async () => {
    try {
      const data = await fetchProfilePredictions();
      setPredictions(data);
    } catch (error) {
      console.error("Erro ao carregar previsões de ML:", error);
      toast({
        title: "Erro de ML",
        description: "Não foi possível carregar as previsões de tendências.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle className="text-lg font-medium">
            Previsões de Tendências (Machine Learning)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center min-h-[200px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">
          Previsões de Tendências (Machine Learning)
        </CardTitle>
        <Zap className="h-6 w-6 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {predictions.map((prediction) => (
            <div key={prediction.profile} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-semibold">{prediction.profile}</h3>
                <Badge 
                  variant={prediction.trend === "Crescimento" ? "default" : prediction.trend === "Declínio" ? "destructive" : "secondary"}
                >
                  {prediction.trend}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Confiança: {(prediction.confidence * 100).toFixed(0)}%
              </p>
              
              <ResponsiveContainer width="100%" height={150}>
                <LineChart data={formatPredictionDataForChart(prediction.data)} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={10} />
                  <YAxis fontSize={10} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="Previsão" 
                    stroke={prediction.trend === "Crescimento" ? "#10B981" : prediction.trend === "Declínio" ? "#EF4444" : "#F59E0B"} 
                    strokeWidth={2} 
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="flex items-center mt-2 text-sm">
                {prediction.trend === "Crescimento" && <TrendingUp className="h-4 w-4 text-green-500 mr-1" />}
                {prediction.trend === "Declínio" && <TrendingDown className="h-4 w-4 text-red-500 mr-1" />}
                {prediction.trend === "Estabilidade" && <Minus className="h-4 w-4 text-yellow-500 mr-1" />}
                <p>
                  Tendência de {prediction.trend.toLowerCase()} nos próximos dias.
                </p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          Previsões baseadas em um modelo de Machine Learning (Séries Temporais) treinado com dados históricos de testes.
        </p>
      </CardContent>
    </Card>
  );
}
