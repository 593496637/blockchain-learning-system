import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { blockchainApi } from '@/services/api';
import { APP_CONFIG } from '@/config/constants';
import type { User, Transaction, Block, Miner, BlockchainInfo } from '@/types';

/**
 * 用户相关API Hooks
 */
export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: blockchainApi.getUsers,
    refetchInterval: APP_CONFIG.REFRESH_INTERVAL.NORMAL,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (name?: string) => blockchainApi.createUser(name),
    onSuccess: (newUser) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      message.success(`用户 ${newUser.address.slice(0, 8)}... 创建成功！`);
    },
    onError: (error: any) => {
      message.error(error.message || '创建用户失败！');
    },
  });
};

/**
 * 交易相关API Hooks
 */
export const usePendingTransactions = () => {
  return useQuery({
    queryKey: ['transactions', 'pending'],
    queryFn: blockchainApi.getPendingTransactions,
    refetchInterval: APP_CONFIG.REFRESH_INTERVAL.FAST,
  });
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ from, to, amount }: { from: string; to: string; amount: number }) =>
      blockchainApi.createTransaction(from, to, amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      message.success('交易创建成功！');
    },
    onError: (error: any) => {
      message.error(error.message || '创建交易失败！');
    },
  });
};

/**
 * 矿工相关API Hooks
 */
export const useMiners = () => {
  return useQuery({
    queryKey: ['miners'],
    queryFn: blockchainApi.getMiners,
    refetchInterval: APP_CONFIG.REFRESH_INTERVAL.NORMAL,
  });
};

export const useRegisterMiner = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (name: string) => blockchainApi.registerMiner(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['miners'] });
      message.success('矿工注册成功！');
    },
    onError: (error: any) => {
      message.error(error.message || '注册矿工失败！');
    },
  });
};

export const useMineBlock = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (minerAddress: string) => blockchainApi.mineBlock(minerAddress),
    onSuccess: (block) => {
      // 挖矿成功后刷新所有相关数据
      queryClient.invalidateQueries({ queryKey: ['blockchain'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['miners'] });
      queryClient.invalidateQueries({ queryKey: ['system'] });
      
      message.success(`挖矿成功！新区块 #${block.index} 已生成`);
    },
    onError: (error: any) => {
      message.error(error.message || '挖矿失败！');
    },
  });
};

/**
 * 区块链相关API Hooks
 */
export const useBlockchain = () => {
  return useQuery({
    queryKey: ['blockchain'],
    queryFn: blockchainApi.getBlockchain,
    refetchInterval: APP_CONFIG.REFRESH_INTERVAL.SLOW,
  });
};

export const useBlockchainInfo = () => {
  return useQuery({
    queryKey: ['blockchain', 'info'],
    queryFn: blockchainApi.getBlockchainInfo,
    refetchInterval: APP_CONFIG.REFRESH_INTERVAL.NORMAL,
  });
};

/**
 * 系统相关API Hooks
 */
export const useSystemHealth = () => {
  return useQuery({
    queryKey: ['system', 'health'],
    queryFn: blockchainApi.healthCheck,
    refetchInterval: APP_CONFIG.REFRESH_INTERVAL.SYSTEM,
    retry: 3,
  });
};

/**
 * 代币相关API Hooks
 */
export const useAllocateTokens = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ address, amount }: { address: string; amount: number }) =>
      blockchainApi.allocateTokens(address, amount),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      message.success(`成功为 ${variables.address.slice(0, 8)}... 分配 ${variables.amount} 代币！`);
    },
    onError: (error: any) => {
      message.error(error.message || '代币分配失败！');
    },
  });
};
