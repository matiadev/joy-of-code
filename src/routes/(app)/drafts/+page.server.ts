import { error } from '@sveltejs/kit'
import { dev } from '$app/environment'
import { fetchJSON } from '$lib/utils'
import type { Post } from '$lib/types'

export async function load({ fetch }) {
	if (!dev) error(404, 'Not found')

	try {
		const posts = await fetchJSON<Post[]>('/api/posts', fetch)
		const draftPosts = posts.filter(({ draft }) => draft)
		return { posts: draftPosts }
	} catch (e) {
		error(404, (e as Error).message)
	}
}

export const prerender = false
