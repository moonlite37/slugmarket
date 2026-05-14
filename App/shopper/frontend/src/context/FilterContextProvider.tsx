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

	return (
		<FilterContext.Provider
			value={{
				minPrice,
				setMinPrice,
				maxPrice,
				setMaxPrice,
			}}
		>
			{children}
		</FilterContext.Provider>
	);
}