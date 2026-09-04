import { error } from '@sveltejs/kit'
import { getPosts } from '#lib/site/posts.js'

export async function GET() {
	try {
		const posts = await getPosts()
		return Response.json(posts)
	} catch (e) {
		error(404, 'Failed to load posts')
	}
}
