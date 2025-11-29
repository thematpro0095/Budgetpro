import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

const logoDefinitiva = "/logo.png";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'splash' | 'dashboard'>('splash');
  const [progress, setProgress] = useState(0);

  // 12 SEGUNDOS COM % ANIMADO
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setCurrentScreen('dashboard'), 500);
          return 100;
        }
        return prev + 8.33; // 100% / 12s = 8.33% por 100ms
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  if (currentScreen === 'splash') {
    return (
      <div 
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          background: '#046bf3' // 👈 FUNDO EXATO #046BF3
        }}
      >
        {/* LOGO */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          style={{ marginBottom: '3rem' }}
        >
          <img 
            src={logoDefinitiva} 
            alt="BudgetPro" 
            style={{ width: '160px', height: '160px' }} 
          />
        </motion.div>

        {/* TÍTULO */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          style={{ 
            fontSize: '4.5rem', 
            fontWeight: '900', 
            color: 'white',
            marginBottom: '1.5rem',
            textAlign: 'center',
            lineHeight: '1'
          }}
        >
          Budget
          <span 
            style={{
              background: 'linear-gradient(90deg, #046bf3 0%, #22c55e 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: '900'
            }}
          >
            Pro
          </span>
        </motion.h1>

        {/* SUBTÍTULO */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          style={{ 
            fontSize: '1.75rem', 
            color: 'rgba(255,255,255,0.95)', 
            fontWeight: '300',
            marginBottom: '3rem',
            textAlign: 'center',
            maxWidth: '32rem',
            padding: '0 1rem'
          }}
        >
          Seu melhor aplicativo para finanças e economia
        </motion.p>

        {/* ✅ 12 BOLINHAS BRANCAS */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 1 }}
          style={{ 
            position: 'relative', 
            width: '128px', 
            height: '128px', 
            marginBottom: '3rem' 
          }}
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              style={{
                position: 'absolute',
                width: '16px',
                height: '16px',
                backgroundColor: 'white', // 👈 BRANCAS!
                borderRadius: '50%',
                left: '50%',
                top: '50%',
                marginLeft: `${-25 + Math.cos((i * 30) * Math.PI / 180) * 50}px`,
                marginTop: `${-25 + Math.sin((i * 30) * Math.PI / 180) * 50}px`,
              }}
              animate={{ 
                opacity: [0.3, 1, 0.3], 
                scale: [0.7, 1.3, 0.7] 
              }}
              transition={{ 
                duration: 1.8, 
                repeat: Infinity, 
                delay: i * 0.1 
              }}
            />
          ))}
        </motion.div>

        {/* BARRA + % ANIMADO */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          style={{ width: '100%', maxWidth: '480px' }}
        >
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '0.5rem' 
          }}>
            <span style={{ 
              fontSize: '0.875rem', 
              fontWeight: '500', 
              color: 'white' 
            }}>
              Carregando...
            </span>
            <motion.span 
              style={{ 
                fontSize: '0.875rem', 
                fontWeight: '500', 
                color: 'white' 
              }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              {Math.round(progress)}%
            </motion.span>
          </div>
          <div style={{ 
            width: '100%', 
            background: 'rgba(255,255,255,0.2)', 
            borderRadius: '9999px', 
            height: '8px',
            overflow: 'hidden'
          }}>
            <motion.div
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, #046bf3 0%, #22c55e 100%)',
                borderRadius: '9999px',
                width: '0%'
              }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#046bf3',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ textAlign: 'center', color: 'white' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '900' }}>
          ✅ SPLASH PERFEITO!
        </h1>
        <p style={{ marginTop: '1.5rem', fontSize: '1.25rem' }}>
          Bolinhas brancas + #046BF3 + % animado
        </p>
      </div>
    );
  }
}
