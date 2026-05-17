export type api_key = string

export interface Credentials {
  email: string,
  password: string
}

export interface Authenticated {
  name: string,
  authToken: string
}

export interface SessionUser {
  id: string
  role: string
}

declare module 'express-serve-static-core' {
  interface Request {
    user: SessionUser;
  }
}
export {};

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
