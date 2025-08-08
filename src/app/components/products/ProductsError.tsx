import { AlertCircle, RefreshCw } from 'lucide-react';
import Button from '../ui/Button';

interface ProductsErrorProps {
  error: string;
  onRetry: () => void;
}

export default function ProductsError({ error, onRetry }: ProductsErrorProps) {
  return (
    <div className="py-8 md:py-12 text-center">
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 md:p-8 max-w-md mx-auto">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-red-900">Hata Oluştu</h3>
            <p className="text-sm text-red-600 mb-4">{error}</p>
          </div>
          
          <Button 
            onClick={onRetry} 
            variant="outline"
            size="lg"
            icon={<RefreshCw className="w-4 h-4" />}
            className="bg-white hover:bg-red-50 border-red-300 text-red-700 hover:text-red-800"
          >
            Tekrar Dene
          </Button>
        </div>
      </div>
    </div>
  );
}
