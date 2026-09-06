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

<section class="mx-auto mt-16 max-w-list">
	{@render title?.()}

	<div>
		{#each posts as post, i}
			<div
				in:fade={{
					duration: 300,
					delay: i < 4 ? 100 * i : 100 * 4,
				}}
			>
				<article class="border-b border-menu-border py-8">
					<a
						href="/{post.slug}"
						class="inline-block text-fg hover:text-primary"
					>
						<div
							class="title font-serif text-card-title text-balance capitalize"
							style:view-transition-name={post.slug}
						>
							{post.title}
						</div>
					</a>
					<div class="mt-1 text-lg text-card-fg/60">
						Published {formatDate(post.published)}
					</div>
					<p class="mt-4 max-w-card text-xl leading-8 text-card-fg">
						{post.description}
					</p>
				</article>
			</div>
		{/each}
	</div>

	{@render more?.()}
</section>
