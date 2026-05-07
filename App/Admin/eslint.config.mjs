import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const eslintConfig = defineConfig([
	...nextVitals,
	...nextTs,
	{
		rules: {
			'no-console': 'off',

			'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
			'prefer-const': 'error',
			'no-var': 'error',
			eqeqeq: 'error',
			'space-in-parens': ['error', 'never'],

			indent: ['error', 'tab'],
			semi: ['error', 'always'],
			quotes: ['error', 'single'],
			'comma-dangle': ['error', 'always-multiline'],
		},
	},
	globalIgnores([
		'.next/**',
		'out/**',
		'build/**',
		'next-env.d.ts',
	]),
]);

export default eslintConfig;
