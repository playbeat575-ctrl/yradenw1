import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';

// In-Memory Database & Seed State
const db: {
  users: any[];
  markets: any[];
  subAgentDesks: any[];
  binaryTrades: any[];
  spotOrders: any[];
  transactions: any[];
  amlAlerts: any[];
  auditLogs: any[];
} = {
  users: [
    {
      id: 'usr-admin-01',
      firstName: 'System',
      lastName: 'SuperAdmin',
      email: 'admin@blockexchange.io',
      role: 'SUPER_ADMIN',
      kycStatus: 'VERIFIED',
      agentDesk: 'Desk 1 - Institutional Alpha',
      invitationCodeUsed: 'BX-DESK-01',
      balanceUSDT: 500000.00,
      frozenUSDT: 0.00,
      createdAt: new Date(Date.now() - 90 * 86400000).toISOString()
    },
    {
      id: 'usr-top-9921',
      firstName: 'Anthony',
      lastName: 'Alverizko',
      email: 'anthony.al@gmail.com',
      role: 'CUSTOMER',
      kycStatus: 'VERIFIED',
      agentDesk: 'Desk 1 - Alpha Desk',
      invitationCodeUsed: 'PBD-AGENT-ae001',
      balanceUSDT: 142850.50,
      frozenUSDT: 1200.00,
      createdAt: new Date(Date.now() - 30 * 86400000).toISOString()
    },
    {
      id: 'usr-steph-02',
      firstName: 'Stephanie',
      lastName: 'Georg',
      email: 'steph@defi.com',
      role: 'CUSTOMER',
      kycStatus: 'VERIFIED',
      agentDesk: 'Desk 3 - Gamma Desk',
      invitationCodeUsed: 'PBD-AGENT-ae003',
      balanceUSDT: 350000.00,
      frozenUSDT: 35000.00,
      createdAt: '2026-01-05T00:00:00.000Z'
    }
  ],
  markets: [
    { symbol: 'BTC/USDT', name: 'Bitcoin', assetClass: 'Bitcoin Network', price: 94250.00, change24h: 3.42, high24h: 94920.00, low24h: 91100.00, volume24h: '34.8B' },
    { symbol: 'ETH/USDT', name: 'Ethereum', assetClass: 'Ethereum Proof-of-Stake', price: 2820.50, change24h: 2.15, high24h: 2870.00, low24h: 2740.00, volume24h: '18.2B' },
    { symbol: 'SOL/USDT', name: 'Solana', assetClass: 'Solana High-Speed L1', price: 198.40, change24h: 7.88, high24h: 202.50, low24h: 181.20, volume24h: '6.5B' },
    { symbol: 'BNB/USDT', name: 'Binance Coin', assetClass: 'BNB Smart Chain', price: 645.10, change24h: 1.04, high24h: 652.00, low24h: 635.50, volume24h: '1.4B' },
    { symbol: 'XRP/USDT', name: 'Ripple', assetClass: 'Ripple Ledger Cross-Border', price: 1.48, change24h: 4.12, high24h: 1.54, low24h: 1.41, volume24h: '920M' },
    { symbol: 'ADA/USDT', name: 'Cardano', assetClass: 'Cardano Settlement Layer', price: 0.78, change24h: -0.45, high24h: 0.81, low24h: 0.76, volume24h: '450M' }
  ],
  subAgentDesks: [
    { id: 'desk-1', designation: 'Desk 1 - Institutional Alpha', user: 'bxdesk01', code: 'BX-DESK-01', specialization: 'Enterprise & Whale Liquidity', status: 'ACTIVE' },
    { id: 'desk-2', designation: 'Desk 2 - Derivatives Beta', user: 'bxdesk02', code: 'BX-DESK-02', specialization: 'High-Frequency Futures & Options', status: 'ACTIVE' },
    { id: 'desk-3', designation: 'Desk 3 - Middle East & GCC', user: 'bxdesk03', code: 'BX-DESK-03', specialization: 'GCC Sovereign & Institutional', status: 'ACTIVE' },
    { id: 'desk-4', designation: 'Desk 4 - European OTC', user: 'bxdesk04', code: 'BX-DESK-04', specialization: 'EU Compliance & Block Trades', status: 'ACTIVE' },
    { id: 'desk-5', designation: 'Desk 5 - Asia-Pacific Prime', user: 'bxdesk05', code: 'BX-DESK-05', specialization: 'APAC High-Speed Routing', status: 'ACTIVE' }
  ],
  binaryTrades: [],
  spotOrders: [],
  transactions: [
    { id: 'tx-101', userId: 'usr-top-9921', type: 'DEPOSIT', asset: 'USDT', amount: 50000.00, fee: 0.00, status: 'COMPLETED', createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), reference: 'TX990823411A' },
    { id: 'tx-102', userId: 'usr-top-9921', type: 'TRADE_SETTLEMENT', asset: 'USDT', amount: 1250.00, fee: 1.25, status: 'COMPLETED', createdAt: new Date(Date.now() - 3600000 * 4).toISOString(), reference: 'BIN-BTC-30S' },
    { id: 'tx-103', userId: 'usr-steph-02', type: 'WITHDRAWAL', asset: 'USDT', amount: 18500.00, fee: 15.00, status: 'PENDING_EDD', createdAt: new Date(Date.now() - 1800000).toISOString(), reference: 'HOLD-EDD-UK' }
  ],
  amlAlerts: [
    { id: 'aml-1', severity: 'HIGH', category: 'Sanctions List Fuzzy Match', details: 'Entity name similarity with high-risk jurisdiction watchlist', status: 'PENDING_REVIEW', date: '2026-09-28' },
    { id: 'aml-2', severity: 'MEDIUM', category: 'Rapid Velocity Transfer', details: 'Multiple rapid transfers across 4 linked multi-sig wallets', status: 'UNDER_INVESTIGATION', date: '2026-09-27' },
    { id: 'aml-3', severity: 'LOW', category: 'Routine Threshold Warning', details: 'Single session IP change from London to Geneva', status: 'CLEARED', date: '2026-09-26' }
  ],
  auditLogs: [
    { id: 'audit-1', actor: 'admin@coinbase.ae', role: 'SUPER_ADMIN', action: 'SYSTEM_BOOT', entity: 'Cluster', ip: '127.0.0.1', timestamp: new Date().toISOString() }
  ]
};

async function startServer() {
  const app = express();
  app.use(express.json());

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ success: true, status: 'Operational', latency: '0.38ms', timestamp: new Date().toISOString() });
  });

  // Auth: Login / Register
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(401).json({ success: false, error: { code: 'INVALID_CREDENTIALS', message: 'User not found or incorrect password.' } });
    }
    // In demo environment, allow any password for seeded users or check
    res.json({ success: true, data: { user, token: `bearer-jwt-${user.id}-${Date.now()}` } });
  });

  app.post('/api/auth/register', (req, res) => {
    const { firstName, lastName, email, password, invitationCode } = req.body;
    if (!firstName || !email || !password || !invitationCode) {
      return res.status(400).json({ success: false, error: { code: 'MISSING_FIELDS', message: 'All fields including valid sub-agent invitation code are required.' } });
    }
    const validDesk = db.subAgentDesks.find(d => d.code.toLowerCase() === invitationCode.toLowerCase());
    if (!validDesk) {
      return res.status(400).json({ success: false, error: { code: 'INVALID_INVITATION_CODE', message: 'Invalid or inactive sub-agent invitation code. Registration rejected.' } });
    }
    const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(400).json({ success: false, error: { code: 'USER_EXISTS', message: 'Email already registered.' } });
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      firstName,
      lastName,
      email,
      role: 'CUSTOMER',
      kycStatus: 'PENDING',
      agentDesk: validDesk.designation,
      invitationCodeUsed: validDesk.code,
      balanceUSDT: 0.00, // Fresh account starting balance
      frozenUSDT: 0.00,
      createdAt: new Date().toISOString()
    };
    db.users.push(newUser);

    db.auditLogs.unshift({
      id: `audit-${Date.now()}`,
      actor: email,
      role: 'CUSTOMER',
      action: 'USER_REGISTRATION',
      entity: 'User',
      ip: req.ip || '127.0.0.1',
      timestamp: new Date().toISOString()
    });

    res.json({ success: true, data: { user: newUser, token: `bearer-jwt-${newUser.id}-${Date.now()}` } });
  });

  // Markets
  app.get('/api/markets', (req, res) => {
    res.json({ success: true, data: db.markets });
  });

  app.get('/api/markets/:symbol', (req, res) => {
    const symbol = req.params.symbol.toUpperCase().replace('-', '/');
    const market = db.markets.find(m => m.symbol === symbol || m.symbol.replace('/', '-') === req.params.symbol.toUpperCase());
    if (!market) {
      return res.status(404).json({ success: false, error: { code: 'MARKET_NOT_FOUND', message: 'Trading pair not found.' } });
    }
    res.json({ success: true, data: market });
  });

  // Wallet
  app.get('/api/wallet/:userId', (req, res) => {
    const user = db.users.find(u => u.id === req.params.userId) || db.users[1]; // default Anthony
    res.json({
      success: true,
      data: {
        userId: user.id,
        availableBalance: user.balanceUSDT,
        frozenBalance: user.frozenUSDT,
        totalEquity: user.balanceUSDT + user.frozenUSDT,
        currency: 'USDT'
      }
    });
  });

  // Binary Option Trade Execution (30s, 60s, 120s)
  app.post('/api/trade/binary', (req, res) => {
    const { userId, symbol, direction, duration, amount, entryPrice } = req.body;
    const user = db.users.find(u => u.id === userId) || db.users[1];

    if (user.balanceUSDT < amount) {
      return res.status(400).json({ success: false, error: { code: 'INSUFFICIENT_FUNDS', message: 'Insufficient USDT balance for contract stake.' } });
    }

    user.balanceUSDT -= Number(amount);
    user.frozenUSDT += Number(amount);

    const payoutRate = duration === 30 ? 0.20 : duration === 60 ? 0.30 : 0.50;
    const tradeId = `bin-${Date.now()}`;
    const expiresAt = new Date(Date.now() + duration * 1000).toISOString();

    const trade = {
      id: tradeId,
      userId: user.id,
      symbol: symbol || 'BTC/USDT',
      direction: direction || 'UP', // UP or DOWN
      duration: Number(duration),
      amount: Number(amount),
      entryPrice: Number(entryPrice),
      payoutRate,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      expiresAt
    };

    db.binaryTrades.push(trade);

    // Simulate auto-settlement after duration
    setTimeout(() => {
      const activeTrade = db.binaryTrades.find(t => t.id === tradeId);
      if (activeTrade && activeTrade.status === 'ACTIVE') {
        const exitPrice = activeTrade.entryPrice * (1 + (Math.random() * 0.004 - 0.0018));
        const isWin = activeTrade.direction === 'UP' ? exitPrice >= activeTrade.entryPrice : exitPrice <= activeTrade.entryPrice;
        const profit = isWin ? activeTrade.amount * activeTrade.payoutRate : -activeTrade.amount;

        activeTrade.status = isWin ? 'WON' : 'LOST';
        activeTrade.exitPrice = exitPrice;
        activeTrade.profit = profit;

        user.frozenUSDT -= activeTrade.amount;
        if (isWin) {
          user.balanceUSDT += activeTrade.amount + activeTrade.amount * (1 + activeTrade.payoutRate);
        } else {
          // stake lost
        }

        db.transactions.unshift({
          id: `tx-${Date.now()}`,
          userId: user.id,
          type: 'BINARY_TRADE',
          asset: 'USDT',
          amount: profit,
          fee: 0.50,
          status: isWin ? 'COMPLETED_WIN' : 'COMPLETED_LOSS',
          createdAt: new Date().toISOString(),
          reference: tradeId
        });
      }
    }, duration * 1000);

    res.json({ success: true, data: trade });
  });

  app.get('/api/trades/:userId', (req, res) => {
    const trades = db.binaryTrades.filter(t => t.userId === req.params.userId);
    res.json({ success: true, data: trades });
  });

  app.get('/api/transactions/:userId', (req, res) => {
    const txs = db.transactions.filter(t => t.userId === req.params.userId);
    res.json({ success: true, data: txs });
  });

  // Admin Endpoints
  app.get('/api/admin/dashboard', (req, res) => {
    res.json({
      success: true,
      data: {
        totalCustomers: db.users.length + 22340,
        activeContracts: db.binaryTrades.filter(t => t.status === 'ACTIVE').length + 3,
        grossVolumeUSDT: 2418900000,
        amlRiskAlerts: db.amlAlerts.length + 187,
        engineStatus: 'Operational',
        latency: '0.38ms',
        blockConfirmations: '6/6 Confirmed'
      }
    });
  });

  app.get('/api/admin/users', (req, res) => {
    res.json({ success: true, data: db.users });
  });

  app.get('/api/admin/aml-alerts', (req, res) => {
    res.json({ success: true, data: db.amlAlerts });
  });

  app.get('/api/admin/sub-agents', (req, res) => {
    res.json({ success: true, data: db.subAgentDesks });
  });

  app.get('/api/admin/audit-logs', (req, res) => {
    res.json({ success: true, data: db.auditLogs });
  });

  // Vite middleware for frontend SPA fallback
  const vite = await createViteServer({
    server: { middlewareMode: true }
  });
  app.use(vite.middlewares);

  const PORT = 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Coinbase & BitVista Executive Suite running on http://localhost:${PORT}`);
  });
}

startServer();
