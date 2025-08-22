import React from 'react';
import { Layout, Menu } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  HomeOutlined,
  UserOutlined,
  DollarOutlined,
  SendOutlined,
  ToolOutlined,
  BlockOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';

import { useSystemStore } from '@/stores';
import { ROUTES, APP_CONFIG } from '@/config/constants';
import type { ReactNode } from 'react';

const { Header, Content, Sider } = Layout;

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { systemStatus } = useSystemStore();

  // 菜单配置
  const menuItems = [
    {
      key: ROUTES.HOME,
      icon: <HomeOutlined />,
      label: '欢迎页面',
    },
    {
      key: ROUTES.USERS,
      icon: <UserOutlined />,
      label: '用户管理',
    },
    {
      key: ROUTES.TOKENS,
      icon: <DollarOutlined />,
      label: '代币管理',
    },
    {
      key: ROUTES.TRANSACTIONS,
      icon: <SendOutlined />,
      label: '交易管理',
    },
    {
      key: ROUTES.MINERS,
      icon: <ToolOutlined />,
      label: '矿工管理',
    },
    {
      key: ROUTES.EXPLORER,
      icon: <BlockOutlined />,
      label: '区块浏览器',
    },
    {
      key: ROUTES.SYSTEM,
      icon: <InfoCircleOutlined />,
      label: '系统信息',
    },
  ];

  // 获取当前页面标题
  const getCurrentPageTitle = () => {
    const currentItem = menuItems.find(item => item.key === location.pathname);
    return currentItem?.label || '区块链学习系统';
  };

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

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
          borderBottom: '1px solid #333',
          cursor: 'pointer'
        }}
        onClick={() => navigate(ROUTES.HOME)}
        >
          🔗 {APP_CONFIG.TITLE}
        </div>

        {/* 导航菜单 */}
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          style={{ marginTop: 16 }}
          onClick={handleMenuClick}
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
          <div>🟢 {systemStatus || '系统正常'}</div>
          <div style={{ marginTop: 4 }}>
            v{APP_CONFIG.VERSION}
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
            {getCurrentPageTitle()}
          </h2>
          
          <div style={{ color: '#666', fontSize: 14 }}>
            区块链学习与演示系统
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
          <div className="fade-in">
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};
