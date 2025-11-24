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

const logoDefinitiva = "https://via.placeholder.com/150x150/4F46E5/FFFFFF?text=BP"; // Placeholder pro teu logo

type Screen = 'splash' | 'login' | 'dashboard' | 'investment-details' | 'investment-purchase' | 'investment-result';
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

// Mock investments (exato do PDF)
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
  // Todos os states do PDF
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

  // Auto-navigate splash to login (exato do PDF)
  useEffect(() => {
    if (currentScreen === 'splash') {
      const timer = setTimeout(() => {
        setCurrentScreen('login');
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  // Cálculos financeiros exatos do PDF
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

  // Financial notification effects (exato do PDF)
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

  // Progress ring component mobile-first (exato do PDF)
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

  // Handlers de login/signup (exatos do PDF)
  const handleLogin = () => {
    if (!email || !password) return alert('Preencha todos os campos.');
    // Simulação localStorage
    const users = JSON.parse(localStorage.getItem('budgetProUsers') || '[]');
    const user = users.find((u: any) => u.email === email && u.password === password);
    if (user) {
      setCurrentScreen('dashboard');
    } else {
      alert('Email ou senha incorretos.');
    }
  };

  const handleSignup = () => {
    if (!name || !email || !password || password !== confirmPassword) return alert('Dados inválidos.');
    const users = JSON.parse(localStorage.getItem('budgetProUsers') || '[]');
    if (users.some((u: any) => u.email === email)) return alert('Email já cadastrado.');
    users.push({ id: Date.now(), name, email, password, cpf });
    localStorage.setItem('budgetProUsers', JSON.stringify(users));
    alert('Conta criada! Faça login.');
    setCurrentScreen('login');
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
    
    // Update credit bill amount paid
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

    // Simulate investment result (random gain/loss within expected range)
    const variationFactor = (Math.random() * 2 - 1); // -1 to 1
    const returnPercentage = (selectedInvestment.expectedReturn / 100) * variationFactor * 0.5; // Half the expected range for realism
    const finalValue = amount * (1 + returnPercentage);
    const profitLoss = finalValue - amount;

    // Add investment as expense
    const investmentExpense: Expense = {
      id: Date.now().toString(),
      category: `Investimento: ${selectedInvestment.name}`,
      amount: amount,
      iconType: 'shopping'
    };

    setExpenses(prev => [...prev, investmentExpense]);

    // Update investment status
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
    
    // Show result after brief delay
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

  // TELA SPLASH (exato do PDF)
  if (currentScreen === 'splash') {
    return (
      <motion.div 
        className="min-h-screen flex flex-col items-center justify-center px-4" 
        style={{ backgroundColor: '#046BF4' }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Logo - Mobile First */}
        <div className="mb-8">
          <img 
            src={logoDefinitiva} 
            alt="BudgetPro Logo" 
            className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 object-contain"
          />
        </div>

        {/* Loading animation - Mobile First */}
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center">
          {Array.from({ length: 12 }).map((_, index) => {
            const angle = (index * 360) / 12;
            const radian = (angle * Math.PI) / 180;
            const radius = 28;
            const x = Math.cos(radian) * radius;
            const y = Math.sin(radian) * radius;
            
            return (
              <motion.div
                key={index}
                className="absolute w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-white"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: `translate(${x - 6}px, ${y - 6}px)`,
                }}
                animate={{
                  opacity: [0.3, 1, 0.3]
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: index * 0.1,
                  ease: "easeInOut"
                }}
              />
            );
          })}
        </div>

        {/* Texto de carregamento - Desktop only */}
        <motion.div 
          className="mt-8 text-center hidden md:block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p className="text-white/80 text-lg">Carregando seu app financeiro...</p>
        </motion.div>
      </motion.div>
    );
  }

  // TELA LOGIN (exato do PDF)
  if (currentScreen === 'login') {
    return (
      <motion.div 
        className="min-h-screen"
        style={{ background: 'linear-gradient(to bottom, #046BF4, white)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header - Mobile First */}
        <div className="px-4 py-8 text-center">
          <h1 className="text-white text-3xl md:text-4xl lg:text-5xl mb-2 font-bold">BudgetPro</h1>
          <p className="text-white/80 text-sm md:text-base hidden sm:block">
            Seu assistente financeiro pessoal
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="px-4 py-4"
        >
          {/* Container - Mobile First */}
          <div className="max-w-sm mx-auto md:max-w-md lg:max-w-lg">
            <div className="text-center mb-6">
              <h2 className="text-xl md:text-2xl lg:text-3xl mb-2 text-white font-semibold">
                Bem-vindo de volta!
              </h2>
              <p className="text-gray-200 text-sm md:text-base px-2">
                Entre na sua conta para acessar suas finanças
              </p>
            </div>

            <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm rounded-2xl">
              <CardContent className="p-6 md:p-8 space-y-6">
                <div className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      type="email"
                      placeholder="Digite seu email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-11 h-12 rounded-xl border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all"
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      type="password"
                      placeholder="Digite sua senha"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-11 h-12 rounded-xl border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleLogin}
                  className="w-full h-12 rounded-xl text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 hover:brightness-110"
                  style={{ backgroundColor: '#046BF4' }}
                >
                  Entrar
                </Button>

                <div className="text-center space-y-3 pt-4">
                  <div>
                    <button
                      onClick={() => setCurrentScreen('forgot-password')}
                      className="text-sm transition-colors hover:brightness-110"
                      style={{ color: '#046BF4' }}
                    >
                      <span className="underline">Esqueceu sua senha?</span>
                    </button>
                  </div>
                  <div>
                    <button
                      onClick={() => setCurrentScreen('signup')}
                      className="text-sm transition-colors hover:brightness-110"
                      style={{ color: '#046BF4' }}
                    >
                      Ainda não tem conta? <span className="underline">Criar conta</span>
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  // TELA SIGNUP (exato do PDF)
  if (currentScreen === 'signup') {
    return (
      <motion.div 
        className="min-h-screen"
        style={{ background: 'linear-gradient(135deg, #046BF4 0%, #2A9DF4 50%, white 100%)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="px-4 py-8 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl mb-2 font-bold" style={{ color: '#046BF4' }}>BudgetPro</h1>
          <h2 className="text-lg md:text-2xl lg:text-3xl text-gray-700 md:text-white/90 font-semibold">Criar Nova Conta</h2>
          <p className="text-sm text-gray-600 md:text-white/80 mt-2 hidden sm:block">
            Transforme sua relação com o dinheiro
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="px-4 py-4"
        >
          <div className="max-w-sm mx-auto md:max-w-md lg:max-w-lg">
            <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm rounded-2xl">
              <CardContent className="p-6 md:p-8 space-y-4">
                <div className="space-y-4">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Nome completo *"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-11 h-12 rounded-xl"
                    />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      type="email"
                      placeholder="Email *"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-11 h-12 rounded-xl"
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      type="password"
                      placeholder="Senha *"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-11 h-12 rounded-xl"
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      type="password"
                      placeholder="Confirme senha *"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-11 h-12 rounded-xl"
                    />
                  </div>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="CPF (opcional)"
                      value={cpf}
                      onChange={(e) => setCpf(e.target.value)}
                      className="pl-11 h-12 rounded-xl"
                    />
                  </div>
                </div>

                <div className="text-xs text-gray-500 text-center bg-gray-50 p-3 rounded-xl">
                  * Campos obrigatórios
                </div>

                <Button
                  onClick={handleSignup}
                  className="w-full h-12 rounded-xl text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 hover:brightness-110"
                  style={{ backgroundColor: '#046BF4' }}
                >
                  Criar Minha Conta
                </Button>

                <div className="text-center pt-4">
                  <button
                    onClick={() => setCurrentScreen('login')}
                    className="text-sm transition-colors hover:brightness-110"
                    style={{ color: '#046BF4' }}
                  >
                    Já tem conta? <span className="underline">Voltar ao login</span>
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  // TELA FORGOT PASSWORD
  if (currentScreen === 'forgot-password') {
    return (
      <motion.div 
        className="min-h-screen bg-gray-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="px-4 py-8 text-center">
          <img src={logoDefinitiva} alt="BudgetPro" className="w-20 h-20 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-blue-600 mb-2">Esqueceu a senha?</h1>
          <p className="text-gray-600">Digite seu email para recuperação</p>
        </div>

        <Card className="w-full max-w-sm shadow-xl rounded-2xl">
          <CardContent className="p-8 space-y-6">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="email"
                placeholder="Seu email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="pl-11 h-12 rounded-xl"
              />
            </div>

            <Button
              onClick={() => {
                alert('Link enviado! (simulação)');
                setCurrentScreen('reset-password');
              }}
              className="w-full h-12 rounded-xl text-white"
              style={{ backgroundColor: '#046BF4' }}
            >
              Enviar Link
            </Button>

            <button
              onClick={() => setCurrentScreen('login')}
              className="text-sm text-blue-600 hover:underline text-center w-full"
            >
              Voltar ao login
            </button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // TELA RESET PASSWORD
  if (currentScreen === 'reset-password') {
    return (
      <motion.div 
        className="min-h-screen bg-gray-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="px-4 py-8 text-center">
          <img src={logoDefinitiva} alt="BudgetPro" className="w-20 h-20 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-blue-600 mb-2">Nova Senha</h1>
          <p className="text-gray-600">Crie uma senha segura</p>
        </div>

        <Card className="w-full max-w-sm shadow-xl rounded-2xl">
          <CardContent className="p-8 space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="password"
                  placeholder="Nova senha"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pl-11 h-12 rounded-xl"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="password"
                  placeholder="Confirme nova senha"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="pl-11 h-12 rounded-xl"
                />
              </div>
            </div>

            <Button
              onClick={handleResetPassword}
              className="w-full h-12 rounded-xl text-white"
              style={{ backgroundColor: '#046BF4' }}
            >
              Salvar Nova Senha
            </Button>

            <button
              onClick={() => setCurrentScreen('login')}
              className="text-sm text-blue-600 hover:underline text-center w-full"
            >
              Voltar ao login
            </button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // DASHBOARD (exato do PDF, com 4 abas)
  if (currentScreen === 'dashboard') {
    return (
      <div className={`min-h-screen ${themes[theme].background}`}>
        {/* Header */}
        <div className="px-4 py-4 shadow-sm" style={{ backgroundColor: '#046BF4' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img src={logoDefinitiva} alt="BudgetPro" className="w-12 h-12 object-contain" />
              <h1 className="text-white text-lg font-semibold ml-3">BudgetPro</h1>
            </div>
            <button onClick={() => setTheme(theme === "light" ? "dark" : "light")} className="text-white text-2xl">
              {theme === "light" ? "🌙" : "☀️"}
            </button>
          </div>
        </div>

        <div className="px-4 py-4">
          {/* Alerta baixo dinheiro (exato do PDF) */}
          {isLowMoney && (
            <Alert className="border-red-200 bg-red-50 rounded-xl mb-4">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                Saldo baixo! R$ {remainingSalary.toFixed(2)} restante no salário.
              </AlertDescription>
            </Alert>
          )}

          {/* Tabs (exato do PDF, 4 abas) */}
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 rounded-xl p-1" style={{ backgroundColor: '#f8fafc' }}>
              <TabsTrigger value="overview" className="data-[state=active]:bg-[#046BF4] data-[state=active]:text-white rounded-lg py-2">
                📊 Visão Geral
              </TabsTrigger>
              <TabsTrigger value="boards" className="data-[state=active]:bg-[#046BF4] data-[state=active]:text-white rounded-lg py-2">
                📋 Pranchetas
              </TabsTrigger>
              <TabsTrigger value="payment" className="data-[state=active]:bg-[#046BF4] data-[state=active]:text-white rounded-lg py-2">
                🧾 Fatura
              </TabsTrigger>
              <TabsTrigger value="ai" className="data-[state=active]:bg-[#046BF4] data-[state=active]:text-white rounded-lg py-2">
                🤖 IA
              </TabsTrigger>
            </TabsList>

            {/* ABA VISÃO GERAL */}
            <TabsContent value="overview" className="space-y-4">
              {/* Cards resumo */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="shadow-md rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-lg bg-green-100">
                      <ArrowUpRight className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-xs text-gray-500">Receitas</span>
                  </div>
                  <p className="text-xl font-semibold text-green-600">R$ {salary.toFixed(2)}</p>
                </Card>
                <Card className="shadow-md rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-lg bg-red-100">
                      <ArrowDownRight className="w-4 h-4 text-red-600" />
                    </div>
                    <span className="text-xs text-gray-500">Gastos Salário</span>
                  </div>
                  <p className="text-xl font-semibold text-red-600">R$ {salaryExpenses.toFixed(2)}</p>
                </Card>
                <Card className="shadow-md rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-lg bg-blue-100">
                      <DollarSign className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-xs text-gray-500">Disponível</span>
                  </div>
                  <p className="text-xl font-semibold text-blue-600">R$ {remainingSalary.toFixed(2)}</p>
                </Card>
                <Card className="shadow-md rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-lg bg-purple-100">
                      <CreditCard className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="text-xs text-gray-500">Limite Cartão</span>
                  </div>
                  <p className="text-xl font-semibold text-purple-600">R$ {availableCredit.toFixed(2)}</p>
                </Card>
              </div>

              {/* Progress Ring (exato do PDF) */}
              <Card className="shadow-md rounded-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: '#046BF4' }}>
                      <BarChart3 className="w-4 h-4 text-white" />
                    </div>
                    Resumo do Mês
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <ProgressRing percentage={expensePercentage} color={expensePercentage > 80 ? '#EF4444' : '#046BF4'} />
                </CardContent>
              </Card>

              {/* Gráfico linha (exato do PDF) */}
              <Card className="shadow-md rounded-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: '#046BF4' }}>
                      <TrendingUp className="w-4 h-4 text-white" />
                    </div>
                    Evolução Mensal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={MOCK_INVESTMENTS[0].historicalData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="value" stroke="#046BF4" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ABA PRANCHETAS (lado a lado, exato do PDF) */}
            <TabsContent value="boards" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Prancheta Salário */}
                <Card className="shadow-md rounded-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <div className="p-2 rounded-lg bg-green-500">
                        <DollarSign className="w-4 h-4 text-white" />
                      </div>
                      Prancheta Salário
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <p>Total Salário: R$ {salary.toFixed(2)}</p>
                      <p>Gastos: R$ {salaryExpenses.toFixed(2)}</p>
                      <p>Restante: R$ {remainingSalary.toFixed(2)}</p>
                    </div>
                    <div className="space-y-2">
                      <Input placeholder="Nova categoria" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
                      <Input type="number" placeholder="Valor" value={newAmount} onChange={(e) => setNewAmount(e.target.value)} />
                      <Button onClick={() => addExpense('salary')} className="w-full bg-green-500">
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Adicionar Gasto Salário
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {expenses.filter(e => e.paymentMethod === 'salary').map(exp => (
                        <div key={exp.id} className="flex justify-between items-center p-2 bg-gray-100 rounded">
                          <span>{exp.category}</span>
                          <span>R$ {exp.amount.toFixed(2)}</span>
                          <Button variant="destructive" size="sm" onClick={() => removeExpense(exp.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Prancheta Cartão */}
                <Card className="shadow-md rounded-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <div className="p-2 rounded-lg bg-purple-500">
                        <CreditCard className="w-4 h-4 text-white" />
                      </div>
                      Prancheta Cartão
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <p>Limite Total: R$ {creditLimit.toFixed(2)}</p>
                      <p>Gastos: R$ {creditExpenses.toFixed(2)}</p>
                      <p>Livre: R$ {availableCredit.toFixed(2)}</p>
                    </div>
                    <div className="space-y-2">
                      <Input placeholder="Nova categoria" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
                      <Input type="number" placeholder="Valor" value={newAmount} onChange={(e) => setNewAmount(e.target.value)} />
                      <Button onClick={() => addExpense('credit')} className="w-full bg-purple-500">
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Adicionar Gasto Cartão
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {expenses.filter(e => e.paymentMethod === 'credit').map(exp => (
                        <div key={exp.id} className="flex justify-between items-center p-2 bg-gray-100 rounded">
                          <span>{exp.category}</span>
                          <span>R$ {exp.amount.toFixed(2)}</span>
                          <Button variant="destructive" size="sm" onClick={() => removeExpense(exp.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* ABA PAGAR FATURA (exato do PDF) */}
            <TabsContent value="payment" className="space-y-4">
              <Card className="shadow-md rounded-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Fatura do Cartão
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-sm text-gray-600">Fatura Atual</p>
                      <p className="text-2xl font-bold text-red-600">R$ {creditBill.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Já Pago</p>
                      <p className="text-2xl font-bold text-green-600">R$ {creditBillAmount.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Valor a Pagar</Label>
                    <Input
                      type="number"
                      value={billPaymentAmount}
                      onChange={(e) => setBillPaymentAmount(e.target.value)}
                      placeholder="Digite o valor"
                    />
                  </div>
                  <Button onClick={payCreditBill} className="w-full bg-blue-500">
                    Confirmar Pagamento
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ABA IA (exato do PDF) */}
            <TabsContent value="ai" className="space-y-4">
              <Card className="shadow-md rounded-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    Assistente IA
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Sugestão: Com R$ {remainingSalary.toFixed(2)} disponível, invista 30% em renda fixa.</p>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={salaryPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                        {salaryPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={['#10B981', '#F59E0B'][index % 2]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }

  // TELA INVESTIMENTOS (exato do PDF)
  if (currentScreen === 'investment-details') {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <Button onClick={() => setCurrentScreen('dashboard')} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        {selectedInvestment && (
          <Card className="shadow-lg rounded-2xl">
            <CardHeader>
              <CardTitle className="text-2xl">{selectedInvestment.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>{selectedInvestment.description}</p>
              <p>Retorno Esperado: {selectedInvestment.expectedReturn}%</p>
              <p>Risco: {getRiskLabel(selectedInvestment.riskLevel)}</p>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={selectedInvestment.historicalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke={selectedInvestment.color} />
                </LineChart>
              </ResponsiveContainer>
              <Button onClick={() => setCurrentScreen('investment-purchase')} className="w-full bg-blue-500">
                Investir
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // TELA COMPRA INVESTIMENTO
  if (currentScreen === 'investment-purchase') {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <Button onClick={() => setCurrentScreen('investment-details')} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Detalhes
        </Button>
        {selectedInvestment && (
          <Card className="shadow-lg rounded-2xl">
            <CardHeader>
              <CardTitle className="text-2xl">Investir em {selectedInvestment.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="number"
                placeholder="Valor do investimento"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(e.target.value)}
              />
              <Button onClick={confirmInvestmentPurchase} className="w-full bg-blue-500">
                Confirmar
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return null;
}
