import React from 'react';

interface InputProps {
  label?: string;
  name?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'search' | 'tel';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  required?: boolean;
  className?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  onPressEnter?: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  maxLength?: number;
}

const Input: React.FC<InputProps> = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = 'text',
  size = 'md',
  disabled = false,
  required = false,
  className = '',
  prefix,
  suffix,
  onPressEnter,
  onKeyDown,
  maxLength,
}) => {
  const baseClasses = 'w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200';
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-4 py-3 text-base',
  };
  
  const disabledClass = disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white';
  
  const classes = `${baseClasses} ${sizeClasses[size]} ${disabledClass} ${className}`;
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onPressEnter) {
      onPressEnter();
    }
    if (onKeyDown) {
      onKeyDown(e);
    }
  };
  
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {prefix && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {prefix}
          </div>
        )}
        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          maxLength={maxLength}
          className={`${classes} ${prefix ? 'pl-10' : ''} ${suffix ? 'pr-10' : ''}`}
          onKeyDown={handleKeyDown}
        />
        {suffix && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {suffix}
          </div>
        )}
      </div>
    </div>
  );
};

export default Input; 