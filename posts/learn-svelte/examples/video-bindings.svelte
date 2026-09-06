<script lang="ts">
	let clip =
		'https://5ad4a01a-eb56-49a7-b0a7-a9e4bed9c1aa.mdnplay.dev/shared-assets/videos/flower.webm'
	let currentTime = $state(0)
	let duration = $state(0)
	let paused = $state(true)
</script>

<div class="container">
	<div class="example">
		<!-- svelte-ignore a11y_media_has_caption -->
		<video src={clip} bind:currentTime bind:duration bind:paused></video>

		<div class="controls">
			<button onclick={() => (paused = !paused)}>
				{paused ? '▶️' : '⏸️'}
			</button>
			<span>{currentTime.toFixed(1)}/{duration.toFixed(1)}</span>
			<input type="range" bind:value={currentTime} max={duration} step={0.1} />
		</div>
	</div>
</div>

<style>
	.example {
		width: 500px;

		video {
			margin-bottom: 0.5rem;
			border-radius: 0.5rem;
		}

		.controls {
			display: flex;
			align-items: center;
			gap: 1rem;

			input[type='range'] {
				flex-grow: 1;
			}
		}
	}
</style>
