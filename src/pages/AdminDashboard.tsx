import React, { useState, useEffect } from 'react';
import { Shield, Users, AlertTriangle, Cpu, DollarSign, Activity, FileText, CheckCircle2, Lock, Layers } from 'lucide-react';
import { ResponsiveContainer, ComposedChart, Area, Bar, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { AMLAlert, SubAgentDesk, User } from '../types';

export const AdminDashboard: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'aml' | 'desks' | 'users' | 'audit'>('overview');
  const [metrics, setMetrics] = useState<any>(null);
  const [amlAlerts, setAmlAlerts] = useState<AMLAlert[]>([]);
  const [desks, setDesks] = useState<SubAgentDesk[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/admin/dashboard').then(r => r.json()).then(j => j.success && setMetrics(j.data));
    fetch('/api/admin/aml-alerts').then(r => r.json()).then(j => j.success && setAmlAlerts(j.data));
    fetch('/api/admin/sub-agents').then(r => r.json()).then(j => j.success && setDesks(j.data));
    fetch('/api/admin/users').then(r => r.json()).then(j => j.success && setUsers(j.data));
    fetch('/api/admin/audit-logs').then(r => r.json()).then(j => j.success && setAuditLogs(j.data));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-[#111827] border border-amber-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-mono text-amber-400">
            <Shield className="w-3.5 h-3.5" />
            <span>SUPER ADMIN ENTERPRISE CONTROL</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-ext500 text-white tracking-tight">Coinbase Inc. Trade Operations & Compliance Center</h1>
          <p className="text-slate-400 text-xs sm:text-sm">Institutional compliance, due diligence monitoring, transaction risk analytics, and multi-tier controls.</p>
        </div>
        <div className="flex items-center space-x-3 font-mono text-xs">
          <div className="bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl">
            <span className="text-slate-400">Withdrawal Gateway: </span>
            <span className="text-emerald-400 font-bold">ACTIVE</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl">
            <span className="text-slate-400">Maintenance: </span>
            <span className="text-slate-300 font-bold">OFF</span>
          </div>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-4 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('overview')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${activeSubTab === 'overview' ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
        >
          Operations Dashboard
        </button>
        <button
          onClick={() => setActiveSubTab('aml')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex items-center space-x-1.5 ${activeSubTab === 'aml' ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
        >
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>AML Due Diligence (190 Alerts)</span>
        </button>
        <button
          onClick={() => setActiveSubTab('desks')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${activeSubTab === 'desks' ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
        >
          Sub-Agent Desks (5 Desks)
        </button>
        <button
          onClick={() => setActiveSubTab('users')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${activeSubTab === 'users' ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
        >
          Customer Directory
        </button>
        <button
          onClick={() => setActiveSubTab('audit')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${activeSubTab === 'audit' ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
        >
          Security & Audit Logs
        </button>
      </div>

      {/* OVERVIEW TAB */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl">
              <div className="text-xs font-mono text-slate-400">Registered Users</div>
              <div className="text-3xl font-ext500 font-mono text-white mt-2">{metrics?.totalCustomers.toLocaleString()}</div>
              <div className="text-[11px] text-emerald-400 mt-1">+20% this month</div>
            </div>
            <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl">
              <div className="text-xs font-mono text-slate-400">Active Contracts</div>
              <div className="text-3xl font-ext500 font-mono text-blue-400 mt-2">{metrics?.activeContracts}</div>
              <div className="text-[11px] text-slate-500 mt-1">Real-time settlement sync</div>
            </div>
            <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl">
              <div className="text-xs font-mono text-slate-400">Gross Volume (USDT)</div>
              <div className="text-3xl font-ext500 font-mono text-emerald-400 mt-2">${(metrics?.grossVolumeUSDT / 1000000).toFixed(1)}M+</div>
              <div className="text-[11px] text-slate-500 mt-1">Institutional liquidity pools</div>
            </div>
            <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl">
              <div className="text-xs font-mono text-slate-400">AML Risk Alerts</div>
              <div className="text-3xl font-ext500 font-mono text-red-400 mt-2">{metrics?.amlRiskAlerts} <span className="text-xs">(FATF T1)</span></div>
              <div className="text-[11px] text-red-400 mt-1">Requires EDD clearance</div>
            </div>
          </div>

          {/* High-Performance Recharts Sales & Performance Analytics */}
          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-amber-400" />
                  <span>Sales Activity vs Platform Performance Trends</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Distinguishing transactional revenue and order volume from core matching engine throughput.</p>
              </div>
              <div className="flex items-center space-x-2 text-xs font-mono">
                <span className="px-2.5 py-1 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">Sales Revenue ($k)</span>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">Order Volume</span>
              </div>
            </div>

            <div className="h-[320px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={[
                  { day: 'Mon', salesRevenue: 42, orderVolume: 120, engineLoad: 35 },
                  { day: 'Tue', salesRevenue: 58, orderVolume: 185, engineLoad: 42 },
                  { day: 'Wed', salesRevenue: 75, orderVolume: 240, engineLoad: 55 },
                  { day: 'Thu', salesRevenue: 64, orderVolume: 210, engineLoad: 48 },
                  { day: 'Fri', salesRevenue: 92, orderVolume: 310, engineLoad: 68 },
                  { day: 'Sat', salesRevenue: 110, orderVolume: 380, engineLoad: 75 },
                  { day: 'Sun', salesRevenue: 98, orderVolume: 340, engineLoad: 62 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis yAxisId="left" stroke="#3b82f6" tick={{ fontSize: 11 }} />
                  <YAxis yAxisId="right" orientation="right" stroke="#10b981" tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0b0f19', borderColor: '#334155', borderRadius: '12px' }} />
                  <Area yAxisId="left" type="monotone" dataKey="salesRevenue" name="Sales Revenue ($k)" stroke="#3b82f6" fillOpacity={0.2} fill="#3b82f6" strokeWidth={2} />
                  <Bar yAxisId="right" dataKey="orderVolume" name="Order Volume" fill="#10b981" barSize={20} radius={[4, 4, 0, 0]} />
                  <Line yAxisId="left" type="monotone" dataKey="engineLoad" name="Engine Throughput (%)" stroke="#f59e0b" strokeWidth={2} dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* UBO Spotlight */}
          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Shield className="w-5 h-5 text-amber-400" />
              <span>Ultimate Beneficial Ownership (UBO) - Spotlight</span>
            </h3>
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="text-xs text-slate-400">Primary Beneficial Owner</div>
                <div className="text-lg font-bold text-white mt-1">Stephanie Georg</div>
                <div className="text-xs text-amber-400 font-mono mt-0.5">60% Ownership · DeFi Ltd (United Kingdom)</div>
              </div>
              <div>
                <div className="text-xs text-slate-400">Verification Status</div>
                <div className="text-sm font-mono text-emerald-400 mt-1 font-semibold flex items-center space-x-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>FATF PEP Screening: PASSED</span>
                </div>
                <div className="text-xs text-slate-400 mt-0.5">EDD: Completed & Digitally Verified</div>
              </div>
              <div>
                <div className="text-xs text-slate-400">Associated Contact</div>
                <div className="text-xs font-mono text-white mt-1">+1 410 7122334455</div>
                <div className="text-xs font-mono text-slate-400">steph@defi.com</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AML DUE DILIGENCE TAB */}
      {activeSubTab === 'aml' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-red-950/30 border border-red-500/40 rounded-2xl p-6">
              <div className="text-xs font-mono text-red-400 uppercase">High Level Alerts</div>
              <div className="text-3xl font-bold font-mono text-white mt-2">45 Alerts</div>
              <div className="text-xs text-slate-400 mt-1">Sanctions list fuzzy match & high-risk jurisdiction</div>
            </div>
            <div className="bg-amber-950/30 border border-amber-500/40 rounded-2xl p-6">
              <div className="text-xs font-mono text-amber-400 uppercase">Medium Level Alerts</div>
              <div className="text-3xl font-bold font-mono text-white mt-2">65 Alerts</div>
              <div className="text-xs text-slate-400 mt-1">Rapid velocity transfers & linked multi-wallets</div>
            </div>
            <div className="bg-blue-950/30 border border-blue-500/40 rounded-2xl p-6">
              <div className="text-xs font-mono text-blue-400 uppercase">Low Level Alerts</div>
              <div className="text-3xl font-bold font-mono text-white mt-2">80 Alerts</div>
              <div className="text-xs text-slate-400 mt-1">Routine threshold warnings & IP changes</div>
            </div>
          </div>

          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="font-bold text-white text-lg mb-4">Suspended Transactions & AML Queue</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-3 px-4">Alert ID</th>
                    <th className="py-3 px-4">Severity</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Details</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {amlAlerts.map(a => (
                    <tr key={a.id}>
                      <td className="py-3 px-4 text-slate-300">{a.id}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] ${a.severity === 'HIGH' ? 'bg-red-950 text-red-300 border border-red-800' : 'bg-amber-950 text-amber-300 border border-amber-800'}`}>
                          {a.severity}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-white font-bold">{a.category}</td>
                      <td className="py-3 px-4 text-slate-400">{a.details}</td>
                      <td className="py-3 px-4 text-amber-400">{a.status}</td>
                      <td className="py-3 px-4 text-right">
                        <button onClick={() => alert('EDD Cleared & Approved by Super Admin')} className="bg-amber-600/20 hover:bg-amber-600 text-amber-400 hover:text-white px-3 py-1.5 rounded-lg text-xs transition-all">
                          Review EDD
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-AGENT DESKS TAB */}
      {activeSubTab === 'desks' && (
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="font-bold text-white text-lg">Authorized 5-Desk Sub-Agent Specifications</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-3 px-4">Desk Designation</th>
                  <th className="py-3 px-4">Authorized User</th>
                  <th className="py-3 px-4">Invitation Code</th>
                  <th className="py-3 px-4">Specialization</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {desks.map(d => (
                  <tr key={d.id}>
                    <td className="py-3 px-4 text-white font-bold">{d.designation}</td>
                    <td className="py-3 px-4 text-blue-400">{d.user}</td>
                    <td className="py-3 px-4 text-amber-400 font-bold">{d.code}</td>
                    <td className="py-3 px-4 text-slate-300">{d.specialization}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800">{d.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* USERS TAB */}
      {activeSubTab === 'users' && (
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="font-bold text-white text-lg">Platform Customer Directory</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Assigned Desk</th>
                  <th className="py-3 px-4">USDT Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {users.map(u => (
                  <tr key={u.id}>
                    <td className="py-3 px-4 text-white font-bold">{u.firstName} {u.lastName}</td>
                    <td className="py-3 px-4 text-slate-300">{u.email}</td>
                    <td className="py-3 px-4 text-amber-400">{u.role}</td>
                    <td className="py-3 px-4 text-blue-400">{u.agentDesk}</td>
                    <td className="py-3 px-4 text-emerald-400">${u.balanceUSDT.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* AUDIT LOGS TAB */}
      {activeSubTab === 'audit' && (
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="font-bold text-white text-lg">Immutable Security & Audit Ledger</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-3 px-4">Event ID</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Entity</th>
                  <th className="py-3 px-4">IP</th>
                  <th className="py-3 px-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {auditLogs.map(l => (
                  <tr key={l.id}>
                    <td className="py-3 px-4 text-slate-400">{l.id}</td>
                    <td className="py-3 px-4 text-white font-bold">{l.actor}</td>
                    <td className="py-3 px-4 text-amber-400">{l.action}</td>
                    <td className="py-3 px-4">{l.entity}</td>
                    <td className="py-3 px-4 text-slate-400">{l.ip}</td>
                    <td className="py-3 px-4 text-slate-400">{new Date(l.timestamp).toLocaleString()}</td>
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
