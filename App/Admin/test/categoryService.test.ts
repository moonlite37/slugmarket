import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('server-only', () => ({}));

const LISTING_URL = 'http://localhost:3011/api/v0';

describe('CategoryService', () => {
	beforeEach(() => {
		vi.restoreAllMocks();
	});

	it('getAll fetches categories', async () => {
		const cats = [{ id: '1', name: 'Electronics' }];
		vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
			ok: true, json: () => Promise.resolve(cats),
		}));
		const { CategoryService } = await import('../src/category/service');
		const result = await new CategoryService().getAll();
		expect(result).toEqual(cats);
		expect(fetch).toHaveBeenCalledWith(`${LISTING_URL}/category`, { cache: 'no-store' });
	});

	it('create posts new category', async () => {
		const cat = { id: '2', name: 'Books' };
		vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
			ok: true, json: () => Promise.resolve(cat),
		}));
		const { CategoryService } = await import('../src/category/service');
		const result = await new CategoryService().create('Books');
		expect(result).toEqual(cat);
	});

	it('delete calls DELETE endpoint', async () => {
		vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }));
		const { CategoryService } = await import('../src/category/service');
		await new CategoryService().delete('1');
		expect(fetch).toHaveBeenCalledWith(`${LISTING_URL}/category/1`, { method: 'DELETE' });
	});

	it('getAll throws on failure', async () => {
		vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));
		const { CategoryService } = await import('../src/category/service');
		await expect(new CategoryService().getAll()).rejects.toThrow('Failed to fetch categories');
	});

	it('create throws on failure', async () => {
		vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));
		const { CategoryService } = await import('../src/category/service');
		await expect(new CategoryService().create('Bad')).rejects.toThrow('Failed to create category');
	});

	it('delete throws on failure', async () => {
		vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));
		const { CategoryService } = await import('../src/category/service');
		await expect(new CategoryService().delete('1')).rejects.toThrow('Failed to delete category');
	});
});
