export type Snippet = {
	label: string
	description: string
	code: string
}

export const snippets: Snippet[] = [
	{
		label: 'Image',
		description: 'Embed a post image',
		code: '<Image src="image.webp" alt="Description of image" />',
	},
	{
		label: 'Video',
		description: 'Embed a local MP4 video',
		code: '<Video src="demo.mp4" />',
	},
	{
		label: 'YouTube',
		description: 'Embed a YouTube video',
		code: '<YouTube id="dQw4w9WgXcQ" title="Video title" />',
	},
	{
		label: 'Embed',
		description: 'Embed an iframe (e.g. StackBlitz)',
		code: '<Embed src="https://stackblitz.com/..." title="Example" />',
	},
	{
		label: 'Info',
		description: 'Info callout card',
		code: '<Card type="info">\n\nSomething useful to know.\n\n</Card>',
	},
	{
		label: 'Warning',
		description: 'Warning callout card',
		code: '<Card type="warning">\n\nBe careful about this.\n\n</Card>',
	},
	{
		label: 'Danger',
		description: 'Danger callout card',
		code: '<Card type="danger">\n\nThis will break things.\n\n</Card>',
	},
]

export const frontmatterTemplate = `---
title: Post Title
description: Short description of the post.
slug: post-slug
published: '${new Date().toISOString().slice(0, 10)}'
category: svelte
draft: true
---

`
