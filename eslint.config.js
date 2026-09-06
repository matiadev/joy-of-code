import prettier from 'eslint-config-prettier';
import svelte from 'eslint-plugin-svelte';
import ts from 'typescript-eslint';

export default [
	prettier,
	...svelte.configs.prettier,
	{
		files: ['**/*.ts'],
		languageOptions: { parser: ts.parser }
	},
	{
		files: ['**/*.svelte'],
		languageOptions: { parserOptions: { parser: ts.parser } }
	},
	{
		files: ['**/*.svelte', '**/*.ts'],
		plugins: { '@typescript-eslint': ts.plugin },
		rules: {
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/ban-ts-comment': 'off'
		}
	},
	{
		ignores: ['.svelte-kit/', 'build/', 'package/', 'example/']
	}
];
