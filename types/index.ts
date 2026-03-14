// Types for BudgetPro Application
import type { ComponentType } from 'react';

export type Screen = 'splash' | 'login' | 'signup' | 'forgot-password' | 'reset-password' | 'dashboard';
export type IconType = 'coffee' | 'car' | 'home' | 'shopping' | 'smartphone';
export type RiskLevel = 'low' | 'medium' | 'high';
export type InvestmentStatus = 'available' | 'purchased' | 'completed';
export type PaymentMethod = 'salary' | 'credit';

export interface Expense {
  id: string;
  category: string;
  amount: number;
  iconType: IconType;
  paymentMethod: PaymentMethod;
  installments?: number;
  totalInstallments?: number;
  dueDate?: string;
  dateAdded: string;
}

export interface DailyData {
  day: number;
  salario: number;
  cartao: number;
  investimentos: number;
}

export interface MonthlyRecord {
  [key: string]: DailyData[];
}

export interface Investment {
  id: string;
  name: string;
  type: string;
  description: string;
  riskLevel: RiskLevel;
  expectedReturn: number;
  minInvestment: number;
  maxInvestment: number;
  icon: ComponentType<{ className?: string }>;
  color: string;
  historicalData: { month: string; value: number }[];
  status: InvestmentStatus;
  purchaseAmount?: number;
  purchaseDate?: Date;
  currentValue?: number;
  profitLoss?: number;
}

export interface UserInvestment {
  id: string;
  investmentId: string;
  amount: number;
  date: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
}

export interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  signup: (name: string, email: string, password: string) => boolean;
  logout: () => void;
}