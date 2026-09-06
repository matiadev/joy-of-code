<script lang="ts">
	import SliderRow from '#lib/ui/slider-row.svelte'
	import { preferences } from './preferences.svelte'
</script>

<div class="not-last:border-b not-last:border-menu-border">
	<SliderRow
		id="text-size"
		label="Reading size"
		unit="px"
		min={16}
		max={24}
		step={2}
		bind:value={preferences.textSize}
	/>
	<SliderRow
		id="text-length"
		label="Reading length"
		unit="ch"
		min={60}
		max={100}
		step={10}
		bind:value={preferences.textLength}
	/>
	<SliderRow
		id="text-height"
		label="Reading line height"
		unit="px"
		min={32}
		max={48}
		step={8}
		bind:value={preferences.textHeight}
	/>
</div>
