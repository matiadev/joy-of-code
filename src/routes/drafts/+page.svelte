<script lang="ts">
	import { fade } from 'svelte/transition'
	import Heading from '#lib/ui/heading.svelte'

	let { data } = $props()
</script>

<svelte:head>
	<title>Drafts</title>
	<meta content="List of {data.posts.length} posts." name="description" />
</svelte:head>

<Heading>Drafts</Heading>

<section class="mx-auto mt-16 max-w-article">
	<div class="flex justify-between">
		<h3>Drafts</h3>
		<div>
			<span class="font-bold">{data.posts.length}</span> results
		</div>
	</div>

	<div class="mt-16">
		{#each data.posts as post, i}
			<div
				in:fade={{
					duration: 300,
					delay: i < 10 ? 100 * i : 100 * 4,
				}}
			>
				<a href="/drafts/{post.slug}" class="before:content-none">
					<article class="mt-8 border-b border-menu-border pb-8">
						<div>
							<span
								class="title text-card-title font-medium capitalize"
							>
								{post.title}
							</span>
						</div>
					</article>
				</a>
			</div>
		{/each}
	</div>
</section>
