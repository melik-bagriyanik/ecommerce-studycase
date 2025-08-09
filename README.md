# 🛍️ MlkShop - E-Commerce Platform

Modern e-ticaret platformu. Next.js 15, TypeScript ve Tailwind CSS ile geliştirilmiştir.

## 🚀 Özellikler

- **Ürün Yönetimi**: Liste, filtreleme, arama, sıralama
- **Responsive Tasarım**: Mobil ve desktop uyumlu
- **Sepet Sistemi**: Ürün ekleme/çıkarma, toplam hesaplama
- **Kullanıcı Yönetimi**: Kayıt, giriş, profil
- **AI Öneri Sistemi**: OpenAI API ile akıllı ürün önerileri

## 🛠️ Teknolojiler

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, Lucide React
- **Backend**: Node.js, Express.js, MongoDB, JWT
- **AI**: OpenAI GPT-3.5 Turbo API

## 🚀 Kurulum

```bash
# Projeyi klonlayın
git clone <repository-url>
cd ecommerce-studycase

# Bağımlılıkları yükleyin
npm install

# Environment değişkenlerini ayarlayın
cp .env.example .env.local
# .env.local dosyasında OPENAI_API_KEY değerini ayarlayın

# Geliştirme sunucusunu başlatın
npm run dev
```

Tarayıcıda `http://localhost:3000` adresini açın.

### OpenAI API Kurulumu

1. [OpenAI Platform](https://platform.openai.com/) adresine gidin
2. API anahtarı oluşturun
3. `.env.local` dosyasında `OPENAI_API_KEY` değerini ayarlayın
4. Öneri sistemi otomatik olarak çalışmaya başlayacaktır

## 📱 Kullanım

- **Ana Sayfa**: Ürün listesi, filtreleme, arama
- **Ürün Detayı**: Ürün bilgileri, sepete ekleme
- **Sepet**: Ürün yönetimi, ödeme
- **Kullanıcı**: Kayıt, giriş, profil

## 🎯 Filtreleme Özellikleri

- **Kategori**: Electronics, Clothing, Home and Garden, Sports, Books, Health and Beauty, Toys, Food
- **Arama**: Ürün adı, açıklama ve kategori içinde arama
- **Sıralama**: İsim, fiyat, puan, yenilik
- **Fiyat Aralığı**: $0 - $10,000
- **Stok**: Sadece stokta olan ürünler
- **Puan**: 1-5 yıldız filtreleme

## 🤖 AI Öneri Sistemi

- **Akıllı Öneriler**: OpenAI GPT-3.5 Turbo ile ürün analizi
- **Metin Benzerliği**: Ürün açıklamalarına göre benzerlik hesaplama
- **Kategori Bazlı**: Aynı kategorideki ürünleri önerme
- **Fallback Sistemi**: API hatası durumunda basit öneriler
- **Gerçek Zamanlı**: Ürün detay sayfasında anında öneriler

## 🏗️ Proje Yapısı

```
src/app/
├── components/
│   ├── products/          # Ürün componentleri
│   ├── ui/               # UI componentleri
│   ├── CartSidebar.tsx   # Sepet yan paneli
│   └── Toast.tsx         # Bildirimler
├── context/
│   └── CartContext.tsx   # Sepet context'i
├── types/
│   └── Product.ts        # Tip tanımları
└── products/             # Ürün sayfaları
```

## 🔧 Geliştirme

```bash
# Test
npm test

# Linting
npm run lint

# Build
npm run build

# Production
npm start
```

## 👨‍💻 Geliştirici

**Mlk Bağrıyanık**
- GitHub: [@Mlkbagriyanik](https://github.com/Mlkbagriyanik)

## 📄 Lisans

MIT License

---

⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!
