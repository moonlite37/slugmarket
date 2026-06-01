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

export interface NewListing {
  title: string
  description: string
  price: number
  stock: number
  categories: string[]
  images?: string[]
}

export interface CreateListingBody extends NewListing {
  authorId: string
  username?: string
}
export interface UpdateListingBody {
  title?: string
  description?: string
  price?: number
  stock?: number
  categories?: string[]
  images?: string[]
}
