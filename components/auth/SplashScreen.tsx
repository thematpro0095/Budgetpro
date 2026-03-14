// Splash screen component

import React from 'react';
import { motion } from 'motion/react';
import logoImg from 'figma:asset/43f451cbbeb300f82cfe6b3725163406c6067d4e.png';

export const SplashScreen: React.FC = () => {
  return (
    <motion.div 
      className="min-h-screen flex flex-col items-center justify-center px-4" 
      style={{ backgroundColor: '#046BF4' }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Logo mark */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="mb-8 flex flex-col items-center gap-3"
      >
        <img
          src={logoImg}
          alt="BudgetPro"
          className="w-40 h-40 rounded-3xl shadow-2xl object-contain"
        />
        <p className="text-white/70 text-sm mt-1">Gestão financeira inteligente</p>
      </motion.div>

      {/* Spinner */}
      <div className="relative w-16 h-16 flex items-center justify-center">
        {Array.from({ length: 12 }).map((_, index) => {
          const angle = (index * 360) / 12;
          const radian = (angle * Math.PI) / 180;
          const radius = 28;
          const x = Math.cos(radian) * radius;
          const y = Math.sin(radian) * radius;
          return (
            <motion.div
              key={index}
              className="absolute w-2 h-2 rounded-full bg-white"
              style={{
                left: '50%',
                top: '50%',
                transform: `translate(${x - 6}px, ${y - 6}px)`,
              }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: index * 0.1,
                ease: 'easeInOut',
              }}
            />
          );
        })}
      </div>

      <motion.p
        className="mt-8 text-white/80 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        Carregando seu app financeiro...
      </motion.p>
    </motion.div>
  );
};
