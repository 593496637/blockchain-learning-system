// 类型定义文件

/**
 * 用户接口
 */
export interface User {
  address: string;
  privateKey: string;
  balance: number;
  name?: string;
}

/**
 * 交易接口
 */
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

/**
 * 区块接口
 */
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

/**
 * 矿工接口
 */
export interface Miner {
  address: string;
  name: string;
  isActive: boolean;
  blocksMinedCount: number;
  totalRewards: number;
}

/**
 * 系统配置接口
 */
export interface SystemConfig {
  blockReward: number;
  minFee: number;
  difficulty: number;
  maxTransactionsPerBlock: number;
}

/**
 * API响应接口
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

/**
 * 区块链信息接口
 */
export interface BlockchainInfo {
  blockHeight: number;
  pendingTransactionCount: number;
  totalUsers: number;
  totalMiners: number;
  config: SystemConfig;
}

/**
 * 路由菜单项接口
 */
export interface MenuItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

/**
 * 挖矿结果接口
 */
export interface MiningResult {
  success: boolean;
  block: Block;
  message: string;
}
