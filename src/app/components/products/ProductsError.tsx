import Button from '../ui/Button';

interface ProductsErrorProps {
  error: string;
  onRetry: () => void;
}

export default function ProductsError({ error, onRetry }: ProductsErrorProps) {
  return (
    <div className="py-12 text-center">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
        <h3 className="text-lg text-red-600 mb-2">Hata Oluştu</h3>
        <p className="text-sm text-red-500 mb-4">{error}</p>
        <Button 
          onClick={onRetry} 
          variant="outline"
          size="sm"
        >
          Tekrar Dene
        </Button>
      </div>
    </div>
  );
}
