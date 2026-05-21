import adapter from '@sveltejs/adapter-vercel'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import { sequence, preprocessMeltUI } from '@melt-ui/pp'
import markdown from './src/lib/markdown/index.js'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md'],
	preprocess: sequence([markdown(), vitePreprocess(), preprocessMeltUI()]),
	kit: {
		adapter: adapter(),
		// `/posts/` paths are used by the `<Image>` component for blog post images
		// hosted on GitHub raw — the prerenderer flags them as 404s since they
		// aren't served by the app itself
		prerender: {
			handleHttpError: ({ path }) => {
				if (path.startsWith('/posts/')) return 'ignore'
				throw new Error(`Failed to prerender ${path}`)
			},
		},
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
