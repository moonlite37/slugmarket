import { createContext } from 'react';

export interface FilterContextValue {
    minPrice: number | undefined
    setMinPrice: (val: number | undefined) => void
    maxPrice: number | undefined
    setMaxPrice: (val: number | undefined) => void
}

export const FilterContext = createContext<FilterContextValue>({
    minPrice: undefined,
    /* v8 ignore next */
    setMinPrice: () => {},
    maxPrice: undefined,
    /* v8 ignore next */
    setMaxPrice: () => {},
});
