'use client';

import { useCart } from '../context/CartContext';
import Toast from './Toast';

export default function ToastWrapper() {
  const { toast, hideToast } = useCart();
  
  return (
    <Toast
      message={toast.message}
      isVisible={toast.isVisible}
      type={toast.type}
      onClose={hideToast}
    />
  );
}
