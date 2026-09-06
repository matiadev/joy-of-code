<script lang="ts">
	import Newsletter from '#lib/ui/newsletter.svelte'
	import Posts from '#lib/ui/posts.svelte'
	import { ArrowRight } from '#lib/icons/index.js'
	import * as config from '#lib/site/config.js'

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
	<section
		class="mt-16 rounded-2xl border border-menu-border bg-footer px-6 py-8 shadow-sm min-[860px]:grid min-[860px]:grid-cols-12 min-[860px]:gap-x-6"
	>
		<div class="min-[860px]:col-span-5 min-[860px]:col-start-2">
			<h1 class="py-4 text-hero-title">{posts[0].title}</h1>
			<p class="text-xl leading-8 text-card-fg">{posts[0].description}</p>
			<a class="mt-8 flex w-max items-center gap-1" href={posts[0].slug}>
				<span>Continue reading</span>
				<ArrowRight width={24} height={24} aria-hidden={true} />
			</a>
		</div>

		<div
			class="my-8 border-b border-menu-border min-[860px]:col-span-1 min-[860px]:col-start-7 min-[860px]:m-0 min-[860px]:justify-self-center min-[860px]:border-b-0 min-[860px]:border-l"
		></div>

		<div
			class="min-[860px]:col-span-5 min-[860px]:col-start-8 min-[860px]:grid min-[860px]:place-content-center"
		>
			<h2 class="text-heading">Subscribe for updates</h2>
			<Newsletter />
		</div>
	</section>

	<Posts {posts}>
		{#snippet title()}
			<h3 class="font-bold">Latest</h3>
		{/snippet}

		{#snippet more()}
			<a href="/archive" class="mt-8 flex w-max gap-1">
				<span>See more posts</span>
				<ArrowRight width="24" height="24" aria-hidden="true" />
			</a>
		{/snippet}
	</Posts>
</main>
