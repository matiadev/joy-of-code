<script lang="ts">
	import Heading from '$lib/ui/heading.svelte'
	import { fade } from 'svelte/transition'

	let { data } = $props()
</script>

<svelte:head>
	<title>Archive</title>
	<meta content="List of {data.posts.length} posts." name="description" />
</svelte:head>

<Heading>Archive</Heading>

<section>
	<div class="container">
		<h3>Posts</h3>
		<div>
			<span class="results">{data.posts.length}</span> results
		</div>
	</div>

	<div class="posts">
		{#each data.posts as post, i}
			<div
				in:fade={{
					duration: 300,
					delay: i < 10 ? 100 * i : 100 * 4,
				}}
			>
				<a href="/{post.slug}">
					<article class="post">
						<div class="details">
							<span class="title" style:--view-transition-name={post.slug}>
								{post.title}
							</span>
						</div>
					</article>
				</a>
			</div>
		{/each}
	</div>
</section>

<style>
	section {
		max-width: 740px;
		margin-inline: auto;
		margin-block-start: var(--spacing-64);

		.container {
			display: flex;
			justify-content: space-between;

			.results {
				font-weight: 700;
			}
		}
	}

	.posts {
		margin-top: var(--spacing-64);

		a::before {
			content: none;
		}

		.post {
			margin-block-start: var(--spacing-32);
			padding-block-end: var(--spacing-32);
			border-bottom: 1px solid var(--clr-menu-border);

			:global(html[data-font='dyslexic']) & .title {
				font-family: var(--font-dyslexic);
				font-size: var(--font-24);
				line-height: 32px;
			}

			.title {
				font-family: var(--font-sans);
				font-size: clamp(var(--font-24), 4vw, var(--font-32));
				font-weight: 500;
				line-height: 40px;
				text-transform: capitalize;
			}
		}
	}
</style>
