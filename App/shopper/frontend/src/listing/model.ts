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
  images: string[];
}



export async function getListing() {
  const query = 'http://localhost:3010/api/v0/listing';
  const res = await fetch(query, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.json();
}