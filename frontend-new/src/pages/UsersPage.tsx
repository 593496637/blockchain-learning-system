import React, { useState } from 'react';
import { Table, Button, Input, Card, Space, Tag, Tooltip, Modal, message } from 'antd';
import { UserAddOutlined, EyeOutlined, CopyOutlined, ReloadOutlined } from '@ant-design/icons';
import { useUsers, useCreateUser } from '@/hooks/useApi';
import type { User } from '@/types';
import type { ColumnsType } from 'antd/es/table';

export const UsersPage: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userName, setUserName] = useState('');

  const { data: users = [], isLoading, refetch } = useUsers();
  const createUserMutation = useCreateUser();

  // 处理创建用户
  const handleCreateUser = async () => {
    try {
      await createUserMutation.mutateAsync(userName || undefined);
      setUserName('');
      setIsModalVisible(false);
    } catch (error) {
      console.error('创建用户失败:', error);
    }
  };

  // 复制地址到剪贴板
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    message.success('地址已复制到剪贴板');
  };

  // 过滤用户数据
  const filteredUsers = users.filter(user => 
    user.address.toLowerCase().includes(searchText.toLowerCase()) ||
    (user.name && user.name.toLowerCase().includes(searchText.toLowerCase()))
  );

  // 表格列定义
  const columns: ColumnsType<User> = [
    {
      title: '用户名',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => name || <Tag color="default">未设置</Tag>,
    },
    {
      title: '钱包地址',
      dataIndex: 'address',
      key: 'address',
      render: (address: string) => (
        <Space>
          <code style={{ background: '#f5f5f5', padding: '2px 6px', borderRadius: 4 }}>
            {address.slice(0, 8)}...{address.slice(-8)}
          </code>
          <Tooltip title="复制完整地址">
            <Button 
              type="text" 
              size="small" 
              icon={<CopyOutlined />}
              onClick={() => copyToClipboard(address)}
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
        <span style={{ color: balance > 0 ? '#52c41a' : '#ff4d4f', fontWeight: 500 }}>
          {balance.toFixed(2)} 代币
        </span>
      ),
      sorter: (a, b) => a.balance - b.balance,
    },
    {
      title: '状态',
      key: 'status',
      render: (_, user) => (
        <Tag color={user.balance > 0 ? 'green' : 'orange'}>
          {user.balance > 0 ? '有余额' : '无余额'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'actions',
      render: (_, user) => (
        <Space>
          <Tooltip title="查看详情">
            <Button 
              type="primary" 
              size="small" 
              icon={<EyeOutlined />}
              onClick={() => setSelectedUser(user)}
            >
              详情
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* 页面头部 */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ marginBottom: 8 }}>👥 用户管理</h2>
        <p style={{ color: '#666', marginBottom: 16 }}>
          创建和管理区块链用户账户，查看用户余额和交易历史
        </p>
        
        <Space wrap>
          <Button 
            type="primary" 
            icon={<UserAddOutlined />}
            onClick={() => setIsModalVisible(true)}
            loading={createUserMutation.isPending}
          >
            创建用户
          </Button>
          <Button 
            icon={<ReloadOutlined />}
            onClick={() => refetch()}
            loading={isLoading}
          >
            刷新
          </Button>
          <Input.Search
            placeholder="搜索用户名或地址"
            style={{ width: 300 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />
        </Space>
      </div>

      {/* 统计卡片 */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1890ff' }}>
                {users.length}
              </div>
              <div style={{ color: '#666' }}>总用户数</div>
            </div>
          </Card>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: '#52c41a' }}>
                {users.filter(u => u.balance > 0).length}
              </div>
              <div style={{ color: '#666' }}>有余额用户</div>
            </div>
          </Card>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: '#722ed1' }}>
                {users.reduce((sum, u) => sum + u.balance, 0).toFixed(2)}
              </div>
              <div style={{ color: '#666' }}>总余额</div>
            </div>
          </Card>
        </div>
      </div>

      {/* 用户表格 */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredUsers}
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

      {/* 创建用户模态框 */}
      <Modal
        title="创建新用户"
        open={isModalVisible}
        onOk={handleCreateUser}
        onCancel={() => {
          setIsModalVisible(false);
          setUserName('');
        }}
        confirmLoading={createUserMutation.isPending}
        okText="创建"
        cancelText="取消"
      >
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
            用户名（可选）
          </label>
          <Input
            placeholder="输入用户名，留空则自动生成"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            maxLength={20}
          />
        </div>
        <div style={{ padding: 12, background: '#f6f8fa', borderRadius: 6, fontSize: 13, color: '#666' }}>
          💡 创建用户会自动生成一对公私钥，并分配一个唯一的钱包地址
        </div>
      </Modal>

      {/* 用户详情模态框 */}
      {selectedUser && (
        <Modal
          title={`用户详情 - ${selectedUser.name || '未命名用户'}`}
          open={!!selectedUser}
          onCancel={() => setSelectedUser(null)}
          footer={[
            <Button key="close" onClick={() => setSelectedUser(null)}>
              关闭
            </Button>
          ]}
          width={600}
        >
          <div style={{ lineHeight: '24px' }}>
            <div style={{ marginBottom: 16 }}>
              <strong>钱包地址：</strong>
              <div style={{ 
                fontFamily: 'monospace', 
                background: '#f5f5f5', 
                padding: 8, 
                borderRadius: 4, 
                marginTop: 4,
                wordBreak: 'break-all'
              }}>
                {selectedUser.address}
                <Button 
                  type="link" 
                  size="small" 
                  icon={<CopyOutlined />}
                  onClick={() => copyToClipboard(selectedUser.address)}
                >
                  复制
                </Button>
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <strong>当前余额：</strong>
              <span style={{ 
                fontSize: 18, 
                fontWeight: 'bold', 
                color: selectedUser.balance > 0 ? '#52c41a' : '#ff4d4f',
                marginLeft: 8
              }}>
                {selectedUser.balance.toFixed(2)} 代币
              </span>
            </div>
            <div style={{ marginBottom: 16 }}>
              <strong>私钥：</strong>
              <div style={{ 
                fontFamily: 'monospace', 
                background: '#fff2e8', 
                padding: 8, 
                borderRadius: 4, 
                marginTop: 4,
                fontSize: 12,
                wordBreak: 'break-all',
                border: '1px solid #ffd591'
              }}>
                ⚠️ {selectedUser.privateKey}
                <div style={{ fontSize: 11, color: '#fa8c16', marginTop: 4 }}>
                  注意：这是测试环境，生产环境中私钥应该加密保存
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
