<script lang="ts">
	import Logo from './logo.svelte'
	import Search from './search'
	import Socials from './socials.svelte'
	import Preferences from './preferences/index.svelte'
	import Menu from './menu.svelte'
	import * as config from '$lib/site/config'

	let scrollY = $state(0)
	let fixed = $derived(scrollY > 0)
</script>

<svelte:window bind:scrollY />

<header class:fixed>
	<div class="container">
		<div class="logo">
			<Logo />
			<a href="/">{config.siteName}</a>
		</div>

		<Search />
		<Socials />

		<nav>
			<Preferences />
			<Menu />
		</nav>
	</div>
</header>

<style>
	header {
		width: 90%;
		max-width: 800px;
		margin-inline: auto;
		padding: var(--spacing-16) var(--spacing-24);
		font-size: var(--font-18);
		border-radius: 1rem;
		z-index: 20;
		view-transition-name: header;
		transition:
			background-color 0.3s ease,
			color 0.3s ease;

		&.fixed {
			position: fixed;
			top: 10px;
			left: 50%;
			translate: -50% 0;
			background-color: var(--clr-header-bg);
			color: var(--clr-primary);
			box-shadow: var(--shadow-md);
			box-shadow: 1px 1px 10px hsl(0 0% 0% / 40%);
			backdrop-filter: blur(20px);
		}
	}

	.container {
		max-inline-size: 1200px;
		display: flex;
		justify-content: space-between;

		.logo {
			display: flex;
			align-items: center;
			gap: var(--spacing-8);

			a {
				text-box: trim-both cap alphabetic;
			}

			a::before {
				content: none;
			}
		}

		nav {
			display: flex;
			gap: var(--spacing-8);
		}
	}
</style>
