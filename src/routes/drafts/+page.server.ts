import { error } from '@sveltejs/kit'
import { dev } from '$app/env'
import { fetchJSON } from '#lib/utils/index.js'
import type { Post } from '#lib/types/index.js'

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
