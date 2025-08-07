'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  type?: 'success' | 'error' | 'info';
}

export default function Toast({ message, isVisible, onClose, type = 'success' }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
  const iconColor = type === 'success' ? 'text-green-500' : type === 'error' ? 'text-red-500' : 'text-blue-500';

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-2">
      <div className={`${bgColor} text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 min-w-80`}>
        <CheckCircle className="w-6 h-6 flex-shrink-0" />
        <span className="flex-1">{message}</span>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
