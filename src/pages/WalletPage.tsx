import React, { useState, useEffect } from 'react';
import { Wallet, ArrowDownLeft, ArrowUpRight, ShieldCheck, QrCode, History, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Transaction } from '../types';

export const WalletPage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'deposit' | 'withdraw' | 'history'>('overview');
  const [depositAmount, setDepositAmount] = useState<number>(1000);
  const [withdrawAddress, setWithdrawAddress] = useState<string>('');
  const [withdrawAmount, setWithdrawAmount] = useState<number>(500);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetch(`/api/transactions/${user.id}`)
        .then(res => res.json())
        .then(json => {
          if (json.success) setTransactions(json.data);
        })
        .catch(() => {});
    }
  }, [user]);

  const handleDeposit = () => {
    // In demo environment, simulate instant credit
    alert(`Deposit request of $${depositAmount} USDT submitted via Tron (TRC20) gateway. Address verified.`);
    setSuccessMsg(`Successfully credited $${depositAmount} USDT to custodial balance.`);
    refreshUser();
  };

  const handleWithdraw = () => {
    if (!withdrawAddress) {
      alert('Please enter a valid destination address.');
      return;
    }
    alert(`Withdrawal request of $${withdrawAmount} USDT to ${withdrawAddress} submitted for institutional clearance.`);
    setSuccessMsg(`Withdrawal of $${withdrawAmount} USDT pending security check.`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Custodial Assets & Trading Wallet</h1>
        <p className="text-slate-400 text-sm mt-1">Segregated user equity under certified institutional cold-storage custody.</p>
      </div>

      {successMsg && (
        <div className="bg-emerald-950/80 border border-emerald-500/50 p-4 rounded-xl flex items-center justify-between text-emerald-200">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-medium">{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="text-xs text-emerald-400 hover:text-white">Dismiss</button>
        </div>
      )}

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">Available Balance</div>
          <div className="text-3xl font-ext500 font-mono text-white mt-2">
            ${user?.balanceUSDT.toLocaleString('en-US', { minimumFractionDigits: 2 })} <span className="text-blue-400 text-lg">USDT</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-2">Instant option contract & spot staking ready</div>
        </div>

        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">Frozen / In-Settlement</div>
          <div className="text-3xl font-ext500 font-mono text-amber-400 mt-2">
            ${user?.frozenUSDT.toLocaleString('en-US', { minimumFractionDigits: 2 })} <span className="text-slate-400 text-lg">USDT</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-2">Locked in active binary contracts / pending withdrawals</div>
        </div>

        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">Total Account Equity</div>
          <div className="text-3xl font-ext500 font-mono text-emerald-400 mt-2">
            ${((user?.balanceUSDT || 0) + (user?.frozenUSDT || 0)).toLocaleString('en-US', { minimumFractionDigits: 2 })} <span className="text-slate-400 text-lg">USDT</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-2">Tier-1 Cold Storage 100% Backed</div>
        </div>
      </div>

      {/* Action Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-4">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'overview' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('deposit')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'deposit' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
        >
          Deposit USDT
        </button>
        <button
          onClick={() => setActiveTab('withdraw')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'withdraw' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
        >
          Withdraw Funds
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'history' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
        >
          Ledger History
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'deposit' && (
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-8 max-w-2xl mx-auto space-y-6">
          <h3 className="text-xl font-bold text-white flex items-center space-x-2">
            <ArrowDownLeft className="w-6 h-6 text-emerald-400" />
            <span>Instant Crypto Deposit (USDT)</span>
          </h3>
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-4">
            <div className="flex justify-between items-center text-xs text-slate-400">
              <span>Select Network:</span>
              <span className="text-blue-400 font-mono font-bold">Tron (TRC20) / Ethereum (ERC20)</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="bg-white p-3 rounded-xl">
                <QrCode className="w-32 h-32 text-slate-950" />
              </div>
              <div className="space-y-3 w-full">
                <label className="text-xs text-slate-400 block">Your Dedicated Deposit Address</label>
                <input
                  type="text"
                  readOnly
                  value="0x71C2b8d5f412a88e993bcde414f52670014a9e3a"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-300 select-all"
                />
                <div className="text-[11px] text-amber-400/90 font-mono">
                  * Send only USDT to this address. 12 network confirmations required.
                </div>
              </div>
            </div>
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <label className="text-xs text-slate-400 block">Simulate Instant Deposit Amount (USDT)</label>
              <div className="flex space-x-3">
                <input
                  type="number"
                  value={depositAmount}
                  onChange={e => setDepositAmount(Number(e.target.value))}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-mono text-sm flex-1"
                />
                <button
                  onClick={handleDeposit}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-6 py-2.5 rounded-xl shadow-lg shadow-emerald-600/30 transition-all text-sm"
                >
                  Credit Funds
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'withdraw' && (
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-8 max-w-2xl mx-auto space-y-6">
          <h3 className="text-xl font-bold text-white flex items-center space-x-2">
            <ArrowUpRight className="w-6 h-6 text-blue-400" />
            <span>Fast Wire & Blockchain Withdrawal</span>
          </h3>
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-4">
            <div>
              <label className="text-xs text-slate-400 block mb-2">Destination Wallet Address</label>
              <input
                type="text"
                placeholder="Enter TRC20 / ERC20 recipient address"
                value={withdrawAddress}
                onChange={e => setWithdrawAddress(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-2">Withdrawal Amount (USDT)</label>
              <input
                type="number"
                value={withdrawAmount}
                onChange={e => setWithdrawAmount(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex justify-between text-xs font-mono text-slate-400 border-t border-slate-800 pt-3">
              <span>Network Fee:</span>
              <span className="text-white">1.00 USDT</span>
            </div>
            <button
              onClick={handleWithdraw}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-600/30 transition-all"
            >
              Confirm Withdrawal & 2FA
            </button>
          </div>
        </div>
      )}

      {(activeTab === 'overview' || activeTab === 'history') && (
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h3 className="font-bold text-white text-lg mb-4 flex items-center space-x-2">
            <History className="w-5 h-5 text-blue-400" />
            <span>Ledger History & Transactions</span>
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-3 px-4">Transaction ID</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Asset</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Fee</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {transactions.map(tx => (
                  <tr key={tx.id}>
                    <td className="py-3 px-4 text-slate-300">{tx.id}</td>
                    <td className="py-3 px-4 text-white font-bold">{tx.type}</td>
                    <td className="py-3 px-4">{tx.asset}</td>
                    <td className={`py-3 px-4 font-bold ${tx.amount >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {tx.amount >= 0 ? '+' : ''}${tx.amount.toFixed(2)}
                    </td>
                    <td className="py-3 px-4">${tx.fee.toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800">
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">{tx.reference}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
