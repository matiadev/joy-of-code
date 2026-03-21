<script lang="ts">
	import { fade } from 'svelte/transition'

	let overlay = $state(false)

	$effect(() => {
		const headingElement = document.querySelector('h1')
		if (!headingElement) return

		const options = {
			root: null,
			rootMargin: '0px',
			threshold: 0, // invoke when element is not visible
		}

		const observer = new IntersectionObserver(([entry]) => {
			!entry.isIntersecting ? (overlay = true) : (overlay = false)
		})
		observer.observe(headingElement)

		return () => observer.unobserve(headingElement)
	})
</script>

{#if overlay}
	<div transition:fade={{ duration: 300 }} class="overlay"></div>
{/if}

<style>
	.overlay {
		position: fixed;
		inset: 0;
		background-image: var(--post-overlay-bg);
		backdrop-filter: blur(20px);
		z-index: -1;
	}
</style>
