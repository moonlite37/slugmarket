const CORPORATE_MICROSERVICE = 'http://127.0.0.1:3040/api/v0';

export class APIService {
    public async generate(auth: string): Promise<string> {
        const res = await fetch(`${CORPORATE_MICROSERVICE}/generate`, {
            method: 'POST',
            headers: {
                authorization: auth,
            },
        });
        if (!res.ok) {
            throw new Error(`Request failed with status ${res.status}`);
        }
        return await res.text();
    }
}