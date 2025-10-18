import { useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface RadarChartProps {
  data: {
    visual: number;
    auditivo: number;
    cinestesico: number;
  };
  title?: string;
  description?: string;
  className?: string;
}

/**
 * Componente de Gráfico de Radar
 * Visualiza perfis de comunicação em formato de radar multidimensional
 */
export const RadarChart = ({ 
  data, 
  title = 'Perfil de Comunicação',
  description = 'Distribuição das características de comunicação',
  className = '' 
}: RadarChartProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Configurações do gráfico
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 40;
    const maxValue = 100;

    // Limpar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenhar grades de fundo
    drawGrid(ctx, centerX, centerY, radius, maxValue);

    // Desenhar eixos e labels
    drawAxes(ctx, centerX, centerY, radius);

    // Desenhar dados
    drawData(ctx, centerX, centerY, radius, data, maxValue);

  }, [data]);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <canvas 
          ref={canvasRef} 
          width={400} 
          height={400}
          className="max-w-full h-auto"
        />
      </CardContent>
    </Card>
  );
};

/**
 * Desenha a grade de fundo do radar
 */
function drawGrid(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
  maxValue: number
) {
  const levels = 5;
  
  ctx.strokeStyle = '#e5e7eb';
  ctx.lineWidth = 1;

  for (let i = 1; i <= levels; i++) {
    const levelRadius = (radius / levels) * i;
    
    ctx.beginPath();
    
    // Desenhar polígono triangular para cada nível
    for (let j = 0; j < 3; j++) {
      const angle = (Math.PI * 2 * j) / 3 - Math.PI / 2;
      const x = centerX + levelRadius * Math.cos(angle);
      const y = centerY + levelRadius * Math.sin(angle);
      
      if (j === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    ctx.closePath();
    ctx.stroke();

    // Adicionar valores de referência
    if (i === levels) {
      ctx.fillStyle = '#9ca3af';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      
      const value = Math.round((maxValue / levels) * i);
      const labelRadius = levelRadius + 15;
      const angle = -Math.PI / 2;
      const x = centerX + labelRadius * Math.cos(angle);
      const y = centerY + labelRadius * Math.sin(angle);
      
      ctx.fillText(value.toString(), x, y);
    }
  }
}

/**
 * Desenha os eixos e labels do radar
 */
function drawAxes(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number
) {
  const labels = ['Visual', 'Auditivo', 'Cinestésico'];
  const colors = ['#3b82f6', '#10b981', '#f59e0b'];

  ctx.strokeStyle = '#d1d5db';
  ctx.lineWidth = 1;

  for (let i = 0; i < 3; i++) {
    const angle = (Math.PI * 2 * i) / 3 - Math.PI / 2;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    // Desenhar linha do eixo
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(x, y);
    ctx.stroke();

    // Desenhar label
    const labelRadius = radius + 25;
    const labelX = centerX + labelRadius * Math.cos(angle);
    const labelY = centerY + labelRadius * Math.sin(angle);

    ctx.fillStyle = colors[i];
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(labels[i], labelX, labelY);
  }
}

/**
 * Desenha os dados no gráfico de radar
 */
function drawData(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
  data: { visual: number; auditivo: number; cinestesico: number },
  maxValue: number
) {
  const values = [data.visual, data.auditivo, data.cinestesico];
  const points: { x: number; y: number }[] = [];

  // Calcular pontos
  for (let i = 0; i < 3; i++) {
    const angle = (Math.PI * 2 * i) / 3 - Math.PI / 2;
    const value = values[i];
    const pointRadius = (radius * value) / maxValue;
    
    const x = centerX + pointRadius * Math.cos(angle);
    const y = centerY + pointRadius * Math.sin(angle);
    
    points.push({ x, y });
  }

  // Desenhar área preenchida
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  
  ctx.closePath();
  
  // Gradiente para preenchimento
  const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
  gradient.addColorStop(0, 'rgba(59, 130, 246, 0.3)');
  gradient.addColorStop(1, 'rgba(59, 130, 246, 0.1)');
  
  ctx.fillStyle = gradient;
  ctx.fill();

  // Desenhar contorno
  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Desenhar pontos
  for (let i = 0; i < points.length; i++) {
    const colors = ['#3b82f6', '#10b981', '#f59e0b'];
    
    ctx.beginPath();
    ctx.arc(points[i].x, points[i].y, 6, 0, Math.PI * 2);
    ctx.fillStyle = colors[i];
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Adicionar valor no ponto
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const angle = (Math.PI * 2 * i) / 3 - Math.PI / 2;
    const valueRadius = (radius * values[i]) / maxValue + 20;
    const valueX = centerX + valueRadius * Math.cos(angle);
    const valueY = centerY + valueRadius * Math.sin(angle);
    
    ctx.fillText(values[i].toString(), valueX, valueY);
  }
}

/**
 * Componente de comparação de perfis em radar
 */
interface RadarComparisonProps {
  userProfile: {
    visual: number;
    auditivo: number;
    cinestesico: number;
  };
  averageProfile: {
    visual: number;
    auditivo: number;
    cinestesico: number;
  };
  className?: string;
}

export const RadarComparison = ({ 
  userProfile, 
  averageProfile,
  className = '' 
}: RadarComparisonProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 60;
    const maxValue = 100;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawGrid(ctx, centerX, centerY, radius, maxValue);
    drawAxes(ctx, centerX, centerY, radius);

    // Desenhar perfil médio (fundo)
    drawComparisonData(ctx, centerX, centerY, radius, averageProfile, maxValue, 'rgba(156, 163, 175, 0.3)', '#9ca3af');

    // Desenhar perfil do usuário (frente)
    drawComparisonData(ctx, centerX, centerY, radius, userProfile, maxValue, 'rgba(59, 130, 246, 0.3)', '#3b82f6');

    // Legenda
    drawLegend(ctx, canvas.width, canvas.height);

  }, [userProfile, averageProfile]);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Comparação de Perfis</CardTitle>
        <CardDescription>Seu perfil vs. média dos usuários</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <canvas 
          ref={canvasRef} 
          width={400} 
          height={450}
          className="max-w-full h-auto"
        />
      </CardContent>
    </Card>
  );
};

function drawComparisonData(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
  data: { visual: number; auditivo: number; cinestesico: number },
  maxValue: number,
  fillColor: string,
  strokeColor: string
) {
  const values = [data.visual, data.auditivo, data.cinestesico];
  const points: { x: number; y: number }[] = [];

  for (let i = 0; i < 3; i++) {
    const angle = (Math.PI * 2 * i) / 3 - Math.PI / 2;
    const value = values[i];
    const pointRadius = (radius * value) / maxValue;
    
    const x = centerX + pointRadius * Math.cos(angle);
    const y = centerY + pointRadius * Math.sin(angle);
    
    points.push({ x, y });
  }

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  
  ctx.closePath();
  
  ctx.fillStyle = fillColor;
  ctx.fill();
  
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawLegend(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const legendY = height - 30;
  const legendX = width / 2;

  // Seu perfil
  ctx.fillStyle = '#3b82f6';
  ctx.fillRect(legendX - 100, legendY, 20, 10);
  ctx.fillStyle = '#1f2937';
  ctx.font = '12px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('Seu Perfil', legendX - 75, legendY + 9);

  // Média
  ctx.fillStyle = '#9ca3af';
  ctx.fillRect(legendX + 10, legendY, 20, 10);
  ctx.fillStyle = '#1f2937';
  ctx.fillText('Média', legendX + 35, legendY + 9);
}

