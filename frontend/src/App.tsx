import React, { useState, useEffect } from 'react';
import './App.css';
import './components/BackgroundEffects.css';
import { api } from './api';
import type { User, BlockchainInfo } from './types';
import { ThemeProvider } from './components/ThemeProvider';

import BlockchainBrowser from './components/BlockchainBrowser';
import TransactionManagement from './components/TransactionManagement';
import MinerManagement from './components/MinerManagement';
import UserManagement from './components/UserManagement';
import Sidebar from './components/Sidebar';
import { ParticleBackground, BlockchainGrid, GradientOrb, NodeNetwork } from './components/BackgroundEffects';
import { RefreshIcon, ConnectedIcon } from './components/Icons';
import EnhancedSystemStatus from './components/EnhancedSystemStatus';
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
      
      // 先进行健康检查
      try {
        const response = await fetch('http://localhost:3001/api/health');
        const healthData = await response.json();
        if (!healthData.success) {
          throw new Error('Health check failed');
        }
      } catch (healthError) {
        console.error('Health check failed:', healthError);
        setConnectionStatus('disconnected');
        setLoading(false);
        return;
      }
      
      const infoResponse = await api.getBlockchainInfo();
      
      if (infoResponse.success && infoResponse.data) {
        setBlockchainInfo(infoResponse.data);
      }

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
        <GradientOrb />
        <BlockchainGrid />
        <ParticleBackground />
        <NodeNetwork />
        <Sidebar 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
        />

        <div className={`main-container ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
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
