import { describe, expect, it } from 'vitest';
import { render, screen } from "@testing-library/react";
import FilterSidebar from '../sidebar';
import { useState } from "react";
import { FilterContext } from "@/context/FilterContext";
import userEvent from '@testing-library/user-event';

function Wrapper() {
	const [minPrice, setMinPrice] = useState<number | undefined>(
		undefined,
	);
	const [maxPrice, setMaxPrice] = useState<number | undefined>(
		undefined,
	);
	return (
		<FilterContext.Provider
			value={{
				minPrice,
				setMinPrice,
				maxPrice,
				setMaxPrice,
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
