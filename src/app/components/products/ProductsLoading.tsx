import { Loader2 } from 'lucide-react';

export default function ProductsLoading() {
  return (
    <div className="py-8 md:py-12 text-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <div className="absolute inset-0 rounded-full border-2 border-gray-200"></div>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-gray-900">Ürünler yükleniyor...</h3>
          <p className="text-sm text-gray-500">Lütfen bekleyin</p>
        </div>
        
        {/* Loading dots */}
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
}
