<script lang="ts">
	import { browser } from '$app/env'
	import { preferences } from './preferences.svelte'

	type Themes = { name: keyof typeof themes }

	function getTheme() {
		if (!browser) return

		const html = document.documentElement
		const userTheme: Themes['name'] = localStorage.theme
		const prefersDarkMode = window.matchMedia(
			'prefers-color-scheme: dark'
		).matches
		const prefersLightMode = window.matchMedia(
			'prefers-color-scheme: light'
		).matches

		// check if the user set a theme
		if (userTheme) {
			html.dataset.theme = userTheme
			return themes[userTheme]
		}

		// otherwise check for user preference
		if (!userTheme && prefersDarkMode) {
			html.dataset.theme = '🌛 Night'
			localStorage.theme = '🌛 Night'
		}
		if (!userTheme && prefersLightMode) {
			html.dataset.theme = '☀️ Daylight'
			localStorage.theme = '☀️ Daylight'
		}

		// if nothing is set default to dark mode
		if (!userTheme && !prefersDarkMode && !prefersLightMode) {
			html.dataset.theme = '🌛 Night'
			localStorage.theme = '🌛 Night'
		}

		return themes[userTheme]
	}

	function updateTheme(theme: string) {
		if (!browser || !theme) return
		const htmlElement = document.documentElement
		htmlElement.dataset.theme = theme
		localStorage.theme = theme
	}

	const themes = {
		'🌛 Night': { name: '🌛 Night' },
		'☀️ Daylight': { name: '☀️ Daylight' },
		'🐺 Night Howl': { name: '🐺 Night Howl' },
		'🧠 Night Mind': { name: '🧠 Night Mind' },
	} as const

	const selectedTheme = getTheme() ?? themes['🌛 Night']

	let current: Themes['name'] = $state(selectedTheme.name)

	function handleChange(e: Event) {
		current = (e.currentTarget as HTMLSelectElement).value as Themes['name']
		updateTheme(current)
	}

	let lastReset = preferences.resetTheme

	$effect(() => {
		if (preferences.resetTheme !== lastReset) {
			lastReset = preferences.resetTheme
			current = '🌛 Night'
			updateTheme(current)
		}
	})
</script>

<div class="select">
	<label for="theme-select">Theme</label>
	<select
		id="theme-select"
		class="trigger"
		aria-label="Theme"
		bind:value={current}
		onchange={handleChange}
	>
		{#each Object.entries(themes) as [key, theme] (key)}
			<option value={theme.name}>{theme.name}</option>
		{/each}
	</select>
</div>

<style>
	.trigger {
		background-color: var(--clr-primary);
		color: var(--clr-theme-txt);
		border-radius: var(--rounded-4);
		box-shadow: var(--shadow-sm);
	}

	.trigger {
		width: 180px;
		padding: var(--spacing-16) var(--spacing-24);
		font-weight: 700;
	}
</style>
