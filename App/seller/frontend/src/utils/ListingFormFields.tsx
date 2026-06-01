import { Stack, TextField, Button} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useContext } from 'react';
import { ListingFormContext } from '../CreateListing/context';

export default function ListingFormFields() {
  const { t } = useTranslation();

  const {
    title,
    setTitle,
    description,
    setDescription,
    price,
    setPrice,
    stock,
    setStock,
    handleSubmit,
  } = useContext(ListingFormContext);

  return (
    <Stack spacing={2}>
      <TextField
        placeholder={t('Title')}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <TextField
        placeholder={t('Description')}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <TextField
        placeholder={t('Price')}
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <TextField
        placeholder={t('Stock')}
        type="number"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
      />
      <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={!title || !description || !price || !stock}
                >
                    {t('Save')}
                </Button>
    </Stack>
  );
}