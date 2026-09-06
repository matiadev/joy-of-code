import matter from 'gray-matter'
import { unified } from 'unified'
import toMarkdownAST from 'remark-parse'
import toHtmlAST from 'remark-rehype'
import toHtmlString from 'rehype-stringify'
import remarkGfm from 'remark-gfm'
import remarkSmartypants from 'remark-smartypants'
import remarkTableofContents from 'remark-toc'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeCodeTitles from 'rehype-code-titles'
import rehypeShikiFromHighlighter from './shiki-rehype.js'
import { createHighlighterCore } from '@shikijs/core'
import { createJavaScriptRegexEngine } from '@shikijs/engine-javascript'
import poimandres from '@shikijs/themes/poimandres'
import shellscript from '@shikijs/langs/shellscript'
import shellsession from '@shikijs/langs/shellsession'
import consoleLang from '@shikijs/langs/console'
import css from '@shikijs/langs/css'
import html from '@shikijs/langs/html'
import javascript from '@shikijs/langs/javascript'
import json from '@shikijs/langs/json'
import jsx from '@shikijs/langs/jsx'
import markdownLang from '@shikijs/langs/markdown'
import scss from '@shikijs/langs/scss'
import sql from '@shikijs/langs/sql'
import svelte from '@shikijs/langs/svelte'
import tsx from '@shikijs/langs/tsx'
import typescript from '@shikijs/langs/typescript'
import vue from '@shikijs/langs/vue'
import yaml from '@shikijs/langs/yaml'
import esTagHtml from '@shikijs/langs/es-tag-html'
import { transformerMetaHighlight } from '@shikijs/transformers'
import { rehypeCopyCode } from './plugins.js'

/**
 * Only the languages used across posts (plus the grammars they
 * inject: `yaml` for Markdown frontmatter, `es-tag-html` for
 * html-tagged template literals, `vue` for component tags
 * inside Markdown) are loaded. Fine-grained `@shikijs/langs`
 * modules are imported directly so the full `shiki` bundle (and
 * its Oniguruma WASM engine) stays out of the dependency tree.
 * `text` and `txt` don't need imports: they're special languages
 * that shiki renders without a grammar.
 */
const languages = [
	shellscript,
	shellsession,
	consoleLang,
	css,
	html,
	javascript,
	json,
	jsx,
	markdownLang,
	scss,
	sql,
	svelte,
	tsx,
	typescript,
	vue,
	yaml,
	esTagHtml,
]

/** @type {Promise<Awaited<ReturnType<typeof createHighlighterCore>>> | undefined} */
let highlighterPromise

/**
 * Long-lived highlighter using the JavaScript RegExp engine
 * instead of Oniguruma WASM.
 * @returns {Promise<Awaited<ReturnType<typeof createHighlighterCore>>>}
 */
function getHighlighter() {
	if (!highlighterPromise) {
		highlighterPromise = createHighlighterCore({
			themes: [poimandres],
			langs: languages,
			engine: createJavaScriptRegexEngine({ forgiving: true }),
		})
	}
	return highlighterPromise
}

/** @type {Promise<import('unified').Processor<any, any, any, any, any>> | undefined} */
let processorPromise

/**
 * Lazily creates the Markdown processor on first use so importing
 * this module (for example from `vite.config.js`) stays cheap.
 * @returns {Promise<import('unified').Processor<any, any, any, any, any>>}
 */
function getProcessor() {
	if (!processorPromise) {
		processorPromise = getHighlighter().then((highlighter) =>
			unified()
				.use(toMarkdownAST)
				.use([
					remarkGfm,
					remarkSmartypants,
					[remarkTableofContents, { maxDepth: 2, tight: true }],
				])
				.use(toHtmlAST, { allowDangerousHtml: true })
				.use([rehypeSlug, rehypeAutolinkHeadings])
				.use(rehypeCodeTitles)
				.use(rehypeShikiFromHighlighter, highlighter, {
					theme: 'poimandres',
					transformers: [
						{
							pre(node) {
								// remove `tabindex` from `pre` elements to avoid warnings
								node.properties.tabindex && delete node.properties.tabindex
							},
						},
						transformerMetaHighlight(),
					],
					// reuse highlighted fragments across compiles
					cache: new Map(),
				})
				.use(rehypeCopyCode)
				.use(toHtmlString, { allowDangerousHtml: true })
		)
	}
	return processorPromise
}

/**
 * Escape curly braces so Svelte doesn't treat them as template
 * expressions, except inside Svelte component tags. Done in a
 * single pass instead of escaping everything and restoring it after.
 * @param {string} content
 */
function escapeHtml(content) {
	return content.replace(/[{}]|<[A-Z][^>]*>/g, (match) => {
		if (match === '{') return '&#123;'
		if (match === '}') return '&#125;'
		return match
	})
}

/**
 * Markdown preprocessor.
 * @param {string} content
 */
async function parseMarkdown(content) {
	const markdownProcessor = await getProcessor()
	const parsedMarkdown = await markdownProcessor.process(content)
	return parsedMarkdown.toString()
}

/**
 * Exports post metadata.
 * @param {string} content
 */
function frontmatter(content) {
	const { content: markdown, data } = matter(content)
	const meta = `
		<script module>
			export const metadata = ${JSON.stringify(data)}
		</script>
	`
	return { markdown, meta }
}

/**
 * Preprocessor for Markdown files which converts
 * Markdown to HTML before it's compiled by Svelte
 * so we can use Svelte components inside Markdown.
 */
function markdown() {
	return {
		name: 'markdown',
		/**
		 * Convert Markdown to HTML.
		 * @param {Object} params
		 * @param {string} params.content
		 * @param {string} [params.filename]
		 */
		async markup({ content, filename }) {
			if (filename?.endsWith('.md')) {
				const { markdown, meta } = frontmatter(content)
				const html = await parseMarkdown(markdown)
				const code = escapeHtml(html)
				return { code: meta + code }
			}
		},
	}
}

export default markdown
