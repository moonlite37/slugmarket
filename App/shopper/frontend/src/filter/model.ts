export async function getCategory() {
	const query = `/shopper/api/v0/category`;
	const res = await fetch(query);
	return res.json();
}
