import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  PlusCircle, Trash2, DollarSign, ShoppingCart, Car, Coffee, Home, Smartphone,
  Mail, Lock, User, Calendar, FileText, CreditCard, TrendingUp, TrendingDown,
  Brain, AlertTriangle, ArrowUpRight, ArrowDownRight, BarChart3, 
  ArrowLeft, CheckCircle, Building, Zap, Coins, Rocket
} from 'lucide-react';
import { 
  PieChart as RechartsPieChart, Cell, ResponsiveContainer, 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip 
} from 'recharts';

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

// Icon mapping
const iconMap = {
  coffee: Coffee,
  car: Car,
  home: Home,
  shopping: ShoppingCart,
  smartphone: Smartphone,
};

// Mock investments (100% do PDF)
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
  // Todos os states do PDF (exatos)
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

  // Auto-navigate splash (exato do PDF)
  useEffect(() => {
    if (currentScreen === 'splash') {
      const timer = setTimeout(() => setCurrentScreen('login'), 10000);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  // Cálculos exatos do PDF
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
    if (!email || !password) return alert('Preencha todos os campos.');
    // Simulação localStorage (exato do PDF)
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
    if (!name || !email || !password) return alert('Preencha todos os campos obrigatórios.');
    if (password !== confirmPassword) return alert('As senhas não coincidem.');
    if (password.length < 6) return alert('A senha deve ter pelo menos 6 caracteres.');
    const users = JSON.parse(localStorage.getItem('budgetProUsers') || '[]');
    if (users.some((u: any) => u.email === email)) return alert('Este email já está cadastrado. Tente fazer login.');
    const newUser = { id: Date.now(), name, email, password, cpf };
    users.push(newUser);
    localStorage.setItem('budgetProUsers', JSON.stringify(users));
    setName(''); setEmail(''); setPassword(''); setConfirmPassword(''); setCpf('');
    alert('Conta criada com sucesso! Faça login para continuar.');
    setCurrentScreen('login');
  };

  const handleForgotPassword = () => {
    if (!resetEmail) return alert('Por favor, digite seu email.');
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
    if (!newPassword || !confirmNewPassword) return alert('Preencha todos os campos.');
    if (newPassword !== confirmNewPassword) return alert('As senhas não coincidem.');
    if (newPassword.length < 6) return alert('A senha deve ter pelo menos 6 caracteres.');
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
      setNewPassword(''); setConfirmNewPassword(''); setResetEmail('');
      alert('Senha alterada com sucesso! Faça login com sua nova senha.');
      setCurrentScreen('login');
    } else {
      alert('Erro: usuário não encontrado.');
      setCurrentScreen('login');
    }
  };

  const addExpense = (paymentMethod: PaymentMethod) => {
    if (newCategory && newAmount) {
      const iconTypes: IconType[] = ['shopping', 'smartphone', 'coffee'];
      const randomIconType = iconTypes[Math.floor(Math.random() * iconTypes.length)];
      
      setExpenses(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          category: newCategory,
          amount: parseFloat(newAmount),
          iconType: randomIconType,
          paymentMethod: paymentMethod
        }
      ]);
      setNewCategory('');
      setNewAmount('');
    }
  };

  const payCreditBill = () => {
    const paymentAmount = parseFloat(billPaymentAmount);
    
    if (!billPaymentAmount || paymentAmount <= 0) {
      alert('Digite um valor válido para o pagamento.');
      return;
    }
    
    if (paymentAmount > creditBill) {
      alert(`O valor do pagamento não pode ser maior que a fatura (R$ ${creditBill.toFixed(2)}).`);
      return;
    }
    
    if (paymentAmount > remainingSalary) {
      alert(`Você não tem saldo suficiente no salário (R$ ${remainingSalary.toFixed(2)}).`);
      return;
    }
    
    setCreditBillAmount(prev => prev + paymentAmount);
    setBillPaymentAmount('');
    
    alert(`✅ Pagamento de R$ ${paymentAmount.toFixed(2)} realizado com sucesso!`);
  };

  const removeExpense = (id: string) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
  };

  const updateSalary = () => {
    setSalary(parseFloat(tempSalary) || 0);
    setEditingSalary(false);
  };

  const updateCredit = () => {
    setCreditLimit(parseFloat(tempCredit) || 0);
    setEditingCredit(false);
  };

  const selectInvestment = (investment: Investment) => {
    setSelectedInvestment(investment);
    setCurrentScreen('investment-details');
  };

  const confirmInvestmentPurchase = () => {
    if (!selectedInvestment || !investmentAmount) {
      alert('Dados incompletos para o investimento.');
      return;
    }

    const amount = parseFloat(investmentAmount);
    if (amount < selectedInvestment.minInvestment || amount > selectedInvestment.maxInvestment) {
      alert(`Valor deve estar entre R$ ${selectedInvestment.minInvestment} e R$ ${selectedInvestment.maxInvestment}.`);
      return;
    }

    if (amount > remainingSalary + availableCredit) {
      alert('Saldo insuficiente para este investimento.');
      return;
    }

    const variationFactor = (Math.random() * 2 - 1);
    const returnPercentage = (selectedInvestment.expectedReturn / 100) * variationFactor * 0.5;
    const finalValue = amount * (1 + returnPercentage);
    const profitLoss = finalValue - amount;

    const investmentExpense: Expense = {
      id: Date.now().toString(),
      category: `Investimento: ${selectedInvestment.name}`,
      amount: amount,
      iconType: 'shopping'
    };

    setExpenses(prev => [...prev, investmentExpense]);

    setInvestments(prev => prev.map(inv => 
      inv.id === selectedInvestment.id 
        ? {
            ...inv,
            status: 'purchased' as InvestmentStatus,
            purchaseAmount: amount,
            purchaseDate: new Date(),
            currentValue: finalValue,
            profitLoss: profitLoss
          }
        : inv
    ));

    setInvestmentAmount('');
    setPurchaseConfirmed(true);
    setCurrentScreen('investment-result');
    setTimeout(() => setShowInvestmentResult(true), 1000);
  };

  const getRiskColor = (risk: RiskLevel) => {
    switch (risk) {
      case 'low': return '#10B981';
      case 'medium': return '#F59E0B';
      case 'high': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getRiskLabel = (risk: RiskLevel) => {
    switch (risk) {
      case 'low': return 'Baixo';
      case 'medium': return 'Médio';
      case 'high': return 'Alto';
      default: return 'Indefinido';
    }
  };

  // TELA FORGOT PASSWORD
  if (currentScreen === 'forgot-password') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 to-purple-600 flex items-center justify-center p-6">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full">
          <h2 className="text-4xl font-bold text-white text-center mb-8">Esqueceu a senha?</h2>
          <input
            type="email"
            placeholder="Seu email"
            value={resetEmail}
            onChange={e => setResetEmail(e.target.value)}
            className="w-full px-6 py-4 bg-white/20 rounded-2xl text-white mb-6"
          />
          <button onClick={handleForgotPassword} className="w-full py-5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl font-bold text-lg">
            Enviar Link
          </button>
          <button onClick={() => setCurrentScreen('login')} className="w-full mt-4 text-white underline">
            Voltar ao login
          </button>
        </div>
      </div>
    );
  }

  // TELA RESET PASSWORD
  if (currentScreen === 'reset-password') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 to-purple-600 flex items-center justify-center p-6">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full">
          <h2 className="text-4xl font-bold text-white text-center mb-8">Nova Senha</h2>
          <input
            type="password"
            placeholder="Nova senha"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            className="w-full px-6 py-4 bg-white/20 rounded-2xl text-white mb-6"
          />
          <input
            type="password"
            placeholder="Confirme senha"
            value={confirmNewPassword}
            onChange={e => setConfirmNewPassword(e.target.value)}
            className="w-full px-6 py-4 bg-white/20 rounded-2xl text-white mb-6"
          />
          <button onClick={handleResetPassword} className="w-full py-5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl font-bold text-lg">
            Alterar Senha
          </button>
          <button onClick={() => setCurrentScreen('login')} className="w-full mt-4 text-white underline">
            Voltar ao login
          </button>
        </div>
      </div>
    );
  }

  // FECHAMENTO DO COMPONENTE (return fallback)
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-pink-600 flex items-center justify-center">
      <div className="text-center text-white">
        <h1 className="text-6xl font-bold mb-4">BudgetPro</h1>
        <p className="text-2xl">Carregando... (ou tela inválida)</p>
      </div>
    </div>
  );
}
