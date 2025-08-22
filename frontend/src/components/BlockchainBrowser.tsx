import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../api';
import type { Block } from '../types';

const BlockchainBrowser: React.FC = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [blocksPerPage, setBlocksPerPage] = useState(9);
  const [showModal, setShowModal] = useState(false);

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

  // 当搜索或过滤条件改变时重置页码
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterBy]);

  // 过滤和搜索逻辑
  const filteredBlocks = useMemo(() => {
    let filtered = blocks;

    // 搜索过滤
    if (searchTerm) {
      filtered = filtered.filter(block => 
        block.index.toString().includes(searchTerm) ||
        block.hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
        block.miner.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 类型过滤
    if (filterBy !== 'all') {
      switch (filterBy) {
        case 'hasTransactions':
          filtered = filtered.filter(block => block.transactions.length > 0);
          break;
        case 'noTransactions':
          filtered = filtered.filter(block => block.transactions.length === 0);
          break;
        case 'recent':
          const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
          filtered = filtered.filter(block => block.timestamp > oneDayAgo);
          break;
      }
    }

    return filtered;
  }, [blocks, searchTerm, filterBy]);

  // 分页逻辑
  const totalPages = Math.ceil(filteredBlocks.length / blocksPerPage);
  const paginatedBlocks = useMemo(() => {
    const startIndex = (currentPage - 1) * blocksPerPage;
    return filteredBlocks.slice(startIndex, startIndex + blocksPerPage);
  }, [filteredBlocks, currentPage, blocksPerPage]);

  // 统计数据
  const stats = useMemo(() => {
    const totalTransactions = blocks.reduce((sum, block) => sum + block.transactions.length, 0);
    const avgTransactionsPerBlock = blocks.length > 0 ? totalTransactions / blocks.length : 0;
    const totalRewards = blocks.reduce((sum, block) => sum + block.reward, 0);
    
    return {
      totalBlocks: blocks.length,
      totalTransactions,
      avgTransactionsPerBlock: avgTransactionsPerBlock.toFixed(1),
      totalRewards: totalRewards.toFixed(2),
      lastBlockTime: blocks.length > 0 ? blocks[0].timestamp : 0
    };
  }, [blocks]);

  const handleBlockSelect = (block: Block) => {
    setSelectedBlock(block);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedBlock(null);
  };

  return (
    <div className="blockchain-browser">
      {/* 顶部统计面板 */}
      <div className="blockchain-stats">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🧊</div>
            <div className="stat-content">
              <div className="stat-value">{stats.totalBlocks}</div>
              <div className="stat-label">总区块数</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💼</div>
            <div className="stat-content">
              <div className="stat-value">{stats.totalTransactions}</div>
              <div className="stat-label">总交易数</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <div className="stat-value">{stats.avgTransactionsPerBlock}</div>
              <div className="stat-label">平均交易/区块</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <div className="stat-value">{stats.totalRewards}</div>
              <div className="stat-label">总奖励代币</div>
            </div>
          </div>
        </div>
      </div>

      {/* 控制面板 */}
      <div className="browser-controls">
        <div className="controls-left">
          <div className="search-container">
            <input
              type="text"
              placeholder="搜索区块（区块号、哈希、矿工）..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="filter-select"
          >
            <option value="all">全部区块</option>
            <option value="hasTransactions">有交易的区块</option>
            <option value="noTransactions">无交易的区块</option>
            <option value="recent">最近24小时</option>
          </select>
        </div>
        <div className="controls-right">
          <select
            value={blocksPerPage}
            onChange={(e) => setBlocksPerPage(Number(e.target.value))}
            className="page-size-select"
          >
            <option value={6}>每页6个</option>
            <option value={9}>每页9个</option>
            <option value={12}>每页12个</option>
            <option value={18}>每页18个</option>
          </select>
          <button onClick={loadBlocks} className="refresh-btn" disabled={loading}>
            {loading ? '🔄 加载中...' : '🔄 刷新'}
          </button>
        </div>
      </div>

      {/* 区块网格 */}
      {loading ? (
        <div className="browser-loading">
          <div className="loading-animation">
            <div className="loading-block"></div>
            <div className="loading-block"></div>
            <div className="loading-block"></div>
          </div>
          <p>正在加载区块数据...</p>
        </div>
      ) : filteredBlocks.length === 0 ? (
        <div className="browser-empty">
          <div className="empty-icon">🔍</div>
          <h3>未找到符合条件的区块</h3>
          <p>尝试调整搜索条件或过滤器</p>
        </div>
      ) : (
        <>
          <div className="blocks-grid">
            {paginatedBlocks.map(block => (
              <div 
                key={block.index} 
                className="block-card"
                onClick={() => handleBlockSelect(block)}
              >
                <div className="block-card-header">
                  <div className="block-number">#{block.index}</div>
                  <div className="block-status">
                    {block.transactions.length > 0 ? (
                      <span className="status-badge active">有交易</span>
                    ) : (
                      <span className="status-badge empty">空区块</span>
                    )}
                  </div>
                </div>
                
                <div className="block-card-content">
                  <div className="block-info-row">
                    <span className="info-label">时间</span>
                    <span className="info-value">
                      {new Date(block.timestamp).toLocaleDateString()} {new Date(block.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  
                  <div className="block-info-row">
                    <span className="info-label">哈希</span>
                    <span className="info-value hash-preview">
                      {block.hash.substring(0, 12)}...{block.hash.substring(block.hash.length - 8)}
                    </span>
                  </div>
                  
                  <div className="block-info-row">
                    <span className="info-label">矿工</span>
                    <span className="info-value">
                      {block.miner.substring(0, 8)}...{block.miner.substring(block.miner.length - 6)}
                    </span>
                  </div>
                  
                  <div className="block-metrics">
                    <div className="metric">
                      <span className="metric-value">{block.transactions.length}</span>
                      <span className="metric-label">交易</span>
                    </div>
                    <div className="metric">
                      <span className="metric-value">{block.reward}</span>
                      <span className="metric-label">奖励</span>
                    </div>
                    <div className="metric">
                      <span className="metric-value">{block.nonce}</span>
                      <span className="metric-label">随机数</span>
                    </div>
                  </div>
                </div>
                
                <div className="block-card-footer">
                  <span className="view-details">点击查看详情 →</span>
                </div>
              </div>
            ))}
          </div>

          {/* 分页控件 */}
          {totalPages > 1 && (
            <div className="pagination">
              <button 
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="pagination-btn"
              >
                首页
              </button>
              <button 
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="pagination-btn"
              >
                上一页
              </button>
              
              <div className="pagination-info">
                第 {currentPage} 页，共 {totalPages} 页
                <span className="total-items">（共 {filteredBlocks.length} 个区块）</span>
              </div>
              
              <button 
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="pagination-btn"
              >
                下一页
              </button>
              <button 
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="pagination-btn"
              >
                末页
              </button>
            </div>
          )}
        </>
      )}

      {/* 区块详情模态窗口 */}
      {showModal && selectedBlock && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>区块 #{selectedBlock.index} 详情</h3>
              <button onClick={closeModal} className="modal-close">×</button>
            </div>
            
            <div className="modal-body">
              <div className="detail-section">
                <h4>基本信息</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>区块索引:</label>
                    <span>{selectedBlock.index}</span>
                  </div>
                  <div className="detail-item">
                    <label>创建时间:</label>
                    <span>{new Date(selectedBlock.timestamp).toLocaleString()}</span>
                  </div>
                  <div className="detail-item">
                    <label>矿工地址:</label>
                    <span className="hash-text">{selectedBlock.miner}</span>
                  </div>
                  <div className="detail-item">
                    <label>挖矿奖励:</label>
                    <span>{selectedBlock.reward} 代币</span>
                  </div>
                  <div className="detail-item">
                    <label>随机数:</label>
                    <span>{selectedBlock.nonce}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4>哈希信息</h4>
                <div className="hash-section">
                  <div className="detail-item">
                    <label>区块哈希:</label>
                    <span className="hash-text">{selectedBlock.hash}</span>
                  </div>
                  <div className="detail-item">
                    <label>父区块哈希:</label>
                    <span className="hash-text">{selectedBlock.previousHash}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4>交易信息 ({selectedBlock.transactions.length})</h4>
                {selectedBlock.transactions.length === 0 ? (
                  <div className="empty-state">该区块不包含任何交易</div>
                ) : (
                  <div className="transactions-list">
                    {selectedBlock.transactions.map(tx => (
                      <div key={tx.id} className="transaction-card">
                        <div className="tx-header">
                          <span className="tx-id">交易 ID: {tx.id}</span>
                        </div>
                        <div className="tx-details">
                          <div className="tx-flow">
                            <div className="tx-from">
                              <label>发送方:</label>
                              <span>{tx.from}</span>
                            </div>
                            <div className="tx-arrow">→</div>
                            <div className="tx-to">
                              <label>接收方:</label>
                              <span>{tx.to}</span>
                            </div>
                          </div>
                          <div className="tx-amounts">
                            <div className="tx-amount">
                              <label>转账金额:</label>
                              <span className="amount-value">{tx.amount} 代币</span>
                            </div>
                            <div className="tx-fee">
                              <label>手续费:</label>
                              <span className="fee-value">{tx.fee} 代币</span>
                            </div>
                          </div>
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
    </div>
  );
};

export default BlockchainBrowser;
