import { pool } from '../db';
import { Order, CreateOrderInput } from './schema';

export class OrderService {
	public async createOrder(input: CreateOrderInput): Promise<Order> {
		const { rows } = await pool.query(
			`INSERT INTO "order" (shopper, seller, data)
       VALUES ($1, $2, jsonb_build_object(
         'items', $3::jsonb,
         'total', $4::numeric,
         'status', 'pending',
         'created', NOW()::text
       ))
       RETURNING id, shopper, seller, data`,
			[
				input.shopper,
				input.seller,
				JSON.stringify(input.items),
				input.total,
			],
		);
		const r = rows[0];
		return {
			id: r.id,
			shopper: r.shopper,
			seller: r.seller,
			...r.data,
		};
	}

	public async ordersByShopper(shopperId: string): Promise<Order[]> {
		const { rows } = await pool.query(
			'SELECT * FROM "order" WHERE shopper = $1 ORDER BY data->>\'created\' DESC',
			[shopperId],
		);
		return rows.map(r => ({
			id: r.id,
			shopper: r.shopper,
			seller: r.seller,
			...r.data,
		}));
	}

	public async ordersBySeller(sellerId: string): Promise<Order[]> {
		const { rows } = await pool.query(
			'SELECT * FROM "order" WHERE seller = $1 ORDER BY data->>\'created\' DESC',
			[sellerId],
		);
		return rows.map(r => ({
			id: r.id,
			shopper: r.shopper,
			seller: r.seller,
			...r.data,
		}));
	}

	public async updateOrderStatus(id: string, status: string): Promise<Order> {
		const { rows } = await pool.query(
			`UPDATE "order" SET data = jsonb_set(data, '{status}', to_jsonb($2::text))
       WHERE id = $1
       RETURNING id, shopper, seller, data`,
			[id, status],
		);
		if (rows.length === 0) {
			throw new Error('Order not found');
		}
		const r = rows[0];
		return {
			id: r.id,
			shopper: r.shopper,
			seller: r.seller,
			...r.data,
		};
	}
}
