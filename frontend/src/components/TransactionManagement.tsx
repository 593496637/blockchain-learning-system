// frontend/src/components/TransactionManagement.tsx

import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Select,
  InputNumber,
  Button,
  message,
  Typography,
  Space,
  Alert,
  Divider,
  Tag,
  Row,
  Col,
  Statistic,
  Empty,
} from 'antd';
import {
  SendOutlined,
  SwapOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  ReloadOutlined,
} from '@ant-design/icons';

import { User, Transaction } from '../types';
import { userApi, transactionApi } from '../api';

const { Title, Text } = Typography;
const { Option } = Select;

/**
 * 交易管理组件
 * 功能: 创建转账交易、查看交易池
 */
const TransactionManagement: React.FC = () => {
  // 状态管理
  const [users, setUsers] = useState<User[]>([]);
  const [pendingTransactions, setPendingTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [form] = Form.useForm();

  /**
   * 加载用户列表
   */
  const loadUsers = async () => {
    try {
      const userList = await userApi.getAllUsers();
      setUsers(userList);
    } catch (error) {
      message.error('加载用户列表失败');
      console.error(error);
    }
  };

  /**
   * 加载待处理交易
   */
  const loadPendingTransactions = async () => {
    setRefreshing(true);
    try {
      const transactions = await transactionApi.getPendingTransactions();
      setPendingTransactions(transactions);
    } catch (error) {
      message.error('加载交易池失败');
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  };

  /**
   * 创建新交易
   */
  const handleCreateTransaction = async (values: { 
    from: string; 
    to: string; 
    amount: number; 
  }) => {
    if (values.from === values.to) {
      message.error('不能向自己转账');
      return;
    }

    setCreating(true);
    try {
      const transactionId = await transactionApi.createTransaction(
        values.from, 
        values.to, 
        values.amount
      );
      
      message.success(`交易创建成功！交易ID: ${transactionId.substring(0, 8)}...`);
      form.resetFields();
      
      // 刷新数据
      loadUsers();
      loadPendingTransactions();
    } catch (error) {
      message.error('创建交易失败');
      console.error(error);
    } finally {
      setCreating(false);
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
   * 格式化时间显示
   */
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  /**
   * 获取用户信息
   */
  const getUserInfo = (address: string) => {
    return users.find(user => user.address === address);
  };

  /**
   * 组件初始化时加载数据
   */
  useEffect(() => {
    loadUsers();
    loadPendingTransactions();
    
    // 设置定时刷新交易池
    const interval = setInterval(loadPendingTransactions, 5000);
    return () => clearInterval(interval);
  }, []);

  // 计算统计数据
  const totalTransactionValue = pendingTransactions.reduce((sum, tx) => sum + tx.amount, 0);
  const totalFees = pendingTransactions.reduce((sum, tx) => sum + tx.fee, 0);

  return (
    <div>
      {/* 页面标题 */}
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0 }}>
          💸 交易管理
        </Title>
        <Text type="secondary">
          创建转账交易，查看交易池中的待处理交易
        </Text>
      </div>

      {/* 交易统计信息 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="待处理交易"
              value={pendingTransactions.length}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="待转账总额"
              value={totalTransactionValue}
              suffix="代币"
              prefix={<SwapOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="待收手续费"
              value={totalFees}
              suffix="代币"
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="活跃用户数"
              value={users.filter(u => u.balance > 0).length}
              suffix={`/ ${users.length}`}
              prefix="👥"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        {/* 创建交易表单 */}
        <Col span={12}>
          <Card title="💰 创建转账" extra={<SendOutlined />}>
            <Alert
              message="交易流程说明"
              description="创建的交易会先进入交易池，等待矿工打包到区块中。交易需要支付手续费给矿工。"
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />

            <Form
              form={form}
              layout="vertical"
              onFinish={handleCreateTransaction}
            >
              <Form.Item
                label="发送方 (从哪个账户转出)"
                name="from"
                rules={[{ required: true, message: '请选择发送方' }]}
              >
                <Select
                  placeholder="请选择发送方"
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {users
                    .filter(user => user.balance > 0.1) // 只显示有足够余额的用户
                    .map(user => (
                    <Option key={user.address} value={user.address}>
                      <Space>
                        <Text strong>{user.name}</Text>
                        <Text type="secondary">({formatAddress(user.address)})</Text>
                        <Tag color="green">{user.balance} 代币</Tag>
                      </Space>
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="接收方 (转到哪个账户)"
                name="to"
                rules={[{ required: true, message: '请选择接收方' }]}
              >
                <Select
                  placeholder="请选择接收方"
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {users.map(user => (
                    <Option key={user.address} value={user.address}>
                      <Space>
                        <Text strong>{user.name}</Text>
                        <Text type="secondary">({formatAddress(user.address)})</Text>
                        <Tag color="blue">{user.balance} 代币</Tag>
                      </Space>
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="转账金额"
                name="amount"
                rules={[
                  { required: true, message: '请输入转账金额' },
                  { type: 'number', min: 0.01, message: '转账金额必须大于0.01' },
                ]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="请输入转账金额"
                  min={0.01}
                  step={0.01}
                  precision={2}
                  addonAfter="代币"
                />
              </Form.Item>

              <Alert
                message="手续费说明"
                description="每笔交易需要支付 0.1 代币作为手续费，手续费将给到打包交易的矿工。"
                type="warning"
                showIcon
                style={{ marginBottom: 16 }}
              />

              <Form.Item style={{ marginBottom: 0 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={creating}
                  icon={<SendOutlined />}
                  block
                  disabled={users.filter(u => u.balance > 0.1).length < 2}
                >
                  {creating ? '创建中...' : '创建交易'}
                </Button>
              </Form.Item>
            </Form>

            {users.filter(u => u.balance > 0.1).length < 2 && (
              <Alert
                message="余额不足"
                description="需要至少2个用户有足够余额(>0.1代币)才能进行转账。请先到代币管理页面分配代币。"
                type="error"
                showIcon
                style={{ marginTop: 16 }}
              />
            )}
          </Card>
        </Col>

        {/* 交易池 */}
        <Col span={12}>
          <Card 
            title="⏳ 交易池 (待处理交易)" 
            extra={
              <Button 
                type="text" 
                icon={<ReloadOutlined />}
                onClick={loadPendingTransactions}
                loading={refreshing}
              >
                刷新
              </Button>
            }
          >
            {pendingTransactions.length > 0 ? (
              <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                {pendingTransactions.map((transaction, index) => (
                  <Card
                    key={transaction.id}
                    size="small"
                    style={{ marginBottom: 8 }}
                    title={`交易 #${index + 1}`}
                  >
                    <Row gutter={8}>
                      <Col span={12}>
                        <div style={{ marginBottom: 4 }}>
                          <Text type="secondary" style={{ fontSize: 12 }}>发送方:</Text>
                          <br />
                          <Text strong style={{ fontSize: 12 }}>
                            {getUserInfo(transaction.from)?.name}
                          </Text>
                        </div>
                      </Col>
                      <Col span={12}>
                        <div style={{ marginBottom: 4 }}>
                          <Text type="secondary" style={{ fontSize: 12 }}>接收方:</Text>
                          <br />
                          <Text strong style={{ fontSize: 12 }}>
                            {getUserInfo(transaction.to)?.name}
                          </Text>
                        </div>
                      </Col>
                    </Row>
                    <Divider style={{ margin: '8px 0' }} />
                    <Space>
                      <Tag color="blue">{transaction.amount} 代币</Tag>
                      <Tag color="orange">手续费: {transaction.fee}</Tag>
                      <Text type="secondary" style={{ fontSize: 11 }}>
                        {formatTime(transaction.timestamp)}
                      </Text>
                    </Space>
                  </Card>
                ))}
              </div>
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <div>
                    <div>交易池为空</div>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      暂无待处理的交易
                    </Text>
                  </div>
                }
              />
            )}
          </Card>
        </Col>
      </Row>

      {/* 交易流程说明 */}
      <Card 
        title="📖 交易流程说明" 
        style={{ marginTop: 16 }}
        type="inner"
      >
        <Row gutter={16}>
          <Col span={6}>
            <div style={{ textAlign: 'center' }}>
              <SendOutlined style={{ fontSize: 24, color: '#1890ff', marginBottom: 8 }} />
              <div><Text strong>1. 创建交易</Text></div>
              <div style={{ marginTop: 4, color: '#666', fontSize: 12 }}>
                用户发起转账，指定接收方和金额
              </div>
            </div>
          </Col>
          <Col span={6}>
            <div style={{ textAlign: 'center' }}>
              <ClockCircleOutlined style={{ fontSize: 24, color: '#fa8c16', marginBottom: 8 }} />
              <div><Text strong>2. 进入交易池</Text></div>
              <div style={{ marginTop: 4, color: '#666', fontSize: 12 }}>
                交易进入池中等待矿工打包
              </div>
            </div>
          </Col>
          <Col span={6}>
            <div style={{ textAlign: 'center' }}>
              <SwapOutlined style={{ fontSize: 24, color: '#52c41a', marginBottom: 8 }} />
              <div><Text strong>3. 矿工打包</Text></div>
              <div style={{ marginTop: 4, color: '#666', fontSize: 12 }}>
                矿工将交易打包到新区块中
              </div>
            </div>
          </Col>
          <Col span={6}>
            <div style={{ textAlign: 'center' }}>
              <DollarOutlined style={{ fontSize: 24, color: '#722ed1', marginBottom: 8 }} />
              <div><Text strong>4. 交易确认</Text></div>
              <div style={{ marginTop: 4, color: '#666', fontSize: 12 }}>
                区块生成后交易正式确认
              </div>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default TransactionManagement;
