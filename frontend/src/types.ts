// frontend/src/types.ts

/**
 * 前端类型定义 - 与后端保持一致
 */

export interface User {
  address: string;
  privateKey: string;
  balance: number;
  name?: string;
}

export interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  fee: number;
  timestamp: number;
  signature?: string;
  status: 'pending' | 'confirmed' | 'failed';
}

export interface Block {
  index: number;
  timestamp: number;
  transactions: Transaction[];
  previousHash: string;
  hash: string;
  nonce: number;
  miner: string;
  reward: number;
}

export interface Miner {
  address: string;
  name: string;
  isActive: boolean;
  blocksMinedCount: number;
  totalRewards: number;
}

export interface SystemConfig {
  blockReward: number;
  minFee: number;
  difficulty: number;
  maxTransactionsPerBlock: number;
}

export interface BlockchainInfo {
  blockHeight: number;
  pendingTransactionCount: number;
  totalUsers: number;
  totalMiners: number;
  config: SystemConfig;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
