<script lang="ts">
	let text = $state('I love Svelte')

	function toSpongeBobCase(text: string) {
		return text
			.split('')
			.map((c, i) => (i % 2 === 1 ? c.toUpperCase() : c.toLowerCase()))
			.join('')
	}
</script>

<div class="container">
	<textarea
		value={toSpongeBobCase(text)}
		oninput={(e) => {
			text = toSpongeBobCase((e.target as HTMLInputElement).value)
		}}></textarea>
</div>

<style>
	textarea {
		width: 600px;
		height: 300px;
		padding: var(--spacing-16);
		border-radius: var(--rounded-4);
	}
</style>
