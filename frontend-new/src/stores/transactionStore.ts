import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Transaction } from '@/types';

interface TransactionState {
  // 状态
  pendingTransactions: Transaction[];
  confirmedTransactions: Transaction[];
  selectedTransaction: Transaction | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setPendingTransactions: (transactions: Transaction[]) => void;
  setConfirmedTransactions: (transactions: Transaction[]) => void;
  addPendingTransaction: (transaction: Transaction) => void;
  removePendingTransaction: (transactionId: string) => void;
  confirmTransaction: (transactionId: string) => void;
  selectTransaction: (transaction: Transaction | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useTransactionStore = create<TransactionState>()(devtools(
  (set, get) => ({
    // 初始状态
    pendingTransactions: [],
    confirmedTransactions: [],
    selectedTransaction: null,
    isLoading: false,
    error: null,

    // 设置待处理交易
    setPendingTransactions: (transactions: Transaction[]) => {
      set({ pendingTransactions: transactions });
    },

    // 设置已确认交易
    setConfirmedTransactions: (transactions: Transaction[]) => {
      set({ confirmedTransactions: transactions });
    },

    // 添加待处理交易
    addPendingTransaction: (transaction: Transaction) => {
      set(state => ({
        pendingTransactions: [...state.pendingTransactions, transaction]
      }));
    },

    // 移除待处理交易
    removePendingTransaction: (transactionId: string) => {
      set(state => ({
        pendingTransactions: state.pendingTransactions.filter(
          tx => tx.id !== transactionId
        )
      }));
    },

    // 确认交易
    confirmTransaction: (transactionId: string) => {
      set(state => {
        const pendingTx = state.pendingTransactions.find(tx => tx.id === transactionId);
        if (pendingTx) {
          const confirmedTx = { ...pendingTx, status: 'confirmed' as const };
          return {
            pendingTransactions: state.pendingTransactions.filter(
              tx => tx.id !== transactionId
            ),
            confirmedTransactions: [...state.confirmedTransactions, confirmedTx]
          };
        }
        return state;
      });
    },

    // 选择交易
    selectTransaction: (transaction: Transaction | null) => {
      set({ selectedTransaction: transaction });
    },

    setLoading: (loading: boolean) => set({ isLoading: loading }),
    setError: (error: string | null) => set({ error }),
    
    reset: () => set({
      pendingTransactions: [],
      confirmedTransactions: [],
      selectedTransaction: null,
      isLoading: false,
      error: null,
    }),
  }),
  { name: 'transaction-store' }
));
