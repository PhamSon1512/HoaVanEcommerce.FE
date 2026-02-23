export interface Category {
  id: number;
  name: string;
  slug: string;
  thumbnailUrl?: string;
}

export interface Product {
  id: number;
  name: string;
  code?: string;
  price: number;
  imageUrl: string;
  categoryId: number;
  categoryName: string;
}

export const MOCK_CATEGORIES: Category[] = [
  { id: 1, name: 'Hoa văn mới', slug: 'hoa-van-moi' },
  { id: 2, name: 'Hoa văn thời Lý - Trần', slug: 'hoa-van-ly-tran' },
  { id: 3, name: 'Hoa văn thời Lê', slug: 'hoa-van-le' },
  { id: 4, name: 'Hoa văn thời Nguyễn', slug: 'hoa-van-nguyen' }
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Hoa văn Phượng - 02',
    code: 'HV-PHUONG-02',
    price: 250000,
    imageUrl: 'assets/images/hoavanphuong02.jpg',
    categoryId: 1,
    categoryName: 'Hoa văn mới'
  },
  {
    id: 2,
    name: 'Hoa văn Phượng - 01',
    code: 'HV-PHUONG-01',
    price: 250000,
    imageUrl: 'assets/images/hoavanphuong01.jpg',
    categoryId: 1,
    categoryName: 'Hoa văn mới'
  },
  {
    id: 3,
    name: 'Hoa văn Rồng',
    code: 'HV-RONG-01',
    price: 250000,
    imageUrl: 'assets/images/hoavanRong.jpg',
    categoryId: 4,
    categoryName: 'Hoa văn thời Nguyễn'
  },
  {
    id: 4,
    name: 'Hoa văn Sư tử hí cầu',
    code: 'HV-SUTU-01',
    price: 100000,
    imageUrl: 'assets/images/hoavanSuTu.jpg',
    categoryId: 1,
    categoryName: 'Hoa văn mới'
  },
  {
    id: 5,
    name: 'Rồng ổ thời Lý - HVĐV---LYTRAN---021_ver_01',
    code: 'HVĐV---LYTRAN---021_ver_01',
    price: 50000,
    imageUrl: 'assets/images/RongOThoiLy.jpg',
    categoryId: 2,
    categoryName: 'Hoa văn thời Lý - Trần'
  },
  {
    id: 6,
    name: 'Gạch hoa thời Lý - Trần - HVĐV---LYTRAN---010_ver_01',
    code: 'HVĐV---LYTRAN---010_ver_01',
    price: 25000,
    imageUrl: 'assets/images/GachHoaThoiLy.jpg',
    categoryId: 2,
    categoryName: 'Hoa văn thời Lý - Trần'
  }
];

