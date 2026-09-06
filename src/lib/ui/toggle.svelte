<script lang="ts">
	type Props = {
		labelledby: string
		pressed: boolean
		onclick: () => void
	}

	let { labelledby, pressed, onclick }: Props = $props()
</script>

<button
	type="button"
	{onclick}
	class="toggle"
	aria-labelledby={labelledby}
	aria-pressed={pressed}
>
	<span class="thumb"></span>
</button>

<style>
	.toggle {
		--width: 68px;
		--padding: 10px;
		--height: 36px;

		width: var(--width);
		height: var(--height);
		background-color: var(--color-switch-off);
		border-radius: var(--radius-pill);
		transition: background-color 0.15s ease;

		.thumb {
			--size: 34px;

			display: block;
			width: var(--size);
			height: var(--size);
			background-color: var(--color-primary);
			border-radius: 50%;
			transition: translate 0.15s ease;
		}

		&[aria-pressed='true'] {
			background-color: var(--color-switch-on);

			.thumb {
				translate: calc(var(--width) - var(--size)) 0;
			}
		}
	}
</style>
