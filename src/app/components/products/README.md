# Products Components

Bu klasör, products sayfası için oluşturulmuş modüler componentleri içerir.

## Component Yapısı

### Ana Componentler
- **ProductsNavigation** - Navigation bar (desktop ve mobile)
- **ProductsHeader** - Sayfa başlığı ve açıklaması
- **ProductsFilters** - Arama, sıralama ve filtreleme araçları
- **ProductsGrid** - Grid görünümünde ürün listesi
- **ProductsList** - List görünümünde ürün listesi
- **ProductsPagination** - Sayfalama kontrolleri

### Durum Componentleri
- **ProductsLoading** - Yükleme durumu
- **ProductsError** - Hata durumu
- **ProductsEmpty** - Boş durum

### Alt Componentler
- **ProductCard** - Tekil ürün kartı (grid görünümü için)
- **ProductListItem** - Tekil ürün satırı (list görünümü için)

### Yardımcı Componentler
- **ProductsFooter** - Sayfa altı
- **ProductsFiltersDrawer** - Mobile filtre drawer'ı

## Kullanım

```tsx
import {
  ProductsNavigation,
  ProductsHeader,
  ProductsFilters,
  ProductsGrid,
  ProductsList,
  ProductsPagination,
  ProductsLoading,
  ProductsError,
  ProductsEmpty,
  ProductsFooter,
  ProductsFiltersDrawer
} from '../components/products';
```

## Avantajlar

1. **Modülerlik**: Her component tek bir sorumluluğa sahip
2. **Yeniden Kullanılabilirlik**: Componentler başka sayfalarda da kullanılabilir
3. **Bakım Kolaylığı**: Küçük componentler daha kolay test edilir ve güncellenir
4. **Kod Okunabilirliği**: Ana sayfa dosyası çok daha temiz ve anlaşılır
5. **Performans**: Sadece değişen componentler re-render olur

## Önceki Durum vs Yeni Durum

- **Önceki**: 777 satırlık tek dosya
- **Yeni**: 13 ayrı component + ana sayfa (~200 satır)

Bu yapı sayesinde kod çok daha yönetilebilir ve sürdürülebilir hale geldi.
