<script lang="ts">
	import Header from '#lib/ui/header/header.svelte'
	import Footer from '#lib/ui/footer.svelte'
	import LiteYouTubeEmbed from '#lib/embed/youtube.svelte'
	import { useAnalytics } from '#lib/analytics/index.js'
	import { setupViewTransition } from '#lib/utils/index.js'

	import '../styles/styles.css'

	useAnalytics()
	setupViewTransition()

	let { children } = $props()
</script>

<LiteYouTubeEmbed />

<div class="container">
	<Header />

	<div class="layout">
		{@render children?.()}

		<Footer />
	</div>
</div>

<style>
	.container {
		min-height: 100%;
		padding-block-start: var(--spacing-24);
	}

	.layout {
		height: 100%;
		max-inline-size: 1200px;
		display: grid;
		grid-template-rows: 1fr auto;
		gap: var(--spacing-24);
		margin-inline: auto;

		@media (width >= 300px) {
			padding: 0px var(--spacing-16);
		}

		@media (width >= 1240px) {
			padding: 0px;
		}
	}
</style>
