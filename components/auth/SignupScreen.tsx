// Signup screen component

import React from 'react';
import { motion } from 'motion/react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Mail, Lock, User } from 'lucide-react';
import { Screen } from '../../types';

interface SignupScreenProps {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onSignup: () => void;
  onNavigate: (screen: Screen) => void;
  isDarkMode: boolean;
}

export const SignupScreen: React.FC<SignupScreenProps> = ({
  name,
  email,
  password,
  confirmPassword,
  onNameChange,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onSignup,
  onNavigate,
  isDarkMode
}) => {
  return (
    <motion.div 
      className={`min-h-screen ${isDarkMode ? '' : ''}`}
      style={isDarkMode ? { background: 'linear-gradient(to bottom, #0f172a, #1e3a8a, #000000)' } : { background: 'linear-gradient(to bottom, #046BF4, white)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="px-4 py-8 pt-20"
      >
        <div className="max-w-sm mx-auto md:max-w-md lg:max-w-lg">
          <div className="text-center mb-6">
            <h2 className={`text-2xl md:text-3xl lg:text-4xl mb-2 font-bold ${isDarkMode ? 'text-white' : 'text-white'}`}>
              Crie sua conta
            </h2>
            <p className={`text-sm md:text-base px-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-200'}`}>
              Cadastre-se para começar a gerenciar suas finanças
            </p>
          </div>

          <Card className={`shadow-xl border-0 rounded-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-white/95 backdrop-blur-sm'}`}>
            <CardContent className="p-5 md:p-6 space-y-4">
              <div className="space-y-4">
                <div className="relative">
                  <User className={`absolute left-3 top-3 h-5 w-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  <Input
                    type="text"
                    placeholder="Digite seu nome completo"
                    value={name}
                    onChange={(e) => onNameChange(e.target.value)}
                    className={`pl-11 h-12 rounded-xl focus:border-sky-400 focus:ring-2 focus:ring-sky-200 transition-all ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400' : 'border-gray-200'}`}
                  />
                </div>
                <div className="relative">
                  <Mail className={`absolute left-3 top-3 h-5 w-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  <Input
                    type="email"
                    placeholder="Digite seu email"
                    value={email}
                    onChange={(e) => onEmailChange(e.target.value)}
                    className={`pl-11 h-12 rounded-xl focus:border-sky-400 focus:ring-2 focus:ring-sky-200 transition-all ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400' : 'border-gray-200'}`}
                  />
                </div>
                <div className="relative">
                  <Lock className={`absolute left-3 top-3 h-5 w-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  <Input
                    type="password"
                    placeholder="Digite sua senha (mín. 6 caracteres)"
                    value={password}
                    onChange={(e) => onPasswordChange(e.target.value)}
                    className={`pl-11 h-12 rounded-xl focus:border-sky-400 focus:ring-2 focus:ring-sky-200 transition-all ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400' : 'border-gray-200'}`}
                  />
                </div>
                <div className="relative">
                  <Lock className={`absolute left-3 top-3 h-5 w-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  <Input
                    type="password"
                    placeholder="Confirme sua senha"
                    value={confirmPassword}
                    onChange={(e) => onConfirmPasswordChange(e.target.value)}
                    className={`pl-11 h-12 rounded-xl focus:border-sky-400 focus:ring-2 focus:ring-sky-200 transition-all ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400' : 'border-gray-200'}`}
                  />
                </div>
              </div>

              <Button
                onClick={onSignup}
                className="w-full h-12 rounded-xl text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 hover:brightness-110"
                style={{ backgroundColor: '#046BF4' }}
              >
                Criar Conta
              </Button>

              <div className="text-center pt-4">
                <button
                  onClick={() => onNavigate('login')}
                  className={`text-sm transition-colors hover:brightness-110 ${isDarkMode ? 'text-sky-400' : ''}`}
                  style={!isDarkMode ? { color: '#046BF4' } : {}}
                >
                  Já tem uma conta? <span className="underline">Fazer login</span>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </motion.div>
  );
};
