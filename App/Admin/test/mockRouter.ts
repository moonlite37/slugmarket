import { vi } from 'vitest';

export const MockRouter = {
	push: vi.fn(),
};

vi.mock('next/navigation', () => ({
	useRouter: () => MockRouter,
}));

export const routerSpy = MockRouter.push;