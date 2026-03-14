// Utility functions for BudgetPro

export const generateToken = (): string => {
  return `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const getCurrentMonthKey = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

const MONTH_LIST = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

/**
 * Converts a Portuguese month name to a "YYYY-MM" key.
 *
 * @param monthName - One of the 12 Portuguese month names (e.g. "Março").
 * @returns A valid key in the format "YYYY-MM".
 *          Falls back to the current month when `monthName` is not recognised,
 *          so the return value is **never** "YYYY-00".
 */
export const getMonthKeyFromName = (monthName: string): string => {
  const monthIndex = MONTH_LIST.indexOf(monthName);

  if (monthIndex === -1) {
    // Unknown / empty name — fall back to the current month instead of
    // producing an invalid "YYYY-00" key.
    console.warn(
      `[getMonthKeyFromName] Unrecognised month name: "${monthName}". ` +
      `Falling back to current month.`
    );
    return getCurrentMonthKey();
  }

  const now = new Date();
  return `${now.getFullYear()}-${String(monthIndex + 1).padStart(2, '0')}`;
};

export const getCurrentMonthName = (): string => {
  return MONTH_LIST[new Date().getMonth()];
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