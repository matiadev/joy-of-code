<script lang="ts">
	import Heading from '$lib/ui/heading.svelte'
	import Newsletter from '$lib/ui/newsletter.svelte'
</script>

<svelte:head>
	<title>Newsletter</title>
	<meta
		content="Subscribe for updates and tasty web development treats."
		name="description"
	/>
</svelte:head>

<Heading>Newsletter</Heading>

<div class="newsletter">
	<Newsletter />
</div>

<style>
	.newsletter {
		display: grid;
		justify-items: center;

		@media (min-width: 860px) {
			display: grid;
			justify-items: center;
			margin-bottom: var(--spacing-128);
		}
	}
</style>
