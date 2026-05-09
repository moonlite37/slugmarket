import {expect, it, describe} from "vitest"
import ListingCard from "../card";
import {render, screen} from '@testing-library/react'


const listing = {
  id: "00000000-0000-0000-0000-000000000002", // gen_random_uuid()
  author: "00000000-0000-0000-0000-000000000001",
  username: "John Pork",
  title: "Pork Chops",
  description: "100% authentic pork chops made from pork",
  created: new Date().toISOString(),
  price: 19.99,
  stock: 42,
  catagories: ["food", "pork"],
  images: ["img1.jpg", "img2.jpg"],
};

const discountedListing = {
    ...listing,
    discountPrice: 14.99,
}

const outOfStock = {
    ...listing,
    stock: 0
}

describe('basic functionality', () => {
    it('Shows listing title', async () => {
        render(<ListingCard listing={listing}/>);
        expect(await screen.findByText('Pork Chops')).toBeDefined();
    })
    it('Shows listing author', async () => {
        render(<ListingCard listing={listing}/>);
        expect(await screen.findByText('John Pork')).toBeDefined();
    })
    it('Has a button to add to cart', async () => {
        render(<ListingCard listing={listing}/>);
        expect(await screen.findByText('Add to cart')).toBeDefined();
    })
    it('Shows default price', async () => {
        render(<ListingCard listing={listing}/>);
        expect(await screen.findByText('$19.99')).toBeDefined();
    })
    it('Shows sale price', async () => {
        render(<ListingCard listing={discountedListing}/>);
        expect(await screen.findByText('$14.99')).toBeDefined();
    })
    it('Shows out of stock', async () => {
        render(<ListingCard listing={outOfStock}/>);
        expect(await screen.findByText('Out of stock')).toBeDefined();
    })
})

