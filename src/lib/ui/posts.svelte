<script lang="ts">
	import type { Snippet } from 'svelte'
	import { fade } from 'svelte/transition'

	import { formatDate } from '#lib/utils/index.js'
	import type { Post } from '#lib/types/index.js'

	type Props = {
		posts: Post[]
		title?: Snippet
		more?: Snippet
	}

	let { posts, title, more }: Props = $props()
</script>

<section>
	{@render title?.()}

	<div class="cards">
		{#each posts as post, i}
			<div
				in:fade={{
					duration: 300,
					delay: i < 4 ? 100 * i : 100 * 4,
				}}
			>
				<article class="card">
					<a href="/{post.slug}">
						<div class="title" style:view-transition-name={post.slug}>
							{post.title}
						</div>
					</a>
					<div class="published">Published {formatDate(post.published)}</div>
					<p class="description">{post.description}</p>
				</article>
			</div>
		{/each}
	</div>

	{@render more?.()}
</section>

<style>
	section {
		max-width: 960px;
		margin-inline: auto;
		margin-top: var(--spacing-64);
	}

	.card {
		padding-block: var(--spacing-32);
		border-bottom: 1px solid var(--clr-menu-border);

		a {
			--color: inherit;
			display: inline-block;
		}

		:global(html[data-font='dyslexic']) & .title {
			font-family: var(--font-dyslexic);
			font-size: var(--font-24);
			line-height: 32px;
		}

		.title {
			font-family: var(--font-serif);
			font-size: clamp(var(--font-24), 4vw, var(--font-32));
			line-height: 40px;
			text-transform: capitalize;
			text-wrap: balance;
		}

		.published {
			margin-block-start: var(--spacing-4);
			font-size: var(--font-18);
			color: var(--clr-card-txt);
		}

		.description {
			max-width: 60ch;
			margin-top: var(--spacing-16);
			font-size: var(--font-20);
			color: var(--clr-card-txt);
		}
	}

	:global(a[href='/archive']) {
		width: max-content;
		display: flex;
		gap: var(--spacing-4);
		margin-top: var(--spacing-32);
	}
</style>
