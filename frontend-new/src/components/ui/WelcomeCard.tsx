import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';

interface WelcomeCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  path: string;
  gradient?: string;
}

export const WelcomeCard: React.FC<WelcomeCardProps> = ({
  title,
  description,
  icon,
  path,
  gradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(path);
  };

  return (
    <div 
      className="welcome-card"
      onClick={handleClick}
      style={{ background: gradient }}
    >
      <div className="welcome-card-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};
