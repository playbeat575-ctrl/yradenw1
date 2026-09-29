import React from 'react';
import { PieChart, Shield, TrendingUp, DollarSign } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const PortfolioPage: React.FC<{ setCurrentTab: (tab: string) => void }> = ({ setCurrentTab }) => {
  const { user } = useAuth();
  const totalEquity = (user?.balanceUSDT || 0) + (user?.frozenUSDT || 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Portfolio & Asset Allocation</h1>
        <p className="text-slate-400 text-sm mt-1">Comprehensive overview of institutional holdings, unrealized gains, and asset diversification.</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="text-xs font-mono text-slate-400">Total Net Equity</div>
          <div className="text-2xl font-ext500 font-mono text-white mt-2">${totalEquity.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
        </div>
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="text-xs font-mono text-slate-400">Available USDT</div>
          <div className="text-2xl font-ext500 font-mono text-emerald-400 mt-2">${user?.balanceUSDT.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
        </div>
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="text-xs font-mono text-slate-400">24h Realized P/L</div>
          <div className="text-2xl font-ext500 font-mono text-blue-400 mt-2">+$1,250.00</div>
        </div>
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="text-xs font-mono text-slate-400">Assigned Agent Desk</div>
          <div className="text-lg font-bold text-amber-400 mt-2">{user?.agentDesk || 'Desk 1 - Alpha Desk'}</div>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <h3 className="font-bold text-white text-lg flex items-center space-x-2">
          <PieChart className="w-5 h-5 text-blue-400" />
          <span>Asset Allocations & Holdings</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-3 px-4">Asset</th>
                <th className="py-3 px-4">Quantity</th>
                <th className="py-3 px-4">Current Price</th>
                <th className="py-3 px-4">Market Value</th>
                <th className="py-3 px-4">Allocation</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-sm">
              <tr>
                <td className="py-4 px-4 flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">U</div>
                  <div>
                    <div className="font-bold text-white">USDT</div>
                    <div className="text-xs text-slate-400">Tether USD</div>
                  </div>
                </td>
                <td className="py-4 px-4 font-mono">${totalEquity.toLocaleString()}</td>
                <td className="py-4 px-4 font-mono">$1.00</td>
                <td className="py-4 px-4 font-mono text-white font-bold">${totalEquity.toLocaleString()}</td>
                <td className="py-4 px-4 font-mono">100.0%</td>
                <td className="py-4 px-4 text-right">
                  <button onClick={() => setCurrentTab('trade')} className="bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-all">
                    Trade
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
