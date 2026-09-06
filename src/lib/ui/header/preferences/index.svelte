<script lang="ts">
	import { Cog } from '#lib/icons/index.js'
	import Popover from '#lib/ui/popover.svelte'

	import Themes from './themes.svelte'
	import Reading from './reading.svelte'
	import Dyslexic from './dyslexic.svelte'
	import Reset from './reset.svelte'
</script>

<Popover
	id="preferences-menu"
	label="Preferences"
	title="Preferences"
	panelClass="w-105 max-w-[calc(100vw-32px)]"
>
	{#snippet trigger()}
		<Cog width={24} height={24} aria-hidden={true} />
	{/snippet}

	<div class="grid text-menu-fg">
		<Themes />
		<Reading />
		<Dyslexic />
		<Reset />
	</div>
</Popover>
