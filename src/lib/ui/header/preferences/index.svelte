<script lang="ts">
	import { fade } from 'svelte/transition'
	import { createDropdownMenu, melt } from '@melt-ui/svelte'
	import { Cog } from '#lib/icons/index.js'
	import { sfx } from '#lib/sfx/index.js'

	import Themes from './themes.svelte'
	import Reading from './reading.svelte'
	import Dyslexic from './dyslexic.svelte'
	import Reset from './reset.svelte'

	const {
		elements: { trigger, menu, arrow },
		states: { open },
	} = createDropdownMenu({ arrowSize: 16 })
</script>

<button
	use:melt={$trigger}
	onclick={() => sfx.click()}
	aria-label="Preferences"
>
	<Cog width={24} height={24} aria-hidden={true} />
</button>

{#if open}
	<div class="menu" use:melt={$menu} transition:fade={{ duration: 100 }}>
		<div use:melt={$arrow}></div>
		<div class="preferences">
			<span class="title">Preferences</span>
			<div class="options">
				<Themes />
				<Reading />
				<Dyslexic />
				<Reset />
			</div>
		</div>
	</div>
{/if}

<style>
	.menu {
		position: relative;
		background: var(--clr-menu-bg);
		z-index: 20;

		[data-melt-dropdown-menu-arrow] {
			border-top: 1px solid var(--clr-menu-border);
			border-left: 1px solid var(--clr-menu-border);
		}
	}

	.preferences {
		position: relative;
		padding: var(--spacing-24);
		font-size: var(--font-18);
		background: var(--clr-menu-bg);
		border: 1px solid var(--clr-menu-border);
		border-radius: var(--rounded-20);
		box-shadow: var(--shadow-lg);

		@media (width >= 480px) {
			width: 420px;
		}

		.title {
			display: block;
			padding-bottom: var(--spacing-24);
			font-size: var(--font-24);
			line-height: 32px;
			border-bottom: 1px solid var(--clr-menu-border);
		}

		.options {
			color: var(--clr-menu-text);

			:global {
				> * {
					display: flex;
					justify-content: space-between;
					align-items: center;
					gap: var(--spacing-32);
					padding: var(--spacing-24) 0;

					@media (width >= 480px) {
						gap: var(--spacing-64);
					}
				}

				> *:not(:last-child) {
					border-bottom: 1px solid var(--clr-menu-border);
				}

				> *:last-child {
					padding-bottom: 0;
				}

				span {
					max-width: 180px;
				}
			}
		}
	}
</style>
