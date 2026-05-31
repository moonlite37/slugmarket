import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
	Box,
	Typography,
	Button,
	Card,
	CardMedia,
	Chip,
	Stack,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Listing, getListingById } from '../listing/model';
import { CartContext } from '../context/cartContext';

export default function ListingDetail() {
	const { t } = useTranslation();
	const { id } = useParams<{ id: string }>();
	const { addToCart } = useContext(CartContext);
	const [listing, setListing] = useState<Listing | null>(null);
	const [notFound, setNotFound] = useState(false);

	useEffect(() => {
		const fetchListing = async () => {
			if (!id) return;
			const data = await getListingById(id);
			if (data) {
				setListing(data);
			} else {
				setNotFound(true);
			}
		};
		void fetchListing();
	}, [id]);

	if (notFound) {
		return (
			<Box sx={{ p: 4, textAlign: 'center' }}>
				<Typography variant="h5" sx={{ mb: 2 }}>{t('Listing not found')}</Typography>
				<Button component={Link} to="/" variant="outlined">
					{t('Back to Shop')}
				</Button>
			</Box>
		);
	}

	if (!listing) {
		return (
			<Box sx={{ p: 4, textAlign: 'center' }}>
				<Typography>{t('Loading...')}</Typography>
			</Box>
		);
	}

	const displayPrice = listing.discountPrice ?? listing.price;
	const hasDiscount = listing.discountPrice !== undefined && listing.discountPrice < listing.price;
	const inStock = listing.stock > 0;

	return (
		<Box sx={{ p: 3, maxWidth: 900, mx: 'auto' }}>
			<Button component={Link} to="/" variant="text" sx={{ mb: 2 }}>
				{t('Back to Shop')}
			</Button>
			<Card elevation={0} sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, p: 3 }}>
				{listing.images[0] && (
					<CardMedia
						component="img"
						image={listing.images[0]}
						alt={listing.title}
						sx={{ width: { xs: '100%', md: 400 }, height: 350, objectFit: 'cover', borderRadius: 2 }}
					/>
				)}
				<Box sx={{ flex: 1 }}>
					<Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
						{listing.title}
					</Typography>
					<Typography color="text.secondary" sx={{ mb: 2 }}>
						{t('Sold by')} {listing.username}
					</Typography>
					<Typography sx={{ mb: 3, lineHeight: 1.8 }}>
						{listing.description}
					</Typography>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
						<Typography variant="h4" sx={{ fontWeight: 700 }}>
							${displayPrice.toFixed(2)}
						</Typography>
						{hasDiscount && (
							<Typography sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
								${listing.price.toFixed(2)}
							</Typography>
						)}
					</Box>
					<Typography sx={{ color: inStock ? 'success.main' : 'error.main', mb: 2 }}>
						{inStock ? t('{{stock}} in stock', { stock: listing.stock }) : t('Out of stock')}
					</Typography>
					{listing.categories.length > 0 && (
						<Stack direction="row" spacing={1} sx={{ mb: 3 }}>
							{listing.categories.map((cat) => (
								<Chip key={cat} label={cat} size="small" />
							))}
						</Stack>
					)}
					<Button
						variant="contained"
						size="large"
						disabled={!inStock}
						aria-label={`add ${listing.title} to cart`}
						onClick={() => addToCart({
							listing_id: listing.id,
							name: listing.title,
							price: displayPrice,
							quantity: 1,
							seller: listing.author,
						})}
						sx={{ borderRadius: 2, textTransform: 'none', px: 4 }}
					>
						{t('Add to cart')}
					</Button>
				</Box>
			</Card>
		</Box>
	);
}
