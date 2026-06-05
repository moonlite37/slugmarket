import { JSX, useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import { Loading } from './Loading';

export default function AuthenticatedRoute(): JSX.Element | null {
	const [path, setPath] = useState<string | null>(null);
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		fetch('/shopper/api/v0/protected', { credentials: 'include' })
			.then((res) => {
				if (!res.ok) throw new Error();
				setPath(location.pathname);
			})
			.catch(() => navigate('/login'));
	}, [location.pathname, navigate]);

	const handleLogout = async () => {
		await fetch('/shopper/api/v0/logout', { method: 'DELETE', credentials: 'include' });
		navigate('/login');
	};

	if (path !== location.pathname) return <Loading />;

	return (
		<>
			<Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
				<Button size="small" color="error" onClick={handleLogout}>
					Log out
				</Button>
			</Box>
			<Outlet />
		</>
	);
}
