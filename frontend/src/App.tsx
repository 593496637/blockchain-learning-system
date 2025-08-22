import React, { useState, useEffect } from 'react';
import './App.css';
import './components/BackgroundEffects.css';
import { api } from './api';
import type { User, BlockchainInfo } from './types';
import { ThemeProvider } from './components/ThemeProvider';

// 导入功能组件
import BlockchainBrowser from './components/BlockchainBrowser';
import TransactionManagement from './components/TransactionManagement';
import MinerManagement from './components/MinerManagement';
import UserManagement from './components/UserManagement';
import Sidebar from './components/Sidebar';

// 导入背景效果和图标
import { ParticleBackground, BlockchainGrid, GradientOrb, NodeNetwork } from './components/BackgroundEffects';
import { RefreshIcon, ConnectedIcon } from './components/Icons';
import EnhancedSystemStatus from './components/EnhancedSystemStatus';

// 主应用组件
function App() {
  const [activeTab, setActiveTab] = useState('status');
  const [blockchainInfo, setBlockchainInfo] = useState<BlockchainInfo | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connecting');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const loadSystemInfo = async () => {
    try {
      setConnectionStatus('connecting');
      const infoResponse = await api.getBlockchainInfo();
      
      if (infoResponse.success && infoResponse.data) {
        setBlockchainInfo(infoResponse.data);
      }

      // 同时加载用户列表
      const usersResponse = await api.getUsers();
      if (usersResponse.success && usersResponse.data) {
        setUsers(usersResponse.data);
      }
      
      setConnectionStatus('connected');
    } catch (error) {
      console.error('Failed to load system info:', error);
      setConnectionStatus('disconnected');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSystemInfo();
    const interval = setInterval(loadSystemInfo, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    loadSystemInfo();
  };

  if (loading) {
    return (
      <ThemeProvider>
        <div className="app loading">
          <div className="loading-spinner">⚡</div>
          <p>连接区块链系统中...</p>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <div className="app">
        {/* 背景效果 */}
        <GradientOrb />
        <BlockchainGrid />
        <ParticleBackground />
        <NodeNetwork />
        
        {/* 侧边栏导航 */}
        <Sidebar 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
        />

        {/* 主要内容区域 */}
        <div className={`main-container ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
          {/* 顶部状态栏 */}
          <header className="top-bar">
            <div className="page-title">
              {activeTab === 'status' && '系统状态'}
              {activeTab === 'users' && '用户管理'}
              {activeTab === 'transactions' && '交易管理'}
              {activeTab === 'miners' && '矿工管理'}
              {activeTab === 'blocks' && '区块浏览器'}
            </div>
            <div className="top-bar-actions">
              <div className={`connection-status ${connectionStatus}`}>
                <span className="status-indicator">
                  {connectionStatus === 'connected' && <ConnectedIcon size={16} />}
                  {connectionStatus === 'connecting' && <div className="loading-dot"></div>}
                  {connectionStatus === 'disconnected' && <div className="error-dot"></div>}
                </span>
                <span className="status-text">
                  {connectionStatus === 'connected' && '已连接'}
                  {connectionStatus === 'connecting' && '连接中...'}
                  {connectionStatus === 'disconnected' && '连接失败'}
                </span>
              </div>
              <button onClick={handleRefresh} className="refresh-button">
                <RefreshIcon size={18} className="refresh-icon" />
                刷新
              </button>
            </div>
          </header>

          {/* 主内容区域 */}
          <main className="main-content">
            {activeTab === 'status' && (
              <EnhancedSystemStatus info={blockchainInfo} />
            )}
            {activeTab === 'users' && (
              <UserManagement onRefresh={handleRefresh} />
            )}
            {activeTab === 'transactions' && (
              <TransactionManagement users={users} onRefresh={handleRefresh} />
            )}
            {activeTab === 'miners' && (
              <MinerManagement onRefresh={handleRefresh} />
            )}
            {activeTab === 'blocks' && (
              <BlockchainBrowser />
            )}
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
