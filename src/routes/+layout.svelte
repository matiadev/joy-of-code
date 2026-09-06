<script lang="ts">
	import Header from '#lib/ui/header/header.svelte'
	import Footer from '#lib/ui/footer.svelte'
	import LiteYouTubeEmbed from '#lib/embed/youtube.svelte'
	import { useAnalytics } from '#lib/analytics/index.js'
	import { setupViewTransition } from '#lib/utils/index.js'

	import '../app.css'

	useAnalytics()
	setupViewTransition()

	let { children } = $props()
</script>

<LiteYouTubeEmbed />

<div class="min-h-full pt-6">
	<Header />
	<div
		class="mx-auto grid h-full max-w-shell grid-rows-[1fr_auto] gap-6 px-4 min-[1240px]:px-0"
	>
		{@render children?.()}
		<Footer />
	</div>
</div>
