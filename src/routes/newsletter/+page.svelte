<script lang="ts">
	import Heading from '#lib/ui/heading.svelte'
	import Newsletter from '#lib/ui/newsletter.svelte'
</script>

<svelte:head>
	<title>Newsletter</title>
	<meta
		content="Subscribe for updates and tasty web development treats."
		name="description"
	/>
</svelte:head>

<Heading>Newsletter</Heading>

<div class="grid justify-items-center min-[860px]:mb-32">
	<Newsletter />
</div>
