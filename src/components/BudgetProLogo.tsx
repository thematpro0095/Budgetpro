import React from 'react';

interface BudgetProLogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export const BudgetProLogo: React.FC<BudgetProLogoProps> = ({ 
  width = 200, 
  height = 200, 
  className = "" 
}) => {
  return (
    <div className={`logo_vector ${className}`}>
      <svg 
        width={width} 
        height={height} 
        viewBox="0 0 200 200" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background */}
        <rect width="200" height="200" rx="20" fill="#2A9DF4"/>
        
        {/* Circle - logo/circle */}
        <g id="logo/circle">
          <circle 
            cx="100" 
            cy="80" 
            r="45" 
            stroke="white" 
            strokeWidth="12" 
            fill="none"
          />
        </g>
        
        {/* Bars - logo/bar-1, logo/bar-2, logo/bar-3 */}
        <g id="logo/bars">
          <g id="logo/bar-1">
            <rect 
              x="75" 
              y="90" 
              width="12" 
              height="20" 
              rx="6" 
              fill="white"
            />
          </g>
          <g id="logo/bar-2">
            <rect 
              x="94" 
              y="85" 
              width="12" 
              height="30" 
              rx="6" 
              fill="white"
            />
          </g>
          <g id="logo/bar-3">
            <rect 
              x="113" 
              y="75" 
              width="12" 
              height="40" 
              rx="6" 
              fill="white"
            />
          </g>
        </g>
        
        {/* Arrow - logo/arrow */}
        <g id="logo/arrow">
          <path 
            d="M70 95 Q85 70 120 65" 
            stroke="white" 
            strokeWidth="10" 
            fill="none" 
            strokeLinecap="round"
          />
          {/* Arrow tip */}
          <path 
            d="M115 60 L125 65 L115 70 Z" 
            fill="white"
          />
        </g>
        
        {/* Text - logo/text */}
        <g id="logo/text">
          <text 
            x="100" 
            y="155" 
            textAnchor="middle" 
            fill="white" 
            fontSize="18" 
            fontWeight="bold" 
            fontFamily="Inter, Montserrat, sans-serif"
            letterSpacing="2px"
          >
            BUDGETPRO
          </text>
        </g>
      </svg>
    </div>
  );
};

// Color Guide Component
export const BudgetProColorGuide: React.FC = () => {
  return (
    <div className="color-guide p-6 bg-white rounded-xl shadow-lg max-w-md">
      <h3 className="text-xl mb-4">BudgetPro - Guia de Cores</h3>
      
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div 
            className="w-8 h-8 rounded-lg border-2 border-gray-200" 
            style={{ backgroundColor: '#2A9DF4' }}
          ></div>
          <div>
            <p className="font-medium">Primary</p>
            <code className="text-sm text-gray-600">#2A9DF4</code>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div 
            className="w-8 h-8 rounded-lg border-2 border-gray-200" 
            style={{ backgroundColor: '#001F54' }}
          ></div>
          <div>
            <p className="font-medium">Background</p>
            <code className="text-sm text-gray-600">#001F54</code>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div 
            className="w-8 h-8 rounded-lg border-2 border-gray-200" 
            style={{ backgroundColor: '#FFFFFF' }}
          ></div>
          <div>
            <p className="font-medium">White Elements</p>
            <code className="text-sm text-gray-600">#FFFFFF</code>
          </div>
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h4 className="font-medium mb-3">Layer Structure:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• <code>logo/circle</code> - Círculo externo</li>
          <li>• <code>logo/bar-1</code> - Coluna esquerda</li>
          <li>• <code>logo/bar-2</code> - Coluna meio</li>
          <li>• <code>logo/bar-3</code> - Coluna direita</li>
          <li>• <code>logo/arrow</code> - Seta curva</li>
          <li>• <code>logo/text</code> - Texto BUDGETPRO</li>
        </ul>
      </div>
    </div>
  );
};

export default BudgetProLogo;