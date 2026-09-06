<script lang="ts">
	import type { TransitionConfig } from 'svelte/transition'

	const chars = '!@#$%&*1234567890-=_+[]{}|;:,.<>/?'

	function getRandomCharacter() {
		return chars[Math.floor(Math.random() * chars.length)]
	}

	function scrambleText(node: HTMLElement, options?: TransitionConfig) {
		const { duration = 4000 } = options
		const finalText = node.textContent
		const length = finalText.length

		return {
			duration,
			tick: (t: number) => {
				let output = ''
				for (let i = 0; i < length; i++) {
					if (t > i / length) {
						output += finalText[i]
					} else {
						output += getRandomCharacter()
					}
				}
				node.textContent = output
			},
		}
	}

	let play = $state(false)
</script>

<div class="container">
	{#key play}
		<p in:scrambleText>Scrambling Text Effect</p>
	{/key}

	<button onclick={() => (play = !play)}>Scramble text</button>
</div>

<style>
	p {
		font-family: 'JetBrains Mono';
		font-size: 2rem;
	}

	button {
		margin-inline: auto;
		align-self: start;
	}
</style>
