export interface Listing {
  id: string
  author: string
  title: string
  description: string
  price: number
  stock: number
  username?: string
  categories?: string[]
  created: string
}