import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, ComposedChart, Area, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Zap, Shield, TrendingUp, TrendingDown, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { MarketItem, BinaryTrade } from '../types';

// Mock candlestick/chart generator
const generateChartData = (basePrice: number) => {
  const data = [];
  let current = basePrice * 0.98;
  for (let i = 0; i < 30; i++) {
    const change = (Math.random() - 0.48) * (basePrice * 0.005);
    current += change;
    const high = current + Math.random() * (basePrice * 0.003);
    const low = current - Math.random() * (basePrice * 0.003);
    data.push({
      time: `${12 + Math.floor(i / 2)}:${(i % 2 === 0 ? '00' : '30')}`,
      price: Number(current.toFixed(2)),
      sma: Number((current * 0.995).toFixed(2)),
      ema: Number((current * 1.002).toFixed(2)),
      upperBB: Number((current * 1.015).toFixed(2)),
      lowerBB: Number((current * 0.985).toFixed(2))
    });
  }
  return data;
};

export const TradePage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [markets, setMarkets] = useState<MarketItem[]>([]);
  const [selectedMarket, setSelectedMarket] = useState<MarketItem | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [duration, setDuration] = useState<number>(30); // 30, 60, 120
  const [direction, setDirection] = useState<'UP' | 'DOWN'>('UP');
  const [amount, setAmount] = useState<number>(100);
  const [trades, setTrades] = useState<BinaryTrade[]>([]);
  const [activeCountdown, setActiveCountdown] = useState<number | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/markets')
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data.length > 0) {
          setMarkets(json.data);
          setSelectedMarket(json.data[0]);
          setChartData(generateChartData(json.data[0].price));
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (selectedMarket) {
      setChartData(generateChartData(selectedMarket.price));
    }
  }, [selectedMarket]);

  useEffect(() => {
    if (user) {
      fetch(`/api/trades/${user.id}`)
        .then(res => res.json())
        .then(json => {
          if (json.success) setTrades(json.data);
        })
        .catch(() => {});
    }
  }, [user]);

  const handleExecuteTrade = async () => {
    if (!user || !selectedMarket) return;
    if (user.balanceUSDT < amount) {
      alert('Insufficient USDT balance.');
      return;
    }

    try {
      const res = await fetch('/api/trade/binary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          symbol: selectedMarket.symbol,
          direction,
          duration,
          amount,
          entryPrice: selectedMarket.price
        })
      });
      const json = await res.json();
      if (json.success) {
        setNotification(`Contract executed successfully! ${direction} @ $${selectedMarket.price}`);
        setActiveCountdown(duration);
        refreshUser();
        // Refresh trades
        const tRes = await fetch(`/api/trades/${user.id}`);
        const tJson = await tRes.json();
        if (tJson.success) setTrades(tJson.data);

        // Countdown timer tick
        const timer = setInterval(() => {
          setActiveCountdown(prev => {
            if (prev === null || prev <= 1) {
              clearInterval(timer);
              setNotification('Contract settled! Check ledger history for payout result.');
              refreshUser();
              fetch(`/api/trades/${user.id}`).then(r => r.json()).then(j => j.success && setTrades(j.data));
              return null;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        alert(json.error?.message || 'Trade execution failed');
      }
    } catch {
      alert('Network error during trade execution.');
    }
  };

  const payoutRate = duration === 30 ? 0.20 : duration === 60 ? 0.30 : 0.50;
  const estimatedPayout = amount + amount * payoutRate;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Notification banner */}
      {notification && (
        <div className="bg-blue-950/80 border border-blue-500/50 p-4 rounded-xl flex items-center justify-between text-blue-200">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-blue-400" />
            <span className="text-sm font-medium">{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-xs text-blue-400 hover:text-white">Dismiss</button>
        </div>
      )}

      {/* Ticker Bar */}
      <div className="flex items-center space-x-3 overflow-x-auto pb-2">
        {markets.map(m => (
          <button
            key={m.symbol}
            onClick={() => setSelectedMarket(m)}
            className={`px-4 py-2.5 rounded-xl border flex items-center space-x-3 whitespace-nowrap transition-all ${selectedMarket?.symbol === m.symbol ? 'bg-blue-600/20 border-blue-500 text-white' : 'bg-[#111827] border-slate-800 text-slate-400 hover:text-white'}`}
          >
            <span className="font-bold text-xs">{m.symbol}</span>
            <span className="font-mono text-xs">${m.price.toLocaleString()}</span>
            <span className={`text-[10px] font-mono ${m.change24h >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {m.change24h >= 0 ? '+' : ''}{m.change24h}%
            </span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Chart Section */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
              <div>
                <div className="flex items-center space-x-3">
                  <h2 className="text-2xl font-bold text-white">{selectedMarket?.symbol || 'BTC/USDT'}</h2>
                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded text-xs font-mono">LIVE TICK</span>
                </div>
                <div className="text-3xl font-ext500 font-mono text-white mt-1">
                  ${selectedMarket?.price.toLocaleString() || '94,250.00'}
                </div>
              </div>

              <div className="flex items-center space-x-2 text-xs font-mono">
                <span className="px-2 py-1 rounded bg-slate-800 text-cyan-400 border border-slate-700">BB (20,2)</span>
                <span className="px-2 py-1 rounded bg-slate-800 text-purple-400 border border-slate-700">EMA (12)</span>
                <span className="px-2 py-1 rounded bg-slate-800 text-amber-400 border border-slate-700">SMA (50)</span>
              </div>
            </div>

            {/* Recharts Composed Chart */}
            <div className="h-[380px] w-full pt-6">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="time" stroke="#64748b" textAnchor="end" tick={{ fontSize: 11 }} />
                  <YAxis domain={['auto', 'auto']} stroke="#64748b" tick={{ fontSize: 11 }} orientation="right" />
                  <Tooltip contentStyle={{ backgroundColor: '#0b0f19', borderColor: '#334155', borderRadius: '12px' }} />
                  <Area type="monotone" dataKey="price" stroke="#3b82f6" fillOpacity={0.15} fill="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="upperBB" stroke="#0ea5e9" strokeWidth={1} dot={false} strokeDasharray="2 2" />
                  <Line type="monotone" dataKey="lowerBB" stroke="#0ea5e9" strokeWidth={1} dot={false} strokeDasharray="2 2" />
                  <Line type="monotone" dataKey="ema" stroke="#c084fc" strokeWidth={1.5} dot={false} />
                  <Line type="monotone" dataKey="sma" stroke="#f59e0b" strokeWidth={1.5} dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Order Execution Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="font-bold text-white">Order Execution</h3>
              <div className="text-xs font-mono text-slate-400">
                Wallet Balance: <span className="text-emerald-400">${user?.balanceUSDT.toLocaleString() || '0.00'}</span>
              </div>
            </div>

            {/* Forecast Direction */}
            <div>
              <label className="text-xs text-slate-400 block mb-2">Forecast Market Direction</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setDirection('UP')}
                  className={`py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition-all ${direction === 'UP' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 border border-emerald-500' : 'bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800'}`}
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>BUY UP (CALL)</span>
                </button>
                <button
                  onClick={() => setDirection('DOWN')}
                  className={`py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition-all ${direction === 'DOWN' ? 'bg-red-600 text-white shadow-lg shadow-red-600/30 border border-red-500' : 'bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800'}`}
                >
                  <TrendingDown className="w-4 h-4" />
                  <span>BUY DOWN (PUT)</span>
                </button>
              </div>
            </div>

            {/* Contract Expiry */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs text-slate-400">Contract Expiry</label>
                <span className="text-xs font-mono text-blue-400">Payout Rate: +{(payoutRate * 100).toFixed(0)}%</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[30, 60, 120].map(sec => (
                  <button
                    key={sec}
                    onClick={() => setDuration(sec)}
                    className={`py-2.5 rounded-xl text-xs font-mono font-semibold transition-all ${duration === sec ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' : 'bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800'}`}
                  >
                    {sec} Seconds
                    <div className="text-[10px] opacity-80">+{(sec === 30 ? 20 : sec === 60 ? 30 : 50)}% ROI</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Trading Amount */}
            <div>
              <label className="text-xs text-slate-400 block mb-2">Trading Amount (USDT)</label>
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-blue-500"
              />
              <div className="grid grid-cols-4 gap-2 mt-2">
                {[10, 50, 100, 500].map(val => (
                  <button
                    key={val}
                    onClick={() => setAmount(val)}
                    className="bg-slate-900 hover:bg-slate-800 text-slate-300 py-1.5 rounded-lg text-xs font-mono border border-slate-800"
                  >
                    +${val}
                  </button>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Entry Price:</span>
                <span className="text-white">${selectedMarket?.price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Estimated Profit:</span>
                <span className="text-emerald-400">+${(amount * payoutRate).toFixed(2)} USDT</span>
              </div>
              <div className="flex justify-between text-slate-400 border-t border-slate-800 pt-2">
                <span>Potential Payout:</span>
                <span className="text-white font-bold">${estimatedPayout.toFixed(2)} USDT</span>
              </div>
            </div>

            <button
              onClick={handleExecuteTrade}
              disabled={activeCountdown !== null}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-600/30 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <Zap className="w-5 h-5" />
              <span>{activeCountdown !== null ? `SETTLEMENT IN ${activeCountdown}s` : `EXECUTE ${direction} ($${amount} USDT) →`}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Trading History */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h3 className="font-bold text-white text-lg mb-4 flex items-center space-x-2">
          <Clock className="w-5 h-5 text-blue-400" />
          <span>My Trading History</span>
        </h3>
        {trades.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-sm">
            No trades executed yet. Select contract direction above to place your first trade.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-3 px-4">Trade ID</th>
                  <th className="py-3 px-4">Symbol</th>
                  <th className="py-3 px-4">Direction</th>
                  <th className="py-3 px-4">Stake</th>
                  <th className="py-3 px-4">Entry Price</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Result / P&L</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {trades.map(t => (
                  <tr key={t.id}>
                    <td className="py-3 px-4 text-slate-300">{t.id}</td>
                    <td className="py-3 px-4 text-white font-bold">{t.symbol}</td>
                    <td className={`py-3 px-4 font-bold ${t.direction === 'UP' ? 'text-emerald-400' : 'text-red-400'}`}>{t.direction}</td>
                    <td className="py-3 px-4">${t.amount} USDT</td>
                    <td className="py-3 px-4">${t.entryPrice.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] ${t.status === 'ACTIVE' ? 'bg-blue-950 text-blue-300 border border-blue-800 animate-pulse' : t.status === 'WON' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-red-950 text-red-300 border border-red-800'}`}>
                        {t.status}
                      </span>
                    </td>
                    <td className={`py-3 px-4 font-bold ${t.profit && t.profit > 0 ? 'text-emerald-400' : t.profit && t.profit < 0 ? 'text-red-400' : 'text-slate-400'}`}>
                      {t.profit ? `${t.profit > 0 ? '+' : ''}$${t.profit.toFixed(2)} USDT` : 'Pending'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
