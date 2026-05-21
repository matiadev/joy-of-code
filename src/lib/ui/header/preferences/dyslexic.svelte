<script lang="ts">
	import { browser } from '$app/environment'
	import { createSwitch, melt } from '@melt-ui/svelte'
	import { preferences } from './preferences.svelte'

	let enabled = false

	if (browser) {
		localStorage.font ? (enabled = true) : (enabled = false)
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

	const {
		elements: { root, input },
		states: { checked },
	} = createSwitch()

	$effect(() => {
		preferences.resetTheme
		checked.set(false)
		enabled = false
	})
</script>

<form>
	<div class="container">
		<label for="dyslexic-font">Use font for dyslexia</label>

		<button
			onclick={handleChange}
			use:melt={$root}
			class="toggle"
			aria-labelledby="dyslexic-font"
		>
			<span class="thumb"></span>
		</button>

		<input use:melt={$input} use:input id="dyslexic-font" />
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

		&[data-state='checked'] {
			--background: var(--clr-switch-on-bg);

			.thumb {
				translate: calc(var(--width) - var(--size)) 0px;
			}
		}
	}
</style>
