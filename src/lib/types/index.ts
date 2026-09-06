import type * as config from '#lib/site/config.js'
import type { Component } from 'svelte'

export type Post = {
	title: string
	description: string
	slug: string
	published: string
	category: string
	series?: string
	draft?: string
}

export type Frontmatter = {
	title: string
	description: string
	slug: string
	published: string
	category: string
	series?: string
	draft?: string
}

export type PostModule = {
	default: Component
	metadata: Frontmatter
}

export type Fetch = (
	input: RequestInfo | URL,
	init?: RequestInit
) => Promise<Response>

export type Categories = keyof typeof config.categories

export type DateStyle = Intl.DateTimeFormatOptions['dateStyle']
