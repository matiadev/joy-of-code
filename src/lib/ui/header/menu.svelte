<script lang="ts">
	import { fade } from 'svelte/transition'
	import { createDropdownMenu, melt } from '@melt-ui/svelte'
	import { Menu } from '#lib/icons/index.js'
	import { sfx } from '#lib/sfx/index.js'
	import * as config from '#lib/site/config.js'

	const {
		elements: { trigger, menu, item, arrow },
		states: { open },
	} = createDropdownMenu({ arrowSize: 16 })
</script>

<button use:melt={$trigger} onclick={() => sfx.click()} aria-label="Categories">
	<Menu width={24} height={24} aria-hidden={true} />
</button>

{#if open}
	<div class="menu" use:melt={$menu} transition:fade={{ duration: 100 }}>
		<div use:melt={$arrow}></div>
		<span class="title">Categories</span>
		<ul>
			{#each Object.entries(config.categories) as [slug, category]}
				<li use:melt={$item}>
					<a href="/categories/{slug}">{category}</a>
				</li>
			{/each}
		</ul>
	</div>
{/if}

<style>
	.menu {
		position: relative;
		padding: var(--spacing-24);
		font-size: var(--font-18);
		background: var(--clr-menu-bg);
		border: 1px solid var(--clr-menu-border);
		border-radius: var(--rounded-20);
		box-shadow: var(--shadow-lg);
		z-index: 20;

		[data-melt-dropdown-menu-arrow] {
			border-top: 1px solid var(--clr-menu-border);
			border-left: 1px solid var(--clr-menu-border);
		}

		.title {
			display: block;
			padding-bottom: var(--spacing-24);
			font-size: var(--font-24);
			line-height: 32px;
			border-bottom: 1px solid var(--clr-menu-border);
		}

		a {
			font-weight: inherit;
			color: var(--clr-menu-text);

			&:hover {
				color: var(--clr-primary);
			}
		}

		ul {
			display: grid;
			grid-template-rows: repeat(6, 1fr);
			row-gap: var(--spacing-24);
			column-gap: var(--spacing-64);
			grid-auto-flow: column;
			margin-top: var(--spacing-24);

			@media (width >= 480px) {
				grid-template-rows: repeat(4, 1fr);
			}
		}
	}
</style>
