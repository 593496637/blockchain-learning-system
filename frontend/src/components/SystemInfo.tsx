// frontend/src/components/SystemInfo.tsx

import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Progress,
  Tag,
  Space,
  Alert,
  Descriptions,
  Timeline,
  Button,
  message,
  Spin,
  Divider
} from 'antd';
import {
  ClusterOutlined,
  DatabaseOutlined,
  ThunderboltOutlined,
  SafetyOutlined,
  GlobalOutlined,
  ReloadOutlined,
  HeartOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { blockchainApi } from '../api';

interface SystemStats {
  totalUsers: number;
  totalBlocks: number;
  totalTransactions: number;
  totalMiners: number;
  networkHashRate: string;
  difficulty: number;
  uptime: string;
  memoryUsage: number;
  lastBlockTime: string;
}

interface NetworkNode {
  id: string;
  address: string;
  status: 'active' | 'inactive';
  lastSeen: string;
  blockHeight: number;
}

/**
 * 系统信息组件
 * 显示区块链网络的实时状态和统计信息
 */
const SystemInfo: React.FC = () => {
  // 状态管理
  const [loading, setLoading] = useState(true);
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
  const [networkNodes] = useState<NetworkNode[]>([
    {
      id: 'node-1',
      address: '127.0.0.1:3001',
      status: 'active',
      lastSeen: new Date().toISOString(),
      blockHeight: 0
    },
    {
      id: 'node-2',
      address: '127.0.0.1:3002',
      status: 'inactive',
      lastSeen: new Date(Date.now() - 300000).toISOString(),
      blockHeight: 0
    }
  ]);

  /**
   * 获取系统统计信息
   */
  const fetchSystemStats = async () => {
    try {
      setLoading(true);
      
      // 并行获取各种数据
      const [
        users,
        blockchain,
        transactions,
        miners
      ] = await Promise.all([
        blockchainApi.getUsers(),
        blockchainApi.getBlockchain(),
        blockchainApi.getTransactionPool(),
        blockchainApi.getMiners()
      ]);

      // 计算统计信息
      const stats: SystemStats = {
        totalUsers: users.length,
        totalBlocks: blockchain.length,
        totalTransactions: blockchain.reduce((total, block) => total + block.transactions.length, 0),
        totalMiners: miners.length,
        networkHashRate: '1.2 TH/s',
        difficulty: blockchain.length > 0 ? 4 : 0,
        uptime: formatUptime(Date.now() - 1000 * 60 * 60 * 2), // 模拟2小时运行时间
        memoryUsage: Math.random() * 40 + 30, // 模拟内存使用率 30-70%
        lastBlockTime: blockchain.length > 0 ? blockchain[blockchain.length - 1].timestamp : new Date().toISOString()
      };

      setSystemStats(stats);
    } catch (error) {
      console.error('获取系统统计失败:', error);
      message.error('获取系统信息失败');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 格式化运行时间
   */
  const formatUptime = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}小时 ${minutes}分钟`;
  };

  /**
   * 刷新系统信息
   */
  const handleRefresh = () => {
    message.info('正在刷新系统信息...');
    fetchSystemStats();
  };

  /**
   * 组件初始化
   */
  useEffect(() => {
    fetchSystemStats();
    
    // 设置定时刷新
    const interval = setInterval(fetchSystemStats, 30000); // 30秒刷新一次
    
    return () => clearInterval(interval);
  }, []);

  /**
   * 网络节点表格列配置
   */
  const nodeColumns = [
    {
      title: '节点ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
      render: (address: string) => <code>{address}</code>
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? '在线' : '离线'}
        </Tag>
      )
    },
    {
      title: '最后活跃',
      dataIndex: 'lastSeen',
      key: 'lastSeen',
      render: (time: string) => new Date(time).toLocaleString()
    },
    {
      title: '区块高度',
      dataIndex: 'blockHeight',
      key: 'blockHeight',
    }
  ];

  if (loading && !systemStats) {
    return (
      <div style={{ textAlign: 'center', padding: 60 }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>正在加载系统信息...</div>
      </div>
    );
  }

  return (
    <div>
      {/* 页面标题和操作按钮 */}
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, color: '#1890ff' }}>📊 系统信息</h2>
          <p style={{ margin: '8px 0 0 0', color: '#666' }}>
            实时监控区块链网络状态和系统性能指标
          </p>
        </div>
        <Button 
          type="primary" 
          icon={<ReloadOutlined />}
          onClick={handleRefresh}
          loading={loading}
        >
          刷新数据
        </Button>
      </div>

      {/* 系统状态提示 */}
      <Alert
        message="系统运行正常"
        description="所有核心组件运行状态良好，网络连接稳定"
        type="success"
        icon={<HeartOutlined />}
        style={{ marginBottom: 24 }}
        showIcon
      />

      {/* 核心统计指标 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="注册用户"
              value={systemStats?.totalUsers || 0}
              prefix={<ClusterOutlined style={{ color: '#1890ff' }} />}
              suffix="个"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="区块总数"
              value={systemStats?.totalBlocks || 0}
              prefix={<DatabaseOutlined style={{ color: '#52c41a' }} />}
              suffix="个"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="交易总数"
              value={systemStats?.totalTransactions || 0}
              prefix={<ThunderboltOutlined style={{ color: '#faad14' }} />}
              suffix="笔"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="活跃矿工"
              value={systemStats?.totalMiners || 0}
              prefix={<SafetyOutlined style={{ color: '#722ed1' }} />}
              suffix="个"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* 系统性能 */}
        <Col xs={24} lg={12}>
          <Card title="🎯 系统性能" extra={<SettingOutlined />}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span>内存使用率</span>
                  <span>{systemStats?.memoryUsage?.toFixed(1)}%</span>
                </div>
                <Progress 
                  percent={systemStats?.memoryUsage || 0}
                  strokeColor={
                    (systemStats?.memoryUsage || 0) > 80 ? '#ff4d4f' :
                    (systemStats?.memoryUsage || 0) > 60 ? '#faad14' : '#52c41a'
                  }
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span>网络哈希率</span>
                  <span>{systemStats?.networkHashRate}</span>
                </div>
                <Progress percent={75} strokeColor="#1890ff" />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span>挖矿难度</span>
                  <span>级别 {systemStats?.difficulty}</span>
                </div>
                <Progress percent={(systemStats?.difficulty || 0) * 25} strokeColor="#722ed1" />
              </div>
            </Space>
          </Card>
        </Col>

        {/* 系统配置 */}
        <Col xs={24} lg={12}>
          <Card title="⚙️ 系统配置" extra={<GlobalOutlined />}>
            <Descriptions column={1} size="small">
              <Descriptions.Item label="系统版本">v1.0.0</Descriptions.Item>
              <Descriptions.Item label="运行时间">{systemStats?.uptime}</Descriptions.Item>
              <Descriptions.Item label="区块奖励">10 代币</Descriptions.Item>
              <Descriptions.Item label="交易手续费">0.1 代币</Descriptions.Item>
              <Descriptions.Item label="区块间隔">~10分钟</Descriptions.Item>
              <Descriptions.Item label="最大交易数">10笔/区块</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>

      <Divider />

      {/* 网络节点状态 */}
      <Card 
        title="🌐 网络节点" 
        extra={<Tag color="blue">{networkNodes.filter(n => n.status === 'active').length} 个在线</Tag>}
        style={{ marginTop: 16 }}
      >
        <Table
          columns={nodeColumns}
          dataSource={networkNodes}
          rowKey="id"
          pagination={false}
          size="middle"
        />
      </Card>

      {/* 系统时间线 */}
      <Card title="📈 系统活动" style={{ marginTop: 16 }}>
        <Timeline
          items={[
            {
              color: 'green',
              children: (
                <div>
                  <strong>系统启动</strong>
                  <div style={{ color: '#666', fontSize: 12 }}>
                    {new Date(Date.now() - 1000 * 60 * 60 * 2).toLocaleString()}
                  </div>
                </div>
              )
            },
            {
              color: 'blue',
              children: (
                <div>
                  <strong>最新区块生成</strong>
                  <div style={{ color: '#666', fontSize: 12 }}>
                    {systemStats?.lastBlockTime ? new Date(systemStats.lastBlockTime).toLocaleString() : '暂无'}
                  </div>
                </div>
              )
            },
            {
              color: 'orange',
              children: (
                <div>
                  <strong>系统监控启动</strong>
                  <div style={{ color: '#666', fontSize: 12 }}>
                    {new Date().toLocaleString()}
                  </div>
                </div>
              )
            }
          ]}
        />
      </Card>

      {/* 技术架构说明 */}
      <Card title="🏗️ 技术架构" style={{ marginTop: 16 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Card type="inner" title="前端层">
              <ul style={{ paddingLeft: 20, margin: 0 }}>
                <li>React + TypeScript</li>
                <li>Ant Design UI</li>
                <li>响应式设计</li>
                <li>实时数据更新</li>
              </ul>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card type="inner" title="API层">
              <ul style={{ paddingLeft: 20, margin: 0 }}>
                <li>Express.js 服务器</li>
                <li>RESTful API</li>
                <li>CORS 跨域支持</li>
                <li>错误处理机制</li>
              </ul>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card type="inner" title="区块链核心">
              <ul style={{ paddingLeft: 20, margin: 0 }}>
                <li>自定义区块链实现</li>
                <li>PoW 共识机制</li>
                <li>内存数据存储</li>
                <li>SHA-256 哈希算法</li>
              </ul>
            </Card>
          </Col>
        </Row>
      </Card>

      {/* 使用提示 */}
      <Alert
        message="💡 学习提示"
        description={
          <div>
            <p style={{ margin: 0 }}>这是一个教育用的区块链实现，主要特点：</p>
            <ul style={{ margin: '8px 0 0 0', paddingLeft: 20 }}>
              <li>简化的 PoW 共识算法，挖矿难度较低</li>
              <li>内存存储，重启后数据会丢失</li>
              <li>单节点运行，未实现真正的P2P网络</li>
              <li>适合学习区块链基本原理和流程</li>
            </ul>
          </div>
        }
        type="info"
        style={{ marginTop: 16 }}
        showIcon
      />
    </div>
  );
};

export default SystemInfo;
