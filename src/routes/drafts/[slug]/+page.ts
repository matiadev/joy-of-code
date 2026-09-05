import { error } from '@sveltejs/kit'
import { dev } from '$app/env'

/*
 * Eager glob keeps the import statically analyzable so Vite bundles
 * every post at build time. A variable `import()` would fall back to
 * Vite's runtime dynamic-import helper, which throws
 * `Unknown variable dynamic import` for slugs without a matching post.
 */
const modules = import.meta.glob('../../../../posts/*/*.md')

export async function load({ params: { slug } }) {
	if (!dev) error(404, 'Not found')

	const loader = modules[`../../../../posts/${slug}/${slug}.md`]
	if (!loader) error(404, `Post does not exist`)

	const module = (await loader()) as { default: unknown; metadata: unknown }
	return { component: module.default, frontmatter: module.metadata }
}

export const prerender = false
