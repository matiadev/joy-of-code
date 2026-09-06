<script lang="ts">
	import { preferences } from './preferences.svelte'
</script>

<div class="flex items-center justify-between gap-8 pt-6 min-[480px]:gap-16">
	<span>Use default settings</span>
	<button
		onclick={() => preferences.reset()}
		class="rounded bg-primary px-4 py-2 font-bold text-theme-fg shadow-sm"
	>
		Reset
	</button>
</div>
