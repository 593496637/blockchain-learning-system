import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { Block } from '../types';

const BlockchainBrowser: React.FC = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [loading, setLoading] = useState(false);

  const loadBlocks = async () => {
    setLoading(true);
    try {
      const response = await api.getBlocks();
      if (response.success && response.data) {
        setBlocks([...response.data].reverse()); // 最新的区块在前
      }
    } catch (error) {
      console.error('Failed to load blocks:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadBlocks();
  }, []);

  return (
    <div className="management-panel">
      <h2>🔍 区块链浏览器</h2>
      
      <button onClick={loadBlocks} className="refresh-btn" disabled={loading}>
        {loading ? '加载中...' : '刷新'}
      </button>

      <div className="browser-content">
        {/* 区块列表 */}
        <div className="block-list">
          <h3>区块列表 ({blocks.length})</h3>
          {blocks.length === 0 ? (
            <div className="empty-state">暂无区块</div>
          ) : (
            blocks.map(block => (
              <div 
                key={block.index} 
                className={`block-item ${selectedBlock?.index === block.index ? 'selected' : ''}`}
                onClick={() => setSelectedBlock(block)}
              >
                <div className="block-header">
                  <span className="block-index">#{block.index}</span>
                  <span className="block-time">{new Date(block.timestamp).toLocaleString()}</span>
                </div>
                <div className="block-info">
                  <div>哈希: {block.hash.substring(0, 16)}...</div>
                  <div>交易: {block.transactions.length}</div>
                  <div>矿工: {block.miner.substring(0, 10)}...</div>
                  <div>奖励: {block.reward}</div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 区块详情 */}
        {selectedBlock ? (
          <div className="block-details">
            <h3>区块 #{selectedBlock.index} 详情</h3>
            <div className="detail-item">
              <label>时间戳:</label>
              <span>{new Date(selectedBlock.timestamp).toLocaleString()}</span>
            </div>
            <div className="detail-item">
              <label>哈希:</label>
              <span className="hash-text">{selectedBlock.hash}</span>
            </div>
            <div className="detail-item">
              <label>前一个区块哈希:</label>
              <span className="hash-text">{selectedBlock.previousHash}</span>
            </div>
            <div className="detail-item">
              <label>矿工:</label>
              <span>{selectedBlock.miner}</span>
            </div>
            <div className="detail-item">
              <label>随机数:</label>
              <span>{selectedBlock.nonce}</span>
            </div>
            <div className="detail-item">
              <label>奖励:</label>
              <span>{selectedBlock.reward} 代币</span>
            </div>
            
            <h4>交易列表 ({selectedBlock.transactions.length})</h4>
            <div className="transaction-details">
              {selectedBlock.transactions.length === 0 ? (
                <div className="empty-state">该区块无交易</div>
              ) : (
                selectedBlock.transactions.map(tx => (
                  <div key={tx.id} className="tx-detail-item">
                    <div>ID: {tx.id}</div>
                    <div>从: {tx.from}</div>
                    <div>到: {tx.to}</div>
                    <div>金额: {tx.amount} 代币</div>
                    <div>手续费: {tx.fee} 代币</div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <div className="block-details">
            <div className="empty-state">点击左侧区块查看详情</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlockchainBrowser;
