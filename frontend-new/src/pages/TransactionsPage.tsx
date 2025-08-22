import React, { useState } from 'react';
import { Card, Table, Button, Form, Modal, Select, InputNumber, Space, Tag, Tooltip, Alert } from 'antd';
import { SendOutlined, ReloadOutlined, ClockCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useUsers, usePendingTransactions, useCreateTransaction } from '@/hooks/useApi';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import type { Transaction, User } from '@/types';
import type { ColumnsType } from 'antd/es/table';

export const TransactionsPage: React.FC = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  const { data: users = [] } = useUsers();
  const { data: pendingTransactions = [], isLoading, refetch } = usePendingTransactions();
  const createTransactionMutation = useCreateTransaction();

  // 处理创建交易
  const handleCreateTransaction = async (values: { from: string; to: string; amount: number }) => {
    try {
      await createTransactionMutation.mutateAsync(values);
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('创建交易失败:', error);
    }
  };

  // 格式化时间
  const formatTime = (timestamp: number) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true, locale: zhCN });
    } catch {
      return '未知时间';
    }
  };

  // 获取用户显示名称
  const getUserDisplayName = (address: string) => {
    const user = users.find(u => u.address === address);
    return user?.name || `${address.slice(0, 8)}...${address.slice(-8)}`;
  };

  // 计算手续费
  const calculateFee = (amount: number) => {
    return Math.max(0.1, amount * 0.01); // 最低0.1，或金额的1%
  };

  // 表格列定义
  const columns: ColumnsType<Transaction> = [
    {
      title: '交易ID',
      dataIndex: 'id',
      key: 'id',
      width: 120,
      render: (id: string) => (
        <Tooltip title={id}>
          <code style={{ 
            background: '#f5f5f5', 
            padding: '2px 6px', 
            borderRadius: 4,
            fontSize: 12
          }}>
            {id.slice(0, 8)}...
          </code>
        </Tooltip>
      ),
    },
    {
      title: '发送方',
      dataIndex: 'from',
      key: 'from',
      render: (from: string) => (
        <div>
          <div style={{ fontWeight: 500 }}>{getUserDisplayName(from)}</div>
          <div style={{ fontSize: 12, color: '#8c8c8c', fontFamily: 'monospace' }}>
            {from.slice(0, 8)}...{from.slice(-8)}
          </div>
        </div>
      ),
    },
    {
      title: '接收方',
      dataIndex: 'to',
      key: 'to',
      render: (to: string) => (
        <div>
          <div style={{ fontWeight: 500 }}>{getUserDisplayName(to)}</div>
          <div style={{ fontSize: 12, color: '#8c8c8c', fontFamily: 'monospace' }}>
            {to.slice(0, 8)}...{to.slice(-8)}
          </div>
        </div>
      ),
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => (
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontWeight: 'bold', color: '#1890ff' }}>
            {amount.toFixed(2)}
          </div>
          <div style={{ fontSize: 12, color: '#8c8c8c' }}>代币</div>
        </div>
      ),
    },
    {
      title: '手续费',
      dataIndex: 'fee',
      key: 'fee',
      render: (fee: number) => (
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: '#fa8c16' }}>
            {fee.toFixed(2)}
          </div>
          <div style={{ fontSize: 12, color: '#8c8c8c' }}>代币</div>
        </div>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusConfig = {
          pending: { color: 'orange', icon: <ClockCircleOutlined />, text: '待处理' },
          confirmed: { color: 'green', icon: <CheckCircleOutlined />, text: '已确认' },
          failed: { color: 'red', icon: <ClockCircleOutlined />, text: '已失败' },
        };
        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
        
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp: number) => (
        <div style={{ fontSize: 12 }}>
          <div>{formatTime(timestamp)}</div>
          <div style={{ color: '#8c8c8c' }}>
            {new Date(timestamp).toLocaleString()}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* 页面头部 */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ marginBottom: 8 }}>💸 交易管理</h2>
        <p style={{ color: '#666', marginBottom: 16 }}>
          创建和管理区块链交易，查看交易池状态和手续费机制
        </p>
        
        <Space wrap>
          <Button 
            type="primary" 
            icon={<SendOutlined />}
            onClick={() => setIsModalVisible(true)}
            disabled={users.length < 2}
          >
            创建交易
          </Button>
          <Button 
            icon={<ReloadOutlined />}
            onClick={() => refetch()}
            loading={isLoading}
          >
            刷新交易池
          </Button>
        </Space>
        
        {users.length < 2 && (
          <Alert
            style={{ marginTop: 16 }}
            message="需要至少2个用户才能创建交易"
            description="请先在用户管理页面创建更多用户账户"
            type="warning"
            showIcon
          />
        )}
      </div>

      {/* 统计卡片 */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <ClockCircleOutlined style={{ fontSize: 24, color: '#fa8c16', marginBottom: 8 }} />
              <div style={{ fontSize: 24, fontWeight: 'bold', color: '#fa8c16' }}>
                {pendingTransactions.length}
              </div>
              <div style={{ color: '#666' }}>待处理交易</div>
            </div>
          </Card>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1890ff' }}>
                {pendingTransactions.reduce((sum, tx) => sum + tx.amount, 0).toFixed(2)}
              </div>
              <div style={{ color: '#666' }}>待转账金额</div>
            </div>
          </Card>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: '#52c41a' }}>
                {pendingTransactions.reduce((sum, tx) => sum + tx.fee, 0).toFixed(2)}
              </div>
              <div style={{ color: '#666' }}>待收取手续费</div>
            </div>
          </Card>
        </div>
      </div>

      {/* 交易池表格 */}
      <Card 
        title="⏳ 交易池 (待处理交易)" 
        extra={
          <Space>
            <span style={{ fontSize: 14, color: '#8c8c8c' }}>
              {pendingTransactions.length > 0 
                ? `${pendingTransactions.length} 笔交易等待打包`
                : '交易池为空'
              }
            </span>
          </Space>
        }
      >
        {pendingTransactions.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px 0', 
            color: '#8c8c8c' 
          }}>
            <ClockCircleOutlined style={{ fontSize: 48, marginBottom: 16 }} />
            <div style={{ fontSize: 16 }}>交易池为空</div>
            <div style={{ fontSize: 14, marginTop: 8 }}>
              创建一些交易，然后等待矿工打包处理
            </div>
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={pendingTransactions}
            rowKey="id"
            loading={isLoading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 笔交易`,
            }}
          />
        )}
      </Card>

      {/* 创建交易模态框 */}
      <Modal
        title="创建新交易"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateTransaction}
          onValuesChange={(_, allValues) => {
            if (allValues.amount) {
              const fee = calculateFee(allValues.amount);
              form.setFieldsValue({ fee });
            }
          }}
        >
          <Form.Item
            name="from"
            label="发送方"
            rules={[{ required: true, message: '请选择发送方' }]}
          >
            <Select
              placeholder="选择发送方用户"
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
            >
              {users
                .filter(user => user.balance > 0)
                .map(user => (
                  <Select.Option key={user.address} value={user.address}>
                    <div>
                      <div>{user.name || '未命名用户'}</div>
                      <div style={{ fontSize: 12, color: '#8c8c8c' }}>
                        余额: {user.balance.toFixed(2)} 代币 - {user.address.slice(0, 8)}...
                      </div>
                    </div>
                  </Select.Option>
                ))
              }
            </Select>
          </Form.Item>
          
          <Form.Item
            name="to"
            label="接收方"
            rules={[
              { required: true, message: '请选择接收方' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('from') !== value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('发送方和接收方不能是同一个用户'));
                },
              }),
            ]}
          >
            <Select
              placeholder="选择接收方用户"
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
            >
              {users.map(user => (
                <Select.Option key={user.address} value={user.address}>
                  <div>
                    <div>{user.name || '未命名用户'}</div>
                    <div style={{ fontSize: 12, color: '#8c8c8c' }}>
                      {user.address.slice(0, 8)}...
                    </div>
                  </div>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="amount"
            label="转账金额"
            rules={[
              { required: true, message: '请输入转账金额' },
              { type: 'number', min: 0.01, message: '转账金额必须大于 0.01' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const fromAddress = getFieldValue('from');
                  if (!fromAddress || !value) return Promise.resolve();
                  
                  const fromUser = users.find(u => u.address === fromAddress);
                  if (!fromUser) return Promise.resolve();
                  
                  const fee = calculateFee(value);
                  const total = value + fee;
                  
                  if (total <= fromUser.balance) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error(`余额不足。需要 ${total.toFixed(2)} 代币（含手续费），当前余额 ${fromUser.balance.toFixed(2)} 代币`));
                },
              }),
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="输入转账金额"
              min={0.01}
              step={0.01}
              precision={2}
              addonAfter="代币"
            />
          </Form.Item>

          <Form.Item
            label="预计手续费"
          >
            <InputNumber
              style={{ width: '100%' }}
              value={form.getFieldValue('amount') ? calculateFee(form.getFieldValue('amount')) : 0}
              disabled
              precision={2}
              addonAfter="代币"
            />
            <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 4 }}>
              手续费 = max(0.1, 转账金额 × 1%)
            </div>
          </Form.Item>

          <div style={{ 
            padding: 16, 
            background: '#f6f8fa', 
            borderRadius: 8, 
            marginBottom: 16,
            border: '1px solid #d0d7de'
          }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#24292f' }}>💡 交易说明</h4>
            <ul style={{ margin: 0, paddingLeft: 20, color: '#656d76', fontSize: 13 }}>
              <li>交易创建后会进入交易池，等待矿工打包</li>
              <li>交易金额 + 手续费不能超过发送方余额</li>
              <li>手续费会奖励给打包此交易的矿工</li>
              <li>交易一旦创建无法取消，请仔细确认</li>
            </ul>
          </div>

          <div style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={() => {
                setIsModalVisible(false);
                form.resetFields();
              }}>
                取消
              </Button>
              <Button 
                type="primary" 
                htmlType="submit"
                loading={createTransactionMutation.isPending}
              >
                创建交易
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>
    </div>
  );
};
