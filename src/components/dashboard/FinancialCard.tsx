// Financial summary card component

import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface FinancialCardProps {
  title: string;
  value: number;
  isEditing: boolean;
  tempValue: string;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onTempValueChange: (value: string) => void;
  isDarkMode: boolean;
  valueColor?: string;
}

export const FinancialCard: React.FC<FinancialCardProps> = ({
  title,
  value,
  isEditing,
  tempValue,
  onEdit,
  onSave,
  onCancel,
  onTempValueChange,
  isDarkMode,
  valueColor
}) => {
  return (
    <Card className={`shadow-md border-0 rounded-xl ${isDarkMode ? 'bg-[#1e293b]' : ''}`}>
      <CardContent className="p-4">
        <div className="space-y-2">
          <p className={`text-xs uppercase ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {title}
          </p>
          <p 
            className={`text-xl font-semibold ${valueColor || (isDarkMode ? 'text-white' : 'text-gray-900')}`}
            style={valueColor ? { color: valueColor } : {}}
          >
            R$ {value.toFixed(2)}
          </p>
          {isEditing ? (
            <div className="space-y-2">
              <Input
                type="number"
                value={tempValue}
                onChange={(e) => onTempValueChange(e.target.value)}
                className={`h-9 text-sm ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}
              />
              <div className="flex gap-1">
                <Button 
                  onClick={onSave} 
                  size="sm" 
                  className="flex-1 h-8 text-xs"
                  style={{ backgroundColor: '#046BF4' }}
                >
                  Salvar
                </Button>
                <Button 
                  onClick={onCancel} 
                  variant="outline"
                  size="sm" 
                  className="flex-1 h-8 text-xs"
                >
                  ✕
                </Button>
              </div>
            </div>
          ) : (
            <Button
              onClick={onEdit}
              size="sm"
              className="w-full h-8 text-xs"
              style={{ backgroundColor: '#046BF4' }}
            >
              Modificar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
