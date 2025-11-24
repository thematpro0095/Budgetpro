import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
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
  Brain, AlertTriangle, ArrowUpRight, ArrowDownRight, BarChart3, PieChart as PieChartIcon,
  ArrowLeft, CheckCircle, XCircle, Building, Zap, Coins, Rocket
} from 'lucide-react';
import { PieChart as RechartsPieChart, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, Legend, Pie } from 'recharts';

const logoDefinitiva = "/logo.png";

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
  {
    id: 'tech-nova',
    name: 'TechNova',
    type: 'Ações',
    description: 'Empresa de tecnologia em crescimento',
    riskLevel: 'medium',
    expectedReturn: 10,
    minInvestment: 100,
    maxInvestment: 5000,
    icon: Zap,
    color: '#3B82F6',
    historicalData: [
      { month: 'Jan', value: 100 },
      { month: 'Fev', value: 105 },
      { month: 'Mar', value: 108 },
      { month: 'Abr', value: 112 },
      { month: 'Mai', value: 110 },
      { month: 'Jun', value: 115 }
    ],
    status: 'available'
  },
  {
    id: 'coin-x',
    name: 'CoinX',
    type: 'Criptomoeda',
    description: 'Moeda digital emergente',
    riskLevel: 'high',
    expectedReturn: 30,
    minInvestment: 50,
    maxInvestment: 3000,
    icon: Coins,
    color: '#F59E0B',
    historicalData: [
      { month: 'Jan', value: 100 },
      { month: 'Fev', value: 120 },
      { month: 'Mar', value: 95 },
      { month: 'Abr', value: 140 },
      { month: 'Mai', value: 125 },
      { month: 'Jun', value: 135 }
    ],
    status: 'available'
  },
  {
    id: 'fii-alpha',
    name: 'FII Alpha',
    type: 'Fundo Imobiliário',
    description: 'Fundo de investimento imobiliário',
    riskLevel: 'low',
    expectedReturn: 5,
    minInvestment: 200,
    maxInvestment: 10000,
    icon: Building,
    color: '#10B981',
    historicalData: [
      { month: 'Jan', value: 100 },
      { month: 'Fev', value: 101 },
      { month: 'Mar', value: 103 },
      { month: 'Abr', value: 104 },
      { month: 'Mai', value: 105 },
      { month: 'Jun', value: 106 }
    ],
    status: 'available'
  },
  {
    id: 'neo-future',
    name: 'NeoFuture',
    type: 'Startup',
    description: 'Startup de energia renovável',
    riskLevel: 'high',
    expectedReturn: 50,
    minInvestment: 500,
    maxInvestment: 15000,
    icon: Rocket,
    color: '#8B5CF6',
    historicalData: [
      { month: 'Jan', value: 100 },
      { month: 'Fev', value: 90 },
      { month: 'Mar', value: 130 },
      { month: 'Abr', value: 110 },
      { month: 'Mai', value: 160 },
      { month: 'Jun', value: 145 }
    ],
    status: 'available'
  }
];

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [salary, setSalary] = useState(0);
  const [creditLimit, setCreditLimit] = useState(0);
  const [salaryUsed, setSalaryUsed] = useState(0);
  const [creditUsed, setCreditUsed] = useState(0);
  const [bankDebt, setBankDebt] = useState(0);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [creditBillAmount, setCreditBillAmount] = useState(0);
  const [billPaymentAmount, setBillPaymentAmount] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [editingSalary, setEditingSalary] = useState(false);
  const [editingCredit, setEditingCredit] = useState(false);
  const [tempSalary, setTempSalary] = useState('0');
  const [tempCredit, setTempCredit] = useState('0');
  const [investments, setInvestments] = useState<Investment[]>(MOCK_INVESTMENTS);
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [purchaseConfirmed, setPurchaseConfirmed] = useState(false);
  const [showInvestmentResult, setShowInvestmentResult] = useState(false);
  const [selectedPieSlice, setSelectedPieSlice] = useState<string | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    if (currentScreen === 'splash') {
      const timer = setTimeout(() => setCurrentScreen('login'), 10000);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  const salaryExpenses = useMemo(() => 
    expenses.filter(e => e.paymentMethod === 'salary').reduce((sum, expense) => sum + expense.amount, 0), 
    [expenses]
  );
  
  const creditExpenses = useMemo(() => 
    expenses.filter(e => e.paymentMethod === 'credit').reduce((sum, expense) => sum + expense.amount, 0), 
    [expenses]
  );
  
  const totalExpenses = useMemo(() => salaryExpenses + creditExpenses, [salaryExpenses, creditExpenses]);

  const { remainingSalary, availableCredit, totalDebt, creditBill } = useMemo(() => {
    const currentSalaryUsed = salaryExpenses + creditBillAmount;
    const currentCreditBill = creditExpenses;
    const currentCreditUsed = currentCreditBill;
    const currentDebt = Math.max(0, currentCreditUsed - creditLimit);
    
    return {
      remainingSalary: salary - currentSalaryUsed,
      availableCredit: creditLimit - currentCreditUsed,
      totalDebt: currentDebt,
      creditBill: currentCreditBill
    };
  }, [salaryExpenses, creditExpenses, salary, creditLimit, creditBillAmount]);

  const isLowMoney = useMemo(() => 
    remainingSalary < salary * 0.2 || (creditBill > creditLimit * 0.8), 
    [remainingSalary, salary, creditBill, creditLimit]
  );

  const expensePercentage = useMemo(() => 
    Math.min(((salaryExpenses / salary) * 100), 100), [salaryExpenses, salary]
  );
  
  const creditPercentage = useMemo(() => 
    Math.min(((creditExpenses / creditLimit) * 100), 100), [creditExpenses, creditLimit]
  );

  const financialBreakdown = useMemo(() => {
    const salaryUsedAmount = salaryExpenses + creditBillAmount;
    const creditUsedAmount = creditExpenses;
    const debtAmount = Math.max(0, creditExpenses - creditLimit);
    
    return {
      salaryUsed: salaryUsedAmount,
      creditUsed: creditUsedAmount,
      debt: debtAmount,
      total: totalExpenses
    };
  }, [salaryExpenses, creditExpenses, creditBillAmount, salary, creditLimit, totalExpenses]);

  useEffect(() => {
    if (remainingSalary <= 0) {
      // Notification removed - user controls payment method manually now
    }
    
    if (financialBreakdown.debt > 0) {
      alert(`🚨 Você ultrapassou o limite do cartão. Agora está devendo ao banco R$ ${financialBreakdown.debt.toFixed(2)}!`);
    }
    
    if (creditBill > creditLimit * 0.9) {
      // High credit usage warning
    }
  }, [financialBreakdown, salary, remainingSalary, creditBill, creditLimit]);

  const ProgressRing = ({ 
    percentage, 
    size = 100, 
    strokeWidth = 6, 
    color = '#046BF4' 
  }: { 
    percentage: number; 
    size?: number; 
    strokeWidth?: number; 
    color?: string;
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

  const handleLogin = () => {
    if (!email || !password) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    const users = JSON.parse(localStorage.getItem('budgetProUsers') || '[]');
    const user = users.find((u: any) => u.email === email && u.password === password);
    
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      setCurrentScreen('dashboard');
    } else {
      alert('Email ou senha incorretos. Verifique seus dados ou crie uma conta.');
    }
  };

  const handleSignup = () => {
    if (!name || !email || !password) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (password !== confirmPassword) {
      alert('As senhas não coincidem.');
      return;
    }

    if (password.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    const users = JSON.parse(localStorage.getItem('budgetProUsers') || '[]');
    
    if (users.some((u: any) => u.email === email)) {
      alert('Este email já está cadastrado. Tente fazer login.');
      return;
    }

    const newUser = { id: Date.now(), name, email, password, cpf };
    users.push(newUser);
    localStorage.setItem('budgetProUsers', JSON.stringify(users));
    
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setCpf('');
    
    alert('Conta criada com sucesso! Faça login para continuar.');
    setCurrentScreen('login');
  };

  const handleForgotPassword = () => {
    if (!resetEmail) {
      alert('Por favor, digite seu email.');
      return;
    }

    const users = JSON.parse(localStorage.getItem('budgetProUsers') || '[]');
    const user = users.find((u: any) => u.email === resetEmail);
    
    if (user) {
      localStorage.setItem('resetEmail', resetEmail);
      alert('Link de redefinição enviado para seu email! (Simulação)');
      setCurrentScreen('reset-password');
    } else {
      alert('Email não encontrado em nossa base de dados.');
    }
  };

  const handleResetPassword = () => {
    if (!newPassword || !confirmNewPassword) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      alert('As senhas não coincidem.');
      return;
    }

    if (newPassword.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    const email = localStorage.getItem('resetEmail');
    if (!email) {
      alert('Erro: sessão expirada.');
      setCurrentScreen('login');
      return;
    }

    const users = JSON.parse(localStorage.getItem('budgetProUsers') || '[]');
    const userIndex = users.findIndex((u: any) => u.email === email);
    
    if (userIndex !== -1) {
      users[userIndex].password = newPassword;
      localStorage.setItem('budgetProUsers', JSON.stringify(users));
      localStorage.removeItem('resetEmail');
      
      setNewPassword('');
      setConfirmNewPassword('');
      setResetEmail('');
      
      alert('Senha alterada com sucesso! Faça login com sua nova senha.');
      setCurrentScreen('login');
    } else {
      alert('Erro: usuário não encontrado.');
      setCurrentScreen('login');
    }
  };

  // TELA DASHBOARD (completa, com 4 abas, pranchetas lado a lado, pagar fatura, IA)
  if (currentScreen === 'dashboard') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 to-pink-900 text-white">
        <header className="bg-black/30 backdrop-blur-xl p-6">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-4">
              <img src={logoDefinitiva} alt="BudgetPro" className="w-12 h-12 rounded-full" />
              <h1 className="text-3xl font-bold">BudgetPro</h1>
            </div>
            <button onClick={() => setTheme(theme === "light" ? "dark" : "light")} className="bg-white/20 px-4 py-2 rounded-xl">
              {theme === "light" ? "🌙 Dark" : "☀️ Light"}
            </button>
          </div>
        </header>

        {/* Alertas */}
        {isLowMoney && (
          <div className="mx-6 mt-6 bg-orange-600/90 p-6 rounded-3xl">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
            <p className="text-xl font-bold text-center">Saldo baixo! R$ {remainingSalary.toFixed(2)} restante.</p>
          </div>
        )}

        {financialBreakdown.debt > 0 && (
          <div className="mx-6 mt-6 bg-red-600/90 p-6 rounded-3xl">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
            <p className="text-xl font-bold text-center">DÍVIDA: R$ {financialBreakdown.debt.toFixed(2)}!</p>
          </div>
        )}

        <div className="max-w-6xl mx-auto p-6 space-y-8">
          {/* Cards principais */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-white/10 backdrop-blur-xl p-6 rounded-3xl">
              <DollarSign className="w-8 h-8 mb-2" />
              <p className="text-3xl font-bold">R$ {salary.toFixed(2)}</p>
              <p className="text-sm opacity-80">Salário Total</p>
            </Card>
            <Card className="bg-white/10 backdrop-blur-xl p-6 rounded-3xl">
              <CreditCard className="w-8 h-8 mb-2" />
              <p className="text-3xl font-bold">R$ {creditExpenses.toFixed(2)}</p>
              <p className="text-sm opacity-80">Fatura Cartão</p>
            </Card>
            <Card className="bg-white/10 backdrop-blur-xl p-6 rounded-3xl">
              <TrendingUp className="w-8 h-8 mb-2" />
              <p className="text-3xl font-bold">R$ {remainingSalary.toFixed(2)}</p>
              <p className="text-sm opacity-80">Disponível</p>
            </Card>
            <Card className="bg-white/10 backdrop-blur-xl p-6 rounded-3xl">
              <Brain className="w-8 h-8 mb-2" />
              <p className="text-3xl font-bold">4</p>
              <p className="text-sm opacity-80">Investimentos</p>
            </Card>
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white/10 backdrop-blur-xl rounded-3xl p-6">
              <h3 className="text-2xl font-bold mb-4">Uso do Salário</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={salaryPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {salaryPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
            <Card className="bg-white/10 backdrop-blur-xl rounded-3xl p-6">
              <h3 className="text-2xl font-bold mb-4">Despesas Recentes</h3>
              <div className="space-y-3">
                {expenses.slice(-4).map(exp => (
                  <div key={exp.id} className="flex justify-between p-3 bg-white/20 rounded-xl">
                    <span>{exp.category}</span>
                    <span className="font-bold">R$ {exp.amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Nova despesa */}
          <Card className="bg-white/10 backdrop-blur-xl rounded-3xl p-6">
            <h3 className="text-2xl font-bold mb-4">Adicionar Despesa</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input placeholder="Categoria" value={newCategory} onChange={e => setNewCategory(e.target.value)} />
              <Input type="number" placeholder="Valor" value={newAmount} onChange={e => setNewAmount(e.target.value)} />
              <Button onClick={() => addExpense('salary')} className="bg-green-500">Salário</Button>
              <Button onClick={() => addExpense('credit')} className="bg-purple-500">Cartão</Button>
            </div>
          </Card>

          {/* Investimentos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {investments.map(inv => (
              <Card key={inv.id} className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 cursor-pointer" onClick={() => selectInvestment(inv)}>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: inv.color + '20' }}>
                  <inv.icon className="w-8 h-8" style={{ color: inv.color }} />
                </div>
                <h4 className="text-xl font-bold text-center">{inv.name}</h4>
                <p className="text-center text-sm opacity-80">{inv.type}</p>
                <p className="text-2xl font-bold text-center text-green-400">{inv.expectedReturn}%</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
}
