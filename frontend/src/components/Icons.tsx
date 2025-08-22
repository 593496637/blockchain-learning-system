import React from 'react';

interface IconProps {
  size?: number;
  className?: string;
  color?: string;
}

// 系统状态图标
export const DashboardIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M3 13h1v7c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2v-7h1a1 1 0 0 0 .707-1.707l-9-9a.999.999 0 0 0-1.414 0l-9 9A1 1 0 0 0 3 13z" fill={color}/>
    <path d="M13 11h-2v8h2v-8z" fill={color}/>
    <path d="M9 13H7v6h2v-6z" fill={color}/>
    <path d="M17 13h-2v6h2v-6z" fill={color}/>
  </svg>
);

// 用户管理图标
export const UsersIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="9" cy="7" r="4" stroke={color} strokeWidth="2" fill="none"/>
    <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" stroke={color} strokeWidth="2" fill="none"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke={color} strokeWidth="2" fill="none"/>
    <path d="M21 21v-2a4 4 0 0 0-3-3.85" stroke={color} strokeWidth="2" fill="none"/>
  </svg>
);

// 交易管理图标
export const TransactionIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 1v6l4-4 4 4-8-8L4 7l4 4 4-6z" fill={color}/>
    <path d="M12 23v-6l-4 4-4-4 8 8 8-8-4-4-4 6z" fill={color}/>
    <circle cx="12" cy="12" r="3" fill={color}/>
  </svg>
);

// 矿工管理图标
export const MinerIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M14 3v4a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1z" fill={color}/>
    <path d="M12 8v13" stroke={color} strokeWidth="2"/>
    <path d="M8 21h8" stroke={color} strokeWidth="2"/>
    <path d="M19 14l-7-7-7 7h14z" stroke={color} strokeWidth="2" fill="none"/>
  </svg>
);

// 区块浏览器图标
export const BlockIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke={color} strokeWidth="2" fill="none"/>
    <polyline points="7.5,4.21 12,6.81 16.5,4.21" stroke={color} strokeWidth="2" fill="none"/>
    <polyline points="7.5,19.79 7.5,14.6 3,12" stroke={color} strokeWidth="2" fill="none"/>
    <polyline points="21,12 16.5,14.6 16.5,19.79" stroke={color} strokeWidth="2" fill="none"/>
    <polyline points="7.5,14.6 12,17.2 16.5,14.6" stroke={color} strokeWidth="2" fill="none"/>
    <line x1="12" y1="6.81" x2="12" y2="17.2" stroke={color} strokeWidth="2"/>
  </svg>
);

// 主题切换图标
export const SunIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="5" stroke={color} strokeWidth="2" fill="none"/>
    <line x1="12" y1="1" x2="12" y2="3" stroke={color} strokeWidth="2"/>
    <line x1="12" y1="21" x2="12" y2="23" stroke={color} strokeWidth="2"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke={color} strokeWidth="2"/>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke={color} strokeWidth="2"/>
    <line x1="1" y1="12" x2="3" y2="12" stroke={color} strokeWidth="2"/>
    <line x1="21" y1="12" x2="23" y2="12" stroke={color} strokeWidth="2"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke={color} strokeWidth="2"/>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke={color} strokeWidth="2"/>
  </svg>
);

export const MoonIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="2" fill="currentColor"/>
  </svg>
);

// 刷新图标
export const RefreshIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <polyline points="23,4 23,10 17,10" stroke={color} strokeWidth="2" fill="none"/>
    <polyline points="1,20 1,14 7,14" stroke={color} strokeWidth="2" fill="none"/>
    <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" stroke={color} strokeWidth="2" fill="none"/>
  </svg>
);

// 连接状态图标
export const ConnectedIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="3" fill={color}/>
    <path d="M12 1l3.09 6.26L22 9l-5.91 3.74L18 19l-6-3.27L6 19l1.91-6.26L2 9l6.91-1.74L12 1z" fill={color}/>
  </svg>
);

// 菜单折叠图标
export const ChevronLeftIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <polyline points="15,18 9,12 15,6" stroke={color} strokeWidth="2" fill="none"/>
  </svg>
);

export const ChevronRightIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <polyline points="9,18 15,12 9,6" stroke={color} strokeWidth="2" fill="none"/>
  </svg>
);

// 交易专用图标
export const SendIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M9 11H4a2 2 0 0 0 0 4h5m4-4v4a2 2 0 0 0 4 0V9a2 2 0 0 0-2-2h-2m-4 0V5a2 2 0 0 0-4 0v2a2 2 0 0 0 0 4h16" stroke={color} strokeWidth="2" fill="none"/>
    <polyline points="17,8 22,12 17,16" stroke={color} strokeWidth="2" fill="none"/>
  </svg>
);

export const ReceiveIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M16 12l5-5-5-5v3H8a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h8v3z" fill={color}/>
    <path d="M2 14h6v6H2z" stroke={color} strokeWidth="2" fill="none"/>
  </svg>
);

export const ArrowRightIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="2"/>
    <polyline points="12,5 19,12 12,19" stroke={color} strokeWidth="2" fill="none"/>
  </svg>
);

export const PendingIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none"/>
    <polyline points="12,6 12,12 16,14" stroke={color} strokeWidth="2" fill="none"/>
  </svg>
);

export const SuccessIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke={color} strokeWidth="2" fill="none"/>
    <polyline points="22,4 12,14.01 9,11.01" stroke={color} strokeWidth="2" fill="none"/>
  </svg>
);

export const CoinIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none"/>
    <path d="M9.5 8.5c0-1.1.9-2 2-2h1c1.1 0 2 .9 2 2s-.9 2-2 2h-1c-1.1 0-2 .9-2 2s.9 2 2 2h1c1.1 0 2-.9 2-2" stroke={color} strokeWidth="2" fill="none"/>
    <line x1="12" y1="6" x2="12" y2="8" stroke={color} strokeWidth="2"/>
    <line x1="12" y1="16" x2="12" y2="18" stroke={color} strokeWidth="2"/>
  </svg>
);

export const WalletIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5zM16 10h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1z" stroke={color} strokeWidth="2" fill="none"/>
  </svg>
);

export const CopyIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke={color} strokeWidth="2" fill="none"/>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke={color} strokeWidth="2" fill="none"/>
  </svg>
);

export const UserAvatarIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none"/>
    <circle cx="12" cy="8" r="3" stroke={color} strokeWidth="2" fill="none"/>
    <path d="M6.5 18.5c0-3 2.5-5.5 5.5-5.5s5.5 2.5 5.5 5.5" stroke={color} strokeWidth="2" fill="none"/>
  </svg>
);

// 用户头像生成组件
interface UserAvatarProps {
  username: string;
  size?: number;
  className?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ username, size = 40, className = '' }) => {
  // 基于用户名生成颜色
  const generateColor = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const colors = [
      ['#FF6B6B', '#FF8E53'], // 红橙
      ['#4ECDC4', '#44A08D'], // 青绿
      ['#45B7D1', '#96C93D'], // 蓝绿
      ['#F093FB', '#F5576C'], // 粉红
      ['#4FACFE', '#00F2FE'], // 蓝青
      ['#FFF200', '#FF8C00'], // 黄橙
      ['#C471ED', '#F64F59'], // 紫红
      ['#00C9FF', '#92FE9D'], // 蓝绿
    ];
    
    return colors[Math.abs(hash) % colors.length];
  };

  const [color1, color2] = generateColor(username);
  const initials = username.substring(0, 2).toUpperCase();

  return (
    <div 
      className={`user-avatar ${className}`} 
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${color1}, ${color2})`,
      }}
    >
      <span className="avatar-text" style={{ fontSize: size * 0.4 }}>
        {initials}
      </span>
    </div>
  );
};

// Logo图标
export const LogoIcon: React.FC<IconProps> = ({ size = 32, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#10b981" />
      </linearGradient>
    </defs>
    <circle cx="16" cy="16" r="14" stroke="url(#logoGradient)" strokeWidth="2" fill="none"/>
    <path d="M10 16l4 4 8-8" stroke="url(#logoGradient)" strokeWidth="2" fill="none"/>
    <circle cx="16" cy="8" r="2" fill="url(#logoGradient)"/>
    <circle cx="24" cy="16" r="2" fill="url(#logoGradient)"/>
    <circle cx="16" cy="24" r="2" fill="url(#logoGradient)"/>
    <circle cx="8" cy="16" r="2" fill="url(#logoGradient)"/>
  </svg>
);
