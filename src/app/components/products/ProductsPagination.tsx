import Button from '../ui/Button';

interface ProductsPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalProducts: number;
}

export default function ProductsPagination({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  totalProducts 
}: ProductsPaginationProps) {
  if (totalProducts === 0) return null;

  return (
    <div className="text-center mt-8 mb-8">
      <div className="flex items-center justify-center space-x-1 sm:space-x-2 flex-wrap gap-2">
        <Button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="p-2 rounded-full hover:bg-gray-200"
        >
          &lt;
        </Button>
        {Array.from({ length: totalPages }).map((_, index) => (
          <Button
            key={index + 1}
            onClick={() => onPageChange(index + 1)}
            className={`p-2 rounded-full hover:bg-gray-200 ${currentPage === index + 1 ? 'bg-blue-600 text-white' : ''}`}
          >
            {index + 1}
          </Button>
        ))}
        <Button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages || totalProducts === 0}
          className="p-2 rounded-full hover:bg-gray-200"
        >
          &gt;
        </Button>
      </div>
    </div>
  );
}
