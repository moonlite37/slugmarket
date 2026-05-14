import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';

export const supportedLngs = {
	en: "English",
	es: "Spanish",
}

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    lng: 'en',
    fallbackLng: 'en',
		supportedLngs: Object.keys(supportedLngs),
    backend: {
      loadPath: '/seller/locales/{{lng}}/{{ns}}.json',
    },
    interpolation: { escapeValue: false },
  });

export default i18n;
