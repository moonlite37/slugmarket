'use client';
import { useEffect, useState } from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, Button, TextField, Box, Typography } from '@mui/material';
import { getCategories, createCategory, deleteCategory } from './actions';

interface Category {
	id: string;
	name: string;
}

export default function CategoryTable() {
	const [categories, setCategories] = useState<Category[]>([]);
	const [newName, setNewName] = useState('');

	useEffect(() => {
		void getCategories().then(setCategories);
	}, []);

	const handleCreate = async () => {
		/* v8 ignore next */
		if (!newName.trim()) return;
		const cat = await createCategory(newName.trim());
		setCategories((prev) => [...prev, cat]);
		setNewName('');
	};

	const handleDelete = async (id: string) => {
		await deleteCategory(id);
		setCategories((prev) => prev.filter((c) => c.id !== id));
	};

	return (
		<Box>
			<Typography variant="h6" sx={{ mb: 1 }}>Categories</Typography>
			<Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
				<TextField
					size="small"
					placeholder="New category name"
					value={newName}
					onChange={(e) => setNewName(e.target.value)}
				/>
				<Button variant="contained" size="small" onClick={handleCreate}>
					Add
				</Button>
			</Box>
			{categories.length === 0 ? (
				<Typography>No categories</Typography>
			) : (
				<Table size="small">
					<TableHead>
						<TableRow>
							<TableCell>Name</TableCell>
							<TableCell>Actions</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{categories.map((cat) => (
							<TableRow key={cat.id}>
								<TableCell>{cat.name}</TableCell>
								<TableCell>
									<Button size="small" color="error" onClick={() => { void handleDelete(cat.id); }}>
										Delete
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
		</Box>
	);
}
