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
	class="open-search"
>
	<SearchIcon />
	<span>Search</span>
	<div class="shortcut">
		<kbd>{platform === 'MacIntel' ? '⌘' : 'Ctrl'}</kbd> + <kbd>K</kbd>
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
	<div class="content">
		<input
			bind:this={inputEl}
			bind:value={searchTerm}
			placeholder="Search"
			autocomplete="off"
			spellcheck="false"
			type="search"
		/>
		{#if results.length > 0}
			<div class="results">
				{#if search === 'load'}
					<p>Loading...</p>
				{/if}

				<ul>
					{#each results as result}
						{#if result.content.length > 0}
							<li>
								<a href="/{result.slug}" onclick={close}>{@html result.title}</a
								>
								<ol>
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
		margin: 0;
		padding: 0;
		border: none;
		background: transparent;
		width: 90vw;
		max-width: 600px;
		overflow: visible;

		/* centered modal in the top layer */
		position: fixed;
		inset: 0;
		margin: auto;
		height: fit-content;
		max-height: calc(100vh - 32px);

		/* top-layer entry/exit animation */
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
		background-color: hsl(0 0% 0% / 80%);
		backdrop-filter: blur(4px);
		transition:
			display 0.2s allow-discrete,
			overlay 0.2s allow-discrete,
			background-color 0.2s ease,
			backdrop-filter 0.2s ease;
	}

	.panel:popover-open::backdrop {
		@starting-style {
			background-color: hsl(0 0% 0% / 0%);
			backdrop-filter: blur(0px);
		}
	}

	.content {
		border-radius: var(--rounded-4);
		box-shadow: 0px 0px 20px hsl(0 0% 0% / 40%);
		overflow: hidden;

		input {
			width: 100%;
			padding: var(--spacing-16);
			color: var(--clr-search-input-txt);
			background-color: var(--clr-search-input-bg);

			&:focus {
				box-shadow: none;
				border-radius: 0px;
			}
		}
	}

	.results {
		max-height: 60vh;
		padding: var(--spacing-16);
		background-color: var(--clr-search-results-bg);
		overflow-y: auto;
		scrollbar-width: thin;

		ol {
			margin-block-start: var(--spacing-8);
		}

		li:not(:last-child) {
			margin-block-end: var(--spacing-16);
			padding-block-end: var(--spacing-16);
			border-bottom: 1px solid var(--clr-results-border);
		}

		a {
			display: block;
			font-size: var(--font-24);
		}

		:global(mark) {
			background-color: var(--clr-primary);
		}
	}

	.open-search {
		display: flex;
		align-items: center;
		gap: var(--spacing-8);
		padding: var(--spacing-8) var(--spacing-16);
		color: var(--clr-search-txt);
		background-color: var(--clr-search-bg);
		border: 1px solid var(--clr-search-border);
		border-radius: var(--rounded-20);
		transition: color 0.3s ease;

		&:hover {
			color: var(--clr-primary);
		}

		span,
		.shortcut {
			display: none;

			@media (width >= 600px) {
				display: block;
			}
		}

		kbd {
			padding: 4px 8px;
			color: var(--clr-search-kbd-txt);
			background-color: var(--clr-search-kbd-bg);
			border: 1px solid var(--clr-search-kbd-border);
			border-radius: var(--rounded-4);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.panel {
			scale: 1;
			transition-duration: 0.1s;
		}
	}
</style>
