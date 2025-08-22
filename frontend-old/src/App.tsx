// frontend/src/App.tsx

import React, { useState, useEffect } from 'react';
import { Layout, Menu, message, Spin } from 'antd';
import {
  UserOutlined,
  SendOutlined,
  BlockOutlined,
  DollarOutlined,
  ToolOutlined,
  InfoCircleOutlined,
  HomeOutlined,
} from '@ant-design/icons';

import { blockchainApi } from './api';
import UserManagement from './components/UserManagement';
import TokenManagement from './components/TokenManagement';
import TransactionManagement from './components/TransactionManagement';
import MinerManagement from './components/MinerManagement';
import BlockExplorer from './components/BlockExplorer';
import SystemInfo from './components/SystemInfo';
import './App.css';

const { Header, Content, Sider } = Layout;

/**
 * 主应用组件
 * 包含侧边栏导航和内容区域
 */
const App: React.FC = () => {
  // 状态管理
  const [selectedKey, setSelectedKey] = useState('welcome'); // 当前选中的菜单项
  const [loading, setLoading] = useState(true); // 应用加载状态
  const [systemStatus, setSystemStatus] = useState<string>(''); // 系统状态

  /**
   * 检查系统健康状态
   */
  const checkSystemHealth = async () => {
    try {
      const status = await blockchainApi.healthCheck();
      setSystemStatus(status);
      setLoading(false);
    } catch (error) {
      console.error('系统健康检查失败:', error);
      message.error('无法连接到后端服务，请检查后端是否已启动');
      setSystemStatus('系统异常');
      setLoading(false);
    }
  };

  /**
   * 组件初始化时检查系统状态
   */
  useEffect(() => {
    checkSystemHealth();
  }, []);

  /**
   * 渲染欢迎页面
   */
  const renderWelcomePage = () => (
    <div style={{ textAlign: 'center', padding: 40 }}>
      <div style={{ fontSize: 64, marginBottom: 24 }}>🔗</div>
      <h1 style={{ fontSize: 36, marginBottom: 16, color: '#1890ff' }}>
        欢迎使用区块链学习系统
      </h1>
      <p style={{ fontSize: 16, color: '#666', marginBottom: 32, maxWidth: 600, margin: '0 auto 32px' }}>
        这是一个用于学习区块链基本原理的教育系统。通过实际操作，你将了解用户管理、代币分配、
        交易处理、挖矿机制和区块浏览器的工作原理。
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16, marginTop: 32 }}>
        <div 
          className="welcome-card"
          onClick={() => setSelectedKey('users')}
        >
          <div className="welcome-card-icon">👥</div>
          <h3>用户管理</h3>
          <p>创建用户账户、生成钱包地址、查看余额和交易历史</p>
        </div>
        
        <div 
          className="welcome-card"
          onClick={() => setSelectedKey('tokens')}
        >
          <div className="welcome-card-icon">💰</div>
          <h3>代币管理</h3>
          <p>手动分配代币给用户，查看代币分布统计信息</p>
        </div>
        
        <div 
          className="welcome-card"
          onClick={() => setSelectedKey('transactions')}
        >
          <div className="welcome-card-icon">💸</div>
          <h3>交易管理</h3>
          <p>创建转账交易、查看交易池、了解手续费机制</p>
        </div>
        
        <div 
          className="welcome-card"
          onClick={() => setSelectedKey('miners')}
        >
          <div className="welcome-card-icon">⛏️</div>
          <h3>矿工管理</h3>
          <p>注册矿工、执行挖矿操作、获得区块奖励</p>
        </div>
        
        <div 
          className="welcome-card"
          onClick={() => setSelectedKey('explorer')}
        >
          <div className="welcome-card-icon">🔍</div>
          <h3>区块浏览器</h3>
          <p>浏览完整区块链、查看区块详情、搜索交易</p>
        </div>
        
        <div 
          className="welcome-card"
          onClick={() => setSelectedKey('system')}
        >
          <div className="welcome-card-icon">📊</div>
          <h3>系统信息</h3>
          <p>查看系统状态、网络活跃度、配置参数</p>
        </div>
      </div>

      <div style={{ marginTop: 40, padding: 20, background: '#f6f8fa', borderRadius: 8 }}>
        <h3>🎯 学习路径建议</h3>
        <ol style={{ textAlign: 'left', display: 'inline-block', color: '#666' }}>
          <li>首先在"用户管理"中创建几个测试用户</li>
          <li>在"代币管理"中给用户分配初始代币</li>
          <li>在"矿工管理"中注册矿工账户</li>
          <li>在"交易管理"中创建转账交易</li>
          <li>让矿工执行挖矿操作打包交易</li>
          <li>在"区块浏览器"中查看区块链状态</li>
          <li>在"系统信息"中监控整体运行状态</li>
        </ol>
      </div>

      <div style={{ marginTop: 24, padding: 16, background: '#e6f7ff', borderRadius: 8, border: '1px solid #91d5ff' }}>
        <h4 style={{ margin: '0 0 8px 0', color: '#1890ff' }}>✨ 系统特色</h4>
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

  /**
   * 获取当前选中菜单对应的组件
   */
  const getCurrentComponent = () => {
    switch (selectedKey) {
      case 'welcome':
        return renderWelcomePage();
      case 'users':
        return <UserManagement />;
      case 'tokens':
        return <TokenManagement />;
      case 'transactions':
        return <TransactionManagement />;
      case 'miners':
        return <MinerManagement />;
      case 'explorer':
        return <BlockExplorer />;
      case 'system':
        return <SystemInfo />;
      default:
        return renderWelcomePage();
    }
  };

  /**
   * 菜单配置
   */
  const menuItems = [
    {
      key: 'welcome',
      icon: <HomeOutlined />,
      label: '欢迎页面',
    },
    {
      key: 'users',
      icon: <UserOutlined />,
      label: '用户管理',
    },
    {
      key: 'tokens',
      icon: <DollarOutlined />,
      label: '代币管理',
    },
    {
      key: 'transactions',
      icon: <SendOutlined />,
      label: '交易管理',
    },
    {
      key: 'miners',
      icon: <ToolOutlined />,
      label: '矿工管理',
    },
    {
      key: 'explorer',
      icon: <BlockOutlined />,
      label: '区块浏览器',
    },
    {
      key: 'system',
      icon: <InfoCircleOutlined />,
      label: '系统信息',
    },
  ];

  /**
   * 渲染应用加载中状态
   */
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column'
      }}>
        <Spin size="large" />
        <div style={{ marginTop: 16, fontSize: 16 }}>
          正在连接区块链系统...
        </div>
        <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
          请确保后端服务已启动 (http://localhost:3001)
        </div>
      </div>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 侧边栏 */}
      <Sider
        width={250}
        style={{
          background: '#001529',
        }}
      >
        {/* Logo区域 */}
        <div style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: 18,
          fontWeight: 'bold',
          borderBottom: '1px solid #333'
        }}>
          🔗 区块链学习系统
        </div>

        {/* 导航菜单 */}
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          style={{ marginTop: 16 }}
          onClick={({ key }) => setSelectedKey(key)}
          items={menuItems}
        />

        {/* 底部系统状态 */}
        <div style={{
          position: 'absolute',
          bottom: 16,
          left: 16,
          right: 16,
          color: '#888',
          fontSize: 12,
          textAlign: 'center',
          padding: 8,
          background: '#002140',
          borderRadius: 4
        }}>
          <div>🟢 {systemStatus}</div>
          <div style={{ marginTop: 4 }}>
            {new Date().toLocaleString()}
          </div>
        </div>
      </Sider>

      {/* 主内容区域 */}
      <Layout>
        {/* 顶部导航栏 */}
        <Header style={{
          background: '#fff',
          padding: '0 24px',
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h2 style={{ margin: 0, color: '#1890ff' }}>
            {menuItems.find(item => item.key === selectedKey)?.label}
          </h2>
          
          <div style={{ color: '#666' }}>
            区块链学习与演示系统 v1.0
          </div>
        </Header>

        {/* 内容区域 */}
        <Content style={{
          margin: 24,
          padding: 24,
          background: '#fff',
          minHeight: 280,
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          {getCurrentComponent()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
