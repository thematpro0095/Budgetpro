# 💰 BudgetPro - Aplicativo de Gerenciamento Financeiro

Aplicativo mobile-first de gerenciamento financeiro pessoal com design moderno inspirado em Nubank e iFood.

## 📁 Estrutura do Projeto

```
budgetpro/
├── components/
│   ├── auth/                    # Componentes de autenticação
│   │   ├── SplashScreen.tsx    # Tela de carregamento inicial
│   │   └── LoginScreen.tsx     # Tela de login
│   ├── common/                  # Componentes compartilhados
│   │   └── DarkModeToggle.tsx  # Toggle de modo escuro
│   ├── dashboard/               # Componentes do dashboard
│   │   ├── FinancialCard.tsx   # Card financeiro editável
│   │   ├── MonthlySummaryCard.tsx  # Resumo mensal com progress ring
│   │   ├── EvolutionChart.tsx  # Gráfico de evolução (3 linhas)
│   │   ├── ExpenseBoard.tsx    # Prancheta de gastos
│   │   └── BillPayment.tsx     # Componente de pagamento de fatura
│   └── ui/                      # Componentes UI base (shadcn)
├── types/
│   └── index.ts                 # Definições de tipos TypeScript
├── utils/
│   ├── helpers.ts              # Funções auxiliares gerais
│   └── financial.ts            # Cálculos financeiros
├── constants/
│   └── index.ts                # Constantes e dados mock
└── App.tsx                      # Componente principal da aplicação
```

## 🎨 Características

### ✨ Funcionalidades Principais

- **Autenticação Completa**: Login, cadastro, recuperação de senha com tokens seguros
- **Dashboard Financeiro**: Visão geral com 4 cards principais
  - Salário Mensal (editável)
  - Limite do Cartão (editável)
  - Salário Disponível
  - Limite Disponível
- **Gestão de Gastos**: Duas pranchetas separadas
  - 💵 Gastos do Salário
  - 💳 Gastos do Cartão (com suporte a parcelas)
- **Pagamento de Faturas**: Sistema completo com validações
- **Investimentos**: Simulação de investimentos (fictícia)
- **Gráfico de Evolução**: 3 linhas independentes
  - 🟢 Verde = Salário (diminui com gastos)
  - 🔵 Azul = Cartão (diminui com compras)
  - 🟣 Roxo = Investimentos (aumenta com aportes)
- **Modo Escuro**: Suporte completo com persistência

### 🎯 Destaques Técnicos

- **Mobile-First**: Design responsivo que escala para desktop
- **TypeScript**: Tipagem completa para maior segurança
- **Componentização**: Código modular e reutilizável
- **Persistência**: LocalStorage para dados do usuário
- **Animações**: Motion/React para transições suaves
- **Gráficos**: Recharts para visualizações de dados

## 🚀 Como Usar

### Instalação
```bash
npm install
```

### Desenvolvimento
```bash
npm run dev
```

### Build
```bash
npm run build
```

## 🔐 Sistema de Autenticação

- **Armazenamento Seguro**: Senhas hasheadas (btoa)
- **Tokens Únicos**: Geração de tokens para sessões
- **Persistência**: Dados salvos no localStorage
- **Múltiplos Usuários**: Suporte a vários usuários no mesmo navegador

## 📊 Dados Financeiros

### Cálculos Automáticos

- **Gastos Totais**: Salário + Cartão
- **Percentual de Gastos**: (Total Gasto / Salário) × 100
- **Saldo Disponível**: Salário - Gastos - Pagamentos de Fatura
- **Limite Disponível**: Limite - Compras no Cartão
- **Fatura Atual**: Compras - Pagamentos Realizados

### Estrutura de Dados

```typescript
// Expense (Gasto)
{
  id: string;
  category: string;
  amount: number;
  iconType: IconType;
  paymentMethod: 'salary' | 'credit';
  installments?: number;
  totalInstallments?: number;
  dueDate?: string;
  dateAdded: string;
}

// DailyData (Dados Diários para Gráfico)
{
  day: number;
  salario: number;
  cartao: number;
  investimentos: number;
}
```

## 🎨 Paleta de Cores

```typescript
{
  primary: '#046BF4',      // Azul principal
  secondary: '#2A9DF4',    // Azul claro
  success: '#10B981',      // Verde (Salário)
  warning: '#F59E0B',      // Amarelo
  danger: '#EF4444',       // Vermelho
  purple: '#8B5CF6',       // Roxo (Investimentos)
  dark: '#001F54',         // Azul marinho
}
```

## 📱 Abas do Dashboard

1. **📊 Visão Geral**
   - Cards financeiros
   - Resumo do mês com progress bar
   - Gráfico de evolução

2. **📋 Gastos**
   - Prancheta de Gastos do Salário
   - Prancheta de Gastos do Cartão

3. **🧾 Pagar Fatura**
   - Visualização da fatura atual
   - Formulário de pagamento
   - Saldo disponível

4. **💰 Investimentos**
   - Lista de oportunidades (simuladas)
   - Gráficos históricos
   - Modal de investimento

## 🛠️ Tecnologias Utilizadas

- **React 18**: Framework principal
- **TypeScript**: Tipagem estática
- **Tailwind CSS v4**: Estilização
- **Motion/React**: Animações
- **Recharts**: Gráficos
- **Lucide React**: Ícones
- **shadcn/ui**: Componentes base

## 📝 Boas Práticas Implementadas

### Organização
- ✅ Separação de responsabilidades
- ✅ Componentização eficiente
- ✅ Utilitários centralizados
- ✅ Tipos bem definidos
- ✅ Constantes isoladas

### Performance
- ✅ Memoization com `React.useMemo`
- ✅ Callbacks otimizados com `React.useCallback`
- ✅ Lazy evaluation de dados

### Manutenibilidade
- ✅ Código limpo e documentado
- ✅ Nomenclatura clara
- ✅ Estrutura de pastas lógica
- ✅ DRY (Don't Repeat Yourself)

## 🔄 Fluxo de Dados

```
App.tsx (Estado Global)
    ↓
Components (Props)
    ↓
Utils/Helpers (Lógica)
    ↓
LocalStorage (Persistência)
```

## ⚠️ Avisos Importantes

- **Simulação**: Os investimentos são fictícios
- **Segurança**: Não usar para dados reais sensíveis
- **Educacional**: Projeto para aprendizado

## 🎓 Conceitos Aplicados

- Component-Driven Development
- State Management com Hooks
- Responsive Design
- Dark Mode Implementation
- Financial Calculations
- Data Visualization
- Form Validation
- LocalStorage API
- TypeScript Generics
- Custom Hooks (possível extensão)

## 📦 Estrutura de Componentes

### Hierarquia
```
App
├── DarkModeToggle
├── SplashScreen
├── LoginScreen
└── Dashboard
    ├── FinancialCard (x4)
    ├── MonthlySummaryCard
    │   └── ProgressRing
    ├── EvolutionChart
    │   └── LineChart (Recharts)
    ├── ExpenseBoard (x2)
    └── BillPayment
```

## 🐛 Bugs Corrigidos

1. ✅ Gráfico mostrando 3 linhas "Investimentos" → Agora: Salário, Cartão, Investimentos
2. ✅ Inputs duplicados entre pranchetas → Agora: Inputs separados
3. ✅ Resumo do mês só considerava salário → Agora: Salário + Cartão
4. ✅ Recharts com erro de dimensões → Corrigido com height explícita

## 📈 Próximas Melhorias Possíveis

- [ ] Backend real com API
- [ ] Banco de dados
- [ ] Exportação de relatórios (PDF)
- [ ] Categorias customizáveis
- [ ] Metas de economia
- [ ] Notificações
- [ ] PWA (Progressive Web App)
- [ ] Compartilhamento de dados
- [ ] Múltiplas contas bancárias
- [ ] Integração com Open Banking

---

**Desenvolvido com ❤️ para aprendizado de gerenciamento financeiro pessoal**
