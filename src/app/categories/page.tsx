import Link from "next/link";

export default function CategoriesPage() {
  const categories = [
    {
      id: 1,
      name: "Elektronik",
      description: "Telefon, bilgisayar, tablet ve diğer elektronik ürünler",
      icon: "📱",
      color: "from-blue-500 to-blue-600",
      productCount: 156
    },
    {
      id: 2,
      name: "Giyim & Moda",
      description: "Erkek, kadın ve çocuk giyim ürünleri",
      icon: "👕",
      color: "from-purple-500 to-purple-600",
      productCount: 234
    },
    {
      id: 3,
      name: "Ev & Yaşam",
      description: "Ev dekorasyonu ve yaşam ürünleri",
      icon: "🏠",
      color: "from-green-500 to-green-600",
      productCount: 189
    },
    {
      id: 4,
      name: "Spor & Outdoor",
      description: "Spor ekipmanları ve outdoor ürünleri",
      icon: "⚽",
      color: "from-orange-500 to-orange-600",
      productCount: 98
    },
    {
      id: 5,
      name: "Kozmetik",
      description: "Makyaj, cilt bakımı ve kişisel bakım ürünleri",
      icon: "💄",
      color: "from-pink-500 to-pink-600",
      productCount: 145
    },
    {
      id: 6,
      name: "Kitap & Hobi",
      description: "Kitaplar, oyunlar ve hobi malzemeleri",
      icon: "📚",
      color: "from-indigo-500 to-indigo-600",
      productCount: 267
    },
    {
      id: 7,
      name: "Otomotiv",
      description: "Araç aksesuarları ve bakım ürünleri",
      icon: "🚗",
      color: "from-red-500 to-red-600",
      productCount: 87
    },
    {
      id: 8,
      name: "Bebek & Çocuk",
      description: "Bebek ve çocuk ürünleri",
      icon: "🧸",
      color: "from-yellow-500 to-yellow-600",
      productCount: 134
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg"></div>
          <span className="text-xl font-bold text-gray-900">MelikShop</span>
        </div>
        
        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
            Ana Sayfa
          </Link>
          <Link href="/categories" className="text-blue-600 font-medium transition-colors">
            Kategoriler
          </Link>
          <Link href="/products" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
            Ürünler
          </Link>
        </div>

        {/* Right Side Icons */}
        <div className="flex items-center space-x-4">
          <Link href="/login" className="text-gray-600 hover:text-gray-900 transition-colors">
            Sign In
          </Link>
          <Link 
            href="/login" 
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-200"
          >
            Get Started
          </Link>
          
          {/* Shopping Cart Icon */}
          <Link href="/cart" className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
            </svg>
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              3
            </span>
          </Link>
          
          {/* Profile Icon */}
          <Link href="/profile" className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </Link>
        </div>
      </nav>

      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Kategoriler</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            İhtiyacınız olan ürünleri kategorilere göre keşfedin. 
            Her kategoride binlerce kaliteli ürün bulabilirsiniz.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link 
              key={category.id}
              href={`/products?category=${category.id}`}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <div className="p-6">
                <div className={`w-16 h-16 bg-gradient-to-r ${category.color} rounded-xl flex items-center justify-center text-2xl mb-4`}>
                  {category.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{category.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{category.productCount} ürün</span>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Popular Categories */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Popüler Kategoriler</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
              <div className="text-4xl mb-4">🔥</div>
              <h3 className="text-xl font-semibold mb-2">En Çok Satanlar</h3>
              <p className="text-blue-100 mb-4">Bu hafta en çok tercih edilen ürünler</p>
              <Link href="/products?sort=popular" className="text-white font-medium hover:underline">
                İncele →
              </Link>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl p-8 text-white">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-2">Yeni Ürünler</h3>
              <p className="text-green-100 mb-4">En son eklenen ürünleri keşfedin</p>
              <Link href="/products?sort=new" className="text-white font-medium hover:underline">
                İncele →
              </Link>
            </div>
            <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-8 text-white">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-semibold mb-2">İndirimli Ürünler</h3>
              <p className="text-orange-100 mb-4">%50'ye varan indirimler</p>
              <Link href="/products?sort=discount" className="text-white font-medium hover:underline">
                İncele →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg"></div>
              <span className="text-xl font-bold">MelikShop</span>
            </div>
            <div className="flex space-x-6 text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Gizlilik</a>
              <a href="#" className="hover:text-white transition-colors">Şartlar</a>
              <a href="#" className="hover:text-white transition-colors">İletişim</a>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 MelikShop. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 