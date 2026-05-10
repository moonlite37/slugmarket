import {expect, it, describe} from "vitest"
import ListingCard from "../card";
import {render, screen} from '@testing-library/react'
import { listing } from "./setup";

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

