// frontend/src/components/UserManagement.tsx

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
  Tooltip,
  Typography,
  Statistic,
  Row,
  Col,
} from 'antd';
import {
  UserAddOutlined,
  EyeOutlined,
  WalletOutlined,
  CopyOutlined,
} from '@ant-design/icons';

import { User, Transaction } from '../types';
import { userApi } from '../api';

const { Title, Text } = Typography;

/**
 * 用户管理组件
 * 功能: 创建用户、查看用户列表、查看用户详情
 */
const UserManagement: React.FC = () => {
  // 状态管理
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userTransactions, setUserTransactions] = useState<Transaction[]>([]);
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
   * 创建新用户
   */
  const handleCreateUser = async (values: { name?: string }) => {
    try {
      await userApi.createUser(values.name);
      message.success('用户创建成功！');
      setCreateModalVisible(false);
      form.resetFields();
      loadUsers(); // 重新加载用户列表
    } catch (error) {
      message.error('创建用户失败');
      console.error(error);
    }
  };

  /**
   * 查看用户详情
   */
  const handleViewUserDetail = async (user: User) => {
    try {
      const { user: userInfo, transactions } = await userApi.getUser(user.address);
      setSelectedUser(userInfo);
      setUserTransactions(transactions);
      setDetailModalVisible(true);
    } catch (error) {
      message.error('获取用户详情失败');
      console.error(error);
    }
  };

  /**
   * 复制地址到剪贴板
   */
  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    message.success('地址已复制到剪贴板');
  };

  /**
   * 格式化地址显示 (只显示前6位和后4位)
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
   * 组件初始化时加载数据
   */
  useEffect(() => {
    loadUsers();
  }, []);

  /**
   * 用户列表表格列配置
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
        <Space>
          <Text code>{formatAddress(address)}</Text>
          <Tooltip title="复制完整地址">
            <Button 
              type="text" 
              size="small" 
              icon={<CopyOutlined />}
              onClick={() => handleCopyAddress(address)}
            />
          </Tooltip>
        </Space>
      ),
    },
    {
      title: '余额',
      dataIndex: 'balance',
      key: 'balance',
      render: (balance: number) => (
        <Tag color={balance > 0 ? 'green' : 'default'}>
          {balance} 代币
        </Tag>
      ),
      sorter: (a: User, b: User) => a.balance - b.balance,
    },
    {
      title: '操作',
      key: 'actions',
      render: (_, record: User) => (
        <Button
          type="primary"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => handleViewUserDetail(record)}
        >
          查看详情
        </Button>
      ),
    },
  ];

  /**
   * 交易历史表格列配置
   */
  const transactionColumns = [
    {
      title: '交易ID',
      dataIndex: 'id',
      key: 'id',
      render: (id: string) => (
        <Text code>{formatAddress(id)}</Text>
      ),
    },
    {
      title: '类型',
      key: 'type',
      render: (_, record: Transaction) => {
        const isReceive = record.to === selectedUser?.address;
        return (
          <Tag color={isReceive ? 'green' : 'orange'}>
            {isReceive ? '收款' : '转账'}
          </Tag>
        );
      },
    },
    {
      title: '对方地址',
      key: 'counterparty',
      render: (_, record: Transaction) => {
        const counterparty = record.from === selectedUser?.address ? record.to : record.from;
        return <Text code>{formatAddress(counterparty)}</Text>;
      },
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number, record: Transaction) => {
        const isReceive = record.to === selectedUser?.address;
        return (
          <Text type={isReceive ? 'success' : 'warning'}>
            {isReceive ? '+' : '-'}{amount} 代币
          </Text>
        );
      },
    },
    {
      title: '手续费',
      dataIndex: 'fee',
      key: 'fee',
      render: (fee: number) => `${fee} 代币`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colorMap = {
          pending: 'orange',
          confirmed: 'green',
          failed: 'red',
        };
        return <Tag color={colorMap[status as keyof typeof colorMap]}>{status}</Tag>;
      },
    },
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp: number) => formatTime(timestamp),
    },
  ];

  // 计算统计数据
  const totalBalance = users.reduce((sum, user) => sum + user.balance, 0);
  const richestUser = users.reduce((prev, current) => (prev.balance > current.balance) ? prev : current, users[0]);

  return (
    <div>
      {/* 页面标题和操作按钮 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0 }}>
          👥 用户管理
        </Title>
        <Button
          type="primary"
          icon={<UserAddOutlined />}
          onClick={() => setCreateModalVisible(true)}
        >
          创建新用户
        </Button>
      </div>

      {/* 统计信息卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总用户数"
              value={users.length}
              prefix={<UserAddOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总代币量"
              value={totalBalance}
              suffix="代币"
              prefix={<WalletOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="最富用户"
              value={richestUser?.name || '无'}
              prefix="👑"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="最高余额"
              value={richestUser?.balance || 0}
              suffix="代币"
            />
          </Card>
        </Col>
      </Row>

      {/* 用户列表表格 */}
      <Card title="用户列表" extra={<Button onClick={loadUsers}>刷新</Button>}>
        <Table
          columns={columns}
          dataSource={users}
          rowKey="address"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 个用户`,
          }}
        />
      </Card>

      {/* 创建用户对话框 */}
      <Modal
        title="创建新用户"
        open={createModalVisible}
        onCancel={() => {
          setCreateModalVisible(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateUser}
        >
          <Form.Item
            label="用户名 (可选)"
            name="name"
            rules={[
              { max: 20, message: '用户名不能超过20个字符' },
            ]}
          >
            <Input placeholder="请输入用户名，留空将自动生成" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Space>
              <Button type="primary" htmlType="submit">
                创建用户
              </Button>
              <Button onClick={() => setCreateModalVisible(false)}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>

        <div style={{ marginTop: 16, padding: 16, background: '#f6f8fa', borderRadius: 8 }}>
          <Text type="secondary">
            💡 提示：系统将自动为新用户生成钱包地址和私钥，初始余额为0。
          </Text>
        </div>
      </Modal>

      {/* 用户详情对话框 */}
      <Modal
        title={`用户详情 - ${selectedUser?.name}`}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        width={800}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            关闭
          </Button>
        ]}
      >
        {selectedUser && (
          <div>
            {/* 用户基本信息 */}
            <Card title="基本信息" style={{ marginBottom: 16 }}>
              <Row gutter={16}>
                <Col span={12}>
                  <div style={{ marginBottom: 12 }}>
                    <Text strong>用户名：</Text>
                    <Text>{selectedUser.name}</Text>
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <Text strong>钱包地址：</Text>
                    <br />
                    <Text code style={{ wordBreak: 'break-all' }}>
                      {selectedUser.address}
                    </Text>
                    <Button 
                      type="text" 
                      size="small" 
                      icon={<CopyOutlined />}
                      onClick={() => handleCopyAddress(selectedUser.address)}
                      style={{ marginLeft: 8 }}
                    />
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ marginBottom: 12 }}>
                    <Text strong>当前余额：</Text>
                    <Tag color="green" style={{ marginLeft: 8 }}>
                      {selectedUser.balance} 代币
                    </Tag>
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <Text strong>私钥：</Text>
                    <br />
                    <Text code type="warning" style={{ wordBreak: 'break-all', fontSize: 12 }}>
                      {selectedUser.privateKey}
                    </Text>
                  </div>
                </Col>
              </Row>
            </Card>

            {/* 交易历史 */}
            <Card title={`交易历史 (${userTransactions.length} 笔)`}>
              {userTransactions.length > 0 ? (
                <Table
                  columns={transactionColumns}
                  dataSource={userTransactions}
                  rowKey="id"
                  pagination={{ pageSize: 5 }}
                  size="small"
                />
              ) : (
                <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>
                  暂无交易记录
                </div>
              )}
            </Card>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserManagement;
