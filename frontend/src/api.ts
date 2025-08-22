// frontend/src/api.ts

import axios from 'axios';
import type { User, Transaction, Block, Miner, ApiResponse, BlockchainInfo } from './types';

// 后端API基础URL
const API_BASE_URL = 'http://localhost:3001/api';

// 创建axios实例
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 响应拦截器 - 统一处理错误
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API请求错误:', error);
    return Promise.reject(error);
  }
);

/**
 * 用户管理相关API
 */
const userApi = {
  /**
   * 创建新用户
   */
  async createUser(name?: string): Promise<User> {
    const response = await axiosInstance.post<ApiResponse<User>>('/users', { name });
    if (!response.data.success) {
      throw new Error(response.data.error || '创建用户失败');
    }
    return response.data.data!;
  },

  /**
   * 获取所有用户列表
   */
  async getAllUsers(): Promise<User[]> {
    const response = await axiosInstance.get<ApiResponse<User[]>>('/users');
    if (!response.data.success) {
      throw new Error(response.data.error || '获取用户列表失败');
    }
    return response.data.data!;
  },

  /**
   * 获取单个用户信息和交易历史
   */
  async getUser(address: string): Promise<{ user: User; transactions: Transaction[] }> {
    const response = await axiosInstance.get<ApiResponse<{ user: User; transactions: Transaction[] }>>(`/users/${address}`);
    if (!response.data.success) {
      throw new Error(response.data.error || '获取用户信息失败');
    }
    return response.data.data!;
  },
};

/**
 * 代币管理相关API
 */
const tokenApi = {
  /**
   * 手动分配代币
   */
  async allocateTokens(userAddress: string, amount: number): Promise<string> {
    const response = await axiosInstance.post<ApiResponse>('/tokens/allocate', {
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
const transactionApi = {
  /**
   * 创建新交易
   */
  async createTransaction(from: string, to: string, amount: number): Promise<string> {
    const response = await axiosInstance.post<ApiResponse<{ transactionId: string }>>('/transactions', {
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
    const response = await axiosInstance.get<ApiResponse<Transaction[]>>('/transactions/pending');
    if (!response.data.success) {
      throw new Error(response.data.error || '获取待处理交易失败');
    }
    return response.data.data!;
  },
};

/**
 * 矿工相关API
 */
const minerApi = {
  /**
   * 注册新矿工
   */
  async registerMiner(name: string): Promise<string> {
    const response = await axiosInstance.post<ApiResponse<{ minerAddress: string }>>('/miners', { name });
    if (!response.data.success) {
      throw new Error(response.data.error || '注册矿工失败');
    }
    return response.data.data!.minerAddress;
  },

  /**
   * 获取所有矿工列表
   */
  async getAllMiners(): Promise<Miner[]> {
    const response = await axiosInstance.get<ApiResponse<Miner[]>>('/miners');
    if (!response.data.success) {
      throw new Error(response.data.error || '获取矿工列表失败');
    }
    return response.data.data!;
  },

  /**
   * 执行挖矿
   */
  async mineBlock(minerAddress: string): Promise<Block> {
    const response = await axiosInstance.post<ApiResponse<Block>>('/mining/mine', { minerAddress });
    if (!response.data.success) {
      throw new Error(response.data.error || '挖矿失败');
    }
    return response.data.data!;
  },
};

/**
 * 区块链浏览器相关API
 */
const blockchainApi = {
  /**
   * 获取区块链基本信息
   */
  async getBlockchainInfo(): Promise<BlockchainInfo> {
    const response = await axiosInstance.get<ApiResponse<BlockchainInfo>>('/blockchain/info');
    if (!response.data.success) {
      throw new Error(response.data.error || '获取区块链信息失败');
    }
    return response.data.data!;
  },

  /**
   * 获取所有区块
   */
  async getBlockchain(): Promise<Block[]> {
    const response = await axiosInstance.get<ApiResponse<Block[]>>('/blockchain/blocks');
    if (!response.data.success) {
      throw new Error(response.data.error || '获取区块失败');
    }
    return response.data.data!;
  },

  /**
   * 获取指定区块
   */
  async getBlock(index: number): Promise<Block> {
    const response = await axiosInstance.get<ApiResponse<Block>>(`/blockchain/blocks/${index}`);
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
    const response = await axiosInstance.get<ApiResponse>('/health');
    if (!response.data.success) {
      throw new Error('系统异常');
    }
    return response.data.message!;
  },
};

// 为了兼容现有组件，创建统一的API接口
export const api = {
  // 区块链信息
  async getBlockchainInfo(): Promise<ApiResponse<BlockchainInfo>> {
    try {
      const data = await blockchainApi.getBlockchainInfo();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },

  // 用户管理
  async createUser(name?: string): Promise<ApiResponse<User>> {
    try {
      const data = await userApi.createUser(name);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },

  async getUsers(): Promise<ApiResponse<User[]>> {
    try {
      const data = await userApi.getAllUsers();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },

  async allocateTokens(userAddress: string, amount: number): Promise<ApiResponse<string>> {
    try {
      const message = await tokenApi.allocateTokens(userAddress, amount);
      return { success: true, data: message };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },

  // 交易管理
  async createTransaction(from: string, to: string, amount: number): Promise<ApiResponse<string>> {
    try {
      const transactionId = await transactionApi.createTransaction(from, to, amount);
      return { success: true, data: transactionId };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },

  async getPendingTransactions(): Promise<ApiResponse<Transaction[]>> {
    try {
      const data = await transactionApi.getPendingTransactions();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },

  // 矿工管理
  async registerMiner(name: string): Promise<ApiResponse<string>> {
    try {
      const minerAddress = await minerApi.registerMiner(name);
      return { success: true, data: minerAddress };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },

  async getMiners(): Promise<ApiResponse<Miner[]>> {
    try {
      const data = await minerApi.getAllMiners();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },

  async mineBlock(minerAddress: string): Promise<ApiResponse<Block>> {
    try {
      const data = await minerApi.mineBlock(minerAddress);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },

  // 区块链浏览器
  async getBlocks(): Promise<ApiResponse<Block[]>> {
    try {
      const data = await blockchainApi.getBlockchain();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },

  async getBlock(index: number): Promise<ApiResponse<Block>> {
    try {
      const data = await blockchainApi.getBlock(index);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },
};

// 导出模块
export { userApi, tokenApi, transactionApi, minerApi, blockchainApi };
export default axiosInstance;
