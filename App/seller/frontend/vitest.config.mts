import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	test: {
		environment: 'jsdom',
		setupFiles: ['./vitest.setup.ts'],
		coverage: {
			thresholds: {
				lines: 95,
				functions: 95,
				branches: 95,
				statements: 95,
			},
			exclude: ['build/**', 'copypaste/**', 'coverage/**'],
		},
	},
});