<script lang="ts">
	import Logo from './logo.svelte'
	import Search from './search'
	import Socials from './socials.svelte'
	import Preferences from './preferences/index.svelte'
	import Menu from './menu.svelte'
	import * as config from '#lib/site/config.js'

	let scrollY = $state(0)
	let scrolled = $derived(scrollY > 0)
</script>

<svelte:window bind:scrollY />

<header
	class="sticky top-(--header-offset) z-20 mx-auto w-[90%] max-w-panel rounded-header px-6 py-4 text-lg transition-[background-color,color,box-shadow,backdrop-filter] duration-300 [view-transition-name:header] {scrolled
		? 'bg-header text-primary shadow-md backdrop-blur-header'
		: ''}"
>
	<div class="mx-auto flex max-w-shell justify-between">
		<div class="flex items-center gap-2">
			<Logo />
			<a
				href="/"
				class="[text-box:trim-both_cap_alphabetic] before:content-none"
				>{config.siteName}</a
			>
		</div>

		<Search />
		<Socials />

		<nav class="flex gap-2">
			<Preferences />
			<Menu />
		</nav>
	</div>
</header>
