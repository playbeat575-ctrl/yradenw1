import React from 'react';
import { Home, BarChart2, TrendingUp, Wallet, User } from 'lucide-react';

interface MobileNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentTab, setCurrentTab }) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0b0f19]/95 backdrop-blur-lg border-t border-slate-800 px-6 py-3 flex items-center justify-between">
      <button
        onClick={() => setCurrentTab('home')}
        className={`flex flex-col items-center space-y-1 ${currentTab === 'home' ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'}`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px]">Home</span>
      </button>

      <button
        onClick={() => setCurrentTab('markets')}
        className={`flex flex-col items-center space-y-1 ${currentTab === 'markets' ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'}`}
      >
        <BarChart2 className="w-5 h-5" />
        <span className="text-[10px]">Markets</span>
      </button>

      <button
        onClick={() => setCurrentTab('trade')}
        className={`flex flex-col items-center space-y-1 ${currentTab === 'trade' ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'}`}
      >
        <TrendingUp className="w-5 h-5" />
        <span className="text-[10px]">Trade</span>
      </button>

      <button
        onClick={() => setCurrentTab('wallet')}
        className={`flex flex-col items-center space-y-1 ${currentTab === 'wallet' ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'}`}
      >
        <Wallet className="w-5 h-5" />
        <span className="text-[10px]">Wallet</span>
      </button>

      <button
        onClick={() => setCurrentTab('profile')}
        className={`flex flex-col items-center space-y-1 ${currentTab === 'profile' ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'}`}
      >
        <User className="w-5 h-5" />
        <span className="text-[10px]">Profile</span>
      </button>
    </div>
  );
};
