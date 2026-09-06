import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import markdown from './src/lib/markdown/index.js';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import adapter from '@sveltejs/adapter-vercel';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit({
			extensions: ['.svelte', '.md'],
			preprocess: [markdown(), vitePreprocess()],
			compilerOptions: {
				warningFilter: (warning) => {
					const ignore = [
						'a11y_img_redundant_alt',
						'a11y_no_static_element_interactions',
					];

					return !ignore.includes(warning.code);
				},
			},
			inspector: {
				toggleKeyCombo: 'meta-shift',
				showToggleButton: 'always',
				toggleButtonPos: 'bottom-right',
			},
			adapter: adapter(),
		}),
	],
	server: { fs: { allow: ['..'] } },
	worker: { format: 'es' },
});
