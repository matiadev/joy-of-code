<script lang="ts">
	import { createDialog, melt } from '@melt-ui/svelte'
	import { fade } from 'svelte/transition'
	import { onNavigate } from '$app/navigation'
	import { browser } from '$app/env'
	import SearchIcon from './search-icon.svelte'
	import SearchWorker from './search-worker?worker'
	import type { Result } from './search'

	const {
		elements: { trigger, portalled, overlay, content },
		states: { open },
	} = createDialog()

	const platform = browser && window.navigator.platform
	let search: 'idle' | 'load' | 'ready' = $state('idle')
	let searchTerm = $state('')
	let results: Result[] = $state([])
	let searchWorker: Worker | undefined = $state()

	function initialize() {
		if (search === 'ready') return
		search = 'load'
		searchWorker = new SearchWorker()
		searchWorker.addEventListener('message', (e) => {
			const { type, payload } = e.data
			type === 'ready' && (search = 'ready')
			type === 'results' && (results = payload.results)
		})
		searchWorker.postMessage({ type: 'load' })
	}

	onNavigate(({ shallow }) => {
		if (shallow) return

		$open = false
	})

	$effect(() => {
		if (search === 'ready') {
			searchWorker?.postMessage({ type: 'search', payload: { searchTerm } })
		}
	})

	$effect(() => {
		if (searchTerm && !$open) {
			searchTerm = ''
		}
	})
</script>

<svelte:window
	onkeydown={(e) => {
		if (e.ctrlKey || e.metaKey) {
			if (e.key === 'k' || e.key === 'K') {
				e.preventDefault()
				if (search === 'idle') initialize()
				$open = !$open
			}
		}
	}}
/>

<button use:melt={$trigger} onclick={initialize} class="open-search">
	<SearchIcon />
	<span>Search</span>
	<div class="shortcut">
		<kbd>{platform === 'MacIntel' ? '⌘' : 'Ctrl'}</kbd> + <kbd>K</kbd>
	</div>
</button>

<div use:melt={$portalled}>
	{#if $open}
		<div in:fade={{ duration: 200 }} use:melt={$overlay} class="overlay"></div>
		<div use:melt={$content} class="content">
			<input
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
									<a href="/{result.slug}">{@html result.title}</a>
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
	{/if}
</div>

<style>
	.overlay {
		position: fixed;
		inset: 0px;
		background-color: hsl(0 0% 0% / 80%);
		backdrop-filter: blur(4px);
		z-index: 30;
	}

	.content {
		width: 90vw;
		max-width: 600px;
		position: fixed;
		left: 50%;
		top: 20%;
		translate: -50% -0%;
		border-radius: var(--rounded-4);
		box-shadow: 0px 0px 20px hsl(0 0% 0% / 40%);
		overflow: hidden;
		z-index: 40;

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
</style>
