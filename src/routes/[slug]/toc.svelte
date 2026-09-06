<script lang="ts">
	import { onMount } from 'svelte'
	import { fly } from 'svelte/transition'
	import { ChevronDoubleLeft, ChevronDoubleRight } from '#lib/icons/index.js'

	type TableOfContentsItem = {
		active: boolean
		title: string
		href: string
	}

	const TABLE_OF_CONTENTS = '#table-of-contents + ul'

	let tableOfContents = $state<TableOfContentsItem[]>([])
	let showSidebar = $state(false)

	onMount(() => {
		const toc = document.querySelector(TABLE_OF_CONTENTS) as HTMLUListElement
		if (!toc) return

		tableOfContents = [...toc.querySelectorAll('a')].map((a, i) => ({
			title: a.textContent!,
			href: a.getAttribute('href')!,
			active: false,
		}))

		if (window.innerWidth >= 1440) {
			const observer = new IntersectionObserver(([entry]) => {
				showSidebar = entry.boundingClientRect.bottom < 0
			})
			observer.observe(toc)
			return () => observer.unobserve(toc)
		}
	})

	onMount(() => {
		const headings = document.querySelectorAll('h2')
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					tableOfContents.forEach((i) => (i.active = false))
					const title = entry.target.textContent
					const index = tableOfContents.findIndex((i) => i.title === title)
					if (index >= 0) tableOfContents[index].active = true
				}
			},
			{
				rootMargin: '0px 0px -90% 0px',
			}
		)
		headings.forEach((heading) => observer.observe(heading))
		return () => observer.disconnect()
	})

	function toggleSidebar() {
		showSidebar = !showSidebar
	}
</script>

{#if tableOfContents}
	<aside class="fixed top-1/2 right-2 z-10 max-w-menu -translate-y-1/2">
		<section>
			{#if showSidebar}
				<div
					transition:fly={{ x: '100%', duration: 300 }}
					class="table-of-contents rounded-2xl border border-menu-border bg-footer p-4 shadow-sm"
				>
					<button
						onclick={toggleSidebar}
						aria-label="Hide table of contents"
						class="flex items-center gap-1 py-2"
					>
						<ChevronDoubleRight width={24} height={24} aria-hidden={true} />
						<h2 class="text-2xl">Sections</h2>
					</button>

					<ul class="toc-list max-h-100 overflow-y-auto p-1 pr-4">
						{#each tableOfContents as { active, title, href }}
							<li
								class="py-4 text-lg not-last:border-b not-last:border-menu-border"
							>
								<a
									{href}
									data-active={active}
									class="inline-block text-card-fg hover:text-primary data-[active=true]:text-primary"
								>
									{title}
								</a>
							</li>
						{/each}
					</ul>
				</div>
			{:else}
				<button
					in:fly={{ x: '100%', duration: 300, delay: 300 }}
					onclick={toggleSidebar}
					class="rounded-2xl border border-menu-border bg-footer p-4 shadow-sm"
					aria-label="Show table of contents"
				>
					<ChevronDoubleLeft width={24} height={24} aria-hidden={true} />
				</button>
			{/if}
		</section>
	</aside>
{/if}

<style>
	.table-of-contents {
		counter-reset: section;
	}

	.table-of-contents a::before {
		all: unset;
		counter-increment: section;
		content: counter(section) '. ';
	}

	.toc-list {
		--toc-scroll: 6px;
		scrollbar-width: thin;
		scrollbar-color: var(--color-menu-border) transparent;
	}

	.toc-list::-webkit-scrollbar {
		width: var(--toc-scroll);
	}

	.toc-list::-webkit-scrollbar-thumb {
		background-color: var(--color-menu-border);
		border-radius: var(--radius-pill);
	}
</style>
