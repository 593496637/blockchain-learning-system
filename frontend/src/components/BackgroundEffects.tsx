import React from 'react';
import './BackgroundEffects.css';

// 动态粒子背景组件
export const ParticleBackground: React.FC = () => {
  return (
    <div className="particle-background">
      <div className="particle particle-1"></div>
      <div className="particle particle-2"></div>
      <div className="particle particle-3"></div>
      <div className="particle particle-4"></div>
      <div className="particle particle-5"></div>
      <div className="particle particle-6"></div>
    </div>
  );
};

// 区块链网格背景
export const BlockchainGrid: React.FC = () => {
  return (
    <div className="blockchain-grid">
      <svg className="grid-svg" width="100%" height="100%">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--color-border)" strokeOpacity="0.3" strokeWidth="1"/>
          </pattern>
          <linearGradient id="gridGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.1" />
            <stop offset="100%" stopColor="var(--color-success)" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        <rect width="100%" height="100%" fill="url(#gridGradient)" />
      </svg>
    </div>
  );
};

// 动态渐变背景
export const GradientOrb: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`gradient-orb ${className}`}>
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <div className="orb orb-3"></div>
    </div>
  );
};

// 区块链节点连接动画
export const NodeNetwork: React.FC = () => {
  return (
    <div className="node-network">
      <svg className="network-svg" width="100%" height="100%">
        <defs>
          <linearGradient id="nodeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--color-primary)" />
            <stop offset="100%" stopColor="var(--color-success)" />
          </linearGradient>
        </defs>
        
        {/* 节点 */}
        <circle cx="20%" cy="30%" r="4" fill="url(#nodeGradient)" className="network-node">
          <animate attributeName="r" values="4;6;4" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="80%" cy="20%" r="4" fill="url(#nodeGradient)" className="network-node">
          <animate attributeName="r" values="4;6;4" dur="4s" repeatCount="indefinite" />
        </circle>
        <circle cx="60%" cy="70%" r="4" fill="url(#nodeGradient)" className="network-node">
          <animate attributeName="r" values="4;6;4" dur="2.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="30%" cy="80%" r="4" fill="url(#nodeGradient)" className="network-node">
          <animate attributeName="r" values="4;6;4" dur="3.5s" repeatCount="indefinite" />
        </circle>
        
        {/* 连接线 */}
        <line x1="20%" y1="30%" x2="80%" y2="20%" stroke="url(#nodeGradient)" strokeWidth="1" opacity="0.6" className="network-line">
          <animate attributeName="opacity" values="0.3;0.8;0.3" dur="4s" repeatCount="indefinite" />
        </line>
        <line x1="80%" y1="20%" x2="60%" y2="70%" stroke="url(#nodeGradient)" strokeWidth="1" opacity="0.6" className="network-line">
          <animate attributeName="opacity" values="0.3;0.8;0.3" dur="3s" repeatCount="indefinite" />
        </line>
        <line x1="60%" y1="70%" x2="30%" y2="80%" stroke="url(#nodeGradient)" strokeWidth="1" opacity="0.6" className="network-line">
          <animate attributeName="opacity" values="0.3;0.8;0.3" dur="5s" repeatCount="indefinite" />
        </line>
        <line x1="30%" y1="80%" x2="20%" y2="30%" stroke="url(#nodeGradient)" strokeWidth="1" opacity="0.6" className="network-line">
          <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite" />
        </line>
      </svg>
    </div>
  );
};
