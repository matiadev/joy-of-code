<script lang="ts">
	import { Menu } from '#lib/icons/index.js'
	import Popover from '#lib/ui/popover.svelte'
	import * as config from '#lib/site/config.js'
</script>

<Popover id="categories-menu" label="Categories" title="Categories">
	{#snippet trigger()}
		<Menu width={24} height={24} aria-hidden={true} />
	{/snippet}

	<ul
		class="mt-6 grid w-max max-w-full auto-cols-auto grid-flow-col grid-rows-6 gap-x-16 gap-y-6 min-[480px]:grid-rows-4"
	>
		{#each Object.entries(config.categories) as [slug, category]}
			<li>
				<a href="/categories/{slug}" class="text-menu-fg hover:text-primary">
					{category}
				</a>
			</li>
		{/each}
	</ul>
</Popover>
