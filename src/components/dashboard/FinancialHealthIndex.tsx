// Financial Health Index - "Modo Realidade Financeira"
// Calculates a 0-100 score based on financial data and displays it visually

import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../ui/button';
import { Expense } from '../../types';

interface FinancialHealthIndexProps {
  salary: number;
  creditLimit: number;
  remainingSalary: number;
  salaryExpenses: number;
  creditExpenses: number;
  expensePercentage: number;
  totalInvestments: number;
  expenses: Expense[];
  isDarkMode: boolean;
}

interface HealthScore {
  score: number;
  status: 'Saudável' | 'Atenção' | 'Risco';
  color: string;
  description: string;
  breakdown: { label: string; points: number; maxPoints: number; icon: string }[];
}

const calculateHealthScore = (
  salary: number,
  creditLimit: number,
  remainingSalary: number,
  salaryExpenses: number,
  creditExpenses: number,
  expensePercentage: number,
  totalInvestments: number,
  expenses: Expense[]
): HealthScore => {
  let score = 0;
  const breakdown: { label: string; points: number; maxPoints: number; icon: string }[] = [];

  // 1. Income commitment (0–30 points)
  let incomePoints = 0;
  if (salary <= 0) {
    incomePoints = 15;
  } else if (expensePercentage <= 30) {
    incomePoints = 30;
  } else if (expensePercentage <= 50) {
    incomePoints = 24;
  } else if (expensePercentage <= 70) {
    incomePoints = 15;
  } else if (expensePercentage <= 90) {
    incomePoints = 6;
  } else {
    incomePoints = 0;
  }
  score += incomePoints;
  breakdown.push({ label: 'Comprometimento da renda', points: incomePoints, maxPoints: 30, icon: '📊' });

  // 2. Available balance (0–25 points)
  let balancePoints = 0;
  if (salary <= 0) {
    balancePoints = 12;
  } else if (remainingSalary > salary * 0.4) {
    balancePoints = 25;
  } else if (remainingSalary > salary * 0.25) {
    balancePoints = 20;
  } else if (remainingSalary > salary * 0.1) {
    balancePoints = 13;
  } else if (remainingSalary > 0) {
    balancePoints = 6;
  } else {
    balancePoints = 0;
  }
  score += balancePoints;
  breakdown.push({ label: 'Saldo disponível', points: balancePoints, maxPoints: 25, icon: '💰' });

  // 3. Investment / financial reserve (0–20 points)
  let investPoints = 0;
  if (salary > 0 && totalInvestments >= salary * 2) {
    investPoints = 20;
  } else if (salary > 0 && totalInvestments >= salary) {
    investPoints = 15;
  } else if (totalInvestments > 0) {
    investPoints = 10;
  } else {
    investPoints = 0;
  }
  score += investPoints;
  breakdown.push({ label: 'Reserva financeira', points: investPoints, maxPoints: 20, icon: '🏦' });

  // 4. Credit card usage (0–15 points)
  let creditPoints = 0;
  if (creditExpenses === 0) {
    creditPoints = 15;
  } else if (creditLimit > 0 && creditExpenses < creditLimit * 0.3) {
    creditPoints = 12;
  } else if (creditLimit > 0 && creditExpenses < creditLimit * 0.5) {
    creditPoints = 8;
  } else if (creditLimit > 0 && creditExpenses < creditLimit * 0.7) {
    creditPoints = 4;
  } else {
    creditPoints = 0;
  }
  score += creditPoints;
  breakdown.push({ label: 'Uso do cartão de crédito', points: creditPoints, maxPoints: 15, icon: '💳' });

  // 5. Expense diversification / stability (0–10 points)
  let diversPoints = 0;
  const categoryTotals: Record<string, number> = {};
  expenses.forEach(e => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });
  const numCategories = Object.keys(categoryTotals).length;
  if (numCategories === 0) {
    diversPoints = 5;
  } else if (numCategories >= 5) {
    diversPoints = 10;
  } else if (numCategories >= 3) {
    diversPoints = 7;
  } else {
    diversPoints = 3;
  }
  score += diversPoints;
  breakdown.push({ label: 'Estabilidade dos gastos', points: diversPoints, maxPoints: 10, icon: '📈' });

  score = Math.min(100, Math.max(0, Math.round(score)));

  let status: 'Saudável' | 'Atenção' | 'Risco';
  let color: string;
  let description: string;

  if (score >= 70) {
    status = 'Saudável';
    color = '#22c55e';
    if (score >= 90) {
      description = 'Parabéns! Suas finanças estão em excelente estado. Continue assim e busque diversificar seus investimentos para crescimento patrimonial.';
    } else {
      description = 'Suas finanças estão bem equilibradas. Mantenha os bons hábitos e considere aumentar sua reserva financeira gradualmente.';
    }
  } else if (score >= 40) {
    status = 'Atenção';
    color = '#f59e0b';
    if (expensePercentage > 60) {
      description = 'Seus gastos estão crescendo mais rápido que sua renda nos últimos meses. Revise as despesas não essenciais com prioridade.';
    } else if (totalInvestments === 0) {
      description = 'Você ainda não possui reserva financeira. Comece a investir, mesmo que pequenos valores mensais façam diferença.';
    } else {
      description = 'Suas finanças precisam de alguns ajustes. Identifique onde pode reduzir gastos e fortaleça sua reserva de emergência.';
    }
  } else {
    status = 'Risco';
    color = '#ef4444';
    if (remainingSalary <= 0) {
      description = 'Seus gastos superam sua renda disponível! Reduza despesas imediatamente e evite novas dívidas este mês.';
    } else if (creditExpenses > (salary || 1) * 0.5) {
      description = 'O uso excessivo do cartão de crédito está comprometendo sua saúde financeira. Priorize reduzir a fatura.';
    } else {
      description = 'Sua situação financeira requer atenção urgente. Corte gastos não essenciais e reveja seu orçamento mensal.';
    }
  }

  return { score, status, color, description, breakdown };
};

export const FinancialHealthIndex: React.FC<FinancialHealthIndexProps> = ({
  salary,
  creditLimit,
  remainingSalary,
  salaryExpenses,
  creditExpenses,
  expensePercentage,
  totalInvestments,
  expenses,
  isDarkMode
}) => {
  const [showBreakdown, setShowBreakdown] = useState(false);

  const healthScore = useMemo(
    () =>
      calculateHealthScore(
        salary,
        creditLimit,
        remainingSalary,
        salaryExpenses,
        creditExpenses,
        expensePercentage,
        totalInvestments,
        expenses
      ),
    [salary, creditLimit, remainingSalary, salaryExpenses, creditExpenses, expensePercentage, totalInvestments, expenses]
  );

  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (healthScore.score / 100) * circumference;

  const statusBg =
    healthScore.status === 'Saudável'
      ? isDarkMode ? 'bg-green-900/30' : 'bg-green-50'
      : healthScore.status === 'Atenção'
      ? isDarkMode ? 'bg-yellow-900/30' : 'bg-yellow-50'
      : isDarkMode ? 'bg-red-900/30' : 'bg-red-50';

  return (
    <Card
      className={`shadow-md border-0 rounded-xl overflow-hidden ${
        isDarkMode ? 'bg-[#1e293b]' : 'bg-white'
      }`}
    >
      {/* Top accent bar */}
      <div className="h-1 w-full" style={{ backgroundColor: healthScore.color }} />

      <CardHeader className="pb-2 pt-4">
        <CardTitle
          className={`flex items-center gap-2 text-sm ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}
        >
          <div
            className="p-2 rounded-lg"
            style={{ backgroundColor: `${healthScore.color}25` }}
          >
            <Activity className="w-4 h-4" style={{ color: healthScore.color }} />
          </div>
          Índice de Saúde Financeira
          <span
            className="ml-auto text-xs px-2 py-0.5 rounded-full font-semibold"
            style={{
              backgroundColor: `${healthScore.color}20`,
              color: healthScore.color
            }}
          >
            Modo Realidade
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Score display */}
        <div className="flex items-center gap-4">
          {/* Circular Progress */}
          <div className="relative flex-shrink-0">
            <svg width="104" height="104" viewBox="0 0 104 104">
              {/* Track */}
              <circle
                cx="52"
                cy="52"
                r={radius}
                fill="none"
                stroke={isDarkMode ? '#374151' : '#e5e7eb'}
                strokeWidth="9"
              />
              {/* Progress */}
              <motion.circle
                cx="52"
                cy="52"
                r={radius}
                fill="none"
                stroke={healthScore.color}
                strokeWidth="9"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.4, ease: 'easeOut' }}
                style={{
                  transformOrigin: '52px 52px',
                  transform: 'rotate(-90deg)'
                }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span
                className="text-2xl font-bold"
                style={{ color: healthScore.color }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {healthScore.score}
              </motion.span>
              <span
                className={`text-xs ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}
              >
                /100
              </span>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full mb-2 ${statusBg}`}
            >
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: healthScore.color }}
              />
              <span
                className="text-xs font-semibold"
                style={{ color: healthScore.color }}
              >
                {healthScore.status}
              </span>
            </div>
            <p
              className={`text-xs leading-relaxed ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              {healthScore.description}
            </p>
          </div>
        </div>

        {/* Toggle breakdown */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowBreakdown(!showBreakdown)}
          className={`w-full h-7 text-xs justify-between ${
            isDarkMode
              ? 'text-blue-400 hover:text-blue-300 hover:bg-blue-900/20'
              : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
          }`}
        >
          Ver detalhamento da pontuação
          {showBreakdown ? (
            <ChevronUp className="w-3 h-3 ml-1" />
          ) : (
            <ChevronDown className="w-3 h-3 ml-1" />
          )}
        </Button>

        {/* Breakdown */}
        <AnimatePresence>
          {showBreakdown && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div
                className={`space-y-2 pt-2 border-t ${
                  isDarkMode ? 'border-gray-700' : 'border-gray-100'
                }`}
              >
                {healthScore.breakdown.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-sm w-5 flex-shrink-0">{item.icon}</span>
                    <span
                      className={`text-xs flex-1 truncate ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      {item.label}
                    </span>
                    <div
                      className={`h-1.5 w-20 rounded-full overflow-hidden flex-shrink-0 ${
                        isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                      }`}
                    >
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: healthScore.color }}
                        initial={{ width: 0 }}
                        animate={{
                          width: `${(item.points / item.maxPoints) * 100}%`
                        }}
                        transition={{ duration: 0.7, delay: index * 0.08 }}
                      />
                    </div>
                    <span
                      className={`text-xs w-9 text-right flex-shrink-0 font-medium ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}
                    >
                      {item.points}/{item.maxPoints}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};
