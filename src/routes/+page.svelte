<script lang="ts">
	import Newsletter from '$lib/ui/newsletter.svelte'
	import Posts from '$lib/ui/posts.svelte'
	import { ArrowRight } from '$lib/icons'
	import * as config from '$lib/site/config'

	let { data } = $props()

	const { posts } = $derived(data)
</script>

<svelte:head>
	<title>{config.siteTitle}</title>

	<meta content={config.siteDescription} name="description" />

	<meta content={config.siteTitle} property="og:title" />
	<meta content={config.siteImage} property="og:image" />
	<meta content={config.siteUrl} property="og:url" />
	<meta content={config.siteDescription} property="og:description" />
	<meta content={config.siteName} property="og:site_name" />

	<meta content={config.twitterHandle} name="twitter:creator" />
	<meta content="summary_large_image" name="twitter:card" />
	<meta content={config.siteTitle} name="twitter:title" />
	<meta content={config.siteDescription} name="twitter:description" />
	<meta content={config.siteImage} name="twitter:image" />
</svelte:head>

<main>
	<section class="hero">
		<div class="latest-post">
			<h1 class="title">{posts[0].title}</h1>
			<p class="description">{posts[0].description}</p>
			<a class="continue-reading" href={posts[0].slug}>
				<span>Continue reading</span>
				<ArrowRight width={24} height={24} aria-hidden={true} />
			</a>
		</div>

		<div class="divider"></div>

		<div class="newsletter">
			<h2>Subscribe for updates</h2>
			<Newsletter />
		</div>
	</section>

	<Posts {posts}>
		{#snippet title()}
			<h3 class="latest">Latest</h3>
		{/snippet}

		{#snippet more()}
			<a href="/archive">
				<span>See more posts</span>
				<ArrowRight width="24" height="24" aria-hidden="true" />
			</a>
		{/snippet}
	</Posts>
</main>

<style>
	.hero {
		margin-block-start: var(--spacing-64);
		padding: var(--spacing-32) var(--spacing-24);
		background: var(--clr-footer-bg);
		border: 1px solid var(--clr-menu-border);
		border-radius: var(--rounded-20);
		box-shadow: var(--shadow-sm);

		@media (width >= 860px) {
			display: grid;
			grid-template-columns: repeat(12, [column-start] 1fr);
			column-gap: var(--spacing-24);
		}

		.divider {
			border-bottom: 1px solid var(--clr-menu-border);
			margin: var(--spacing-32) 0;

			@media (width >= 860px) {
				grid-column: column-start 7 / span 1;
				justify-self: center;
				margin: 0;
				border-left: 1px solid var(--clr-menu-border);
				border-bottom: none;
			}
		}
	}

	.latest-post {
		@media (width >= 860px) {
			grid-column: column-start 2 / span 5;
		}

		.title {
			padding-block: var(--spacing-16);
			font-size: clamp(var(--font-24), 4vw, 40px);
		}

		.description {
			font-size: var(--font-20);
			color: var(--clr-card-txt);
		}

		.continue-reading {
			width: max-content;
			display: flex;
			align-items: center;
			margin-top: var(--spacing-32);
		}

		a {
			display: flex;
			gap: var(--spacing-4);
		}
	}

	.newsletter {
		@media (width >= 860px) {
			display: grid;
			place-content: center;
			grid-auto-rows: min-content;
			grid-column: column-start 8 / span 4;
		}

		h2 {
			font-size: var(--font-32);
			line-height: 32px;
		}
	}

	.latest {
		font-weight: 700;
	}
</style>
