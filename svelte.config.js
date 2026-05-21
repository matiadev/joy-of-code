import adapter from '@sveltejs/adapter-vercel'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import { sequence, preprocessMeltUI } from '@melt-ui/pp'
import markdown from './src/lib/markdown/index.js'

/** @type {import('@sveltejs/kit').Config} */
const config = {
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
	kit: {
		adapter: adapter(),
	},
	vitePlugin: {
		inspector: {
			toggleKeyCombo: 'meta-shift',
			showToggleButton: 'always',
			toggleButtonPos: 'bottom-right',
		},
	},
}

export default config
