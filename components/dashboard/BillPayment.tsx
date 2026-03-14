// Bill payment component

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { CreditCard } from 'lucide-react';

interface BillPaymentProps {
  currentBill: number;
  paymentAmount: string;
  remainingSalary: number;
  onPaymentAmountChange: (value: string) => void;
  onPayBill: () => void;
  isDarkMode: boolean;
}

export const BillPayment: React.FC<BillPaymentProps> = ({
  currentBill,
  paymentAmount,
  remainingSalary,
  onPaymentAmountChange,
  onPayBill,
  isDarkMode
}) => {
  return (
    <Card className={`shadow-md border-0 rounded-xl ${isDarkMode ? 'bg-[#1e293b]' : ''}`}>
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${isDarkMode ? 'text-white' : ''}`}>
          <CreditCard className="w-5 h-5" />
          Pagar Fatura do Cartão
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-purple-50'}`}>
          <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Fatura atual do cartão:
          </p>
          <p className="text-2xl font-bold text-purple-600">
            R$ {currentBill.toFixed(2)}
          </p>
        </div>

        <div className="space-y-3">
          <Label className={isDarkMode ? 'text-white' : ''}>Valor do Pagamento</Label>
          <Input
            type="number"
            placeholder="Digite o valor a pagar"
            value={paymentAmount}
            onChange={(e) => onPaymentAmountChange(e.target.value)}
            className={`h-12 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
          />
          <Button
            onClick={onPayBill}
            className="w-full h-12"
            style={{ backgroundColor: '#046BF4' }}
          >
            Confirmar Pagamento
          </Button>
        </div>

        <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
          <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Saldo disponível no salário:
          </p>
          <p className="text-xl font-bold text-blue-600">
            R$ {remainingSalary.toFixed(2)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
