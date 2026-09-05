<script lang="ts">
	import { browser } from '$app/env'
	import { preferences } from './preferences.svelte'

	let enabled = $state(false)

	if (browser) {
		enabled = Boolean(localStorage.font)
	}

	function handleChange() {
		const html = document.documentElement

		enabled = !enabled

		if (enabled) {
			localStorage.font = 'dyslexic'
			html.dataset.font = 'dyslexic'
		}

		if (!enabled) {
			localStorage.removeItem('font')
			delete html.dataset.font
		}
	}

	let lastReset = preferences.resetTheme

	$effect(() => {
		if (preferences.resetTheme !== lastReset) {
			lastReset = preferences.resetTheme
			enabled = false
		}
	})
</script>

<form>
	<div class="container">
		<span id="dyslexic-label">Use font for dyslexia</span>

		<button
			type="button"
			onclick={handleChange}
			class="toggle"
			aria-labelledby="dyslexic-label"
			aria-pressed={enabled}
		>
			<span class="thumb"></span>
		</button>
	</div>
</form>

<style>
	.container {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.toggle {
		--width: 68px;
		--padding: 10px;
		--background: var(--clr-switch-off-bg);

		width: var(--width);
		height: 36px;
		background-color: var(--background);
		border-radius: 9999px;
		transition: background-color 0.15s ease;

		.thumb {
			--size: 34px;

			display: block;
			width: var(--size);
			height: var(--size);
			background-color: var(--clr-primary);
			border-radius: 50%;
			transition: translate 0.15s ease;
		}

		&[aria-pressed='true'] {
			--background: var(--clr-switch-on-bg);

			.thumb {
				translate: calc(var(--width) - var(--size)) 0px;
			}
		}
	}
</style>
