<script lang="ts">
	import type { Snippet } from 'svelte'

	type Props = {
		children: Snippet
		type: 'danger' | 'info' | 'warning'
	}

	let { children, type }: Props = $props()
</script>

{#if type === 'danger'}
	<div class="card danger">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="icon"
		>
			<circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" />
			<path d="m9 9 6 6" />
		</svg>
		{@render children()}
	</div>
{/if}

{#if type === 'info'}
	<div class="card info">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="icon"
		>
			<circle cx="12" cy="12" r="10" /><path d="M12 16v-4" />
			<path d="M12 8h.01" />
		</svg>
		{@render children()}
	</div>
{/if}

{#if type === 'warning'}
	<div class="card warning">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="icon"
		>
			<path
				d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"
			/>
			<path d="M12 9v4" />
			<path d="M12 17h.01" />
		</svg>
		{@render children()}
	</div>
{/if}

<style>
	.card {
		position: relative;
		margin-block-end: var(--spacing-32);
		padding: var(--spacing-32);
		background: none;
		border: 4px solid var(--border-color, #fff);
		border-radius: var(--rounded-20, #fff);

		.icon {
			width: 48px;
			height: 48px;
			padding: var(--spacing-4);
			position: absolute;
			left: 0px;
			top: 0px;
			translate: -50% -50%;
			color: var(--icon-color);
			background: var(--clr-bg);
		}

		&.info {
			--icon-color: #00b5ff;
			--border-color: #00b5ff;
		}

		&.warning {
			--icon-color: #f6ff00;
			--border-color: #f6ff00;
		}

		&.danger {
			--icon-color: #ff0000;
			--border-color: #ff0000;
		}
	}
</style>
