// Utility functions for BudgetPro

export const generateToken = (): string => {
  return `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const getCurrentMonthKey = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

export const getMonthKeyFromName = (monthName: string): string => {
  const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
                  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  const monthIndex = months.indexOf(monthName);
  const now = new Date();
  return `${now.getFullYear()}-${String(monthIndex + 1).padStart(2, '0')}`;
};

export const getCurrentMonthName = (): string => {
  const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
                  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  return months[new Date().getMonth()];
};

export const formatCurrency = (value: number): string => {
  return `R$ ${value.toFixed(2)}`;
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('pt-BR');
};

export const hashPassword = (password: string): string => {
  return btoa(password);
};

export const verifyPassword = (password: string, hash: string): boolean => {
  return btoa(password) === hash;
};
