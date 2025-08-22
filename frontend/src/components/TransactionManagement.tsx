import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { User, Transaction } from '../types';

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
      setMessage('创建交易时发生错误');
    }
    setLoading(false);
  };

  const usersWithBalance = users.filter(u => u.balance > 0);
  const receiveUsers = users.filter(u => u.address !== fromAddress);

  return (
    <div className="management-panel">
      <h2>💸 交易管理</h2>
      
      {/* 创建交易 */}
      <div className="action-section">
        <h3>创建新交易</h3>
        <div className="transaction-form">
          <div className="form-row">
            <select
              value={fromAddress}
              onChange={(e) => setFromAddress(e.target.value)}
              disabled={loading}
            >
              <option value="">选择发送方</option>
              {usersWithBalance.map(user => (
                <option key={user.address} value={user.address}>
                  {user.name} (余额: {user.balance})
                </option>
              ))}
            </select>
            <select
              value={toAddress}
              onChange={(e) => setToAddress(e.target.value)}
              disabled={loading}
            >
              <option value="">选择接收方</option>
              {receiveUsers.map(user => (
                <option key={user.address} value={user.address}>
                  {user.name} - {user.address.substring(0, 10)}...
                </option>
              ))}
            </select>
          </div>
          <div className="form-row">
            <input
              type="number"
              placeholder="转账金额"
              value={amount || ''}
              onChange={(e) => setAmount(Number(e.target.value))}
              disabled={loading}
              min="1"
            />
            <button 
              onClick={createTransaction} 
              disabled={loading || !fromAddress || !toAddress || amount <= 0}
            >
              {loading ? '创建中...' : '创建交易'}
            </button>
          </div>
        </div>
      </div>

      {/* 交易池 */}
      <div className="list-section">
        <h3>交易池 ({transactions.length})</h3>
        <button onClick={loadTransactions} className="refresh-btn">刷新</button>
        <div className="transaction-list">
          {transactions.length === 0 ? (
            <div className="empty-state">交易池为空</div>
          ) : (
            transactions.map(tx => (
              <div key={tx.id} className="transaction-item">
                <div className="tx-header">
                  <span className="tx-id">{tx.id.substring(0, 16)}...</span>
                  <span className={`tx-status ${tx.status}`}>{tx.status}</span>
                </div>
                <div className="tx-details">
                  <div>发送方: {tx.from.substring(0, 16)}...</div>
                  <div>接收方: {tx.to.substring(0, 16)}...</div>
                  <div>金额: {tx.amount} 代币</div>
                  <div>手续费: {tx.fee} 代币</div>
                  <div>时间: {new Date(tx.timestamp).toLocaleString()}</div>
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

export default TransactionManagement;
