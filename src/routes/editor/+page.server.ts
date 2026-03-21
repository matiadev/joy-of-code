import { error } from '@sveltejs/kit'
import { dev } from '$app/environment'
import fs from 'node:fs/promises'
import path from 'node:path'

export const prerender = false

export type TreeFile = {
	kind: 'file'
	name: string
	path: string
	slug: string
	raw?: string
}

export type TreeFolder = {
	kind: 'folder'
	name: string
	children: TreeNode[]
}

export type TreeNode = TreeFile | TreeFolder

export async function load() {
	if (!dev) error(404, 'Not found')

	const postsDir = path.resolve('posts')
	const slugDirs = (await fs.readdir(postsDir, { withFileTypes: true }))
		.filter((d) => d.isDirectory())
		.map((d) => d.name)
		.sort()

	const tree: TreeNode[] = await Promise.all(
		slugDirs.map(async (slug): Promise<TreeFolder> => {
			const slugDir = path.join(postsDir, slug)
			const entries = (await fs.readdir(slugDir, { withFileTypes: true })).sort(
				(a, b) => a.name.localeCompare(b.name)
			)

			const children: TreeNode[] = await Promise.all(
				entries.map(async (entry): Promise<TreeNode> => {
					if (entry.isDirectory()) {
						const subDir = path.join(slugDir, entry.name)
						const subEntries = (
							await fs.readdir(subDir, { withFileTypes: true })
						)
							.filter((e) => e.isFile())
							.sort((a, b) => a.name.localeCompare(b.name))

						return {
							kind: 'folder',
							name: entry.name,
							children: subEntries.map((e) => ({
								kind: 'file',
								name: e.name,
								path: path.join(subDir, e.name),
								slug,
							})),
						} satisfies TreeFolder
					}

					const filePath = path.join(slugDir, entry.name)
					const file: TreeFile = {
						kind: 'file',
						name: entry.name,
						path: filePath,
						slug,
					}

					if (entry.name === `${slug}.md`) {
						file.raw = await fs.readFile(filePath, 'utf-8')
					}

					return file
				})
			)

			return { kind: 'folder', name: slug, children }
		})
	)

	return { tree }
}
