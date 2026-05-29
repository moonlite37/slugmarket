import { type ReactNode, useState } from 'react';
import { FilterContext } from './FilterContext';
interface FilterContextProviderProps {
	children: ReactNode;
}
export function FilterContextProvider({
	children,
}: FilterContextProviderProps) {
	const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
	const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
	const [search, setSearch] = useState<string>('');
	const [sort, setSort] = useState<string>('');
	const [category, setCategory] = useState<string>('');
	return (
		<FilterContext.Provider
			value={{
				minPrice,
				setMinPrice,
				maxPrice,
				setMaxPrice,
				search,
				setSearch,
				sort,
				setSort,
				category,
				setCategory,
			}}
		>
			{children}
		</FilterContext.Provider>
	);
}
