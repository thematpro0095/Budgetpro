// Summary card with progress indicator

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BarChart3 } from 'lucide-react';

interface ProgressRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({ 
  percentage, 
  size = 100, 
  strokeWidth = 6, 
  color = '#046BF4' 
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-semibold" style={{ color }}>
          {Math.round(percentage)}%
        </span>
      </div>
    </div>
  );
};

interface MonthlySummaryCardProps {
  expensePercentage: number;
  isDarkMode: boolean;
}

export const MonthlySummaryCard: React.FC<MonthlySummaryCardProps> = ({
  expensePercentage,
  isDarkMode
}) => {
  const getColor = () => {
    if (expensePercentage > 80) return '#EF4444';
    if (expensePercentage > 60) return '#F59E0B';
    return '#046BF4';
  };

  const getMessage = () => {
    if (expensePercentage > 90) return '🚨 Gastos muito altos!';
    if (expensePercentage > 70) return '⚠️ Cuidado com os gastos';
    return '✅ Gastos controlados';
  };

  return (
    <Card className={`shadow-md border-0 rounded-xl ${isDarkMode ? 'bg-[#1e293b]' : ''}`}>
      <CardHeader className="pb-3">
        <CardTitle className={`flex items-center gap-2 text-sm ${isDarkMode ? 'text-white' : ''}`}>
          <div className="p-2 rounded-lg" style={{ backgroundColor: '#046BF4' }}>
            <BarChart3 className="w-4 h-4 text-white" />
          </div>
          Resumo do Mês
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-3">
          <div className="flex justify-between items-center mb-2">
            <span className={`text-sm ${isDarkMode ? 'text-white' : ''}`}>
              Você gastou {Math.round(expensePercentage)}% da sua renda
            </span>
            <span className={`text-sm font-semibold ${isDarkMode ? 'text-white' : ''}`}>
              {Math.round(expensePercentage)}%
            </span>
          </div>
          <div className="relative h-3 rounded-full overflow-hidden" style={{ backgroundColor: isDarkMode ? '#3b82f6' : '#e5e7eb' }}>
            <div 
              className="h-full rounded-full transition-all duration-500"
              style={{ 
                width: `${expensePercentage}%`,
                backgroundColor: getColor()
              }}
            />
          </div>
          <p className={`text-xs mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {getMessage()}
          </p>
        </div>
        
        <div className="flex justify-center mt-4">
          <ProgressRing 
            percentage={expensePercentage} 
            size={100}
            color={getColor()}
          />
        </div>
      </CardContent>
    </Card>
  );
};
