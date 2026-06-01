import SaveIcon from '@mui/icons-material/Save';
import { IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function UpdateListing() {
	const navigate = useNavigate();

	return (
		<IconButton
			aria-label="save edits"
			onClick={() => {
				navigate('/');
			}}
		>
			<SaveIcon />
		</IconButton>
	);
}
