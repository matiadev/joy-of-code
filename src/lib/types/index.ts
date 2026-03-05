import type * as config from '$lib/site/config'

export type Post = {
	title: string
	description: string
	slug: string
	published: string
	category: string
	series?: string
	draft?: string
}

export type Fetch = (
	input: RequestInfo | URL,
	init?: RequestInit
) => Promise<Response>

export type Categories = keyof typeof config.categories

export type DateStyle = Intl.DateTimeFormatOptions['dateStyle']
