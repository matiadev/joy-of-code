<script lang="ts">
	import { page } from '$app/stores'
</script>

<div class="error">
	<h1>{$page.status}: {$page?.error?.message}</h1>
</div>

<style>
	.error {
		height: 100%;
		display: grid;
		place-content: center;

		h1 {
			margin-top: var(--spacing-64);
			font-family: var(--font-sans);
			font-size: var(--font-32);
			text-align: center;
			text-transform: none;
		}
	}
</style>
