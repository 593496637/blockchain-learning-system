// backend/src/types.ts

/**
 * 用户账户接口
 */
export interface User {
  address: string;      // 钱包地址 (公钥)
  privateKey: string;   // 私钥
  balance: number;      // 代币余额
  name?: string;        // 用户名 (可选)
}

/**
 * 交易接口
 */
export interface Transaction {
  id: string;           // 交易ID
  from: string;         // 发送方地址
  to: string;           // 接收方地址
  amount: number;       // 转账金额
  fee: number;          // 手续费
  timestamp: number;    // 时间戳
  signature?: string;   // 交易签名
  status: 'pending' | 'confirmed' | 'failed'; // 交易状态
}

/**
 * 区块接口
 */
export interface Block {
  index: number;        // 区块索引
  timestamp: number;    // 时间戳
  transactions: Transaction[]; // 交易列表
  previousHash: string; // 前一个区块的哈希
  hash: string;         // 当前区块哈希
  nonce: number;        // 随机数 (用于挖矿)
  miner: string;        // 矿工地址
  reward: number;       // 挖矿奖励
}

/**
 * 矿工接口
 */
export interface Miner {
  address: string;      // 矿工地址
  name: string;         // 矿工名称
  isActive: boolean;    // 是否活跃
  blocksMinedCount: number; // 挖出的区块数量
  totalRewards: number; // 总奖励
}

/**
 * 系统配置接口
 */
export interface SystemConfig {
  blockReward: number;  // 挖矿奖励
  minFee: number;       // 最小手续费
  difficulty: number;   // 挖矿难度
  maxTransactionsPerBlock: number; // 每个区块最大交易数
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
