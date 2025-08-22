// frontend/src/components/BlockExplorer.tsx

import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Typography,
  Tag,
  Space,
  Button,
  Modal,
  Row,
  Col,
  Statistic,
  Timeline,
  Descriptions,
  Alert,
  Empty,
  Input,
} from 'antd';
import {
  BlockOutlined,
  EyeOutlined,
  ClockCircleOutlined,
  LinkOutlined,
  SearchOutlined,
  HistoryOutlined,
  TransactionOutlined,
  UserOutlined,
} from '@ant-design/icons';

import { Block, Transaction } from '../types';
import { blockchainApi } from '../api';

const { Title, Text } = Typography;
const { Search } = Input;

/**
 * 区块浏览器组件
 * 功能: 查看区块链、区块详情、交易历史
 */
const BlockExplorer: React.FC = () => {
  // 状态管理
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(false);
  const [blockDetailVisible, setBlockDetailVisible] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [searchValue, setSearchValue] = useState('');

  /**
   * 加载区块链数据
   */
  const loadBlocks = async () => {
    setLoading(true);
    try {
      const blockList = await blockchainApi.getAllBlocks();
      // 按区块高度降序排列 (最新的在前面)
      const sortedBlocks = blockList.sort((a, b) => b.index - a.index);
      setBlocks(sortedBlocks);
    } catch (error) {
      console.error('加载区块链失败:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 查看区块详情
   */
  const handleViewBlockDetail = async (block: Block) => {
    setSelectedBlock(block);
    setBlockDetailVisible(true);
  };

  /**
   * 搜索区块
   */
  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  /**
   * 格式化地址显示
   */
  const formatAddress = (address: string) => {
    if (!address || address.length < 10) return address;
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  /**
   * 格式化哈希显示
   */
  const formatHash = (hash: string) => {
    if (!hash || hash.length < 16) return hash;
    return `${hash.substring(0, 8)}...${hash.substring(hash.length - 8)}`;
  };

  /**
   * 格式化时间显示
   */
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  /**
   * 组件初始化时加载数据
   */
  useEffect(() => {
    loadBlocks();
    
    // 设置定时刷新
    const interval = setInterval(loadBlocks, 10000);
    return () => clearInterval(interval);
  }, []);

  /**
   * 过滤区块数据 (根据搜索条件)
   */
  const filteredBlocks = blocks.filter(block => {
    if (!searchValue) return true;
    
    const searchLower = searchValue.toLowerCase();
    return (
      block.index.toString().includes(searchLower) ||
      block.hash.toLowerCase().includes(searchLower) ||
      block.miner.toLowerCase().includes(searchLower) ||
      block.transactions.some(tx => 
        tx.id.toLowerCase().includes(searchLower) ||
        tx.from.toLowerCase().includes(searchLower) ||
        tx.to.toLowerCase().includes(searchLower)
      )
    );
  });

  /**
   * 区块列表表格列配置
   */
  const columns = [
    {
      title: '区块高度',
      dataIndex: 'index',
      key: 'index',
      render: (index: number) => (
        <Tag color="blue" style={{ fontFamily: 'monospace' }}>
          # {index}
        </Tag>
      ),
      sorter: (a: Block, b: Block) => b.index - a.index,
    },
    {
      title: '区块哈希',
      dataIndex: 'hash',
      key: 'hash',
      render: (hash: string) => (
        <Text code>{formatHash(hash)}</Text>
      ),
    },
    {
      title: '前区块哈希',
      dataIndex: 'previousHash',
      key: 'previousHash',
      render: (previousHash: string) => (
        <Text code type="secondary">
          {previousHash === '0' ? '创世块' : formatHash(previousHash)}
        </Text>
      ),
    },
    {
      title: '矿工',
      dataIndex: 'miner',
      key: 'miner',
      render: (miner: string) => (
        <Text strong>
          {miner === 'system' ? '系统' : formatAddress(miner)}
        </Text>
      ),
    },
    {
      title: '交易数量',
      key: 'transactionCount',
      render: (_, record: Block) => (
        <Tag color="green">
          <TransactionOutlined /> {record.transactions.length} 笔
        </Tag>
      ),
    },
    {
      title: '奖励',
      dataIndex: 'reward',
      key: 'reward',
      render: (reward: number) => (
        <Tag color="gold">{reward} 代币</Tag>
      ),
    },
    {
      title: '随机数',
      dataIndex: 'nonce',
      key: 'nonce',
      render: (nonce: number) => (
        <Text code type="secondary">{nonce}</Text>
      ),
    },
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp: number) => formatTime(timestamp),
    },
    {
      title: '操作',
      key: 'actions',
      render: (_, record: Block) => (
        <Button
          type="primary"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => handleViewBlockDetail(record)}
        >
          查看详情
        </Button>
      ),
    },
  ];

  // 计算统计数据
  const totalBlocks = blocks.length;
  const totalTransactions = blocks.reduce((sum, block) => sum + block.transactions.length, 0);
  const latestBlock = blocks.find(block => block.index === Math.max(...blocks.map(b => b.index)));
  const averageTransactionsPerBlock = totalBlocks > 0 ? totalTransactions / totalBlocks : 0;

  return (
    <div>
      {/* 页面标题和搜索 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={3} style={{ margin: 0 }}>
            🔍 区块浏览器
          </Title>
          <Text type="secondary">
            浏览区块链，查看区块和交易详情
          </Text>
        </div>
        <Search
          placeholder="搜索区块高度、哈希或交易..."
          allowClear
          style={{ width: 300 }}
          onSearch={handleSearch}
          onChange={(e) => !e.target.value && setSearchValue('')}
        />
      </div>

      {/* 区块链统计信息 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="区块高度"
              value={totalBlocks > 0 ? totalBlocks - 1 : 0}
              prefix={<BlockOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总交易数"
              value={totalTransactions}
              prefix={<TransactionOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="平均交易/区块"
              value={averageTransactionsPerBlock}
              precision={1}
              prefix={<HistoryOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="最新区块时间"
              value={latestBlock ? formatTime(latestBlock.timestamp).split(' ')[1] : '--'}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* 最新区块信息 */}
      {latestBlock && (
        <Alert
          message={`⚡ 最新区块: #${latestBlock.index}`}
          description={`哈希: ${latestBlock.hash.substring(0, 20)}..., 包含 ${latestBlock.transactions.length} 笔交易`}
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      {/* 区块列表 */}
      <Card 
        title="区块链" 
        extra={
          <Space>
            <Text type="secondary">
              {searchValue && `搜索结果: ${filteredBlocks.length} 个区块`}
            </Text>
            <Button onClick={loadBlocks} loading={loading}>
              刷新
            </Button>
          </Space>
        }
      >
        {blocks.length > 0 ? (
          <Table
            columns={columns}
            dataSource={filteredBlocks}
            rowKey="index"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 个区块`,
            }}
          />
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="区块链为空"
          />
        )}
      </Card>

      {/* 区块详情对话框 */}
      <Modal
        title={`区块详情 - #${selectedBlock?.index}`}
        open={blockDetailVisible}
        onCancel={() => setBlockDetailVisible(false)}
        width={1000}
        footer={[
          <Button key="close" onClick={() => setBlockDetailVisible(false)}>
            关闭
          </Button>
        ]}
      >
        {selectedBlock && (
          <div>
            {/* 区块基本信息 */}
            <Card title="区块信息" style={{ marginBottom: 16 }}>
              <Descriptions column={2} bordered>
                <Descriptions.Item label="区块高度">
                  <Tag color="blue"># {selectedBlock.index}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="时间戳">
                  {formatTime(selectedBlock.timestamp)}
                </Descriptions.Item>
                <Descriptions.Item label="区块哈希" span={2}>
                  <Text code copyable style={{ wordBreak: 'break-all' }}>
                    {selectedBlock.hash}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="前区块哈希" span={2}>
                  <Text code copyable style={{ wordBreak: 'break-all' }}>
                    {selectedBlock.previousHash === '0' ? '创世块' : selectedBlock.previousHash}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="矿工">
                  <Text strong>
                    {selectedBlock.miner === 'system' ? '系统' : selectedBlock.miner}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="随机数">
                  <Text code>{selectedBlock.nonce}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="区块奖励">
                  <Tag color="gold">{selectedBlock.reward} 代币</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="交易数量">
                  <Tag color="green">{selectedBlock.transactions.length} 笔</Tag>
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* 交易列表 */}
            <Card title={`交易列表 (${selectedBlock.transactions.length} 笔)`}>
              {selectedBlock.transactions.length > 0 ? (
                <Timeline>
                  {selectedBlock.transactions.map((transaction, index) => (
                    <Timeline.Item
                      key={transaction.id}
                      dot={<TransactionOutlined style={{ fontSize: 16 }} />}
                      color="blue"
                    >
                      <Card size="small" style={{ marginBottom: 8 }}>
                        <Row gutter={16}>
                          <Col span={12}>
                            <div style={{ marginBottom: 8 }}>
                              <Text strong>交易 #{index + 1}</Text>
                              <Tag color="blue" style={{ marginLeft: 8 }}>
                                {transaction.status}
                              </Tag>
                            </div>
                            <div style={{ marginBottom: 4 }}>
                              <Text type="secondary">交易ID: </Text>
                              <Text code style={{ fontSize: 12 }}>
                                {formatHash(transaction.id)}
                              </Text>
                            </div>
                            <div style={{ marginBottom: 4 }}>
                              <Text type="secondary">发送方: </Text>
                              <Text code>{formatAddress(transaction.from)}</Text>
                            </div>
                            <div>
                              <Text type="secondary">接收方: </Text>
                              <Text code>{formatAddress(transaction.to)}</Text>
                            </div>
                          </Col>
                          <Col span={12}>
                            <div style={{ marginBottom: 4 }}>
                              <Text type="secondary">金额: </Text>
                              <Tag color="green">{transaction.amount} 代币</Tag>
                            </div>
                            <div style={{ marginBottom: 4 }}>
                              <Text type="secondary">手续费: </Text>
                              <Tag color="orange">{transaction.fee} 代币</Tag>
                            </div>
                            <div>
                              <Text type="secondary">时间: </Text>
                              <Text>{formatTime(transaction.timestamp)}</Text>
                            </div>
                          </Col>
                        </Row>
                      </Card>
                    </Timeline.Item>
                  ))}
                </Timeline>
              ) : (
                <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>
                  此区块无交易记录
                </div>
              )}
            </Card>
          </div>
        )}
      </Modal>

      {/* 区块链结构说明 */}
      <Card 
        title="📖 区块链结构说明" 
        style={{ marginTop: 16 }}
        type="inner"
      >
        <Row gutter={16}>
          <Col span={6}>
            <div style={{ textAlign: 'center' }}>
              <BlockOutlined style={{ fontSize: 24, color: '#1890ff', marginBottom: 8 }} />
              <div><Text strong>区块结构</Text></div>
              <div style={{ marginTop: 4, color: '#666', fontSize: 12 }}>
                每个区块包含区块头和交易列表
              </div>
            </div>
          </Col>
          <Col span={6}>
            <div style={{ textAlign: 'center' }}>
              <LinkOutlined style={{ fontSize: 24, color: '#52c41a', marginBottom: 8 }} />
              <div><Text strong>哈希链接</Text></div>
              <div style={{ marginTop: 4, color: '#666', fontSize: 12 }}>
                每个区块都包含前一个区块的哈希
              </div>
            </div>
          </Col>
          <Col span={6}>
            <div style={{ textAlign: 'center' }}>
              <TransactionOutlined style={{ fontSize: 24, color: '#722ed1', marginBottom: 8 }} />
              <div><Text strong>交易记录</Text></div>
              <div style={{ marginTop: 4, color: '#666', fontSize: 12 }}>
                区块中包含所有已确认的交易
              </div>
            </div>
          </Col>
          <Col span={6}>
            <div style={{ textAlign: 'center' }}>
              <UserOutlined style={{ fontSize: 24, color: '#fa8c16', marginBottom: 8 }} />
              <div><Text strong>矿工信息</Text></div>
              <div style={{ marginTop: 4, color: '#666', fontSize: 12 }}>
                记录了挖出此区块的矿工地址
              </div>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default BlockExplorer;
