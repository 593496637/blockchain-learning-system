import React, { useState, useEffect } from 'react';
import { api } from '../api';
import type { User, Transaction } from '../types';
import { UsersIcon, CoinIcon, RefreshIcon } from './Icons';

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
  const [selectedUserDetail, setSelectedUserDetail] = useState<{user: User; transactions: Transaction[]} | null>(null);
  const [showUserDetail, setShowUserDetail] = useState(false);

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

  const viewUserDetail = async (address: string) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/api/users/${address}`);
      const data = await response.json();
      if (data.success) {
        setSelectedUserDetail(data.data);
        setShowUserDetail(true);
      } else {
        setMessage(`获取用户详情失败: ${data.error}`);
      }
    } catch (error) {
      console.error('Failed to get user detail:', error);
      setMessage('获取用户详情时发生错误');
    }
    setLoading(false);
  };

  return (
    <div className="management-panel">
      <div className="panel-header">
        <div className="header-content">
          <div className="header-icon">
            <UsersIcon size={24} className="icon-gradient" />
          </div>
          <div className="header-text">
            <h2>用户管理</h2>
            <p className="header-subtitle">创建用户钱包和分配代币</p>
          </div>
        </div>
      </div>
      
      {/* 用户管理操作 */}
      <div className="action-section" style={{marginBottom: '1.5rem'}}>
        <div style={{
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '2rem'
        }}>
          {/* 创建用户 */}
          <div>
            <h3 style={{marginBottom: '1rem'}}>创建新用户</h3>
            <div className="input-group" style={{flexDirection: 'column', alignItems: 'stretch'}}>
              <input
                type="text"
                placeholder="输入用户名"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                disabled={loading}
                onKeyPress={(e) => e.key === 'Enter' && createUser()}
                style={{marginBottom: '0.75rem', minWidth: 'auto'}}
              />
              <button onClick={createUser} disabled={loading || !newUserName.trim()}>
                {loading ? '创建中...' : '创建用户'}
              </button>
            </div>
          </div>

          {/* 分配代币 */}
          <div>
            <h3 style={{marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <CoinIcon size={20} />
              分配代币
            </h3>
            <div className="input-group" style={{flexDirection: 'column', alignItems: 'stretch', gap: '0.75rem'}}>
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                disabled={loading}
                style={{minWidth: 'auto'}}
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
                placeholder="输入代币数量"
                value={allocateAmount || ''}
                onChange={(e) => setAllocateAmount(Number(e.target.value))}
                disabled={loading}
                min="1"
                style={{minWidth: 'auto'}}
              />
              <button onClick={allocateTokens} disabled={loading || !selectedUser || allocateAmount <= 0}>
                {loading ? '分配中...' : '分配代币'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 用户列表 */}
      <div className="list-section">
        <h3>
          用户列表 ({users.length})
          <button onClick={loadUsers} className="refresh-btn">
            <RefreshIcon size={16} />
            刷新
          </button>
        </h3>
        
        <div className="user-list">
          {users.length === 0 ? (
            <div className="empty-state">
              <UsersIcon size={32} />
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
                <button 
                  className="view-detail-btn"
                  onClick={() => viewUserDetail(user.address)}
                  disabled={loading}
                  style={{
                    marginLeft: 'auto',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.25rem',
                    border: '1px solid #ddd',
                    background: '#f8f9fa',
                    cursor: 'pointer'
                  }}
                >
                  查看详情
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 用户详情模态框 */}
      {showUserDetail && selectedUserDetail && (
        <div className="modal-overlay" onClick={() => setShowUserDetail(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{maxWidth: '600px', maxHeight: '80vh', overflow: 'auto'}}>
            <div className="modal-header">
              <h3>用户详情 - {selectedUserDetail.user.name || '匿名用户'}</h3>
              <button onClick={() => setShowUserDetail(false)} style={{background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer'}}>×</button>
            </div>
            <div className="modal-body">
              <div style={{marginBottom: '1.5rem'}}>
                <p><strong>地址:</strong> {selectedUserDetail.user.address}</p>
                <p><strong>余额:</strong> {selectedUserDetail.user.balance} 代币</p>
              </div>
              <div>
                <h4 style={{marginBottom: '1rem'}}>交易历史 ({selectedUserDetail.transactions.length})</h4>
                {selectedUserDetail.transactions.length === 0 ? (
                  <p style={{color: '#666', textAlign: 'center', padding: '1rem'}}>暂无交易记录</p>
                ) : (
                  <div style={{maxHeight: '300px', overflowY: 'auto'}}>
                    {selectedUserDetail.transactions.map((tx, index) => (
                      <div key={tx.id || index} style={{
                        padding: '0.75rem',
                        marginBottom: '0.5rem',
                        border: '1px solid #e0e0e0',
                        borderRadius: '0.25rem',
                        fontSize: '0.9rem'
                      }}>
                        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem'}}>
                          <span style={{fontWeight: 'bold'}}>{tx.amount} 代币</span>
                          <span style={{color: '#666'}}>{new Date(tx.timestamp).toLocaleString()}</span>
                        </div>
                        <div style={{fontSize: '0.8rem', color: '#666'}}>
                          <p>从: {tx.from.substring(0, 20)}...</p>
                          <p>到: {tx.to.substring(0, 20)}...</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

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
