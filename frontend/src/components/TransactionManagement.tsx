import React, { useState, useEffect } from 'react';
import { api } from '../api';
import type { User, Transaction } from '../types';
import { 
  SendIcon, 
  ArrowRightIcon, 
  PendingIcon, 
  SuccessIcon, 
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
    <div className="management-panel simple">
      {/* 简化的标题 */}
      <div className="simple-header">
        <div className="header-icon">
          <SendIcon size={24} />
        </div>
        <div>
          <h2>交易管理</h2>
          <p>创建和管理区块链交易</p>
        </div>
      </div>
      
      {/* 简化的创建交易表单 */}
      <div className="simple-form">
        <h3>
          <CoinIcon size={20} />
          创建新交易
        </h3>
        
        <div className="form-layout">
          {/* 发送方 */}
          <div className="form-field">
            <label>发送方</label>
            <select
              value={fromAddress}
              onChange={(e) => setFromAddress(e.target.value)}
              disabled={loading}
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
          <div className="simple-arrow">
            <ArrowRightIcon size={24} />
          </div>

          {/* 接收方 */}
          <div className="form-field">
            <label>接收方</label>
            <select
              value={toAddress}
              onChange={(e) => setToAddress(e.target.value)}
              disabled={loading}
            >
              <option value="">选择接收方钱包</option>
              {receiveUsers.map(user => (
                <option key={user.address} value={user.address}>
                  {user.name} - {user.address.substring(0, 10)}...
                </option>
              ))}
            </select>
          </div>

          {/* 金额输入 */}
          <div className="form-field">
            <label>转账金额</label>
            <div className="amount-input">
              <input
                type="number"
                placeholder="输入金额"
                value={amount || ''}
                onChange={(e) => setAmount(Number(e.target.value))}
                disabled={loading}
                min="1"
              />
              <span className="currency">代币</span>
            </div>
          </div>

          {/* 提交按钮 */}
          <button 
            onClick={createTransaction} 
            disabled={loading || !fromAddress || !toAddress || amount <= 0}
            className="submit-btn"
          >
            {loading ? '创建中...' : '创建交易'}
          </button>
        </div>
      </div>

      {/* 简化的交易池 */}
      <div className="simple-list">
        <div className="list-header">
          <h3>
            <PendingIcon size={20} />
            交易池 ({transactions.length})
          </h3>
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
                <div className="tx-header">
                  <span className="tx-id">#{tx.id.substring(0, 8)}</span>
                  <span className={`tx-status ${tx.status}`}>
                    {tx.status === 'pending' ? (
                      <>
                        <PendingIcon size={14} />
                        待处理
                      </>
                    ) : (
                      <>
                        <SuccessIcon size={14} />
                        已确认
                      </>
                    )}
                  </span>
                </div>
                
                <div className="tx-flow">
                  <div className="tx-user">
                    <UserAvatar username={getUserByAddress(tx.from)?.name || 'Unknown'} size={20} />
                    <span>{getUserByAddress(tx.from)?.name || 'Unknown'}</span>
                  </div>
                  <ArrowRightIcon size={16} />
                  <div className="tx-user">
                    <UserAvatar username={getUserByAddress(tx.to)?.name || 'Unknown'} size={20} />
                    <span>{getUserByAddress(tx.to)?.name || 'Unknown'}</span>
                  </div>
                </div>
                
                <div className="tx-amounts">
                  <span className="amount">{tx.amount} 代币</span>
                  <span className="fee">手续费: {tx.fee}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 简化的消息提示 */}
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
