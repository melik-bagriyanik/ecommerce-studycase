'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
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
  Check,
  Trash2
} from 'lucide-react';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState({
    subtotal: 0,
    tax: 0,
    shipping: 0,
    total: 0
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Türkiye'
  });

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('credit-card');

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'credit-card',
      name: 'Kredi Kartı',
      description: 'Visa, Mastercard, American Express',
      icon: '💳'
    },
    {
      id: 'bank-transfer',
      name: 'Banka Havalesi',
      description: 'EFT/Havale ile ödeme',
      icon: '🏦'
    },
    {
      id: 'paypal',
      name: 'PayPal',
      description: 'Güvenli online ödeme',
      icon: '🔒'
    }
  ];

  useEffect(() => {
    // Load cart data from localStorage
    const savedCartItems = localStorage.getItem('cartItems');
    const savedCartTotal = localStorage.getItem('cartTotal');
    
    if (savedCartItems) {
      setCartItems(JSON.parse(savedCartItems));
    }
    
    if (savedCartTotal) {
      setCartTotal(JSON.parse(savedCartTotal));
    }
  }, []);

  const handleAddressChange = (field: keyof ShippingAddress, value: string) => {
    setShippingAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      // Validate shipping address
      const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'postalCode'];
      const isValid = requiredFields.every(field => shippingAddress[field as keyof ShippingAddress].trim() !== '');
      
      if (!isValid) {
        alert('Lütfen tüm gerekli alanları doldurun.');
        return;
      }
    }
    
    setCurrentStep(prev => prev + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    setOrderComplete(true);
    
    // Clear cart
    localStorage.removeItem('cartItems');
    localStorage.removeItem('cartTotal');
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Siparişiniz Tamamlandı!</h1>
            <p className="text-gray-600 mb-8">Siparişiniz başarıyla alındı. Sipariş numaranız: #ORD-{Date.now().toString().slice(-6)}</p>
            <div className="space-x-4">
              <Button onClick={() => router.push('/')}>
                Ana Sayfaya Dön
              </Button>
              <Button variant="ghost" onClick={() => router.push('/products')}>
                Alışverişe Devam Et
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft />
              <span>Alışverişe Dön</span>
            </Link>
            <h1 className="text-xl font-semibold text-gray-900">Ödeme</h1>
            <div className="w-8"></div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div className={`flex items-center ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    currentStep >= 1 ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300'
                  }`}>
                    1
                  </div>
                  <span className="ml-2 text-sm font-medium">Teslimat Adresi</span>
                </div>
                <div className={`flex-1 h-0.5 mx-4 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                <div className={`flex items-center ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    currentStep >= 2 ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300'
                  }`}>
                    2
                  </div>
                  <span className="ml-2 text-sm font-medium">Ödeme</span>
                </div>
              </div>
            </div>

            {/* Step 1: Shipping Address */}
            {currentStep === 1 && (
              <Card>
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Teslimat Adresi</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Ad"
                      placeholder="Adınızı girin"
                      value={shippingAddress.firstName}
                      onChange={(e) => handleAddressChange('firstName', e.target.value)}
                      required
                    />
                    <Input
                      label="Soyad"
                      placeholder="Soyadınızı girin"
                      value={shippingAddress.lastName}
                      onChange={(e) => handleAddressChange('lastName', e.target.value)}
                      required
                    />
                    <Input
                      label="E-posta"
                      type="email"
                      placeholder="ornek@email.com"
                      value={shippingAddress.email}
                      onChange={(e) => handleAddressChange('email', e.target.value)}
                      required
                    />
                    <Input
                      label="Telefon"
                      type="tel"
                      placeholder="0555 123 45 67"
                      value={shippingAddress.phone}
                      onChange={(e) => handleAddressChange('phone', e.target.value)}
                      required
                    />
                    <div className="md:col-span-2">
                      <Input
                        label="Adres"
                        placeholder="Mahalle, sokak, bina no, daire no"
                        value={shippingAddress.address}
                        onChange={(e) => handleAddressChange('address', e.target.value)}
                        required
                      />
                    </div>
                    <Input
                      label="Şehir"
                      placeholder="İstanbul, Ankara, İzmir..."
                      value={shippingAddress.city}
                      onChange={(e) => handleAddressChange('city', e.target.value)}
                      required
                    />
                    <Input
                      label="Posta Kodu"
                      placeholder="34000"
                      value={shippingAddress.postalCode}
                      onChange={(e) => handleAddressChange('postalCode', e.target.value)}
                      required
                    />
                  </div>
                  
                
                  <div className="mt-6">
                    <Button onClick={handleNextStep} className="w-full">
                      Devam Et
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Step 2: Payment */}
            {currentStep === 2 && (
              <Card>
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Ödeme Yöntemi</h2>
                  
                  <div className="space-y-4 mb-6">
                    {paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                          selectedPaymentMethod === method.id
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedPaymentMethod(method.id)}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{method.icon}</span>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">{method.name}</h3>
                            <p className="text-sm text-gray-500">{method.description}</p>
                          </div>
                          <div className={`w-4 h-4 rounded-full border-2 ${
                            selectedPaymentMethod === method.id
                              ? 'border-blue-600 bg-blue-600'
                              : 'border-gray-300'
                          }`}>
                            {selectedPaymentMethod === method.id && (
                              <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {selectedPaymentMethod === 'credit-card' && (
                    <div className="border border-gray-200 rounded-lg p-4 mb-6">
                      <h3 className="font-medium text-gray-900 mb-4">Kart Bilgileri</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="Kart Numarası"
                          placeholder="1234 5678 9012 3456"
                          required
                        />
                        <Input
                          label="Kart Sahibi"
                          placeholder="Ad Soyad"
                          required
                        />
                        <Input
                          label="Son Kullanma Tarihi"
                          placeholder="MM/YY"
                          required
                        />
                        <Input
                          label="CVV"
                          placeholder="123"
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-4">
                    <Button variant="ghost" onClick={handlePreviousStep}>
                      Geri
                    </Button>
                    <Button 
                      onClick={handlePayment}
                      disabled={isProcessing}
                      className="flex-1"
                    >
                      {isProcessing ? 'İşleniyor...' : 'Ödemeyi Tamamla'}
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Sipariş Özeti</h2>
                
                {/* Cart Items */}
                <div className="space-y-4 mb-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-md"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 truncate">{item.name}</h3>
                        <p className="text-sm text-gray-500">Adet: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        {(item.price * item.quantity).toFixed(2)} TL
                      </p>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Ara Toplam</span>
                    <span>{cartTotal.subtotal.toFixed(2)} TL</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">KDV (%18)</span>
                    <span>{cartTotal.tax.toFixed(2)} TL</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Kargo</span>
                    <span>
                      {cartTotal.shipping === 0 ? (
                        <span className="text-green-600">Ücretsiz</span>
                      ) : (
                        `${cartTotal.shipping.toFixed(2)} TL`
                      )}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-2">
                    <div className="flex justify-between font-semibold">
                      <span>Toplam</span>
                      <span>{cartTotal.total.toFixed(2)} TL</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 