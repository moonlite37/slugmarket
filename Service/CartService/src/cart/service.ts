import {pool} from '../db';

interface CartItem {
	listing_id: string;
	name: string;
	price: number;
	quantity: number;
	imageUrl: string;
}

export class CartService {
	public async getCart(sessionId?: string, userId?: string) {
		const result = await pool.query(
			'SELECT * FROM cart WHERE ($1::uuid IS NOT NULL AND user_id = $1) OR session_id = $2 LIMIT 1',
			[userId ?? null, sessionId],
		);
		return result.rows[0] ?? null;
	}

	public async addItem(sessionId: string, userId: string | undefined, item: CartItem): Promise<void> {
		await pool.query(
			`INSERT INTO cart (session_id, user_id, items)
			 VALUES ($1, $2, $3::jsonb)
			 ON CONFLICT (session_id)
			 DO UPDATE SET
			 	user_id = COALESCE($2, cart.user_id),
			 	items = (
					SELECT CASE
						WHEN EXISTS (
							SELECT 1 FROM jsonb_array_elements(cart.items) el
							WHERE el->>'listing_id' = $4
						)
						THEN (
							SELECT jsonb_agg(
								CASE WHEN el->>'listing_id' = $4
									THEN el || jsonb_build_object('quantity', (el->>'quantity')::int + $5)
									ELSE el
								END
							)
							FROM jsonb_array_elements(cart.items) el
						)
						ELSE cart.items || $3::jsonb
					END
				)`,
			[sessionId, userId ?? null, JSON.stringify([item]), item.listing_id, item.quantity],
		);
	}
}
