import { useEffect } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import i18n from './utils/i18n';

function LocaleLayout() {
  const { lang } = useParams();
  useEffect(() => {
    i18n.changeLanguage(lang === 'es' ? 'es' : 'en');
  }, [lang]);
  return <Outlet />;
}

export default LocaleLayout;
