import adapter from '@sveltejs/adapter-vercel'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import { sequence, preprocessMeltUI } from '@melt-ui/pp'
import markdown from './src/lib/markdown/index.js'
import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'

export default defineConfig({
	plugins: [
		sveltekit({
			extensions: ['.svelte', '.md'],
			preprocess: sequence([markdown(), vitePreprocess(), preprocessMeltUI()]),
			compilerOptions: {
				warningFilter: (warning) => {
					const ignore = [
						'a11y_img_redundant_alt',
						'a11y_no_static_element_interactions',
					]

					return !ignore.includes(warning.code)
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
})
