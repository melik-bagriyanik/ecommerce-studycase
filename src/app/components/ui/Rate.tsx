import React from 'react';

interface RateProps {
  value?: number;
  defaultValue?: number;
  disabled?: boolean;
  onChange?: (value: number) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Rate: React.FC<RateProps> = ({
  value,
  defaultValue,
  disabled = false,
  onChange,
  className = '',
  size = 'md',
}) => {
  const [currentValue, setCurrentValue] = React.useState(value || defaultValue || 0);
  const [hoverValue, setHoverValue] = React.useState(0);
  
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };
  
  const handleClick = (starValue: number) => {
    if (!disabled && onChange) {
      onChange(starValue);
    }
    if (!disabled) {
      setCurrentValue(starValue);
    }
  };
  
  const handleMouseEnter = (starValue: number) => {
    if (!disabled) {
      setHoverValue(starValue);
    }
  };
  
  const handleMouseLeave = () => {
    if (!disabled) {
      setHoverValue(0);
    }
  };
  
  const displayValue = hoverValue || currentValue;
  
  return (
    <div className={`inline-flex ${className}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`${sizeClasses[size]} text-gray-300 hover:text-yellow-400 transition-colors duration-200 ${
            disabled ? 'cursor-not-allowed' : 'cursor-pointer'
          }`}
          onClick={() => handleClick(star)}
          onMouseEnter={() => handleMouseEnter(star)}
          onMouseLeave={handleMouseLeave}
          disabled={disabled}
        >
          <svg
            className={`w-full h-full ${
              star <= displayValue ? 'text-yellow-400' : 'text-gray-300'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
    </div>
  );
};

export default Rate; 