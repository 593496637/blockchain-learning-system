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
import Sidebar from './components/Sidebar';

// 导入背景效果和图标
import { ParticleBackground, BlockchainGrid, GradientOrb, NodeNetwork } from './components/BackgroundEffects';
import { RefreshIcon, ConnectedIcon } from './components/Icons';
import EnhancedSystemStatus from './components/EnhancedSystemStatus';



// 用户管理组件
const UserManagement: React.FC<{ onRefresh: () => void }> = ({ onRefresh }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [newUserName, setNewUserName] = useState('');
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [allocateAmount, setAllocateAmount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const loadUsers = async () => {
    try {
      const response = await api.getUsers();
      if (response.success && response.data) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const createUser = async () => {
    if (!newUserName.trim()) {
      setMessage('请输入用户名');
      return;
    }
    
    setLoading(true);
    try {
      const response = await api.createUser(newUserName.trim());
      if (response.success) {
        setMessage(`用户 ${newUserName} 创建成功！`);
        setNewUserName('');
        await loadUsers();
        onRefresh();
      } else {
        setMessage(`创建失败: ${response.error}`);
      }
    } catch (error) {
      console.error('Failed to create user:', error);
      setMessage('创建用户时发生错误');
    }
    setLoading(false);
  };

  const allocateTokens = async () => {
    if (!selectedUser || allocateAmount <= 0) {
      setMessage('请选择用户并输入有效金额');
      return;
    }
    
    setLoading(true);
    try {
      const response = await api.allocateTokens(selectedUser, allocateAmount);
      if (response.success) {
        setMessage(`成功分配 ${allocateAmount} 代币！`);
        setAllocateAmount(0);
        await loadUsers();
        onRefresh();
      } else {
        setMessage(`分配失败: ${response.error}`);
      }
    } catch (error) {
      console.error('Failed to allocate tokens:', error);
      setMessage('分配代币时发生错误');
    }
    setLoading(false);
  };

  return (
    <div className="management-panel">
      <h2>用户管理</h2>
      
      <div className="action-section">
        <h3>创建新用户</h3>
        <div className="input-group">
          <input
            type="text"
            placeholder="用户名"
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
            disabled={loading}
            onKeyPress={(e) => e.key === 'Enter' && createUser()}
          />
          <button onClick={createUser} disabled={loading || !newUserName.trim()}>
            {loading ? '创建中...' : '创建用户'}
          </button>
        </div>
      </div>

      <div className="action-section">
        <h3>分配代币</h3>
        <div className="input-group">
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            disabled={loading}
          >
            <option value="">选择用户</option>
            {users.map(user => (
              <option key={user.address} value={user.address}>
                {user.name} - {user.address.substring(0, 10)}...
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="代币数量"
            value={allocateAmount || ''}
            onChange={(e) => setAllocateAmount(Number(e.target.value))}
            disabled={loading}
            min="1"
          />
          <button onClick={allocateTokens} disabled={loading || !selectedUser || allocateAmount <= 0}>
            {loading ? '分配中...' : '分配代币'}
          </button>
        </div>
      </div>

      <div className="list-section">
        <h3>用户列表 ({users.length})</h3>
        <button onClick={loadUsers} className="refresh-btn">刷新</button>
        <div className="user-list">
          {users.length === 0 ? (
            <div className="empty-state">暂无用户，请先创建用户</div>
          ) : (
            users.map(user => (
              <div key={user.address} className="user-item">
                <div className="user-info">
                  <strong>{user.name || '匿名用户'}</strong>
                  <div className="user-details">
                    <span>地址: {user.address}</span>
                    <span>余额: {user.balance} 代币</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {message && (
        <div className="message">
          {message}
          <button onClick={() => setMessage('')}>×</button>
        </div>
      )}
    </div>
  );
};

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