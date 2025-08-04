import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  cover?: React.ReactNode;
  actions?: React.ReactNode[];
  title?: React.ReactNode;
  description?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverable = false,
  cover,
  actions,
  title,
  description,
}) => {
  const baseClasses = 'bg-white rounded-lg shadow-md overflow-hidden';
  const hoverClass = hoverable ? 'hover:shadow-xl transition-shadow duration-300' : '';
  const classes = `${baseClasses} ${hoverClass} ${className}`;
  
  return (
    <div className={classes}>
      {cover && (
        <div className="relative">
          {cover}
        </div>
      )}
      
      {(title || description) && (
        <div className="p-6">
          {title && (
            <div className="mb-2">
              {typeof title === 'string' ? (
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              ) : (
                title
              )}
            </div>
          )}
          {description && (
            <div className="text-gray-600">
              {typeof description === 'string' ? (
                <p className="text-sm">{description}</p>
              ) : (
                description
              )}
            </div>
          )}
        </div>
      )}
      
      {children && (
        <div className="p-6">
          {children}
        </div>
      )}
      
      {actions && actions.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-end space-x-2">
            {actions.map((action, index) => (
              <div key={index}>{action}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Card; 