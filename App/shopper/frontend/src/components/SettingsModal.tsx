import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
// import { useNavigate } from 'react-router-dom';

import LocaleSwitcher from '../LocaleSwitcher';
import { CartContext } from '../context/cartContext';

interface SettingsModalProps {
	open: boolean;
	onClose: () => void;
}

export default function SettingsModal({ open, onClose }: SettingsModalProps) {
	const { t } = useTranslation();
	const { loggedIn } = useContext(CartContext);

	const handleLogout = async () => {
		await fetch('/shopper/api/v0/logout', { method: 'DELETE', credentials: 'include' });
		onClose();
	};

	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
			<DialogTitle>{t('Settings')}</DialogTitle>
			<DialogContent>
				<LocaleSwitcher />
			</DialogContent>
			{loggedIn && (
				<DialogActions>
					<Button color="error" onClick={handleLogout}>
						{t('Log out')}
					</Button>
				</DialogActions>
			)}
		</Dialog>
	);
}
