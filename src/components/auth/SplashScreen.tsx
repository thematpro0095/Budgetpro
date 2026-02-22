// Splash screen component

import React from 'react';
import { motion } from 'motion/react';
import Logo from 'figma:asset/525267ee3661960fa57269b0150bd54d146c81ce.png';

export const SplashScreen: React.FC = () => {
  return (
    <motion.div 
      className="min-h-screen flex flex-col items-center justify-center px-4" 
      style={{ backgroundColor: '#046BF4' }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="mb-8">
        <img 
          src={Logo} 
          alt="BudgetPro Logo" 
          className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 object-contain"
        />
      </div>

      <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center">
        {Array.from({ length: 12 }).map((_, index) => {
          const angle = (index * 360) / 12;
          const radian = (angle * Math.PI) / 180;
          const radius = 28;
          const x = Math.cos(radian) * radius;
          const y = Math.sin(radian) * radius;
          
          return (
            <motion.div
              key={index}
              className="absolute w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-white"
              style={{
                left: '50%',
                top: '50%',
                transform: `translate(${x - 6}px, ${y - 6}px)`,
              }}
              animate={{
                opacity: [0.3, 1, 0.3]
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: index * 0.1,
                ease: "easeInOut"
              }}
            />
          );
        })}
      </div>

      <motion.div 
        className="mt-8 text-center hidden md:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <p className="text-white/80 text-lg">Carregando seu app financeiro...</p>
      </motion.div>
    </motion.div>
  );
};