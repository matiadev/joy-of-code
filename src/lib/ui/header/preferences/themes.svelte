<script lang="ts">
	import { browser } from '$app/env'
	import { preferences } from './preferences.svelte'

	type Theme = 'light' | 'dark'

	function getTheme(): Theme {
		if (!browser) return 'dark'
		if (localStorage.theme === 'light' || localStorage.theme === 'dark') {
			return localStorage.theme
		}
		return document.documentElement.classList.contains('dark')
			? 'dark'
			: 'light'
	}

	function setTheme(next: Theme) {
		theme = next
		if (!browser) return
		document.documentElement.classList.toggle('dark', next === 'dark')
		localStorage.theme = next
	}

	let theme = $state<Theme>(getTheme())

	let lastReset = preferences.resetTheme

	$effect(() => {
		if (preferences.resetTheme !== lastReset) {
			lastReset = preferences.resetTheme
			const dark = browser && matchMedia('(prefers-color-scheme: dark)').matches
			setTheme(dark ? 'dark' : 'light')
		}
	})
</script>

<div
	class="flex items-center justify-between gap-8 py-6 not-last:border-b not-last:border-menu-border min-[480px]:gap-16"
>
	<span id="theme-label">Theme</span>
	<div
		role="group"
		aria-labelledby="theme-label"
		class="grid grid-cols-2 gap-1 rounded border border-menu-border p-1"
	>
		<button
			type="button"
			aria-pressed={theme === 'light'}
			onclick={() => setTheme('light')}
			class="rounded px-4 py-2 font-bold aria-pressed:bg-primary aria-pressed:text-theme-fg"
		>
			Light
		</button>
		<button
			type="button"
			aria-pressed={theme === 'dark'}
			onclick={() => setTheme('dark')}
			class="rounded px-4 py-2 font-bold aria-pressed:bg-primary aria-pressed:text-theme-fg"
		>
			Dark
		</button>
	</div>
</div>
