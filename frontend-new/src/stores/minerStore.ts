import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Miner } from '@/types';

interface MinerState {
  // 状态
  miners: Miner[];
  selectedMiner: Miner | null;
  activeMiner: Miner | null;
  isLoading: boolean;
  isMining: boolean;
  error: string | null;
  
  // Actions
  setMiners: (miners: Miner[]) => void;
  addMiner: (miner: Miner) => void;
  updateMiner: (address: string, updates: Partial<Miner>) => void;
  removeMiner: (address: string) => void;
  selectMiner: (miner: Miner | null) => void;
  setActiveMiner: (miner: Miner | null) => void;
  setLoading: (loading: boolean) => void;
  setMining: (mining: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useMinerStore = create<MinerState>()(devtools(
  (set, get) => ({
    // 初始状态
    miners: [],
    selectedMiner: null,
    activeMiner: null,
    isLoading: false,
    isMining: false,
    error: null,

    // 设置矿工列表
    setMiners: (miners: Miner[]) => {
      set({ miners });
    },

    // 添加矿工
    addMiner: (miner: Miner) => {
      set(state => ({
        miners: [...state.miners, miner]
      }));
    },

    // 更新矿工信息
    updateMiner: (address: string, updates: Partial<Miner>) => {
      set(state => ({
        miners: state.miners.map(miner => 
          miner.address === address 
            ? { ...miner, ...updates }
            : miner
        )
      }));
    },

    // 删除矿工
    removeMiner: (address: string) => {
      set(state => ({
        miners: state.miners.filter(miner => miner.address !== address),
        selectedMiner: state.selectedMiner?.address === address ? null : state.selectedMiner,
        activeMiner: state.activeMiner?.address === address ? null : state.activeMiner
      }));
    },

    // 选择矿工
    selectMiner: (miner: Miner | null) => {
      set({ selectedMiner: miner });
    },

    // 设置活跃矿工
    setActiveMiner: (miner: Miner | null) => {
      set({ activeMiner: miner });
    },

    setLoading: (loading: boolean) => set({ isLoading: loading }),
    setMining: (mining: boolean) => set({ isMining: mining }),
    setError: (error: string | null) => set({ error }),
    
    reset: () => set({
      miners: [],
      selectedMiner: null,
      activeMiner: null,
      isLoading: false,
      isMining: false,
      error: null,
    }),
  }),
  { name: 'miner-store' }
));
