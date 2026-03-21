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
import rehypeShiki from '@shikijs/rehype'
import { transformerMetaHighlight } from '@shikijs/transformers'
import { rehypeCopyCode } from './plugins.js'

const images = `https://raw.githubusercontent.com/mattcroat/joy-of-code/main/posts`

const markdownProcessor = unified()
	.use(toMarkdownAST)
	.use([
		remarkGfm,
		remarkSmartypants,
		[remarkTableofContents, { maxDepth: 2, tight: true }],
	])
	.use(toHtmlAST, { allowDangerousHtml: true })
	.use([rehypeSlug, rehypeAutolinkHeadings])
	.use(rehypeCodeTitles)
	.use(rehypeShiki, {
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
	})
	.use(rehypeCopyCode)
	.use(toHtmlString, { allowDangerousHtml: true })

/**
 * Returns post slug.
 * @param {string} filename
 */
function getSlug(filename) {
	return filename.split('/').at(-1)?.replace('.md', '') ?? ''
}

/**
 * Search and replace Markdown.
 * @param {string} content
 * @param {string} slug
 */
function searchAndReplace(content, slug) {
	const embed = /{% embed src="(.*?)" title="(.*?)" %}/g
	const video = /{% video src="(.*?)" %}/g
	const image = /{% img src="(.*?)" alt="(.*?)" %}/g
	const youtube = /{% youtube id="(.*?)" title="(.*?)" %}/g
	const info = /{% info text="(.*?)" %}/g
	const warning = /{% warning text="(.*?)" %}/g
	const danger = /{% danger text="(.*?)" %}/g

	return content
		.replace(embed, (_, src, title) => {
			return `
        <iframe
          title="${title}"
          src="${src}"
          loading="lazy"
        ></iframe>
      `.trim()
		})
		.replace(video, (_, src) => {
			return `
        <video controls>
          <source
            src="${images}/${slug}/images/${src}"
            type="video/mp4"
          />
        </video>
      `.trim()
		})
		.replace(image, (_, src, alt) => {
			return `
      <img
        src="${images}/${slug}/images/${src}"
        alt="${alt}"
        loading="lazy"
      />
  `.trim()
		})
		.replace(youtube, (_, id, title) => {
			return `
				<lite-youtube videoid="${id}" playlabel="${title}"></lite-youtube>
			`.trim()
		})
		.replace(info, (_, text) => {
			return `
				<div class="card info">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
						<circle cx="12" cy="12" r="10"/><path d="M12 16v-4" />
						<path d="M12 8h.01"/>
					</svg>
					<span>${text}</span>
				</div>
			`.trim()
		})
		.replace(warning, (_, text) => {
			return `
				<div class="card warning">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
						<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
						<path d="M12 9v4" />
						<path d="M12 17h.01" />
					</svg>
					<span>${text}</span>
				</div>
			`.trim()
		})
		.replace(danger, (_, text) => {
			return `
				<div class="card danger">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
						<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6" />
						<path d="m9 9 6 6" />
					</svg>
					<span>${text}</span>
				</div>
			`.trim()
		})
}

/**
 * Markdown preprocessor.
 * @param {string} content
 * @param {string} slug
 */
export async function parseMarkdown(content, slug) {
	const replacedContent = searchAndReplace(content, slug)
	const parsedMarkdown = await markdownProcessor.process(replacedContent)
	return parsedMarkdown.toString()
}

/**
 * Replace special Svelte characters.
 * @param {string} content
 */
function escapeHtml(content) {
	content = content.replace(/{/g, '&#123;').replace(/}/g, '&#125;')

	const componentRegex = /<[A-Z].*/g
	const components = content.match(componentRegex)
	components?.forEach((component) => {
		const replaced = component.replace('&#123;', '{').replace('&#125;', '}')
		content = content.replace(component, replaced)
	})

	return content
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
		 * @param {string} params.filename
		 */
		async markup({ content, filename }) {
			if (filename.endsWith('.md')) {
				const slug = getSlug(filename)
				const { markdown, meta } = frontmatter(content)
				const html = await parseMarkdown(markdown, slug)
				const code = escapeHtml(html)
				return { code: meta + code }
			}
		},
	}
}

export default markdown
