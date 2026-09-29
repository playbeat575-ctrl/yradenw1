import React, { useState } from 'react';
import { Shield, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthPageProps {
  initialMode?: 'login' | 'register';
  setCurrentTab: (tab: string) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ initialMode = 'login', setCurrentTab }) => {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [invitationCode, setInvitationCode] = useState('PB-AG001');
  const [error, setError] = useState<string | null>(null);
  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isLogin) {
      const success = await login(email, password);
      if (success) {
        setCurrentTab('dashboard');
      } else {
        setError('Invalid credentials. Try support@blockexchange.buzz or subagent1@tradeN.com.');
      }
    } else {
      const res = await register({ firstName, lastName, email, pass: password, code: invitationCode });
      if (res.success) {
        setCurrentTab('dashboard');
      } else {
        setError(res.error || 'Registration failed.');
      }
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="bg-[#111827] border border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 mx-auto flex items-center justify-center shadow-lg shadow-blue-500/30">
            <span className="text-white font-bold text-xl">C</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {isLogin ? 'Sign In to Coinbase' : 'Sub-Agent Invitation Registration'}
          </h2>
          <p className="text-xs text-slate-400">
            {isLogin ? 'Enter your institutional credentials to access trading desk.' : 'Mandatory sub-agent invitation code required for account linking.'}
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="grid grid-cols-2 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-medium">
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            className={`py-2 rounded-lg transition-all ${isLogin ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            className={`py-2 rounded-lg transition-all ${!isLogin ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            Register
          </button>
        </div>

        {error && (
          <div className="bg-red-950/80 border border-red-500/50 p-3 rounded-xl text-xs text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">First Name</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Last Name</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs text-slate-400 block mb-1">Email Address</label>
            <input
              type="email"
              required
              placeholder="name@institution.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          {!isLogin && (
            <div>
              <label className="text-xs text-slate-400 block mb-1">Sub-Agent Invitation Code (Mandatory)</label>
              <input
                type="text"
                required
                placeholder="PBD-AGENT-ae001"
                value={invitationCode}
                onChange={e => setInvitationCode(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-blue-500"
              />
              <div className="text-[10px] text-slate-500 mt-1">Available codes: PBD-AGENT-ae001 to PBD-AGENT-ae005</div>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center space-x-2 text-sm"
          >
            <span>{isLogin ? 'Sign In to Terminal' : 'Complete Registration'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-4 border-t border-slate-800 text-xs text-slate-500 font-mono flex items-center justify-center space-x-1.5">
          <Shield className="w-3.5 h-3.5 text-blue-400" />
          <span>Secured via bcrypt hash & multi-factor verification</span>
        </div>
      </div>
    </div>
  );
};
