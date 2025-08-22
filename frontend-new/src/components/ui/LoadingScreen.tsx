import React from 'react';
import { Spin } from 'antd';

export const LoadingScreen: React.FC = () => {
  return (
    <div className="loading-container">
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 24 }}>🔗</div>
        <Spin size="large" />
        <div style={{ marginTop: 16, fontSize: 18, fontWeight: 500 }}>
          正在连接区块链系统...
        </div>
        <div style={{ marginTop: 8, fontSize: 14, opacity: 0.8 }}>
          请确保后端服务已启动 (http://localhost:3001)
        </div>
      </div>
    </div>
  );
};
