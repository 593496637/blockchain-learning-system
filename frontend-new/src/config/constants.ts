// 配置常量

/**
 * API配置
 */
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  TIMEOUT: 10000,
} as const;

/**
 * 应用配置
 */
export const APP_CONFIG = {
  TITLE: import.meta.env.VITE_APP_TITLE || '区块链学习系统',
  VERSION: import.meta.env.VITE_APP_VERSION || '2.0.0',
  DEFAULT_PAGE_SIZE: 10,
  REFRESH_INTERVAL: {
    FAST: 3000,    // 3秒 - 交易池
    NORMAL: 5000,  // 5秒 - 用户、矿工
    SLOW: 10000,   // 10秒 - 区块链
    SYSTEM: 30000, // 30秒 - 系统状态
  },
} as const;

/**
 * 路由路径
 */
export const ROUTES = {
  HOME: '/',
  USERS: '/users',
  TOKENS: '/tokens', 
  TRANSACTIONS: '/transactions',
  MINERS: '/miners',
  EXPLORER: '/explorer',
  SYSTEM: '/system',
} as const;

/**
 * 本地存储键名
 */
export const STORAGE_KEYS = {
  THEME: 'blockchain_theme',
  LANGUAGE: 'blockchain_language',
  USER_PREFERENCES: 'blockchain_user_preferences',
} as const;

/**
 * 交易状态
 */
export const TRANSACTION_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed', 
  FAILED: 'failed',
} as const;

/**
 * 系统消息类型
 */
export const MESSAGE_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
} as const;
