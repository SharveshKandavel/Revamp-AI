
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
      {showText && (
        <span className="font-bold text-tech-dark dark:text-white">
          Revamp
        </span>
      )}
    </Link>
  );
};

export default Logo;
