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
import axios from 'axios';

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
    const fetchOverview = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:3000/api/admin/dashboard/overview', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const data = res.data?.data || {};
        const totals = data.totals || {};
        const totalSales = Number(totals.totalSales) || 0;
        const totalOrders = Number(totals.totalOrders) || 0;
        const paidOrders = Number(totals.paidOrders) || 0;
        const customerCount = Number(totals.customerCount) || 0;

        const avgOrder = (paidOrders || totalOrders) > 0 ? totalSales / (paidOrders || totalOrders) : 0;

        setStats({
          totalSales,
          totalOrders,
          totalCustomers: customerCount,
          averageOrderValue: avgOrder,
          conversionRate: 0,
          monthlyGrowth: 0
        });

        const apiRecent = Array.isArray(data.recentOrders) ? data.recentOrders : [];
        setRecentOrders(apiRecent.map((o: any) => ({
          id: o.id || o._id || '',
          customerName: o.customerName || o.customer?.name || 'Müşteri',
          customerEmail: o.customerEmail || o.customer?.email || '',
          total: Number(o.total) || 0,
          status: (o.status || 'pending') as any,
          date: o.createdAt || o.date || new Date().toISOString(),
          items: Array.isArray(o.items) ? o.items.length : (o.items || 0)
        })));

        const apiPopular = Array.isArray(data.popularProducts) ? data.popularProducts : [];
        setPopularProducts(apiPopular.map((p: any) => ({
          id: p.id || p._id,
          name: p.name,
          sales: Number(p.sales) || 0,
          revenue: Number(p.price) || 0,
          rating: Number(p.rating) || 0,
          image: p.thumbnail || (Array.isArray(p.images) && p.images[0]) || ''
        })));

        const trend = data.charts?.salesTrend || [];
        setSalesData(trend.map((t: any) => ({
          month: t.month || t.label || '',
          sales: Number(t.sales) || 0,
          orders: Number(t.orders) || 0
        })));
      } catch (e) {
        console.error('Admin overview fetch error:', e);
        // keep defaults
      }
    };
    fetchOverview();
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
              
               {salesData.length === 0 ? (
                 <div className="h-64 flex items-center justify-center text-gray-500">Satış verisi bulunmuyor</div>
               ) : (
                 <div className="h-64 flex items-end justify-between space-x-2">
                   {salesData.map((data, index) => (
                     <div key={index} className="flex flex-col items-center">
                       <div className="w-8 bg-blue-500 rounded-t" style={{ height: `${(data.sales / Math.max(1, Math.max(...salesData.map(s=>s.sales)))) * 200}px` }}></div>
                       <span className="text-xs text-gray-600 mt-2">{data.month}</span>
                     </div>
                   ))}
                 </div>
               )}
              
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
                  <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs text-gray-600">IMG</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
                      </div>
                      {product.sales > 0 && (<><span className="text-sm text-gray-500">•</span><span className="text-sm text-gray-600">{product.sales} satış</span></>)}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(product.revenue)}</p>
                    <p className="text-xs text-gray-500">fiyat</p>
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