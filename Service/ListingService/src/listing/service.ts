import { Listing, NewListing } from '.';
import { pool } from '../db';

export class ListingService {
	public async getListing(
		author?: string,
		minPrice?: number,
		maxPrice?: number,
	): Promise<Listing[]> {
		const q = `
		SELECT
		l.id,
		l.author,
		l.data,
		COALESCE(
			json_agg(DISTINCT c.data->>'name')
			FILTER (WHERE c.id IS NOT NULL),
			'[]'
		) AS categories
		FROM listing l
		LEFT JOIN listing_category lc
		ON l.id = lc.listing
		LEFT JOIN category c
		ON c.id = lc.category
		WHERE ($1::UUID IS NULL OR l.author = $1)
		AND ($2::DECIMAL IS NULL OR (l.data->>'price')::DECIMAL >= $2)
		AND ($3::DECIMAL IS NULL OR (l.data->>'price')::DECIMAL <= $3)
		GROUP BY l.id
		ORDER BY (l.data->>'created')::timestamp DESC;
	`;
		const rows = (await pool.query(q, [author, minPrice, maxPrice])).rows;
		return rows.map((r) => ({
			id: r.id,
			author: r.author,
			categories: r.categories,
			...r.data,
		}));
	}

	public async createListing(
		authorId: string,
		listing: NewListing,
	): Promise<Listing> {
		const { rows } = await pool.query(
			`WITH new_listing AS (
				INSERT INTO listing(author, data)
				VALUES ($1, jsonb_build_object(
				'title', $2::text,
				'description', $3::text,
				'price', $4::numeric,
				'stock', $5::int,
				'images', $6::jsonb,
				'created', NOW()::text
				))
				RETURNING id, author,
				data->>'title' AS title,
				data->>'description' AS description,
				(data->>'price')::numeric AS price,
				(data->>'stock')::int AS stock,
				data->>'created' AS created
			),
			inserted_categories AS (
			INSERT INTO listing_category (listing, category)
			SELECT
				nl.id,
				unnest($7::uuid[])
			FROM new_listing nl
			)
			SELECT *
			FROM new_listing;
			`,
			[
				authorId,
				listing.title,
				listing.description,
				listing.price,
				listing.stock,
				JSON.stringify(listing.images || []),
				listing.categories,
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
		const { rowCount } = await pool.query('DELETE FROM listing WHERE id = $1', [
			id,
		]);
		return (rowCount as number) > 0;
	}

	public async updateListing(
		id: string,
		updates: {
      title?: string;
      description?: string;
      price?: number;
      stock?: number;
      categories?: string[];
      images?: string[];
    },
	): Promise<Listing | null> {
		const patch: Record<string, unknown> = {};
		if (updates.title !== undefined) patch.title = updates.title;
		if (updates.description !== undefined)
			patch.description = updates.description;
		if (updates.price !== undefined) patch.price = updates.price;
		if (updates.stock !== undefined) patch.stock = updates.stock;
		if (updates.categories !== undefined) patch.categories = updates.categories;
		if (updates.images !== undefined) patch.images = updates.images;

		const { rows, rowCount } = await pool.query(
			`UPDATE listing SET data = data || $2::jsonb
			 WHERE id = $1
			 RETURNING id, author, data`,
			[id, JSON.stringify(patch)],
		);
		if (!rowCount) return null;
		const r = rows[0];
		return {
			id: r.id,
			author: r.author,
			...r.data,
		};
	}
}
