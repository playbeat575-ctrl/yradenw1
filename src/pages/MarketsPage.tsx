import React, { useState, useEffect } from 'react';
import { Search, Star, ArrowUpRight, TrendingUp, LayoutGrid } from 'lucide-react';
import { ResponsiveContainer, Treemap, Tooltip } from 'recharts';
import { MarketItem } from '../types';

export const MarketsPage: React.FC<{ setCurrentTab: (tab: string) => void }> = ({ setCurrentTab }) => {
  const [markets, setMarkets] = useState<MarketItem[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'gainers' | 'losers'>('all');

  useEffect(() => {
    fetch('/api/markets')
      .then(res => res.json())
      .then(json => {
        if (json.success) setMarkets(json.data);
      })
      .catch(() => {});
  }, []);

  const filtered = markets.filter(m => {
    const matchesSearch = m.symbol.toLowerCase().includes(search.toLowerCase()) || m.name.toLowerCase().includes(search.toLowerCase());
    if (filter === 'gainers') return matchesSearch && m.change24h > 0;
    if (filter === 'losers') return matchesSearch && m.change24h < 0;
    return matchesSearch;
  });

  // Prepare heatmap data for Treemap
  const treemapData = markets.map(m => ({
    name: m.symbol,
    size: parseFloat(m.volume24h.replace('B', '000').replace('M', '')),
    price: m.price,
    change: m.change24h
  }));

  const CustomizedContent = (props: any) => {
    const { root, depth, x, y, width, height, index, name, change, price } = props;
    const isPositive = change >= 0;
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          style={{
            fill: isPositive ? (change > 5 ? '#059669' : '#10b981') : (change < -2 ? '#dc2626' : '#ef4444'),
            stroke: '#05070A',
            strokeWidth: 2,
            strokeOpacity: 1,
            rx: 8,
            ry: 8
          }}
        />
        {width > 50 && height > 40 && (
          <>
            <text x={x + width / 2} y={y + height / 2 - 8} textAnchor="middle" fill="#ffffff" fontSize={14} fontWeight="bold" fontFamily="monospace">
              {name}
            </text>
            <text x={x + width / 2} y={y + height / 2 + 12} textAnchor="middle" fill="#d9e2ec" fontSize={11} fontFamily="monospace">
              {change >= 0 ? '+' : ''}{change}%
            </text>
          </>
        )}
      </g>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Cryptocurrency Markets & Heatmap</h1>
          <p className="text-[#D9E2EC]/70 text-sm mt-1">Institutional real-time pricing and liquidity depth across global exchange pools.</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#D9E2EC]/50" />
            <input
              type="text"
              placeholder="Search coins (BTC, ETH...)"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-[#0E131B] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#0066FF] w-full sm:w-72"
            />
          </div>
        </div>
      </div>

      {/* Market Heatmap Component */}
      <div className="bg-[#0E131B] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white text-base flex items-center space-x-2">
            <LayoutGrid className="w-5 h-5 text-[#00B8FF]" />
            <span>Real-Time Market Heatmap (24h Density & Volume)</span>
          </h3>
          <div className="flex items-center space-x-3 text-xs font-mono text-[#D9E2EC]/70">
            <span className="flex items-center space-x-1"><span className="w-3 h-3 rounded bg-emerald-500 inline-block"></span><span>Gainers</span></span>
            <span className="flex items-center space-x-1"><span className="w-3 h-3 rounded bg-red-500 inline-block"></span><span>Losers</span></span>
          </div>
        </div>

        <div className="h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <Treemap
              data={treemapData}
              dataKey="size"
              aspectRatio={4 / 3}
              stroke="#05070A"
              content={<CustomizedContent />}
            >
              <Tooltip content={({ payload }) => {
                if (payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-[#05070A] border border-white/20 p-3 rounded-xl text-xs font-mono shadow-xl">
                      <div className="font-bold text-white text-sm">{data.name}</div>
                      <div className="text-slate-300">Price: ${data.price.toLocaleString()}</div>
                      <div className={data.change >= 0 ? 'text-emerald-400' : 'text-red-400'}>24h Change: {data.change}%</div>
                    </div>
                  );
                }
                return null;
              }} />
            </Treemap>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-white/10 pb-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'all' ? 'bg-[#0066FF] text-white shadow-lg shadow-[#0066FF]/20' : 'text-[#D9E2EC]/70 hover:text-white hover:bg-white/5'}`}
        >
          All Markets
        </button>
        <button
          onClick={() => setFilter('gainers')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'gainers' ? 'bg-[#0066FF] text-white shadow-lg shadow-[#0066FF]/20' : 'text-[#D9E2EC]/70 hover:text-white hover:bg-white/5'}`}
        >
          Top Gainers
        </button>
        <button
          onClick={() => setFilter('losers')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'losers' ? 'bg-[#0066FF] text-white shadow-lg shadow-[#0066FF]/20' : 'text-[#D9E2EC]/70 hover:text-white hover:bg-white/5'}`}
        >
          Top Losers
        </button>
      </div>

      {/* Markets Table */}
      <div className="bg-[#0E131B] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-black/40 text-xs font-mono text-[#D9E2EC]/60">
                <th className="py-4 px-6">Asset</th>
                <th className="py-4 px-6">Last Price</th>
                <th className="py-4 px-6">24h Change</th>
                <th className="py-4 px-6">24h High / Low</th>
                <th className="py-4 px-6">24h Volume</th>
                <th className="py-4 px-6 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {filtered.map(m => (
                <tr key={m.symbol} className="hover:bg-white/5 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#05070A] to-[#0E131B] flex items-center justify-center font-bold text-white text-xs border border-white/15">
                        {m.symbol.substring(0, 3)}
                      </div>
                      <div>
                        <div className="font-bold text-white">{m.symbol}</div>
                        <div className="text-xs text-[#D9E2EC]/60">{m.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-mono font-semibold text-white">
                    ${m.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className={`py-4 px-6 font-mono font-medium ${m.change24h >= 0 ? 'text-[#22C55E]' : 'text-red-400'}`}>
                    {m.change24h >= 0 ? '+' : ''}{m.change24h}%
                  </td>
                  <td className="py-4 px-6 font-mono text-xs text-[#D9E2EC]/80">
                    <div>${m.high24h.toLocaleString()}</div>
                    <div className="text-[#D9E2EC]/40">${m.low24h.toLocaleString()}</div>
                  </td>
                  <td className="py-4 px-6 font-mono text-[#D9E2EC]">
                    {m.volume24h}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => setCurrentTab('trade')}
                      className="bg-[#0066FF]/20 hover:bg-[#0066FF] text-[#00B8FF] hover:text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all border border-[#0066FF]/40 inline-flex items-center space-x-1"
                    >
                      <span>Trade</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
