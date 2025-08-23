import React, { useState, useEffect } from 'react';
import { api } from '../api';
import type { User, Transaction } from '../types';
import { 
  SendIcon, 
  ArrowRightIcon, 
  PendingIcon, 
  CoinIcon,
  RefreshIcon,
  UserAvatar
} from './Icons';

interface Props {
  users: User[];
  onRefresh: () => void;
}

const TransactionManagement: React.FC<Props> = ({ users, onRefresh }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [fromAddress, setFromAddress] = useState('');
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const loadTransactions = async () => {
    try {
      const response = await api.getPendingTransactions();
      if (response.success && response.data) {
        setTransactions(response.data);
      }
    } catch (error) {
      console.error('Failed to load transactions:', error);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const createTransaction = async () => {
    if (!fromAddress || !toAddress || amount <= 0) {
      setMessage('请选择发送方、接收方并输入有效金额');
      return;
    }
    
    if (fromAddress === toAddress) {
      setMessage('发送方和接收方不能相同');
      return;
    }
    
    setLoading(true);
    try {
      const response = await api.createTransaction(fromAddress, toAddress, amount);
      if (response.success) {
        setMessage('交易创建成功！');
        setAmount(0);
        await loadTransactions();
        onRefresh();
      } else {
        setMessage(`交易失败: ${response.error}`);
      }
    } catch (error) {
      console.error('Failed to create transaction:', error);
      setMessage('创建交易时发生错误');
    }
    setLoading(false);
  };

  const usersWithBalance = users.filter(u => u.balance > 0);
  const receiveUsers = users.filter(u => u.address !== fromAddress);
  
  // 根据用户名获取用户对象
  const getUserByAddress = (address: string) => {
    return users.find(u => u.address === address);
  };

  return (
    <div className="management-panel">
      {/* 标题 */}
      <div className="panel-header">
        <div className="header-content">
          <div className="header-icon">
            <SendIcon size={24} className="icon-gradient" />
          </div>
          <div className="header-text">
            <h2>交易管理</h2>
            <p className="header-subtitle">创建和管理区块链交易</p>
          </div>
        </div>
      </div>
      
      {/* 创建交易表单 */}
      <div className="action-section">
        <div className="section-header">
          <CoinIcon size={20} />
          <h3>创建新交易</h3>
        </div>
        
        <div className="transaction-form" style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
          <div className="form-row" style={{display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '1rem', alignItems: 'end'}}>
            {/* 发送方 */}
            <div className="form-group">
              <label style={{fontSize: '0.9rem', fontWeight: '600', color: 'var(--color-text-secondary)', marginBottom: '0.5rem', display: 'block'}}>发送方</label>
              <select
                value={fromAddress}
                onChange={(e) => setFromAddress(e.target.value)}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid var(--color-border)',
                  borderRadius: '8px',
                  background: 'var(--color-surface)',
                  color: 'var(--color-text-primary)'
                }}
              >
                <option value="">选择发送方钱包</option>
                {usersWithBalance.map(user => (
                  <option key={user.address} value={user.address}>
                    {user.name} (余额: {user.balance} 代币)
                  </option>
                ))}
              </select>
            </div>

            {/* 箭头 */}
            <div style={{display: 'flex', justifyContent: 'center', padding: '0.75rem'}}>
              <ArrowRightIcon size={20} color="var(--color-primary)" />
            </div>

            {/* 接收方 */}
            <div className="form-group">
              <label style={{fontSize: '0.9rem', fontWeight: '600', color: 'var(--color-text-secondary)', marginBottom: '0.5rem', display: 'block'}}>接收方</label>
              <select
                value={toAddress}
                onChange={(e) => setToAddress(e.target.value)}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid var(--color-border)',
                  borderRadius: '8px',
                  background: 'var(--color-surface)',
                  color: 'var(--color-text-primary)'
                }}
              >
                <option value="">选择接收方钱包</option>
                {receiveUsers.map(user => (
                  <option key={user.address} value={user.address}>
                    {user.name} - {user.address.substring(0, 10)}...
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 金额和按钮 */}
          <div className="form-row" style={{display: 'flex', gap: '1rem', alignItems: 'flex-end'}}>
            <div className="form-group" style={{flex: 1}}>
              <label style={{fontSize: '0.9rem', fontWeight: '600', color: 'var(--color-text-secondary)', marginBottom: '0.5rem', display: 'block'}}>转账金额</label>
              <input
                type="number"
                placeholder="输入金额"
                value={amount || ''}
                onChange={(e) => setAmount(Number(e.target.value))}
                disabled={loading}
                min="1"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid var(--color-border)',
                  borderRadius: '8px',
                  background: 'var(--color-surface)',
                  color: 'var(--color-text-primary)'
                }}
              />
              {fromAddress && amount > 0 && (getUserByAddress(fromAddress)?.balance || 0) < amount && (
                <span style={{fontSize: '0.8rem', color: 'var(--color-error)', marginTop: '0.25rem', display: 'block'}}>
                  余额不足 (可用: {getUserByAddress(fromAddress)?.balance || 0} 代币)
                </span>
              )}
            </div>
            
            <button 
              onClick={createTransaction} 
              disabled={loading || !fromAddress || !toAddress || amount <= 0 || (fromAddress ? (getUserByAddress(fromAddress)?.balance || 0) < amount : false)}
              className="input-group button"
              style={{
                minWidth: '120px',
                height: '48px'
              }}
            >
              {loading ? '创建中...' : '创建交易'}
            </button>
          </div>
        </div>
        
        {/* 错误提示 */}
        {fromAddress === toAddress && fromAddress && (
          <div className="message warning" style={{marginTop: '1rem'}}>
            <span>发送方和接收方不能相同</span>
          </div>
        )}
      </div>

      {/* 交易池 */}
      <div className="list-section">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
            <PendingIcon size={20} />
            <h3 style={{margin: 0, fontSize: '1.25rem', fontWeight: '600'}}>交易池 ({transactions.length})</h3>
          </div>
          <button onClick={loadTransactions} className="refresh-btn">
            <RefreshIcon size={16} />
            刷新
          </button>
        </div>
        
        <div className="transaction-list">
          {transactions.length === 0 ? (
            <div className="empty-state">
              <PendingIcon size={32} />
              <p>暂无待处理交易</p>
            </div>
          ) : (
            transactions.map(tx => (
              <div key={tx.id} className="transaction-item">
                <div className="transaction-info">
                  <div className="transaction-header">
                    <div>
                      <strong>交易 #{tx.id.substring(0, 8)}</strong>
                      <span style={{
                        marginLeft: '0.5rem',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        backgroundColor: tx.status === 'pending' ? 'rgba(251, 191, 36, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                        color: tx.status === 'pending' ? 'var(--color-warning)' : 'var(--color-success)'
                      }}>
                        {tx.status === 'pending' ? '待处理' : '已确认'}
                      </span>
                    </div>
                    <span className="amount" style={{color: 'var(--color-success)', fontWeight: '700'}}>
                      {tx.amount} 代币
                    </span>
                  </div>
                  
                  <div className="transaction-details" style={{marginTop: '0.5rem', fontSize: '0.9rem'}}>
                    <div style={{marginBottom: '0.25rem', display: 'flex', alignItems: 'center'}}>
                      <UserAvatar username={getUserByAddress(tx.from)?.name || 'Unknown'} size={16} />
                      <strong style={{marginLeft: '0.25rem'}}>{getUserByAddress(tx.from)?.name || 'Unknown'}</strong>
                      <div style={{margin: '0 0.5rem'}}>
                        <ArrowRightIcon size={14} color="var(--color-primary)" />
                      </div>
                      <UserAvatar username={getUserByAddress(tx.to)?.name || 'Unknown'} size={16} />
                      <strong style={{marginLeft: '0.25rem'}}>{getUserByAddress(tx.to)?.name || 'Unknown'}</strong>
                    </div>
                    
                    <div style={{fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '0.5rem'}}>
                      <div style={{marginBottom: '0.25rem'}}>
                        <strong>发送方钱包地址 (From Address):</strong>
                      </div>
                      <div style={{
                        fontFamily: 'Monaco, monospace', 
                        fontSize: '0.7rem', 
                        wordBreak: 'break-all',
                        padding: '0.25rem',
                        backgroundColor: 'var(--color-background)',
                        borderRadius: '4px',
                        marginBottom: '0.5rem'
                      }}>
                        {tx.from}
                      </div>
                      
                      <div style={{marginBottom: '0.25rem'}}>
                        <strong>接收方钱包地址 (To Address):</strong>
                      </div>
                      <div style={{
                        fontFamily: 'Monaco, monospace', 
                        fontSize: '0.7rem', 
                        wordBreak: 'break-all',
                        padding: '0.25rem',
                        backgroundColor: 'var(--color-background)',
                        borderRadius: '4px',
                        marginBottom: '0.5rem'
                      }}>
                        {tx.to}
                      </div>
                      
                      <div>
                        <strong>手续费 (Transaction Fee):</strong> {tx.fee} 代币
                      </div>
                    </div>
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

export default TransactionManagement;
