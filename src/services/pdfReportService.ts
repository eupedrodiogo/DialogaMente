/**
 * @file pdfReportService.ts
 * @description Serviço para gerar relatórios em PDF com resultados de testes, análises
 * personalizadas, recomendações e insights de mercado.
 * @version 1.0.0
 * @date 08/12/2025
 */

interface ReportData {
  userName: string;
  testDate: Date;
  dominantProfile: string;
  score: number;
  percentile: number;
  strengths: string[];
  improvements: string[];
  recommendations: string[];
  marketInsights: {
    demandLevel: string;
    salaryRange: string;
    growthTrend: number;
  };
  achievements: { title: string; date: Date }[];
  nextSteps: string[];
}

/**
 * Gera um relatório em formato HTML que pode ser convertido para PDF
 */
export function generateHTMLReport(data: ReportData): string {
  const reportDate = new Date().toLocaleDateString('pt-BR');
  const testDate = data.testDate.toLocaleDateString('pt-BR');

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Relatório de Comunicação - DialogaMente</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f5f5f5;
        }
        
        .container {
            max-width: 900px;
            margin: 0 auto;
            background-color: white;
            padding: 40px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        
        .header {
            text-align: center;
            border-bottom: 3px solid #6366f1;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        
        .header h1 {
            color: #6366f1;
            font-size: 28px;
            margin-bottom: 5px;
        }
        
        .header p {
            color: #666;
            font-size: 14px;
        }
        
        .user-info {
            background-color: #f9f9f9;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
            border-left: 4px solid #6366f1;
        }
        
        .user-info h3 {
            color: #6366f1;
            margin-bottom: 10px;
        }
        
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }
        
        .info-item {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
        }
        
        .info-item strong {
            color: #333;
        }
        
        .info-item span {
            color: #666;
        }
        
        .score-section {
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
            color: white;
            padding: 30px;
            border-radius: 8px;
            margin-bottom: 30px;
            text-align: center;
        }
        
        .score-section h2 {
            font-size: 24px;
            margin-bottom: 10px;
        }
        
        .score-display {
            font-size: 48px;
            font-weight: bold;
            margin: 20px 0;
        }
        
        .percentile {
            font-size: 16px;
            opacity: 0.9;
        }
        
        .section {
            margin-bottom: 30px;
        }
        
        .section h3 {
            color: #6366f1;
            font-size: 18px;
            margin-bottom: 15px;
            border-bottom: 2px solid #e0e7ff;
            padding-bottom: 10px;
        }
        
        .list-items {
            list-style: none;
            padding: 0;
        }
        
        .list-items li {
            padding: 12px;
            margin-bottom: 10px;
            background-color: #f9f9f9;
            border-left: 4px solid #10b981;
            border-radius: 4px;
        }
        
        .list-items li.improvement {
            border-left-color: #f59e0b;
        }
        
        .list-items li.recommendation {
            border-left-color: #3b82f6;
        }
        
        .market-insights {
            background-color: #f0f9ff;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #0ea5e9;
        }
        
        .market-insights h4 {
            color: #0284c7;
            margin-bottom: 10px;
        }
        
        .insight-item {
            margin-bottom: 10px;
            font-size: 14px;
        }
        
        .insight-item strong {
            color: #0284c7;
        }
        
        .achievements {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
            margin-top: 15px;
        }
        
        .achievement-badge {
            background-color: #fef3c7;
            border: 2px solid #f59e0b;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
            font-size: 12px;
        }
        
        .achievement-badge .icon {
            font-size: 24px;
            margin-bottom: 5px;
        }
        
        .next-steps {
            background-color: #ecfdf5;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #10b981;
        }
        
        .next-steps h4 {
            color: #059669;
            margin-bottom: 10px;
        }
        
        .next-steps ol {
            margin-left: 20px;
            color: #333;
        }
        
        .next-steps li {
            margin-bottom: 8px;
        }
        
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            font-size: 12px;
            color: #999;
        }
        
        .footer p {
            margin-bottom: 5px;
        }
        
        @media print {
            body {
                background-color: white;
            }
            .container {
                box-shadow: none;
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>📊 Relatório de Análise de Comunicação</h1>
            <p>DialogaMente - Seu Perfil de Comunicação Personalizado</p>
            <p style="margin-top: 10px; font-size: 12px;">Gerado em ${reportDate}</p>
        </div>
        
        <!-- User Information -->
        <div class="user-info">
            <h3>👤 Informações do Usuário</h3>
            <div class="info-grid">
                <div class="info-item">
                    <strong>Nome:</strong>
                    <span>${data.userName}</span>
                </div>
                <div class="info-item">
                    <strong>Data do Teste:</strong>
                    <span>${testDate}</span>
                </div>
                <div class="info-item">
                    <strong>Perfil Dominante:</strong>
                    <span>${data.dominantProfile}</span>
                </div>
                <div class="info-item">
                    <strong>Percentil:</strong>
                    <span>${data.percentile}º percentil</span>
                </div>
            </div>
        </div>
        
        <!-- Score Section -->
        <div class="score-section">
            <h2>Sua Pontuação</h2>
            <div class="score-display">${data.score}/100</div>
            <div class="percentile">Você está melhor que ${data.percentile}% dos usuários</div>
        </div>
        
        <!-- Strengths -->
        <div class="section">
            <h3>💪 Seus Pontos Fortes</h3>
            <ul class="list-items">
                ${data.strengths.map(strength => `<li>${strength}</li>`).join('')}
            </ul>
        </div>
        
        <!-- Areas for Improvement -->
        <div class="section">
            <h3>🎯 Áreas para Desenvolvimento</h3>
            <ul class="list-items">
                ${data.improvements.map(improvement => `<li class="improvement">${improvement}</li>`).join('')}
            </ul>
        </div>
        
        <!-- Recommendations -->
        <div class="section">
            <h3>📋 Recomendações Personalizadas</h3>
            <ul class="list-items">
                ${data.recommendations.map(rec => `<li class="recommendation">${rec}</li>`).join('')}
            </ul>
        </div>
        
        <!-- Market Insights -->
        <div class="section">
            <h3>📈 Insights de Mercado</h3>
            <div class="market-insights">
                <h4>Oportunidades Profissionais para seu Perfil</h4>
                <div class="insight-item">
                    <strong>Nível de Demanda:</strong> ${data.marketInsights.demandLevel}
                </div>
                <div class="insight-item">
                    <strong>Faixa Salarial:</strong> ${data.marketInsights.salaryRange}
                </div>
                <div class="insight-item">
                    <strong>Tendência de Crescimento:</strong> +${data.marketInsights.growthTrend}% ao ano
                </div>
                <p style="margin-top: 15px; font-size: 13px; color: #666;">
                    Seu perfil de comunicação está alinhado com as tendências de mercado 2025. 
                    Profissionais com suas características têm alta demanda em liderança, coaching e consultoria.
                </p>
            </div>
        </div>
        
        <!-- Achievements -->
        ${data.achievements.length > 0 ? `
        <div class="section">
            <h3>🏆 Conquistas Desbloqueadas</h3>
            <div class="achievements">
                ${data.achievements.map(achievement => `
                    <div class="achievement-badge">
                        <div class="icon">🎖️</div>
                        <div>${achievement.title}</div>
                        <div style="font-size: 11px; color: #999; margin-top: 5px;">${achievement.date.toLocaleDateString('pt-BR')}</div>
                    </div>
                `).join('')}
            </div>
        </div>
        ` : ''}
        
        <!-- Next Steps -->
        <div class="section">
            <div class="next-steps">
                <h4>🚀 Próximos Passos Recomendados</h4>
                <ol>
                    ${data.nextSteps.map(step => `<li>${step}</li>`).join('')}
                </ol>
            </div>
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <p><strong>DialogaMente</strong> - Plataforma de Análise de Comunicação Interpessoal</p>
            <p>Este relatório é confidencial e personalizado para ${data.userName}</p>
            <p>Para mais informações, visite: www.dialogamente.com</p>
        </div>
    </div>
</body>
</html>
  `;
}

/**
 * Gera dados de exemplo para teste
 */
export function generateSampleReportData(): ReportData {
  return {
    userName: 'João Silva',
    testDate: new Date(),
    dominantProfile: 'Visual',
    score: 85,
    percentile: 78,
    strengths: [
      'Excelente organização visual de informações',
      'Comunicação clara e estruturada',
      'Capacidade de apresentação eficaz'
    ],
    improvements: [
      'Desenvolver maior escuta ativa',
      'Melhorar comunicação verbal espontânea',
      'Aumentar empatia em conversas informais'
    ],
    recommendations: [
      'Participar de cursos de oratória para complementar suas habilidades visuais',
      'Praticar escuta ativa em conversas do dia a dia',
      'Explorar técnicas de comunicação não-violenta'
    ],
    marketInsights: {
      demandLevel: 'Alta',
      salaryRange: 'R$ 6.000 - R$ 15.000',
      growthTrend: 28.6
    },
    achievements: [
      { title: 'Primeiro Passo', date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      { title: 'Explorador', date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) }
    ],
    nextSteps: [
      'Realize outro teste em 30 dias para acompanhar seu progresso',
      'Explore as recomendações personalizadas na plataforma',
      'Participe dos desafios diários para ganhar pontos e conquistas',
      'Compartilhe seus resultados e compare com outros usuários'
    ]
  };
}

/**
 * Exporta relatório como string JSON
 */
export function exportReportAsJSON(data: ReportData): string {
  return JSON.stringify(data, null, 2);
}

/**
 * Cria um blob para download do PDF (quando integrado com uma biblioteca de PDF)
 */
export function createPDFBlob(htmlContent: string): Blob {
  return new Blob([htmlContent], { type: 'text/html' });
}
