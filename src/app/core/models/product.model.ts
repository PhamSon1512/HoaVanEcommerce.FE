export interface ProductListItem {
  id: number;
  categoryId: number;
  categoryName: string;
  name: string;
  code?: string | null;
  price: number;
  imageUrl: string;
  isActive: boolean;
}

export interface ProductDetail extends ProductListItem {
  description?: string | null;
  stockQuantity: number;
  createdAt: string;
}

export type Product = ProductListItem;

