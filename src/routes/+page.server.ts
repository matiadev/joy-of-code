import { fetchJSON } from '#lib/utils/index.js'
import { error } from '@sveltejs/kit'
import type { Post } from '#lib/types/index.js'

export async function load({ fetch }) {
	try {
		const posts = await fetchJSON<Post[]>('/api/posts', fetch)
		const publishedPosts = posts.filter(({ draft }) => !draft)
		return { posts: publishedPosts.slice(0, 10) }
	} catch (e) {
		error(404, (e as Error).message)
	}
}
