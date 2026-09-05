<script lang="ts">
	import { Menu } from '#lib/icons/index.js'
	import { sfx } from '#lib/sfx/index.js'
	import * as config from '#lib/site/config.js'

	let panel: HTMLDivElement | null = $state(null)
	let open = $state(false)

	function handleToggle(e: ToggleEvent) {
		open = e.newState === 'open'
	}

	function close() {
		panel?.hidePopover()
	}
</script>

<button
	popovertarget="categories-menu"
	aria-expanded={open}
	aria-controls="categories-menu"
	aria-label="Categories"
	onclick={() => sfx.click()}
>
	<Menu width={24} height={24} aria-hidden={true} />
</button>

<div
	id="categories-menu"
	class="menu"
	popover="auto"
	bind:this={panel}
	ontoggle={handleToggle}
>
	<div class="arrow" aria-hidden="true"></div>
	<span class="title">Categories</span>
	<ul>
		{#each Object.entries(config.categories) as [slug, category]}
			<li>
				<a href="/categories/{slug}" onclick={close}>{category}</a>
			</li>
		{/each}
	</ul>
</div>

<style>
	.menu {
		margin: 0;
		padding: var(--spacing-24);
		font-size: var(--font-18);
		color: var(--clr-menu-text);
		background: var(--clr-menu-bg);
		border: 1px solid var(--clr-menu-border);
		border-radius: var(--rounded-20);
		box-shadow: var(--shadow-lg);
		max-width: calc(100vw - 32px);
		overflow: visible;

		inset: auto;
		position-area: bottom center;
		margin-top: 12px;

		/* top-layer entry/exit animation */
		opacity: 0;
		scale: 0.98;
		transition:
			opacity 0.15s ease,
			scale 0.15s ease,
			display 0.15s allow-discrete,
			overlay 0.15s allow-discrete;

		&:popover-open {
			opacity: 1;
			scale: 1;

			@starting-style {
				opacity: 0;
				scale: 0.98;
			}
		}

		.arrow {
			position: absolute;
			top: -8px;
			left: 50%;
			translate: -50% 0;
			width: 16px;
			height: 16px;
			background: var(--clr-menu-bg);
			border-top: 1px solid var(--clr-menu-border);
			border-left: 1px solid var(--clr-menu-border);
			rotate: 45deg;
		}
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

	/* pre-anchor-positioning browsers: plain fixed panel, arrow hidden */
	@supports not (position-area: bottom center) {
		.menu {
			position: fixed;
			top: 76px;

			.arrow {
				display: none;
			}
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.menu {
			scale: 1;
			transition-duration: 0.1s;
		}
	}
</style>
