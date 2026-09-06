<script lang="ts">
	import { browser } from '$app/env'
	import Toggle from '#lib/ui/toggle.svelte'
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

<div
	class="flex w-full items-center justify-between gap-8 py-6 not-last:border-b not-last:border-menu-border min-[480px]:gap-16"
>
	<span id="dyslexic-label">Use font for dyslexia</span>
	<Toggle
		labelledby="dyslexic-label"
		pressed={enabled}
		onclick={handleChange}
	/>
</div>
