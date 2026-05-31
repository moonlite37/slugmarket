import { JSX, useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Loading } from './Loading';

export default function AuthenticatedRoute(): JSX.Element | null {
	const [path, setPath] = useState<string | null>(null);
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		fetch('/seller/api/v0/protected', { credentials: 'include' })
			.then((res) => {
				if (!res.ok) throw new Error();
				setPath(location.pathname);
			})
			.catch(() => navigate('/login'));
	}, [location.pathname, navigate]);

	if (path !== location.pathname) return <Loading />;
	return <Outlet />;
}
