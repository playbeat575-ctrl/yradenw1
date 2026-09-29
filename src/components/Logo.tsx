import React from 'react';

export const Logo: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const dim = size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-14 h-14' : 'w-10 h-10';
  
  return (
    <div className="flex items-center space-x-3 text-left">
      {/* Circular C Monogram with Candlesticks & Upward Arrow */}
      <div className={`${dim} rounded-2xl bg-gradient-to-tr from-[#0055FF] to-[#00B8FF] flex items-center justify-center shadow-lg shadow-[#0055FF]/30 border border-white/25 relative overflow-hidden flex-shrink-0`}>
        {/* C Curve representation */}
        <div className="absolute inset-1 rounded-xl border-2 border-white/30 border-r-transparent flex items-center justify-center">
          {/* Candlestick bars & Arrow inside */}
          <div className="flex items-end space-x-1 pt-1">
            <div className="w-1 h-3.5 bg-emerald-400 rounded-sm"></div>
            <div className="w-1 h-5 bg-red-500 rounded-sm"></div>
            <div className="w-1 h-6 bg-emerald-400 rounded-sm"></div>
          </div>
        </div>
      </div>
      <div>
        <div className="font-black text-white tracking-wider text-base sm:text-lg font-sans flex items-center space-x-1 uppercase leading-tight">
          <span className="text-white">coinbase</span>
        </div>
        <div className="flex items-center space-x-1.5 text-[10px] font-mono tracking-widest text-[#00B8FF] font-bold">
          <span>INC</span>
          <span className="text-white/30">•</span>
          <span className="text-white/90">TRADE</span>
        </div>
      </div>
    </div>
  );
};
