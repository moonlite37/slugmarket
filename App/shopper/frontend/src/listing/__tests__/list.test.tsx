import { it, expect, beforeEach, beforeAll, afterEach, afterAll} from "vitest";
import {setupServer} from 'msw/node';
import {http, HttpResponse} from 'msw';
import { listing, listing2 } from "./setup";
import { screen, render } from "@testing-library/react";
import ListingList from "../list";

const URL = 'http://localhost:3010/api/v0';

export const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

beforeEach(() => {
    server.use(
        http.get(URL + '/listing', async ({request}) => {
          return HttpResponse.json([listing, listing2]);
        }),
    );
});



it('Displays first card', async () => {
    render(<ListingList></ListingList>)
    expect(await screen.findByText('Pork Chops')).toBeDefined();
})

it('Displays second card', async () => {
    render(<ListingList></ListingList>)
    expect(await screen.findByText('Iphone 7')).toBeDefined();
})

