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
  catagories: string[];
  
  images?: string[];
}

export interface NewListing {
  title: string
  description: string
  price: number
  stock: number
  categories: string[]
  images?: string[]
}