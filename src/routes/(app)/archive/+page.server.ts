import { error } from '@sveltejs/kit'
import { fetchJSON } from '$lib/utils'
import type { Post } from '$lib/types'

export async function load({ fetch }) {
	try {
		const posts = await fetchJSON<Post[]>('/api/posts', fetch)
		const publishedPosts = posts.filter(({ draft }) => !draft)
		return { posts: publishedPosts }
	} catch (e) {
		error(404, (e as Error).message)
	}
}
