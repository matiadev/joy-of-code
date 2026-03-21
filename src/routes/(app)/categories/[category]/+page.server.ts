import { error } from '@sveltejs/kit'
import { getPostsByCategory } from '$lib/site/posts'
import * as config from '$lib/site/config'
import type { Categories } from '$lib/types/index.js'

export async function load({ params }) {
	const category = params.category as Categories

	if (!config.categories[category]) {
		error(404, 'Category does not exist')
	}

	try {
		return {
			posts: await getPostsByCategory(category),
		}
	} catch (e) {
		error(404, `Failed to load posts`)
	}
}
