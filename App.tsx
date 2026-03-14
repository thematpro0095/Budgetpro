import React, { useState, useEffect, useMemo, useCallback, Component, ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { toast, Toaster } from 'sonner@2.0.3';

// Auth screens
import { SplashScreen } from './components/auth/SplashScreen';
import { LoginScreen } from './components/auth/LoginScreen';
import { SignupScreen } from './components/auth/SignupScreen';

// Dashboard components
import { FinancialCard } from './components/dashboard/FinancialCard';
import { ExpenseBoard } from './components/dashboard/ExpenseBoard';
import { BillPayment } from './components/dashboard/BillPayment';
import { EvolutionChart } from './components/dashboard/EvolutionChart';
import { MonthlySummaryCard } from './components/dashboard/MonthlySummaryCard';
import { FinancialAssistant } from './components/dashboard/FinancialAssistant';
import { FinancialHealthIndex } from './components/dashboard/FinancialHealthIndex';
import { BehavioralProfile } from './components/dashboard/BehavioralProfile';

// Common
import { DarkModeToggle } from './components/common/DarkModeToggle';

// Download page
import { DownloadPage } from './components/DownloadPage';

// Types & utils
import { Screen, Expense, User, UserInvestment, MonthlyRecord, IconType } from './types';
import { MOCK_INVESTMENTS } from './constants';
import {
  calculateSalaryExpenses,
  calculateCreditExpenses,
  calculateTotalInvestments,
  calculateRemainingSalary,
  calculateAvailableCredit,
  calculateCurrentCreditBill,
  calculateExpensePercentage,
  calculateCreditPercentage,
  getChartData,
} from './utils/financial';
import {
  generateToken,
  getCurrentMonthName,
  hashPassword,
  verifyPassword,
} from './utils/helpers';

// Icons
import {
  LayoutDashboard,
  Receipt,
  CreditCard,
  TrendingUp,
  LogOut,
  ChevronRight,
  Download,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────
// localStorage helpers
// ─────────────────────────────────────────────────────────
const LS = {
  get: <T>(key: string, fallback: T): T => {
    try {
      const v = localStorage.getItem(key);
      return v ? (JSON.parse(v) as T) : fallback;
    } catch {
      return fallback;
    }
  },
  set: (key: string, value: unknown) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  },
};

// ─────────────────────────────────────────────────────────
// Error Boundary – catches render errors so the preview
// iframe is not destroyed by an unhandled exception.
// ─────────────────────────────────────────────────────────
class ErrorBoundary extends Component<
  { children: ReactNode },
  { error: string | null }
> {
  state = { error: null };
  static getDerivedStateFromError(e: Error) {
    return { error: e.message };
  }
  componentDidCatch(e: Error) {
    console.error('[BudgetPro ErrorBoundary]', e);
  }
  render() {
    if (this.state.error) {
      return (
        <div
          className="min-h-screen flex items-center justify-center p-8 text-center"
          style={{ background: 'linear-gradient(to bottom, #0f172a, #1e3a8a, #000000)' }}
        >
          <div className="space-y-4">
            <p className="text-2xl">⚠️</p>
            <p className="text-white" style={{ fontWeight: 600 }}>Algo correu mal</p>
            <p className="text-sm" style={{ color: '#94a3b8' }}>{this.state.error}</p>
            <button
              className="px-4 py-2 rounded-xl text-white text-sm"
              style={{ backgroundColor: '#046BF4' }}
              onClick={() => this.setState({ error: null })}
            >
              Tentar novamente
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

type DashTab = 'overview' | 'expenses' | 'payment' | 'investments';

const ICON_TYPES: IconType[] = ['coffee', 'car', 'home', 'shopping', 'smartphone'];

function BudgetProApp() {
  // ── Screen & auth ────────────────────────────────────
  const [screen, setScreen] = useState<Screen>('splash');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);

  // Auth form fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirm, setSignupConfirm] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');

  // ── Dark mode ─────────────────────────────────────────
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() =>
    LS.get('budgetpro_darkmode', false)
  );

  // ── Dashboard tab ─────────────────────────────────────
  const [activeTab, setActiveTab] = useState<DashTab>('overview');
  const [showDownload, setShowDownload] = useState(false);

  // ── Financial state ───────────────────────────────────
  const [salary, setSalary] = useState<number>(() => LS.get('budgetpro_salary', 5000));
  const [creditLimit, setCreditLimit] = useState<number>(() => LS.get('budgetpro_credit_limit', 3000));
  const [expenses, setExpenses] = useState<Expense[]>(() => LS.get('budgetpro_expenses', []));
  const [creditBillAmount, setCreditBillAmount] = useState<number>(() => LS.get('budgetpro_bill', 0));
  const [userInvestments, setUserInvestments] = useState<UserInvestment[]>(() =>
    LS.get('budgetpro_investments', [])
  );
  const [monthlyData, setMonthlyData] = useState<MonthlyRecord>(() =>
    LS.get('budgetpro_monthly', {})
  );

  // Editing states
  const [editingSalary, setEditingSalary] = useState(false);
  const [editingCredit, setEditingCredit] = useState(false);
  const [tempSalary, setTempSalary] = useState('');
  const [tempCredit, setTempCredit] = useState('');

  // Expense form (salary board)
  const [salaryCategory, setSalaryCategory] = useState('');
  const [salaryAmount, setSalaryAmount] = useState('');

  // Expense form (credit board)
  const [creditCategory, setCreditCategory] = useState('');
  const [creditAmount, setCreditAmount] = useState('');
  const [creditInstallments, setCreditInstallments] = useState('');

  // Payment
  const [paymentAmount, setPaymentAmount] = useState('');

  // Chart
  const [selectedMonth, setSelectedMonth] = useState<string>(() => getCurrentMonthName());

  // Investments
  const [investAmount, setInvestAmount] = useState<Record<string, string>>({});
  const [investedIds, setInvestedIds] = useState<string[]>(() => LS.get('budgetpro_invested_ids', []));

  // ── Persist dark mode ─────────────────────────────────
  useEffect(() => {
    LS.set('budgetpro_darkmode', isDarkMode);
    document.body.style.backgroundColor = isDarkMode ? '#000000' : '';
  }, [isDarkMode]);

  // ── Persist financial data ────────────────────────────
  useEffect(() => { LS.set('budgetpro_salary', salary); }, [salary]);
  useEffect(() => { LS.set('budgetpro_credit_limit', creditLimit); }, [creditLimit]);
  useEffect(() => { LS.set('budgetpro_expenses', expenses); }, [expenses]);
  useEffect(() => { LS.set('budgetpro_bill', creditBillAmount); }, [creditBillAmount]);
  useEffect(() => { LS.set('budgetpro_investments', userInvestments); }, [userInvestments]);
  useEffect(() => { LS.set('budgetpro_monthly', monthlyData); }, [monthlyData]);
  useEffect(() => { LS.set('budgetpro_invested_ids', investedIds); }, [investedIds]);

  // ── Splash → login ────────────────────────────────────
  useEffect(() => {
    const token = LS.get<string | null>('budgetpro_token', null);
    const user = LS.get<User | null>('budgetpro_user', null);
    const timer = setTimeout(() => {
      if (token && user) {
        setCurrentUser(user);
        setAuthToken(token);
        setScreen('dashboard');
      } else {
        setScreen('login');
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // ── Derived financial values ──────────────────────────
  const salaryExpenses   = useMemo(() => calculateSalaryExpenses(expenses), [expenses]);
  const creditExpenses   = useMemo(() => calculateCreditExpenses(expenses), [expenses]);
  const totalInvestments = useMemo(() => calculateTotalInvestments(userInvestments), [userInvestments]);
  const currentBill      = useMemo(() => calculateCurrentCreditBill(creditExpenses, creditBillAmount), [creditExpenses, creditBillAmount]);
  const remainingSalary  = useMemo(() => calculateRemainingSalary(salary, salaryExpenses, creditBillAmount), [salary, salaryExpenses, creditBillAmount]);
  const availableCredit  = useMemo(() => calculateAvailableCredit(creditLimit, creditExpenses), [creditLimit, creditExpenses]);
  const expensePercentage = useMemo(() => calculateExpensePercentage(salaryExpenses, creditExpenses, salary), [salaryExpenses, creditExpenses, salary]);
  const creditPercentage  = useMemo(() => calculateCreditPercentage(creditExpenses, creditLimit), [creditExpenses, creditLimit]);
  const chartData = useMemo(
    () => getChartData(selectedMonth, monthlyData, salary, creditLimit, expenses, userInvestments),
    [selectedMonth, monthlyData, salary, creditLimit, expenses, userInvestments]
  );

  // ── Auth handlers ─────────────────────────────────────
  const handleLogin = useCallback(() => {
    const users: User[] = LS.get('budgetpro_users', []);
    const user = users.find(u => u.email === loginEmail);
    if (!user || !verifyPassword(loginPassword, user.passwordHash)) {
      toast.error('Email ou senha incorretos.');
      return;
    }
    const token = generateToken();
    LS.set('budgetpro_token', token);
    LS.set('budgetpro_user', user);
    setCurrentUser(user);
    setAuthToken(token);
    setScreen('dashboard');
    toast.success(`Bem-vindo de volta, ${user.name}!`);
  }, [loginEmail, loginPassword]);

  const handleSignup = useCallback(() => {
    if (!signupName.trim() || !signupEmail.trim() || !signupPassword) {
      toast.error('Preencha todos os campos.');
      return;
    }
    if (signupPassword.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (signupPassword !== signupConfirm) {
      toast.error('As senhas não coincidem.');
      return;
    }
    const users: User[] = LS.get('budgetpro_users', []);
    if (users.find(u => u.email === signupEmail)) {
      toast.error('Já existe uma conta com esse email.');
      return;
    }
    const newUser: User = {
      id: Date.now(),
      name: signupName,
      email: signupEmail,
      passwordHash: hashPassword(signupPassword),
    };
    LS.set('budgetpro_users', [...users, newUser]);
    const token = generateToken();
    LS.set('budgetpro_token', token);
    LS.set('budgetpro_user', newUser);
    setCurrentUser(newUser);
    setAuthToken(token);
    setScreen('dashboard');
    toast.success('Conta criada com sucesso!');
  }, [signupName, signupEmail, signupPassword, signupConfirm]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('budgetpro_token');
    localStorage.removeItem('budgetpro_user');
    setCurrentUser(null);
    setAuthToken(null);
    setScreen('login');
  }, []);

  // ── Salary / credit limit editing ────────────────────
  const saveSalary = () => {
    const v = parseFloat(tempSalary);
    if (!isNaN(v) && v >= 0) { setSalary(v); toast.success('Salário atualizado!'); }
    setEditingSalary(false);
  };
  const saveCredit = () => {
    const v = parseFloat(tempCredit);
    if (!isNaN(v) && v >= 0) { setCreditLimit(v); toast.success('Limite atualizado!'); }
    setEditingCredit(false);
  };

  // ── Expense handlers ─────────────────────────────────
  const randomIcon = (): IconType => ICON_TYPES[Math.floor(Math.random() * ICON_TYPES.length)];

  const addSalaryExpense = () => {
    const amount = parseFloat(salaryAmount);
    if (!salaryCategory.trim() || isNaN(amount) || amount <= 0) {
      toast.error('Preencha o nome e um valor válido.'); return;
    }
    const expense: Expense = {
      id: `exp-${Date.now()}`,
      category: salaryCategory,
      amount,
      iconType: randomIcon(),
      paymentMethod: 'salary',
      dateAdded: new Date().toISOString(),
    };
    setExpenses(prev => [...prev, expense]);
    setSalaryCategory(''); setSalaryAmount('');
    toast.success('Gasto adicionado!');
  };

  const addCreditExpense = () => {
    const amount = parseFloat(creditAmount);
    if (!creditCategory.trim() || isNaN(amount) || amount <= 0) {
      toast.error('Preencha o nome e um valor válido.'); return;
    }
    const installments = parseInt(creditInstallments) || 1;
    const installmentAmount = installments > 1 ? amount / installments : amount;
    const expense: Expense = {
      id: `exp-${Date.now()}`,
      category: creditCategory,
      amount: installmentAmount,
      iconType: randomIcon(),
      paymentMethod: 'credit',
      installments: installments > 1 ? 1 : undefined,
      totalInstallments: installments > 1 ? installments : undefined,
      dueDate: installments > 1
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')
        : undefined,
      dateAdded: new Date().toISOString(),
    };
    setExpenses(prev => [...prev, expense]);
    setCreditCategory(''); setCreditAmount(''); setCreditInstallments('');
    toast.success(installments > 1 ? `Compra parcelada em ${installments}x adicionada!` : 'Gasto no cartão adicionado!');
  };

  const removeExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
    toast.success('Gasto removido.');
  };

  const payInstallment = (id: string) => {
    setExpenses(prev =>
      prev.map(e => {
        if (e.id !== id) return e;
        const next = (e.installments ?? 0) + 1;
        return { ...e, installments: next };
      })
    );
    toast.success('Parcela paga!');
  };

  // ── Bill payment ──────────────────────────────────────
  const handlePayBill = () => {
    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) { toast.error('Valor inválido.'); return; }
    if (amount > remainingSalary) { toast.error('Saldo insuficiente no salário.'); return; }
    if (amount > currentBill) { toast.error('Valor maior que a fatura atual.'); return; }
    setCreditBillAmount(prev => prev + amount);
    setPaymentAmount('');
    toast.success(`Pagamento de R$ ${amount.toFixed(2)} realizado!`);
  };

  // ── Investments ───────────────────────────────────────
  const handleInvest = (investmentId: string) => {
    const amount = parseFloat(investAmount[investmentId] ?? '');
    const inv = MOCK_INVESTMENTS.find(i => i.id === investmentId);
    if (!inv) return;
    if (isNaN(amount) || amount <= 0) { toast.error('Digite um valor válido.'); return; }
    if (amount < inv.minInvestment) { toast.error(`Valor mínimo: R$ ${inv.minInvestment}`); return; }
    if (amount > inv.maxInvestment) { toast.error(`Valor máximo: R$ ${inv.maxInvestment}`); return; }
    if (amount > remainingSalary) { toast.error('Saldo insuficiente.'); return; }
    const ui: UserInvestment = {
      id: `inv-${Date.now()}`,
      investmentId,
      amount,
      date: new Date().toISOString(),
    };
    setUserInvestments(prev => [...prev, ui]);
    setInvestedIds(prev => [...new Set([...prev, investmentId])]);
    setInvestAmount(prev => ({ ...prev, [investmentId]: '' }));
    toast.success(`Investimento de R$ ${amount.toFixed(2)} em ${inv.name} realizado!`);
  };

  // ── Styles ────────────────────────────────────────────
  const surface  = isDarkMode ? '#1e293b'  : '#ffffff';
  const textMain = isDarkMode ? '#f1f5f9'  : '#0f172a';
  const textMut  = isDarkMode ? '#94a3b8'  : '#64748b';
  const border   = isDarkMode ? '#334155'  : '#e2e8f0';

  // ── Tab content renderer (single child for AnimatePresence) ──
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <>
            {/* 2×2 grid */}
            <div className="grid grid-cols-2 gap-3">
              <FinancialCard
                title="Salário Mensal"
                value={salary}
                isEditing={editingSalary}
                tempValue={tempSalary}
                onEdit={() => { setTempSalary(String(salary)); setEditingSalary(true); }}
                onSave={saveSalary}
                onCancel={() => setEditingSalary(false)}
                onTempValueChange={setTempSalary}
                isDarkMode={isDarkMode}
              />
              <FinancialCard
                title="Limite do Cartão"
                value={creditLimit}
                isEditing={editingCredit}
                tempValue={tempCredit}
                onEdit={() => { setTempCredit(String(creditLimit)); setEditingCredit(true); }}
                onSave={saveCredit}
                onCancel={() => setEditingCredit(false)}
                onTempValueChange={setTempCredit}
                isDarkMode={isDarkMode}
              />
              <FinancialCard
                title="Salário Disponível"
                value={remainingSalary}
                isEditing={false}
                tempValue=""
                onEdit={() => {}}
                onSave={() => {}}
                onCancel={() => {}}
                onTempValueChange={() => {}}
                isDarkMode={isDarkMode}
                valueColor={remainingSalary < 0 ? '#ef4444' : remainingSalary < salary * 0.2 ? '#f59e0b' : '#10b981'}
                readOnly
              />
              <FinancialCard
                title="Limite Disponível"
                value={availableCredit}
                isEditing={false}
                tempValue=""
                onEdit={() => {}}
                onSave={() => {}}
                onCancel={() => {}}
                onTempValueChange={() => {}}
                isDarkMode={isDarkMode}
                valueColor={availableCredit < creditLimit * 0.2 ? '#ef4444' : availableCredit < creditLimit * 0.5 ? '#f59e0b' : '#046BF4'}
                readOnly
              />
            </div>

            <MonthlySummaryCard expensePercentage={expensePercentage} isDarkMode={isDarkMode} />

            <EvolutionChart
              chartData={chartData}
              selectedMonth={selectedMonth}
              onMonthChange={setSelectedMonth}
              isDarkMode={isDarkMode}
            />

            <FinancialHealthIndex
              salary={salary}
              creditLimit={creditLimit}
              remainingSalary={remainingSalary}
              salaryExpenses={salaryExpenses}
              creditExpenses={creditExpenses}
              expensePercentage={expensePercentage}
              totalInvestments={totalInvestments}
              expenses={expenses}
              isDarkMode={isDarkMode}
            />
            <BehavioralProfile
              salary={salary}
              creditLimit={creditLimit}
              remainingSalary={remainingSalary}
              salaryExpenses={salaryExpenses}
              creditExpenses={creditExpenses}
              expensePercentage={expensePercentage}
              totalInvestments={totalInvestments}
              expenses={expenses}
              isDarkMode={isDarkMode}
            />

            <FinancialAssistant
              context="overview"
              data={{ salary, creditLimit, remainingSalary, availableCredit, salaryExpenses, creditExpenses, currentBill, totalInvestments, expensePercentage, expenses }}
              isDarkMode={isDarkMode}
            />
          </>
        );

      case 'expenses':
        return (
          <>
            <ExpenseBoard
              title="💰 Gastos do Salário"
              expenses={expenses.filter(e => e.paymentMethod === 'salary')}
              newCategory={salaryCategory}
              newAmount={salaryAmount}
              onCategoryChange={setSalaryCategory}
              onAmountChange={setSalaryAmount}
              onAddExpense={addSalaryExpense}
              onRemoveExpense={removeExpense}
              totalAmount={salaryExpenses}
              isDarkMode={isDarkMode}
            />
            <ExpenseBoard
              title="💳 Gastos do Cartão"
              expenses={expenses.filter(e => e.paymentMethod === 'credit')}
              newCategory={creditCategory}
              newAmount={creditAmount}
              newInstallments={creditInstallments}
              onCategoryChange={setCreditCategory}
              onAmountChange={setCreditAmount}
              onInstallmentsChange={setCreditInstallments}
              onAddExpense={addCreditExpense}
              onRemoveExpense={removeExpense}
              onPayInstallment={payInstallment}
              totalAmount={creditExpenses}
              isDarkMode={isDarkMode}
              showInstallments
            />
            <FinancialAssistant
              context="expenses"
              data={{ salary, expenses, salaryExpenses, creditExpenses }}
              isDarkMode={isDarkMode}
            />
          </>
        );

      case 'payment':
        return (
          <>
            <BillPayment
              currentBill={currentBill}
              paymentAmount={paymentAmount}
              remainingSalary={remainingSalary}
              onPaymentAmountChange={setPaymentAmount}
              onPayBill={handlePayBill}
              isDarkMode={isDarkMode}
            />

            {/* Credit usage summary */}
            <div
              className="rounded-xl p-4 space-y-3"
              style={{ backgroundColor: surface, border: `1px solid ${border}` }}
            >
              <h3 className="text-sm font-semibold" style={{ color: textMain }}>
                Resumo do Cartão
              </h3>
              {[
                { label: 'Limite total', value: creditLimit, color: '#046BF4' },
                { label: 'Gastos no cartão', value: creditExpenses, color: '#ef4444' },
                { label: 'Fatura já paga', value: creditBillAmount, color: '#10b981' },
                { label: 'Fatura pendente', value: currentBill, color: '#f59e0b' },
                { label: 'Limite disponível', value: availableCredit, color: '#8b5cf6' },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex justify-between items-center">
                  <span className="text-xs" style={{ color: textMut }}>{label}</span>
                  <span className="text-sm font-semibold" style={{ color }}>
                    R$ {value.toFixed(2)}
                  </span>
                </div>
              ))}
              <div>
                <div className="flex justify-between text-xs mb-1" style={{ color: textMut }}>
                  <span>Uso do limite</span>
                  <span>{creditPercentage.toFixed(0)}%</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: isDarkMode ? '#334155' : '#e2e8f0' }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${creditPercentage}%`,
                      backgroundColor: creditPercentage > 80 ? '#ef4444' : creditPercentage > 50 ? '#f59e0b' : '#046BF4',
                    }}
                  />
                </div>
              </div>
            </div>

            <FinancialAssistant
              context="payment"
              data={{ currentBill, remainingSalary, creditExpenses, salary }}
              isDarkMode={isDarkMode}
            />
          </>
        );

      case 'investments':
        return (
          <>
            {/* Portfolio summary */}
            {totalInvestments > 0 && (
              <div
                className="rounded-xl p-4"
                style={{ backgroundColor: surface, border: `1px solid ${border}` }}
              >
                <h3 className="text-sm font-semibold mb-3" style={{ color: textMain }}>
                  📊 Minha Carteira
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-0.5">
                    <p className="text-xs" style={{ color: textMut }}>Total investido</p>
                    <p className="text-lg font-bold" style={{ color: '#10b981' }}>
                      R$ {totalInvestments.toFixed(2)}
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs" style={{ color: textMut }}>Ativos</p>
                    <p className="text-lg font-bold" style={{ color: '#046BF4' }}>
                      {investedIds.length}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Investment cards */}
            {MOCK_INVESTMENTS.map(inv => {
              const Icon = inv.icon;
              const myInvestment = userInvestments
                .filter(ui => ui.investmentId === inv.id)
                .reduce((s, ui) => s + ui.amount, 0);
              const hasInvested = myInvestment > 0;

              const riskColor = inv.riskLevel === 'low' ? '#10b981' : inv.riskLevel === 'medium' ? '#f59e0b' : '#ef4444';
              const riskLabel = inv.riskLevel === 'low' ? 'Baixo' : inv.riskLevel === 'medium' ? 'Médio' : 'Alto';

              return (
                <div
                  key={inv.id}
                  className="rounded-xl overflow-hidden"
                  style={{ backgroundColor: surface, border: `1px solid ${border}` }}
                >
                  <div className="h-1" style={{ backgroundColor: inv.color }} />
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: `${inv.color}20` }}
                        >
                          <Icon className="w-5 h-5" style={{ color: inv.color }} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold" style={{ color: textMain }}>{inv.name}</p>
                          <p className="text-xs" style={{ color: textMut }}>{inv.type}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold" style={{ color: '#10b981' }}>
                          +{inv.expectedReturn}% a.a.
                        </p>
                        <span
                          className="text-xs px-1.5 py-0.5 rounded-full"
                          style={{ backgroundColor: `${riskColor}15`, color: riskColor }}
                        >
                          Risco {riskLabel}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs" style={{ color: textMut }}>{inv.description}</p>

                    {hasInvested && (
                      <div
                        className="flex items-center justify-between p-2 rounded-lg"
                        style={{ backgroundColor: isDarkMode ? '#0f172a' : '#f0fdf4' }}
                      >
                        <span className="text-xs" style={{ color: textMut }}>Minha posição</span>
                        <span className="text-sm font-bold" style={{ color: '#10b981' }}>
                          R$ {myInvestment.toFixed(2)}
                        </span>
                      </div>
                    )}

                    <div className="flex items-end gap-0.5 h-10">
                      {inv.historicalData.map((d, i) => {
                        const max = Math.max(...inv.historicalData.map(x => x.value));
                        const min = Math.min(...inv.historicalData.map(x => x.value));
                        const pct = max === min ? 50 : ((d.value - min) / (max - min)) * 100;
                        return (
                          <div key={i} className="flex-1 flex items-end">
                            <div
                              className="w-full rounded-t"
                              style={{
                                height: `${Math.max(10, pct)}%`,
                                backgroundColor: `${inv.color}${i === inv.historicalData.length - 1 ? 'ff' : '60'}`,
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex justify-between text-xs" style={{ color: textMut }}>
                      {inv.historicalData.map(d => (
                        <span key={d.month}>{d.month}</span>
                      ))}
                    </div>

                    <p className="text-xs" style={{ color: textMut }}>
                      Mín: R$ {inv.minInvestment} · Máx: R$ {inv.maxInvestment}
                    </p>

                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder={`R$ ${inv.minInvestment}+`}
                        value={investAmount[inv.id] ?? ''}
                        onChange={e => setInvestAmount(prev => ({ ...prev, [inv.id]: e.target.value }))}
                        className="flex-1 h-10 px-3 rounded-xl text-sm border outline-none"
                        style={{
                          borderColor: border,
                          backgroundColor: isDarkMode ? '#334155' : '#f8fafc',
                          color: textMain,
                        }}
                      />
                      <button
                        onClick={() => handleInvest(inv.id)}
                        className="h-10 px-4 rounded-xl text-sm font-medium text-white flex items-center gap-1 flex-shrink-0"
                        style={{ backgroundColor: inv.color }}
                      >
                        Investir <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            <FinancialAssistant
              context="investments"
              data={{ totalInvestments, remainingSalary, salary }}
              isDarkMode={isDarkMode}
            />
          </>
        );

      default:
        return null;
    }
  };

  const TABS: { key: DashTab; label: string; icon: React.ReactNode }[] = [
    { key: 'overview',     label: 'Visão Geral',  icon: <LayoutDashboard className="w-4 h-4" /> },
    { key: 'expenses',     label: 'Gastos',       icon: <Receipt className="w-4 h-4" /> },
    { key: 'payment',      label: 'Pagar Fatura', icon: <CreditCard className="w-4 h-4" /> },
    { key: 'investments',  label: 'Investimentos',icon: <TrendingUp className="w-4 h-4" /> },
  ];

  // ── Render: Splash ─────────────────────────────────────
  if (screen === 'splash') {
    return (
      <>
        <DarkModeToggle isDarkMode={isDarkMode} onToggle={() => setIsDarkMode(d => !d)} />
        <SplashScreen />
      </>
    );
  }

  // ── Render: Login ──────────────────────────────────────
  if (screen === 'login') {
    return (
      <>
        <DarkModeToggle isDarkMode={isDarkMode} onToggle={() => setIsDarkMode(d => !d)} />
        <LoginScreen
          email={loginEmail}
          password={loginPassword}
          onEmailChange={setLoginEmail}
          onPasswordChange={setLoginPassword}
          onLogin={handleLogin}
          onNavigate={setScreen}
          isDarkMode={isDarkMode}
        />
      </>
    );
  }

  // ── Render: Signup ─────────────────────────────────────
  if (screen === 'signup') {
    return (
      <>
        <DarkModeToggle isDarkMode={isDarkMode} onToggle={() => setIsDarkMode(d => !d)} />
        <SignupScreen
          name={signupName}
          email={signupEmail}
          password={signupPassword}
          confirmPassword={signupConfirm}
          onNameChange={setSignupName}
          onEmailChange={setSignupEmail}
          onPasswordChange={setSignupPassword}
          onConfirmPasswordChange={setSignupConfirm}
          onSignup={handleSignup}
          onNavigate={setScreen}
          isDarkMode={isDarkMode}
        />
      </>
    );
  }

  // ── Render: Forgot password ────────────────────────────
  if (screen === 'forgot-password') {
    return (
      <>
        <DarkModeToggle isDarkMode={isDarkMode} onToggle={() => setIsDarkMode(d => !d)} />
        <motion.div
          className="min-h-screen flex items-center justify-center px-4"
          style={isDarkMode
            ? { background: 'linear-gradient(to bottom, #0f172a, #1e3a8a, #000000)' }
            : { background: 'linear-gradient(to bottom, #046BF4, white)' }
          }
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-full max-w-sm space-y-4">
            <div className="text-center text-white space-y-2">
              <h2 className="text-2xl font-bold">Recuperar senha</h2>
              <p className="text-sm text-white/80">Digite seu email cadastrado</p>
            </div>
            <div
              className="rounded-2xl p-6 space-y-4 shadow-xl"
              style={{ backgroundColor: isDarkMode ? '#1e293b' : 'rgba(255,255,255,0.95)' }}
            >
              <input
                type="email"
                placeholder="Seu email"
                value={forgotEmail}
                onChange={e => setForgotEmail(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border outline-none text-sm"
                style={{ borderColor: border, backgroundColor: isDarkMode ? '#334155' : '#f8fafc', color: textMain }}
              />
              <button
                onClick={() => {
                  if (!forgotEmail) { toast.error('Digite seu email.'); return; }
                  toast.success('Se esse email existir, você receberá as instruções. (simulação)');
                  setScreen('login');
                }}
                className="w-full h-12 rounded-xl text-white font-medium"
                style={{ backgroundColor: '#046BF4' }}
              >
                Enviar instruções
              </button>
              <button
                onClick={() => setScreen('login')}
                className="w-full text-sm text-center"
                style={{ color: isDarkMode ? '#60a5fa' : '#046BF4' }}
              >
                ← Voltar ao login
              </button>
            </div>
          </div>
        </motion.div>
      </>
    );
  }

  // ── Render: Dashboard ──────────────────────────────────
  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={isDarkMode
        ? { background: 'linear-gradient(to bottom, #0f172a, #1e3a8a, #000000)', backgroundAttachment: 'fixed' }
        : { backgroundColor: '#f1f5f9' }
      }
    >
      <DarkModeToggle isDarkMode={isDarkMode} onToggle={() => setIsDarkMode(d => !d)} />

      {/* Header */}
      <header
        className="sticky top-0 z-30 px-4 pt-4 pb-0 backdrop-blur-md"
        style={isDarkMode
          ? { backgroundColor: 'rgba(15,23,42,0.85)', borderBottom: '1px solid rgba(51,65,85,0.5)' }
          : { backgroundColor: '#f1f5f9' }
        }
      >
        <div className="max-w-2xl mx-auto">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-4 pr-14">
            <div>
              <h1 className="font-bold" style={{ color: '#046BF4', fontSize: '1.4rem' }}>
                BudgetPro
              </h1>
              {currentUser && (
                <p className="text-xs" style={{ color: textMut }}>
                  Olá, {currentUser.name} 👋
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowDownload(v => !v)}
                title="Baixar código-fonte"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs border transition-all"
                style={{
                  borderColor: showDownload ? '#046BF4' : border,
                  color: showDownload ? '#046BF4' : textMut,
                  backgroundColor: showDownload ? '#046BF415' : surface,
                }}
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Baixar código</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs border transition-all"
                style={{ borderColor: border, color: textMut, backgroundColor: surface }}
              >
                <LogOut className="w-3.5 h-3.5" />
                Sair
              </button>
            </div>
          </div>

          {/* Tab bar */}
          <div
            className="flex rounded-2xl p-1 gap-1 overflow-x-auto"
            style={{ backgroundColor: surface, border: `1px solid ${border}` }}
          >
            {TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => { setActiveTab(tab.key); setShowDownload(false); }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap flex-1 justify-center transition-all"
                style={{
                  backgroundColor: activeTab === tab.key && !showDownload ? '#046BF4' : 'transparent',
                  color: activeTab === tab.key && !showDownload ? '#ffffff' : textMut,
                }}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Download page overlay */}
      {showDownload ? (
        <DownloadPage isDarkMode={isDarkMode} />
      ) : (
        /* Tab content */
        <main className="max-w-2xl mx-auto px-4 py-4 pb-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      )}
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BudgetProApp />
    </ErrorBoundary>
  );
}