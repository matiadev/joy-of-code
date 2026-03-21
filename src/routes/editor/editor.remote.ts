import { command, query } from '$app/server'
import { dev } from '$app/environment'
import { error } from '@sveltejs/kit'
import { parseMarkdown } from '$lib/markdown/index.js'
import matter from 'gray-matter'
import fs from 'node:fs/promises'
import path from 'node:path'

export const renderPreview = query(
	'unchecked',
	async ({ content, slug }: { content: string; slug: string }) => {
		if (!dev) error(404, 'Not found')

		const { content: markdown } = matter(content)
		const html = await parseMarkdown(markdown, slug)

		return html
	}
)

export const savePost = command(
	'unchecked',
	async ({ content, slug }: { content: string; slug: string }) => {
		if (!dev) error(404, 'Not found')

		const dir = path.resolve('posts', slug)
		const filePath = path.join(dir, `${slug}.md`)

		await fs.mkdir(dir, { recursive: true })
		await fs.writeFile(filePath, content, 'utf-8')
	}
)
