// Behavioral Financial Profile - automatically classifies the user based on financial behavior

import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { motion } from 'motion/react';
import { UserCircle2, TrendingUp, Target, Shield, Zap, AlertCircle } from 'lucide-react';
import { Expense } from '../../types';

type ProfileType = 'Estratégico' | 'Equilibrado' | 'Conservador' | 'Arriscado' | 'Impulsivo';

interface ProfileInfo {
  type: ProfileType;
  description: string;
  tip: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: React.ElementType;
  emoji: string;
}

interface BehavioralProfileProps {
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

const PROFILES: Record<string, ProfileInfo> = {
  estrategico: {
    type: 'Estratégico',
    description:
      'Você planeja bem suas finanças, mantém investimentos ativos e controla os gastos com disciplina consistente.',
    tip: 'Diversifique seus investimentos entre renda fixa, renda variável e reserve 3–6 meses de renda para emergências.',
    color: '#22c55e',
    bgColor: '#22c55e18',
    borderColor: '#22c55e40',
    icon: TrendingUp,
    emoji: '🎯'
  },
  equilibrado: {
    type: 'Equilibrado',
    description:
      'Você mantém controle razoável dos gastos, mas ainda há margem para melhorar sua estratégia de investimento.',
    tip: 'Considere automatizar aportes mensais — mesmo R$ 100/mês investidos regularmente geram resultados expressivos.',
    color: '#3b82f6',
    bgColor: '#3b82f618',
    borderColor: '#3b82f640',
    icon: Target,
    emoji: '⚖️'
  },
  conservador: {
    type: 'Conservador',
    description:
      'Você evita riscos e mantém os gastos controlados, mas pode estar perdendo oportunidades de crescimento do patrimônio.',
    tip: 'Comece com investimentos de baixo risco como Tesouro Selic ou CDB para rentabilizar seu saldo parado.',
    color: '#8b5cf6',
    bgColor: '#8b5cf618',
    borderColor: '#8b5cf640',
    icon: Shield,
    emoji: '🛡️'
  },
  arriscado: {
    type: 'Arriscado',
    description:
      'Seus gastos comprometem boa parte da renda, criando vulnerabilidade financeira em situações inesperadas.',
    tip: 'Crie um orçamento mensal detalhado e estabeleça limites por categoria. Reduza pelo menos 10% dos gastos fixos.',
    color: '#f59e0b',
    bgColor: '#f59e0b18',
    borderColor: '#f59e0b40',
    icon: Zap,
    emoji: '⚠️'
  },
  impulsivo: {
    type: 'Impulsivo',
    description:
      'Compras frequentes em categorias variadas dificultam o planejamento e comprometem suas metas financeiras.',
    tip: 'Adote a regra das 24h: antes de compras não planejadas, aguarde um dia completo para reavaliar a necessidade.',
    color: '#ef4444',
    bgColor: '#ef444418',
    borderColor: '#ef444440',
    icon: AlertCircle,
    emoji: '🔥'
  }
};

const determineProfile = (
  salary: number,
  creditLimit: number,
  remainingSalary: number,
  salaryExpenses: number,
  creditExpenses: number,
  expensePercentage: number,
  totalInvestments: number,
  expenses: Expense[]
): ProfileInfo => {
  // Return default when no meaningful data
  if (salary <= 0 && expenses.length === 0) {
    return {
      ...PROFILES.equilibrado,
      description:
        'Adicione seus dados financeiros para descobrir seu perfil comportamental personalizado!',
      tip: 'Registre salário, gastos e investimentos para uma análise completa do seu comportamento.'
    };
  }

  const scores: Record<string, number> = {
    estrategico: 0,
    equilibrado: 0,
    conservador: 0,
    arriscado: 0,
    impulsivo: 0
  };

  // ── Investment behavior ──────────────────────────────────────────
  if (salary > 0 && totalInvestments >= salary * 2) {
    scores.estrategico += 4;
  } else if (salary > 0 && totalInvestments >= salary) {
    scores.estrategico += 3;
    scores.equilibrado += 1;
  } else if (totalInvestments > 0) {
    scores.equilibrado += 3;
    scores.estrategico += 1;
  } else {
    scores.conservador += 1;
    scores.impulsivo += 1;
    scores.arriscado += 1;
  }

  // ── Expense-to-income ratio ──────────────────────────────────────
  if (expensePercentage <= 35) {
    scores.estrategico += 3;
    scores.conservador += 2;
  } else if (expensePercentage <= 55) {
    scores.equilibrado += 4;
    scores.estrategico += 1;
  } else if (expensePercentage <= 75) {
    scores.arriscado += 3;
    scores.impulsivo += 1;
  } else {
    scores.arriscado += 4;
    scores.impulsivo += 3;
  }

  // ── Credit card usage ────────────────────────────────────────────
  if (creditExpenses === 0) {
    scores.conservador += 3;
    scores.estrategico += 1;
  } else if (creditLimit > 0 && creditExpenses < creditLimit * 0.3) {
    scores.equilibrado += 3;
    scores.estrategico += 2;
  } else if (creditLimit > 0 && creditExpenses < creditLimit * 0.6) {
    scores.arriscado += 2;
    scores.impulsivo += 2;
  } else {
    scores.arriscado += 4;
    scores.impulsivo += 3;
  }

  // ── Remaining balance ────────────────────────────────────────────
  if (salary > 0 && remainingSalary > salary * 0.35) {
    scores.estrategico += 3;
    scores.conservador += 2;
  } else if (remainingSalary > 0) {
    scores.equilibrado += 3;
  } else {
    scores.arriscado += 3;
    scores.impulsivo += 2;
  }

  // ── Expense category concentration (impulse buying signal) ───────
  const categoryCount: Record<string, number> = {};
  expenses.forEach(e => {
    categoryCount[e.category] = (categoryCount[e.category] || 0) + 1;
  });
  const repeatedCategories = Object.values(categoryCount).filter(c => c > 2).length;
  const totalCategories = Object.keys(categoryCount).length;

  if (repeatedCategories >= 3) {
    scores.impulsivo += 4;
  } else if (repeatedCategories >= 1) {
    scores.impulsivo += 1;
    scores.equilibrado += 1;
  }

  // Many distinct categories with low individual values = organized
  if (totalCategories >= 5 && expensePercentage <= 60) {
    scores.estrategico += 2;
    scores.equilibrado += 1;
  }

  // ── Positive recurring balance signal ────────────────────────────
  if (salary > 0 && remainingSalary > 0 && totalInvestments > 0) {
    scores.estrategico += 2;
  }

  // ── Find the winning profile ──────────────────────────────────────
  const maxScore = Math.max(...Object.values(scores));
  const winner = Object.entries(scores).find(([, v]) => v === maxScore)?.[0] ?? 'equilibrado';

  return PROFILES[winner];
};

export const BehavioralProfile: React.FC<BehavioralProfileProps> = ({
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
  const profile = useMemo(
    () =>
      determineProfile(
        salary,
        creditLimit,
        remainingSalary,
        salaryExpenses,
        creditExpenses,
        expensePercentage,
        totalInvestments,
        expenses
      ),
    [
      salary,
      creditLimit,
      remainingSalary,
      salaryExpenses,
      creditExpenses,
      expensePercentage,
      totalInvestments,
      expenses
    ]
  );

  const Icon = profile.icon;

  return (
    <Card
      className={`shadow-md border-0 rounded-xl overflow-hidden ${
        isDarkMode ? 'bg-[#1e293b]' : 'bg-white'
      }`}
    >
      {/* Top accent bar */}
      <div className="h-1 w-full" style={{ backgroundColor: profile.color }} />

      <CardHeader className="pb-2 pt-4">
        <CardTitle
          className={`flex items-center gap-2 text-sm ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}
        >
          <div
            className="p-2 rounded-lg"
            style={{ backgroundColor: profile.bgColor }}
          >
            <UserCircle2 className="w-4 h-4" style={{ color: profile.color }} />
          </div>
          Perfil Comportamental Financeiro
          <span
            className="ml-auto text-xs px-2 py-0.5 rounded-full font-semibold"
            style={{
              backgroundColor: profile.bgColor,
              color: profile.color
            }}
          >
            Auto
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <motion.div
          key={profile.type}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-3"
        >
          {/* Profile badge + description */}
          <div
            className="flex items-start gap-3 p-3 rounded-xl border"
            style={{
              backgroundColor: profile.bgColor,
              borderColor: profile.borderColor
            }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{ backgroundColor: isDarkMode ? '#1e293b' : '#ffffff80' }}
            >
              {profile.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span
                  className="font-bold text-base"
                  style={{ color: profile.color }}
                >
                  {profile.type}
                </span>
                <span
                  className="text-xs px-1.5 py-0.5 rounded-full font-medium"
                  style={{
                    backgroundColor: isDarkMode ? '#1e293b' : '#ffffff80',
                    color: profile.color
                  }}
                >
                  Seu Perfil
                </span>
              </div>
              <p
                className={`text-xs leading-relaxed ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                {profile.description}
              </p>
            </div>
          </div>

          {/* Strategic tip */}
          <div
            className={`p-3 rounded-xl flex items-start gap-3 ${
              isDarkMode ? 'bg-gray-800/60' : 'bg-gray-50'
            }`}
          >
            <div
              className="p-1.5 rounded-lg flex-shrink-0 mt-0.5"
              style={{ backgroundColor: profile.bgColor }}
            >
              <Icon className="w-3.5 h-3.5" style={{ color: profile.color }} />
            </div>
            <div>
              <span
                className={`text-xs font-semibold ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-700'
                }`}
              >
                💡 Sugestão estratégica
              </span>
              <p
                className={`text-xs mt-0.5 leading-relaxed ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                {profile.tip}
              </p>
            </div>
          </div>

          {/* Profile scale indicator */}
          <div className={`pt-1 ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
            <div className="flex items-center justify-between mb-1.5">
              <span
                className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
              >
                Escala de perfis
              </span>
            </div>
            <div className="flex gap-1">
              {(['Impulsivo', 'Arriscado', 'Conservador', 'Equilibrado', 'Estratégico'] as ProfileType[]).map(
                (p) => {
                  const pKey = p.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                  const pColor = PROFILES[pKey]?.color ?? '#6b7280';
                  const isActive = p === profile.type;
                  return (
                    <motion.div
                      key={p}
                      className="flex-1 flex flex-col items-center gap-1"
                      animate={{ scale: isActive ? 1.05 : 1 }}
                    >
                      <div
                        className="w-full h-1.5 rounded-full transition-all"
                        style={{
                          backgroundColor: isActive
                            ? pColor
                            : isDarkMode
                            ? '#374151'
                            : '#e5e7eb',
                          opacity: isActive ? 1 : 0.4
                        }}
                      />
                      <span
                        className="text-[9px] text-center leading-tight hidden sm:block"
                        style={{
                          color: isActive
                            ? pColor
                            : isDarkMode
                            ? '#6b7280'
                            : '#9ca3af',
                          fontWeight: isActive ? 700 : 400
                        }}
                      >
                        {p}
                      </span>
                    </motion.div>
                  );
                }
              )}
            </div>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
};
