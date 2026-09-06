<script lang="ts">
	import { fade } from 'svelte/transition'

	let play = $state(false)
	let replay = $state(false)

	$effect(() => {
		play = true
	})
</script>

<div class="container">
	{#if play}
		{#key replay}
			<div class="items">
				{#each Array(50), i}
					<div in:fade|global={{ delay: i * 100 }}>
						{i + 1}
					</div>
				{/each}
			</div>
		{/key}
	{/if}

	<button onclick={() => (replay = !replay)}>Replay</button>
</div>

<style>
	.items {
		width: 400px;
		display: grid;
		grid-template-columns: repeat(10, 1fr);
		gap: 1rem;
	}

	button {
		margin-top: 2rem;
		margin-inline: auto;
		justify-self: start;
	}
</style>
