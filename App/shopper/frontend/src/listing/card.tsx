import {
	Card,
	CardMedia,
	CardContent,
	CardActions,
	Button,
	Chip,
	Typography,
	Box,
	Divider,
	Avatar,
} from "@mui/material";
import { useContext } from 'react';

import { Listing } from './model'
import { CartContext } from '../context/cartContext';

interface ListingCardProps {
	listing: Listing;
}


export default function ListingCard({ listing }: ListingCardProps) {
	// const [saved, setSaved] = useState(false);
	// const [cartAdded, setCartAdded] = useState(false);
	const { addToCart } = useContext(CartContext);

	const {
		id,
		username,
		title,
		description,
		price,
		discountPrice,
		stock,
		categories,
		images,
	} = listing;

	const displayPrice = discountPrice ?? price;
	const hasDiscount = discountPrice !== undefined && discountPrice < price;
	const discount = hasDiscount
		? Math.round(((price - discountPrice!) / price) * 100)
		: 0;
	const inStock = stock > 0;
	const image = images[0];

	return (
		<Card
			elevation={0}
			sx={{
				width: 360,
				borderRadius: 3,
				border: "1px solid",
				borderColor: "grey.200",
				bgcolor: "background.paper",
				transition: "transform 0.2s ease",
				"&:hover": { transform: "translateY(-2px)" },
			}}
		>
			{/* Image */}
			<Box sx={{ position: "relative" }}>
				<CardMedia
					component="img"
					height={240}
					image={image}
					alt={title}
					sx={{ borderRadius: "12px 12px 0 0", objectFit: "cover" }}
				/>

				{ /*
        <IconButton
          onClick={() => setSaved((s) => !s)}
          size="small"
          aria-label={saved ? "Remove from saved" : "Save listing"}
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "grey.200",
            width: 32,
            height: 32,
            "&:hover": { bgcolor: "grey.50" },
          }}
        >
          {saved ? (
            <FavoriteIcon sx={{ fontSize: 16, color: "error.main" }} />
          ) : (
            <FavoriteBorderIcon sx={{ fontSize: 16, color: "text.secondary" }} />
          )}
        </IconButton>
        */}
			</Box>

			{/* Content */}
			<CardContent sx={{ px: 2.5, pt: 2, pb: 1 }}>
				{/* Title */}
				<Typography
					variant="h6"
					sx={{ fontSize: 18, fontWeight: 600, mt: 0.5, mb: 0.5, lineHeight: 1.3 }}
				>
					{title}
				</Typography>

				{/* Description */}
				<Typography
					sx={{
						fontSize: 13,
						color: "text.secondary",
						lineHeight: 1.6,
						mb: 1.5,
						display: "-webkit-box",
						WebkitLineClamp: 2,
						WebkitBoxOrient: "vertical",
						overflow: "hidden",
					}}
				>
					{description}
				</Typography>

				{/* Categories */}
				{categories?.length > 0 && (
					<Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
						{categories.map((cat: string) => (
							<Chip
								key={cat}
								label={cat}
								size="small"
								variant="outlined"
								sx={{
									fontSize: 11,
									height: 22,
									borderRadius: 1.5,
									"& .MuiChip-label": { px: 1 },
								}}
							/>
						))}
					</Box>
				)}
				{/* Categories */}
				{categories.length > 0 && (
					<Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
						{categories.map((cat: string) => (
							<Chip
								key={cat}
								label={cat}
								size="small"
								variant="outlined"
								sx={{
									fontSize: 11,
									height: 22,
									borderRadius: 1.5,
									"& .MuiChip-label": { px: 1 },
								}}
							/>
						))}
					</Box>
				)}

				<Divider sx={{ mb: 2 }} />

				{/* Price + stock */}
				<Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
					<Box>
						<Typography sx={{ fontSize: 22, fontWeight: 700, lineHeight: 1 }}>
							${displayPrice.toLocaleString()}
						</Typography>
						{hasDiscount && (
							<Typography sx={{ fontSize: 12, color: "text.secondary", mt: 0.3 }}>
								<Box component="span" sx={{ textDecoration: "line-through", mr: 0.5 }}>
									${price.toLocaleString()}
								</Box>
								<Box component="span" sx={{ color: "success.main" }}>
									{discount}% off
								</Box>
							</Typography>
						)}
					</Box>

					<Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
						<Typography
							sx={{
								fontSize: 12,
								fontWeight: 500,
								color: inStock ? "success.main" : "error.main",
							}}
						>
							{inStock ? `${stock} in stock` : "Out of stock"}
						</Typography>
					</Box>
				</Box>
			</CardContent>

			{/* Actions */}
			<CardActions sx={{ px: 2.5, pb: 2.5, pt: 1, gap: 1.5 }}>
				<Button
					variant="contained"
					fullWidth
					size="medium"
					aria-label={`add ${title} to cart`}
					disabled={!inStock}
					onClick={() => addToCart({ id, name: title, price: displayPrice })}
					disableElevation
					sx={{
						borderRadius: 2,
						fontSize: 13,
						fontWeight: 500,
						textTransform: "none",
						bgcolor: "primary.main",
						"&:hover": { bgcolor: "primary.dark" },
						transition: "background-color 0.3s ease",
					}}
				>
					{"Add to cart"}
				</Button>
			</CardActions>

			{/* Author */}
			<Box sx={{ px: 2.5, pb: 2.5, display: "flex", alignItems: "center", gap: 1 }}>
				<Avatar
					sx={{
						width: 22,
						height: 22,
						fontSize: 10,
						fontWeight: 600,
						bgcolor: "primary.light",
						color: "primary.dark",
					}}
				>
					{username[0]}
				</Avatar>
				<Typography sx={{ fontSize: 12, color: "text.secondary" }}>
					Listed by{" "}
					<Box component="span" sx={{ color: "text.primary", fontWeight: 500 }}>
						{username}
					</Box>
				</Typography>
			</Box>
		</Card>
	);
}
