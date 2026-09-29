import React from 'react';
import { Shield, Lock, ExternalLink } from 'lucide-react';

export const Footer: React.FC<{ setCurrentTab: (tab: string) => void }> = ({ setCurrentTab }) => {
  return (
    <footer className="bg-[#05070A] border-t border-white/10 text-[#D9E2EC]/70 py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#0066FF] to-[#00B8FF] flex items-center justify-center border border-white/20">
              <span className="text-white font-bold font-mono text-sm">BX</span>
            </div>
            <span className="font-bold text-white text-lg tracking-wider font-sans">BLOCKEXCHANGE</span>
          </div>
          <p className="text-xs text-[#D9E2EC]/60 leading-relaxed">
            BlockExchange is an enterprise-grade cryptocurrency and digital asset trading platform built for professional traders, institutions, and modern investors.
          </p>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#22C55E]">
            <Shield className="w-4 h-4" />
            <span>256-Bit Vault Encryption & Proof of Reserves (1:1)</span>
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold text-sm mb-4">Markets & Trading</h4>
          <ul className="space-y-2 text-xs">
            <li><button onClick={() => setCurrentTab('markets')} className="hover:text-white transition-colors">Spot & Futures Pairs</button></li>
            <li><button onClick={() => setCurrentTab('trade')} className="hover:text-white transition-colors flex items-center space-x-1"><span>High-Speed Trading</span><ExternalLink className="w-3 h-3" /></button></li>
            <li><button onClick={() => setCurrentTab('markets')} className="hover:text-white transition-colors">Watchlist & Alerts</button></li>
            <li><button onClick={() => setCurrentTab('portfolio')} className="hover:text-white transition-colors">Asset Allocations</button></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold text-sm mb-4">Wallet & Accounts</h4>
          <ul className="space-y-2 text-xs">
            <li><button onClick={() => setCurrentTab('wallet')} className="hover:text-white transition-colors">Instant Crypto Deposit</button></li>
            <li><button onClick={() => setCurrentTab('wallet')} className="hover:text-white transition-colors">Fast Wire & Blockchain Withdraw</button></li>
            <li><button onClick={() => setCurrentTab('portfolio')} className="hover:text-white transition-colors">Ledger History</button></li>
            <li><button onClick={() => setCurrentTab('profile')} className="hover:text-white transition-colors">VIP Tiers & Verification</button></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold text-sm mb-4">Institutional Staff & Compliance</h4>
          <ul className="space-y-2 text-xs">
            <li><button onClick={() => setCurrentTab('admin')} className="hover:text-white transition-colors text-[#F5B942] font-medium">Admin & Desk Portal</button></li>
            <li><button onClick={() => setCurrentTab('register')} className="hover:text-white transition-colors">Institutional Onboarding</button></li>
            <li className="text-[#D9E2EC]/40 font-mono">Institutional Custody License #BX-9941</li>
            <li className="text-[#D9E2EC]/40 font-mono">Official Support: support@blockexchange.io</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#D9E2EC]/40">
        <div>© 2026 BlockExchange Trading Platform. All rights reserved. TRADE • INVEST • GROW.</div>
        <div className="flex space-x-6 mt-4 sm:mt-0">
          <a href="#" className="hover:text-white">Privacy Policy</a>
          <a href="#" className="hover:text-white">Terms of Service</a>
          <a href="#" className="hover:text-white">Risk Disclosure</a>
          <a href="#" className="hover:text-white">API Documentation</a>
        </div>
      </div>
    </footer>
  );
};
