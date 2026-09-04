import { error } from '@sveltejs/kit'
import { dev } from '$app/env'

export async function load({ params: { slug } }) {
	if (!dev) error(404, 'Not found')

	try {
		const module = await import(`../../../../posts/${slug}/${slug}.md`)
		return { component: module.default, frontmatter: module.metadata }
	} catch (e) {
		error(404, `Post does not exist`)
	}
}

export const prerender = false
