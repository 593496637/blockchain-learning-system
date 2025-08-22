import React from 'react';
import { Row, Col, Divider } from 'antd';
import { WelcomeCard } from '@/components/ui/WelcomeCard';
import { StatCard } from '@/components/ui/StatCard';
import { useUsers, useMiners, useBlockchain, usePendingTransactions } from '@/hooks/useApi';
import { ROUTES } from '@/config/constants';
import {
  UserOutlined,
  ToolOutlined,
  BlockOutlined,
  SendOutlined,
  DollarOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';

export const HomePage: React.FC = () => {
  const { data: users = [] } = useUsers();
  const { data: miners = [] } = useMiners();
  const { data: blocks = [] } = useBlockchain();
  const { data: pendingTxs = [] } = usePendingTransactions();

  // 计算统计数据
  const totalUsers = users.length;
  const totalMiners = miners.length;
  const blockHeight = blocks.length;
  const pendingTransactions = pendingTxs.length;
  const totalTransactions = blocks.reduce((sum, block) => sum + block.transactions.length, 0);
  const totalBalance = users.reduce((sum, user) => sum + user.balance, 0);

  const welcomeCards = [
    {
      title: '用户管理',
      description: '创建用户账户、生成钱包地址、查看余额和交易历史',
      icon: '👥',
      path: ROUTES.USERS,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      title: '代币管理',
      description: '手动分配代币给用户，查看代币分布统计信息',
      icon: '💰',
      path: ROUTES.TOKENS,
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      title: '交易管理',
      description: '创建转账交易、查看交易池、了解手续费机制',
      icon: '💸',
      path: ROUTES.TRANSACTIONS,
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    {
      title: '矿工管理',
      description: '注册矿工、执行挖矿操作、获得区块奖励',
      icon: '⛏️',
      path: ROUTES.MINERS,
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    },
    {
      title: '区块浏览器',
      description: '浏览完整区块链、查看区块详情、搜索交易',
      icon: '🔍',
      path: ROUTES.EXPLORER,
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
    },
    {
      title: '系统信息',
      description: '查看系统状态、网络活跃度、配置参数',
      icon: '📊',
      path: ROUTES.SYSTEM,
      gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
    },
  ];

  return (
    <div>
      {/* 欢迎区域 */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div style={{ fontSize: 64, marginBottom: 24 }}>🔗</div>
        <h1 style={{ fontSize: 36, marginBottom: 16, color: '#1890ff' }}>
          欢迎使用区块链学习系统
        </h1>
        <p style={{ fontSize: 16, color: '#666', marginBottom: 32, maxWidth: 600, margin: '0 auto 32px' }}>
          这是一个用于学习区块链基本原理的教育系统。通过实际操作，你将了解用户管理、代币分配、
          交易处理、挖矿机制和区块浏览器的工作原理。
        </p>
      </div>

      {/* 统计数据 */}
      <div style={{ marginBottom: 40 }}>
        <h3 style={{ marginBottom: 16, color: '#262626' }}>📈 系统概览</h3>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8} lg={4}>
            <StatCard
              title="用户总数"
              value={totalUsers}
              icon={<UserOutlined />}
              description="已注册用户"
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={4}>
            <StatCard
              title="矿工总数"
              value={totalMiners}
              icon={<ToolOutlined />}
              description="活跃矿工"
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={4}>
            <StatCard
              title="区块高度"
              value={blockHeight}
              icon={<BlockOutlined />}
              description="当前区块数"
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={4}>
            <StatCard
              title="总交易数"
              value={totalTransactions}
              icon={<SendOutlined />}
              description="已确认交易"
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={4}>
            <StatCard
              title="待处理交易"
              value={pendingTransactions}
              icon={<ClockCircleOutlined />}
              description="交易池中"
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={4}>
            <StatCard
              title="总代币数"
              value={totalBalance.toFixed(2)}
              icon={<DollarOutlined />}
              description="流通中"
            />
          </Col>
        </Row>
      </div>

      <Divider />

      {/* 功能卡片 */}
      <div style={{ marginBottom: 40 }}>
        <h3 style={{ marginBottom: 16, color: '#262626' }}>🚀 功能模块</h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: 20 
        }}>
          {welcomeCards.map((card, index) => (
            <WelcomeCard
              key={index}
              title={card.title}
              description={card.description}
              icon={card.icon}
              path={card.path}
              gradient={card.gradient}
            />
          ))}
        </div>
      </div>

      <Divider />

      {/* 学习路径 */}
      <div style={{ marginTop: 40, padding: 24, background: '#f6f8fa', borderRadius: 12 }}>
        <h3 style={{ marginBottom: 16, color: '#1890ff' }}>🎯 建议的学习路径</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
          <div>
            <h4 style={{ color: '#262626', marginBottom: 8 }}>基础操作</h4>
            <ol style={{ color: '#666', lineHeight: 1.8 }}>
              <li>在"用户管理"中创建几个测试用户</li>
              <li>在"代币管理"中给用户分配初始代币</li>
              <li>在"矿工管理"中注册矿工账户</li>
            </ol>
          </div>
          <div>
            <h4 style={{ color: '#262626', marginBottom: 8 }}>交易流程</h4>
            <ol style={{ color: '#666', lineHeight: 1.8 }}>
              <li>在"交易管理"中创建转账交易</li>
              <li>让矿工执行挖矿操作打包交易</li>
              <li>在"区块浏览器"中查看区块链状态</li>
            </ol>
          </div>
        </div>
      </div>

      {/* 系统特色 */}
      <div style={{ marginTop: 24, padding: 16, background: '#e6f7ff', borderRadius: 8, border: '1px solid #91d5ff' }}>
        <h4 style={{ margin: '0 0 12px 0', color: '#1890ff' }}>✨ 系统特色</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, fontSize: 14 }}>
          <div>🔐 模拟真实区块链环境</div>
          <div>⚡ 实时数据更新</div>
          <div>🎨 现代化用户界面</div>
          <div>📚 丰富的学习内容</div>
          <div>🛠️ 完整的开发工具链</div>
          <div>📊 详细的统计分析</div>
        </div>
      </div>
    </div>
  );
};
