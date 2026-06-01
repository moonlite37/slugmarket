export interface Listing {
  id: string;
  author: string;
  
  username: string;
  title: string;
  description: string;
  created: string;
  price: number;
  discountPrice?: number;
  stock: number;
  categories: string[];
  
  images?: string[];
}