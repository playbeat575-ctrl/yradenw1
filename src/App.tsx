import React, { useState, useEffect } from 'react';
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
import { Shield, Lock, CheckCircle2, User, Key, Bell, Globe, AlertCircle } from 'lucide-react';

function AppContent() {
  const [currentTab, setCurrentTab] = useState<string>(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash === 'storefront') return 'home';
    return hash || 'home';
  });
  const { user } = useAuth();

  // Sync tab with URL hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        if (hash === 'storefront') setCurrentTab('home');
        else setCurrentTab(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const changeTab = (tab: string) => {
    setCurrentTab(tab);
    window.location.hash = tab === 'home' ? 'storefront' : tab;
  };

  // Protected route check
  const protectedTabs = ['trade', 'wallet', 'portfolio', 'markets', 'admin', 'profile'];
  const isProtected = protectedTabs.includes(currentTab);

  return (
    <div className="min-h-screen bg-[#0B1220] text-[#E5E7EB] flex flex-col selection:bg-[#F7931A] selection:text-white">
      <Navbar currentTab={currentTab} setCurrentTab={changeTab} />

      <main className="flex-grow">
        {isProtected && !user ? (
          <div className="max-w-xl mx-auto px-4 py-20">
            <div className="bg-[#111C2E] border border-amber-500/40 rounded-3xl p-8 shadow-2xl text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 mx-auto flex items-center justify-center border border-amber-500/30">
                <Lock className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white">Platform Sections Are Gated</h2>
                <p className="text-sm text-slate-300 leading-relaxed">
                  All trading, markets, wallet, and institutional sections are closed. You must sign up using a valid Sub-Agent invitation code (<span className="font-mono text-amber-400">PB-AG001</span> through <span className="font-mono text-amber-400">PB-AG005</span>) or sign in to access your account.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => changeTab('register')}
                  className="w-full sm:w-auto bg-[#F7931A] hover:opacity-95 text-slate-950 font-bold px-6 py-3 rounded-xl text-sm shadow-lg shadow-[#F7931A]/20 transition-all border border-white/20"
                >
                  Sign Up with Invitation Code
                </button>
                <button
                  onClick={() => changeTab('login')}
                  className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all border border-white/10"
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {(currentTab === 'home' || currentTab === 'storefront') && <LandingPage setCurrentTab={changeTab} />}
            {currentTab === 'markets' && <MarketsPage setCurrentTab={changeTab} />}
            {currentTab === 'trade' && <TradePage />}
            {currentTab === 'wallet' && <WalletPage />}
            {currentTab === 'portfolio' && <PortfolioPage setCurrentTab={changeTab} />}
            {currentTab === 'login' && <AuthPage initialMode="login" setCurrentTab={changeTab} />}
            {currentTab === 'register' && <AuthPage initialMode="register" setCurrentTab={changeTab} />}
            {currentTab === 'admin' && <AdminDashboard />}
            {currentTab === 'profile' && (
              <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
                <div className="bg-[#111C2E] border border-white/10 rounded-3xl p-8 shadow-2xl space-y-6">
                  <h2 className="text-2xl font-bold text-white">Institutional Profile & Security</h2>
                  <div className="bg-[#0B1220] p-6 rounded-2xl border border-white/10 space-y-4">
                    <div className="flex justify-between items-center border-b border-white/10 pb-4">
                      <div>
                        <div className="text-xs text-slate-400">Account Name</div>
                        <div className="text-lg font-bold text-white">{user?.firstName} {user?.lastName}</div>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 text-xs font-mono border border-emerald-800">
                        {user?.kycStatus || 'PENDING'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/10 pb-4">
                      <div>
                        <div className="text-xs text-slate-400">Institutional Email</div>
                        <div className="text-sm font-mono text-white">{user?.email}</div>
                      </div>
                      <span className="text-xs text-[#00B8FF] font-mono">2FA Enabled (TOTP)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-xs text-slate-400">Sub-Agent Desk Assignment</div>
                        <div className="text-sm font-mono text-[#F7931A]">{user?.agentDesk}</div>
                      </div>
                      <span className="text-xs font-mono text-slate-500">Code: {user?.invitationCodeUsed}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <Footer setCurrentTab={changeTab} />
      <MobileNav currentTab={currentTab} setCurrentTab={changeTab} />
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
