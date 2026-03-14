// Evolution chart component with proper data separation

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { DailyData } from '../../types';
import { MONTH_NAMES, CHART_COLORS } from '../../constants';

interface EvolutionChartProps {
  chartData: DailyData[];
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  isDarkMode: boolean;
}

export const EvolutionChart: React.FC<EvolutionChartProps> = ({
  chartData,
  selectedMonth,
  onMonthChange,
  isDarkMode
}) => {
  // Deduplicate by day to prevent recharts SVG key conflicts
  const safeData = React.useMemo(() => {
    const seen = new Set<number>();
    return chartData.filter(d => {
      if (seen.has(d.day)) return false;
      seen.add(d.day);
      return true;
    });
  }, [chartData]);

  return (
    <Card className={`shadow-md border-0 rounded-xl ${isDarkMode ? 'bg-[#1e293b]' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className={`flex items-center gap-2 text-sm ${isDarkMode ? 'text-white' : ''}`}>
            <div className="p-2 rounded-lg" style={{ backgroundColor: '#046BF4' }}>
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            Evolução dos Últimos Meses
          </CardTitle>
          <Select value={selectedMonth} onValueChange={onMonthChange}>
            <SelectTrigger className={`w-32 h-8 text-xs ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MONTH_NAMES.map(month => (
                <SelectItem key={month} value={month}>{month}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Gráfico */}
          <div style={{ height: '192px', minHeight: '192px', width: '100%' }}>
            {safeData.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  Sem dados para o mês selecionado
                </p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <LineChart data={safeData}>
                  <CartesianGrid key="grid" strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#f0f0f0'} />
                  <XAxis
                    key="x-axis"
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: isDarkMode ? '#9ca3af' : '#666' }}
                  />
                  <YAxis
                    key="y-axis"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: isDarkMode ? '#9ca3af' : '#666' }}
                    tickFormatter={(value) => `R$ ${value.toFixed(0)}`}
                  />
                  <Tooltip
                    key="tooltip"
                    contentStyle={{
                      backgroundColor: isDarkMode ? '#1e293b' : '#fff',
                      border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
                      borderRadius: '8px',
                      fontSize: '11px',
                      color: isDarkMode ? '#f1f5f9' : '#0f172a',
                    }}
                    formatter={(value: number) => [`R$ ${value.toFixed(2)}`, '']}
                    labelFormatter={(label) => `Dia ${label}`}
                  />
                  <Line
                    key="line-salario"
                    type="monotone"
                    dataKey="salario"
                    stroke={CHART_COLORS.salario}
                    strokeWidth={2}
                    dot={{ fill: CHART_COLORS.salario, strokeWidth: 2, r: 2 }}
                    activeDot={{ r: 6, fill: CHART_COLORS.salario }}
                    name="Salário"
                    isAnimationActive={false}
                  />
                  <Line
                    key="line-cartao"
                    type="monotone"
                    dataKey="cartao"
                    stroke={CHART_COLORS.cartao}
                    strokeWidth={2}
                    dot={{ fill: CHART_COLORS.cartao, strokeWidth: 2, r: 2 }}
                    activeDot={{ r: 6, fill: CHART_COLORS.cartao }}
                    name="Cartão"
                    isAnimationActive={false}
                  />
                  <Line
                    key="line-investimentos"
                    type="monotone"
                    dataKey="investimentos"
                    stroke={CHART_COLORS.investimentos}
                    strokeWidth={2}
                    dot={{ fill: CHART_COLORS.investimentos, strokeWidth: 2, r: 2 }}
                    activeDot={{ r: 6, fill: CHART_COLORS.investimentos }}
                    name="Investimentos"
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Legenda */}
          <div className="flex items-center justify-center gap-4 pt-2">
            <div className="flex items-center gap-1.5">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: CHART_COLORS.salario }}
              />
              <span className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Salário
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: CHART_COLORS.cartao }}
              />
              <span className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Cartão
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: CHART_COLORS.investimentos }}
              />
              <span className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Investimentos
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};