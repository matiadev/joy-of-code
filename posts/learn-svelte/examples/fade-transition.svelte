<script lang="ts">
	import { fade } from 'svelte/transition'

	let play = $state(false)

	$effect(() => {
		play = true
	})

	setInterval(() => (play = !play), 2000)
</script>

<div class="container">
	{#if play}
		<div class="message">
			<span transition:fade={{ duration: 600 }}>Hello</span>
			<span transition:fade={{ delay: 600 }}>World</span>
		</div>
	{/if}
</div>

<style>
	.message {
		font-size: 3rem;
	}
</style>
