<script lang="ts">
	import { onMount } from 'svelte'

	let animation: window.gsap.core.Tween

	onMount(() => {
		animation = window.gsap.to('.box', { rotation: 180, x: 100, duration: 1 })
	})
</script>

<div class="container">
	<div class="box"></div>
	<button onclick={() => animation.restart()}>Replay</button>
</div>

<style>
	.box {
		width: 100px;
		height: 100px;
		background-color: orangered;
		border-radius: 1rem;
	}

	button {
		margin-top: 2rem;
	}
</style>
