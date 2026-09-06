import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'
import type { Post } from '#lib/types/index.js'

async function parseMarkdownFiles() {
	try {
		const posts: Post[] = []
		const postsPath = path.resolve('posts')
		const folders = await fs.readdir(postsPath)

		for (const folder of folders) {
			const markdownFilePath = path.join(postsPath, folder, `${folder}.md`)
			const markdownContent = await fs.readFile(markdownFilePath, 'utf-8')
			const { data } = matter(markdownContent)
			posts.push(data as Post)
		}

		return posts
	} catch (e) {
		throw new Error('Could not parse Markdown files', { cause: e })
	}
}

function getTime(date: string) {
	return new Date(date).getTime()
}

export async function getPosts() {
	let posts = await parseMarkdownFiles()
	posts = posts.sort((first, second) => {
		return getTime(second.published) - getTime(first.published)
	})
	return posts
}

export async function getPostsByCategory(category: string) {
	const posts = await getPosts()
	return posts.filter((post) => !post.draft && post.category === category)
}
