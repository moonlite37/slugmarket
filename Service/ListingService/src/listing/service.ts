import { Listing, NewListing } from '.';
import {pool} from '../db';

export class ListingService {
	public async getListing(author?: string , minPrice?: number , maxPrice?: number): Promise<Listing[]> {
		console.log(author, minPrice, maxPrice);
		const q = `
			SELECT * FROM listing
			WHERE ($1::UUID IS NULL OR author = $1)
			AND ($2::INTEGER IS NULL OR (data->>'price')::DECIMAL >= $2)
			AND ($3::INTEGER IS NULL OR (data->>'price')::DECIMAL <= $3)
			ORDER BY data->>'created'
		`;
		const rows = (await pool.query(q, [author, minPrice, maxPrice])).rows;
		return rows.map(r => ({
			id: r.id,
			author: r.author,
			...r.data,
		}));
	}

	public async createListing(authorId: string, listing: NewListing): Promise<Listing> {
		const { rows } = await pool.query(
			`INSERT INTO listing(author, data)
			 VALUES ($1, jsonb_build_object(
			   'title', $2::text,
			   'description', $3::text,
			   'price', $4::numeric,
			   'stock', $5::int,
			   'categories', $6::jsonb,
			   'images', $7::jsonb,
			   'created', NOW()::text
			 ))
			 RETURNING id, author,
			   data->>'title' AS title,
			   data->>'description' AS description,
			   (data->>'price')::numeric AS price,
			   (data->>'stock')::int AS stock,
			   data->>'created' AS created`,
			[
				authorId,
				listing.title,
				listing.description,
				listing.price,
				listing.stock,
				JSON.stringify(listing.categories),
				JSON.stringify(listing.images || []),
			],
		);
		const r = rows[0];
		return {
			id: r.id,
			author: r.author,
			username: '',
			title: r.title,
			description: r.description,
			price: Number(r.price),
			stock: Number(r.stock),
			created: r.created,
			catagories: listing.categories,
			images: listing.images,
		};
	}

	public async deleteListing(id: string): Promise<boolean> {
		const { rowCount } = await pool.query(
			'DELETE FROM listing WHERE id = $1',
			[id],
		);
		return rowCount as number > 0;
	}
}
