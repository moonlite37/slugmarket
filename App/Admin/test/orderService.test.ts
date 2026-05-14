import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OrderService } from '../src/order/service';

const mockOrders = [
  { id: 'o1', shopper: 's1', seller: 'se1', items: [{ listingId: 'l1', title: 'Widget', price: 10, quantity: 1 }], total: 10, status: 'pending', created: '2026-05-13' },
];

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('order service', () => {
  it('getAll returns orders', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: { allOrders: mockOrders } }),
    });
    const orders = await new OrderService().getAll();
    expect(orders.length).toBe(1);
    expect(orders[0].id).toBe('o1');
  });

  it('getAll throws on failure', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false });
    await expect(new OrderService().getAll()).rejects.toThrow('Failed to fetch orders');
  });

  it('updateStatus calls mutation', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true });
    await new OrderService().updateStatus('o1', 'fulfilled');
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:4000/graphql',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('updateStatus throws on failure', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false });
    await expect(new OrderService().updateStatus('o1', 'fulfilled')).rejects.toThrow('Failed to update order status');
  });
});
