import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getOrders, updateOrderStatus } from '../src/app/order/actions';

const mockOrders = [
  { id: 'o1', shopper: 's1', seller: 'se1', items: [{ listingId: 'l1', title: 'Widget', price: 10, quantity: 1 }], total: 10, status: 'pending', created: '2026-05-13' },
];

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('order actions', () => {
  it('getOrders returns orders', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: { allOrders: mockOrders } }),
    });
    const orders = await getOrders();
    expect(orders.length).toBe(1);
  });

  it('updateOrderStatus calls service', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true });
    await updateOrderStatus('o1', 'fulfilled');
    expect(global.fetch).toHaveBeenCalled();
  });
});
