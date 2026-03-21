<script lang="ts">
	type Props = {
		html: string
		loading: boolean
	}

	let { html, loading }: Props = $props()
</script>

<div class="preview-wrap" class:loading>
	{#if loading}
		<div class="spinner" aria-label="Rendering preview..."></div>
	{/if}
	<article class="prose">
		{@html html}
	</article>
</div>

<style>
	.preview-wrap {
		height: 100%;
		overflow-y: auto;
		padding: 24px;
		position: relative;
		transition: opacity 0.15s ease;
	}

	.preview-wrap.loading {
		opacity: 0.5;
	}

	.spinner {
		position: absolute;
		top: 16px;
		right: 16px;
		width: 16px;
		height: 16px;
		border: 2px solid var(--clr-primary);
		border-top-color: transparent;
		border-radius: 50%;
		animation: spin 0.6s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
