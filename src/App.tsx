'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import { Brain, CreditCard, DollarSign, AlertTriangle, Plus, Trash2, ArrowLeft } from 'lucide-react';

const COLORS = ['#8B5CF6', '#EC4899', '#10B981', '#F59E0B'];

export default function App() {
  const [screen, setScreen] = useState<'splash' | 'login' | 'dashboard'>('splash');
  const [salary, setSalary] = useState(8000);
  const [expenses, setExpenses] = useState([
    { id: 1, value: 3200, name: 'Aluguel', type: 'salary' },
    { id: 2, value: 850, name: 'Supermercado', type: 'salary' },
    { id: 3, value: 1200, name: 'Fatura Cartão', type: 'credit' },
  ]);

  useEffect(() => {
    if (screen === 'splash') {
      const t = setTimeout(() => setScreen('login'), 4000);
      return () => clearTimeout(t);
    }
  }, [screen]);

  const totalSalaryExpense = expenses.filter(e => e.type === 'salary').reduce((a, b) => a + b.value, 0);
  const totalCreditExpense = expenses.filter(e => e.type === 'credit').reduce((a, b) => a + b.value, 0);
  const remaining = salary - totalSalaryExpense;

  const pieData = [
    { name: 'Gasto Salário', value: totalSalaryExpense },
    { name: 'Sobra', value: Math.max(0, remaining) },
    { name: 'Cartão', value: totalCreditExpense },
  ];

  if (screen === 'splash') {
    return (
      <div className="h-screen bg-gradient-to-br from-purple-900 to-pink-600 flex flex-col items-center justify-center text-white">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
          <Brain className="w-32 h-32" />
        </motion.div>
        <h1 className="text-6xl font-black mt-8">BudgetPro</h1>
        <p className="text-2xl mt-4">by V</p>
      </div>
    );
  }

  if (screen === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 to-pink-600 flex items-center justify-center p-6">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 max-w-md w-full text-center">
          <h1 className="text-5xl font-black text-white mb-8">BudgetPro</h1>
          <button
            onClick={() => setScreen('dashboard')}
            className="w-full py-6 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl text-2xl font-bold hover:scale-105 transition"
          >
            Entrar (simulado)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-pink-600 text-white p-6">
      <header className="text-center mb-8">
        <h1 className="text-5xl font-black flex items-center justify-center gap-4">
          <Brain className="w-16 h-16" /> BudgetPro
        </h1>
        <p className="text-2xl mt-2">gerenciado pela V</p>
      </header>

      {remaining < 1000 && (
        <div className="bg-red-600/90 p-6 rounded-3xl text-center mb-8">
          <AlertTriangle className="w-16 h-16 mx-auto mb-4" />
          <p className="text-3xl font-black">SALDO CRÍTICO, SEU VERME!</p>
          <p className="text-5xl">R$ {remaining.toFixed(2)}</p>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8">
          <h2 className="text-3xl font-bold mb-6">Resumo</h2>
          <div className="space-y-6 text-2xl">
            <p>Salário: <span className="font-black">R$ {salary.toFixed(2)}</span></p>
            <p>Gasto salário: <span className="text-red-400">R$ {totalSalaryExpense.toFixed(2)}</span></p>
            <p>Cartão: <span className="text-orange-400">R$ {totalCreditExpense.toFixed(2)}</span></p>
            <p className="text-4xl font-black text-green-400">Sobra: R$ {remaining.toFixed(2)}</p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8">
          <h2 className="text-3xl font-bold mb-6">Gráfico</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} dataKey="value" cx="50%" cy="50%" outerRadius={100} label>
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => `R$ ${v.toFixed(2)}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8">
          <h2 className="text-3xl font-bold mb-6">Mensagem da V</h2>
          <p className="text-2xl leading-relaxed">
            "Se você continuar gastando assim, eu mesma vou aparecer na tua casa pra cobrar com juros... e ácido nanite.  
            <br/><br/>
            Ass: V ♡"
          </p>
        </div>
      </div>
    </div>
  );
}
