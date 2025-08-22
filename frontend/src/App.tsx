import React, { useState, useEffect } from 'react';
import './App.css';
import { api } from './api';
import type { User, BlockchainInfo } from './types';

// 导入功能组件
import BlockchainBrowser from './components/BlockchainBrowser';
import TransactionManagement from './components/TransactionManagement';
import MinerManagement from './components/MinerManagement';

// 系统状态组件
const SystemStatus: React.FC<{ info: BlockchainInfo | null }> = ({ info }) => {
  if (!info) {
    return (
      <div className="status-panel">
        <h2>🔗 区块链系统状态</h2>
        <div className="loading">加载中...</div>
      </div>
    );
  }

  return (
    <div className="status-panel">
      <h2>🔗 区块链系统状态</h2>
      <div className="status-grid">
        <div className="status-item">
          <span className="label">区块高度:</span>
          <span className="value">{info.blockHeight}</span>
        </div>
        <div className="status-item">
          <span className="label">待处理交易:</span>
          <span className="value">{info.pendingTransactionCount}</span>
        </div>
        <div className="status-item">
          <span className="label">用户总数:</span>
          <span className="value">{info.totalUsers}</span>
        </div>
        <div className="status-item">
          <span className="label">矿工总数:</span>
          <span className="value">{info.totalMiners}</span>
        </div>
        <div className="status-item">
          <span className="label">挖矿奖励:</span>
          <span className="value">{info.config.blockReward} 代币</span>
        </div>
        <div className="status-item">
          <span className="label">挖矿难度:</span>
          <span className="value">{info.config.difficulty}</span>
        </div>
      </div>
    </div>
  );
};

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
      <h2>👥 用户管理</h2>
      
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

  const tabs = [
    { id: 'status', label: '系统状态', icon: '📊' },
    { id: 'users', label: '用户管理', icon: '👥' },
    { id: 'transactions', label: '交易管理', icon: '💸' },
    { id: 'miners', label: '矿工管理', icon: '⛏️' },
    { id: 'blocks', label: '区块浏览器', icon: '🔍' }
  ];

  if (loading) {
    return (
      <div className="app loading">
        <div className="loading-spinner">⚡</div>
        <p>连接区块链系统中...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🚀 区块链学习系统</h1>
        <div className="header-actions">
          <div className={`connection-status ${connectionStatus}`}>
            <span className="status-indicator"></span>
            {connectionStatus === 'connected' && '已连接'}
            {connectionStatus === 'connecting' && '连接中...'}
            {connectionStatus === 'disconnected' && '连接失败'}
          </div>
          <button onClick={handleRefresh} className="refresh-button">
            🔄 刷新
          </button>
        </div>
      </header>

      <nav className="app-nav">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </nav>

      <main className="app-main">
        {activeTab === 'status' && (
          <SystemStatus info={blockchainInfo} />
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

      <footer className="app-footer">
        <p>🎓 区块链学习系统 - 理解区块链的最佳实践平台</p>
      </footer>
    </div>
  );
}

export default App;