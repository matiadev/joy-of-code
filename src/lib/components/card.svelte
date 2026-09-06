<script lang="ts">
	import type { Snippet } from 'svelte'

	type Props = {
		children: Snippet
		type: 'danger' | 'info' | 'warning'
	}

	let { children, type }: Props = $props()

	const paths = {
		danger:
			'<circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" />',
		info: '<circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" />',
		warning:
			'<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" /><path d="M12 9v4" /><path d="M12 17h.01" />',
	} as const
</script>

<div class="card {type}">
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		class="icon"
		aria-hidden="true"
	>
		{@html paths[type]}
	</svg>
	{@render children()}
</div>
