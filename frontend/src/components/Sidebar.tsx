import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { 
  DashboardIcon, 
  UsersIcon, 
  TransactionIcon, 
  MinerIcon, 
  BlockIcon, 
  SunIcon, 
  MoonIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon,
  LogoIcon 
} from './Icons';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, collapsed, setCollapsed }) => {
  const { theme, toggleTheme } = useTheme();

  const tabs = [
    { id: 'status', label: '系统状态', icon: DashboardIcon },
    { id: 'users', label: '用户管理', icon: UsersIcon },
    { id: 'transactions', label: '交易管理', icon: TransactionIcon },
    { id: 'miners', label: '矿工管理', icon: MinerIcon },
    { id: 'blocks', label: '区块浏览器', icon: BlockIcon }
  ];

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* 侧边栏头部 */}
      <div className="sidebar-header">
        <div className="logo">
          <LogoIcon size={32} className="logo-icon" />
          {!collapsed && <span className="logo-text">区块链学习</span>}
        </div>
        <button 
          className="collapse-btn"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? '展开侧边栏' : '收起侧边栏'}
        >
          {collapsed ? <ChevronRightIcon size={18} /> : <ChevronLeftIcon size={18} />}
        </button>
      </div>

      {/* 导航菜单 */}
      <nav className="sidebar-nav">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            title={collapsed ? tab.label : undefined}
          >
            <tab.icon size={20} className="nav-icon" />
            {!collapsed && <span className="nav-label">{tab.label}</span>}
            {activeTab === tab.id && <div className="active-indicator" />}
          </button>
        ))}
      </nav>

      {/* 底部设置区域 */}
      <div className="sidebar-footer">
        <button 
          className="theme-toggle"
          onClick={toggleTheme}
          title={`切换到${theme === 'light' ? '深色' : '浅色'}主题`}
        >
          <span className="theme-icon">
            {theme === 'light' ? <MoonIcon size={20} /> : <SunIcon size={20} />}
          </span>
          {!collapsed && (
            <span className="theme-label">
              {theme === 'light' ? '深色模式' : '浅色模式'}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
