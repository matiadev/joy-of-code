<script lang="ts">
	import { elasticOut } from 'svelte/easing'
	import type { TransitionConfig } from 'svelte/transition'

	function customTransition(node: HTMLElement, options?: TransitionConfig) {
		const { duration = 2000, delay = 0, easing = elasticOut } = options

		return {
			duration,
			delay,
			easing,
			css: (t: number) => `
				color: hsl(${360 * t} , 100%, 80%);
				transform: scale(${t});
			`,
		}
	}

	let play = $state(false)
	let replay = $state(false)

	$effect(() => {
		play = true
	})
</script>

<div class="container">
	{#if play}
		{#key replay}
			<div in:customTransition class="text">Whoooo!</div>
		{/key}
	{/if}

	<button onclick={() => (replay = !replay)}>Replay</button>
</div>

<style>
	.text {
		font-size: 3rem;
	}

	button {
		margin-inline: auto;
		justify-self: start;
		margin-top: 2rem;
	}
</style>
