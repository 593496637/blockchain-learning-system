import React, { useState } from 'react';
import { Card, Table, Button, Input, InputNumber, Space, message, Form, Modal, Select, Tag } from 'antd';
import { GiftOutlined, ReloadOutlined, DollarOutlined } from '@ant-design/icons';
import { useUsers, useAllocateTokens } from '@/hooks/useApi';
import type { User } from '@/types';
import type { ColumnsType } from 'antd/es/table';

export const TokensPage: React.FC = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  const { data: users = [], isLoading, refetch } = useUsers();
  const allocateTokensMutation = useAllocateTokens();

  // 处理代币分配
  const handleAllocateTokens = async (values: { address: string; amount: number }) => {
    try {
      await allocateTokensMutation.mutateAsync(values);
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('代币分配失败:', error);
    }
  };

  // 计算统计数据
  const totalSupply = users.reduce((sum, user) => sum + user.balance, 0);
  const usersWithBalance = users.filter(user => user.balance > 0);
  const averageBalance = usersWithBalance.length > 0 ? totalSupply / usersWithBalance.length : 0;
  const maxBalance = Math.max(...users.map(user => user.balance), 0);

  // 按余额排序的用户列表
  const sortedUsers = [...users].sort((a, b) => b.balance - a.balance);

  // 表格列定义
  const columns: ColumnsType<User> = [
    {
      title: '排名',
      key: 'rank',
      width: 80,
      render: (_, __, index) => {
        let color = '#8c8c8c';
        if (index === 0) color = '#fadb14'; // 金色
        else if (index === 1) color = '#a0a0a0'; // 银色
        else if (index === 2) color = '#cd7f32'; // 铜色
        
        return (
          <Tag color={index < 3 ? color : 'default'}>
            #{index + 1}
          </Tag>
        );
      },
    },
    {
      title: '用户',
      key: 'user',
      render: (user: User) => (
        <div>
          <div style={{ fontWeight: 500 }}>
            {user.name || '未命名用户'}
          </div>
          <div style={{ fontSize: 12, color: '#8c8c8c', fontFamily: 'monospace' }}>
            {user.address.slice(0, 8)}...{user.address.slice(-8)}
          </div>
        </div>
      ),
    },
    {
      title: '余额',
      dataIndex: 'balance',
      key: 'balance',
      render: (balance: number) => (
        <div style={{ textAlign: 'right' }}>
          <div style={{ 
            fontSize: 16, 
            fontWeight: 'bold', 
            color: balance > 0 ? '#52c41a' : '#8c8c8c' 
          }}>
            {balance.toFixed(2)}
          </div>
          <div style={{ fontSize: 12, color: '#8c8c8c' }}>代币</div>
        </div>
      ),
      sorter: (a, b) => a.balance - b.balance,
      sortDirections: ['descend', 'ascend'],
      defaultSortOrder: 'descend',
    },
    {
      title: '占比',
      key: 'percentage',
      render: (user: User) => {
        const percentage = totalSupply > 0 ? (user.balance / totalSupply * 100) : 0;
        return (
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 500 }}>{percentage.toFixed(1)}%</div>
            <div style={{ 
              width: '60px', 
              height: '4px', 
              background: '#f0f0f0', 
              borderRadius: '2px',
              marginTop: '4px'
            }}>
              <div style={{
                width: `${percentage}%`,
                height: '100%',
                background: '#1890ff',
                borderRadius: '2px'
              }} />
            </div>
          </div>
        );
      },
    },
    {
      title: '操作',
      key: 'actions',
      render: (user: User) => (
        <Button 
          type="link" 
          size="small"
          onClick={() => {
            form.setFieldsValue({ address: user.address });
            setIsModalVisible(true);
          }}
        >
          分配代币
        </Button>
      ),
    },
  ];

  return (
    <div>
      {/* 页面头部 */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ marginBottom: 8 }}>💰 代币管理</h2>
        <p style={{ color: '#666', marginBottom: 16 }}>
          管理系统中的代币分配，查看用户余额分布和排行榜
        </p>
        
        <Space wrap>
          <Button 
            type="primary" 
            icon={<GiftOutlined />}
            onClick={() => setIsModalVisible(true)}
          >
            分配代币
          </Button>
          <Button 
            icon={<ReloadOutlined />}
            onClick={() => refetch()}
            loading={isLoading}
          >
            刷新
          </Button>
        </Space>
      </div>

      {/* 统计卡片 */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <DollarOutlined style={{ fontSize: 24, color: '#1890ff', marginBottom: 8 }} />
              <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1890ff' }}>
                {totalSupply.toFixed(2)}
              </div>
              <div style={{ color: '#666' }}>代币总供应量</div>
            </div>
          </Card>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: '#52c41a' }}>
                {usersWithBalance.length}
              </div>
              <div style={{ color: '#666' }}>持有代币用户</div>
            </div>
          </Card>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: '#722ed1' }}>
                {averageBalance.toFixed(2)}
              </div>
              <div style={{ color: '#666' }}>平均余额</div>
            </div>
          </Card>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: '#fa8c16' }}>
                {maxBalance.toFixed(2)}
              </div>
              <div style={{ color: '#666' }}>最高余额</div>
            </div>
          </Card>
        </div>
      </div>

      {/* 用户余额排行榜 */}
      <Card title="💎 用户余额排行榜" extra={
        <span style={{ fontSize: 14, color: '#8c8c8c' }}>
          共 {users.length} 个用户
        </span>
      }>
        <Table
          columns={columns}
          dataSource={sortedUsers}
          rowKey="address"
          loading={isLoading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 个用户`,
          }}
        />
      </Card>

      {/* 分配代币模态框 */}
      <Modal
        title="分配代币"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAllocateTokens}
        >
          <Form.Item
            name="address"
            label="选择用户"
            rules={[{ required: true, message: '请选择用户' }]}
          >
            <Select
              placeholder="选择要分配代币的用户"
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={users.map(user => ({
                value: user.address,
                label: `${user.name || '未命名用户'} (${user.address.slice(0, 8)}...)`,
                children: (
                  <div>
                    <div>{user.name || '未命名用户'}</div>
                    <div style={{ fontSize: 12, color: '#8c8c8c' }}>
                      {user.address} - 当前余额: {user.balance.toFixed(2)}
                    </div>
                  </div>
                )
              }))}
            />
          </Form.Item>
          
          <Form.Item
            name="amount"
            label="分配数量"
            rules={[
              { required: true, message: '请输入分配数量' },
              { type: 'number', min: 0.01, message: '分配数量必须大于 0.01' },
              { type: 'number', max: 10000, message: '单次分配不能超过 10000' },
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="输入要分配的代币数量"
              min={0.01}
              max={10000}
              step={0.01}
              precision={2}
              addonAfter="代币"
            />
          </Form.Item>

          <div style={{ 
            padding: 12, 
            background: '#f6f8fa', 
            borderRadius: 6, 
            marginBottom: 16,
            fontSize: 13, 
            color: '#666' 
          }}>
            💡 <strong>分配说明：</strong>
            <ul style={{ margin: '8px 0 0 0', paddingLeft: 20 }}>
              <li>代币分配会立即生效，无需确认</li>
              <li>分配的代币会直接添加到用户余额中</li>
              <li>这是测试环境，可以自由分配代币进行学习</li>
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
                loading={allocateTokensMutation.isPending}
              >
                确认分配
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>
    </div>
  );
};
