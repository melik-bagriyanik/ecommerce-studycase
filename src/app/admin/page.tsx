'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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

interface AdminStats {
  totalSales: number;
  totalOrders: number;
  totalCustomers: number;
  averageOrderValue: number;
  conversionRate: number;
  monthlyGrowth: number;
}

interface AdminOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
  items: number;
}

interface PopularProduct {
  id: number;
  name: string;
  sales: number;
  revenue: number;
  rating: number;
  image: string;
}

interface SalesData {
  month: string;
  sales: number;
  orders: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<AdminStats>({
    totalSales: 0,
    totalOrders: 0,
    totalCustomers: 0,
    averageOrderValue: 0,
    conversionRate: 0,
    monthlyGrowth: 0
  });

  const [recentOrders, setRecentOrders] = useState<AdminOrder[]>([]);
  const [popularProducts, setPopularProducts] = useState<PopularProduct[]>([]);
  const [salesData, setSalesData] = useState<SalesData[]>([]);

  useEffect(() => {
    // Mock data loading
    setStats({
      totalSales: 125000,
      totalOrders: 1247,
      totalCustomers: 892,
      averageOrderValue: 100.24,
      conversionRate: 3.2,
      monthlyGrowth: 12.5
    });

    setRecentOrders([
      {
        id: 'ORD-001',
        customerName: 'Ahmet Yılmaz',
        customerEmail: 'ahmet@email.com',
        total: 299.99,
        status: 'delivered',
        date: '2024-01-15',
        items: 3
      },
      {
        id: 'ORD-002',
        customerName: 'Fatma Demir',
        customerEmail: 'fatma@email.com',
        total: 149.50,
        status: 'shipped',
        date: '2024-01-14',
        items: 2
      },
      {
        id: 'ORD-003',
        customerName: 'Mehmet Kaya',
        customerEmail: 'mehmet@email.com',
        total: 599.99,
        status: 'processing',
        date: '2024-01-14',
        items: 1
      },
      {
        id: 'ORD-004',
        customerName: 'Ayşe Özkan',
        customerEmail: 'ayse@email.com',
        total: 89.99,
        status: 'pending',
        date: '2024-01-13',
        items: 4
      },
      {
        id: 'ORD-005',
        customerName: 'Ali Çelik',
        customerEmail: 'ali@email.com',
        total: 199.99,
        status: 'delivered',
        date: '2024-01-13',
        items: 2
      }
    ]);

    setPopularProducts([
      {
        id: 1,
        name: 'iPhone 15 Pro',
        sales: 156,
        revenue: 156000,
        rating: 4.8,
        image: '/iphone-1.jpg'
      },
      {
        id: 2,
        name: 'Nike Air Max',
        sales: 89,
        revenue: 8900,
        rating: 4.6,
        image: '/nike-1.jpg'
      },
      {
        id: 3,
        name: 'Harry Potter Set',
        sales: 67,
        revenue: 6700,
        rating: 4.9,
        image: '/harry-potter-1.jpg'
      },
      {
        id: 4,
        name: 'Samsung Galaxy',
        sales: 45,
        revenue: 45000,
        rating: 4.7,
        image: '/samsung-1.jpg'
      }
    ]);

    setSalesData([
      { month: 'Oca', sales: 45000, orders: 180 },
      { month: 'Şub', sales: 52000, orders: 210 },
      { month: 'Mar', sales: 48000, orders: 195 },
      { month: 'Nis', sales: 61000, orders: 245 },
      { month: 'May', sales: 58000, orders: 230 },
      { month: 'Haz', sales: 72000, orders: 285 }
    ]);
  }, []);

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header removed; GlobalHeader from layout is used */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Satış</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalSales)}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600 ml-1">+{stats.monthlyGrowth}%</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <ShoppingBag className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Sipariş</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalOrders.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600 ml-1">+8.2%</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Müşteri</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600 ml-1">+5.1%</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ortalama Sipariş</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.averageOrderValue)}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600 ml-1">+2.3%</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sales Chart */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Satış Trendi</h3>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">7 Gün</Button>
                  <Button variant="outline" size="sm">30 Gün</Button>
                  <Button variant="primary" size="sm">6 Ay</Button>
                </div>
              </div>
              
              <div className="h-64 flex items-end justify-between space-x-2">
                {salesData.map((data, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className="w-8 bg-blue-500 rounded-t" style={{ height: `${(data.sales / 72000) * 200}px` }}></div>
                    <span className="text-xs text-gray-600 mt-2">{data.month}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Toplam Satış</p>
                  <p className="text-lg font-semibold text-gray-900">{formatCurrency(salesData.reduce((sum, data) => sum + data.sales, 0))}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Toplam Sipariş</p>
                  <p className="text-lg font-semibold text-gray-900">{salesData.reduce((sum, data) => sum + data.orders, 0)}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Order Status */}
          <div>
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Sipariş Durumu</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">Beklemede</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">45</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">Hazırlanıyor</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">23</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">Kargoda</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">67</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">Teslim Edildi</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">1,112</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Recent Orders */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Son Siparişler</h3>
              <Link href="/admin/orders" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Tümünü Gör →
              </Link>
            </div>
            
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div>
                      <p className="font-medium text-gray-900">{order.customerName}</p>
                      <p className="text-sm text-gray-600">{order.customerEmail}</p>
                      <p className="text-xs text-gray-500">{formatDate(order.date)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(order.total)}</p>
                    <Badge color={getStatusColor(order.status)} size="sm">
                      {getStatusText(order.status)}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">{order.items} ürün</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Popular Products */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Popüler Ürünler</h3>
              <Link href="/admin/products" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Tümünü Gör →
              </Link>
            </div>
            
            <div className="space-y-4">
              {popularProducts.map((product) => (
                <div key={product.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-xs text-gray-600">IMG</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
                      </div>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-600">{product.sales} satış</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(product.revenue)}</p>
                    <p className="text-xs text-gray-500">gelir</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 