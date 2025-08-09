'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { useWishlist } from '../store/useWishlist';
import { Heart, MapPin, User as UserIcon, ShoppingBag } from 'lucide-react';

interface UserShape {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
interface OrderShape {
  id: string;
  date: string;
  status: OrderStatus;
  total: number;
  items: number;
  trackingNumber?: string;
}

interface AddressShape {
  id: string;
  type: 'home' | 'work' | 'other';
  name: string;
  address: string;
  city: string;
  postalCode: string;
  isDefault?: boolean;
}

export default function ProfilePage() {
  const { items: wishlistItems, hydrate, remove } = useWishlist();
  const [activeTab, setActiveTab] = useState<'overview' | 'wishlist' | 'orders' | 'addresses' | 'profile'>('overview');
  const [user, setUser] = useState<UserShape | null>(null);
  const [orders, setOrders] = useState<OrderShape[]>([]);
  const [addresses, setAddresses] = useState<AddressShape[]>([]);

  useEffect(() => { hydrate(); }, [hydrate]);

  // Load lightweight user + optional orders/addresses from localStorage if present
  useEffect(() => {
    try {
      const userStr = localStorage.getItem('userData') || localStorage.getItem('user');
      const emailOnly = localStorage.getItem('userEmail') || '';
      if (userStr) {
        try {
          const raw = JSON.parse(userStr);
          setUser({
            firstName: raw.firstName || raw.firstname || 'Kullanıcı',
            lastName: raw.lastName || raw.lastname || '',
            email: raw.email || emailOnly,
            phone: raw.phone || ''
          });
        } catch {
          setUser({ firstName: 'Kullanıcı', lastName: '', email: emailOnly, phone: '' });
        }
      } else {
        setUser({ firstName: 'Kullanıcı', lastName: '', email: emailOnly, phone: '' });
      }
    } catch {
      setUser({ firstName: 'Kullanıcı', lastName: '', email: '', phone: '' });
    }

    // Optional persisted data
    try {
      const ordersStr = localStorage.getItem('orders');
      if (ordersStr) setOrders(JSON.parse(ordersStr));
    } catch {}
    try {
      const addressesStr = localStorage.getItem('addresses');
      if (addressesStr) setAddresses(JSON.parse(addressesStr));
    } catch {}
  }, []);

  const overviewStats = useMemo(() => ({
    orderCount: orders.length,
    wishlistCount: wishlistItems.length,
    addressCount: addresses.length,
  }), [orders.length, wishlistItems.length, addresses.length]);

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'delivered': return 'green';
      case 'shipped': return 'blue';
      case 'processing': return 'yellow';
      case 'pending': return 'gray';
      case 'cancelled': return 'red';
      default: return 'gray';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-gray-600">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Profil</h1>
          <Link href="/products"><Button variant="outline">Alışverişe Devam Et</Button></Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {user.firstName?.[0] || 'K'}{user.lastName?.[0] || ''}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{user.firstName} {user.lastName}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                </div>
              </div>
            </Card>

            <Card className="p-2">
              <nav className="space-y-1">
                {[
                  { id: 'overview', label: 'Genel Bakış', icon: UserIcon },
                  { id: 'wishlist', label: 'Favorilerim', icon: Heart },
                  { id: 'orders', label: 'Siparişlerim', icon: ShoppingBag },
                  { id: 'addresses', label: 'Adreslerim', icon: MapPin },
                  { id: 'profile', label: 'Profil', icon: UserIcon },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id as typeof activeTab)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left ${activeTab === t.id ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50 text-gray-700'}`}
                  >
                    <t.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{t.label}</span>
                    {t.id === 'wishlist' && (
                      <span className="ml-auto">
                        <Badge size="sm" color="red">{wishlistItems.length}</Badge>
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </Card>
          </div>

          {/* Main */}
          <div className="lg:col-span-3 space-y-8">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Genel Bakış</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Card className="p-5">
                    <div className="text-sm text-gray-600">Toplam Sipariş</div>
                    <div className="text-2xl font-bold text-gray-900">{overviewStats.orderCount}</div>
                  </Card>
                  <Card className="p-5">
                    <div className="text-sm text-gray-600">Favori Ürün</div>
                    <div className="text-2xl font-bold text-gray-900">{overviewStats.wishlistCount}</div>
                  </Card>
                  <Card className="p-5">
                    <div className="text-sm text-gray-600">Kayıtlı Adres</div>
                    <div className="text-2xl font-bold text-gray-900">{overviewStats.addressCount}</div>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">Favorilerim</h2>
                {wishlistItems.length === 0 ? (
                  <Card className="p-6 text-gray-600">Favori ürününüz bulunmuyor.</Card>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlistItems.map((item) => (
                      <Card key={item.id} className="p-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                            {item.image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-xs text-gray-400">IMG</span>
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-sm font-medium text-gray-900 line-clamp-2">{item.name}</h3>
                            <div className="text-sm font-semibold text-gray-900 mt-1">${item.price}</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-end gap-2 mt-4">
                          <Link href={`/products/${item.id}`}><Button size="sm" variant="outline">İncele</Button></Link>
                          <Button size="sm" variant="ghost" onClick={() => remove(item.id)}>Kaldır</Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">Siparişlerim</h2>
                {orders.length === 0 ? (
                  <Card className="p-6 text-gray-600">Henüz siparişiniz bulunmuyor.</Card>
                ) : (
                  <div className="space-y-3">
                    {orders.map((o) => (
                      <Card key={o.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-gray-900">{o.id}</div>
                            <div className="text-sm text-gray-500">{o.date}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-gray-900">{o.total.toFixed(2)} TL</div>
                            <Badge size="sm" color={getStatusColor(o.status)}>{o.status}</Badge>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Adreslerim</h2>
                  <Button size="sm" variant="outline">Yeni Adres</Button>
                </div>
                {addresses.length === 0 ? (
                  <Card className="p-6 text-gray-600">Kayıtlı adresiniz bulunmuyor.</Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((a) => (
                      <Card key={a.id} className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium text-gray-900">{a.name}</div>
                          {a.isDefault && <Badge size="sm" color="green">Varsayılan</Badge>}
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div>{a.address}</div>
                          <div>{a.city} {a.postalCode}</div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">Profil</h2>
                <Card className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-600">Ad</div>
                      <div className="font-medium text-gray-900">{user.firstName}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Soyad</div>
                      <div className="font-medium text-gray-900">{user.lastName}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">E-posta</div>
                      <div className="font-medium text-gray-900">{user.email}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Telefon</div>
                      <div className="font-medium text-gray-900">{user.phone || '-'}</div>
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