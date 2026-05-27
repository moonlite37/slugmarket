import { Category } from '.';
import { pool } from '../db';

export class CategoryService {
	public async getCategory(
	): Promise<Category[]> {
		const q = `
		SELECT * FROM category
	`;
		const rows = (await pool.query(q, [])).rows;
		return rows.map((r) => ({
			id: r.id,
			name: r.data.name,
		}));
	}
	public async createCategory(name: string): Promise<Category> {
		const q = `
		INSERT INTO category(data)
        VALUES (json_build_object('name', $1::text))
        RETURNING *
	`;
		const rows = (await pool.query(q, [name])).rows;
		return rows[0];
	}
	public async deleteCategory(id: string): Promise<boolean> {
		const q = `
            DELETE FROM category
            WHERE id = $1
        `;
		const {rowCount} = (await pool.query(q, [id]));
		return (rowCount as number > 0);
	}
}
