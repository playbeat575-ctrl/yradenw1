export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'SUPER_ADMIN' | 'CUSTOMER' | 'COMPLIANCE' | 'SUPPORT';
  kycStatus: 'VERIFIED' | 'PENDING' | 'REJECTED';
  agentDesk: string;
  invitationCodeUsed: string;
  balanceUSDT: number;
  frozenUSDT: number;
  createdAt: string;
}

export interface MarketItem {
  symbol: string;
  name: string;
  assetClass: string;
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume24h: string;
}

export interface BinaryTrade {
  id: string;
  userId: string;
  symbol: string;
  direction: 'UP' | 'DOWN';
  duration: number; // 30, 60, 120
  amount: number;
  entryPrice: number;
  payoutRate: number;
  status: 'ACTIVE' | 'WON' | 'LOST';
  createdAt: string;
  expiresAt: string;
  exitPrice?: number;
  profit?: number;
}

export interface Transaction {
  id: string;
  userId: string;
  type: string;
  asset: string;
  amount: number;
  fee: number;
  status: string;
  createdAt: string;
  reference: string;
}

export interface AMLAlert {
  id: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  category: string;
  details: string;
  status: string;
  date: string;
}

export interface SubAgentDesk {
  id: string;
  designation: string;
  user: string;
  code: string;
  specialization: string;
  status: string;
}
