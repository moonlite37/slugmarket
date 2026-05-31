export async function generateApiKey() {
	const res = await fetch('/seller/api/v0/corp/generate', {
		method: 'POST',
		credentials: 'include',
	});

	if (!res.ok) {
		throw new Error('Failed to generate API key');
	}

	return res.text();
}
