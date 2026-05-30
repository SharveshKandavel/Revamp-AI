
import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ 
  className = "", 
  size = "md", 
  showText = true 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`}>
      <div className={`${sizeClasses[size]} bg-tech-purple rounded-lg flex items-center justify-center text-white font-bold shadow-lg`}>
        R
      </div>
      
      {showText && (
        <span className="font-bold bg-gradient-to-r from-tech-purple to-tech-accent bg-clip-text text-transparent">
          Revamp AI
        </span>
      )}
    </Link>
  );
};

export default Logo;
