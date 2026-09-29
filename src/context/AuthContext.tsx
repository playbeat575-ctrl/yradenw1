import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, pass: string) => Promise<boolean>;
  register: (data: { firstName: string; lastName: string; email: string; pass: string; code: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const login = async (email: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: 'demo' })
      });
      const json = await res.json();
      if (json.success) {
        setUser(json.data.user);
        setToken(json.data.token);
        localStorage.setItem('cb_token', json.data.token);
        localStorage.setItem('cb_user', JSON.stringify(json.data.user));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const register = async (data: { firstName: string; lastName: string; email: string; pass: string; code: string }) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.pass,
          invitationCode: data.code
        })
      });
      const json = await res.json();
      if (json.success) {
        setUser(json.data.user);
        setToken(json.data.token);
        localStorage.setItem('cb_token', json.data.token);
        localStorage.setItem('cb_user', JSON.stringify(json.data.user));
        return { success: true };
      }
      return { success: false, error: json.error?.message || 'Registration failed' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('cb_token');
    localStorage.removeItem('cb_user');
  };

  const refreshUser = async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/wallet/${user.id}`);
      const json = await res.json();
      if (json.success) {
        setUser(prev => prev ? { ...prev, balanceUSDT: json.data.availableBalance, frozenUSDT: json.data.frozenBalance } : null);
      }
    } catch {
      // ignore
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
