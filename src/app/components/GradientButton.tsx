import React from 'react';
import Button from './ui/Button';

interface GradientButtonProps {
  children: React.ReactNode;
  variant?: 'blue-purple' | 'green-blue' | 'orange-red' | 'purple-pink';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  block?: boolean;
}

const GradientButton: React.FC<GradientButtonProps> = ({
  children,
  variant = 'blue-purple',
  size = 'md',
  icon,
  onClick,
  className = '',
  disabled = false,
  loading = false,
  block = false,
}) => {
  const variantClasses = {
    'blue-purple': 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700',
    'green-blue': 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700',
    'orange-red': 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700',
    'purple-pink': 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700',
  };

  return (
    <Button
      variant="primary"
      size={size}
      icon={icon}
      onClick={onClick}
      className={`${variantClasses[variant]} ${className}`}
      disabled={disabled}
      loading={loading}
      block={block}
    >
      {children}
    </Button>
  );
};

export default GradientButton; 