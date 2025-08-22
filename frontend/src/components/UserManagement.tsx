import React, { useState, useEffect } from 'react';
import { api } from '../api';
import type { User } from '../types';
import { UserIcon, CoinIcon, RefreshIcon } from './Icons';

interface Props {
  onRefresh: () => void;
}

const UserManagement: React.FC<Props> = ({ onRefresh }) => {
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
      <div className="simple-header">
        <div className="header-icon">
          <UserIcon size={24} />
        </div>
        <div>
          <h2>用户管理</h2>
          <p>创建用户钱包和分配代币</p>
        </div>
      </div>
      
      {/* 创建用户 */}
      <div className="simple-form">
        <h3>创建新用户</h3>
        <div className="form-layout">
          <div className="form-field">
            <label>用户名</label>
            <input
              type="text"
              placeholder="输入用户名"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              disabled={loading}
              onKeyPress={(e) => e.key === 'Enter' && createUser()}
            />
          </div>
          <button onClick={createUser} disabled={loading || !newUserName.trim()}>
            {loading ? '创建中...' : '创建用户'}
          </button>
        </div>
      </div>

      {/* 分配代币 */}
      <div className="simple-form">
        <h3>
          <CoinIcon size={20} />
          分配代币
        </h3>
        <div className="form-layout">
          <div className="form-field">
            <label>选择用户</label>
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
          </div>
          <div className="form-field">
            <label>代币数量</label>
            <input
              type="number"
              placeholder="输入数量"
              value={allocateAmount || ''}
              onChange={(e) => setAllocateAmount(Number(e.target.value))}
              disabled={loading}
              min="1"
            />
          </div>
          <button onClick={allocateTokens} disabled={loading || !selectedUser || allocateAmount <= 0}>
            {loading ? '分配中...' : '分配代币'}
          </button>
        </div>
      </div>

      {/* 用户列表 */}
      <div className="simple-list">
        <div className="list-header">
          <h3>用户列表 ({users.length})</h3>
          <button onClick={loadUsers} className="refresh-btn">
            <RefreshIcon size={16} />
            刷新
          </button>
        </div>
        
        <div className="user-list">
          {users.length === 0 ? (
            <div className="empty-state">
              <UserIcon size={32} />
              <p>暂无用户，请先创建用户</p>
            </div>
          ) : (
            users.map(user => (
              <div key={user.address} className="user-item">
                <div className="user-info">
                  <div className="user-header">
                    <strong>{user.name || '匿名用户'}</strong>
                    <span className="balance">{user.balance} 代币</span>
                  </div>
                  <div className="user-address">
                    地址: {user.address}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 消息提示 */}
      {message && (
        <div className={`message ${message.includes('成功') ? 'success' : 'error'}`}>
          <span>{message}</span>
          <button onClick={() => setMessage('')}>×</button>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
