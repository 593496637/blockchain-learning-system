import React, { useState, useEffect } from 'react';
import { api } from '../api';
import type { User, Transaction } from '../types';
import { 
  SendIcon, 
  ReceiveIcon, 
  ArrowRightIcon, 
  PendingIcon, 
  SuccessIcon, 
  CoinIcon,
  RefreshIcon,
  CopyIcon,
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
  
  // 复制地址到剪贴板
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setMessage('地址已复制到剪贴板');
      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  // 根据用户名获取用户对象
  const getUserByAddress = (address: string) => {
    return users.find(u => u.address === address);
  };

  return (
    <div className="management-panel">
      <div className="panel-header">
        <div className="header-content">
          <div className="header-icon">
            <SendIcon size={28} className="icon-gradient" />
          </div>
          <div className="header-text">
            <h2>交易管理</h2>
            <p className="header-subtitle">创建和管理区块链交易</p>
          </div>
        </div>
      </div>
      
      {/* 创建交易 */}
      <div className="action-section enhanced-form">
        <div className="section-header">
          <CoinIcon size={24} className="section-icon" />
          <h3>创建新交易</h3>
        </div>
        <div className="transaction-form">
          <div className="form-grid">
            <div className="form-group sender-section">
              <label className="form-label sender">
                <SendIcon size={18} />
                发送方
              </label>
              <div className="user-select-wrapper sender">
                <select
                  value={fromAddress}
                  onChange={(e) => setFromAddress(e.target.value)}
                  disabled={loading}
                  className={`enhanced-select sender ${!fromAddress ? 'placeholder' : ''}`}
                >
                  <option value="">选择发送方钱包</option>
                  {usersWithBalance.map(user => (
                    <option key={user.address} value={user.address}>
                      {user.name} (余额: {user.balance} 代币)
                    </option>
                  ))}
                </select>
                {fromAddress && (
                  <div className="selected-user-preview sender">
                    <UserAvatar username={getUserByAddress(fromAddress)?.name || ''} size={32} />
                    <div className="user-info">
                      <span className="user-name">{getUserByAddress(fromAddress)?.name}</span>
                      <div className="address-preview" onClick={() => copyToClipboard(fromAddress)}>
                        <span className="address-text">{fromAddress.substring(0, 12)}...</span>
                        <CopyIcon size={14} className="copy-icon" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="transaction-arrow-enhanced">
              <div className="arrow-container">
                <ArrowRightIcon size={28} className="arrow-icon pulsing" />
                <span className="arrow-label">转账</span>
              </div>
            </div>

            <div className="form-group receiver-section">
              <label className="form-label receiver">
                <ReceiveIcon size={18} />
                接收方
              </label>
              <div className="user-select-wrapper receiver">
                <select
                  value={toAddress}
                  onChange={(e) => setToAddress(e.target.value)}
                  disabled={loading}
                  className={`enhanced-select receiver ${!toAddress ? 'placeholder' : ''}`}
                >
                  <option value="">选择接收方钱包</option>
                  {receiveUsers.map(user => (
                    <option key={user.address} value={user.address}>
                      {user.name} - {user.address.substring(0, 10)}...
                    </option>
                  ))}
                </select>
                {toAddress && (
                  <div className="selected-user-preview receiver">
                    <UserAvatar username={getUserByAddress(toAddress)?.name || ''} size={32} />
                    <div className="user-info">
                      <span className="user-name">{getUserByAddress(toAddress)?.name}</span>
                      <div className="address-preview" onClick={() => copyToClipboard(toAddress)}>
                        <span className="address-text">{toAddress.substring(0, 12)}...</span>
                        <CopyIcon size={14} className="copy-icon" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="amount-section enhanced">
            <div className="amount-input-group">
              <label className="form-label amount">
                <CoinIcon size={20} />
                转账金额
              </label>
              <div className="amount-input-wrapper">
                <div className="currency-icon">
                  <CoinIcon size={24} />
                </div>
                <input
                  type="number"
                  placeholder="0.00"
                  value={amount || ''}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  disabled={loading}
                  min="1"
                  className="amount-input"
                />
                <span className="currency-suffix">代币</span>
              </div>
              {fromAddress && amount > 0 && (
                <div className="balance-check">
                  <span className="available-balance">
                    可用余额: {getUserByAddress(fromAddress)?.balance || 0} 代币
                  </span>
                  {amount > (getUserByAddress(fromAddress)?.balance || 0) && (
                    <span className="insufficient-funds">余额不足</span>
                  )}
                </div>
              )}
            </div>
            
            <button 
              onClick={createTransaction} 
              disabled={loading || !fromAddress || !toAddress || amount <= 0}
              className={`create-transaction-btn enhanced ${loading ? 'loading' : ''} ${amount > 0 && fromAddress && toAddress ? 'ready' : ''}`}
            >
              <div className="btn-content">
                {loading ? (
                  <>
                    <div className="spinner"></div>
                    创建中...
                  </>
                ) : (
                  <>
                    <SendIcon size={20} />
                    <span>创建交易</span>
                    {amount > 0 && (
                      <span className="btn-amount">{amount} 代币</span>
                    )}
                  </>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* 交易池 */}
      <div className="list-section enhanced-list">
        <div className="section-header">
          <div className="header-left">
            <PendingIcon size={24} className="section-icon" />
            <div>
              <h3>交易池</h3>
              <span className="transaction-count">{transactions.length} 笔待处理交易</span>
            </div>
          </div>
          <button onClick={loadTransactions} className="refresh-btn enhanced">
            <RefreshIcon size={18} />
            刷新
          </button>
        </div>
        
        <div className="transaction-list enhanced">
          {transactions.length === 0 ? (
            <div className="empty-state enhanced">
              <div className="empty-icon">
                <PendingIcon size={48} />
              </div>
              <h4>交易池为空</h4>
              <p>当前没有待处理的交易</p>
            </div>
          ) : (
            transactions.map(tx => (
              <div key={tx.id} className="transaction-card enhanced">
                <div className="tx-header enhanced">
                  <div className="tx-id-section">
                    <span className="tx-label">交易ID</span>
                    <span className="tx-id">{tx.id.substring(0, 16)}...</span>
                  </div>
                  <div className="tx-status-wrapper">
                    <span className={`tx-status enhanced ${tx.status}`}>
                      {tx.status === 'pending' ? (
                        <>
                          <PendingIcon size={16} />
                          待处理
                        </>
                      ) : (
                        <>
                          <SuccessIcon size={16} />
                          已确认
                        </>
                      )}
                    </span>
                  </div>
                </div>
                
                <div className="tx-flow enhanced">
                  <div className="tx-participant from">
                    <label>发送方</label>
                    <div className="participant-info">
                      <UserAvatar username={getUserByAddress(tx.from)?.name || 'Unknown'} size={24} />
                      <div className="participant-details">
                        <span className="participant-name">{getUserByAddress(tx.from)?.name || 'Unknown User'}</span>
                        <div className="address-tag from" onClick={() => copyToClipboard(tx.from)}>
                          <span className="address-text">{tx.from.substring(0, 8)}...{tx.from.substring(-4)}</span>
                          <CopyIcon size={12} className="copy-icon" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="tx-arrow">
                    <ArrowRightIcon size={20} />
                  </div>
                  <div className="tx-participant to">
                    <label>接收方</label>
                    <div className="participant-info">
                      <UserAvatar username={getUserByAddress(tx.to)?.name || 'Unknown'} size={24} />
                      <div className="participant-details">
                        <span className="participant-name">{getUserByAddress(tx.to)?.name || 'Unknown User'}</span>
                        <div className="address-tag to" onClick={() => copyToClipboard(tx.to)}>
                          <span className="address-text">{tx.to.substring(0, 8)}...{tx.to.substring(-4)}</span>
                          <CopyIcon size={12} className="copy-icon" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="tx-amounts enhanced">
                  <div className="tx-amount">
                    <label>
                      <CoinIcon size={16} />
                      转账金额
                    </label>
                    <span className="amount-value">{tx.amount} 代币</span>
                  </div>
                  <div className="tx-fee">
                    <label>手续费</label>
                    <span className="fee-value">{tx.fee} 代币</span>
                  </div>
                </div>
                
                <div className="tx-meta">
                  <span className="tx-time">
                    创建时间: {new Date(tx.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {message && (
        <div className={`message enhanced ${message.includes('成功') ? 'success' : message.includes('失败') || message.includes('错误') ? 'error' : 'warning'}`}>
          <div className="message-content">
            <div className="message-icon">
              {message.includes('成功') ? (
                <SuccessIcon size={20} />
              ) : message.includes('失败') || message.includes('错误') ? (
                <span className="error-icon">⚠</span>
              ) : (
                <span className="warning-icon">ℹ</span>
              )}
            </div>
            <span className="message-text">{message}</span>
          </div>
          <button className="message-close" onClick={() => setMessage('')}>
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default TransactionManagement;
