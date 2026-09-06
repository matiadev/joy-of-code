<script lang="ts">
	type Props = {
		src: string
		title: string
	}

	let { src, title }: Props = $props()

	let loaded = $state(false)
</script>

<p
	class="example grid aspect-video place-content-center overflow-hidden rounded-2xl border border-menu-border bg-footer"
>
	{#if !loaded}
		<button
			class="mx-auto flex items-center gap-1"
			onclick={() => (loaded = !loaded)}
		>
			<svg
				viewBox="0 0 24 24"
				width="24"
				height="24"
				fill="none"
				stroke="var(--color-primary)"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			>
				<polygon points="5 3 19 12 5 21 5 3" />
			</svg>
			Load {title}
		</button>
	{:else}
		<iframe {title} {src} loading="lazy" allowfullscreen class="h-full"
		></iframe>
	{/if}
</p>
