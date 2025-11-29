import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

const logoDefinitiva = "/logo.png";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'splash' | 'dashboard'>('splash');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setTimeout(() => {
        setCurrentScreen('dashboard');
      }, 500);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (currentScreen === 'splash' || isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-[#046bf3] via-[#1e40af] to-[#1e3a8a]">
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
          <span className="bg-gradient-to-r from-[#046bf3] to-[#22c55e] bg-clip-text text-transparent">
            Pro
          </span>
        </motion.h1>

        {/* SUBTÍTULO */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-xl md:text-2xl text-white/90 font-light mb-12 text-center max-w-2xl mx-auto px-4"
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
              className="absolute w-3 h-3 bg-[#046bf3]/80 rounded-full"
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
            <span className="text-sm font-medium text-white/90">Carregando...</span>
            <span className="text-sm font-medium text-white/90">100%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-[#046bf3] via-[#22c55e] to-[#86efac] h-2 rounded-full"
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
          className="mt-12 text-white/70 text-sm font-light"
        >
          Feito com ❤️ para sua liberdade financeira
        </motion.p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#046bf3]/5 to-blue-500/5">
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#046bf3]">SPLASH OK! 🎉</h1>
          <p className="mt-4 text-gray-600">Cor #046BF3 aplicada!</p>
          <p className="mt-2 text-sm text-gray-500">PRONTO PARA DASHBOARD</p>
        </div>
      </div>
    </div>
  );
}
