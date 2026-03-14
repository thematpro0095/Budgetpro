// Expense board component for managing expenses

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { PlusCircle, Trash2, Tag } from 'lucide-react';
import { Expense } from '../../types';
import { ICON_MAP } from '../../constants';

interface ExpenseBoardProps {
  title: string;
  expenses: Expense[];
  newCategory: string;
  newAmount: string;
  newInstallments?: string;
  onCategoryChange: (value: string) => void;
  onAmountChange: (value: string) => void;
  onInstallmentsChange?: (value: string) => void;
  onAddExpense: () => void;
  onRemoveExpense: (id: string) => void;
  onPayInstallment?: (id: string) => void;
  totalAmount: number;
  isDarkMode: boolean;
  showInstallments?: boolean;
}

export const ExpenseBoard: React.FC<ExpenseBoardProps> = ({
  title,
  expenses,
  newCategory,
  newAmount,
  newInstallments,
  onCategoryChange,
  onAmountChange,
  onInstallmentsChange,
  onAddExpense,
  onRemoveExpense,
  onPayInstallment,
  totalAmount,
  isDarkMode,
  showInstallments = false
}) => {
  return (
    <Card className={`shadow-md border-0 rounded-xl ${isDarkMode ? 'bg-[#1e293b]' : ''}`}>
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 text-sm ${isDarkMode ? 'text-white' : ''}`}>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <Input
            placeholder={showInstallments ? "Nome da compra" : "Nome do gasto"}
            value={newCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className={`h-10 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
          />
          <Input
            type="number"
            placeholder={showInstallments ? "Valor total" : "Valor"}
            value={newAmount}
            onChange={(e) => onAmountChange(e.target.value)}
            className={`h-10 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
          />
          {showInstallments && onInstallmentsChange && (
            <Input
              type="number"
              placeholder="Número de parcelas (opcional)"
              value={newInstallments}
              onChange={(e) => onInstallmentsChange(e.target.value)}
              className={`h-10 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
            />
          )}
          <Button
            onClick={onAddExpense}
            className="w-full h-10"
            style={{ backgroundColor: '#046BF4' }}
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            {showInstallments ? 'Adicionar Compra' : 'Adicionar Gasto'}
          </Button>
        </div>

        <div className="space-y-2">
          {expenses.length === 0 ? (
            <p className={`text-sm text-center py-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {showInstallments ? 'Nenhuma compra adicionada' : 'Nenhum gasto adicionado'}
            </p>
          ) : (
            expenses.map(expense => {
              const Icon = ICON_MAP[expense.iconType] ?? Tag;
              const showInstallmentInfo = expense.installments && expense.totalInstallments;
              return (
                <div key={expense.id} className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <Icon className={`w-5 h-5 ${showInstallments ? 'text-purple-500' : 'text-blue-500'}`} />
                      <div>
                        <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : ''}`}>
                          {expense.category}
                        </p>
                        {showInstallmentInfo ? (
                          <>
                            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              Parcela {expense.installments}/{expense.totalInstallments} - R$ {expense.amount.toFixed(2)}
                            </p>
                            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              Total: R$ {(expense.amount * expense.totalInstallments).toFixed(2)}
                            </p>
                            {expense.dueDate && (
                              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                Venc: {expense.dueDate}
                              </p>
                            )}
                          </>
                        ) : (
                          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            R$ {expense.amount.toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      onClick={() => onRemoveExpense(expense.id)}
                      variant="ghost"
                      size="sm"
                      className="hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                  {showInstallmentInfo && expense.installments! < expense.totalInstallments! && onPayInstallment && (
                    <Button
                      onClick={() => onPayInstallment(expense.id)}
                      size="sm"
                      className="w-full h-8 text-xs mt-2"
                      style={{ backgroundColor: '#10B981' }}
                    >
                      Pagar Próxima Parcela
                    </Button>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className={`pt-3 border-t ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
          <div className="flex justify-between items-center">
            <span className={`font-semibold ${isDarkMode ? 'text-white' : ''}`}>
              {showInstallments ? 'Total devido este mês:' : 'Total:'}
            </span>
            <span className={`font-bold ${showInstallments ? 'text-purple-600' : 'text-red-600'}`}>
              R$ {totalAmount.toFixed(2)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};