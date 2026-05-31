import EditIcon from '@mui/icons-material/Edit';
import { Card, CardContent, IconButton, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { Listing } from './model';

interface ListingCardProps {
	listing: Listing;
}

export default function ListingCard({ listing }: ListingCardProps) {
	const { t } = useTranslation();

	return (
		<Card variant="outlined">
			<CardContent>
				<Typography variant="h6">{t('Listing Title', { listingTitle: listing.title })}</Typography>
				<Typography color="text.secondary">{listing.description}</Typography>
				<Typography>
					${listing.price} · {t('{{stock}} in stock', { stock: listing.stock })}
				</Typography>
				<IconButton aria-label={`update ${listing.title}`}>
					<EditIcon />
				</IconButton>
			</CardContent>
		</Card>
	);
}
