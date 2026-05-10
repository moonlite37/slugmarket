import { Grid } from '@mui/material';
import { getListing } from './model';
import ListingCard from './card';
import { useEffect, useState } from 'react';
import { Listing } from './model';

export default function ListingList() {
  const [listings, setListings] = useState<Listing[]>([]);
  useEffect(() => {
    async function load() {
      const data = await getListing();
      setListings(data);
    }
    load();
  }, [listings]);
  return (
    <>
      <Grid>
        {listings.map((l) => (
          <ListingCard key={l.id} listing={l} />
        ))}
      </Grid>
    </>
  );
}
