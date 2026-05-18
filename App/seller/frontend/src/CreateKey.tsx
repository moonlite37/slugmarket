import { useState } from 'react';
import { Button, Typography, Box } from '@mui/material';

export default function CreateKey() {
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
      setApiKey("API Key: " + key);
    } catch {
      setApiKey('You are not authorized to generate an API key');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5">{('API Keys')}</Typography>
      <Button
        variant="contained"
        onClick={generateKey}
        disabled={loading}
      >
        {loading ? 'Generating...' : 'Generate API Key'}
      </Button>

      {apiKey && (
        <Typography variant="body1">
            {apiKey}
        </Typography>
      )}
    </Box>
  );
}