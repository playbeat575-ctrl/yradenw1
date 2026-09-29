import React from 'react';
import { Shield, Bell, User, BarChart3, Wallet, Cpu, Settings, LogOut, ArrowRightLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Logo } from './Logo';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab }) => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-[#05070A]/90 backdrop-blur-md border-b border-white/10">
      {/* Top Status Bar */}
      <div className="bg-[#0E131B] px-4 py-1 text-xs text-[#D9E2EC]/70 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse"></span>
            <span className="text-[#22C55E] font-mono">Matching Engine: Operational (0.32ms)</span>
          </span>
          <span className="hidden md:inline text-white/20">|</span>
          <span className="hidden md:flex items-center space-x-1 font-mono text-[#D9E2EC]">
            <Shield className="w-3.5 h-3.5 text-[#00B8FF]" />
            <span>Block Confirmations: 6/6 Confirmed</span>
          </span>
        </div>
        <div className="flex items-center space-x-3 font-mono text-[#D9E2EC]">
          <span>UTC {new Date().toISOString().substring(11, 19)}</span>
          <span className="hidden sm:inline bg-[#0066FF]/20 text-[#00B8FF] px-2 py-0.5 rounded text-[10px] font-semibold border border-[#0066FF]/40">
            Institutional Custody 100% Backed
          </span>
        </div>
      </div>

      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-8">
          <button 
            onClick={() => setCurrentTab('home')} 
            className="flex items-center space-x-3 text-left focus:outline-none group"
          >
            <Logo size="md" />
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-1 font-medium text-sm">
            <button
              onClick={() => setCurrentTab('home')}
              className={`px-3 py-2 rounded-lg transition-colors ${currentTab === 'home' ? 'bg-[#0066FF]/20 text-[#00B8FF] border border-[#0066FF]/40' : 'text-[#D9E2EC] hover:text-white hover:bg-white/5'}`}
            >
              Overview
            </button>
            <button
              onClick={() => setCurrentTab('markets')}
              className={`px-3 py-2 rounded-lg transition-colors ${currentTab === 'markets' ? 'bg-[#0066FF]/20 text-[#00B8FF] border border-[#0066FF]/40' : 'text-[#D9E2EC] hover:text-white hover:bg-white/5'}`}
            >
              Markets
            </button>
            <button
              onClick={() => setCurrentTab('trade')}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center space-x-1.5 ${currentTab === 'trade' ? 'bg-[#0066FF]/20 text-[#00B8FF] border border-[#0066FF]/40' : 'text-[#D9E2EC] hover:text-white hover:bg-white/5'}`}
            >
              <BarChart3 className="w-4 h-4 text-[#00B8FF]" />
              <span>Trading Terminal</span>
            </button>
            <button
              onClick={() => setCurrentTab('portfolio')}
              className={`px-3 py-2 rounded-lg transition-colors ${currentTab === 'portfolio' ? 'bg-[#0066FF]/20 text-[#00B8FF] border border-[#0066FF]/40' : 'text-[#D9E2EC] hover:text-white hover:bg-white/5'}`}
            >
              Portfolio
            </button>
            <button
              onClick={() => setCurrentTab('wallet')}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center space-x-1.5 ${currentTab === 'wallet' ? 'bg-[#0066FF]/20 text-[#00B8FF] border border-[#0066FF]/40' : 'text-[#D9E2EC] hover:text-white hover:bg-white/5'}`}
            >
              <Wallet className="w-4 h-4 text-[#22C55E]" />
              <span>Wallet</span>
            </button>
            {user?.role === 'SUPER_ADMIN' && (
              <button
                onClick={() => setCurrentTab('admin')}
                className={`px-3 py-2 rounded-lg transition-colors flex items-center space-x-1.5 bg-[#F5B942]/10 text-[#F5B942] border border-[#F5B942]/30 hover:bg-[#F5B942]/20`}
              >
                <Cpu className="w-4 h-4" />
                <span>Admin Terminal</span>
              </button>
            )}
          </nav>
        </div>

        {/* Right User Actions */}
        <div className="flex items-center space-x-3">
          {user ? (
            <div className="flex items-center space-x-3">
              <div className="hidden lg:block text-right">
                <div className="text-xs font-semibold text-white">{user.firstName} {user.lastName}</div>
                <div className="text-[10px] text-[#22C55E] font-mono">${user.balanceUSDT.toLocaleString('en-US', { minimumFractionDigits: 2 })} USDT</div>
              </div>
              <button
                onClick={() => setCurrentTab('wallet')}
                className="bg-[#0066FF] hover:bg-[#0055EE] text-white font-medium px-4 py-2 rounded-lg text-sm shadow-lg shadow-[#0066FF]/30 transition-all flex items-center space-x-1.5 border border-[#00B8FF]/40"
              >
                <ArrowRightLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Deposit / Withdraw</span>
              </button>
              <button
                onClick={() => setCurrentTab('profile')}
                className="p-2 rounded-lg bg-[#0E131B] hover:bg-white/10 text-[#D9E2EC] transition-colors border border-white/10"
                title="Profile & Security"
              >
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={logout}
                className="p-2 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-800/40 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentTab('login')}
                className="text-[#D9E2EC] hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => setCurrentTab('register')}
                className="bg-gradient-to-r from-[#0066FF] to-[#00B8FF] hover:opacity-95 text-white font-semibold px-5 py-2 rounded-lg text-sm shadow-lg shadow-[#0066FF]/30 transition-all border border-white/20"
              >
                Open Account
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
