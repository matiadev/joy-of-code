<script lang="ts">
	import { Cog } from '#lib/icons/index.js'

	import Themes from './themes.svelte'
	import Reading from './reading.svelte'
	import Dyslexic from './dyslexic.svelte'
	import Reset from './reset.svelte'

	let panel: HTMLDivElement | null = $state(null)
	let open = $state(false)

	function handleToggle(e: ToggleEvent) {
		open = e.newState === 'open'
	}
</script>

<button
	popovertarget="preferences-menu"
	aria-expanded={open}
	aria-controls="preferences-menu"
	aria-label="Preferences"
>
	<Cog width={24} height={24} aria-hidden={true} />
</button>

<div
	id="preferences-menu"
	class="menu"
	popover="auto"
	bind:this={panel}
	ontoggle={handleToggle}
>
	<div class="preferences">
		<div class="arrow" aria-hidden="true"></div>
		<span class="title">Preferences</span>
		<div class="options">
			<Themes />
			<Reading />
			<Dyslexic />
			<Reset />
		</div>
	</div>
</div>

<style>
	.menu {
		margin: 0;
		padding: 0;
		color: var(--clr-menu-text);
		background: transparent;
		border: none;
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
	}

	.preferences {
		position: relative;
		padding: var(--spacing-24);
		font-size: var(--font-18);
		color: var(--clr-menu-text);
		background: var(--clr-menu-bg);
		border: 1px solid var(--clr-menu-border);
		border-radius: var(--rounded-20);
		box-shadow: var(--shadow-lg);

		@media (width >= 480px) {
			width: 420px;
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

	/* pre-anchor-positioning browsers: plain fixed panel, arrow hidden */
	@supports not (position-area: bottom center) {
		.menu {
			position: fixed;
			top: 76px;
		}

		.preferences {
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
