<script lang="ts">
	import { formatDate } from '$lib/utils'
	import * as config from '$lib/site/config'

	import Card from '../../[slug]/card.svelte'
	import Clipboard from '../../[slug]/clipboard.svelte'
	import TableOfContents from '../../[slug]/toc.svelte'

	let { data } = $props()

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
			<h1 class="title">{data.frontmatter.title}</h1>
			<p class="published">
				Published {formatDate(data.frontmatter.published)}
			</p>
		</header>

		<data.component />
	</article>

	<div class="cards">
		<Card preset="support" />
		<Card preset="edit" {editUrl} />
	</div>
</main>

<style>
	.cards {
		display: grid;
		row-gap: var(--spacing-32);
		max-width: var(--post-txt-length);
		margin: var(--spacing-64) 0;
		margin-inline: auto;
	}

	.title {
		max-width: 600px;
		margin-inline: auto;
	}

	.published {
		margin-top: var(--spacing-24);
	}
</style>
