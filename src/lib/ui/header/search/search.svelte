<script lang="ts">
	import { onNavigate } from '$app/navigation'
	import { browser } from '$app/env'
	import SearchIcon from './search-icon.svelte'
	import SearchWorker from './search-worker?worker'
	import type { Result } from './search'

	let panel: HTMLDivElement | null = $state(null)
	let open = $state(false)
	let inputEl: HTMLInputElement | null = $state(null)

	const platform = browser && window.navigator.platform
	let search: 'idle' | 'load' | 'ready' = $state('idle')
	let searchTerm = $state('')
	let results: Result[] = $state([])
	let searchWorker: Worker | undefined = $state()

	function initialize() {
		if (search === 'idle') {
			search = 'load'
			searchWorker = new SearchWorker()
			searchWorker.addEventListener('message', (e) => {
				const { type, payload } = e.data
				type === 'ready' && (search = 'ready')
				type === 'results' && (results = payload.results)
			})
			searchWorker.postMessage({ type: 'load' })
		}
	}

	function handleToggle(e: ToggleEvent) {
		open = e.newState === 'open'
		if (open) inputEl?.focus()
	}

	function close() {
		panel?.hidePopover()
	}

	onNavigate(({ shallow }) => {
		if (shallow) return

		close()
	})

	$effect(() => {
		if (search === 'ready') {
			searchWorker?.postMessage({ type: 'search', payload: { searchTerm } })
		}
	})

	$effect(() => {
		if (searchTerm && !open) {
			searchTerm = ''
		}
	})

	$effect(() => {
		if (!browser) return
		document.body.style.overflow = open ? 'hidden' : ''
	})
</script>

<svelte:window
	onkeydown={(e) => {
		if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
			e.preventDefault()
			if (open) close()
			else {
				initialize()
				panel?.showPopover()
			}
		}
	}}
/>

<button
	popovertarget="search-panel"
	aria-expanded={open}
	aria-controls="search-panel"
	onclick={initialize}
	class="flex items-center gap-2 rounded-2xl border border-search-border bg-search px-4 py-2 text-search-fg transition-colors duration-300 hover:text-primary"
>
	<SearchIcon />
	<span class="hidden min-[600px]:block">Search</span>
	<div class="hidden min-[600px]:block">
		<kbd
			class="rounded border border-search-kbd-border bg-search-kbd px-2 py-1 text-search-kbd-fg"
			>{platform === 'MacIntel' ? '⌘' : 'Ctrl'}</kbd
		>
		+
		<kbd
			class="rounded border border-search-kbd-border bg-search-kbd px-2 py-1 text-search-kbd-fg"
			>K</kbd
		>
	</div>
</button>

<div
	id="search-panel"
	class="panel"
	popover="auto"
	bind:this={panel}
	ontoggle={handleToggle}
	role="dialog"
	aria-modal="true"
	aria-label="Search"
>
	<div class="overflow-hidden rounded shadow-2xl">
		<input
			bind:this={inputEl}
			bind:value={searchTerm}
			placeholder="Search"
			autocomplete="off"
			spellcheck="false"
			type="search"
			class="w-full bg-search-input p-4 text-search-input-fg"
		/>
		{#if results.length > 0}
			<div class="max-h-(--results-cap) overflow-y-auto bg-search-results p-4">
				{#if search === 'load'}
					<p>Loading...</p>
				{/if}

				<ul>
					{#each results as result}
						{#if result.content.length > 0}
							<li
								class="not-last:mb-4 not-last:border-b not-last:border-results not-last:pb-4"
							>
								<a href="/{result.slug}" onclick={close} class="block text-2xl"
									>{@html result.title}</a
								>
								<ol class="mt-2">
									{#each result.content as content}
										<li>{@html content}</li>
									{/each}
								</ol>
							</li>
						{/if}
					{/each}
				</ul>
			</div>
		{/if}
	</div>
</div>

<style>
	.panel {
		--panel-width: 90vw;
		--panel-top: 20vh;
		--panel-max: calc(80vh - 32px);
		--backdrop-color: hsl(0 0% 0% / 80%);
		--backdrop-hidden: hsl(0 0% 0% / 0%);
		--backdrop-blur: 4px;
		margin: 0;
		padding: 0;
		border: none;
		background: transparent;
		width: var(--panel-width);
		max-width: var(--container-narrow);
		overflow: visible;

		/* top anchored modal in the top layer, grows downward so the input stays put */
		position: fixed;
		inset: 0;
		margin: var(--panel-top) auto auto;
		height: fit-content;
		max-height: var(--panel-max);

		/* top layer entry and exit animation */
		opacity: 0;
		scale: 0.96;
		transition:
			opacity 0.2s ease,
			scale 0.2s ease,
			display 0.2s allow-discrete,
			overlay 0.2s allow-discrete;
	}

	.panel:popover-open {
		opacity: 1;
		scale: 1;

		@starting-style {
			opacity: 0;
			scale: 0.96;
		}
	}

	.panel::backdrop {
		background-color: var(--backdrop-color);
		backdrop-filter: blur(var(--backdrop-blur));
		transition:
			display 0.2s allow-discrete,
			overlay 0.2s allow-discrete,
			background-color 0.2s ease,
			backdrop-filter 0.2s ease;
	}

	.panel:popover-open::backdrop {
		@starting-style {
			background-color: var(--backdrop-hidden);
			backdrop-filter: blur(0);
		}
	}

	:global(mark) {
		background-color: var(--color-primary);
	}

	@media (prefers-reduced-motion: reduce) {
		.panel {
			scale: 1;
			transition-duration: 0.1s;
		}
	}
</style>
