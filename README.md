# 🛍️ MelikShop - E-Commerce Platform

Modern e-ticaret platformu. Next.js 15, TypeScript ve Tailwind CSS ile geliştirilmiştir.

## 🚀 Özellikler

- **Ürün Yönetimi**: Liste, filtreleme, arama, sıralama
- **Responsive Tasarım**: Mobil ve desktop uyumlu
- **Sepet Sistemi**: Ürün ekleme/çıkarma, toplam hesaplama
- **Kullanıcı Yönetimi**: Kayıt, giriş, profil

## 🛠️ Teknolojiler

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, Lucide React
- **Backend**: Node.js, Express.js, MongoDB, JWT

## 🚀 Kurulum

```bash
# Projeyi klonlayın
git clone <repository-url>
cd ecommerce-studycase

# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev
```

Tarayıcıda `http://localhost:3000` adresini açın.

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

**Melik Bağrıyanık**
- GitHub: [@melikbagriyanik](https://github.com/melikbagriyanik)

## 📄 Lisans

MIT License

---

⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!
