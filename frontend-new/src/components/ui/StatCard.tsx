import React from 'react';
import { Card } from 'antd';
import type { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  description,
  trend
}) => {
  return (
    <Card className="stat-card" hoverable>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div className="stat-card-icon">{icon}</div>
          <div className="stat-card-value">{value}</div>
          <div className="stat-card-label">{title}</div>
          {description && (
            <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 4 }}>
              {description}
            </div>
          )}
        </div>
        {trend && (
          <div style={{ textAlign: 'right' }}>
            <div
              style={{
                color: trend.isPositive ? '#52c41a' : '#ff4d4f',
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              {trend.isPositive ? '+' : ''}{trend.value}%
            </div>
            <div style={{ fontSize: 12, color: '#8c8c8c' }}>
              较上期
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
