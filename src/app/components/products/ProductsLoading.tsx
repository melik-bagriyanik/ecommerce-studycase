export default function ProductsLoading() {
  return (
    <div className="py-12 text-center">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
      <h3 className="text-lg text-gray-600">Ürünler yükleniyor...</h3>
      <p className="text-sm text-gray-500">Lütfen bekleyin</p>
    </div>
  );
}
