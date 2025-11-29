import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

const logoDefinitiva = "/logo.png";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'splash' | 'dashboard'>('splash');
  const [isLoading, setIsLoading] = useState(true);

  // Animação de loading (3 segundos)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setTimeout(() => {
        setCurrentScreen('dashboard');
      }, 500);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // 🔴 TELA DE LOAD/SPLASH
  if (currentScreen === 'splash' || isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-blue-600 via-purple-700 to-indigo-800">
        {/* LOGO PRINCIPAL */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-12"
        >
          <img 
            src={logoDefinitiva} 
            alt="BudgetPro" 
            className="w-40 h-40 object-contain drop-shadow-2xl"
          />
        </motion.div>

        {/* TÍTULO */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-5xl md:text-6xl font-black text-white mb-6 text-center leading-tight"
        >
          Budget
          <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
            Pro
          </span>
        </motion.h1>

        {/* SUBTÍTULO */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-xl md:text-2xl text-blue-100/90 font-light mb-12 text-center max-w-2xl mx-auto px-4"
        >
          Seu assistente financeiro inteligente
        </motion.p>

        {/* ANIMAÇÃO DE PONTOS GIRATÓRIOS */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="relative w-32 h-32 mb-12"
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 bg-white/70 rounded-full"
              style={{
                left: '50%',
                top: '50%',
                transform: `translate(${-20 + Math.cos((i * 30) * Math.PI / 180) * 40}px, ${-20 + Math.sin((i * 30) * Math.PI / 180) * 40}px)`,
              }}
              animate={{ 
                opacity: [0.4, 1, 0.4], 
                scale: [0.8, 1.2, 0.8] 
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                delay: i * 0.1 
              }}
            />
          ))}
        </motion.div>

        {/* BARRA DE PROGRESSO */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="w-full max-w-md"
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-blue-100">Carregando...</span>
            <span className="text-sm font-medium text-blue-100">100%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 2.5, ease: "easeInOut" }}
            />
          </div>
        </motion.div>

        {/* RODAPÉ */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 2 }}
          className="mt-12 text-blue-200/80 text-sm font-light"
        >
          Feito com ❤️ para sua liberdade financeira
        </motion.p>
      </div>
    );
  }

  // 👉 PRÓXIMO PASSO: Dashboard (vamos fazer depois!)
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800">DASHBOARD</h1>
          <p className="mt-4 text-gray-600">Próximo passo!</p>
        </div>
      </div>
    </div>
  );
}
