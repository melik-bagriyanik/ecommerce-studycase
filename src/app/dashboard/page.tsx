'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { 
  ShoppingCart, 
  User, 
  Home as HomeIcon,
  Package,
  ShoppingBag,
  Star,
  Flame,
  Clock,
  ArrowLeft,
  Minus,
  Plus,
  Heart,
  Share2,
  BarChart3,
  Users,
  DollarSign,
  TrendingUp,
  Eye,
  Pencil,
  Settings,
  LogOut,
  MapPin,
  CreditCard,
  Truck,
  Check
} from 'lucide-react';

interface User {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface Order {
  id: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: number;
  trackingNumber?: string;
}

interface WishlistItem {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  addedDate: string;
}

interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  name: string;
  address: string;
  city: string;
  postalCode: string;
  isDefault: boolean;
}

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const isEmailVerified = localStorage.getItem('isEmailVerified');
    
    if (!isLoggedIn || !isEmailVerified) {
      router.push('/login');
      return;
    }

    // Load user data
    const userData = localStorage.getItem('userData');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Mock data
    setOrders([
      {
        id: 'ORD-001',
        date: '2024-01-15',
        status: 'delivered',
        total: 1299.99,
        items: 2,
        trackingNumber: 'TRK123456789'
      },
      {
        id: 'ORD-002',
        date: '2024-01-20',
        status: 'shipped',
        total: 799.99,
        items: 1,
        trackingNumber: 'TRK987654321'
      },
      {
        id: 'ORD-003',
        date: '2024-01-25',
        status: 'processing',
        total: 159.99,
        items: 1
      }
    ]);

    setWishlist([
      {
        id: 1,
        name: 'iPhone 15 Pro Max 256GB Titanium',
        price: 1199.99,
        originalPrice: 1299.99,
        image: '/iphone-1.jpg',
        addedDate: '2024-01-10'
      },
      {
        id: 2,
        name: 'Samsung Galaxy S24 Ultra 512GB',
        price: 1099.99,
        originalPrice: 1199.99,
        image: '/samsung-1.jpg',
        addedDate: '2024-01-12'
      },
      {
        id: 3,
        name: 'MacBook Pro 14" M3 Pro',
        price: 2499.99,
        originalPrice: 2699.99,
        image: '/macbook-1.jpg',
        addedDate: '2024-01-15'
      }
    ]);

    setAddresses([
      {
        id: '1',
        type: 'home',
        name: 'Ev Adresi',
        address: 'Atatürk Mahallesi, Cumhuriyet Caddesi No:123',
        city: 'İstanbul',
        postalCode: '34000',
        isDefault: true
      },
      {
        id: '2',
        type: 'work',
        name: 'İş Adresi',
        address: 'Levent Mahallesi, Büyükdere Caddesi No:456',
        city: 'İstanbul',
        postalCode: '34330',
        isDefault: false
      }
    ]);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('isEmailVerified');
    localStorage.removeItem('userData');
    router.push('/');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'green';
      case 'shipped': return 'blue';
      case 'processing': return 'yellow';
      case 'pending': return 'gray';
      case 'cancelled': return 'red';
      default: return 'gray';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered': return 'Teslim Edildi';
      case 'shipped': return 'Kargoda';
      case 'processing': return 'Hazırlanıyor';
      case 'pending': return 'Beklemede';
      case 'cancelled': return 'İptal Edildi';
      default: return status;
    }
  };

  const removeFromWishlist = (id: number) => {
    setWishlist(prev => prev.filter(item => item.id !== id));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg"></div>
              <span className="text-xl font-bold text-gray-900">MelikShop</span>
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Hoş geldin, {user.firstName}!
              </span>
              <Button variant="ghost" onClick={handleLogout} className="flex items-center space-x-2">
                <LogOut size="sm" />
                <span>Çıkış</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {user.firstName[0]}{user.lastName[0]}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>

                <nav className="space-y-2">
                  {[
                    { id: 'overview', label: 'Genel Bakış', icon: User },
                    // { id: 'orders', label: 'Siparişlerim', icon: ShoppingBagIcon },
                    { id: 'wishlist', label: 'Favorilerim', icon: Heart },
                    { id: 'addresses', label: 'Adreslerim', icon: MapPin },
                    { id: 'profile', label: 'Profil', icon: Settings }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <tab.icon size="sm" />
                      <span className="text-sm font-medium">{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Genel Bakış</h2>
                
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Toplam Sipariş</p>
                          <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
                        </div>
                        {/* <ShoppingBagIcon className="w-8 h-8 text-blue-600" /> */}
                      </div>
                    </div>
                  </Card>
                  
                  <Card>
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Favori Ürün</p>
                          <p className="text-2xl font-bold text-gray-900">{wishlist.length}</p>
                        </div>
                        <Heart className="w-8 h-8 text-red-600" />
                      </div>
                    </div>
                  </Card>
                  
                  <Card>
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Kayıtlı Adres</p>
                          <p className="text-2xl font-bold text-gray-900">{addresses.length}</p>
                        </div>
                        <MapPin className="w-8 h-8 text-green-600" />
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Recent Orders */}
                <Card>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Son Siparişler</h3>
                    <div className="space-y-4">
                      {orders.slice(0, 3).map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              {/* <ShoppingBagIcon className="w-5 h-5 text-blue-600" /> */}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{order.id}</p>
                              <p className="text-sm text-gray-500">{order.date}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">{order.total.toFixed(2)} TL</p>
                            <Badge color={getStatusColor(order.status)} size="sm">
                              {getStatusText(order.status)}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Siparişlerim</h2>
                
                <div className="space-y-4">
                  {orders.map((order) => (
                    <Card key={order.id}>
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-gray-900">{order.id}</h3>
                            <p className="text-sm text-gray-500">{order.date}</p>
                          </div>
                          <Badge color={getStatusColor(order.status)}>
                            {getStatusText(order.status)}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600">Toplam Tutar</p>
                            <p className="font-semibold text-gray-900">{order.total.toFixed(2)} TL</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Ürün Sayısı</p>
                            <p className="font-semibold text-gray-900">{order.items}</p>
                          </div>
                          {order.trackingNumber && (
                            <div>
                              <p className="text-sm text-gray-600">Takip No</p>
                              <p className="font-semibold text-gray-900">{order.trackingNumber}</p>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex space-x-3">
                          <Button variant="ghost" size="sm">
                            Detayları Gör
                          </Button>
                          {order.trackingNumber && (
                            <Button variant="ghost" size="sm">
                              Kargo Takip
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === 'wishlist' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Favorilerim</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlist.map((item) => (
                    <Card key={item.id}>
                      <div className="p-4">
                        <div className="relative mb-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                          <button
                            onClick={() => removeFromWishlist(item.id)}
                            className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        
                        <h3 className="font-semibold text-gray-900 mb-2">{item.name}</h3>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-gray-900">{item.price.toFixed(2)} TL</span>
                            {item.originalPrice && (
                              <span className="text-sm text-gray-500 line-through">
                                {item.originalPrice.toFixed(2)} TL
                              </span>
                            )}
                          </div>
                          <Badge color="red" size="sm">
                            Favori
                          </Badge>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button size="sm" className="flex-1">
                            Sepete Ekle
                          </Button>
                          <Button variant="ghost" size="sm">
                            Detay
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Adreslerim</h2>
                  <Button>
                    Yeni Adres Ekle
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {addresses.map((address) => (
                    <Card key={address.id}>
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-5 h-5 text-gray-600" />
                            <h3 className="font-semibold text-gray-900">{address.name}</h3>
                          </div>
                          {address.isDefault && (
                            <Badge color="green" size="sm">
                              Varsayılan
                            </Badge>
                          )}
                        </div>
                        
                        <div className="space-y-2 text-sm text-gray-600">
                          <p>{address.address}</p>
                          <p>{address.city} {address.postalCode}</p>
                        </div>
                        
                        <div className="flex space-x-2 mt-4">
                          <Button variant="ghost" size="sm">
                            Düzenle
                          </Button>
                          <Button variant="ghost" size="sm">
                            Sil
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Profil Bilgileri</h2>
                
                <Card>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Ad</label>
                        <input
                          type="text"
                          value={user.firstName}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Soyad</label>
                        <input
                          type="text"
                          value={user.lastName}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">E-posta</label>
                        <input
                          type="email"
                          value={user.email}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
                        <input
                          type="tel"
                          value={user.phone}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-6 flex space-x-3">
                      <Button>
                        Değişiklikleri Kaydet
                      </Button>
                      <Button variant="ghost">
                        İptal
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 