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
  /* v8 ignore next */
  setTitle: () => {},
  description: '',
  /* v8 ignore next */
  setDescription: () => {},
  price: '',
  /* v8 ignore next */
  setPrice: () => {},
  stock: '',
  /* v8 ignore next */
  setStock: () => {},
  /* v8 ignore next */
  handleSubmit: () => {}
});
