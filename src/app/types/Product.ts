export interface Product {
  id: number | string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviewCount: number;
  description: string;
  inStock: boolean;
  isNew?: boolean;
  isPopular?: boolean;
}
