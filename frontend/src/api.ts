// frontend/src/api.ts

import axios from 'axios';
import { User, Transaction, Block, Miner, ApiResponse } from './types';

// 后端API基础URL
const API_BASE_URL = 'http://localhost:3001/api';

// 创建axios实例
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 响应拦截器 - 统一处理错误
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API请求错误:', error);
    return Promise.reject(error);
  }
);

/**
 * 用户管理相关API
 */
export const userApi = {
  /**
   * 创建新用户
   */
  async createUser(name?: string): Promise<User> {
    const response = await api.post<ApiResponse<User>>('/users', { name });
    if (!response.data.success) {
      throw new Error(response.data.error || '创建用户失败');
    }
    return response.data.data!;
  },

  /**
   * 获取所有用户列表
   */
  async getAllUsers(): Promise<User[]> {
    const response = await api.get<ApiResponse<User[]>>('/users');
    if (!response.data.success) {
      throw new Error(response.data.error || '获取用户列表失败');
    }
    return response.data.data!;
  },

  /**
   * 获取单个用户信息和交易历史
   */
  async getUser(address: string): Promise<{ user: User; transactions: Transaction[] }> {
    const response = await api.get<ApiResponse<{ user: User; transactions: Transaction[] }>>(`/users/${address}`);
    if (!response.data.success) {
      throw new Error(response.data.error || '获取用户信息失败');
    }
    return response.data.data!;
  },
};

/**
 * 代币管理相关API
 */
export const tokenApi = {
  /**
   * 手动分配代币
   */
  async allocateTokens(userAddress: string, amount: number): Promise<string> {
    const response = await api.post<ApiResponse>('/tokens/allocate', {
      userAddress,
      amount,
    });
    if (!response.data.success) {
      throw new Error(response.data.error || '分配代币失败');
    }
    return response.data.message!;
  },
};

/**
 * 交易相关API
 */
export const transactionApi = {
  /**
   * 创建新交易
   */
  async createTransaction(from: string, to: string, amount: number): Promise<string> {
    const response = await api.post<ApiResponse<{ transactionId: string }>>('/transactions', {
      from,
      to,
      amount,
    });
    if (!response.data.success) {
      throw new Error(response.data.error || '创建交易失败');
    }
    return response.data.data!.transactionId;
  },

  /**
   * 获取交易池中的待处理交易
   */
  async getPendingTransactions(): Promise<Transaction[]> {
    const response = await api.get<ApiResponse<Transaction[]>>('/transactions/pending');
    if (!response.data.success) {
      throw new Error(response.data.error || '获取待处理交易失败');
    }
    return response.data.data!;
  },
};

/**
 * 矿工相关API
 */
export const minerApi = {
  /**
   * 注册新矿工
   */
  async registerMiner(name: string): Promise<string> {
    const response = await api.post<ApiResponse<{ minerAddress: string }>>('/miners', { name });
    if (!response.data.success) {
      throw new Error(response.data.error || '注册矿工失败');
    }
    return response.data.data!.minerAddress;
  },

  /**
   * 获取所有矿工列表
   */
  async getAllMiners(): Promise<Miner[]> {
    const response = await api.get<ApiResponse<Miner[]>>('/miners');
    if (!response.data.success) {
      throw new Error(response.data.error || '获取矿工列表失败');
    }
    return response.data.data!;
  },

  /**
   * 执行挖矿
   */
  async mineBlock(minerAddress: string): Promise<Block> {
    const response = await api.post<ApiResponse<Block>>('/mining/mine', { minerAddress });
    if (!response.data.success) {
      throw new Error(response.data.error || '挖矿失败');
    }
    return response.data.data!;
  },
};

/**
 * 区块链浏览器相关API
 */
export const blockchainApi = {
  /**
   * 获取区块链基本信息
   */
  async getBlockchainInfo(): Promise<{
    blockHeight: number;
    pendingTransactionCount: number;
    totalUsers: number;
    totalMiners: number;
    config: any;
  }> {
    const response = await api.get<ApiResponse<any>>('/blockchain/info');
    if (!response.data.success) {
      throw new Error(response.data.error || '获取区块链信息失败');
    }
    return response.data.data!;
  },

  /**
   * 获取所有区块
   */
  async getBlockchain(): Promise<Block[]> {
    const response = await api.get<ApiResponse<Block[]>>('/blockchain/blocks');
    if (!response.data.success) {
      throw new Error(response.data.error || '获取区块失败');
    }
    return response.data.data!;
  },

  /**
   * 获取指定区块
   */
  async getBlock(index: number): Promise<Block> {
    const response = await api.get<ApiResponse<Block>>(`/blockchain/blocks/${index}`);
    if (!response.data.success) {
      throw new Error(response.data.error || '获取区块失败');
    }
    return response.data.data!;
  },

  /**
   * 获取用户列表
   */
  async getUsers(): Promise<User[]> {
    return userApi.getAllUsers();
  },

  /**
   * 获取矿工列表
   */
  async getMiners(): Promise<Miner[]> {
    return minerApi.getAllMiners();
  },

  /**
   * 获取交易池
   */
  async getTransactionPool(): Promise<Transaction[]> {
    return transactionApi.getPendingTransactions();
  },

  /**
   * 健康检查
   */
  async healthCheck(): Promise<string> {
    const response = await api.get<ApiResponse>('/health');
    if (!response.data.success) {
      throw new Error('系统异常');
    }
    return response.data.message!;
  },
};

// 为了兼容现有组件，导出统一的blockchainApi
export { blockchainApi };
export default api;
