<script lang="ts">
	type Props = {
		id: string
		label: string
		unit: string
		min: number
		max: number
		step: number
		value: number
	}

	let { id, label, unit, min, max, step, value = $bindable() }: Props = $props()
</script>

<div
	class="flex w-full items-center justify-between gap-8 py-6 not-last:border-b not-last:border-menu-border min-[480px]:gap-16"
>
	<label for={id} class="max-w-label">{label}</label>
	<div class="grid justify-items-center gap-4">
		<span>{value}{unit}</span>
		<input bind:value type="range" name={id} {id} {min} {max} {step} />
	</div>
</div>

<style>
	input[type='range'] {
		--track-height: 4px;
		--track-color: hsl(0 0% 24%);
		--thumb-size: 16px;
		appearance: none;
		height: var(--track-height);
		background-color: var(--track-color);
		border-radius: var(--radius-2xl);

		&::-webkit-slider-thumb {
			appearance: none;
			width: var(--thumb-size);
			height: var(--thumb-size);
			background-color: var(--color-primary);
			border-radius: 50%;
			box-shadow: var(--shadow-sm);
			cursor: pointer;
		}

		&::-moz-range-thumb {
			appearance: none;
			width: var(--thumb-size);
			height: var(--thumb-size);
			background-color: var(--color-primary);
			border-radius: 50%;
			box-shadow: var(--shadow-sm);
			cursor: pointer;
		}
	}
</style>
