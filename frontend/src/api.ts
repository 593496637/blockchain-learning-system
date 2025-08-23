/**
 * 区块链学习系统前端API客户端
 * 提供与后端服务的所有交互接口
 */
import { BaseService } from './services/BaseService';
import { httpClient } from './utils/httpClient';
import type { User, Transaction, Block, Miner, BlockchainInfo } from './types';

/**
 * 用户管理服务
 */
class UserService extends BaseService {
  /**
   * 创建新用户
   * @param name 用户名（可选）
   * @returns 创建的用户信息
   */
  async createUser(name?: string): Promise<User> {
    return this.post<User>('/users', { name }, '创建用户失败');
  }

  /**
   * 获取所有用户列表
   * @returns 用户列表
   */
  async getAllUsers(): Promise<User[]> {
    return this.get<User[]>('/users', '获取用户列表失败');
  }

  /**
   * 获取指定用户详情和交易历史
   * @param address 用户地址
   * @returns 用户详情和交易历史
   */
  async getUser(address: string): Promise<{ user: User; transactions: Transaction[] }> {
    return this.get<{ user: User; transactions: Transaction[] }>(`/users/${address}`, '获取用户信息失败');
  }
}

const userService = new UserService();

/**
 * 代币管理服务
 */
class TokenService extends BaseService {
  /**
   * 向用户分配代币
   * @param userAddress 用户地址
   * @param amount 分配数量
   * @returns 操作结果消息
   */
  async allocateTokens(userAddress: string, amount: number): Promise<string> {
    return this.postForMessage('/tokens/allocate', { userAddress, amount }, '分配代币失败');
  }
}

const tokenService = new TokenService();

/**
 * 交易管理服务
 */
class TransactionService extends BaseService {
  /**
   * 创建新交易
   * @param from 发送方地址
   * @param to 接收方地址
   * @param amount 转账金额
   * @returns 交易ID
   */
  async createTransaction(from: string, to: string, amount: number): Promise<string> {
    const result = await this.post<{ transactionId: string }>('/transactions', { from, to, amount }, '创建交易失败');
    return result.transactionId;
  }

  /**
   * 获取待处理交易池
   * @returns 待处理交易列表
   */
  async getPendingTransactions(): Promise<Transaction[]> {
    return this.get<Transaction[]>('/transactions/pending', '获取待处理交易失败');
  }
}

const transactionService = new TransactionService();

/**
 * 矿工管理服务
 */
class MinerService extends BaseService {
  /**
   * 注册新矿工
   * @param name 矿工名称
   * @returns 矿工地址
   */
  async registerMiner(name: string): Promise<string> {
    const result = await this.post<{ minerAddress: string }>('/miners', { name }, '注册矿工失败');
    return result.minerAddress;
  }

  /**
   * 获取所有矿工列表
   * @returns 矿工列表
   */
  async getAllMiners(): Promise<Miner[]> {
    return this.get<Miner[]>('/miners', '获取矿工列表失败');
  }

  /**
   * 执行挖矿操作
   * @param minerAddress 矿工地址
   * @returns 挖出的区块信息
   */
  async mineBlock(minerAddress: string): Promise<Block> {
    return this.post<Block>('/mining/mine', { minerAddress }, '挖矿失败');
  }
}

const minerService = new MinerService();

/**
 * 区块链信息服务
 */
class BlockchainService extends BaseService {
  /**
   * 获取区块链统计信息
   * @returns 区块链信息
   */
  async getBlockchainInfo(): Promise<BlockchainInfo> {
    return this.get<BlockchainInfo>('/blockchain/info', '获取区块链信息失败');
  }

  /**
   * 获取所有区块
   * @returns 区块列表
   */
  async getBlockchain(): Promise<Block[]> {
    return this.get<Block[]>('/blockchain/blocks', '获取区块失败');
  }

  /**
   * 获取指定索引的区块详情
   * @param index 区块索引
   * @returns 区块详情
   */
  async getBlock(index: number): Promise<Block> {
    return this.get<Block>(`/blockchain/blocks/${index}`, '获取区块失败');
  }

  /**
   * 系统健康检查
   * @returns 健康状态消息
   */
  async healthCheck(): Promise<string> {
    return this.postForMessage('/health', undefined, '系统异常');
  }
}

const blockchainService = new BlockchainService();

// 服务实例已经创建，可以直接使用

/**
 * 统一的API接口，所有方法都经过错误处理包装
 */
export const api = {
  // 区块链信息
  getBlockchainInfo: () => blockchainService.safeRequest(() => blockchainService.getBlockchainInfo()),
  
  // 用户管理
  createUser: (name?: string) => userService.safeRequest(() => userService.createUser(name)),
  getUsers: () => userService.safeRequest(() => userService.getAllUsers()),
  
  // 代币管理
  allocateTokens: (userAddress: string, amount: number) => tokenService.safeRequest(() => tokenService.allocateTokens(userAddress, amount)),
  
  // 交易管理
  createTransaction: (from: string, to: string, amount: number) => transactionService.safeRequest(() => transactionService.createTransaction(from, to, amount)),
  getPendingTransactions: () => transactionService.safeRequest(() => transactionService.getPendingTransactions()),
  
  // 矿工管理
  registerMiner: (name: string) => minerService.safeRequest(() => minerService.registerMiner(name)),
  getMiners: () => minerService.safeRequest(() => minerService.getAllMiners()),
  mineBlock: (minerAddress: string) => minerService.safeRequest(() => minerService.mineBlock(minerAddress)),
  
  // 区块管理
  getBlocks: () => blockchainService.safeRequest(() => blockchainService.getBlockchain()),
  getBlock: (index: number) => blockchainService.safeRequest(() => blockchainService.getBlock(index)),
};

// 导出各个服务实例，供需要直接调用的场景使用
export { userService as userApi, tokenService as tokenApi, transactionService as transactionApi, minerService as minerApi, blockchainService as blockchainApi };
// 导出HTTP客户端，供其他模块使用
export { httpClient };
export default httpClient;
