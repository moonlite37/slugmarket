import { describe, expect, it } from 'vitest';
import { render, screen } from "@testing-library/react";
import FilterSidebar from '@/filter/sidebar';
import { useState } from "react";
import { FilterContext } from "@/context/FilterContext";
import userEvent from '@testing-library/user-event';

let category = ''
function setCategory (value:string) {
    category = value
}

let sort = ''
function setSort (value:string) {
    sort = value
}


function Wrapper() {
	const [minPrice, setMinPrice] = useState<number | undefined>(
		undefined,
	);
	const [maxPrice, setMaxPrice] = useState<number | undefined>(
		undefined,
	);
    const [search, setSearch] = useState<string>(
		'',
	);
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
                setCategory
			}}
		>
			<FilterSidebar />
		</FilterContext.Provider>
	);

}

describe('min/max filter tests', () => {
    it('has a field for min price', async () => {
        render(<FilterSidebar />);
        expect(await screen.findByPlaceholderText('Min')).toBeDefined()
    });
    it('has a field for max price', async () => {
        render(<FilterSidebar />);
        expect(await screen.findByPlaceholderText('Max')).toBeDefined()
    });

    it('can type in min and max field', async () => {
        const user = userEvent.setup();
        render(<Wrapper />);
        const minInput = screen.getByPlaceholderText("Min");
        const maxInput = screen.getByPlaceholderText("Max");
        await user.type(minInput, "10");
        await user.type(maxInput, "50");
        await user.tab();
        expect(minInput).toHaveValue(10);
        expect(maxInput).toHaveValue(50);
    });

    it('can undo min and max field', async () => {
        const user = userEvent.setup();
        render(<Wrapper />);
        const minInput = screen.getByPlaceholderText("Min");
        const maxInput = screen.getByPlaceholderText("Max");
        await user.type(minInput, "15");
        await user.type(maxInput, "30");
        await user.clear(minInput);
        await user.clear(maxInput);
        expect(minInput).toHaveValue(null);
        expect(maxInput).toHaveValue(null);
    });


    it('swaps if range is nonsensical', async () => {
        const user = userEvent.setup();
        render(<Wrapper />);
        const minInput = screen.getByPlaceholderText("Min");
        const maxInput = screen.getByPlaceholderText("Max");
        await user.type(minInput, "50");
        await user.type(maxInput, "10");
        await user.tab();
        expect(minInput).toHaveValue(10);
        expect(maxInput).toHaveValue(50);
    });
});

describe('Category Tests', () => {
    it('Displays categories', async () => {
        render(<Wrapper />);
        expect(await screen.findByText('dummy category')).toBeDefined()
    });
    it('Clicking category changes category context', async () => {
        render(<Wrapper />);
        const cat = await screen.findByText('dummy category');
        await userEvent.click(cat);
        expect(category).toBe('dummy id')
    });
    it('deselects category when already selected', async () => {
        category = 'dummy id';
        render(<Wrapper />);
        const cat = await screen.findByText('dummy category');
        await userEvent.click(cat);
        expect(category).toBe('');
    });
    it('highlights selected category', async () => {
        category = 'dummy id';
        render(<Wrapper />);
        const cat = await screen.findByText('dummy category');
        const btn = cat.closest('button');
        expect(btn?.className).toContain('contained');
    });
});

describe('Sort Tests', () => {
    it('Displays Sort', async () => {
        render(<Wrapper />);
        expect(await screen.findByLabelText('Sort by')).toBeDefined()
    });
    it('Can change sort by parameter', async () => {
        render(<Wrapper />);
        const s = await screen.findByLabelText('Sort by');
        await userEvent.click(s);
        const sortBy = await screen.findByText('Oldest first');
        await userEvent.click(sortBy);
        expect(sort).toBe('date_asc')
    });
});

describe('Search Tests', () => {
    it('Displays Search', async () => {
        render(<Wrapper />);
        expect(await screen.findByLabelText('Search')).toBeDefined()
    });
    it('Can change search by parameter', async () => {
        render(<Wrapper />);
        const s = await screen.findByLabelText('Search');
        await userEvent.type(s, 'testing');
        expect(s).toHaveValue('testing')
    });
});
