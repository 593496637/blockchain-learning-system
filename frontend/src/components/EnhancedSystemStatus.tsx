import React, { useEffect, useState } from 'react';
import type { BlockchainInfo } from '../types';

interface Props {
  info: BlockchainInfo | null;
}

// 动态数字计数组件
const AnimatedNumber: React.FC<{ value: number; duration?: number }> = ({ value, duration = 1000 }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const startValue = displayValue;
    const endValue = value;
    
    const updateValue = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // 使用缓动函数
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.round(startValue + (endValue - startValue) * easeOutQuart);
      
      setDisplayValue(currentValue);
      
      if (progress < 1) {
        requestAnimationFrame(updateValue);
      }
    };
    
    requestAnimationFrame(updateValue);
  }, [value, duration, displayValue]);

  return <span>{displayValue}</span>;
};

// 进度圆环组件
const CircularProgress: React.FC<{ percentage: number; size?: number; strokeWidth?: number }> = ({ 
  percentage, 
  size = 60, 
  strokeWidth = 4 
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="circular-progress">
      <svg width={size} height={size} className="progress-ring">
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--color-primary)" />
            <stop offset="100%" stopColor="var(--color-success)" />
          </linearGradient>
        </defs>
        {/* 背景圆环 */}
        <circle
          stroke="var(--color-border)"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* 进度圆环 */}
        <circle
          stroke="url(#progressGradient)"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          style={{
            strokeDasharray,
            strokeDashoffset,
            transition: 'stroke-dashoffset 1s ease-in-out',
            transform: 'rotate(-90deg)',
            transformOrigin: '50% 50%',
          }}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div className="progress-text">{Math.round(percentage)}%</div>
    </div>
  );
};

// 状态卡片组件
const StatusCard: React.FC<{
  label: string;
  value: number | string;
  icon: React.ReactNode;
  color?: string;
  showProgress?: boolean;
  maxValue?: number;
}> = ({ label, value, icon, color = 'var(--color-primary)', showProgress = false, maxValue = 100 }) => {
  const numericValue = typeof value === 'number' ? value : 0;
  const percentage = showProgress && maxValue > 0 ? (numericValue / maxValue) * 100 : 0;

  return (
    <div className="enhanced-status-card">
      <div className="card-header">
        <div className="card-icon" style={{ color }}>
          {icon}
        </div>
        {showProgress && (
          <CircularProgress percentage={Math.min(percentage, 100)} />
        )}
      </div>
      <div className="card-content">
        <div className="card-value">
          {typeof value === 'number' ? <AnimatedNumber value={value} /> : value}
        </div>
        <div className="card-label">{label}</div>
      </div>
      <div className="card-gradient" style={{ background: `linear-gradient(135deg, ${color}20, transparent)` }} />
    </div>
  );
};

const EnhancedSystemStatus: React.FC<Props> = ({ info }) => {
  if (!info) {
    return (
      <div className="status-panel">
        <h2>区块链系统状态</h2>
        <div className="enhanced-loading">
          <div className="loading-animation">
            <div className="loading-block"></div>
            <div className="loading-block"></div>
            <div className="loading-block"></div>
          </div>
          <p>正在加载系统状态...</p>
        </div>
      </div>
    );
  }

  // 计算系统健康度
  const healthScore = Math.min(
    (info.blockHeight > 0 ? 25 : 0) +
    (info.totalUsers > 0 ? 25 : 0) +
    (info.totalMiners > 0 ? 25 : 0) +
    (info.pendingTransactionCount < 10 ? 25 : Math.max(0, 25 - info.pendingTransactionCount)),
    100
  );

  return (
    <div className="status-panel enhanced">
      <div className="panel-header">
        <h2>区块链系统状态</h2>
        <div className="system-health">
          <span className="health-label">系统健康度</span>
          <CircularProgress percentage={healthScore} size={80} strokeWidth={6} />
        </div>
      </div>
      
      <div className="enhanced-status-grid">
        <StatusCard
          label="区块高度"
          value={info.blockHeight}
          icon="🏗️"
          color="var(--color-primary)"
        />
        
        <StatusCard
          label="待处理交易"
          value={info.pendingTransactionCount}
          icon="⏳"
          color="var(--color-warning)"
          showProgress={true}
          maxValue={20}
        />
        
        <StatusCard
          label="用户总数"
          value={info.totalUsers}
          icon="👥"
          color="var(--color-success)"
        />
        
        <StatusCard
          label="活跃矿工"
          value={info.totalMiners}
          icon="⛏️"
          color="#8b5cf6"
        />
        
        <StatusCard
          label="挖矿奖励"
          value={`${info.config.blockReward} 币`}
          icon="💰"
          color="#f59e0b"
        />
        
        <StatusCard
          label="挖矿难度"
          value={info.config.difficulty}
          icon="🎯"
          color="#ef4444"
          showProgress={true}
          maxValue={10}
        />
      </div>
    </div>
  );
};

export default EnhancedSystemStatus;
