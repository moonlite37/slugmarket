import { createContext } from 'react';
export interface FilterContextValue {
	minPrice: number | undefined
	setMinPrice: (val: number | undefined) => void
	maxPrice: number | undefined
	setMaxPrice: (val: number | undefined) => void
	search: string
	setSearch: (val: string) => void
	sort: string
	setSort: (val: string) => void
}
export const FilterContext = createContext<FilterContextValue>({
	minPrice: undefined,
	/* v8 ignore next */
	setMinPrice: () => {},
	maxPrice: undefined,
	/* v8 ignore next */
	setMaxPrice: () => {},
	search: '',
	/* v8 ignore next */
	setSearch: () => {},
	sort: '',
	/* v8 ignore next */
	setSort: () => {},
});
