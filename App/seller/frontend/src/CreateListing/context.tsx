import { createContext, } from 'react';

interface ListingFormContextType {
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  price: string;
  setPrice: (value: string) => void;
  stock: string;
  setStock: (value: string) => void;
  handleSubmit: () => void;
}

export const ListingFormContext = createContext<ListingFormContextType>({
  title: '',
  setTitle: () => {},
  description: '',
  setDescription: () => {},
  price: '',
  setPrice: () => {},
  stock: '',
  setStock: () => {},
  handleSubmit: () => {}
});
