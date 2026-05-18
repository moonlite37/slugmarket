import { useState } from 'react';
import { Button, Typography, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function CreateKey() {
  const { t } = useTranslation();
  const [apiKey, setApiKey] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const generateKey = async () => {
    setLoading(true);

    try {
      const res = await fetch('/seller/api/v0/corp/generate', {
        method: 'POST',
        credentials: 'include', 
      });

      if (!res.ok) {
        throw new Error('Failed to generate API key');
      }
      const key = await res.text();
      setApiKey(t('API Key: {{key}}', { key }));
    } catch {
      setApiKey(t('You are not authorized to generate an API key'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5">{t('API Keys')}</Typography>
      <Button
        variant="contained"
        onClick={generateKey}
        disabled={loading}
      >
        {loading ? t('Generating...') : t('Generate API Key')}
      </Button>

      {apiKey && (
        <Typography variant="body1">
            {apiKey}
        </Typography>
      )}
    </Box>
  );
}