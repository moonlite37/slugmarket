import { FormControl, InputLabel, Select } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { supportedLngs } from './utils/i18n';

function LocaleSwitcher() {
  const { t, i18n } = useTranslation();

  return (
    <FormControl fullWidth size="small" sx={{ mt: 1 }}>
      <InputLabel htmlFor="locale-switcher">{t('Language')}</InputLabel>
      <Select
        native
        label={t('Language')}
        value={i18n.language}
        onChange={(e) => i18n.changeLanguage(e.target.value)}
        inputProps={{ id: 'locale-switcher' }}
      >
        {Object.entries(supportedLngs).map(([code, name]) => (
          <option key={code} value={code}>
            {name}
          </option>
        ))}
      </Select>
    </FormControl>
  );
}

export default LocaleSwitcher;
