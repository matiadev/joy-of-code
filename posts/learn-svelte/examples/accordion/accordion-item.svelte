<script lang="ts">
	import type { Snippet } from 'svelte'
	import { slide } from 'svelte/transition'

	interface Props {
		title: string
		children: Snippet
	}

	let { title, children }: Props = $props()

	let open = $state(false)

	function toggle() {
		open = !open
	}
</script>

<div class="accordion-item">
	<button onclick={toggle} class="accordion-heading">
		<div>{title}</div>
		<div class="accordion-trigger" class:open>👈️</div>
	</button>

	{#if open}
		<div transition:slide class="accordion-content">
			{@render children?.()}
		</div>
	{/if}
</div>

<style>
	.accordion-item {
		&:not(:last-child) {
			margin-bottom: 1.5rem;
		}

		.accordion-heading {
			display: flex;
			gap: 2rem;
			padding: 0px;
			border: none;
		}

		.accordion-trigger {
			transition: rotate 0.2s ease;

			&.open {
				rotate: -90deg;
			}
		}

		.accordion-content {
			margin-top: 0.5rem;
		}
	}
</style>
