<script lang="ts">
	import { page } from '$app/state'
	import Heading from '#lib/ui/heading.svelte'
	import Posts from '#lib/ui/posts.svelte'
	import * as config from '#lib/site/config.js'
	import type { Categories } from '#lib/types/index.js'

	let { data } = $props()

	const { posts } = $derived(data)
	const category = page.params.category as Categories
</script>

<svelte:head>
	<title>{config.categories[category]}</title>
	<meta content="{config.categories[category]} category." name="description" />
</svelte:head>

<Heading>{config.categories[category]}</Heading>

<Posts {posts}>
	{#snippet title()}
		<div class="flex justify-between">
			<div>
				<span class="rounded-2xl bg-base p-4 font-bold shadow-sm">{category}</span>
			</div>
			<div>
				<span class="font-bold">{posts.length}</span> results
			</div>
		</div>
	{/snippet}
</Posts>
