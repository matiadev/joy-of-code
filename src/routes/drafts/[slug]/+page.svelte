<script lang="ts">
	import { formatDate } from '#lib/utils/index.js'
	import * as config from '#lib/site/config.js'
	import type { PageData } from './$types'

	import Card from '../../[slug]/card.svelte'
	import Clipboard from '../../[slug]/clipboard.svelte'
	import TableOfContents from '../../[slug]/toc.svelte'

	type Props = {
		data: PageData
	}

	let { data }: Props = $props()

	const Content = $derived(data.component)

	let editUrl = $derived(
		`${config.fileUrl}/${data.frontmatter.slug}/${data.frontmatter.slug}.md`
	)
	let image = $derived(
		`${config.postImage}${encodeURIComponent(data.frontmatter.title)}.png`
	)
</script>

<svelte:head>
	<title>{data.frontmatter.title}</title>

	<meta content={data.frontmatter.description} name="description" />

	<meta content={data.frontmatter.title} property="og:title" />
	<meta content={image} property="og:image" />
	<meta content={config.siteUrl} property="og:url" />
	<meta content={data.frontmatter.description} property="og:description" />
	<meta content={config.siteName} property="og:site_name" />

	<meta content={config.twitterHandle} name="twitter:creator" />
	<meta content="summary_large_image" name="twitter:card" />
	<meta content={data.frontmatter.title} name="twitter:title" />
	<meta content={data.frontmatter.description} name="twitter:description" />
	<meta content={image} name="twitter:image" />
</svelte:head>

<Clipboard />

<main>
	<TableOfContents />

	<article class="prose">
		<header>
			<h1 class="mx-auto max-w-narrow">{data.frontmatter.title}</h1>
			<p class="mt-6">
				Published <span class="font-bold">{formatDate(data.frontmatter.published)}</span>
			</p>
		</header>

		<Content />
	</article>

	<div class="mx-auto my-16 grid max-w-prose gap-8">
		<Card preset="support" />
		<Card preset="edit" {editUrl} />
	</div>
</main>
