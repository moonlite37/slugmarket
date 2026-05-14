import { http, HttpResponse } from 'msw';

export const listing = {
	id: '00000000-0000-0000-0000-000000000002',
	author: '00000000-0000-0000-0000-000000000001',
	username: 'John Pork',
	title: 'Pork Chops',
	description: '100% authentic pork chops made from pork',
	created: new Date().toISOString(),
	price: 19.99,
	stock: 42,
	categories: ['food', 'pork'],
	images: ['img1.jpg', 'img2.jpg'],
};

export const listing2 = {
	id: '00000000-0000-0000-0000-000000000003',
	author: '00000000-0000-0000-0000-000000000002',
	username: 'Steve Jobs',
	title: 'Iphone 7',
	description: 'New and improved Iphone with touch id. 100% less headphone jacks!',
	created: new Date().toISOString(),
	price: 799.99,
	stock: 224,
	categories: ['phone', 'tech'],
	images: ['img3.jpg', 'img4.jpg'],
};

export const mockListings = () => {
	return http.get('http://localhost:3000/shopper/api/v0/listing', () => {
		return HttpResponse.json([listing, listing2]);
	});
};
