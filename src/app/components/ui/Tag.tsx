import React from 'react';

interface TagProps {
  children: React.ReactNode;
  color?: 'red' | 'green' | 'blue' | 'yellow' | 'gray' | 'purple' | 'pink';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Tag: React.FC<TagProps> = ({
  children,
  color = 'gray',
  size = 'md',
  className = '',
}) => {
  const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
  
  const colorClasses = {
    red: 'bg-red-100 text-red-800',
    green: 'bg-green-100 text-green-800',
    blue: 'bg-blue-100 text-blue-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    gray: 'bg-gray-100 text-gray-800',
    purple: 'bg-purple-100 text-purple-800',
    pink: 'bg-pink-100 text-pink-800',
  };
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-0.5',
    lg: 'text-sm px-3 py-1',
  };
  
  const classes = `${baseClasses} ${colorClasses[color]} ${sizeClasses[size]} ${className}`;
  
  return (
    <span className={classes}>
      {children}
    </span>
  );
};

export default Tag; 