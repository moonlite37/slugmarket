import {
	Card,
	CardMedia,
	CardContent,
	CardActions,
	Button,
	Typography,
	Box,
	Divider,
	Avatar,
} from "@mui/material";
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { Listing } from './model'
import { CartContext } from '../context/cartContext';

interface ListingCardProps {
	listing: Listing;
}


export default function ListingCard({ listing }: ListingCardProps) {
	// const [saved, setSaved] = useState(false);
	// const [cartAdded, setCartAdded] = useState(false);
	const { t } = useTranslation();
	const { addToCart } = useContext(CartContext);

	const {
		id,
		username,
		title,
		description,
		price,
		discountPrice,
		stock,
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
									{t('{{discount}}% off', { discount })}
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
							{inStock ? t('{{stock}} in stock', { stock }) : t('Out of stock')}
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
					onClick={() => addToCart({ listing_id: id, name: title, price: displayPrice, quantity: 1, seller: listing.author })}
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
					{t('Add to cart')}
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
					{username}
				</Avatar>
				<Typography sx={{ fontSize: 12, color: "text.secondary" }}>
					{t('Sold by')}{" "}
					<Box component="span" sx={{ color: "text.primary", fontWeight: 500 }}>
						{username}
					</Box>
				</Typography>
			</Box>
		</Card>
	);
}
