import { error } from '@sveltejs/kit'

export async function load({ params: { slug } }) {
	try {
		const module = await import(`../../../posts/${slug}/${slug}.md`)
		return { component: module.default, frontmatter: module.metadata }
	} catch (e) {
		console.error(e)
		error(404, `Post does not exist`)
	}
}
