import { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function SignupBanner() {
	const { t } = useTranslation();
	const [loggedIn, setLoggedIn] = useState(true);

	useEffect(() => {
		fetch('/shopper/api/v0/protected', { credentials: 'include' })
			.then((res) => {
				if (!res.ok) setLoggedIn(false);
			})
			.catch(() => setLoggedIn(false));
	}, []);

	if (loggedIn) return null;

	return (
		<Box sx={{
			display: 'flex', alignItems: 'center', justifyContent: 'center',
			gap: 2, p: 1.5, bgcolor: 'primary.main', color: 'white',
		}}>
			<Typography sx={{ fontSize: 14 }}>
				{t('Sign in to save your cart and place orders')}
			</Typography>
			<Button
				component={Link}
				to="/login"
				variant="outlined"
				size="small"
				sx={{ color: 'white', borderColor: 'white', textTransform: 'none' }}
			>
				{t('Sign In')}
			</Button>
		</Box>
	);
}
