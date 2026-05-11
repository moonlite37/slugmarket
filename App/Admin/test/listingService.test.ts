import { describe, it, expect, vi, beforeEach } from 'vitest';

import { ListingService } from '../src/listing/service';

const mockListings = [
  { id: 'mock-1', author: 'a1', title: 'Widget', description: 'A widget', price: 10, stock: 5, created: '2026-05-10' },
  { id: 'mock-2', author: 'a2', title: 'Gadget', description: 'A gadget', price: 20, stock: 3, created: '2026-05-10' },
];

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('listing service', () => {
  it('getAll returns listings', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockListings),
    });
    const listings = await new ListingService().getAll();
    expect(listings.length).toBe(2);
    expect(listings[0].title).toBe('Widget');
  });

  it('getAll throws on failure', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false });
    await expect(new ListingService().getAll()).rejects.toThrow('Failed to fetch listings');
  });

  it('deleteListing calls DELETE', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true });
    await new ListingService().deleteListing('mock-1');
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:3011/api/v0/listing/mock-1',
      { method: 'DELETE' },
    );
  });

  it('deleteListing throws on failure', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false });
    await expect(new ListingService().deleteListing('mock-1')).rejects.toThrow('Failed to delete listing');
  });
});