// frontend/src/components/MinerManagement.tsx

import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Space,
  Tag,
  Typography,
  Statistic,
  Row,
  Col,
  Alert,
  Progress,
  Divider,
  Empty,
  Spin,
} from 'antd';
import {
  ToolOutlined,
  PlusOutlined,
  PlayCircleOutlined,
  TrophyOutlined,
  DollarOutlined,
  BlockOutlined,
  ThunderboltOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';

import { Miner, Transaction } from '../types';
import { minerApi, transactionApi } from '../api';

const { Title, Text } = Typography;

/**
 * 矿工管理组件
 * 功能: 注册矿工、查看矿工列表、执行挖矿
 */
const MinerManagement: React.FC = () => {
  // 状态管理
  const [miners, setMiners] = useState<Miner[]>([]);
  const [pendingTransactions, setPendingTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [mining, setMining] = useState<string | null>(null); // 正在挖矿的矿工地址
  const [registerModalVisible, setRegisterModalVisible] = useState(false);
  const [form] = Form.useForm();

  /**
   * 加载矿工列表
   */
  const loadMiners = async () => {
    setLoading(true);
    try {
      const minerList = await minerApi.getAllMiners();
      setMiners(minerList);
    } catch (error) {
      message.error('加载矿工列表失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 加载待处理交易
   */
  const loadPendingTransactions = async () => {
    try {
      const transactions = await transactionApi.getPendingTransactions();
      setPendingTransactions(transactions);
    } catch (error) {
      console.error('加载交易池失败:', error);
    }
  };

  /**
   * 注册新矿工
   */
  const handleRegisterMiner = async (values: { name: string }) => {
    try {
      const minerAddress = await minerApi.registerMiner(values.name);
      message.success(`矿工注册成功！地址: ${minerAddress.substring(0, 8)}...`);
      setRegisterModalVisible(false);
      form.resetFields();
      loadMiners(); // 重新加载矿工列表
    } catch (error) {
      message.error('注册矿工失败');
      console.error(error);
    }
  };

  /**
   * 执行挖矿
   */
  const handleMining = async (minerAddress: string, minerName: string) => {
    if (pendingTransactions.length === 0) {
      message.warning('交易池为空，无法挖矿！请先创建一些交易。');
      return;
    }

    setMining(minerAddress);
    const startTime = Date.now();
    
    try {
      message.loading(`${minerName} 正在挖矿中...`, 0);
      const newBlock = await minerApi.mineBlock(minerAddress);
      const miningTime = Date.now() - startTime;
      
      message.destroy();
      message.success(
        `🎉 挖矿成功！${minerName} 挖出了第 ${newBlock.index} 号区块，耗时 ${miningTime}ms`
      );
      
      // 刷新数据
      loadMiners();
      loadPendingTransactions();
      
    } catch (error) {
      message.destroy();
      message.error(`挖矿失败: ${error instanceof Error ? error.message : '未知错误'}`);
      console.error(error);
    } finally {
      setMining(null);
    }
  };

  /**
   * 格式化地址显示
   */
  const formatAddress = (address: string) => {
    if (!address || address.length < 10) return address;
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  /**
   * 组件初始化时加载数据
   */
  useEffect(() => {
    loadMiners();
    loadPendingTransactions();
    
    // 设置定时刷新
    const interval = setInterval(() => {
      loadPendingTransactions();
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  /**
   * 矿工列表表格列配置
   */
  const columns = [
    {
      title: '矿工名称',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: Miner) => (
        <div>
          <Text strong>{name}</Text>
          {!record.isActive && (
            <Tag color="red" style={{ marginLeft: 8 }}>离线</Tag>
          )}
        </div>
      ),
    },
    {
      title: '矿工地址',
      dataIndex: 'address',
      key: 'address',
      render: (address: string) => (
        <Text code>{formatAddress(address)}</Text>
      ),
    },
    {
      title: '挖出区块数',
      dataIndex: 'blocksMinedCount',
      key: 'blocksMinedCount',
      render: (count: number) => (
        <Tag color="blue" icon={<BlockOutlined />}>
          {count} 个区块
        </Tag>
      ),
      sorter: (a: Miner, b: Miner) => b.blocksMinedCount - a.blocksMinedCount,
    },
    {
      title: '总奖励',
      dataIndex: 'totalRewards',
      key: 'totalRewards',
      render: (rewards: number) => (
        <Tag color="gold" icon={<TrophyOutlined />}>
          {rewards} 代币
        </Tag>
      ),
      sorter: (a: Miner, b: Miner) => b.totalRewards - a.totalRewards,
    },
    {
      title: '状态',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? '在线' : '离线'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'actions',
      render: (_, record: Miner) => (
        <Button
          type="primary"
          size="small"
          icon={<ThunderboltOutlined />}
          loading={mining === record.address}
          disabled={!record.isActive || mining !== null}
          onClick={() => handleMining(record.address, record.name)}
        >
          {mining === record.address ? '挖矿中...' : '开始挖矿'}
        </Button>
      ),
    },
  ];

  // 计算统计数据
  const totalMiners = miners.length;
  const activeMiners = miners.filter(m => m.isActive).length;
  const totalBlocksMined = miners.reduce((sum, miner) => sum + miner.blocksMinedCount, 0);
  const totalRewardsDistributed = miners.reduce((sum, miner) => sum + miner.totalRewards, 0);
  const topMiner = miners.reduce((prev, current) => 
    (prev.blocksMinedCount > current.blocksMinedCount) ? prev : current, miners[0]
  );

  return (
    <div>
      {/* 页面标题和操作按钮 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={3} style={{ margin: 0 }}>
            ⛏️ 矿工管理
          </Title>
          <Text type="secondary">
            管理矿工，执行挖矿操作打包交易
          </Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setRegisterModalVisible(true)}
        >
          注册新矿工
        </Button>
      </div>

      {/* 挖矿统计信息 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总矿工数"
              value={totalMiners}
              prefix={<ToolOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="活跃矿工"
              value={activeMiners}
              suffix={`/ ${totalMiners}`}
              prefix={<PlayCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已挖区块数"
              value={totalBlocksMined}
              prefix={<BlockOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总奖励发放"
              value={totalRewardsDistributed}
              suffix="代币"
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 挖矿状态和交易池信息 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <Card 
            title="💎 挖矿状态" 
            extra={<ThunderboltOutlined />}
          >
            {mining ? (
              <div style={{ textAlign: 'center', padding: 20 }}>
                <Spin size="large" />
                <div style={{ marginTop: 16 }}>
                  <Text strong>
                    {miners.find(m => m.address === mining)?.name} 正在挖矿中...
                  </Text>
                </div>
                <div style={{ marginTop: 8 }}>
                  <Text type="secondary">
                    正在寻找满足难度要求的随机数
                  </Text>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: 20 }}>
                <PlayCircleOutlined style={{ fontSize: 48, color: '#52c41a', marginBottom: 16 }} />
                <div>
                  <Text strong>准备就绪</Text>
                </div>
                <div style={{ marginTop: 8 }}>
                  <Text type="secondary">
                    选择矿工开始挖矿
                  </Text>
                </div>
              </div>
            )}
          </Card>
        </Col>
        <Col span={12}>
          <Card 
            title="📦 交易池状态" 
            extra={<ClockCircleOutlined />}
          >
            <div style={{ textAlign: 'center', padding: 20 }}>
              <div style={{ fontSize: 36, fontWeight: 'bold', color: '#fa8c16', marginBottom: 8 }}>
                {pendingTransactions.length}
              </div>
              <div>
                <Text strong>待处理交易</Text>
              </div>
              <div style={{ marginTop: 16 }}>
                {pendingTransactions.length > 0 ? (
                  <Progress
                    percent={Math.min(pendingTransactions.length * 10, 100)}
                    strokeColor="#fa8c16"
                    format={() => `${pendingTransactions.length} 笔`}
                  />
                ) : (
                  <Text type="secondary">暂无待处理交易</Text>
                )}
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 最佳矿工展示 */}
      {topMiner && (
        <Alert
          message={`🏆 最佳矿工: ${topMiner.name}`}
          description={`已挖出 ${topMiner.blocksMinedCount} 个区块，获得 ${topMiner.totalRewards} 代币奖励`}
          type="success"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      {/* 矿工列表表格 */}
      <Card title="矿工列表" extra={<Button onClick={loadMiners}>刷新</Button>}>
        {miners.length > 0 ? (
          <Table
            columns={columns}
            dataSource={miners}
            rowKey="address"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 个矿工`,
            }}
          />
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div>
                <div>暂无矿工</div>
                <Text type="secondary">请先注册矿工</Text>
              </div>
            }
          />
        )}
      </Card>

      {/* 注册矿工对话框 */}
      <Modal
        title="注册新矿工"
        open={registerModalVisible}
        onCancel={() => {
          setRegisterModalVisible(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleRegisterMiner}
        >
          <Form.Item
            label="矿工名称"
            name="name"
            rules={[
              { required: true, message: '请输入矿工名称' },
              { min: 2, message: '矿工名称至少2个字符' },
              { max: 20, message: '矿工名称不能超过20个字符' },
            ]}
          >
            <Input placeholder="请输入矿工名称" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Space>
              <Button type="primary" htmlType="submit">
                注册矿工
              </Button>
              <Button onClick={() => setRegisterModalVisible(false)}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>

        <Divider />
        
        <Alert
          message="矿工说明"
          description="矿工负责打包交易到区块中，成功挖出区块后将获得区块奖励和交易手续费。"
          type="info"
          showIcon
        />
      </Modal>

      {/* 挖矿流程说明 */}
      <Card 
        title="📖 挖矿流程说明" 
        style={{ marginTop: 16 }}
        type="inner"
      >
        <Row gutter={16}>
          <Col span={6}>
            <div style={{ textAlign: 'center' }}>
              <ClockCircleOutlined style={{ fontSize: 24, color: '#fa8c16', marginBottom: 8 }} />
              <div><Text strong>1. 收集交易</Text></div>
              <div style={{ marginTop: 4, color: '#666', fontSize: 12 }}>
                从交易池获取待处理交易
              </div>
            </div>
          </Col>
          <Col span={6}>
            <div style={{ textAlign: 'center' }}>
              <BlockOutlined style={{ fontSize: 24, color: '#1890ff', marginBottom: 8 }} />
              <div><Text strong>2. 打包区块</Text></div>
              <div style={{ marginTop: 4, color: '#666', fontSize: 12 }}>
                将交易组装成新区块
              </div>
            </div>
          </Col>
          <Col span={6}>
            <div style={{ textAlign: 'center' }}>
              <ThunderboltOutlined style={{ fontSize: 24, color: '#722ed1', marginBottom: 8 }} />
              <div><Text strong>3. 计算哈希</Text></div>
              <div style={{ marginTop: 4, color: '#666', fontSize: 12 }}>
                寻找满足难度的随机数
              </div>
            </div>
          </Col>
          <Col span={6}>
            <div style={{ textAlign: 'center' }}>
              <TrophyOutlined style={{ fontSize: 24, color: '#52c41a', marginBottom: 8 }} />
              <div><Text strong>4. 获得奖励</Text></div>
              <div style={{ marginTop: 4, color: '#666', fontSize: 12 }}>
                成功后获得区块奖励
              </div>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default MinerManagement;
