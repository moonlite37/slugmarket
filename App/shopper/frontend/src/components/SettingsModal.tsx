import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { useTranslation } from 'react-i18next';

import LocaleSwitcher from '../LocaleSwitcher';

interface SettingsModalProps {
	open: boolean;
	onClose: () => void;
}

export default function SettingsModal({ open, onClose }: SettingsModalProps) {
	const { t } = useTranslation();

	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
			<DialogTitle>{t('Settings')}</DialogTitle>
			<DialogContent>
				<LocaleSwitcher />
			</DialogContent>
		</Dialog>
	);
}
