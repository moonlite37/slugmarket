import {pool} from '../db';

interface CartItem {
	listing_id: string;
	name: string;
	price: number;
	quantity: number;
}

export class CartService {
	public async getCart(userId: string) {
		const result = await pool.query(
			'SELECT * FROM cart WHERE user_id = $1',
			[userId],
		);
		return result.rows[0] ?? null;
	}

	public async deleteItem(userId: string, listingId: string): Promise<void> {
		await pool.query(
			`UPDATE cart SET items = COALESCE(
				(SELECT jsonb_agg(el)
				FROM jsonb_array_elements(items) el
				WHERE el->>'listing_id' != $2),
				'[]'::jsonb
			) WHERE user_id = $1`,
			[userId, listingId],
		);
	}

	public async addItem(userId: string, item: CartItem): Promise<void> {
		await pool.query(
			`INSERT INTO cart (user_id, items)
			 VALUES ($1, $2::jsonb)
			 ON CONFLICT (user_id)
			 DO UPDATE SET items = (
				SELECT CASE
					WHEN EXISTS (
						SELECT 1 FROM jsonb_array_elements(cart.items) el
						WHERE el->>'listing_id' = $3
					)
					THEN (
						SELECT jsonb_agg(
							CASE WHEN el->>'listing_id' = $3
								THEN el || jsonb_build_object('quantity', (el->>'quantity')::int + $4)
								ELSE el
							END
						)
						FROM jsonb_array_elements(cart.items) el
					)
					ELSE cart.items || $2::jsonb
				END
			 )`,
			[userId, JSON.stringify([item]), item.listing_id, item.quantity],
		);
	}
}
