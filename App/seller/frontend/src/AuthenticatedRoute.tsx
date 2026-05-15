import { JSX, useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Loading } from './Loading';

export default function AuthenticatedRoute(): JSX.Element | null {
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetch('/seller/api/v0/protected', { credentials: 'include' })
      .then(res => {
        if (!res.ok) throw new Error();
      })
      .catch(() => navigate('/login'))
      .finally(() => setChecking(false));
  }, [location.pathname, navigate]);

  if (checking) return <Loading />;
  return <Outlet />;
};
