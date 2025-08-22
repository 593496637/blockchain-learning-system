import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { User } from '@/types';

interface UserState {
  // 状态
  users: User[];
  selectedUser: User | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setUsers: (users: User[]) => void;
  addUser: (user: User) => void;
  updateUser: (address: string, updates: Partial<User>) => void;
  removeUser: (address: string) => void;
  selectUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useUserStore = create<UserState>()(devtools(
  (set, get) => ({
    // 初始状态
    users: [],
    selectedUser: null,
    isLoading: false,
    error: null,

    // 设置用户列表
    setUsers: (users: User[]) => {
      set({ users });
    },

    // 添加用户
    addUser: (user: User) => {
      set(state => ({
        users: [...state.users, user]
      }));
    },

    // 更新用户信息
    updateUser: (address: string, updates: Partial<User>) => {
      set(state => ({
        users: state.users.map(user => 
          user.address === address 
            ? { ...user, ...updates }
            : user
        )
      }));
    },

    // 删除用户
    removeUser: (address: string) => {
      set(state => ({
        users: state.users.filter(user => user.address !== address),
        selectedUser: state.selectedUser?.address === address ? null : state.selectedUser
      }));
    },

    // 选择用户
    selectUser: (user: User | null) => {
      set({ selectedUser: user });
    },

    setLoading: (loading: boolean) => set({ isLoading: loading }),
    setError: (error: string | null) => set({ error }),
    
    reset: () => set({
      users: [],
      selectedUser: null,
      isLoading: false,
      error: null,
    }),
  }),
  { name: 'user-store' }
));
