import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { Miner } from '../types';

interface Props {
  onRefresh: () => void;
}

const MinerManagement: React.FC<Props> = ({ onRefresh }) => {
  const [miners, setMiners] = useState<Miner[]>([]);
  const [newMinerName, setNewMinerName] = useState('');
  const [selectedMiner, setSelectedMiner] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const loadMiners = async () => {
    try {
      const response = await api.getMiners();
      if (response.success && response.data) {
        setMiners(response.data);
      }
    } catch (error) {
      console.error('Failed to load miners:', error);
    }
  };

  useEffect(() => {
    loadMiners();
  }, []);

  const registerMiner = async () => {
    if (!newMinerName.trim()) {
      setMessage('请输入矿工名称');
      return;
    }
    
    setLoading(true);
    try {
      const response = await api.registerMiner(newMinerName.trim());
      if (response.success) {
        setMessage(`矿工 ${newMinerName} 注册成功！`);
        setNewMinerName('');
        await loadMiners();
        onRefresh();
      } else {
        setMessage(`注册失败: ${response.error}`);
      }
    } catch (error) {
      setMessage('注册矿工时发生错误');
    }
    setLoading(false);
  };

  const mineBlock = async () => {
    if (!selectedMiner) {
      setMessage('请选择矿工');
      return;
    }
    
    setLoading(true);
    try {
      const response = await api.mineBlock(selectedMiner);
      if (response.success) {
        setMessage('挖矿成功！新区块已加入区块链');
        await loadMiners();
        onRefresh();
      } else {
        setMessage(`挖矿失败: ${response.error}`);
      }
    } catch (error) {
      setMessage('挖矿时发生错误');
    }
    setLoading(false);
  };

  const activeMiners = miners.filter(m => m.isActive);

  return (
    <div className="management-panel">
      <h2>⛏️ 矿工管理</h2>
      
      {/* 注册矿工 */}
      <div className="action-section">
        <h3>注册新矿工</h3>
        <div className="input-group">
          <input
            type="text"
            placeholder="矿工名称"
            value={newMinerName}
            onChange={(e) => setNewMinerName(e.target.value)}
            disabled={loading}
            onKeyPress={(e) => e.key === 'Enter' && registerMiner()}
          />
          <button onClick={registerMiner} disabled={loading || !newMinerName.trim()}>
            {loading ? '注册中...' : '注册矿工'}
          </button>
        </div>
      </div>

      {/* 开始挖矿 */}
      <div className="action-section">
        <h3>开始挖矿</h3>
        <div className="input-group">
          <select
            value={selectedMiner}
            onChange={(e) => setSelectedMiner(e.target.value)}
            disabled={loading}
          >
            <option value="">选择矿工</option>
            {activeMiners.map(miner => (
              <option key={miner.address} value={miner.address}>
                {miner.name} - 已挖 {miner.blocksMinedCount} 个区块
              </option>
            ))}
          </select>
          <button onClick={mineBlock} disabled={loading || !selectedMiner}>
            {loading ? '挖矿中...' : '开始挖矿'}
          </button>
        </div>
      </div>

      {/* 矿工列表 */}
      <div className="list-section">
        <h3>矿工列表 ({miners.length})</h3>
        <button onClick={loadMiners} className="refresh-btn">刷新</button>
        <div className="miner-list">
          {miners.length === 0 ? (
            <div className="empty-state">暂无矿工，请先注册矿工</div>
          ) : (
            miners.map(miner => (
              <div key={miner.address} className="miner-item">
                <div className="miner-info">
                  <strong>{miner.name}</strong>
                  <span className={`status ${miner.isActive ? 'active' : 'inactive'}`}>
                    {miner.isActive ? '活跃' : '非活跃'}
                  </span>
                </div>
                <div className="miner-stats">
                  <span>地址: {miner.address.substring(0, 16)}...</span>
                  <span>挖出区块: {miner.blocksMinedCount}</span>
                  <span>总奖励: {miner.totalRewards} 代币</span>
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

export default MinerManagement;
