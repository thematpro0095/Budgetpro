// Financial calculations and logic

import { Expense, UserInvestment, DailyData, MonthlyRecord } from '../types';
import { getCurrentMonthKey, getMonthKeyFromName } from './helpers';

export const calculateSalaryExpenses = (expenses: Expense[]): number => {
  return expenses
    .filter(e => e.paymentMethod === 'salary')
    .reduce((sum, expense) => sum + expense.amount, 0);
};

export const calculateCreditExpenses = (expenses: Expense[]): number => {
  return expenses
    .filter(e => e.paymentMethod === 'credit')
    .reduce((sum, expense) => sum + expense.amount, 0);
};

export const calculateTotalInvestments = (userInvestments: UserInvestment[]): number => {
  return userInvestments.reduce((sum, inv) => sum + inv.amount, 0);
};

export const calculateRemainingSalary = (
  salary: number,
  salaryExpenses: number,
  creditBillAmount: number
): number => {
  return salary - salaryExpenses - creditBillAmount;
};

export const calculateAvailableCredit = (
  creditLimit: number,
  creditExpenses: number
): number => {
  return creditLimit - creditExpenses;
};

export const calculateCurrentCreditBill = (
  creditExpenses: number,
  creditBillAmount: number
): number => {
  return Math.max(0, creditExpenses - creditBillAmount);
};

export const calculateExpensePercentage = (
  salaryExpenses: number,
  creditExpenses: number,
  salary: number
): number => {
  if (salary <= 0) return 0;
  const totalUsed = salaryExpenses + creditExpenses;
  return Math.min(((totalUsed / salary) * 100), 100);
};

export const calculateCreditPercentage = (
  creditExpenses: number,
  creditLimit: number
): number => {
  if (creditLimit <= 0) return 0;
  return Math.min(((creditExpenses / creditLimit) * 100), 100);
};

export const initializeMonthData = (
  monthKey: string,
  salary: number,
  creditLimit: number
): DailyData[] => {
  const [year, month] = monthKey.split('-').map(Number);
  const daysInMonth = new Date(year, month, 0).getDate();
  
  const data: DailyData[] = [];
  for (let day = 1; day <= daysInMonth; day++) {
    data.push({
      day,
      salario: salary,
      cartao: creditLimit,
      investimentos: 0
    });
  }
  
  return data;
};

export const getChartData = (
  selectedMonth: string,
  monthlyData: MonthlyRecord,
  salary: number,
  creditLimit: number,
  expenses: Expense[],
  userInvestments: UserInvestment[]
): DailyData[] => {
  const monthKey = getMonthKeyFromName(selectedMonth);

  // Guard: monthKey must match YYYY-MM with a valid month (01-12).
  // getMonthKeyFromName already guarantees this via its own fallback, but we
  // add a second layer here so getChartData is safe even if called directly
  // with a raw key that somehow slipped through.
  const VALID_KEY = /^\d{4}-(0[1-9]|1[0-2])$/.test(monthKey);
  if (!VALID_KEY) {
    console.warn(
      `[getChartData] Invalid monthKey "${monthKey}" — returning empty data.`
    );
    return [];
  }

  let data = monthlyData[monthKey];
  
  if (!data) {
    data = initializeMonthData(monthKey, salary, creditLimit);
  }
  
  const isCurrentMonth = monthKey === getCurrentMonthKey();
  const today = new Date().getDate();
  
  // Calculate cumulative values for each day
  const processedData = data.map(dayData => {
    // Salário: starts with total and decreases with expenses
    const dayExpensesSalary = expenses
      .filter(e => e.paymentMethod === 'salary')
      .filter(e => {
        const expenseDate = new Date(e.dateAdded);
        const expenseMonth = `${expenseDate.getFullYear()}-${String(expenseDate.getMonth() + 1).padStart(2, '0')}`;
        return expenseMonth === monthKey && expenseDate.getDate() <= dayData.day;
      })
      .reduce((sum, e) => sum + e.amount, 0);
    
    // Cartão: starts with total limit and decreases with expenses
    const dayExpensesCredit = expenses
      .filter(e => e.paymentMethod === 'credit')
      .filter(e => {
        const expenseDate = new Date(e.dateAdded);
        const expenseMonth = `${expenseDate.getFullYear()}-${String(expenseDate.getMonth() + 1).padStart(2, '0')}`;
        return expenseMonth === monthKey && expenseDate.getDate() <= dayData.day;
      })
      .reduce((sum, e) => sum + e.amount, 0);
    
    // Investimentos: starts at 0 and increases with investments
    const dayInvestments = userInvestments
      .filter(inv => {
        const invDate = new Date(inv.date);
        const invMonth = `${invDate.getFullYear()}-${String(invDate.getMonth() + 1).padStart(2, '0')}`;
        return invMonth === monthKey && invDate.getDate() <= dayData.day;
      })
      .reduce((sum, inv) => sum + inv.amount, 0);
    
    return {
      day: dayData.day,
      salario: Math.max(0, salary - dayExpensesSalary),
      cartao: Math.max(0, creditLimit - dayExpensesCredit),
      investimentos: dayInvestments
    };
  });
  
  // If current month, show only up to today
  if (isCurrentMonth) {
    return processedData.filter(d => d.day <= today);
  }
  
  return processedData;
};