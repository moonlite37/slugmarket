import { useContext } from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";

import { FilterContext } from "@/context/FilterContext";

export default function FilterSidebar() {
	const { minPrice, setMinPrice, maxPrice, setMaxPrice } =
		useContext(FilterContext);

	const validate = (newMin?: number, newMax?: number) => {
		if (
			newMin !== undefined &&
			newMax !== undefined &&
			newMin > newMax
		) {
			// swap values if min > max
			setMinPrice(newMax);
			setMaxPrice(newMin);
		}
	};

	return (
		<Box
			sx={{
				p: 3,
				display: "flex",
				flexDirection: "column",
				height: "100%",
			}}
		>
			<Typography variant="h6" gutterBottom>
				Filters
			</Typography>

			<Divider sx={{ mb: 3 }} />

			<Typography
				variant="subtitle2"
				color="text.secondary"
				gutterBottom
			>
				Price
			</Typography>

			<Box
				sx={{
					display: "flex",
					gap: 1.5,
					alignItems: "flex-start",
					mt: 1,
				}}
			>
				<TextField
					placeholder="Min"
					type="number"
					size="small"
					value={minPrice ?? ""}
					onChange={(e) => {
						const value =
							e.target.value === ""
								? undefined
								: Number(e.target.value);
						setMinPrice(value);
					}}
					onBlur={() => validate(minPrice, maxPrice)}
				/>

				<Typography sx={{ mt: 1.2, color: "text.disabled" }}>
					—
				</Typography>

				<TextField
					placeholder="Max"
					type="number"
					size="small"
					value={maxPrice ?? ""}
					onChange={(e) => {
						const value =
							e.target.value === ""
								? undefined
								: Number(e.target.value);

						setMaxPrice(value);
					}}
					onBlur={() => validate(minPrice, maxPrice)}
				/>
			</Box>
		</Box>
	);
}