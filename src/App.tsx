import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Input } from './components/ui/input';
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Label } from './components/ui/label';
import { Alert, AlertDescription } from './components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Progress } from './components/ui/progress';
import { 
  PlusCircle, Trash2, DollarSign, ShoppingCart, Car, Coffee, Home, Smartphone,
  Mail, Lock, User, Calendar, FileText, CreditCard, TrendingUp, TrendingDown,
  Brain, AlertTriangle, ArrowUpRight, ArrowDownRight, BarChart3, PieChart,
  ArrowLeft, CheckCircle, XCircle, Building, Zap, Coins, Rocket
} from 'lucide-react';
import { 
  PieChart as RechartsPieChart, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  LineChart, Line, Legend, Pie 
} from 'recharts';

const logoDefinitiva = "/logo.png";

// Types (mantidos iguais)
type Screen = 'splash' | 'login' | 'signup' | 'forgot-password' | 'reset-password' | 'dashboard' | 'investment-details' | 'investment-purchase' | 'investment-result';
type IconType = 'coffee' | 'car' | 'home' | 'shopping' | 'smartphone';
type RiskLevel = 'low' | 'medium' | 'high';
type InvestmentStatus = 'available' | 'purchased' | 'completed';
type PaymentMethod = 'salary' | 'credit';

interface Expense {
  id: string;
  category: string;
  amount: number;
  iconType: IconType;
  paymentMethod: PaymentMethod;
}

interface Investment {
  id: string;
  name: string;
  type: string;
  description: string;
  riskLevel: RiskLevel;
  expectedReturn: number;
  minInvestment: number;
  maxInvestment: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  historicalData: { month: string; value: number }[];
  status: InvestmentStatus;
  purchaseAmount?: number;
  purchaseDate?: Date;
  currentValue?: number;
  profitLoss?: number;
}

const iconMap = {
  coffee: Coffee,
  car: Car,
  home: Home,
  shopping: ShoppingCart,
  smartphone: Smartphone,
};

const MOCK_INVESTMENTS: Investment[] = [
  // ... (mantém os mesmos investimentos do código original)
  {
    id: 'tech-nova',
    name: 'TechNova',
    type: 'Ações',
    description: 'Empresa de tecnologia em crescimento',
    riskLevel: 'medium' as RiskLevel,
    expectedReturn: 10,
    minInvestment: 100,
    maxInvestment: 5000,
    icon: Zap,
    color: '#3B82F6',
    historicalData: [
      { month: 'Jan', value: 100 }, { month: 'Fev', value: 105 },
      { month: 'Mar', value: 108 }, { month: 'Abr', value: 112 },
      { month: 'Mai', value: 110 }, { month: 'Jun', value: 115 }
    ],
    status: 'available' as InvestmentStatus
  },
  // Adicione os outros 3 investimentos aqui igual ao original...
];

export default function App() {
  // States principais
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [darkMode, setDarkMode] = useState(false);
  const [salary, setSalary] = useState(0);
  const [creditLimit, setCreditLimit] = useState(0);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [creditBillAmount, setCreditBillAmount] = useState(0);
  const [investments, setInvestments] = useState<Investment[]>(MOCK_INVESTMENTS);
  
  // States de formulário (email, password, etc - mantenha os do original)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // ... outros states de login/signup

  const [newCategory, setNewCategory] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [billPaymentAmount, setBillPaymentAmount] = useState('');

  // 🔧 CORREÇÃO 1: MODO ESCURO AUTOMÁTICO
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setDarkMode(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setDarkMode(e.matches);
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // 🔧 CORREÇÃO 2: SALVAR/CARREGAR SALÁRIO SEM TRAVAR
  useEffect(() => {
    try {
      const saved = localStorage.getItem('budgetProData');
      if (saved) {
        const data = JSON.parse(saved);
        // ✅ NÃO SOBRESCREVE se já tem valor salvo!
        if (data.salary !== undefined && data.salary > 0) {
          setSalary(data.salary);
        } else {
          setSalary(5000);
        }
        if (data.creditLimit !== undefined && data.creditLimit > 0) {
          setCreditLimit(data.creditLimit);
        } else {
          setCreditLimit(3000);
        }
        setExpenses(data.expenses || []);
        setCreditBillAmount(data.creditBillAmount || 0);
        setInvestments(data.investments || MOCK_INVESTMENTS);
        console.log('✅ Dados carregados:', { salary: data.salary, creditLimit: data.creditLimit });
      } else {
        console.log('🆕 Primeira vez - valores padrão');
        setSalary(5000);
        setCreditLimit(3000);
      }
    } catch (e) {
      console.error('❌ Erro ao carregar dados:', e);
      setSalary(5000);
      setCreditLimit(3000);
    }
  }, []);

  // Salva automaticamente quando mudar
  useEffect(() => {
    const dataToSave = {
      salary,
      creditLimit,
      expenses,
      creditBillAmount,
      investments,
      version: '1.1' // versão atualizada
    };
    localStorage.setItem('budgetProData', JSON.stringify(dataToSave));
    console.log('💾 Salvo:', { salary, creditLimit });
  }, [salary, creditLimit, expenses, creditBillAmount, investments]);

  // Cálculos financeiros
  const salaryExpenses = React.useMemo(() => 
    expenses.filter(e => e.paymentMethod === 'salary').reduce((sum, e) => sum + e.amount, 0), [expenses]
  );
  
  const creditExpenses = React.useMemo(() => 
    expenses.filter(e => e.paymentMethod === 'credit').reduce((sum, e) => sum + e.amount, 0), [expenses]
  );

  const remainingSalary = salary - (salaryExpenses + creditBillAmount);
  const creditBill = creditExpenses;

  // Funções principais (addExpense, payCreditBill, etc - mantenha as do original)
  const addExpense = (paymentMethod: PaymentMethod) => {
    if (newCategory && newAmount) {
      const iconTypes: IconType[] = ['shopping', 'smartphone', 'coffee'];
      const randomIcon = iconTypes[Math.floor(Math.random() * iconTypes.length)];

      setExpenses(prev => [...prev, {
        id: Date.now().toString(),
        category: newCategory,
        amount: parseFloat(newAmount),
        iconType: randomIcon,
        paymentMethod
      }]);
      setNewCategory('');
      setNewAmount('');
    }
  };

  const payCreditBill = () => {
    const paymentAmount = parseFloat(billPaymentAmount);
    if (paymentAmount > 0 && paymentAmount <= creditBill && paymentAmount <= remainingSalary) {
      setCreditBillAmount(prev => prev + paymentAmount);
      setBillPaymentAmount('');
      alert(`✅ Pagamento de R$ ${paymentAmount.toFixed(2)} realizado!`);
    }
  };

  // SPLASH SCREEN
  if (currentScreen === 'splash') {
    return (
      <motion.div 
        className="min-h-screen flex flex-col items-center justify-center px-4" 
        style={{ backgroundColor: '#046BF4' }}
      >
        <img src={logoDefinitiva} alt="BudgetPro" className="w-32 h-32 mb-8 object-contain" />
        <div className="relative w-20 h-20">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full"
              style={{
                left: '50%',
                top: '50%',
                transform: `translate(${-12 + Math.cos((i * 30) * Math.PI / 180) * 28}px, ${-12 + Math.sin((i * 30) * Math.PI / 180) * 28}px)`,
              }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.1 }}
            />
          ))}
        </div>
      </motion.div>
    );
  }

  // LOGIN SCREEN (com dark mode)
  if (currentScreen === 'login') {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 to-white'}`}>
        <div className="px-4 py-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">BudgetPro</h1>
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-blue-600'}`}>
            Seu assistente financeiro pessoal
          </p>
        </div>

        <div className={`max-w-md mx-auto px-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl`}>
          <div className="space-y-4 py-8">
            <Input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : ''}`}
            />
            <Input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : ''}`}
            />
            <Button 
              onClick={() => setCurrentScreen('dashboard')}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Entrar
            </Button>
            <Button 
              variant="outline"
              onClick={() => setCurrentScreen('dashboard')}
              className="w-full"
            >
              Pular (Demo)
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // 🔧 DASHBOARD COM DARK MODE E CONTRASTE CINZA
  if (currentScreen === 'dashboard') {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-slate-50 to-gray-100'}`}>
        {/* Header */}
        <div className="px-4 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={logoDefinitiva} alt="Logo" className="w-10 h-10" />
              <div>
                <h1 className="text-xl font-bold">BudgetPro</h1>
                <p className="text-xs opacity-90">Suas finanças</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                {darkMode ? '🌙 Escuro' : '☀️ Claro'}
              </span>
            </div>
          </div>
        </div>

        <div className="px-4 py-6 space-y-6">
          {/* Cards principais - CONTRASTE CORRIGIDO */}
          <div className="grid grid-cols-2 gap-4">
            {/* Salário */}
            <Card className={`${darkMode ? 'bg-gray-800 border-gray-700 shadow-lg' : 'bg-white shadow-sm'}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <DollarSign className="w-5 h-5 text-green-500" />
                  <span className="text-xs text-gray-500">Salário Restante</span>
                </div>
                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  R$ {remainingSalary.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500">Total: R$ {salary.toFixed(2)}</p>
              </CardContent>
            </Card>

            {/* Cartão */}
            <Card className={`${darkMode ? 'bg-gray-800 border-gray-700 shadow-lg' : 'bg-white shadow-sm'}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <CreditCard className="w-5 h-5 text-purple-500" />
                  <span className="text-xs text-gray-500">Limite Disponível</span>
                </div>
                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  R$ {(creditLimit - creditExpenses).toFixed(2)}
                </p>
                <p className="text-xs text-gray-500">Limite: R$ {creditLimit.toFixed(2)}</p>
              </CardContent>
            </Card>
          </div>

          {/* Editar valores */}
          <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
            <CardContent className="p-6">
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Configurar Valores
              </h3>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <Label>Salário Mensal</Label>
                  <Input
                    type="number"
                    value={salary}
                    onChange={(e) => setSalary(parseFloat(e.target.value) || 0)}
                    className={`${darkMode ? 'bg-gray-700 text-white' : ''}`}
                    placeholder="R$ 0,00"
                  />
                </div>
                <div>
                  <Label>Limite do Cartão</Label>
                  <Input
                    type="number"
                    value={creditLimit}
                    onChange={(e) => setCreditLimit(parseFloat(e.target.value) || 0)}
                    className={`${darkMode ? 'bg-gray-700 text-white' : ''}`}
                    placeholder="R$ 0,00"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Adicionar gastos */}
          <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
            <CardContent className="p-6">
              <div className="flex gap-3">
                <Input
                  placeholder="Categoria (ex: Café)"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className={`${darkMode ? 'bg-gray-700 text-white' : ''}`}
                />
                <Input
                  type="number"
                  placeholder="R$ 0,00"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  className={`${darkMode ? 'bg-gray-700 text-white' : ''}`}
                />
                <Button 
                  onClick={() => addExpense('salary')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <PlusCircle className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Lista de gastos */}
          <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
            <CardHeader>
              <CardTitle className={darkMode ? 'text-white' : 'text-gray-900'}>
                Gastos do Mês (R$ {salaryExpenses.toFixed(2)})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {expenses.filter(e => e.paymentMethod === 'salary').map(expense => {
                const Icon = iconMap[expense.iconType];
                return (
                  <div key={expense.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg mb-2">
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-blue-500" />
                      <span>{expense.category}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold">R$ {expense.amount.toFixed(2)}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setExpenses(prev => prev.filter(e => e.id !== expense.id))}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return <div>Carregando...</div>;
}
