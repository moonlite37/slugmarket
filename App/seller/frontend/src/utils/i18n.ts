import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

export const supportedLngs = {
	en: "English",
	es: "Spanish",
}

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
		supportedLngs: Object.keys(supportedLngs),
    detection: {
      order: ['localStorage'],
      caches: ['localStorage'],
    },
    backend: {
      loadPath: '/seller/locales/{{lng}}/{{ns}}.json',
    },
    interpolation: { escapeValue: false },
  });

export default i18n;
