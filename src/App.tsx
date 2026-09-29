import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { MobileNav } from './components/MobileNav';
import { LandingPage } from './pages/LandingPage';
import { MarketsPage } from './pages/MarketsPage';
import { TradePage } from './pages/TradePage';
import { WalletPage } from './pages/WalletPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { AuthPage } from './pages/AuthPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { Shield, Lock, CheckCircle2, User, Key, Bell, Globe } from 'lucide-react';

function AppContent() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      <main className="flex-grow">
        {currentTab === 'home' && <LandingPage setCurrentTab={setCurrentTab} />}
        {currentTab === 'markets' && <MarketsPage setCurrentTab={setCurrentTab} />}
        {currentTab === 'trade' && <TradePage />}
        {currentTab === 'wallet' && <WalletPage />}
        {currentTab === 'portfolio' && <PortfolioPage setCurrentTab={setCurrentTab} />}
        {currentTab === 'login' && <AuthPage initialMode="login" setCurrentTab={setCurrentTab} />}
        {currentTab === 'register' && <AuthPage initialMode="register" setCurrentTab={setCurrentTab} />}
        {currentTab === 'admin' && <AdminDashboard />}
        {currentTab === 'profile' && (
          <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
            <div className="bg-[#111827] border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
              <h2 className="text-2xl font-bold text-white">Institutional Profile & Security</h2>
              <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                  <div>
                    <div className="text-xs text-slate-400">Account Name</div>
                    <div className="text-lg font-bold text-white">{user?.firstName} {user?.lastName}</div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 text-xs font-mono border border-emerald-800">
                    {user?.kycStatus || 'PENDING'}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                  <div>
                    <div className="text-xs text-slate-400">Institutional Email</div>
                    <div className="text-sm font-mono text-white">{user?.email}</div>
                  </div>
                  <span className="text-xs text-blue-400 font-mono">2FA Enabled (TOTP)</span>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-xs text-slate-400">Sub-Agent Desk Assignment</div>
                    <div className="text-sm font-mono text-amber-400">{user?.agentDesk}</div>
                  </div>
                  <span className="text-xs font-mono text-slate-500">Code: {user?.invitationCodeUsed}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer setCurrentTab={setCurrentTab} />
      <MobileNav currentTab={currentTab} setCurrentTab={setCurrentTab} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
