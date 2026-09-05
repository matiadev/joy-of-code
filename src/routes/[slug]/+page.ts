import { error } from '@sveltejs/kit'

/*
 * Eager glob keeps the import statically analyzable so Vite bundles
 * every post at build time. A variable `import()` would fall back to
 * Vite's runtime dynamic-import helper, which throws
 * `Unknown variable dynamic import` for slugs without a matching post
 * and used to flood dev logs.
 */
const modules = import.meta.glob('../../../posts/*/*.md')

export async function load({ params: { slug } }) {
	const loader = modules[`../../../posts/${slug}/${slug}.md`]
	if (!loader) error(404, `Post does not exist`)

	const module = (await loader()) as { default: unknown; metadata: unknown }
	return { component: module.default, frontmatter: module.metadata }
}
