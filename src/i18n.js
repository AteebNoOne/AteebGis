import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import language files
import translationEN from './locales/en/translation.json';
import translationES from './locales/ro/translation.json';

// Configure i18next
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: translationEN,
      },
      es: {
        translation: translationES,
      },
    },
    lng: 'en', // Set the default language
    fallbackLng: 'en', // Fallback language if translation is missing
    interpolation: {
      escapeValue: false, // React already escapes the content, so no need for extra escaping
    },
  });

export default i18n;
