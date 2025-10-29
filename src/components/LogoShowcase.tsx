import React from 'react';
import { BudgetProLogo, BudgetProColorGuide } from './BudgetProLogo';

export const LogoShowcase: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl mb-8 text-center" style={{ color: '#2A9DF4' }}>
          BudgetPro - Logo Vetorial
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Logo Principal */}
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
            <h2 className="text-xl mb-6">Logo Principal</h2>
            <BudgetProLogo width={200} height={200} />
            <p className="text-sm text-gray-600 mt-4">200x200px - Fundo #2A9DF4</p>
          </div>
          
          {/* Versões Menores */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-xl mb-6 text-center">Tamanhos Variados</h2>
            <div className="flex items-center justify-around">
              <div className="text-center">
                <BudgetProLogo width={120} height={120} />
                <p className="text-xs text-gray-600 mt-2">120px</p>
              </div>
              <div className="text-center">
                <BudgetProLogo width={80} height={80} />
                <p className="text-xs text-gray-600 mt-2">80px</p>
              </div>
              <div className="text-center">
                <BudgetProLogo width={48} height={48} />
                <p className="text-xs text-gray-600 mt-2">48px</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Elementos Detalhados */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Circle */}
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <h3 className="mb-4">Círculo (logo/circle)</h3>
            <svg width="120" height="120" viewBox="0 0 200 200" className="mx-auto">
              <rect width="200" height="200" rx="20" fill="#2A9DF4"/>
              <circle cx="100" cy="80" r="45" stroke="white" strokeWidth="12" fill="none"/>
            </svg>
            <p className="text-xs text-gray-600 mt-2">Stroke branco 12px</p>
          </div>
          
          {/* Bars */}
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <h3 className="mb-4">Colunas (logo/bar-*)</h3>
            <svg width="120" height="120" viewBox="0 0 200 200" className="mx-auto">
              <rect width="200" height="200" rx="20" fill="#2A9DF4"/>
              <rect x="75" y="90" width="12" height="20" rx="6" fill="white"/>
              <rect x="94" y="85" width="12" height="30" rx="6" fill="white"/>
              <rect x="113" y="75" width="12" height="40" rx="6" fill="white"/>
            </svg>
            <p className="text-xs text-gray-600 mt-2">Crescimento progressivo</p>
          </div>
          
          {/* Arrow */}
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <h3 className="mb-4">Seta (logo/arrow)</h3>
            <svg width="120" height="120" viewBox="0 0 200 200" className="mx-auto">
              <rect width="200" height="200" rx="20" fill="#2A9DF4"/>
              <path d="M70 95 Q85 70 120 65" stroke="white" strokeWidth="10" fill="none" strokeLinecap="round"/>
              <path d="M115 60 L125 65 L115 70 Z" fill="white"/>
            </svg>
            <p className="text-xs text-gray-600 mt-2">Curva ascendente</p>
          </div>
        </div>
        
        {/* Guia de Cores */}
        <div className="flex justify-center">
          <BudgetProColorGuide />
        </div>
        
        {/* Especificações Técnicas */}
        <div className="mt-12 bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl mb-6 text-center">Especificações Técnicas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg mb-4" style={{ color: '#2A9DF4' }}>Elementos Vetoriais</h3>
              <ul className="space-y-2 text-sm">
                <li><strong>Frame principal:</strong> logo_vector (200x200px)</li>
                <li><strong>Fundo:</strong> Retângulo arredondado #2A9DF4</li>
                <li><strong>Círculo:</strong> Stroke branco 12px, sem preenchimento</li>
                <li><strong>Colunas:</strong> 3 barras com cantos arredondados</li>
                <li><strong>Seta:</strong> Curva ascendente com ponta triangular</li>
                <li><strong>Texto:</strong> "BUDGETPRO" em Inter/Montserrat Bold</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg mb-4" style={{ color: '#2A9DF4' }}>Layers Organizados</h3>
              <ul className="space-y-2 text-sm font-mono">
                <li>📁 logo_vector</li>
                <li className="ml-4">└── logo/circle</li>
                <li className="ml-4">└── logo/bar-1</li>
                <li className="ml-4">└── logo/bar-2</li>
                <li className="ml-4">└── logo/bar-3</li>
                <li className="ml-4">└── logo/arrow</li>
                <li className="ml-4">└── logo/text</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoShowcase;