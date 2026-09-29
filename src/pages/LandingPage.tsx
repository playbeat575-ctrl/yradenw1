import React, { useEffect, useState } from 'react';
import { Shield, Zap, TrendingUp, Cpu, Lock, ArrowRight, CheckCircle2, ChevronRight, BarChart3 } from 'lucide-react';
import { MarketItem } from '../types';
import { Logo } from '../components/Logo';

export const LandingPage: React.FC<{ setCurrentTab: (tab: string) => void }> = ({ setCurrentTab }) => {
  const [markets, setMarkets] = useState<MarketItem[]>([]);

  useEffect(() => {
    fetch('/api/markets')
      .then(res => res.json())
      .then(json => {
        if (json.success) setMarkets(json.data);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-16 pb-16 bg-[#05070A] text-[#D9E2EC]">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0E131B] to-[#05070A] border-b border-white/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 bg-[#0066FF]/20 border border-[#0066FF]/40 px-3 py-1 rounded-full text-xs font-mono text-[#00B8FF]">
              <span className="w-2 h-2 rounded-full bg-[#00B8FF] animate-ping"></span>
              <span>Coinbase Inc. Trade Institutional Liquidity & Trading Terminal</span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-ext500 text-white tracking-tight leading-none font-sans">
              Trade Digital Assets With <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0066FF] to-[#00B8FF]">Institutional Precision</span>
            </h1>
            
            <p className="text-base sm:text-lg text-[#D9E2EC]/80 max-w-2xl leading-relaxed">
              Enterprise-grade cryptocurrency and digital asset trading platform built for professional traders, institutions, and modern investors. Access sub-second execution, advanced technical indicators, and high-yield option contracts.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
              <button
                onClick={() => setCurrentTab('trade')}
                className="bg-gradient-to-r from-[#0066FF] to-[#00B8FF] hover:opacity-95 text-white font-semibold px-8 py-3.5 rounded-xl shadow-xl shadow-[#0066FF]/30 transition-all flex items-center justify-center space-x-2 text-base border border-white/20"
              >
                <span>Launch Trading Terminal</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentTab('wallet')}
                className="bg-[#0E131B] hover:bg-white/10 text-white border border-white/10 font-semibold px-8 py-3.5 rounded-xl transition-all flex items-center justify-center space-x-2 text-base font-mono"
              >
                <span>Fresh Account ($0.00 USDT)</span>
              </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10">
              <div>
                <div className="text-xs text-[#D9E2EC]/60">24h Trading Volume</div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-white mt-1">$4,818,900,000+</div>
              </div>
              <div>
                <div className="text-xs text-[#D9E2EC]/60">Order Latency</div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-[#22C55E] mt-1">0.32 ms</div>
              </div>
              <div>
                <div className="text-xs text-[#D9E2EC]/60">Reserve Backing</div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-[#F5B942] mt-1">100% 1:1 Proof</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-[#0E131B] border border-white/15 rounded-2xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-xl">
              <div className="absolute top-0 right-0 bg-[#0066FF]/20 text-[#00B8FF] text-xs px-3 py-1 rounded-bl-xl font-mono border-b border-l border-[#0066FF]/40">
                LIVE TERMINAL FEED
              </div>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-[#00B8FF]" />
                <span>Market Highlights</span>
              </h3>
              <div className="space-y-3">
                {markets.slice(0, 4).map(m => (
                  <div key={m.symbol} onClick={() => setCurrentTab('trade')} className="bg-[#05070A] p-3 rounded-xl border border-white/10 hover:border-[#0066FF]/60 transition-all cursor-pointer flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white text-sm">{m.symbol}</div>
                      <div className="text-[10px] text-[#D9E2EC]/60">{m.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-semibold text-white text-sm">${m.price.toLocaleString()}</div>
                      <div className={`text-xs font-mono ${m.change24h >= 0 ? 'text-[#22C55E]' : 'text-red-400'}`}>
                        {m.change24h >= 0 ? '+' : ''}{m.change24h}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setCurrentTab('markets')}
                className="w-full mt-4 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center space-x-1 border border-white/10"
              >
                <span>View All Markets</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-white tracking-tight">Institutional Architecture & Product Suite</h2>
          <p className="text-[#D9E2EC]/70 mt-2">Built for professional traders, liquidity desks, and high-frequency execution pipelines.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#0E131B] border border-white/10 rounded-2xl p-6 hover:border-[#0066FF]/60 transition-all shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-[#0066FF]/20 text-[#00B8FF] flex items-center justify-center mb-4 border border-[#0066FF]/40">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Yield Contract Options</h3>
            <p className="text-[#D9E2EC]/70 text-sm leading-relaxed">
              30s, 60s, and 120s binary forecast contracts with up to 85% payouts and instant automated settlement.
            </p>
          </div>

          <div className="bg-[#0E131B] border border-white/10 rounded-2xl p-6 hover:border-[#0066FF]/60 transition-all shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center mb-4 border border-purple-500/40">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Sub-Agent Broker Network</h3>
            <p className="text-[#D9E2EC]/70 text-sm leading-relaxed">
              Exclusive invitation codes connect certified sub-agents to isolated customer books, earning spread revenue shares.
            </p>
          </div>

          <div className="bg-[#0E131B] border border-white/10 rounded-2xl p-6 hover:border-[#0066FF]/60 transition-all shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-[#F5B942]/20 text-[#F5B942] flex items-center justify-center mb-4 border border-[#F5B942]/40">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Super Admin Operations Desk</h3>
            <p className="text-[#D9E2EC]/70 text-sm leading-relaxed">
              Enterprise management suite with balance adjustments, withdrawal verification, risk freezes, and real-time chat support.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
