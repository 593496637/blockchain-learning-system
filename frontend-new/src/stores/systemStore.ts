import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { blockchainApi } from '@/services/api';
import type { SystemConfig, BlockchainInfo } from '@/types';

interface SystemState {
  // 状态
  isLoading: boolean;
  systemStatus: string;
  error: string | null;
  systemInfo: BlockchainInfo | null;
  config: SystemConfig | null;
  
  // Actions
  checkSystemHealth: () => Promise<void>;
  fetchSystemInfo: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useSystemStore = create<SystemState>()(devtools(
  (set, get) => ({
    // 初始状态
    isLoading: true,
    systemStatus: '',
    error: null,
    systemInfo: null,
    config: null,

    // 检查系统健康状态
    checkSystemHealth: async () => {
      try {
        set({ isLoading: true, error: null });
        const status = await blockchainApi.healthCheck();
        set({ 
          systemStatus: status, 
          isLoading: false 
        });
      } catch (error) {
        console.error('系统健康检查失败:', error);
        set({ 
          error: '无法连接到后端服务',
          systemStatus: '系统异常',
          isLoading: false 
        });
      }
    },

    // 获取系统信息
    fetchSystemInfo: async () => {
      try {
        const info = await blockchainApi.getBlockchainInfo();
        set({ systemInfo: info, config: info.config });
      } catch (error) {
        console.error('获取系统信息失败:', error);
        set({ error: '获取系统信息失败' });
      }
    },

    setLoading: (loading: boolean) => set({ isLoading: loading }),
    setError: (error: string | null) => set({ error }),
    
    reset: () => set({
      isLoading: true,
      systemStatus: '',
      error: null,
      systemInfo: null,
      config: null,
    }),
  }),
  { name: 'system-store' }
));
