import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign, BarChart3 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface MarketData {
  marketSize: string;
  cagr: string;
  trend: string;
}

const marketData: MarketData = {
  marketSize: "USD 10.0 Bilhões",
  cagr: "12.3%",
  trend: "Forte Crescimento (Data-Driven Hiring)",
};

export default function MarketDataCard() {
  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">
          Mercado de Avaliação de Personalidade
        </CardTitle>
        <BarChart3 className="h-6 w-6 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              Tamanho do Mercado (2025)
            </p>
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-500" />
              <div className="text-2xl font-bold">{marketData.marketSize}</div>
            </div>
          </div>
          <Separator orientation="vertical" className="hidden md:block" />
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              CAGR Projetado
            </p>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              <div className="text-2xl font-bold">{marketData.cagr}</div>
            </div>
          </div>
          <Separator orientation="vertical" className="hidden md:block" />
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              Tendência Principal
            </p>
            <div className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              {marketData.trend}
            </div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          Dados consolidados de múltiplas fontes de pesquisa de mercado (FMI, Mordor Intelligence, The Insight Partners).
        </p>
      </CardContent>
    </Card>
  );
}
