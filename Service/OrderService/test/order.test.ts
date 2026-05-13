import { describe, it, expect } from 'vitest';
import supertest from 'supertest';
import { server } from './setup';

const SHOPPER_A = '00000000-0000-0000-0000-000000000001';
const SHOPPER_B = '00000000-0000-0000-0000-000000000002';
const SELLER_A = '00000000-0000-0000-0000-000000000010';
const SELLER_B = '00000000-0000-0000-0000-000000000020';

const gql = (query: string) =>
	supertest(server)
		.post('/graphql')
		.set('Content-Type', 'application/json')
		.send({ query });

const createOrderMutation = (shopper: string, seller: string, title: string) => `
	mutation {
		createOrder(input: {
			shopper: "${shopper}"
			seller: "${seller}"
			items: [{
				listingId: "00000000-0000-0000-0000-000000000099"
				title: "${title}"
				price: 10.00
				quantity: 1
			}]
			total: 10.00
		}) {
			id shopper seller items { listingId title price quantity } total status created
		}
	}
`;

describe('createOrder', () => {
	it('creates an order and returns it', async () => {
		const res = await gql(createOrderMutation(SHOPPER_A, SELLER_A, 'Test Widget'));
		expect(res.status).toBe(200);
		expect(res.body.data.createOrder.id).toBeDefined();
		expect(res.body.data.createOrder.shopper).toBe(SHOPPER_A);
		expect(res.body.data.createOrder.seller).toBe(SELLER_A);
		expect(res.body.data.createOrder.status).toBe('pending');
		expect(res.body.data.createOrder.items[0].title).toBe('Test Widget');
		expect(res.body.data.createOrder.total).toBe(10.00);
	});
});

describe('ordersByShopper', () => {
	it('returns only orders for the specified shopper', async () => {
		await gql(createOrderMutation(SHOPPER_A, SELLER_A, 'Shopper A Item'));
		await gql(createOrderMutation(SHOPPER_B, SELLER_A, 'Shopper B Item'));

		const res = await gql(`{
			ordersByShopper(shopperId: "${SHOPPER_A}") {
				id shopper items { title }
			}
		}`);
		expect(res.status).toBe(200);
		const orders = res.body.data.ordersByShopper;
		expect(orders.length).toBe(1);
		expect(orders[0].items[0].title).toBe('Shopper A Item');
	});
});

describe('ordersBySeller', () => {
	it('returns only orders for the specified seller', async () => {
		await gql(createOrderMutation(SHOPPER_A, SELLER_A, 'Seller A Item'));
		await gql(createOrderMutation(SHOPPER_A, SELLER_B, 'Seller B Item'));

		const res = await gql(`{
			ordersBySeller(sellerId: "${SELLER_A}") {
				id seller items { title }
			}
		}`);
		expect(res.status).toBe(200);
		const orders = res.body.data.ordersBySeller;
		expect(orders.length).toBe(1);
		expect(orders[0].items[0].title).toBe('Seller A Item');
	});
});

describe('updateOrderStatus', () => {
	it('updates order status to fulfilled', async () => {
		const created = await gql(createOrderMutation(SHOPPER_A, SELLER_A, 'To Fulfill'));
		const orderId = created.body.data.createOrder.id;

		const res = await gql(`
			mutation {
				updateOrderStatus(id: "${orderId}", status: "fulfilled") {
					id status
				}
			}
		`);
		expect(res.status).toBe(200);
		expect(res.body.data.updateOrderStatus.status).toBe('fulfilled');
	});

	it('returns error for non-existent order', async () => {
		const res = await gql(`
			mutation {
				updateOrderStatus(id: "00000000-0000-0000-0000-999999999999", status: "fulfilled") {
					id status
				}
			}
		`);
		expect(res.status).toBe(200);
		expect(res.body.errors).toBeDefined();
	});
});
