// backend/src/blockchain.ts

import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { Block, Transaction, User, Miner, SystemConfig } from './types';

/**
 * 区块链核心类
 * 管理整个区块链的状态和操作
 */
export class Blockchain {
  private chain: Block[] = [];           // 区块链
  private pendingTransactions: Transaction[] = []; // 交易池
  private users: Map<string, User> = new Map();    // 用户映射
  private miners: Map<string, Miner> = new Map();  // 矿工映射
  
  // 系统配置
  private config: SystemConfig = {
    blockReward: 10,      // 挖矿奖励 10 代币
    minFee: 0.1,          // 最小手续费 0.1 代币
    difficulty: 4,        // 挖矿难度 (前缀0的个数)
    maxTransactionsPerBlock: 10
  };

  constructor() {
    // 创建创世块
    this.createGenesisBlock();
  }

  /**
   * 创建创世块 - 区块链的第一个区块
   */
  private createGenesisBlock(): void {
    const genesisBlock: Block = {
      index: 0,
      timestamp: Date.now(),
      transactions: [],
      previousHash: '0',
      hash: '',
      nonce: 0,
      miner: 'system',
      reward: 0
    };

    // 计算创世块哈希
    genesisBlock.hash = this.calculateHash(genesisBlock);
    this.chain.push(genesisBlock);

    console.log('创世块已创建:', genesisBlock);
  }

  /**
   * 计算区块哈希值
   */
  private calculateHash(block: Block): string {
    const data = block.index + 
                 block.previousHash + 
                 block.timestamp + 
                 JSON.stringify(block.transactions) + 
                 block.nonce + 
                 block.miner;
    
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  /**
   * 生成新的用户账户
   */
  createUser(name?: string): User {
    // 生成随机地址和私钥 (简化版)
    const privateKey = crypto.randomBytes(32).toString('hex');
    const address = crypto.createHash('sha256')
                         .update(privateKey)
                         .digest('hex')
                         .substring(0, 40);

    const user: User = {
      address,
      privateKey,
      balance: 0,
      name: name || `User_${address.substring(0, 8)}`
    };

    this.users.set(address, user);
    console.log(`新用户创建: ${user.name} (${address})`);
    
    return user;
  }

  /**
   * 手动分配代币 (管理员功能)
   */
  allocateTokens(userAddress: string, amount: number): boolean {
    const user = this.users.get(userAddress);
    if (!user) {
      console.error('用户不存在:', userAddress);
      return false;
    }

    user.balance += amount;
    console.log(`向 ${user.name} 分配 ${amount} 代币，当前余额: ${user.balance}`);
    return true;
  }

  /**
   * 创建新交易
   */
  createTransaction(from: string, to: string, amount: number): string | null {
    const sender = this.users.get(from);
    const receiver = this.users.get(to);

    // 验证用户存在
    if (!sender || !receiver) {
      console.error('发送方或接收方不存在');
      return null;
    }

    // 计算总费用 (转账金额 + 手续费)
    const totalCost = amount + this.config.minFee;
    
    // 验证余额
    if (sender.balance < totalCost) {
      console.error('余额不足');
      return null;
    }

    // 创建交易
    const transaction: Transaction = {
      id: uuidv4(),
      from,
      to,
      amount,
      fee: this.config.minFee,
      timestamp: Date.now(),
      status: 'pending'
    };

    // 添加到交易池
    this.pendingTransactions.push(transaction);
    console.log(`交易已创建并加入交易池: ${transaction.id}`);
    
    return transaction.id;
  }

  /**
   * 注册矿工
   */
  registerMiner(name: string): string {
    const address = crypto.randomBytes(20).toString('hex');
    const miner: Miner = {
      address,
      name,
      isActive: true,
      blocksMinedCount: 0,
      totalRewards: 0
    };

    this.miners.set(address, miner);
    
    // 为矿工创建用户账户
    const minerUser: User = {
      address,
      privateKey: crypto.randomBytes(32).toString('hex'),
      balance: 0,
      name: `Miner_${name}`
    };
    this.users.set(address, minerUser);

    console.log(`矿工已注册: ${name} (${address})`);
    return address;
  }

  /**
   * 挖矿 - 矿工打包交易并生成新区块
   */
  mineBlock(minerAddress: string): Block | null {
    const miner = this.miners.get(minerAddress);
    if (!miner || !miner.isActive) {
      console.error('矿工不存在或未激活');
      return null;
    }

    // 获取待打包的交易 (最多取配置的最大数量)
    const transactionsToMine = this.pendingTransactions
      .slice(0, this.config.maxTransactionsPerBlock);

    if (transactionsToMine.length === 0) {
      console.log('交易池为空，无法挖矿');
      return null;
    }

    // 验证并处理交易
    const validTransactions: Transaction[] = [];
    for (const tx of transactionsToMine) {
      if (this.validateAndProcessTransaction(tx)) {
        validTransactions.push(tx);
      }
    }

    if (validTransactions.length === 0) {
      console.log('没有有效交易可以打包');
      return null;
    }

    // 创建新区块
    const newBlock: Block = {
      index: this.chain.length,
      timestamp: Date.now(),
      transactions: validTransactions,
      previousHash: this.getLatestBlock().hash,
      hash: '',
      nonce: 0,
      miner: minerAddress,
      reward: this.config.blockReward
    };

    // 执行挖矿 (寻找满足难度的哈希)
    console.log(`${miner.name} 开始挖矿...`);
    const startTime = Date.now();
    
    while (true) {
      newBlock.hash = this.calculateHash(newBlock);
      
      // 检查是否满足难度要求 (前缀有足够的0)
      if (newBlock.hash.substring(0, this.config.difficulty) === 
          '0'.repeat(this.config.difficulty)) {
        break;
      }
      
      newBlock.nonce++;
    }

    const miningTime = Date.now() - startTime;
    console.log(`挖矿成功！耗时: ${miningTime}ms, Nonce: ${newBlock.nonce}`);

    // 添加区块到链上
    this.chain.push(newBlock);

    // 给矿工发放奖励
    this.rewardMiner(minerAddress, newBlock.reward, validTransactions);

    // 从交易池移除已打包的交易
    this.pendingTransactions = this.pendingTransactions
      .filter(tx => !validTransactions.find(vtx => vtx.id === tx.id));

    return newBlock;
  }

  /**
   * 验证并处理交易
   */
  private validateAndProcessTransaction(transaction: Transaction): boolean {
    const sender = this.users.get(transaction.from);
    const receiver = this.users.get(transaction.to);

    if (!sender || !receiver) {
      return false;
    }

    const totalCost = transaction.amount + transaction.fee;
    if (sender.balance < totalCost) {
      return false;
    }

    // 执行转账
    sender.balance -= totalCost;
    receiver.balance += transaction.amount;
    transaction.status = 'confirmed';

    return true;
  }

  /**
   * 给矿工发放奖励
   */
  private rewardMiner(minerAddress: string, blockReward: number, transactions: Transaction[]): void {
    const miner = this.miners.get(minerAddress);
    const minerUser = this.users.get(minerAddress);

    if (!miner || !minerUser) return;

    // 计算总手续费
    const totalFees = transactions.reduce((sum, tx) => sum + tx.fee, 0);
    const totalReward = blockReward + totalFees;

    // 发放奖励
    minerUser.balance += totalReward;
    miner.blocksMinedCount++;
    miner.totalRewards += totalReward;

    console.log(`矿工 ${miner.name} 获得奖励: ${totalReward} (区块奖励: ${blockReward}, 手续费: ${totalFees})`);
  }

  /**
   * 获取最新区块
   */
  getLatestBlock(): Block {
    return this.chain[this.chain.length - 1];
  }

  // Getter 方法
  getChain(): Block[] { return this.chain; }
  getPendingTransactions(): Transaction[] { return this.pendingTransactions; }
  getUsers(): User[] { return Array.from(this.users.values()); }
  getMiners(): Miner[] { return Array.from(this.miners.values()); }
  getUser(address: string): User | undefined { return this.users.get(address); }
  getSystemConfig(): SystemConfig { return this.config; }

  /**
   * 获取用户交易历史
   */
  getUserTransactionHistory(userAddress: string): Transaction[] {
    const allTransactions: Transaction[] = [];
    
    // 遍历所有区块收集交易
    for (const block of this.chain) {
      for (const tx of block.transactions) {
        if (tx.from === userAddress || tx.to === userAddress) {
          allTransactions.push(tx);
        }
      }
    }

    return allTransactions.sort((a, b) => b.timestamp - a.timestamp);
  }
}
