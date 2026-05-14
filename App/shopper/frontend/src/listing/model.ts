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
  images: string[];
}



export async function getListing() {
  const query = '/shopper/api/v0/listing';
  const res = await fetch(query, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.json();
}