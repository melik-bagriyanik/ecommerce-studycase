import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: 'red' | 'green' | 'blue' | 'yellow' | 'gray';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  count,
  size = 'md',
  color = 'red',
  className = '',
}) => {
  const baseClasses = 'relative inline-flex';
  
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };
  
  const colorClasses = {
    red: 'bg-red-500 text-white',
    green: 'bg-green-500 text-white',
    blue: 'bg-blue-500 text-white',
    yellow: 'bg-yellow-500 text-white',
    gray: 'bg-gray-500 text-white',
  };
  
  const classes = `${baseClasses} ${className}`;
  const badgeClasses = `absolute -top-1 -right-1 rounded-full ${colorClasses[color]} ${sizeClasses[size]} px-1.5 py-0.5 min-w-[1.25rem] flex items-center justify-center`;
  
  return (
    <div className={classes}>
      {children}
      {count !== undefined && count > 0 && (
        <span className={badgeClasses}>
          {count > 99 ? '99+' : count}
        </span>
      )}
    </div>
  );
};

export default Badge; 