<script lang="ts">
	import { page } from '$app/stores'
	import Heading from '$lib/ui/heading.svelte'
	import Posts from '$lib/ui/posts.svelte'
	import * as config from '$lib/site/config'
	import type { Categories } from '$lib/types'

	let { data } = $props()

	const { posts } = $derived(data)
	const category = $page.params.category as Categories
</script>

<svelte:head>
	<title>{config.categories[category]}</title>
	<meta content="{config.categories[category]} category." name="description" />
</svelte:head>

<Heading>{config.categories[category]}</Heading>

<Posts {posts}>
	{#snippet title()}
		<div class="container">
			<div>
				<span class="tag">{category}</span>
			</div>
			<div>
				<span class="results">{posts.length}</span> results
			</div>
		</div>
	{/snippet}
</Posts>

<style>
	.container {
		display: flex;
		justify-content: space-between;

		.tag {
			padding: var(--spacing-16);
			font-weight: 700;
			background-color: var(--clr-bg);
			border-radius: var(--rounded-20);
			box-shadow: var(--shadow-sm);
		}

		.results {
			font-weight: 700;
		}
	}
</style>
