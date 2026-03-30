<script lang="ts">
	type Props = {
		src: string
		title: string
	}

	let { src, title }: Props = $props()

	let loaded = $state(false)
</script>

<p class="embed example">
	{#if !loaded}
		<button onclick={() => (loaded = !loaded)}>
			<svg
				viewBox="0 0 24 24"
				width="24"
				height="24"
				fill="none"
				stroke="var(--clr-primary)"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<polygon points="5 3 19 12 5 21 5 3" />
			</svg>
			Load {title}
		</button>
	{:else}
		<iframe {title} {src} loading="lazy" allowfullscreen></iframe>
	{/if}
</p>

<style>
	.embed {
		aspect-ratio: 16/9;
		place-content: center;
		background: var(--clr-footer-bg);
		border: 1px solid var(--clr-menu-border);
		border-radius: var(--rounded-20);
		overflow: hidden;

		button {
			display: flex;
			align-items: center;
			gap: 0.5rem;
			margin-inline: auto;
			text-shadow: var(--shadow-sm);
		}
	}

	iframe {
		height: 100%;
	}
</style>
