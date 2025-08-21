// frontend/src/components/TokenManagement.tsx

import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Select,
  InputNumber,
  Button,
  message,
  Table,
  Typography,
  Space,
  Alert,
  Divider,
  Statistic,
  Row,
  Col,
  Tag,
} from 'antd';
import {
  DollarOutlined,
  SendOutlined,
  UserOutlined,
  WalletOutlined,
} from '@ant-design/icons';

import { User } from '../types';
import { userApi, tokenApi } from '../api';

const { Title, Text } = Typography;
const { Option } = Select;

/**
 * 代币管理组件
 * 功能: 手动分配代币给用户
 */
const TokenManagement: React.FC = () => {
  // 状态管理
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [allocating, setAllocating] = useState(false);
  const [form] = Form.useForm();

  /**
   * 加载用户列表
   */
  const loadUsers = async () => {
    setLoading(true);
    try {
      const userList = await userApi.getAllUsers();
      setUsers(userList);
    } catch (error) {
      message.error('加载用户列表失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 分配代币
   */
  const handleAllocateTokens = async (values: { userAddress: string; amount: number }) => {
    setAllocating(true);
    try {
      await tokenApi.allocateTokens(values.userAddress, values.amount);
      message.success(`成功向用户分配 ${values.amount} 个代币！`);
      form.resetFields();
      loadUsers(); // 重新加载用户列表以更新余额
    } catch (error) {
      message.error('分配代币失败');
      console.error(error);
    } finally {
      setAllocating(false);
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
    loadUsers();
  }, []);

  /**
   * 用户余额表格列配置
   */
  const columns = [
    {
      title: '用户名',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => (
        <Text strong>{name || '未命名用户'}</Text>
      ),
    },
    {
      title: '钱包地址',
      dataIndex: 'address',
      key: 'address',
      render: (address: string) => (
        <Text code>{formatAddress(address)}</Text>
      ),
    },
    {
      title: '当前余额',
      dataIndex: 'balance',
      key: 'balance',
      render: (balance: number) => (
        <Tag color={balance > 0 ? 'green' : 'default'}>
          <WalletOutlined /> {balance} 代币
        </Tag>
      ),
      sorter: (a: User, b: User) => b.balance - a.balance,
    },
    {
      title: '操作',
      key: 'actions',
      render: (_, record: User) => (
        <Button
          type="link"
          onClick={() => {
            form.setFieldsValue({ userAddress: record.address });
          }}
        >
          选择此用户
        </Button>
      ),
    },
  ];

  // 计算统计数据
  const totalSupply = users.reduce((sum, user) => sum + user.balance, 0);
  const averageBalance = users.length > 0 ? totalSupply / users.length : 0;
  const usersWithBalance = users.filter(user => user.balance > 0).length;

  return (
    <div>
      {/* 页面标题 */}
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0 }}>
          💰 代币管理
        </Title>
        <Text type="secondary">
          管理员可以手动向用户分配代币，代币也可以通过挖矿获得
        </Text>
      </div>

      {/* 代币统计信息 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="代币总供应量"
              value={totalSupply}
              suffix="代币"
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="平均余额"
              value={averageBalance}
              precision={2}
              suffix="代币"
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="有余额用户"
              value={usersWithBalance}
              suffix={`/ ${users.length}`}
              prefix={<WalletOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="最高余额"
              value={Math.max(...users.map(u => u.balance), 0)}
              suffix="代币"
              prefix="👑"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        {/* 分配代币表单 */}
        <Col span={12}>
          <Card title="🎁 分配代币" extra={<DollarOutlined />}>
            <Alert
              message="管理员功能"
              description="这是管理员专用功能，可以直接向任何用户分配代币。在真实的区块链系统中，代币通常通过挖矿、空投或购买获得。"
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />

            <Form
              form={form}
              layout="vertical"
              onFinish={handleAllocateTokens}
            >
              <Form.Item
                label="选择用户"
                name="userAddress"
                rules={[{ required: true, message: '请选择要分配代币的用户' }]}
              >
                <Select
                  placeholder="请选择用户"
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
                label="分配数量"
                name="amount"
                rules={[
                  { required: true, message: '请输入要分配的代币数量' },
                  { type: 'number', min: 0.01, message: '分配数量必须大于0.01' },
                  { type: 'number', max: 10000, message: '单次分配不能超过10000代币' },
                ]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="请输入分配数量"
                  min={0.01}
                  max={10000}
                  step={1}
                  precision={2}
                  addonAfter="代币"
                />
              </Form.Item>

              <Form.Item style={{ marginBottom: 0 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={allocating}
                  icon={<SendOutlined />}
                  block
                >
                  {allocating ? '分配中...' : '确认分配'}
                </Button>
              </Form.Item>
            </Form>

            <Divider />

            {/* 快速分配按钮 */}
            <div>
              <Text strong style={{ marginBottom: 8, display: 'block' }}>
                快速分配：
              </Text>
              <Space wrap>
                <Button
                  size="small"
                  onClick={() => form.setFieldsValue({ amount: 10 })}
                >
                  10代币
                </Button>
                <Button
                  size="small"
                  onClick={() => form.setFieldsValue({ amount: 50 })}
                >
                  50代币
                </Button>
                <Button
                  size="small"
                  onClick={() => form.setFieldsValue({ amount: 100 })}
                >
                  100代币
                </Button>
                <Button
                  size="small"
                  onClick={() => form.setFieldsValue({ amount: 500 })}
                >
                  500代币
                </Button>
              </Space>
            </div>
          </Card>
        </Col>

        {/* 用户余额列表 */}
        <Col span={12}>
          <Card 
            title="💳 用户余额" 
            extra={
              <Button 
                type="text" 
                onClick={loadUsers}
                loading={loading}
              >
                刷新
              </Button>
            }
          >
            <Table
              columns={columns}
              dataSource={users}
              rowKey="address"
              loading={loading}
              size="small"
              pagination={{
                pageSize: 8,
                showSizeChanger: false,
                showTotal: (total) => `共 ${total} 个用户`,
              }}
              scroll={{ y: 400 }}
            />

            {users.length === 0 && !loading && (
              <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>
                <UserOutlined style={{ fontSize: 48, marginBottom: 16 }} />
                <div>暂无用户数据</div>
                <div style={{ marginTop: 8 }}>
                  <Text type="secondary">请先到用户管理页面创建用户</Text>
                </div>
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* 代币经济说明 */}
      <Card 
        title="📖 代币经济说明" 
        style={{ marginTop: 16 }}
        type="inner"
      >
        <Row gutter={16}>
          <Col span={8}>
            <div>
              <Text strong>🎁 手动分配</Text>
              <div style={{ marginTop: 8, color: '#666' }}>
                管理员可以直接向用户分配代币，这通常用于系统初始化、空投活动或测试目的。
              </div>
            </div>
          </Col>
          <Col span={8}>
            <div>
              <Text strong>⛏️ 挖矿奖励</Text>
              <div style={{ marginTop: 8, color: '#666' }}>
                矿工通过挖矿获得新产生的代币奖励，这是区块链系统中代币的主要来源。
              </div>
            </div>
          </Col>
          <Col span={8}>
            <div>
              <Text strong>💸 转账消耗</Text>
              <div style={{ marginTop: 8, color: '#666' }}>
                用户转账时需要支付手续费，手续费会转给矿工作为打包交易的激励。
              </div>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default TokenManagement;
