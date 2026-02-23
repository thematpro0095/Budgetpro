// Financial Assistant - Intelligent recommendations based on user data

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Sparkles, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Recommendation {
  type: 'warning' | 'success' | 'info' | 'alert';
  icon: React.ElementType;
  title: string;
  message: string;
  details?: string;
}

interface FinancialAssistantProps {
  context: 'overview' | 'expenses' | 'payment' | 'investments';
  data: {
    salary?: number;
    creditLimit?: number;
    remainingSalary?: number;
    availableCredit?: number;
    salaryExpenses?: number;
    creditExpenses?: number;
    currentBill?: number;
    totalInvestments?: number;
    expensePercentage?: number;
    expenses?: Array<{ category: string; amount: number; paymentMethod: string }>;
  };
  isDarkMode: boolean;
}

export const FinancialAssistant: React.FC<FinancialAssistantProps> = ({
  context,
  data,
  isDarkMode
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const recommendations = useMemo(() => {
    const recs: Recommendation[] = [];
    
    // Análises para Overview
    if (context === 'overview') {
      const { salary = 0, salaryExpenses = 0, creditExpenses = 0, remainingSalary = 0, expensePercentage = 0 } = data;
      
      // Análise de comprometimento da renda
      if (expensePercentage > 80) {
        recs.push({
          type: 'alert',
          icon: AlertTriangle,
          title: 'Alerta de Risco Financeiro',
          message: `${expensePercentage.toFixed(0)}% da sua renda está comprometida!`,
          details: 'Você está usando quase toda sua renda. Considere reduzir gastos não essenciais e evitar novas dívidas este mês.'
        });
      } else if (expensePercentage > 60) {
        recs.push({
          type: 'warning',
          icon: TrendingDown,
          title: 'Gastos Elevados',
          message: `${expensePercentage.toFixed(0)}% da renda comprometida.`,
          details: 'Tente manter seus gastos abaixo de 60% da renda. Revise suas despesas e identifique onde pode economizar.'
        });
      } else if (expensePercentage < 40 && remainingSalary > 0) {
        recs.push({
          type: 'success',
          icon: CheckCircle,
          title: 'Excelente Gestão Financeira!',
          message: `Apenas ${expensePercentage.toFixed(0)}% da renda utilizada.`,
          details: `Você tem R$ ${remainingSalary.toFixed(2)} disponível. Considere investir pelo menos 20% desse valor para construir patrimônio.`
        });
      }

      // Análise de gastos com cartão
      if (creditExpenses > 0 && salary > 0) {
        const creditPercentage = (creditExpenses / salary) * 100;
        if (creditPercentage > 30) {
          recs.push({
            type: 'warning',
            icon: AlertTriangle,
            title: 'Uso Intenso do Cartão',
            message: `Gastos no cartão representam ${creditPercentage.toFixed(0)}% da renda.`,
            details: 'Evite usar mais de 30% da sua renda em cartão de crédito para manter suas finanças saudáveis.'
          });
        }
      }

      // Sugestão de reserva de emergência
      if (remainingSalary > salary * 0.3) {
        recs.push({
          type: 'info',
          icon: TrendingUp,
          title: 'Oportunidade de Investimento',
          message: 'Você tem um bom saldo disponível!',
          details: `Com R$ ${remainingSalary.toFixed(2)} sobrando, considere criar uma reserva de emergência de 6 meses ou investir em opções de baixo risco.`
        });
      }
    }

    // Análises para Gastos
    if (context === 'expenses') {
      const { expenses = [], salary = 0 } = data;
      
      // Análise por categoria
      const categoryTotals: { [key: string]: number } = {};
      expenses.forEach(exp => {
        if (exp.paymentMethod === 'salary') {
          categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
        }
      });

      const highestCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
      
      if (highestCategory && salary > 0) {
        const percentage = (highestCategory[1] / salary) * 100;
        if (percentage > 25) {
          recs.push({
            type: 'warning',
            icon: AlertTriangle,
            title: 'Categoria de Gasto Elevado',
            message: `"${highestCategory[0]}" consome ${percentage.toFixed(0)}% da sua renda!`,
            details: `Esta categoria representa R$ ${highestCategory[1].toFixed(2)}. Tente reduzir em pelo menos 10% para equilibrar suas finanças.`
          });
        }
      }

      // Análise de diversificação
      const salaryExpenses = expenses.filter(e => e.paymentMethod === 'salary');
      const creditExpenses = expenses.filter(e => e.paymentMethod === 'credit');
      
      if (salaryExpenses.length === 0 && creditExpenses.length > 0) {
        recs.push({
          type: 'info',
          icon: AlertTriangle,
          title: 'Use o Dinheiro do Salário',
          message: 'Você está usando apenas o cartão de crédito.',
          details: 'Para pequenas compras do dia a dia, prefira usar o dinheiro do salário. Isso ajuda a controlar melhor os gastos.'
        });
      }

      if (expenses.length === 0) {
        recs.push({
          type: 'info',
          icon: Sparkles,
          title: 'Comece a Registrar seus Gastos',
          message: 'Adicione suas despesas para receber análises personalizadas!',
          details: 'Quanto mais dados você registrar, melhores serão as recomendações do assistente financeiro.'
        });
      }
    }

    // Análises para Pagamento de Fatura
    if (context === 'payment') {
      const { currentBill = 0, remainingSalary = 0, creditExpenses = 0 } = data;
      
      if (currentBill > remainingSalary && remainingSalary > 0) {
        recs.push({
          type: 'alert',
          icon: AlertTriangle,
          title: 'Fatura Maior que Saldo Disponível',
          message: 'Você não tem saldo suficiente para pagar a fatura total!',
          details: `Fatura: R$ ${currentBill.toFixed(2)} | Disponível: R$ ${remainingSalary.toFixed(2)}. Pague o máximo que puder e evite novos gastos no cartão.`
        });
      } else if (currentBill > 0 && currentBill <= remainingSalary) {
        recs.push({
          type: 'success',
          icon: CheckCircle,
          title: 'Você Pode Pagar a Fatura Completa',
          message: `R$ ${currentBill.toFixed(2)} podem ser pagos agora!`,
          details: 'Pagar a fatura total evita juros e mantém seu crédito saudável. Sempre que possível, pague o valor integral.'
        });
      } else if (currentBill === 0) {
        recs.push({
          type: 'success',
          icon: CheckCircle,
          title: 'Sem Fatura Pendente',
          message: 'Parabéns! Você está em dia com o cartão.',
          details: 'Continue monitorando seus gastos e evite usar mais de 30% do limite do cartão para manter um bom score de crédito.'
        });
      }
    }

    // Análises para Investimentos
    if (context === 'investments') {
      const { totalInvestments = 0, remainingSalary = 0, salary = 0 } = data;
      
      if (totalInvestments === 0 && remainingSalary > salary * 0.2) {
        recs.push({
          type: 'info',
          icon: TrendingUp,
          title: 'Comece a Investir Hoje',
          message: 'Você tem saldo disponível para investir!',
          details: `Com R$ ${remainingSalary.toFixed(2)} disponível, considere começar com investimentos de baixo risco. Mesmo pequenos valores geram retorno a longo prazo.`
        });
      } else if (totalInvestments > 0 && salary > 0) {
        const investmentPercentage = (totalInvestments / salary) * 100;
        if (investmentPercentage < 10) {
          recs.push({
            type: 'info',
            icon: TrendingUp,
            title: 'Aumente Seus Investimentos',
            message: `Você investe ${investmentPercentage.toFixed(0)}% da sua renda.`,
            details: 'Especialistas recomendam investir pelo menos 10-20% da renda mensal. Pequenos aumentos fazem grande diferença no futuro.'
          });
        } else if (investmentPercentage >= 20) {
          recs.push({
            type: 'success',
            icon: Sparkles,
            title: 'Parabéns pelo Compromisso!',
            message: `${investmentPercentage.toFixed(0)}% da renda está sendo investida!`,
            details: 'Você está no caminho certo para construir patrimônio. Continue diversificando seus investimentos.'
          });
        }
      }

      if (totalInvestments === 0 && remainingSalary <= 0) {
        recs.push({
          type: 'warning',
          icon: AlertTriangle,
          title: 'Priorize Economizar',
          message: 'Organize suas finanças antes de investir.',
          details: 'Primeiro, tente reduzir gastos e criar uma reserva de emergência. Depois, comece a investir gradualmente.'
        });
      }
    }

    // Se não houver recomendações específicas, adicionar uma genérica
    if (recs.length === 0) {
      recs.push({
        type: 'info',
        icon: Sparkles,
        title: 'Continue Monitorando',
        message: 'Suas finanças estão equilibradas!',
        details: 'Mantenha o registro de gastos atualizado para receber análises mais precisas.'
      });
    }

    return recs;
  }, [context, data]);

  const primaryRecommendation = recommendations[0];
  const additionalRecommendations = recommendations.slice(1);

  const getIconColor = (type: string) => {
    switch (type) {
      case 'alert':
        return '#EF4444'; // Red
      case 'warning':
        return '#F59E0B'; // Yellow
      case 'success':
        return '#10B981'; // Green
      case 'info':
      default:
        return '#3B82F6'; // Blue
    }
  };

  const Icon = primaryRecommendation.icon;

  return (
    <Card className={`shadow-md border-0 rounded-xl ${isDarkMode ? 'bg-[#1e293b]' : 'bg-gradient-to-br from-blue-50 to-purple-50'}`}>
      <CardHeader className="pb-3">
        <CardTitle className={`flex items-center gap-2 text-sm ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          Assistente Financeiro Inteligente
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Primary Recommendation */}
        <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-800/50' : 'bg-white'}`}>
          <div className="flex items-start gap-3">
            <div 
              className="p-2 rounded-lg flex-shrink-0"
              style={{ backgroundColor: `${getIconColor(primaryRecommendation.type)}20` }}
            >
              <Icon 
                className="w-5 h-5" 
                style={{ color: getIconColor(primaryRecommendation.type) }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 
                className="font-semibold text-sm mb-1"
                style={{ color: isDarkMode ? 'white' : getIconColor(primaryRecommendation.type) }}
              >
                {primaryRecommendation.title}
              </h4>
              <p className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
                {primaryRecommendation.message}
              </p>
              
              {primaryRecommendation.details && (
                <div className="mt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className={`h-7 px-2 text-xs ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                  >
                    {isExpanded ? (
                      <>
                        Ocultar detalhes <ChevronUp className="w-3 h-3 ml-1" />
                      </>
                    ) : (
                      <>
                        Ver sugestão detalhada <ChevronDown className="w-3 h-3 ml-1" />
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>

          <AnimatePresence>
            {isExpanded && primaryRecommendation.details && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className={`mt-3 p-3 rounded-lg text-xs ${isDarkMode ? 'bg-gray-700/50 text-gray-200' : 'bg-blue-50 text-gray-700'}`}>
                  <p className="leading-relaxed">{primaryRecommendation.details}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Additional Recommendations */}
        {additionalRecommendations.length > 0 && (
          <div className="space-y-2">
            {additionalRecommendations.map((rec, index) => {
              const RecIcon = rec.icon;
              return (
                <div 
                  key={index}
                  className={`p-2 rounded-lg flex items-center gap-2 ${isDarkMode ? 'bg-gray-800/30' : 'bg-white/50'}`}
                >
                  <RecIcon 
                    className="w-4 h-4 flex-shrink-0" 
                    style={{ color: getIconColor(rec.type) }}
                  />
                  <p className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {rec.message}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer tip */}
        <div className={`text-xs text-center pt-2 border-t ${isDarkMode ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-500'}`}>
          💡 Atualize seus dados regularmente para análises mais precisas
        </div>
      </CardContent>
    </Card>
  );
};
