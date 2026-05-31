import { Box, Typography, Button, Stack } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface PaymentResultProps {
	color: string;
	heading: string;
	message: string;
	primaryLink: string;
	primaryLabel: string;
	secondaryLink: string;
	secondaryLabel: string;
}

export default function PaymentResult({
	color, heading, message, primaryLink, primaryLabel, secondaryLink, secondaryLabel,
}: PaymentResultProps) {
	const { t } = useTranslation();
	return (
		<Box sx={{ p: 4, textAlign: 'center', maxWidth: 600, mx: 'auto', mt: 8 }}>
			<Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color }}>
				{t(heading)}
			</Typography>
			<Typography color="text.secondary" sx={{ mb: 4 }}>
				{t(message)}
			</Typography>
			<Stack direction="row" spacing={2} sx={{ justifyContent: 'center' }}>
				<Button component={Link} to={primaryLink} variant="contained" sx={{ textTransform: 'none' }}>
					{t(primaryLabel)}
				</Button>
				<Button component={Link} to={secondaryLink} variant="outlined" sx={{ textTransform: 'none' }}>
					{t(secondaryLabel)}
				</Button>
			</Stack>
		</Box>
	);
}
